import type { Metadata } from 'next';
import Link from 'next/link';
import { Camera, Info } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { LightboxGallery } from '@/components/gallery/lightbox-gallery';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { JsonLd } from '@/components/seo/json-ld';
import { buttonStyles } from '@/components/ui/button';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { address, clinic } from '@/lib/site';
import { getContent, visibleGallery } from '@/lib/store';
import { galleryCategories } from '@/lib/data/gallery';

export const metadata: Metadata = buildMetadata({
  title: 'Gallery',
  description: `Photographs of ${clinic.legalName}, ${address.locality}, ${address.city} — the clinic, diagnostic services, dental clinic and medical equipment.`,
  path: '/gallery',
  image: '/images/gallery-reception.jpg',
  keywords: ['medical centre gallery Malad East', 'diagnostic centre photos Mumbai'],
});

export default async function GalleryPage() {
  const { settings, gallery } = await getContent();
  const items = visibleGallery(gallery);

  // Only show category filters that actually have photographs.
  const usedCategories = galleryCategories.filter(
    (category) => category === 'All' || items.some((item) => item.category === category),
  );
  const categories: string[] = [...usedCategories];

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="A look at the centre"
        description={`Facility, diagnostic, dental and healthcare photographs from ${clinic.legalName} in ${address.locality}, ${address.city}. Click any image to view it larger.`}
        trail={[{ name: 'Home', href: '/' }, { name: 'Gallery', href: '/gallery' }]}
      >
        <Link href="/contact" className={buttonStyles({ variant: 'primary', size: 'md' })}>
          Visit the centre
        </Link>
        <Link href="/book-appointment" className={buttonStyles({ variant: 'outline', size: 'md' })}>
          Book an appointment
        </Link>
      </PageHero>

      <section aria-labelledby="gallery-grid" className="bg-white py-14 sm:py-16">
        <div className="container">
          <h2 id="gallery-grid" className="sr-only">
            Clinic gallery
          </h2>

          <LightboxGallery items={items} categories={categories} />

          <div className="mt-12 flex items-start gap-3 rounded-2xl border border-brand-900/8 bg-brand-50/60 p-5">
            <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand-700" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-ink-700">
              Photographs shown here represent the services available at the centre. Current
              photographs of the clinic, equipment and doctors are added as they are shared by{' '}
              {clinic.legalName} — doctor photographs are published only with the doctor’s consent.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/diagnostics" className={buttonStyles({ variant: 'outline', size: 'md' })}>
              <Camera className="h-4 w-4" aria-hidden="true" />
              Diagnostic services
            </Link>
            <Link href="/dental" className={buttonStyles({ variant: 'outline', size: 'md' })}>
              Dental clinic
            </Link>
            <Link href="/services" className={buttonStyles({ variant: 'outline', size: 'md' })}>
              All services
            </Link>
          </div>
        </div>
      </section>

      <EmergencyCta settings={settings} />

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Gallery', path: '/gallery' },
        ])}
      />
    </>
  );
}
