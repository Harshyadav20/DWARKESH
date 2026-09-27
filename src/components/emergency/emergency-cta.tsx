import { PhoneCall, MessageCircle, CalendarCheck } from 'lucide-react';
import Link from 'next/link';
import { buttonStyles } from '@/components/ui/button';
import { clinic, contact } from '@/lib/site';
import { callHref, telHref, whatsappHref } from '@/lib/links';
import { formatIndianPhone } from '@/lib/utils';
import type { SiteSettings } from '@/lib/types';

/**
 * Prominent emergency / quick-contact block.
 * The 24 × 7 wording is only shown when the clinic keeps it enabled in admin.
 */
export function EmergencyCta({ settings }: { settings: SiteSettings }) {
  const emergencyNumber = settings.emergencyPhone || contact.phoneDigits;

  return (
    <section
      aria-labelledby="emergency-heading"
      className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-royal-900 py-14 text-white sm:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_45%)]"
      />
      <div className="container relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-2xs font-bold uppercase tracking-[0.16em] text-brand-100 ring-1 ring-white/20">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-leaf-300" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf-400" />
            </span>
            {settings.emergencyEnabled ? settings.emergencyNote : 'Quick contact'}
          </p>

          <h2
            id="emergency-heading"
            className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
          >
            Need medical assistance?
          </h2>
          <p className="mt-3 max-w-xl text-[0.975rem] leading-relaxed text-brand-100/85">
            Call {clinic.legalName} and speak to our team. For a life-threatening emergency, also
            contact the nearest hospital emergency department or dial 112.
          </p>

          <p className="mt-5 font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <a
              href={telHref(emergencyNumber)}
              className="rounded transition-colors hover:text-brand-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            >
              {formatIndianPhone(emergencyNumber)}
            </a>
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-1">
          <a
            href={callHref}
            className={buttonStyles({ variant: 'call', size: 'lg', full: true })}
          >
            <PhoneCall className="h-5 w-5 text-brand-700" aria-hidden="true" />
            Call Now
          </a>
          {settings.whatsappEnabled && (
            <a
              href={whatsappHref(
                `Hello ${clinic.legalName}, I need medical assistance. Please help me with the next steps.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: 'whatsapp', size: 'lg', full: true })}
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              WhatsApp Us
            </a>
          )}
          <Link href="/book-appointment" className={buttonStyles({ variant: 'light', size: 'lg', full: true })}>
            <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            Book an Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}
