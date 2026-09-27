import Link from 'next/link';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { DiagnosticCard } from '@/components/cards/diagnostic-card';
import { buttonStyles } from '@/components/ui/button';
import { servicesByGroup } from '@/lib/store';
import type { ServiceItem } from '@/lib/types';

export function DiagnosticsPreview({
  services,
  settings,
}: {
  services: ServiceItem[];
  settings: { showSameDayResults: boolean; diagnosticTagline: string };
}) {
  const list = servicesByGroup(services, 'diagnostic');

  if (list.length === 0) return null;

  return (
    <section
      id="diagnostics"
      aria-labelledby="diagnostics-heading"
      className="relative scroll-mt-24 overflow-hidden bg-brand-950 py-16 sm:py-20 lg:py-24"
    >
      <div aria-hidden="true" className="bg-grid absolute inset-0 opacity-[0.07]" />
      <div className="container relative">
        <SectionHeading
          id="diagnostics-heading"
          tone="dark"
          eyebrow="Diagnostics"
          title="Advanced diagnostic services"
          description="Imaging, cardiac and laboratory investigations at the centre, so consultation and testing can happen in one visit."
        />

        {settings.diagnosticTagline && (
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-sm font-semibold text-brand-100">
            <BadgeCheck className="h-4 w-4 text-leaf-300" aria-hidden="true" />
            {settings.diagnosticTagline.split('|').map((part, index, all) => (
              <span key={part.trim()} className="flex items-center gap-3">
                {part.trim()}
                {index < all.length - 1 && (
                  <span aria-hidden="true" className="text-brand-500">
                    ·
                  </span>
                )}
              </span>
            ))}
          </p>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((service, index) => (
            <Reveal key={service.id} delay={Math.min(index, 5) * 50} className="h-full">
              <div className="rounded-2xl bg-white shadow-card">
                <DiagnosticCard
                  service={service}
                  showSameDay={settings.showSameDayResults}
                  priority={index < 3}
                />
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/diagnostics" className={buttonStyles({ variant: 'light', size: 'md' })}>
            All diagnostic services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/book-appointment?department=Diagnostics"
            className={buttonStyles({ variant: 'call', size: 'md' })}
          >
            Book a diagnostic appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
