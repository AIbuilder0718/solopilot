"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !trimmedEmail.includes("@")) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const { error } = await supabase
      .from("waitlist")
      .insert({ email: trimmedEmail });

    setIsLoading(false);

    if (error) {
      if (error.code === "23505") {
        setMessage("This email is already on the waitlist.");
        return;
      }

      console.error(error);
      setMessage("Something went wrong. Please try again.");
      return;
    }

    setMessage("You're on the waitlist!");
    setEmail("");
  }

  return (
    <div className="relative mx-auto mt-8 w-full max-w-xl">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          disabled={isLoading}
          required
          className="h-12 flex-1 rounded-full border border-white/10 bg-white/5 px-5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-indigo-400/60 focus:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="h-12 rounded-full bg-white px-7 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? "Joining..." : "Join the Waitlist"}
        </button>
      </form>

      {message && <p className="mt-3 text-sm text-zinc-400">{message}</p>}
    </div>
  );
}