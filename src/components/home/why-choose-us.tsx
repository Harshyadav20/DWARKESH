import { HeartHandshake, House, MapPin, Microscope, ShieldCheck, Users } from 'lucide-react';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';

/**
 * Why Choose Dwarkesh Medical Centre?
 * Six cards. Copy stays strictly factual — no "No.1", "best" or award claims.
 */
const reasons = [
  {
    icon: Users,
    title: 'Experienced Medical Professionals',
    text: 'Consultation with qualified doctors across internal medicine, obstetrics & gynaecology and dentistry.',
  },
  {
    icon: ShieldCheck,
    title: 'Comprehensive Healthcare Services',
    text: 'Polyclinic, diagnostics, dental care and home visits available from a single centre.',
  },
  {
    icon: Microscope,
    title: 'Diagnostic Facilities',
    text: 'Digital X-Ray, sonography, ECG, 2D Echo, digital mammography and pathology on site.',
  },
  {
    icon: MapPin,
    title: 'Convenient Location',
    text: 'Shop No. 4, Swapnikiran Building, Pimparipada, Malad East, Mumbai – 400097.',
  },
  {
    icon: House,
    title: 'Home Visit Services',
    text: 'Healthcare support at home for patients who find it difficult to travel to the centre.',
  },
  {
    icon: HeartHandshake,
    title: 'Patient-Centred Care',
    text: 'Clear guidance on tests and reports, with time to answer questions during consultation.',
  },
];

export function WhyChooseUs() {
  return (
    <section
      id="why-choose-us"
      aria-labelledby="why-heading"
      className="relative scroll-mt-24 overflow-hidden bg-brand-900 py-16 text-white sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(124,203,214,0.18),transparent_40%),radial-gradient(circle_at_90%_90%,rgba(85,189,127,0.16),transparent_40%)]"
      />
      <div className="container relative">
        <SectionHeading
          id="why-heading"
          tone="dark"
          eyebrow="Why Choose Us"
          title="Why choose Dwarkesh Medical Centre?"
          description="A neighbourhood medical centre built around convenient access — consultation, diagnostics and dental care together, with home visits when travelling is difficult."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((reason, index) => (
            <Reveal as="li" key={reason.title} delay={index * 50} className="h-full">
              <div className="h-full rounded-2xl border border-white/12 bg-white/[0.06] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-400/20 text-brand-100 ring-1 ring-white/15">
                  <reason.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-white">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-100/75">{reason.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
