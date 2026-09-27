import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck, Check, Info, Phone, Smile } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { AppointmentSection } from '@/components/appointment/appointment-section';
import { JsonLd } from '@/components/seo/json-ld';
import { buttonStyles } from '@/components/ui/button';
import { buildMetadata, breadcrumbJsonLd, servicesJsonLd } from '@/lib/seo';
import { address, clinic, contact, unknown } from '@/lib/site';
import { appointmentHref, callHref } from '@/lib/links';
import { getContent, servicesByGroup, visibleDoctors } from '@/lib/store';
import { initials } from '@/lib/utils';
import { resolveIcon } from '@/lib/icons';

export const metadata: Metadata = buildMetadata({
  title: `Dental Clinic in ${address.locality}`,
  description: `${clinic.dentalClinicName} — ${clinic.dentalTagline.toLowerCase()}. Dental check-up, teeth cleaning, tooth filling, extraction and general dental care in ${address.locality}, ${address.city}.`,
  path: '/dental',
  image: '/images/dental-clinic.jpg',
  keywords: [
    'dental clinic Malad East',
    'dentist in Malad East',
    'teeth cleaning Malad East',
    'tooth filling Mumbai',
    'dental check-up Malad East',
  ],
});

const visitTips = [
  'Bring any previous dental records or X-rays you already have',
  'Tell the dental surgeon about any medicines you are currently taking',
  'Mention if you have had bleeding gums, pain or swelling recently',
  'Children are welcome — early check-ups make later visits easier',
];

export default async function DentalPage() {
  const { settings, doctors, services } = await getContent();
  const dental = servicesByGroup(services, 'dental');
  const dentist = visibleDoctors(doctors).find((doctor) => doctor.department === 'Dental');

  return (
    <>
      <PageHero
        eyebrow="Dental Clinic"
        title={clinic.dentalClinicName}
        description={`${clinic.dentalTagline} — general dental care for adults and children at ${clinic.legalName}, ${address.locality}, ${address.city}.`}
        trail={[{ name: 'Home', href: '/' }, { name: 'Dental', href: '/dental' }]}
        image={
          <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-brand-900/10">
            <Image
              src="/images/dental-clinic.jpg"
              alt={`Dental treatment room at ${clinic.dentalClinicName}, Malad East, Mumbai`}
              width={1000}
              height={760}
              priority
              sizes="(max-width: 1023px) 100vw, 44vw"
              className="h-[280px] w-full object-cover sm:h-[360px]"
            />
          </div>
        }
      >
        <Link
          href={appointmentHref({ department: 'Dental', doctor: dentist?.name })}
          className={buttonStyles({ variant: 'primary', size: 'md' })}
        >
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          Book Dental Appointment
        </Link>
        <a href={callHref} className={buttonStyles({ variant: 'outline', size: 'md' })}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call {contact.phoneDisplay}
        </a>
      </PageHero>

      <section aria-labelledby="dental-services" className="bg-white py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            id="dental-services"
            eyebrow="Dental Services"
            title="Complete dental solution"
            description="Routine and treatment-focused dental care, all at the centre in Malad East."
          />

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dental.map((service, index) => {
              const Icon = resolveIcon(service.icon);
              return (
                <Reveal as="li" key={service.id} delay={index * 45} className="h-full">
                  <div id={service.slug} className="card card-hover h-full scroll-mt-28 p-6">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <h3 className="mt-5 font-display text-lg font-bold text-brand-950">
                      {service.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {service.shortDescription}
                    </p>
                    <Link
                      href={appointmentHref({ department: 'Dental', service: service.name })}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition-colors hover:text-brand-900 rounded"
                    >
                      <Smile className="h-4 w-4" aria-hidden="true" />
                      Book this service
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="dental-team" className="bg-brand-50/60 py-16 sm:py-20">
        <div className="container grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <div className="card overflow-hidden">
            <div className="relative aspect-[4/3] bg-brand-50">
              {dentist?.photo ? (
                <Image
                  src={dentist.photo}
                  alt={`${dentist.name}, dental surgeon at ${clinic.dentalClinicName}`}
                  fill
                  sizes="(max-width: 1023px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_25%,#d5f0f3,transparent_65%)]">
                  <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-royal-800 font-display text-2xl font-extrabold text-white">
                    {initials(dentist?.name ?? 'Dental Surgeon')}
                  </span>
                  <span className="rounded-full bg-white/85 px-3 py-1 text-2xs font-bold uppercase tracking-[0.12em] text-ink-500 ring-1 ring-brand-900/8">
                    Photo to be updated
                  </span>
                </div>
              )}
            </div>
            <div className="p-6">
              <h3 className="font-display text-lg font-bold text-brand-950">
                {dentist?.name ?? 'Dental Surgeon'}
              </h3>
              <p className="mt-1 text-sm font-semibold text-royal-700">
                {dentist?.qualifications ?? unknown}
              </p>
              <p className="mt-1 text-sm text-ink-600">{dentist?.specialization ?? 'Dental Surgeon'}</p>
              <p className="mt-3 flex items-start gap-2 text-sm text-ink-600">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" aria-hidden="true" />
                Consultation timing: {dentist?.consultationTiming || unknown}
              </p>
              <Link
                href={appointmentHref({ department: 'Dental', doctor: dentist?.name })}
                className={buttonStyles({ variant: 'primary', size: 'sm', className: 'mt-5' })}
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Book with the dental surgeon
              </Link>
            </div>
          </div>

          <div>
            <SectionHeading
              id="dental-team"
              align="left"
              eyebrow="Before Your Visit"
              title="What to expect at the dental clinic"
              className="mt-0"
            />
            <p className="mt-5 text-[0.975rem] leading-relaxed text-ink-600">
              The dental surgeon examines your teeth and gums, explains what is needed and carries
              out the treatment that you agree to. Appointments can be booked online or by calling
              the centre.
            </p>

            <ul className="mt-7 space-y-3">
              {visitTips.map((tip) => (
                <li key={tip} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-700 ring-1 ring-leaf-100">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-ink-700">{tip}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 flex items-start gap-3 rounded-2xl border border-brand-900/8 bg-white p-5">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-ink-700">
                For dental pain or swelling, call{' '}
                <a href={callHref} className="link-underline">
                  {contact.phoneDisplay}
                </a>{' '}
                so the centre can arrange the earliest suitable appointment. Treatment decisions are
                made by the dental surgeon after examination.
              </p>
            </div>
          </div>
        </div>
      </section>

      <AppointmentSection doctors={doctors} settings={settings} />
      <EmergencyCta settings={settings} />

      <JsonLd data={servicesJsonLd(dental)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Dental', path: '/dental' },
        ])}
      />
    </>
  );
}
