import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck, Check, ChevronRight, Clock, MessageCircle, Phone } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
import { DiagnosticCard } from '@/components/cards/diagnostic-card';
import { ServiceCard } from '@/components/cards/service-card';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { buttonStyles } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { appointmentHref, callHref, whatsappHref } from '@/lib/links';
import { breadcrumbJsonLd, serviceUrl } from '@/lib/seo';
import { address, clinic, contact } from '@/lib/site';
import { resolveIcon } from '@/lib/icons';
import type { ServiceItem, SiteSettings } from '@/lib/types';

/**
 * Shared body for a single-service page (/services/[slug] and /diagnostics/[slug]).
 */
export function ServiceDetail({
  service,
  related,
  settings,
  crumbParent,
}: {
  service: ServiceItem;
  related: ServiceItem[];
  settings: SiteSettings;
  crumbParent: { name: string; href: string };
}) {
  const Icon = resolveIcon(service.icon);
  const isDiagnostic = service.group === 'diagnostic';

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
        <div aria-hidden="true" className="bg-grid mask-fade-b absolute inset-0 opacity-70" />
        <div className="container relative py-12 sm:py-14">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink-500">
              <li>
                <Link href="/" className="rounded transition-colors hover:text-brand-700">
                  Home
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 text-ink-300" aria-hidden="true" />
              <li>
                <Link href={crumbParent.href} className="rounded transition-colors hover:text-brand-700">
                  {crumbParent.name}
                </Link>
              </li>
              <ChevronRight className="h-3 w-3 text-ink-300" aria-hidden="true" />
              <li>
                <span aria-current="page" className="text-brand-800">
                  {service.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
            <div>
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-700 text-white shadow-card">
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>

              <h1 className="mt-5 font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-brand-950 sm:text-[2.6rem]">
                {service.name}
              </h1>

              <p className="mt-4 max-w-2xl text-[0.975rem] leading-relaxed text-ink-600 sm:text-lg">
                {service.description ?? service.shortDescription}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-2xs font-bold uppercase tracking-[0.12em] text-brand-800 ring-1 ring-brand-100">
                  {service.department}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1.5 text-2xs font-bold uppercase tracking-[0.12em] text-ink-600 ring-1 ring-ink-100">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {settings.openDays}: {settings.clinicHours}
                </span>
                {settings.showSameDayResults && service.sameDayResults && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf-50 px-3 py-1.5 text-2xs font-bold uppercase tracking-[0.12em] text-leaf-800 ring-1 ring-leaf-100">
                    Same day results
                  </span>
                )}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={appointmentHref({ department: service.department, service: service.name })}
                  className={buttonStyles({ variant: 'primary', size: 'lg' })}
                >
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  {service.ctaLabel ?? 'Book Appointment'}
                </Link>
                <a href={callHref} className={buttonStyles({ variant: 'outline', size: 'lg' })}>
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Call {contact.phoneDisplay}
                </a>
                {settings.whatsappEnabled && (
                  <a
                    href={whatsappHref(
                      `Hello ${clinic.legalName}, I would like to enquire about ${service.name}.`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonStyles({ variant: 'whatsapp', size: 'lg' })}
                  >
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
                    Enquire on WhatsApp
                  </a>
                )}
              </div>
            </div>

            {service.image && (
              <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-brand-900/10">
                <Image
                  src={service.image}
                  alt={`${service.name} at ${clinic.legalName}, ${address.locality}, ${address.city}`}
                  width={1000}
                  height={760}
                  priority
                  sizes="(max-width: 1023px) 100vw, 46vw"
                  className="h-[280px] w-full object-cover sm:h-[380px]"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {service.points && service.points.length > 0 && (
        <section aria-labelledby="service-points" className="bg-white py-14 sm:py-16">
          <div className="container grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHeading
                id="service-points"
                align="left"
                eyebrow="What is included"
                title={`${service.name} at the centre`}
                className="mt-0"
              />
              <p className="mt-5 text-[0.975rem] leading-relaxed text-ink-600">
                {isDiagnostic
                  ? 'Investigations are carried out as advised by your doctor. Please call the centre if you would like guidance on preparing for this test.'
                  : 'Our team will explain the process, answer your questions and help you plan the next step.'}
              </p>
              <p className="mt-4 rounded-2xl border border-brand-900/8 bg-brand-50/60 p-4 text-sm leading-relaxed text-ink-700">
                {settings.showSameDayResults && service.sameDayResults
                  ? `${settings.diagnosticTagline || 'Accurate reports at affordable rates.'} Report availability depends on the specific test — the centre confirms timelines when you book.`
                  : 'Report and result timelines are confirmed by the centre when you book, as they depend on the specific test.'}
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-2">
              {service.points.map((point) => (
                <li
                  key={point}
                  className="card flex items-start gap-3 p-4 transition-colors hover:border-brand-200"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-700 ring-1 ring-leaf-100">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold leading-snug text-brand-950">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section
          aria-labelledby="related-services"
          className="bg-brand-50/60 py-16 sm:py-20"
        >
          <div className="container">
            <SectionHeading
              id="related-services"
              eyebrow="Related"
              title={isDiagnostic ? 'Other diagnostic services' : 'Other services at the centre'}
              description="Everything below is available at the same address in Malad East."
            />
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 6).map((item) =>
                isDiagnostic ? (
                  <div key={item.id} className="rounded-2xl bg-white shadow-card">
                    <DiagnosticCard service={item} showSameDay={settings.showSameDayResults} />
                  </div>
                ) : (
                  <ServiceCard key={item.id} service={item} />
                ),
              )}
            </div>
            <div className="mt-9 flex justify-center">
              <Link
                href={isDiagnostic ? '/diagnostics' : '/services'}
                className={buttonStyles({ variant: 'outline', size: 'md' })}
              >
                View all {isDiagnostic ? 'diagnostic' : 'medical'} services
              </Link>
            </div>
          </div>
        </section>
      )}

      <EmergencyCta settings={settings} />

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: crumbParent.name, path: crumbParent.href },
          { name: service.name, path: serviceUrl(service) },
        ])}
      />
    </>
  );
}
