import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { buttonStyles } from '@/components/ui/button';
import { appointmentHref } from '@/lib/links';
import { resolveIcon } from '@/lib/icons';
import type { ServiceItem } from '@/lib/types';

/**
 * Diagnostic service card with photography, used on the home page and
 * /diagnostics. The Book/Enquire link pre-fills the appointment form with the
 * department and service so the clinic knows exactly what the patient needs.
 */
export function DiagnosticCard({
  service,
  showSameDay,
  priority = false,
}: {
  service: ServiceItem;
  showSameDay?: boolean;
  priority?: boolean;
}) {
  const Icon = resolveIcon(service.icon);

  return (
    <article className="card group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-brand-50">
        {service.image ? (
          <Image
            src={service.image}
            alt={`${service.name} service at Dwarkesh Medical Centre LLP, Malad East, Mumbai`}
            fill
            priority={priority}
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Icon className="h-12 w-12 text-brand-300" aria-hidden="true" />
          </div>
        )}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/60 via-brand-950/5 to-transparent"
        />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/95 text-brand-700 shadow-card">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          {showSameDay && service.sameDayResults && (
            <span className="rounded-full bg-leaf-500/95 px-2.5 py-1 text-2xs font-bold uppercase tracking-[0.1em] text-white">
              Same day results
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-lg font-bold tracking-tight text-brand-950">
          <Link
            href={`/diagnostics/${service.slug}`}
            className="rounded transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
          >
            {service.name}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{service.shortDescription}</p>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <Link
            href={appointmentHref({ department: service.department, service: service.name })}
            className={buttonStyles({ variant: 'primary', size: 'sm' })}
          >
            {service.ctaLabel ?? 'Book / Enquire'}
          </Link>
          <Link
            href={`/diagnostics/${service.slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-ink-600 transition-colors hover:text-brand-700"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
