import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageCircle, Phone } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { FaqAccordion } from '@/components/faq/faq-accordion';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { JsonLd } from '@/components/seo/json-ld';
import { buttonStyles } from '@/components/ui/button';
import { buildMetadata, breadcrumbJsonLd, faqJsonLd } from '@/lib/seo';
import { clinic, contact } from '@/lib/site';
import { callHref, whatsappHref } from '@/lib/links';
import { faqs } from '@/lib/data/faq';
import { getContent } from '@/lib/store';

export const metadata: Metadata = buildMetadata({
  title: 'FAQ',
  description: `Frequently asked questions about ${clinic.legalName} — location, clinic timings, diagnostic tests, dental services, home visits and how to book an appointment.`,
  path: '/faq',
  keywords: ['medical centre FAQ Malad East', 'clinic timings Malad East', 'home visit Malad East'],
});

export default async function FaqPage() {
  const { settings } = await getContent();

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Frequently asked questions"
        description="Practical answers about visiting the centre, diagnostic tests, dental care, home visits and appointments."
        trail={[{ name: 'Home', href: '/' }, { name: 'FAQ', href: '/faq' }]}
      >
        <a href={callHref} className={buttonStyles({ variant: 'primary', size: 'md' })}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call {contact.phoneDisplay}
        </a>
        <Link href="/book-appointment" className={buttonStyles({ variant: 'outline', size: 'md' })}>
          Book an appointment
        </Link>
      </PageHero>

      <section aria-labelledby="faq-list" className="bg-white py-14 sm:py-16">
        <div className="container max-w-4xl">
          <h2 id="faq-list" className="sr-only">
            Questions and answers
          </h2>
          <FaqAccordion items={faqs} />

          <div className="mt-10 rounded-2xl border border-brand-900/8 bg-brand-50/60 p-6 text-center">
            <p className="font-display text-lg font-bold text-brand-950">Still have a question?</p>
            <p className="mt-2 text-sm text-ink-600">
              Call the centre or send a WhatsApp message — our team will help you.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={callHref} className={buttonStyles({ variant: 'primary', size: 'md' })}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call {contact.phoneDisplay}
              </a>
              {settings.whatsappEnabled && (
                <a
                  href={whatsappHref(`Hello ${clinic.legalName}, I have a question about your services.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonStyles({ variant: 'whatsapp', size: 'md' })}
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  WhatsApp Us
                </a>
              )}
            </div>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-ink-500">
            Answers on this page describe clinic services and processes only. They are not medical
            advice. For anything about symptoms, medicines or tests, please consult a doctor.
          </p>
        </div>
      </section>

      <EmergencyCta settings={settings} />

      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' },
        ])}
      />
    </>
  );
}
