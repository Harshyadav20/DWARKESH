import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { ServiceCard } from '@/components/cards/service-card';
import { quickServiceSlugs } from '@/lib/data/services';
import type { ServiceItem } from '@/lib/types';
import Link from 'next/link';
import { buttonStyles } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

/**
 * "Our Services" — the ten services listed by the clinic, in the supplied order.
 */
export function ServicesPreview({ services }: { services: ServiceItem[] }) {
  const bySlug = new Map(services.map((service) => [service.slug, service]));

  const ordered = [
    ...quickServiceSlugs.map((slug) => bySlug.get(slug)).filter((s): s is ServiceItem => Boolean(s)),
    ...services.filter(
      (service) =>
        service.visible !== false &&
        !quickServiceSlugs.includes(service.slug as (typeof quickServiceSlugs)[number]),
    ),
  ];

  return (
    <section id="services" aria-labelledby="services-heading" className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24">
      <div className="container">
        <SectionHeading
          id="services-heading"
          eyebrow="Our Services"
          title="Healthcare services under one roof"
          description="Consultation, diagnostics, dental care and home visits — so patients can complete most of their healthcare needs in a single visit to the centre."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ordered.map((service, index) => (
            <Reveal key={service.id} delay={Math.min(index, 7) * 45} className="h-full">
              <ServiceCard service={service} className="h-full" />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/services" className={buttonStyles({ variant: 'outline', size: 'md' })}>
            View all medical services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link href="/diagnostics" className={buttonStyles({ variant: 'primary', size: 'md' })}>
            Explore diagnostic services
          </Link>
        </div>

      </div>
    </section>
  );
}
