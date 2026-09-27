import Link from 'next/link';
import { CalendarCheck, MessageCircle, Phone } from 'lucide-react';
import { callHref, whatsappHref } from '@/lib/links';

/**
 * Persistent quick actions.
 *
 * Mobile: a fixed bottom action bar with large (48px+) touch targets.
 * Desktop: a stacked set of circular buttons in the bottom-right corner.
 * Can be switched off from Admin → Settings.
 */
export function FloatingActions({
  phone,
  enabled,
  whatsappEnabled,
}: {
  phone: string;
  enabled: boolean;
  whatsappEnabled: boolean;
}) {
  if (!enabled) return null;

  return (
    <>
      {/* Mobile action bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-900/10 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="grid grid-cols-3 gap-1 p-2">
          {whatsappEnabled && (
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl bg-[#1FA855]/10 text-[0.6875rem] font-bold text-[#146c37] transition-colors active:bg-[#1FA855]/20"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              WhatsApp
            </a>
          )}
          <a
            href={callHref}
            className="flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl bg-brand-50 text-[0.6875rem] font-bold text-brand-800 transition-colors active:bg-brand-100"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
            Call
          </a>
          <Link
            href="/book-appointment"
            className={`flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-xl bg-brand-700 text-[0.6875rem] font-bold text-white transition-colors active:bg-brand-800 ${
              whatsappEnabled ? '' : 'col-span-1'
            }`}
          >
            <CalendarCheck className="h-5 w-5" aria-hidden="true" />
            Book
          </Link>
        </div>
      </div>

      {/* Desktop floating buttons */}
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 md:flex">
        <Link
          href="/book-appointment"
          className="group inline-flex items-center gap-2 rounded-full bg-royal-700 py-3 pl-4 pr-5 text-sm font-semibold text-white shadow-float transition-all hover:-translate-y-0.5 hover:bg-royal-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-royal-500/40"
        >
          <CalendarCheck className="h-5 w-5" aria-hidden="true" />
          Book Appointment
        </Link>
        <a
          href={callHref}
          className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand-700 text-white shadow-float transition-all hover:-translate-y-0.5 hover:bg-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/40"
          aria-label={`Call ${phone}`}
          title={`Call ${phone}`}
        >
          <Phone className="h-6 w-6" aria-hidden="true" />
        </a>
        {whatsappEnabled && (
          <span className="relative inline-flex">
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#1FA855] text-white shadow-float transition-all hover:-translate-y-0.5 hover:bg-[#178a45] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#1FA855]/40"
              aria-label="Chat with us on WhatsApp"
              title="Chat with us on WhatsApp"
            >
              <MessageCircle className="h-6 w-6" aria-hidden="true" />
            </a>
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-leaf-400"
            />
          </span>
        )}
      </div>
    </>
  );
}
