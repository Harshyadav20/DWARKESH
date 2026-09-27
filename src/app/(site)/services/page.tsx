import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, House, ScanLine, Smile } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { ServiceCard } from '@/components/cards/service-card';
import { Reveal } from '@/components/ui/reveal';
import { SectionHeading } from '@/components/ui/section-heading';
import { AppointmentSection } from '@/components/appointment/appointment-section';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { JsonLd } from '@/components/seo/json-ld';
import { buttonStyles } from '@/components/ui/button';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { address, clinic } from '@/lib/site';
import { getContent, servicesByGroup } from '@/lib/store';

export const metadata: Metadata = buildMetadata({
  title: 'Medical Services',
  description: `Medical services at ${clinic.legalName}, ${address.locality}, ${address.city} — polyclinic, doctor consultation, pathology, dental, diagnostic services and home visits.`,
  path: '/services',
  keywords: [
    'medical services Malad East',
    'polyclinic Malad East',
    'doctor consultation Malad East',
    'home visit doctor Malad East',
  ],
});

const relatedGroups = [
  {
    icon: ScanLine,
    title: 'Diagnostic services',
    text: 'Digital X-Ray, 2D Echo, digital mammography, ECG, sonography and pathology.',
    href: '/diagnostics',
    cta: 'View diagnostics',
  },
  {
    icon: Smile,
    title: 'Dental clinic',
    text: 'Dental check-up, cleaning, filling, extraction and general dental care.',
    href: '/dental',
    cta: 'View dental services',
  },
  {
    icon: House,
    title: 'Home visit',
    text: 'Doctor consultation and basic healthcare support at your home.',
    href: '/home-visit',
    cta: 'Request a home visit',
  },
];

export default async function ServicesPage() {
  const { settings, doctors, services } = await getContent();
  const medical = servicesByGroup(services, 'medical');

  return (
    <>
      <PageHero
        eyebrow="Medical Services"
        title="Medical services at the centre"
        description={`Consultation, diagnostics, dental care and home visits — available at ${clinic.legalName}, ${address.line2}, ${address.locality}, ${address.city}.`}
        trail={[{ name: 'Home', href: '/' }, { name: 'Services', href: '/services' }]}
      />

      <section aria-labelledby="services-grid" className="bg-white py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            id="services-grid"
            eyebrow="Our Services"
            title="What we offer"
            description="Choose a service to see details, or book an appointment and mention what you need."
          />

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {medical.map((service, index) => (
              <Reveal key={service.id} delay={Math.min(index, 5) * 50} className="h-full">
                <ServiceCard service={service} className="h-full" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="service-groups" className="bg-brand-50/60 py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            id="service-groups"
            eyebrow="Explore"
            title="Specialised sections"
            description="Each area of the centre has its own page with the services it covers."
          />
          <ul className="mt-10 grid gap-5 lg:grid-cols-3">
            {relatedGroups.map((group) => (
              <li key={group.href}>
                <Link
                  href={group.href}
                  className="card card-hover flex h-full flex-col p-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <group.icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-brand-950">{group.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">{group.text}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition-all group-hover:gap-2.5">
                    {group.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link href="/book-appointment" className={buttonStyles({ variant: 'primary', size: 'md' })}>
              Book an appointment
            </Link>
            <Link href="/contact" className={buttonStyles({ variant: 'outline', size: 'md' })}>
              Contact the centre
            </Link>
          </div>
        </div>
      </section>

      <AppointmentSection doctors={doctors} settings={settings} />
      <EmergencyCta settings={settings} />

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Services', path: '/services' },
        ])}
      />
    </>
  );
}
