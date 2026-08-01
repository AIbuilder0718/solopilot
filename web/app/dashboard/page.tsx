"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type ContentMode = "standard" | "faceless";

type SavedScript = {
  id: string;
  topic: string;
  audience: string | null;
  video_length: string | null;
  content: string | null;
  created_at: string;
};

const CONTENT_MODE_LABELS: Record<ContentMode, string> = {
  standard: "Standard",
  faceless: "Faceless",
};

function toErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (typeof error === "object" && error !== null && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}

function normalizeSavedScripts(data: unknown): SavedScript[] {
  if (!Array.isArray(data)) {
    return [];
  }

  const scripts: SavedScript[] = [];

  for (const row of data) {
    if (typeof row !== "object" || row === null) {
      continue;
    }

    const record = row as Record<string, unknown>;
    const id = record.id;
    const topic = record.topic;
    const createdAt = record.created_at;

    if (
      (typeof id !== "string" && typeof id !== "number") ||
      typeof topic !== "string" ||
      typeof createdAt !== "string"
    ) {
      continue;
    }

    scripts.push({
      id: String(id),
      topic,
      audience: typeof record.audience === "string" ? record.audience : null,
      video_length:
        typeof record.video_length === "string" ? record.video_length : null,
      content: typeof record.content === "string" ? record.content : null,
      created_at: createdAt,
    });
  }

  return scripts;
}

