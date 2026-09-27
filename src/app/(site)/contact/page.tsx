import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/layout/page-hero';
import { ContactSection } from '@/components/contact/contact-section';
import { MessageComposer } from '@/components/contact/message-composer';
import { AppointmentSection } from '@/components/appointment/appointment-section';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { FaqAccordion } from '@/components/faq/faq-accordion';
import { SectionHeading } from '@/components/ui/section-heading';
import { JsonLd } from '@/components/seo/json-ld';
import { buttonStyles } from '@/components/ui/button';
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { address, clinic, contact } from '@/lib/site';
import { faqs } from '@/lib/data/faq';
import { getContent } from '@/lib/store';

export const metadata: Metadata = buildMetadata({
  title: 'Contact Us',
  description: `Contact ${clinic.legalName} — ${address.line1}, ${address.line2}, ${address.locality}, ${address.city} ${address.postalCode}. Phone ${contact.phoneDisplay}, email ${contact.email}. Get directions on Google Maps.`,
  path: '/contact',
  keywords: [
    'medical centre contact Malad East',
    'clinic near Malad East',
    'Dwarkesh Medical Centre phone number',
  ],
});

export default async function ContactPage() {
  const { settings, doctors } = await getContent();

  return (
    <>
      <PageHero
        eyebrow="Contact Us"
        title="Get in touch with the centre"
        description={`Call, WhatsApp, email or visit ${clinic.legalName} at ${address.line1}, ${address.line2}, ${address.locality}, ${address.city} – ${address.postalCode}.`}
        trail={[{ name: 'Home', href: '/' }, { name: 'Contact', href: '/contact' }]}
      >
        <Link href="/book-appointment" className={buttonStyles({ variant: 'primary', size: 'md' })}>
          Book an Appointment
        </Link>
        <Link href="/gallery" className={buttonStyles({ variant: 'outline', size: 'md' })}>
          See the centre
        </Link>
      </PageHero>

      <ContactSection settings={settings} showHeading={false} />

      <section aria-labelledby="message-heading" className="bg-brand-50/60 py-16 sm:py-20">
        <div className="container grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              id="message-heading"
              align="left"
              eyebrow="Write To Us"
              title="Send a message"
              description="Prefer writing? Type your question below and send it straight to the centre on WhatsApp or by email."
              className="mt-0"
            />
            <MessageComposer />
          </div>

          <div>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Common questions"
              description="Timings, diagnostics, home visits and appointments."
              className="mt-0"
            />
            <FaqAccordion items={faqs} />
          </div>
        </div>
      </section>

      <AppointmentSection doctors={doctors} settings={settings} showHeading={false} compact />
      <EmergencyCta settings={settings} />

      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Contact', path: '/contact' },
        ])}
      />
    </>
  );
}
