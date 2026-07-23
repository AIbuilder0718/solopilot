"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What is SoloPilot?",
    answer: "SoloPilot is an AI Chief of Staff that helps content creators plan, create, and manage their workflow.",
  },
  {
    question: "Who is it for?",
    answer: "Solo creators, YouTubers, coaches, educators and anyone building a content business.",
  },
  {
    question: "When will it launch?",
    answer: "We're building in public. Join the waitlist for early access.",
  },
  {
    question: "Is there a free plan?",
    answer: "Yes. SoloPilot will launch with a generous free plan.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto w-full max-w-4xl px-6 pb-24 sm:px-8">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-semibold text-white">
          Frequently Asked Questions
        </h2>
        <p className="mt-3 text-zinc-400">
          Everything you need to know before joining.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={faq.question}
            className="rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            <button
              className="flex w-full items-center justify-between p-6 text-left"
              onClick={() => setOpen(open === index ? null : index)}
            >
              <span className="font-medium text-white">
                {faq.question}
              </span>

              <ChevronDown
                className={`transition-transform ${
                  open === index ? "rotate-180" : ""
                }`}
              />
            </button>

            {open === index && (
              <div className="px-6 pb-6 text-zinc-400">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}