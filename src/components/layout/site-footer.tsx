import Link from 'next/link';
import { Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { addressOneLine, clinic, contact, footerServices, navigation } from '@/lib/site';
import { callHref, emailHref, mapsDirectionsHref, whatsappHref } from '@/lib/links';
import type { SiteSettings } from '@/lib/types';

export function SiteFooter({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-brand-950 text-brand-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent"
      />
      <div className="container grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-10">
        <div className="max-w-sm">
          <Logo variant="light" size="md" />
          <p className="mt-5 text-sm leading-relaxed text-brand-100/75">{clinic.description}</p>
          <p className="mt-4 font-devanagari text-sm text-brand-100/60" lang="hi">
            {clinic.hindiName}
          </p>

          {(settings.facebookUrl || settings.instagramUrl || settings.youtubeUrl) && (
            <div className="mt-5 flex items-center gap-2">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-white transition-colors hover:bg-white/16"
                  aria-label="Facebook"
                >
                  <span className="text-sm font-bold">f</span>
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-white transition-colors hover:bg-white/16"
                  aria-label="Instagram"
                >
                  <span className="text-sm font-bold">ig</span>
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/8 text-white transition-colors hover:bg-white/16"
                  aria-label="YouTube"
                >
                  <span className="text-sm font-bold">yt</span>
                </a>
              )}
            </div>
          )}
        </div>

        <nav aria-label="Quick links">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
            Quick Links
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-brand-100/75 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60 rounded"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/book-appointment"
                className="text-brand-100/75 transition-colors hover:text-white rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
              >
                Book Appointment
              </Link>
            </li>
            <li>
              <Link
                href="/home-visit"
                className="text-brand-100/75 transition-colors hover:text-white rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
              >
                Home Visit
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Services">
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
            Services
          </h2>
          <ul className="mt-5 space-y-3 text-sm">
            {footerServices.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="text-brand-100/75 transition-colors hover:text-white rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-[0.16em] text-white">
            Contact
          </h2>
          <ul className="mt-5 space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
              <span className="text-brand-100/80">{addressOneLine}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
              <a
                href={callHref}
                className="font-semibold text-white transition-colors hover:text-brand-200 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
              >
                {settings.emergencyPhone
                  ? settings.emergencyPhone.replace(/(\d{5})(\d{5})/, '$1 $2')
                  : '—'}
              </a>
            </li>
            <li className="flex gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
              <a
                href={emailHref}
                className="break-all text-brand-100/80 transition-colors hover:text-white rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400/60"
              >
                {contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
              <span className="text-brand-100/80">
                {settings.openDays}: {settings.clinicHours}
                <span className="mt-1 block text-brand-100/60">
                  Home visit: {settings.homeVisitHours}
                </span>
              </span>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-[#1FA855] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#178a45] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1FA855]/40"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              WhatsApp
            </a>
            <a
              href={callHref}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-brand-900 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call Now
            </a>
            <a
              href={mapsDirectionsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/25"
            >
              <Navigation className="h-4 w-4" aria-hidden="true" />
              Get Directions
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-3 py-6 text-xs text-brand-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {clinic.legalName}. All Rights Reserved.</p>
          <p className="max-w-2xl sm:text-right">
            Information on this website is for general awareness only and is not a substitute for
            professional medical advice, diagnosis or treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}
