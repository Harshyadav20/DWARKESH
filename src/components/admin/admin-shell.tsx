import Link from 'next/link';
import {
  CalendarClock,
  ExternalLink,
  Image,
  LayoutDashboard,
  Settings,
  Stethoscope,
  Wrench,
} from 'lucide-react';
import { LogoutButton } from './logout-button';
import { Logo } from '@/components/brand/logo';
import { cn } from '@/lib/utils';

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/appointments', label: 'Appointments', icon: CalendarClock },
  { href: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/admin/services', label: 'Services', icon: Wrench },
  { href: '/admin/gallery', label: 'Gallery', icon: Image },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50 lg:flex">
      <aside className="shrink-0 border-b border-brand-900/10 bg-brand-950 lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between px-5 py-4 lg:block">
          <Link href="/admin" className="rounded-lg">
            <Logo variant="light" size="sm" showHindi={false} />
          </Link>
          <p className="mt-0 hidden text-2xs font-bold uppercase tracking-[0.18em] text-brand-300/70 lg:mt-6 lg:block">
            Content Studio
          </p>
        </div>

        <nav aria-label="Admin" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex min-h-11 shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-brand-100/80 transition-colors hover:bg-white/10 hover:text-white',
              )}
            >
              <link.icon className="h-[1.125rem] w-[1.125rem] shrink-0" aria-hidden="true" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden gap-2 border-t border-white/10 p-4 lg:block">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-brand-100/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            View live site
          </Link>
          <LogoutButton />
        </div>

        <div className="flex gap-2 border-t border-white/10 p-3 lg:hidden">
          <Link
            href="/"
            target="_blank"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-sm font-semibold text-white"
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            Live site
          </Link>
          <LogoutButton compact />
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}
