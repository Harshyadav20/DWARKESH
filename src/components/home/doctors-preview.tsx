import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { DoctorCard } from '@/components/cards/doctor-card';
import { buttonStyles } from '@/components/ui/button';
import { visibleDoctors } from '@/lib/store';
import type { Doctor } from '@/lib/types';

export function DoctorsPreview({ doctors }: { doctors: Doctor[] }) {
  const list = visibleDoctors(doctors);

  if (list.length === 0) return null;

  return (
    <section
      id="doctors"
      aria-labelledby="doctors-heading"
      className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container">
        <SectionHeading
          id="doctors-heading"
          eyebrow="Our Doctors"
          title="Meet the doctors at the centre"
          description="Consultation is available with our doctors across internal medicine, obstetrics & gynaecology and dental care. Please call ahead to confirm consultation timings."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((doctor, index) => (
            <Reveal key={doctor.id} delay={index * 60} className="h-full">
              <DoctorCard doctor={doctor} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/doctors" className={buttonStyles({ variant: 'primary', size: 'md' })}>
            View doctor profiles
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/book-appointment" className={buttonStyles({ variant: 'outline', size: 'md' })}>
            Book an appointment
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-ink-500">
          Additional doctors and consultation timings will be listed here once shared by the centre.
        </p>
      </div>
    </section>
  );
}
