import Link from 'next/link';
import Image from 'next/image';
import { CalendarCheck, Clock } from 'lucide-react';
import { buttonStyles } from '@/components/ui/button';
import { appointmentHref } from '@/lib/links';
import { initials } from '@/lib/utils';
import { unknown } from '@/lib/site';
import type { Doctor } from '@/lib/types';

/**
 * Doctor card.
 *
 * When the clinic has not supplied a photograph we render a branded monogram
 * instead of a stock portrait — no fake doctor images, ever. Consultation
 * timings show "Details to be updated" until the clinic provides them.
 */
export function DoctorCard({ doctor }: { doctor: Doctor }) {
  const hasPhoto = Boolean(doctor.photo);

  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] overflow-hidden bg-brand-50">
        {hasPhoto ? (
          <Image
            src={doctor.photo as string}
            alt={`${doctor.name}, ${doctor.specialization} at Dwarkesh Medical Centre LLP`}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 30vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_25%,#d5f0f3,transparent_65%)]">
            <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-royal-800 font-display text-2xl font-extrabold text-white shadow-card">
              {initials(doctor.name)}
            </span>
            <span className="rounded-full bg-white/85 px-3 py-1 text-2xs font-bold uppercase tracking-[0.12em] text-ink-500 ring-1 ring-brand-900/8">
              Photo to be updated
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl font-bold tracking-tight text-brand-950">
          <Link
            href={`/doctors/${doctor.slug}`}
            className="rounded transition-colors hover:text-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
          >
            {doctor.name}
          </Link>
        </h3>

        <p className="mt-1 text-sm font-semibold text-royal-700">{doctor.qualifications || unknown}</p>
        <p className="mt-2 text-sm text-ink-600">{doctor.specialization}</p>

        <dl className="mt-4 space-y-1.5 border-t border-brand-900/8 pt-4 text-sm">
          <div className="flex items-start gap-2">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
            <dt className="sr-only">Consultation timing</dt>
            <dd className="text-ink-600">{doctor.consultationTiming || unknown}</dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-wrap gap-2 pt-1">
          <Link
            href={appointmentHref({ doctor: doctor.name, department: doctor.department })}
            className={buttonStyles({ variant: 'primary', size: 'sm' })}
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Book Appointment
          </Link>
          <Link
            href={`/doctors/${doctor.slug}`}
            className={buttonStyles({ variant: 'ghost', size: 'sm' })}
          >
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
}
