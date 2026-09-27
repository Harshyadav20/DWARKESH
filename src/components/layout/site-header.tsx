'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarCheck, Menu, Phone, X } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { buttonStyles } from '@/components/ui/button';
import { navigation } from '@/lib/site';
import { callHref, whatsappHref } from '@/lib/links';
import { cn, formatIndianPhone } from '@/lib/utils';

type Props = {
  phoneDisplay: string;
  whatsappEnabled: boolean;
};

export function SiteHeader({ phoneDisplay, whatsappEnabled }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu on navigation and lock body scroll while it is open.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-all duration-300',
        scrolled || open
          ? 'border-brand-900/10 bg-white/95 shadow-[0_6px_24px_-16px_rgba(13,42,51,0.45)] backdrop-blur'
          : 'border-transparent bg-white',
      )}
    >
      <div className="container flex h-[4.5rem] items-center justify-between gap-4 lg:h-[5rem]">
        <Link
          href="/"
          className="rounded-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
          aria-label="Dwarkesh Medical Centre LLP — home"
        >
          <Logo size="md" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 xl:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'relative rounded-lg px-3 py-2 text-[0.9rem] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25',
                isActive(item.href)
                  ? 'text-brand-800'
                  : 'text-ink-600 hover:bg-brand-50/70 hover:text-brand-800',
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  'absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-brand-600 transition-transform duration-200',
                  isActive(item.href) ? 'scale-x-100' : 'scale-x-0',
                )}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={callHref}
            className={buttonStyles({
              variant: 'outline',
              size: 'sm',
              className: 'hidden sm:inline-flex',
            })}
            aria-label={`Call now on ${phoneDisplay}`}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span className="hidden lg:inline">Call Now</span>
            <span className="lg:hidden">{phoneDisplay}</span>
          </a>
          <Link
            href="/book-appointment"
            className={buttonStyles({ variant: 'primary', size: 'sm', className: 'hidden sm:inline-flex' })}
          >
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            Book Appointment
          </Link>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-900/12 text-brand-800 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close menu' : 'Open menu'}
          >
            {open ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      <div
        id="mobile-navigation"
        className={cn(
          'overflow-hidden border-t border-brand-900/8 bg-white transition-[max-height,opacity] duration-300 xl:hidden',
          open ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <nav aria-label="Mobile" className="container flex flex-col gap-1 py-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={cn(
                'flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-base font-semibold transition-colors',
                isActive(item.href)
                  ? 'bg-brand-50 text-brand-800'
                  : 'text-ink-700 hover:bg-ink-50',
              )}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={cn(
                  'h-2 w-2 rounded-full',
                  isActive(item.href) ? 'bg-brand-600' : 'bg-transparent',
                )}
              />
            </Link>
          ))}

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <a href={callHref} className={buttonStyles({ variant: 'primary', size: 'md' })}>
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {phoneDisplay}
            </a>
            <Link href="/book-appointment" className={buttonStyles({ variant: 'royal', size: 'md' })}>
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              Book Appointment
            </Link>
            {whatsappEnabled && (
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: 'whatsapp', size: 'md' })}
              >
                WhatsApp Us
              </a>
            )}
          </div>

          <p className="px-1 pt-2 text-xs text-ink-500">
            Call us: {formatIndianPhone(phoneDisplay.replace(/\s/g, ''))}
          </p>
        </nav>
      </div>
    </header>
  );
}
