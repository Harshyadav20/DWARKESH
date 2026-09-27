import Link from 'next/link';
import { ChevronRight, Phone } from 'lucide-react';
import { buttonStyles } from '@/components/ui/button';
import { contact } from '@/lib/site';
import { callHref } from '@/lib/links';

/**
 * Interior page header with breadcrumb trail.
 * Renders a real <nav aria-label="Breadcrumb"> so assistive tech can follow it.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  trail,
  children,
  image,
}: {
  eyebrow?: string;
  title: string;
  description?: React.ReactNode;
  trail: { name: string; href: string }[];
  children?: React.ReactNode;
  image?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
      <div aria-hidden="true" className="bg-grid mask-fade-b absolute inset-0 opacity-70" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/30 blur-3xl"
      />

      <div className="container relative py-12 sm:py-14 lg:py-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink-500">
            {trail.map((item, index) => {
              const last = index === trail.length - 1;
              return (
                <li key={item.href} className="flex items-center gap-1.5">
                  {last ? (
                    <span aria-current="page" className="text-brand-800">
                      {item.name}
                    </span>
                  ) : (
                    <Link href={item.href} className="rounded transition-colors hover:text-brand-700">
                      {item.name}
                    </Link>
                  )}
                  {!last && <ChevronRight className="h-3 w-3 text-ink-300" aria-hidden="true" />}
                </li>
              );
            })}
          </ol>
        </nav>

        <div className={`mt-5 grid gap-10 ${image ? 'lg:grid-cols-[1.05fr_1fr] lg:items-center' : ''}`}>
          <div className="max-w-3xl">
            {eyebrow && (
              <p className="text-2xs font-bold uppercase tracking-[0.18em] text-brand-700">
                {eyebrow}
              </p>
            )}
            <h1 className="mt-3 font-display text-[2.1rem] font-extrabold leading-[1.08] tracking-tight text-brand-950 sm:text-[2.75rem] lg:text-[3.1rem]">
              {title}
            </h1>
            {description && (
              <p className="mt-4 max-w-2xl text-[0.975rem] leading-relaxed text-ink-600 sm:text-lg">
                {description}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {children ?? (
                <>
                  <Link href="/book-appointment" className={buttonStyles({ variant: 'primary', size: 'md' })}>
                    Book an Appointment
                  </Link>
                  <a
                    href={callHref}
                    className={buttonStyles({ variant: 'outline', size: 'md' })}
                    aria-label={`Call the centre on ${contact.phoneDisplay}`}
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call {contact.phoneDisplay}
                  </a>
                </>
              )}
            </div>
          </div>

          {image}
        </div>
      </div>
    </section>
  );
}
