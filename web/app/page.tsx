import { CalendarDays, TrendingUp, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Faq from "@/components/Faq";
import WaitlistForm from "@/components/WaitlistForm";

const whySoloPilot: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: "AI Content Planner",
    description: "Plan a month of content in minutes.",
    icon: CalendarDays,
  },
  {
    title: "AI Workflow Manager",
    description: "Keep track of ideas, tasks, and publishing schedules.",
    icon: Workflow,
  },
  {
    title: "AI Growth Assistant",
    description: "Get AI-powered suggestions to grow faster.",
    icon: TrendingUp,
  },
];

const features = [
  {
    title: "Plan content",
    description:
      "Map your content calendar, spot gaps, and stay consistent across every platform — without the spreadsheet chaos.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M4.5 8.25h15M5.25 21h13.5a1.5 1.5 0 0 0 1.5-1.5V7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5Z"
        />
      </svg>
    ),
  },
  {
    title: "Generate scripts",
    description:
      "Turn ideas into polished scripts in minutes. Hooks, outlines, and full drafts tuned to your voice and audience.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 7.125 16.862 4.487M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
        />
      </svg>
    ),
  },
  {
    title: "Track performance",
    description:
      "See what's working at a glance. Connect insights to your next move and grow with data, not guesswork.",
    icon: (
      <svg
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
        />
      </svg>
    ),
  },
];

export default function Home() {

  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      {/* Background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.25),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      {/* Header */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 ring-1 ring-indigo-400/30">
            <svg
              className="h-5 w-5 text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">SoloPilot</span>
        </div>
        <span className="text-sm text-zinc-500">
          by{" "}
          <span className="font-medium text-zinc-400">AIBuilder</span>
        </span>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero */}
        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-20 pt-12 text-center sm:px-8 sm:pb-28 sm:pt-16">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs text-zinc-400 backdrop-blur-sm sm:px-4 sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            AI Chief of Staff for Content Creators
          </div>

          <h1 className="max-w-4xl text-[2rem] font-bold leading-[1.15] tracking-tight text-white sm:text-5xl md:text-6xl md:leading-[1.1]">
            Stop running your content business
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              like a one-person army
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 sm:mt-6 sm:text-lg md:text-xl">
            SoloPilot is your AI Chief of Staff — it plans your calendar,
            drafts scripts in your voice, and tracks what&apos;s working so you
            can focus on creating, not coordinating.
          </p>

          <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:mt-10 sm:max-w-none sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:gap-4">
            <a
              href="#waitlist"
              className="inline-flex h-12 w-full items-center justify-center rounded-full bg-indigo-500 px-8 text-sm font-semibold text-white shadow-[0_0_40px_-8px_rgba(99,102,241,0.6)] transition-all hover:bg-indigo-400 hover:shadow-[0_0_50px_-8px_rgba(99,102,241,0.8)] sm:min-w-[180px] sm:w-auto"
            >
              Join the Waitlist
            </a>
            <a
              href="#features"
              className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 text-sm font-medium text-zinc-300 backdrop-blur-sm transition-colors hover:border-white/20 hover:bg-white/10 sm:min-w-[180px] sm:w-auto"
            >
              See How It Works
            </a>
          </div>
        </section>

        {/* Why SoloPilot */}
        <section
          id="why-solopilot"
          className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24"
        >
          <div className="mb-10 text-center sm:mb-12">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Why SoloPilot?
            </h2>
            <p className="mt-3 text-sm text-zinc-400 sm:text-base">
              Three AI roles that replace the team you don&apos;t have yet.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {whySoloPilot.map(({ title, description, icon: Icon }) => (
              <article
                key={title}
                className="group relative rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/30 hover:bg-white/[0.05] hover:shadow-[0_8px_30px_-12px_rgba(99,102,241,0.4)] sm:p-8"
              >
                <div className="mb-5 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400 ring-1 ring-indigo-400/20 transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-500/15 group-hover:text-indigo-300 group-hover:ring-indigo-400/40">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8 sm:pb-32"
        >
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Everything you need to scale solo
            </h2>
            <p className="mt-3 text-zinc-400">
              One AI-powered workspace for your entire content workflow.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group relative rounded-2xl border border-white/8 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors hover:border-indigo-500/30 hover:bg-white/[0.05] sm:p-8"
              >
                <div className="mb-5 inline-flex rounded-xl bg-indigo-500/10 p-3 text-indigo-400 ring-1 ring-indigo-400/20 transition-colors group-hover:bg-indigo-500/15 group-hover:text-indigo-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <Faq />

        {/* Waitlist CTA */}
        <section
          id="waitlist"
          className="mx-auto w-full max-w-6xl px-6 pb-24 sm:px-8"
        >
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-transparent to-cyan-500/10 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.15),transparent_60%)]"
              aria-hidden
            />
            <h2 className="relative text-2xl font-semibold text-white sm:text-3xl">
              Be first in line
            </h2>
            <p className="relative mx-auto mt-3 max-w-lg text-zinc-400">
              Join the waitlist for early access to SoloPilot. We&apos;re
              building in public and shipping fast.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/8 px-6 py-8 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} SoloPilot · A product of{" "}
            <span className="text-zinc-400">AIBuilder</span>
          </p>
          <p className="text-sm text-zinc-600">
            Built for creators who do it all.
          </p>
        </div>
      </footer>
    </div>
  );
}
