import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarCheck, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import { PageHero } from '@/components/layout/page-hero';
import { AppointmentSection } from '@/components/appointment/appointment-section';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { JsonLd } from '@/components/seo/json-ld';
import { buttonStyles } from '@/components/ui/button';
import { buildMetadata, breadcrumbJsonLd } from '@/lib/seo';
import { address, clinic, contact } from '@/lib/site';
import { callHref, whatsappHref } from '@/lib/links';
import { getContent } from '@/lib/store';

export const metadata: Metadata = buildMetadata({
  title: 'Book Appointment',
  description: `Book an appointment at ${clinic.legalName}, ${address.locality}, ${address.city}. Request a doctor consultation, diagnostic test, dental appointment or home visit — or call ${contact.phoneDisplay}.`,
  path: '/book-appointment',
  keywords: [
    'book appointment medical centre Malad East',
    'doctor appointment Malad East',
    'online appointment Mumbai clinic',
  ],
});

const notes = [
  {
    icon: ShieldCheck,
    title: 'Your details stay private',
    text: 'Information submitted here is used only to arrange your appointment at the centre.',
  },
  {
    icon: CalendarCheck,
    title: 'We confirm every request',
    text: 'Our team calls or messages you to confirm the date and time before your visit.',
  },
  {
    icon: Phone,
    title: 'Need it today?',
    text: `Call ${contact.phoneDisplay} and our team will help you find the earliest suitable slot.`,
  },
];

export default async function BookAppointmentPage() {
  const { settings, doctors } = await getContent();

  return (
    <>
      <PageHero
        eyebrow="Book Appointment"
        title="Request your appointment"
        description={`Choose your department, preferred date and time. ${clinic.legalName} confirms every request personally — by phone or WhatsApp.`}
        trail={[{ name: 'Home', href: '/' }, { name: 'Book Appointment', href: '/book-appointment' }]}
      >
        <a href={callHref} className={buttonStyles({ variant: 'primary', size: 'md' })}>
          <Phone className="h-4 w-4" aria-hidden="true" />
          Call {contact.phoneDisplay}
        </a>
        {settings.whatsappEnabled && (
          <a
            href={whatsappHref(
              `Hello ${clinic.legalName}, I would like to book an appointment. Please share the available timings.`,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles({ variant: 'whatsapp', size: 'md' })}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Book on WhatsApp
          </a>
        )}
      </PageHero>

      <AppointmentSection doctors={doctors} settings={settings} />

      <section aria-label="Good to know" className="bg-white py-14">
        <div className="container grid gap-5 md:grid-cols-3">
          {notes.map((note) => (
            <div key={note.title} className="card p-6">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                <note.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-base font-bold text-brand-950">{note.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">{note.text}</p>
            </div>
          ))}
        </div>

        <p className="container mt-8 text-center text-sm text-ink-600">
          Looking for a home visit instead?{' '}
          <Link href="/home-visit" className="link-underline">
            Request healthcare at home
          </Link>
          .
        </p>
      </section>

      <EmergencyCta settings={settings} />

      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Book Appointment', path: '/book-appointment' },
        ])}
      />
    </>
  );
}
