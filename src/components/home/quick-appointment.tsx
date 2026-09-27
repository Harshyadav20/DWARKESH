import Link from 'next/link';
import { CalendarCheck, Clock, MessageCircle, Phone } from 'lucide-react';
import { buttonStyles } from '@/components/ui/button';
import { clinic, contact } from '@/lib/site';
import { callHref, whatsappHref } from '@/lib/links';
import type { SiteSettings } from '@/lib/types';

/**
 * Quick appointment strip — the three dominant actions on the site, repeated
 * right below the hero so they are always one tap away.
 */
export function QuickAppointment({ settings }: { settings: SiteSettings }) {
  return (
    <section aria-labelledby="quick-appointment" className="relative bg-brand-900 py-10 sm:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(124,203,214,0.22),transparent_45%),radial-gradient(circle_at_85%_80%,rgba(85,189,127,0.18),transparent_45%)]"
      />
      <div className="container relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <h2
            id="quick-appointment"
            className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl"
          >
            Book an appointment with {clinic.name}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-brand-100/80">
            Request a slot online, call the centre, or send a WhatsApp message — whichever is easiest
            for you. Our team confirms every request personally.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 text-sm font-semibold text-white ring-1 ring-white/15">
            <Clock className="h-4 w-4 text-brand-200" aria-hidden="true" />
            {settings.openDays}: {settings.clinicHours}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/book-appointment" className={buttonStyles({ variant: 'call', size: 'lg', full: true })}>
            <CalendarCheck className="h-5 w-5 text-brand-700" aria-hidden="true" />
            Book Appointment
          </Link>
          <a
            href={callHref}
            className={buttonStyles({ variant: 'light', size: 'lg', full: true })}
            aria-label={`Call ${contact.phoneDisplay}`}
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call Now
          </a>
          {settings.whatsappEnabled ? (
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: 'whatsapp', size: 'lg', full: true })}
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              WhatsApp
            </a>
          ) : (
            <a
              href={`mailto:${contact.email}`}
              className={buttonStyles({ variant: 'light', size: 'lg', full: true })}
            >
              Email Us
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
