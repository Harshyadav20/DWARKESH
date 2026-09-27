import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { resolveIcon } from '@/lib/icons';
import { cn } from '@/lib/utils';
import type { ServiceItem } from '@/lib/types';
import { serviceUrl } from '@/lib/seo';

/**
 * Service card used by the home page grid and /services.
 * Icons are resolved from a registry so the content stays editable in admin.
 */
export function ServiceCard({
  service,
  tone = 'light',
  className,
}: {
  service: ServiceItem;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  const Icon = resolveIcon(service.icon);
  const dark = tone === 'dark';

  return (
    <Link
      href={serviceUrl(service)}
      className={cn(
        'group relative flex h-full flex-col rounded-2xl border p-6 transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25',
        dark
          ? 'border-white/12 bg-white/[0.06] hover:border-white/25 hover:bg-white/10'
          : 'card card-hover hover:border-brand-200',
        className,
      )}
    >
      <span
        className={cn(
          'inline-flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105',
          dark ? 'bg-white/12 text-brand-100' : 'bg-brand-50 text-brand-700 ring-1 ring-brand-100',
        )}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>

      <h3
        className={cn(
          'mt-5 font-display text-lg font-bold tracking-tight',
          dark ? 'text-white' : 'text-brand-950',
        )}
      >
        {service.name}
      </h3>

      <p className={cn('mt-2 flex-1 text-sm leading-relaxed', dark ? 'text-brand-100/75' : 'text-ink-600')}>
        {service.shortDescription}
      </p>

      <span
        className={cn(
          'mt-5 inline-flex items-center gap-1.5 text-sm font-bold transition-all duration-200 group-hover:gap-2.5',
          dark ? 'text-brand-200' : 'text-brand-700',
        )}
      >
        Learn More
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