export default function DashboardPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Beginner");
  const [length, setLength] = useState("3 minutes");
  const [contentMode, setContentMode] = useState<ContentMode>("standard");
  const [script, setScript] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [isLoadingScripts, setIsLoadingScripts] = useState(true);
  const [scriptsError, setScriptsError] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchSavedScripts(
    userId: string,
    options?: { ignoreIfCancelled?: () => boolean }
  ) {
    const shouldIgnore = () => options?.ignoreIfCancelled?.() ?? false;

    if (!shouldIgnore()) {
      setIsLoadingScripts(true);
      setScriptsError("");
    }

    try {
      const { data, error } = await supabase
        .from("scripts")
        .select("id, topic, audience, video_length, content, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch saved scripts error:", error);
        throw new Error(
          error.message || "Failed to load saved scripts from Supabase."
        );
      }

      if (shouldIgnore()) {
        return;
      }

      setScripts(normalizeSavedScripts(data));
    } catch (error) {
      console.error("Fetch saved scripts error:", error);

      if (shouldIgnore()) {
        return;
      }

      setScriptsError(
        toErrorMessage(error, "Failed to load saved scripts.")
      );
      setScripts([]);
    } finally {
      if (!shouldIgnore()) {
        setIsLoadingScripts(false);
      }
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function initializeAuthAndFetchScripts() {
      if (!cancelled) {
        setIsLoadingScripts(true);
        setScriptsError("");
      }

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Get session error:", sessionError);
          throw sessionError;
        }

        let activeSession = session;

        if (!activeSession) {
          const { data, error: signInError } =
            await supabase.auth.signInAnonymously();

          if (signInError) {
            console.error("Anonymous sign-in error:", signInError);
            throw signInError;
          }

          activeSession = data.session;

          if (!activeSession) {
            const {
              data: { session: refreshedSession },
              error: refreshError,
            } = await supabase.auth.getSession();

            if (refreshError) {
              console.error("Refresh session error:", refreshError);
              throw refreshError;
            }

            activeSession = refreshedSession;
          }
        }

        if (!activeSession?.user) {
          throw new Error("Unable to establish a user session.");
        }

        // Only fetch after a final user session is available.
        // Existing sessions and newly created anonymous sessions both reach here.
        await fetchSavedScripts(activeSession.user.id, {
          ignoreIfCancelled: () => cancelled,
        });
      } catch (error) {
        console.error("Dashboard auth/init error:", error);

        if (cancelled) {
          return;
        }

        const message = toErrorMessage(
          error,
          "Failed to initialize user session."
        );
        setError(message);
        setScriptsError(message);
        setIsLoadingScripts(false);
      }
    }

    initializeAuthAndFetchScripts();

    return () => {
      cancelled = true;
    };
  }, []);

  async function generateScript() {
    if (!topic.trim()) return;

    setIsLoading(true);
    setScript("");
    setError("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          audience,
          length,
          contentMode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate script.");
      }

      setScript(data.script);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function copyScript() {
    if (!script) return;

    try {
      await navigator.clipboard.writeText(script);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setError("스크립트를 복사하지 못했습니다.");
    }
  }

  async function saveScript() {
    if (!script) return;

    setIsSaving(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
      }

      const { error } = await supabase.from("scripts").insert({
        user_id: user.id,
        topic,
        audience,
        video_length: length,
        content: script,
      });

      if (error) {
        console.error("Save script error:", error);
        throw error;
      }

      alert("대본이 저장되었습니다.");
      await fetchSavedScripts(user.id);
    } catch (error) {
      console.error("Save script error:", error);
      setError(toErrorMessage(error, "대본 저장에 실패했습니다."));
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteScript(id: string) {
    const confirmed = window.confirm("이 대본을 삭제하시겠습니까?");
    if (!confirmed) return;

    setDeletingId(id);
    setScriptsError("");

    try {
      const { error } = await supabase.from("scripts").delete().eq("id", id);

      if (error) {
        console.error("Delete script error:", error);
        throw error;
      }

      setScripts((prev) => prev.filter((item) => item.id !== id));

      if (expandedId === id) {
        setExpandedId(null);
      }
    } catch (error) {
      console.error("Delete script error:", error);
      setScriptsError(toErrorMessage(error, "대본 삭제에 실패했습니다."));
    } finally {
      setDeletingId(null);
    }
  }

  function formatCreatedAt(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-violet-400">SoloPilot</p>

          <h1 className="mt-2 text-4xl font-bold">
            Content Dashboard
          </h1>

          <p className="mt-3 text-zinc-400">
            Turn one idea into a structured YouTube script.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-semibold">
              Script settings
            </h2>

            <div className="mt-6">
              <label className="mb-2 block text-sm text-zinc-300">
                Video topic
              </label>

              <textarea
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="Example: How solo creators can use AI to save 10 hours a week"
                className="min-h-32 w-full resize-none rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm outline-none placeholder:text-zinc-600 focus:border-violet-500"
              />
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-zinc-300">
                Content format
              </label>

              <div className="grid grid-cols-2 gap-2 rounded-xl border border-zinc-700 bg-zinc-950 p-1">
                <button
                  type="button"
                  onClick={() => setContentMode("standard")}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    contentMode === "standard"
                      ? "bg-violet-500 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Standard script
                </button>

                <button
                  type="button"
                  onClick={() => setContentMode("faceless")}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    contentMode === "faceless"
                      ? "bg-violet-500 text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Faceless content
                </button>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-zinc-300">
                Target audience
              </label>

              <select
                value={audience}
                onChange={(event) => setAudience(event.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none focus:border-violet-500"
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Expert</option>
              </select>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm text-zinc-300">
                Video length
              </label>

              <select
                value={length}
                onChange={(event) => setLength(event.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 p-3 text-sm outline-none focus:border-violet-500"
              >
                <option>30 seconds</option>
                <option>3 minutes</option>
                <option>10 minutes</option>
              </select>
            </div>

            <button
              type="button"
              onClick={generateScript}
              disabled={!topic.trim() || isLoading}
              className="mt-6 w-full rounded-xl bg-violet-500 px-4 py-3 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLoading ? "Generating..." : "Generate script"}
            </button>
          </section>

          <section className="min-h-[520px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-xl font-semibold">
                Generated script
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                {script && (
                  <button
                    type="button"
                    onClick={copyScript}
                    className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-violet-500 hover:text-white"
                  >
                    {copied ? "Copied!" : "Copy script"}
                  </button>
                )}

                {script && (
                  <button
                    type="button"
                    onClick={saveScript}
                    disabled={isSaving}
                    className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-violet-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save script"}
                  </button>
                )}

                <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                  {audience} · {length} · {CONTENT_MODE_LABELS[contentMode]}
                </span>
              </div>
            </div>

            <div className="mt-8 min-h-[390px] rounded-xl border border-zinc-700 bg-zinc-950/50 p-6">
              {isLoading && (
                <div className="flex min-h-[340px] items-center justify-center text-zinc-400">
                  SoloPilot is writing your script...
                </div>
              )}

              {!isLoading && error && (
                <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                  {error}
                </div>
              )}

              {!isLoading && script && (
                <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">
                  {script}
                </div>
              )}

              {!isLoading && !script && !error && (
                <div className="flex min-h-[340px] items-center justify-center text-center">
                  <div>
                    <p className="text-lg font-medium text-zinc-300">
                      Your script will appear here
                    </p>

                    <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                      Enter a topic, select the audience and video length,
                      then generate a structured hook, body, and call to action.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <div>
            <h2 className="text-xl font-semibold">Saved scripts</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Scripts saved to your current account.
            </p>
          </div>

          <div className="mt-6">
            {isLoadingScripts && (
              <div className="rounded-xl border border-zinc-700 bg-zinc-950/50 px-4 py-10 text-center text-sm text-zinc-400">
                Loading saved scripts...
              </div>
            )}

            {!isLoadingScripts && scriptsError && (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                {scriptsError}
              </div>
            )}

            {!isLoadingScripts && !scriptsError && scripts.length === 0 && (
              <div className="rounded-xl border border-zinc-700 bg-zinc-950/50 px-4 py-10 text-center">
                <p className="text-sm font-medium text-zinc-300">
                  No saved scripts yet.
                </p>
              </div>
            )}

            {!isLoadingScripts && !scriptsError && scripts.length > 0 && (
              <ul className="space-y-3">
                {scripts.map((item) => {
                  const isExpanded = expandedId === item.id;
                  const metaParts = [
                    item.audience,
                    item.video_length,
                    formatCreatedAt(item.created_at),
                  ].filter((value): value is string => Boolean(value));

                  return (
                    <li
                      key={item.id}
                      className="rounded-xl border border-zinc-700 bg-zinc-950/50"
                    >
                      <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedId(isExpanded ? null : item.id)
                          }
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="truncate text-sm font-medium text-zinc-100">
                            {item.topic || "Untitled script"}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {metaParts.join(" · ")}
                          </p>
                        </button>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedId(isExpanded ? null : item.id)
                            }
                            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition hover:border-violet-500 hover:text-white"
                          >
                            {isExpanded ? "접기" : "열기"}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteScript(item.id)}
                            disabled={deletingId === item.id}
                            className="rounded-lg border border-zinc-700 px-3 py-2 text-sm text-red-300 transition hover:border-red-500 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === item.id ? "삭제 중..." : "삭제"}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="border-t border-zinc-800 px-4 py-4">
                          <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-200">
                            {item.content || "No script content."}
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
