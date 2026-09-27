import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { JsonLd } from '@/components/seo/json-ld';
import { buttonStyles } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { clinic, address } from '@/lib/site';
import { getContent, visibleDoctors } from '@/lib/store';

export const metadata: Metadata = buildMetadata({
  title: 'About Us',
  description: `About ${clinic.legalName} — a healthcare and diagnostic centre in ${address.locality}, ${address.city} offering doctor consultation, pathology, sonography, digital X-Ray, ECG, 2D Echo, dental care and home visits.`,
  path: '/about',
  keywords: ['about Dwarkesh Medical Centre', 'medical centre Malad East', 'clinic in Malad East Mumbai'],
});

const commitments = [
  'Consultation, diagnostics and dental care at one address',
  'Reports explained clearly, with time for questions',
  'Home visits when travelling to the centre is difficult',
  'Only the information the clinic has confirmed is published here',
];

const facilities = [
  { name: 'Polyclinic', detail: 'Doctor consultation for adults and children' },
  { name: 'Diagnostics', detail: 'Digital X-Ray, sonography, ECG, 2D Echo, mammography' },
  { name: 'Pathology', detail: 'Blood tests and laboratory investigations' },
  { name: 'Dental clinic', detail: 'Check-ups, cleaning, filling and extraction' },
  { name: 'Home visit', detail: 'Consultation and basic healthcare support at home' },
];

export default async function AboutPage() {
  const { settings, doctors } = await getContent();
  const list = visibleDoctors(doctors);

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="About Dwarkesh Medical Centre"
        description={`${clinic.legalName} is a healthcare and diagnostic centre providing a range of medical, diagnostic, dental and home healthcare services in ${address.locality}, ${address.city}.`}
        trail={[{ name: 'Home', href: '/' }, { name: 'About', href: '/about' }]}
        image={
          <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-brand-900/10">
            <Image
              src="/images/gallery-consultation.jpg"
              alt={`Consultation room at ${clinic.legalName}, Malad East, Mumbai`}
              width={1000}
              height={760}
              sizes="(max-width: 1023px) 100vw, 44vw"
              className="h-[280px] w-full object-cover sm:h-[360px]"
            />
          </div>
        }
      />

      <section aria-labelledby="about-story" className="bg-white py-16 sm:py-20">
        <div className="container grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              id="about-story"
              align="left"
              eyebrow="Who We Are"
              title="Healthcare that stays close to home"
              className="mt-0"
            />
            <div className="mt-6 space-y-4 text-[0.975rem] leading-relaxed text-ink-600">
              <p>
                {clinic.name} LLP was set up so that families in {address.locality} and the
                surrounding areas of {address.city} can access consultation, diagnostic tests and
                dental care without travelling to several places.
              </p>
              <p>
                The centre brings together a polyclinic, diagnostic facilities, a dental clinic and
                home visit services. Patients can consult a doctor, complete the advised tests and
                collect reports from the same address — and when coming to the clinic is difficult,
                care can be arranged at home.
              </p>
              <p>
                We publish only information that the centre has confirmed. Where a detail is not yet
                available, the website says so instead of guessing — because patients rely on this
                information to plan their visit.
              </p>
            </div>

            <ul className="mt-8 space-y-3">
              {commitments.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-700 ring-1 ring-leaf-100">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-semibold text-brand-900">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-brand-900/8 bg-brand-50/60 p-7">
            <h3 className="font-display text-lg font-bold text-brand-950">At the centre</h3>
            <dl className="mt-5 divide-y divide-brand-900/8">
              {facilities.map((facility) => (
                <div key={facility.name} className="py-3.5 first:pt-0 last:pb-0">
                  <dt className="font-display text-sm font-bold text-brand-900">{facility.name}</dt>
                  <dd className="mt-0.5 text-sm text-ink-600">{facility.detail}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/services" className={buttonStyles({ variant: 'primary', size: 'sm' })}>
                All services
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/diagnostics" className={buttonStyles({ variant: 'outline', size: 'sm' })}>
                Diagnostics
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />

      <section aria-labelledby="about-doctors" className="bg-white py-16 sm:py-20">
        <div className="container">
          <SectionHeading
            id="about-doctors"
            eyebrow="Our Team"
            title="Doctors at the centre"
            description="Consultation is available with the doctors below. Additional doctors will be listed as their details are shared by the centre."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((doctor) => (
              <li key={doctor.id}>
                <Link
                  href={`/doctors/${doctor.slug}`}
                  className="card card-hover block p-5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
                >
                  <p className="font-display text-base font-bold text-brand-950">{doctor.name}</p>
                  <p className="mt-1 text-sm font-semibold text-royal-700">{doctor.qualifications}</p>
                  <p className="mt-1 text-sm text-ink-600">{doctor.specialization}</p>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex justify-center">
            <Link href="/doctors" className={buttonStyles({ variant: 'primary', size: 'md' })}>
              View doctor profiles
            </Link>
          </div>
        </div>
      </section>

      <EmergencyCta settings={settings} />

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'About', path: '/about' },
        ])}
      />
    </>
  );
}
