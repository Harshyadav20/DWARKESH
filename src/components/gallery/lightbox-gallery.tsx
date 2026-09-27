'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GalleryItem } from '@/lib/types';

type Props = {
  items: GalleryItem[];
  categories: readonly string[];
  /** Optional fixed category filter (used on service pages). */
  lockedCategory?: string;
  columns?: string;
};

/**
 * Filterable gallery with a keyboard-accessible lightbox.
 * Arrow keys navigate, Escape closes, focus returns to the thumbnail.
 */
export function LightboxGallery({
  items,
  categories,
  lockedCategory,
  columns = 'sm:grid-cols-2 lg:grid-cols-3',
}: Props) {
  const [active, setActive] = useState<string>(lockedCategory ?? categories[0] ?? 'All');
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    active === 'All' ? items : items.filter((item) => item.category === active);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (direction: 1 | -1) =>
      setLightbox((current) => {
        if (current === null) return current;
        const next = (current + direction + filtered.length) % filtered.length;
        return next;
      }),
    [filtered.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, close, step]);

  const current = lightbox !== null ? filtered[lightbox] : null;

  return (
    <div>
      {!lockedCategory && (
        <div
          className="flex flex-wrap justify-center gap-2"
          role="group"
          aria-label="Filter gallery by category"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActive(category);
                setLightbox(null);
              }}
              aria-pressed={active === category}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25',
                active === category
                  ? 'bg-brand-700 text-white shadow-card'
                  : 'border border-brand-900/10 bg-white text-ink-600 hover:border-brand-300 hover:text-brand-800',
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-brand-900/15 bg-brand-50/50 p-8 text-center text-sm text-ink-600">
          Photographs for this section will be added soon. Please call the centre if you would like
          to see the facilities in person.
        </p>
      ) : (
        <ul className={cn('mt-8 grid gap-5', columns)}>
          {filtered.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setLightbox(index)}
                className="group relative block w-full overflow-hidden rounded-2xl bg-brand-50 shadow-card ring-1 ring-brand-900/8 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/30"
                aria-label={`Open larger view: ${item.alt}`}
              >
                <span className="relative block aspect-[4/3] w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                  />
                </span>
                <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-brand-950/85 via-brand-950/25 to-transparent p-4 text-left">
                  <span className="text-sm font-bold text-white">{item.caption ?? item.category}</span>
                  <span className="rounded-full bg-white/20 px-2.5 py-1 text-2xs font-semibold uppercase tracking-[0.1em] text-white backdrop-blur">
                    {item.category}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {current && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-brand-950/92 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={current.alt}
          onClick={close}
        >
          <div
            className="relative w-full max-w-5xl animate-scale-in"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-brand-950 shadow-float">
              <Image
                src={current.src}
                alt={current.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-white">
              <div>
                <p className="font-display text-base font-bold">{current.caption ?? current.category}</p>
                <p className="text-sm text-brand-100/75">{current.alt}</p>
              </div>
              <p className="text-sm font-semibold text-brand-100/70">
                {(lightbox ?? 0) + 1} / {filtered.length}
              </p>
            </div>

            <button
              type="button"
              onClick={close}
              className="absolute -top-3 right-2 inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-brand-900 shadow-float transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 sm:-right-3"
              aria-label="Close image viewer"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => step(-1)}
              className="absolute left-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-900 shadow-float transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 sm:-left-6"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              className="absolute right-2 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-900 shadow-float transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 sm:-right-6"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
