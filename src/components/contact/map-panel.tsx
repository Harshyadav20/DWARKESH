import { Navigation, MapPin } from 'lucide-react';
import { buttonStyles } from '@/components/ui/button';
import { mapsDirectionsHref, mapsEmbedSrc } from '@/lib/links';
import { address, addressOneLine, clinic } from '@/lib/site';

/**
 * "Find Us" map panel.
 *
 * Uses the configured Embed API URL / API key when available, otherwise falls
 * back to a key-less embed of the clinic address. "Get Directions" always works
 * because it is a plain Google Maps link (deep-links into the app on mobile).
 */
export function MapPanel() {
  return (
    <div className="overflow-hidden rounded-3xl border border-brand-900/10 bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-900/8 bg-brand-50/60 px-5 py-4">
        <div className="flex items-start gap-2.5">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
          <div>
            <h3 className="font-display text-base font-bold text-brand-950">Find Us</h3>
            <p className="text-sm text-ink-600">{addressOneLine}</p>
          </div>
        </div>
        <a
          href={mapsDirectionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles({ variant: 'primary', size: 'sm' })}
        >
          <Navigation className="h-4 w-4" aria-hidden="true" />
          Get Directions
        </a>
      </div>

      <div className="relative aspect-[16/10] w-full bg-brand-50 sm:aspect-[16/8]">
        <iframe
          title={`Google Map showing the location of ${clinic.legalName}, ${address.locality}, ${address.city}`}
          src={mapsEmbedSrc()}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-900/8 px-5 py-4 text-sm text-ink-600">
        <p>
          {clinic.legalName}, {address.line1}, {address.line2}, {address.locality}, {address.city}{' '}
          {address.postalCode}
        </p>
        <a
          href={mapsDirectionsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline"
        >
          Open in Google Maps
        </a>
      </div>
    </div>
  );
}
