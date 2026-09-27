import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { buttonStyles } from '@/components/ui/button';
import { visibleGallery } from '@/lib/store';
import type { GalleryItem } from '@/lib/types';

/** Compact gallery teaser on the home page; the full lightbox lives on /gallery. */
export function GalleryPreview({ gallery }: { gallery: GalleryItem[] }) {
  const items = visibleGallery(gallery).slice(0, 6);
  if (items.length === 0) return null;

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-heading"
      className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container">
        <SectionHeading
          id="gallery-heading"
          eyebrow="Gallery"
          title="A look at the centre"
          description="Facility, diagnostic and dental photographs. Click any image on the gallery page to view it larger."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`group relative overflow-hidden rounded-2xl bg-brand-50 shadow-card ring-1 ring-brand-900/8 ${
                index === 0 ? 'lg:col-span-2 lg:row-span-1' : ''
              }`}
            >
              <div className={`relative w-full ${index === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-brand-950/85 to-transparent p-4">
                <p className="text-sm font-bold text-white">{item.caption ?? item.category}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href="/gallery" className={buttonStyles({ variant: 'primary', size: 'md' })}>
            View full gallery
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
