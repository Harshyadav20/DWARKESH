import { EmergencyBar } from '@/components/layout/emergency-bar';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { FloatingActions } from '@/components/layout/floating-actions';
import { JsonLd } from '@/components/seo/json-ld';
import { clinicJsonLd, websiteJsonLd } from '@/lib/seo';
import { getContent } from '@/lib/store';
import { contact } from '@/lib/site';

/** Marketing-site chrome, shared by every public page. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { settings } = await getContent();

  return (
    <div className="flex min-h-screen flex-col pb-[3.75rem] md:pb-0">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>

      <EmergencyBar
        phone={settings.emergencyPhone}
        note={settings.emergencyNote}
        enabled={settings.emergencyEnabled}
      />
      <SiteHeader phoneDisplay={contact.phoneDisplay} whatsappEnabled={settings.whatsappEnabled} />

      <main id="main" className="flex-1">
        {children}
      </main>

      <SiteFooter settings={settings} />

      <FloatingActions
        phone={contact.phoneDisplay}
        enabled={settings.floatingButtonsEnabled}
        whatsappEnabled={settings.whatsappEnabled}
      />

      <JsonLd data={clinicJsonLd(settings)} />
      <JsonLd data={websiteJsonLd()} />
    </div>
  );
}
