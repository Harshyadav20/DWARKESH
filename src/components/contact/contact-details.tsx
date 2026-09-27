import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { buttonStyles } from '@/components/ui/button';
import { address, addressOneLine, clinic, contact } from '@/lib/site';
import { callHref, emailHref, mapsDirectionsHref, whatsappHref } from '@/lib/links';
import type { SiteSettings } from '@/lib/types';

/**
 * Contact action cards: Call Now, WhatsApp, Email and Get Directions —
 * every one of them is a working link.
 */
export function ContactActions({ settings }: { settings: SiteSettings }) {
  const cards = [
    {
      icon: Phone,
      label: 'Call Now',
      value: contact.phoneDisplay,
      href: callHref,
      hint: settings.emergencyEnabled ? settings.emergencyNote : 'During clinic hours',
      tone: 'brand' as const,
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: contact.phoneDisplay,
      href: whatsappHref(),
      hint: 'Message us — we reply during clinic hours',
      tone: 'whatsapp' as const,
      external: true,
    },
    {
      icon: Mail,
      label: 'Email',
      value: contact.email,
      href: emailHref,
      hint: 'For reports, queries and appointments',
      tone: 'royal' as const,
    },
    {
      icon: Navigation,
      label: 'Get Directions',
      value: `${address.locality}, ${address.city}`,
      href: mapsDirectionsHref,
      hint: addressOneLine,
      tone: 'neutral' as const,
      external: true,
    },
  ];

  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <li key={card.label}>
          <a
            href={card.href}
            {...(card.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="card card-hover flex h-full items-start gap-4 p-5"
          >
            <span
              className={
                card.tone === 'whatsapp'
                  ? 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1FA855]/10 text-[#146c37]'
                  : card.tone === 'royal'
                    ? 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-royal-50 text-royal-700 ring-1 ring-royal-100'
                    : card.tone === 'neutral'
                      ? 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-ink-50 text-ink-700 ring-1 ring-ink-100'
                      : 'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100'
              }
            >
              <card.icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-2xs font-bold uppercase tracking-[0.14em] text-ink-500">
                {card.label}
              </span>
              <span className="mt-1 block truncate font-display text-base font-bold text-brand-950">
                {card.value}
              </span>
              <span className="mt-1 block text-xs leading-relaxed text-ink-500">{card.hint}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ContactAddressCard({ settings }: { settings: SiteSettings }) {
  return (
    <div className="card p-6">
      <h3 className="flex items-center gap-2 font-display text-lg font-bold text-brand-950">
        <MapPin className="h-5 w-5 text-brand-700" aria-hidden="true" />
        {clinic.legalName}
      </h3>

      <address className="mt-4 space-y-1 text-sm not-italic leading-relaxed text-ink-700">
        <p>{address.line1}</p>
        <p>{address.line2}</p>
        <p>
          {address.locality}, {address.city} – {address.postalCode}
        </p>
        <p>
          {address.region}, {address.country}
        </p>
      </address>

      <dl className="mt-5 space-y-3 border-t border-brand-900/8 pt-5 text-sm">
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
          <div>
            <dt className="font-bold text-brand-950">Clinic hours</dt>
            <dd className="text-ink-600">
              {settings.openDays}: {settings.clinicHours}
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
          <div>
            <dt className="font-bold text-brand-950">Phone / WhatsApp</dt>
            <dd>
              <a href={callHref} className="link-underline">
                {contact.phoneDisplay}
              </a>
            </dd>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
          <div>
            <dt className="font-bold text-brand-950">Email</dt>
            <dd>
              <a href={emailHref} className="link-underline break-all">
                {contact.email}
              </a>
            </dd>
          </div>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        <a href={callHref} className={buttonStyles({ variant: 'primary', size: 'sm' })}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call Now
        </a>
        <a
          href={mapsDirectionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles({ variant: 'outline', size: 'sm' })}
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Get Directions
        </a>
      </div>
    </div>
  );
}
