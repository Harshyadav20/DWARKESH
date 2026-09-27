import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck, Check, MessageCircle } from 'lucide-react';
import { buttonStyles } from '@/components/ui/button';
import { appointmentHref, whatsappHref } from '@/lib/links';
import { clinic } from '@/lib/site';
import { cn } from '@/lib/utils';
import type { ServiceItem, SiteSettings } from '@/lib/types';

/**
 * Alternating feature block used for the dedicated diagnostic sections
 * (Digital X-Ray, Sonography, ECG, Pathology).
 */
export function DiagnosticFeature({
  service,
  settings,
  reverse = false,
  id,
}: {
  service: ServiceItem;
  settings: SiteSettings;
  reverse?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id ?? service.slug}
      className={cn(
        'grid scroll-mt-28 items-center gap-8 lg:grid-cols-2 lg:gap-14',
        reverse && 'lg:[&>*:first-child]:order-2',
      )}
    >
      <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-brand-900/10">
        {service.image && (
          <Image
            src={service.image}
            alt={`${service.name} at ${clinic.legalName}, Malad East, Mumbai`}
            width={1000}
            height={700}
            sizes="(max-width: 1023px) 100vw, 46vw"
            className="h-[260px] w-full object-cover transition-transform duration-500 hover:scale-[1.03] sm:h-[340px]"
          />
        )}
      </div>

      <div>
        <p className="text-2xs font-bold uppercase tracking-[0.18em] text-brand-700">
          {service.department}
        </p>
        <h3 className="mt-2 font-display text-2xl font-extrabold tracking-tight text-brand-950 sm:text-3xl">
          {service.name}
        </h3>
        <p className="mt-4 text-[0.975rem] leading-relaxed text-ink-600">
          {service.description ?? service.shortDescription}
        </p>

        {service.points && service.points.length > 0 && (
          <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {service.points.map((point) => (
              <li key={point} className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-700 ring-1 ring-leaf-100">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium text-brand-900">{point}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href={appointmentHref({ department: service.department, service: service.name })}
            className={buttonStyles({ variant: 'primary', size: 'md' })}
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            {service.ctaLabel ?? 'Book / Enquire'}
          </Link>
          {settings.whatsappEnabled && (
            <a
              href={whatsappHref(
                `Hello ${clinic.legalName}, I would like to enquire about ${service.name}.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: 'outline', size: 'md' })}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Enquire
            </a>
          )}
          <Link
            href={`/diagnostics/${service.slug}`}
            className={buttonStyles({ variant: 'ghost', size: 'md' })}
          >
            More details
          </Link>
        </div>
      </div>
    </div>
  );
}
