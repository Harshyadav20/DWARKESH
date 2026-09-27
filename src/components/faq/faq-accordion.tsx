'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export type FaqEntry = { question: string; answer: string };

/**
 * Accessible FAQ accordion (native <button> + aria-expanded / aria-controls).
 * Only one panel is open at a time so the section stays scannable.
 */
export function FaqAccordion({ items }: { items: FaqEntry[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-brand-900/8 overflow-hidden rounded-2xl border border-brand-900/8 bg-white shadow-card">
      {items.map((item, index) => {
        const expanded = open === index;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : index)}
                aria-expanded={expanded}
                aria-controls={`faq-panel-${index}`}
                id={`faq-trigger-${index}`}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-brand-50/60 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 sm:px-6"
              >
                <span className="font-display text-[0.975rem] font-bold text-brand-950">
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-brand-600 transition-transform duration-200',
                    expanded && 'rotate-180',
                  )}
                  aria-hidden="true"
                />
              </button>
            </h3>
            <div
              id={`faq-panel-${index}`}
              role="region"
              aria-labelledby={`faq-trigger-${index}`}
              hidden={!expanded}
              className="px-5 pb-5 sm:px-6"
            >
              <p className="text-sm leading-relaxed text-ink-600">{item.answer}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
