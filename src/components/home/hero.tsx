import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CalendarCheck, Check, House, MessageCircle, Phone, ScanLine } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { buttonStyles } from '@/components/ui/button';
import { address, clinic, contact } from '@/lib/site';
import { callHref, whatsappHref } from '@/lib/links';
import type { SiteSettings } from '@/lib/types';

const included = [
  { icon: ScanLine, label: 'Digital X-Ray, ECG & 2D Echo' },
  { icon: House, label: 'Home visits available' },
  { icon: Check, label: 'Dental & pathology on site' },
];

export function Hero({ settings }: { settings: SiteSettings }) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white"
    >
      <div aria-hidden="true" className="bg-grid mask-fade-b absolute inset-0 opacity-80" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-200/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-72 w-72 rounded-full bg-royal-200/25 blur-3xl"
      />

      <div className="container relative grid items-center gap-12 py-14 lg:grid-cols-[1.02fr_1fr] lg:gap-14 lg:py-20">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="brand" icon={<Check className="h-3 w-3" aria-hidden="true" />}>
              {address.locality}, {address.city}
            </Badge>
            {settings.emergencyEnabled && (
              <Badge tone="leaf" icon={<Phone className="h-3 w-3" aria-hidden="true" />}>
                {settings.emergencyNote}
              </Badge>
            )}
          </div>

          <h1
            id="hero-heading"
            className="mt-5 font-display text-[2.5rem] font-extrabold leading-[1.05] tracking-tight text-brand-950 sm:text-5xl lg:text-[3.6rem]"
          >
            {settings.heroHeading}
          </h1>

          <p className="mt-4 text-lg font-semibold leading-snug text-brand-700 sm:text-xl">
            {settings.heroSubheading}
          </p>

          <p className="mt-4 max-w-xl text-[0.975rem] leading-relaxed text-ink-600">
            {clinic.description}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href="/book-appointment" className={buttonStyles({ variant: 'primary', size: 'lg' })}>
              <CalendarCheck className="h-5 w-5" aria-hidden="true" />
              Book an Appointment
              <ArrowRight className="h-4 w-4 opacity-70" aria-hidden="true" />
            </Link>
            <a
              href={callHref}
              className={buttonStyles({ variant: 'outline', size: 'lg' })}
              aria-label={`Call the centre on ${contact.phoneDisplay}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Call {contact.phoneDisplay}
            </a>
            {settings.whatsappEnabled && (
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: 'whatsapp', size: 'lg' })}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                WhatsApp Us
              </a>
            )}
          </div>

          <ul className="mt-9 grid gap-3 border-t border-brand-900/8 pt-6 sm:grid-cols-3">
            {included.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-2.5 text-sm font-medium text-ink-700">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf-50 text-leaf-700 ring-1 ring-leaf-100">
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>

          <p className="mt-6 font-devanagari text-sm text-ink-500" lang="hi">
            {clinic.hindiName} — {address.locality}, {address.city}
          </p>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl shadow-float ring-1 ring-brand-900/10">
            <Image
              src="/images/hero-medical-centre.jpg"
              alt={`Doctor consulting with a patient at ${clinic.legalName} in ${address.locality}, ${address.city}`}
              width={1200}
              height={1000}
              priority
              fetchPriority="high"
              decoding="async"
              sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 46vw, 44vw"
              className="h-[340px] w-full object-cover sm:h-[440px] lg:h-[540px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-950/45 via-transparent to-transparent"
            />
          </div>

          <div className="absolute -bottom-5 left-4 right-4 rounded-2xl border border-brand-900/8 bg-white/95 p-4 shadow-card backdrop-blur sm:left-6 sm:right-auto sm:max-w-xs">
            <p className="flex items-center gap-2 text-2xs font-bold uppercase tracking-[0.14em] text-brand-700">
              <House className="h-3.5 w-3.5" aria-hidden="true" />
              Home Visit Available
            </p>
            <p className="mt-1.5 font-display text-lg font-extrabold text-brand-950">
              {settings.homeVisitHours}
            </p>
            <Link
              href="/home-visit"
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-royal-700 hover:text-royal-900 rounded"
            >
              Request a home visit
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="absolute -top-4 right-3 hidden rounded-2xl border border-brand-900/8 bg-white/95 px-4 py-3 shadow-card backdrop-blur lg:block">
            <p className="text-2xs font-bold uppercase tracking-[0.14em] text-ink-500">
              Under one roof
            </p>
            <p className="mt-1 font-display text-sm font-bold text-brand-900">
              Clinic · Diagnostics · Dental
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
