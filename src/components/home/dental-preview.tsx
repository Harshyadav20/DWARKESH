import Image from 'next/image';
import Link from 'next/link';
import { CalendarCheck, Smile } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { buttonStyles } from '@/components/ui/button';
import { clinic } from '@/lib/site';
import { appointmentHref } from '@/lib/links';
import { servicesByGroup } from '@/lib/store';
import type { ServiceItem } from '@/lib/types';

export function DentalPreview({ services }: { services: ServiceItem[] }) {
  const list = servicesByGroup(services, 'dental');

  return (
    <section
      id="dental"
      aria-labelledby="dental-heading"
      className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            id="dental-heading"
            align="left"
            eyebrow="Dental Clinic"
            title={clinic.dentalClinicName}
            description={`${clinic.dentalTagline} — general dental care for adults and children, at the centre in Malad East.`}
          />

          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {list.map((service) => (
              <li
                key={service.id}
                id={service.slug}
                className="flex items-start gap-3 rounded-xl border border-brand-900/8 bg-brand-50/50 p-4 transition-colors hover:border-brand-200 hover:bg-brand-50"
              >
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
                  <Smile className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm font-bold text-brand-950">{service.name}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-ink-600">
                    {service.shortDescription}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={appointmentHref({ department: 'Dental', doctor: 'Dr. Rita Yadav' })}
              className={buttonStyles({ variant: 'primary', size: 'lg' })}
            >
              <CalendarCheck className="h-5 w-5" aria-hidden="true" />
              Book Dental Appointment
            </Link>
            <Link href="/dental" className={buttonStyles({ variant: 'outline', size: 'lg' })}>
              About the dental clinic
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-brand-900/10">
            <Image
              src="/images/dental-clinic.jpg"
              alt="Dental clinic treatment room at Dwarkesh Dental Clinic, Malad East, Mumbai"
              width={1000}
              height={820}
              sizes="(max-width: 1023px) 100vw, 46vw"
              className="h-[320px] w-full object-cover sm:h-[440px]"
            />
          </div>
          <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-brand-900/8 bg-white/95 p-4 shadow-card backdrop-blur sm:left-6 sm:right-auto sm:max-w-xs">
            <p className="text-2xs font-bold uppercase tracking-[0.14em] text-brand-700">
              Dental Surgeon
            </p>
            <p className="mt-1 font-display text-base font-bold text-brand-950">Dr. Rita Yadav</p>
            <p className="text-sm text-ink-600">BDS</p>
          </div>
        </div>
      </div>
    </section>
  );
}
