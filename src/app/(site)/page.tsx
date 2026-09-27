import { Hero } from '@/components/home/hero';
import { QuickAppointment } from '@/components/home/quick-appointment';
import { ServicesPreview } from '@/components/home/services-preview';
import { AboutPreview } from '@/components/home/about-preview';
import { WhyChooseUs } from '@/components/home/why-choose-us';
import { DoctorsPreview } from '@/components/home/doctors-preview';
import { DiagnosticsPreview } from '@/components/home/diagnostics-preview';
import { DentalPreview } from '@/components/home/dental-preview';
import { HomeVisitPreview } from '@/components/home/home-visit-preview';
import { Highlights } from '@/components/home/highlights';
import { GalleryPreview } from '@/components/home/gallery-preview';
import { AppointmentSection } from '@/components/appointment/appointment-section';
import { ContactSection } from '@/components/contact/contact-section';
import { EmergencyCta } from '@/components/emergency/emergency-cta';
import { JsonLd } from '@/components/seo/json-ld';
import { faqJsonLd, servicesJsonLd } from '@/lib/seo';
import { faqs } from '@/lib/data/faq';
import { getContent } from '@/lib/store';

/**
 * Homepage flow (as specified):
 * Emergency bar → Nav → Hero → Quick appointment CTA → Services → About →
 * Why Choose Us → Doctors → Diagnostics → Dental → Home Visit → Highlights →
 * Gallery → Appointment form → Contact + Map → Emergency CTA → Footer
 */
export default async function HomePage() {
  const { settings, doctors, services, gallery } = await getContent();

  return (
    <>
      <Hero settings={settings} />
      <QuickAppointment settings={settings} />
      <ServicesPreview services={services} />
      <AboutPreview />
      <WhyChooseUs />
      <DoctorsPreview doctors={doctors} />
      <DiagnosticsPreview services={services} settings={settings} />
      <DentalPreview services={services} />
      <HomeVisitPreview services={services} settings={settings} />
      <Highlights settings={settings} />
      <GalleryPreview gallery={gallery} />
      <AppointmentSection doctors={doctors} settings={settings} />
      <ContactSection settings={settings} />
      <EmergencyCta settings={settings} />

      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd data={servicesJsonLd(services)} />
    </>
  );
}
