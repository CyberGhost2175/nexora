"use client";

import { useState } from "react";
import type { Dictionary } from "@/lib/i18n";

export function FaqSection({ dict }: { dict: Dictionary }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      className="a4-page border-b border-outline-variant/20 py-section-gap"
      id="faq"
    >
      <div className="mx-auto mb-16 max-w-2xl text-center">
        <h2 className="mb-4 text-headline-lg">{dict.faq.title}</h2>
        <p className="text-body-lg text-on-surface-variant">
          {dict.faq.subtitle}
        </p>
      </div>

      <div className="mx-auto max-w-3xl space-y-4">
        {dict.faq.items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.question}
              className="glass-card overflow-hidden rounded-2xl"
            >
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-8"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                <span className="text-body-lg font-semibold text-on-surface">
                  {item.question}
                </span>
                <span
                  className={`material-symbols-outlined shrink-0 text-primary-container transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  expand_more
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <p className="border-t border-outline-variant/20 px-6 pb-6 pt-4 text-body-md leading-relaxed text-on-surface-variant sm:px-8">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
