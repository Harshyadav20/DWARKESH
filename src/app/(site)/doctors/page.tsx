import type { Metadata } from 'next';
import Link from 'next/link';
import { Phone, Info } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { DoctorCard } from '@/components/cards/doctor-card';
import { Reveal } from '@/components/ui/reveal';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { AppointmentSection } from '@/components/appointment/appointment-section';
import { JsonLd } from '@/components/seo/json-ld';
import { buttonStyles } from '@/components/ui/button';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { clinic, contact } from '@/lib/site';
import { callHref } from '@/lib/links';
import { getContent, visibleDoctors } from '@/lib/store';

export const metadata: Metadata = buildMetadata({
  title: 'Our Doctors',
  description: `Doctors at ${clinic.legalName}, Malad East, Mumbai — Dr. Subhash Yadav (MBBS, MD Medicine), Dr. Anubhuti Yadav (MBBS, MS, Obstetrics & Gynaecology) and Dr. Rita Yadav (BDS, Dental Surgeon).`,
  path: '/doctors',
  keywords: [
    'doctors in Malad East',
    'physician Malad East',
    'gynaecologist Malad East',
    'dentist Malad East',
    'doctor consultation Malad East',
  ],
});

export default async function DoctorsPage() {
  const { settings, doctors } = await getContent();
  const list = visibleDoctors(doctors);

  return (
    <>
      <PageHero
        eyebrow="Our Doctors"
        title="Meet the doctors at the centre"
        description="Consultation is available across internal medicine, obstetrics & gynaecology and dental care. Call ahead to confirm the doctor's availability before visiting."
        trail={[{ name: 'Home', href: '/' }, { name: 'Doctors', href: '/doctors' }]}
      >
        <Link href="/book-appointment" className={buttonStyles({ variant: 'primary', size: 'md' })}>
          Book an Appointment
        </Link>
        <a href={callHref} className={buttonStyles({ variant: 'outline', size: 'md' })}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call {contact.phoneDisplay}
        </a>
      </PageHero>

      <section aria-labelledby="doctors-list" className="bg-white py-16 sm:py-20">
        <div className="container">
          <h2 id="doctors-list" className="sr-only">
            Doctor directory
          </h2>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((doctor, index) => (
              <Reveal key={doctor.id} delay={index * 60} className="h-full">
                <DoctorCard doctor={doctor} />
              </Reveal>
            ))}
          </div>

          <div className="mt-10 flex items-start gap-3 rounded-2xl border border-brand-900/8 bg-brand-50/60 p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-ink-700">
              Consultation timings are published as soon as the centre shares them. Until then the
              listing shows “Details to be updated”. Please call{' '}
              <a href={callHref} className="link-underline">
                {contact.phoneDisplay}
              </a>{' '}
              to confirm a doctor's availability before you visit. Additional doctors and
              specialities will be added to this page when their information is supplied.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-ink-500">
            Photographs are added only with each doctor's consent. Monogram placeholders are shown
            until the centre supplies the images.
          </p>
        </div>
      </section>

      <AppointmentSection doctors={doctors} settings={settings} />
      <EmergencyCta settings={settings} />

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Doctors', path: '/doctors' },
        ])}
      />
    </>
  );
}
