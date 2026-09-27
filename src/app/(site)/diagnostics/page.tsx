import type { Metadata } from 'next';
import Link from 'next/link';
import { BadgeCheck, Info, Phone } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { DiagnosticCard } from '@/components/cards/diagnostic-card';
import { DiagnosticFeature } from '@/components/diagnostics/diagnostic-feature';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { AppointmentSection } from '@/components/appointment/appointment-section';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { JsonLd } from '@/components/seo/json-ld';
import { buttonStyles } from '@/components/ui/button';
import { buildMetadata, breadcrumbJsonLd, servicesJsonLd } from '@/lib/seo';
import { address, clinic, contact } from '@/lib/site';
import { callHref } from '@/lib/links';
import { findService, getContent, servicesByGroup } from '@/lib/store';

export const metadata: Metadata = buildMetadata({
  title: 'Diagnostic Services',
  description: `Advanced diagnostic services at ${clinic.legalName}, ${address.locality}, ${address.city} — Digital X-Ray, 2D Echo, Digital Mammography, ECG, sonography, blood tests and pathology.`,
  path: '/diagnostics',
  keywords: [
    'diagnostic centre in Malad East',
    'digital X-ray Malad East',
    'sonography Malad East',
    'ECG Malad East',
    '2D echo Malad East',
    'blood test Malad East',
    'pathology lab Malad East',
    'mammography Malad East',
  ],
  image: '/images/diagnostic-digital-xray.jpg',
});

/** Dedicated feature sections requested for the diagnostics page. */
const featureSlugs = ['digital-x-ray', 'sonography-ultrasound', 'ecg', 'pathology-blood-test'];

export default async function DiagnosticsPage() {
  const { settings, doctors, services } = await getContent();
  const diagnostics = servicesByGroup(services, 'diagnostic');
  const features = featureSlugs
    .map((slug) => findService(services, slug))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const taglineParts = settings.diagnosticTagline
    .split('|')
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => settings.showSameDayResults || !/same\s*day/i.test(part));

  return (
    <>
      <PageHero
        eyebrow="Diagnostic Services"
        title="Advanced Diagnostic Services"
        description={`Imaging, cardiac and laboratory investigations at ${clinic.legalName} in ${address.locality}, ${address.city} — so consultation and testing can happen in one visit.`}
        trail={[{ name: 'Home', href: '/' }, { name: 'Diagnostics', href: '/diagnostics' }]}
      >
        <Link
          href="/book-appointment?department=Diagnostics"
          className={buttonStyles({ variant: 'primary', size: 'md' })}
        >
          Book Diagnostic Appointment
        </Link>
        <a href={callHref} className={buttonStyles({ variant: 'outline', size: 'md' })}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call {contact.phoneDisplay}
        </a>
      </PageHero>

      {taglineParts.length > 0 && (
        <section aria-label="Diagnostic service highlights" className="border-y border-brand-900/8 bg-brand-50/70 py-6">
          <div className="container">
            <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {taglineParts.map((part) => (
                <li
                  key={part}
                  className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-brand-800 sm:text-base"
                >
                  <BadgeCheck className="h-5 w-5 text-leaf-600" aria-hidden="true" />
                  {part}
                </li>
              ))}
            </ul>
            {!settings.showSameDayResults && (
              <p className="mt-3 text-center text-xs text-ink-500">
                Report timelines depend on the specific test and are confirmed by the centre when you
                book.
              </p>
            )}
          </div>
        </section>
      )}

      <section aria-labelledby="diagnostics-grid" className="bg-white py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            id="diagnostics-grid"
            eyebrow="All Investigations"
            title="Diagnostic services available"
            description="Every investigation listed below is carried out at the centre as advised by your doctor."
          />

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {diagnostics.map((service, index) => (
              <Reveal key={service.id} delay={Math.min(index, 5) * 45} className="h-full">
                <DiagnosticCard
                  service={service}
                  showSameDay={settings.showSameDayResults}
                  priority={index < 3}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="diagnostics-detail" className="bg-brand-50/60 py-16 sm:py-20">
        <div className="container space-y-20">
          <SectionHeading
            id="diagnostics-detail"
            eyebrow="In Detail"
            title="A closer look at each test"
            description="What each investigation involves and how to book it."
          />

          {features.map((service, index) => (
            <DiagnosticFeature
              key={service.id}
              service={service}
              settings={settings}
              reverse={index % 2 === 1}
            />
          ))}

          <div className="flex items-start gap-3 rounded-2xl border border-brand-900/8 bg-white p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-ink-700">
              Investigations are carried out as advised by a doctor. Some tests may need preparation
              (for example, arriving fasting). Please call{' '}
              <a href={callHref} className="link-underline">
                {contact.phoneDisplay}
              </a>{' '}
              when booking and the centre will tell you exactly what to do for your specific test.
              Nothing on this page is medical advice.
            </p>
          </div>
        </div>
      </section>

      <AppointmentSection doctors={doctors} settings={settings} />
      <EmergencyCta settings={settings} />

      <JsonLd data={servicesJsonLd(diagnostics)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Diagnostics', path: '/diagnostics' },
        ])}
      />
    </>
  );
}
