import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { buttonStyles } from '@/components/ui/button';
import { clinic } from '@/lib/site';

const emphasised = [
  'Convenient healthcare',
  'Diagnostic services',
  'Doctor consultations',
  'Dental care',
  'Home visits',
  'Patient-focused service',
  'Modern diagnostic facilities',
];

export function AboutPreview() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-24 bg-brand-50/60 py-16 sm:py-20 lg:py-24"
    >
      <div className="container grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-3xl shadow-card ring-1 ring-brand-900/10">
            <Image
              src="/images/gallery-reception.jpg"
              alt={`Reception and waiting area at ${clinic.legalName} in Malad East, Mumbai`}
              width={1000}
              height={800}
              sizes="(max-width: 1023px) 100vw, 46vw"
              className="h-[320px] w-full object-cover sm:h-[420px]"
            />
          </div>
          <div className="absolute -bottom-6 right-4 max-w-[15rem] rounded-2xl border border-brand-900/8 bg-white p-4 shadow-card sm:right-6">
            <p className="font-display text-3xl font-extrabold text-brand-800">1</p>
            <p className="mt-1 text-sm font-medium leading-snug text-ink-600">
              location for consultation, diagnostics, dental care and home visits
            </p>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <SectionHeading
            id="about-heading"
            align="left"
            eyebrow="About Us"
            title="About Dwarkesh Medical Centre"
            description="Dwarkesh Medical Centre LLP is a healthcare and diagnostic centre providing a range of medical, diagnostic, dental and home healthcare services."
          />

          <p className="mt-5 text-[0.975rem] leading-relaxed text-ink-600">
            Patients visiting the centre can consult our doctors, complete diagnostic tests and
            receive dental care in the same place. Where travelling to the clinic is difficult, home
            visit services are available so that care can continue at home.
          </p>

          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {emphasised.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-700">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-brand-900">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/about" className={buttonStyles({ variant: 'primary', size: 'md' })}>
              Read more about us
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/doctors" className={buttonStyles({ variant: 'outline', size: 'md' })}>
              Meet our doctors
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
