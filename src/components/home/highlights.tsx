import { Activity, Clock, FlaskConical, ScanLine } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { FaqAccordion } from '@/components/faq/faq-accordion';
import { faqs } from '@/lib/data/faq';
import type { SiteSettings } from '@/lib/types';

const highlights = [
  {
    icon: ScanLine,
    title: 'Digital imaging',
    text: 'Digital X-Ray and digital mammography at the centre.',
  },
  {
    icon: Activity,
    title: 'Cardiac tests',
    text: 'ECG and 2D Echo as advised by your doctor.',
  },
  {
    icon: FlaskConical,
    title: 'Pathology',
    text: 'Blood tests, thyroid, lipid profile, liver and kidney function tests.',
  },
  {
    icon: Clock,
    title: 'One visit',
    text: 'Consultation and investigations completed in the same location.',
  },
];

/**
 * Healthcare / diagnostic highlights plus the FAQ block (which also carries
 * FAQPage structured data — rendered by the page itself).
 */
export function Highlights({ settings }: { settings: SiteSettings }) {
  return (
    <section
      id="highlights"
      aria-labelledby="highlights-heading"
      className="scroll-mt-24 bg-brand-50/60 py-16 sm:py-20 lg:py-24"
    >
      <div className="container">
        <SectionHeading
          id="highlights-heading"
          eyebrow="Healthcare Highlights"
          title="What patients can complete at the centre"
          description="Consultation, diagnostic tests and dental care in one place in Malad East — with home visits when travelling is difficult."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item) => (
            <li key={item.title} className="card p-6 text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-display text-base font-bold text-brand-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{item.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-start">
          <div>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Questions patients often ask"
              description="Practical information about the centre, timings, diagnostics and home visits."
              className="mt-0"
            />
            <p className="mt-4 text-sm leading-relaxed text-ink-600">
              Anything not covered here? Call the centre on{' '}
              <a
                href={`tel:+91${settings.emergencyPhone}`}
                className="link-underline font-semibold"
              >
                {settings.emergencyPhone.replace(/(\d{5})(\d{5})/, '$1 $2')}
              </a>{' '}
              and our team will guide you.
            </p>
          </div>
          <FaqAccordion items={faqs} />
        </div>
      </div>
    </section>
  );
}
