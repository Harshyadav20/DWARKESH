import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarCheck, Check, Clock, GraduationCap, Phone, Stethoscope } from 'lucide-react';
import { JsonLd } from '@/components/seo/json-ld';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { buttonStyles } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { DoctorCard } from '@/components/cards/doctor-card';
import { buildMetadata, breadcrumbJsonLd, physicianJsonLd } from '@/lib/seo';
import { clinic, contact, unknown } from '@/lib/site';
import { appointmentHref, callHref } from '@/lib/links';
import { initials } from '@/lib/utils';
import { getContent, visibleDoctors } from '@/lib/store';
import type { Doctor } from '@/lib/types';

export async function generateStaticParams() {
  const { doctors } = await getContent();
  return visibleDoctors(doctors).map((doctor) => ({ slug: doctor.slug }));
}

type Params = { slug: string };

async function getDoctor(slug: string): Promise<Doctor | null> {
  const { doctors } = await getContent();
  return visibleDoctors(doctors).find((doctor) => doctor.slug === slug) ?? null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const doctor = await getDoctor(slug);
  if (!doctor) return { title: 'Doctor not found' };

  return buildMetadata({
    title: `${doctor.name} — ${doctor.specialization}`,
    description: `${doctor.name} (${doctor.qualifications || unknown}) — ${doctor.specialization} at ${clinic.legalName}, Malad East, Mumbai. Book an appointment online or call ${contact.phoneDisplay}.`,
    path: `/doctors/${doctor.slug}`,
    image: doctor.photo ?? '/images/og-cover.png',
    keywords: [
      `${doctor.name}`,
      `${doctor.specialization} in Malad East`,
      `doctor consultation Malad East`,
    ],
  });
}

export default async function DoctorProfilePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const { settings, doctors } = await getContent();
  const doctor = visibleDoctors(doctors).find((item) => item.slug === slug);

  if (!doctor) notFound();

  const others = visibleDoctors(doctors).filter((item) => item.slug !== doctor.slug);

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
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/doctors" className="rounded transition-colors hover:text-brand-700">
                  Doctors
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span aria-current="page" className="text-brand-800">
                  {doctor.name}
                </span>
              </li>
            </ol>
          </nav>

          <div className="mt-8 grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-12">
            <div className="relative mx-auto w-56 shrink-0 sm:w-64 lg:mx-0">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-brand-50 shadow-card ring-1 ring-brand-900/10">
                {doctor.photo ? (
                  <Image
                    src={doctor.photo}
                    alt={`${doctor.name}, ${doctor.specialization} at ${clinic.legalName}`}
                    fill
                    priority
                    sizes="(max-width: 1023px) 16rem, 16rem"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[radial-gradient(circle_at_50%_25%,#d5f0f3,transparent_65%)]">
                    <span className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-royal-800 font-display text-3xl font-extrabold text-white">
                      {initials(doctor.name)}
                    </span>
                    <span className="rounded-full bg-white/85 px-3 py-1 text-2xs font-bold uppercase tracking-[0.12em] text-ink-500 ring-1 ring-brand-900/8">
                      Photo to be updated
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-2xs font-bold uppercase tracking-[0.18em] text-brand-700">
                {doctor.department}
              </p>
              <h1 className="mt-3 font-display text-[2.1rem] font-extrabold leading-tight tracking-tight text-brand-950 sm:text-[2.6rem]">
                {doctor.name}
              </h1>

              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-brand-900/8 bg-white p-4">
                  <dt className="flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.14em] text-ink-500">
                    <GraduationCap className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    Qualification
                  </dt>
                  <dd className="mt-1.5 font-display text-base font-bold text-brand-950">
                    {doctor.qualifications || unknown}
                  </dd>
                </div>
                <div className="rounded-2xl border border-brand-900/8 bg-white p-4">
                  <dt className="flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.14em] text-ink-500">
                    <Stethoscope className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    Specialization
                  </dt>
                  <dd className="mt-1.5 font-display text-base font-bold text-brand-950">
                    {doctor.specialization}
                  </dd>
                </div>
                <div className="rounded-2xl border border-brand-900/8 bg-white p-4 sm:col-span-2">
                  <dt className="flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.14em] text-ink-500">
                    <Clock className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    Consultation timing
                  </dt>
                  <dd className="mt-1.5 text-base font-semibold text-brand-900">
                    {doctor.consultationTiming || unknown}
                    {doctor.consultationTiming ? '' : ' — please call the centre to confirm availability.'}
                  </dd>
                </div>
              </dl>

              {doctor.bio && (
                <p className="mt-6 max-w-2xl text-[0.975rem] leading-relaxed text-ink-600">
                  {doctor.bio}
                </p>
              )}

              {doctor.highlights && doctor.highlights.length > 0 && (
                <div className="mt-6">
                  <h2 className="font-display text-sm font-bold uppercase tracking-[0.14em] text-brand-900">
                    Consultation covers
                  </h2>
                  <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
                    {doctor.highlights.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-700">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                        <span className="text-sm text-ink-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={appointmentHref({ doctor: doctor.name, department: doctor.department })}
                  className={buttonStyles({ variant: 'primary', size: 'lg' })}
                >
                  <CalendarCheck className="h-5 w-5" aria-hidden="true" />
                  Book Appointment
                </Link>
                <a
                  href={callHref}
                  className={buttonStyles({ variant: 'outline', size: 'lg' })}
                >
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  Call {contact.phoneDisplay}
                </a>
                <Link href="/doctors" className={buttonStyles({ variant: 'ghost', size: 'lg' })}>
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  All doctors
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {others.length > 0 && (
        <section aria-labelledby="other-doctors" className="bg-white py-16">
          <div className="container">
            <SectionHeading
              id="other-doctors"
              align="left"
              eyebrow="Also at the centre"
              title="Other doctors"
            />
            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {others.map((item) => (
                <DoctorCard key={item.id} doctor={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <EmergencyCta settings={settings} />

      <JsonLd data={physicianJsonLd(doctor)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Doctors', path: '/doctors' },
          { name: doctor.name, path: `/doctors/${doctor.slug}` },
        ])}
      />
    </>
  );
}
