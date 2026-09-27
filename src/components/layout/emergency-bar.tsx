import { PhoneCall, MapPin } from 'lucide-react';
import { address } from '@/lib/site';
import { telHref } from '@/lib/links';
import { formatIndianPhone } from '@/lib/utils';

/**
 * Thin "24 × 7 Emergency Assistance" strip above the navigation.
 * The number is configurable from Admin → Settings.
 */
export function EmergencyBar({
  phone,
  note,
  enabled,
}: {
  phone: string;
  note: string;
  enabled: boolean;
}) {
  if (!enabled || !phone) return null;

  return (
    <div className="relative z-50 bg-gradient-to-r from-brand-900 via-brand-800 to-royal-900 text-white">
      <div className="container flex h-10 items-center justify-between gap-4 text-[0.7rem] sm:text-xs">
        <p className="flex items-center gap-2 font-semibold">
          <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-leaf-300" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf-400" />
          </span>
          <span className="truncate">{note}</span>
        </p>

        <div className="flex items-center gap-4">
          <span className="hidden items-center gap-1.5 text-brand-100/85 lg:flex">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="truncate">
              {address.locality}, {address.city}
            </span>
          </span>
          <a
            href={telHref(phone)}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 font-bold tracking-tight text-white transition-colors hover:bg-white/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label={`Call the 24 by 7 emergency number ${formatIndianPhone(phone)}`}
          >
            <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
            {formatIndianPhone(phone)}
          </a>
        </div>
      </div>
    </div>
  );
}
