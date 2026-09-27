import { SectionHeading } from '@/components/ui/section-heading';
import { ContactActions, ContactAddressCard } from './contact-details';
import { MapPanel } from './map-panel';
import { clinic } from '@/lib/site';
import type { SiteSettings } from '@/lib/types';

/**
 * Contact + Google Map block, shared by the home page and /contact.
 */
export function ContactSection({
  settings,
  showHeading = true,
  id = 'contact',
}: {
  settings: SiteSettings;
  showHeading?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={showHeading ? 'contact-heading' : undefined}
      className="scroll-mt-24 bg-white py-16 sm:py-20 lg:py-24"
    >
      <div className="container">
        {showHeading && (
          <SectionHeading
            id="contact-heading"
            eyebrow="Contact Us"
            title={`Visit or contact ${clinic.name}`}
            description="Call, WhatsApp, email or drop in at the centre in Malad East. Every button below opens the matching app so you are never left guessing."
          />
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div className="space-y-6">
            <ContactActions settings={settings} />
            <ContactAddressCard settings={settings} />
          </div>
          <MapPanel />
        </div>
      </div>
    </section>
  );
}
