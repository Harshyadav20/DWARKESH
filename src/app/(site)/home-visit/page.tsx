import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck, Clock, House, MessageCircle, Phone, Stethoscope } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { SectionHeading } from '@/components/ui/section-heading';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { AppointmentSection } from '@/components/appointment/appointment-section';
import { JsonLd } from '@/components/seo/json-ld';
import { buttonStyles } from '@/components/ui/button';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { address, clinic, contact } from '@/lib/site';
import { callHref, homeVisitWhatsappHref, whatsappHref } from '@/lib/links';
import { getContent, servicesByGroup } from '@/lib/store';
import { resolveIcon } from '@/lib/icons';

export const metadata: Metadata = buildMetadata({
  title: 'Home Visit Doctor',
  description: `Home visit services from ${clinic.legalName}, ${address.locality}, ${address.city} — doctor consultation and basic healthcare support at home between ${'8:00 AM – 10:00 PM'}.`,
  path: '/home-visit',
  image: '/images/home-visit.jpg',
  keywords: [
    'home visit doctor Malad East',
    'doctor home visit Mumbai',
    'home healthcare Malad East',
    'home consultation Malad East',
  ],
});

const steps = [
  {
    title: 'Call or WhatsApp us',
    text: 'Share the patient’s name, the address in Malad East and the reason for the visit.',
  },
  {
    title: 'We confirm availability',
    text: 'Our team confirms whether a home visit can be arranged and shares the expected timing.',
  },
  {
    title: 'Care at home',
    text: 'The doctor or healthcare team visits and advises on the next steps, including tests if needed.',
  },
];

export default async function HomeVisitPage() {
  const { settings, doctors, services } = await getContent();
  const homeVisit = servicesByGroup(services, 'home-visit');

  return (
    <>
      <PageHero
        eyebrow="Home Visit"
        title="Healthcare at your doorstep"
        description="Home visit services are available for patients who require convenient healthcare support at home — including doctor consultation and basic healthcare support."
        trail={[{ name: 'Home', href: '/' }, { name: 'Home Visit', href: '/home-visit' }]}
        image={
          <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-brand-900/10">
            <Image
              src="/images/home-visit.jpg"
              alt={`Doctor attending a patient at home during a home visit arranged by ${clinic.legalName}`}
              width={1000}
              height={760}
              priority
              sizes="(max-width: 1023px) 100vw, 44vw"
              className="h-[280px] w-full object-cover sm:h-[360px]"
            />
          </div>
        }
      >
        {settings.whatsappEnabled ? (
          <a
            href={homeVisitWhatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles({ variant: 'whatsapp', size: 'md' })}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Request Home Visit
          </a>
        ) : (
          <a href={callHref} className={buttonStyles({ variant: 'primary', size: 'md' })}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            Request Home Visit
          </a>
        )}
        <a href={callHref} className={buttonStyles({ variant: 'outline', size: 'md' })}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call {contact.phoneDisplay}
        </a>
      </PageHero>

      <section aria-labelledby="home-visit-hours" className="border-b border-brand-900/8 bg-brand-50/70 py-6">
        <div className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          <p className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-brand-800 sm:text-base">
            <Clock className="h-5 w-5 text-leaf-600" aria-hidden="true" />
            Home Visit Available · {settings.homeVisitHours}
          </p>
          <p className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-brand-800 sm:text-base">
            <House className="h-5 w-5 text-leaf-600" aria-hidden="true" />
            {address.locality} and nearby areas
          </p>
        </div>
      </section>

      <section aria-labelledby="home-visit-services" className="bg-white py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            id="home-visit-services"
            eyebrow="Home Visit Services"
            title="What we can help with at home"
            description="Home visits are arranged for patients who find it difficult to travel to the centre."
          />

          <ul className="mt-12 grid gap-5 lg:grid-cols-3">
            {homeVisit.map((service) => {
              const Icon = resolveIcon(service.icon);
              return (
                <li
                  key={service.id}
                  id={service.slug}
                  className="card card-hover scroll-mt-28 p-7 text-center"
                >
                  <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    <Icon className="h-7 w-7" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-display text-lg font-bold text-brand-950">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">
                    {service.shortDescription}
                  </p>
                  {settings.whatsappEnabled && (
                    <a
                      href={whatsappHref(
                        `Hello ${clinic.legalName}, I would like to enquire about ${service.name.toLowerCase()} at home.`,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 rounded-lg text-sm font-bold text-brand-700 transition-colors hover:text-brand-900"
                    >
                      <MessageCircle className="h-4 w-4" aria-hidden="true" />
                      Request on WhatsApp
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-brand-900/8 bg-brand-50/50 p-6">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 font-display text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-brand-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {settings.whatsappEnabled && (
              <a
                href={homeVisitWhatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: 'whatsapp', size: 'lg' })}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Request Home Visit
              </a>
            )}
            <Link
              href="/book-appointment?department=Home%20Visit"
              className={buttonStyles({ variant: 'primary', size: 'lg' })}
            >
              <CalendarCheck className="h-5 w-5" aria-hidden="true" />
              Book on the form
            </Link>
            <a href={callHref} className={buttonStyles({ variant: 'outline', size: 'lg' })}>
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
              Call {contact.phoneDisplay}
            </a>
          </div>

          <p className="mx-auto mt-8 max-w-3xl rounded-2xl border border-brand-900/8 bg-white p-5 text-center text-sm leading-relaxed text-ink-600">
            Home visits are arranged subject to the doctor’s availability and the patient’s location.
            For a medical emergency, call the centre immediately and also contact the nearest hospital
            emergency department or dial 112.
          </p>
        </div>
      </section>

      <AppointmentSection doctors={doctors} settings={settings} />
      <EmergencyCta settings={settings} />

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Home Visit', path: '/home-visit' },
        ])}
      />
    </>
  );
}
