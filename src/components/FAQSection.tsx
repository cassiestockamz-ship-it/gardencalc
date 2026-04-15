"use client";

import { useState } from "react";

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  /** Preferred prop name going forward */
  items?: FAQItem[];
  /** Legacy prop name used by existing calculator pages */
  questions?: FAQItem[];
  /** Hide the internal "Frequently Asked Questions" heading */
  hideHeading?: boolean;
  /** Emit SpeakableSpecification alongside FAQPage schema */
  includeSpeakable?: boolean;
}

export default function FAQSection({
  items,
  questions,
  hideHeading = false,
  includeSpeakable = false,
}: Props) {
  const entries = items ?? questions ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(includeSpeakable && {
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["[data-speakable-question]", "[data-speakable-answer]"],
      },
    }),
    mainEntity: entries.map((q) => ({
      "@type": "Question",
      name: q.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.answer,
      },
    })),
  };

  return (
    <div className={hideHeading ? "" : "mt-10"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {!hideHeading && (
        <h2 className="mb-5 font-display text-xl font-bold text-[var(--color-text)]">
          Common questions
        </h2>
      )}
      <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {entries.map((q, i) => (
          <div key={i}>
            <button
              onClick={() => toggle(i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--color-primary-soft)]"
              aria-expanded={openIndex === i}
            >
              <span
                className="font-display text-sm font-semibold text-[var(--color-text)] sm:text-base"
                data-speakable-question={includeSpeakable ? "" : undefined}
              >
                {q.question}
              </span>
              <span className="flex-shrink-0 text-xl font-medium text-[var(--color-text-muted)]">
                {openIndex === i ? "\u2212" : "+"}
              </span>
            </button>
            {openIndex === i && (
              <div className="px-5 pb-4">
                <p
                  className="text-sm leading-relaxed text-[var(--color-text-muted)]"
                  data-speakable-answer={includeSpeakable ? "" : undefined}
                >
                  {q.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
