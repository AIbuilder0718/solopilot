"use client";

import { useState } from "react";

export default function DashboardPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("Beginner");
  const [length, setLength] = useState("3 minutes");

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl p-6 md:p-10">
        <div className="mb-10">
          <p className="text-sm font-medium text-violet-400">SoloPilot</p>
          <h1 className="mt-2 text-4xl font-bold">Content Dashboard</h1>
          <p className="mt-3 text-zinc-400">
            Turn one idea into a structured YouTube script.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-xl font-semibold">Script settings</h2>

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
              disabled={!topic.trim()}
              className="mt-6 w-full rounded-xl bg-violet-500 px-4 py-3 font-semibold text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Generate script
            </button>
          </section>

          <section className="min-h-[520px] rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Generated script</h2>
              <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
                {audience} · {length}
              </span>
            </div>

            <div className="mt-8 flex min-h-[390px] items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-950/50 p-8 text-center">
              <div>
                <p className="text-lg font-medium text-zinc-300">
                  Your script will appear here
                </p>
                <p className="mt-2 max-w-md text-sm leading-6 text-zinc-500">
                  Enter a topic, select the audience and video length, then
                  generate a structured hook, body, and call to action.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}