import Image from 'next/image';
import Link from 'next/link';
import { Clock, House, MessageCircle, Stethoscope } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { buttonStyles } from '@/components/ui/button';
import { homeVisitWhatsappHref } from '@/lib/links';
import { servicesByGroup } from '@/lib/store';
import { resolveIcon } from '@/lib/icons';
import type { ServiceItem, SiteSettings } from '@/lib/types';

export function HomeVisitPreview({
  services,
  settings,
}: {
  services: ServiceItem[];
  settings: SiteSettings;
}) {
  const list = servicesByGroup(services, 'home-visit');

  return (
    <section
      id="home-visit"
      aria-labelledby="home-visit-heading"
      className="relative scroll-mt-24 overflow-hidden bg-brand-800 py-16 text-white sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(124,203,214,0.22),transparent_45%)]"
      />
      <div className="container relative grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl shadow-float ring-1 ring-white/15">
            <Image
              src="/images/home-visit.jpg"
              alt="Doctor attending a patient during a home visit arranged by Dwarkesh Medical Centre LLP"
              width={1000}
              height={820}
              sizes="(max-width: 1023px) 100vw, 44vw"
              className="h-[300px] w-full object-cover sm:h-[400px]"
            />
          </div>
          <div className="absolute -top-4 left-4 flex items-center gap-2 rounded-2xl bg-white px-4 py-3 shadow-float sm:left-6">
            <Clock className="h-5 w-5 text-brand-700" aria-hidden="true" />
            <div>
              <p className="text-2xs font-bold uppercase tracking-[0.12em] text-ink-500">
                Home visit hours
              </p>
              <p className="font-display text-sm font-extrabold text-brand-950">
                {settings.homeVisitHours}
              </p>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeading
            id="home-visit-heading"
            tone="dark"
            align="left"
            eyebrow="Home Visit"
            title="Healthcare at your doorstep"
            description="Home visit services are available for patients who require convenient healthcare support at home."
          />

          <ul className="mt-8 grid gap-3 sm:grid-cols-3">
            {list.map((service) => {
              const Icon = resolveIcon(service.icon);
              return (
                <li
                  key={service.id}
                  id={service.slug}
                  className="rounded-2xl border border-white/12 bg-white/[0.07] p-4"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/12 text-brand-100">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <p className="mt-3 font-display text-sm font-bold text-white">{service.name}</p>
                  <p className="mt-1 text-xs leading-relaxed text-brand-100/75">
                    {service.shortDescription}
                  </p>
                </li>
              );
            })}
          </ul>

          <p className="mt-7 inline-flex items-center gap-2 rounded-xl bg-leaf-500/15 px-3.5 py-2 text-sm font-semibold text-leaf-200 ring-1 ring-leaf-300/25">
            <House className="h-4 w-4" aria-hidden="true" />
            Home Visit Available · {settings.homeVisitHours}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {settings.whatsappEnabled ? (
              <a
                href={homeVisitWhatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles({ variant: 'whatsapp', size: 'lg' })}
              >
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Request Home Visit
              </a>
            ) : (
              <Link
                href="/home-visit"
                className={buttonStyles({ variant: 'call', size: 'lg' })}
              >
                Request Home Visit
              </Link>
            )}
            <Link
              href="/home-visit"
              className={buttonStyles({ variant: 'light', size: 'lg' })}
            >
              <Stethoscope className="h-5 w-5" aria-hidden="true" />
              How home visits work
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
