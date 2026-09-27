import { Suspense } from 'react';
import { Clock, Phone, ShieldCheck } from 'lucide-react';
import { AppointmentForm } from './appointment-form';
import { SectionHeading } from '@/components/ui/section-heading';
import { contact } from '@/lib/site';
import { callHref } from '@/lib/links';
import { buildTimeSlots } from '@/lib/utils';
import { visibleDoctors } from '@/lib/store';
import type { Doctor, SiteSettings } from '@/lib/types';

const baseDepartments = [
  'Polyclinic',
  'Diagnostics',
  'Pathology',
  'Dental',
  'Obstetrics & Gynaecology',
  'Home Visit',
];

function FormFallback() {
  return (
    <div className="card flex min-h-[26rem] items-center justify-center p-8 text-sm text-ink-500">
      Loading the appointment form…
    </div>
  );
}

/**
 * Appointment section (home page + /book-appointment).
 * Departments are derived from the doctor list and the clinic's own service
 * groups so the select never shows a department that does not exist.
 */
export function AppointmentSection({
  doctors,
  settings,
  compact = false,
  showHeading = true,
}: {
  doctors: Doctor[];
  settings: SiteSettings;
  compact?: boolean;
  showHeading?: boolean;
}) {
  const visible = visibleDoctors(doctors);
  const departments = Array.from(
    new Set([...baseDepartments, ...visible.map((doctor) => doctor.department).filter(Boolean)]),
  ).filter(Boolean);
  const timeSlots = buildTimeSlots(settings.clinicHours);

  return (
    <section
      id="book-appointment"
      aria-labelledby="appointment-heading"
      className="scroll-mt-24 bg-brand-50/60 py-16 sm:py-20 lg:py-24"
    >
      <div className="container grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
        <div>
          {showHeading && (
            <SectionHeading
              id="appointment-heading"
              align="left"
              eyebrow="Book Appointment"
              title="Request an appointment"
              description="Send us your preferred date and time. Our team confirms every appointment personally on call or WhatsApp."
            />
          )}

          <ul className="mt-7 space-y-4">
            <li className="flex items-start gap-3 rounded-2xl border border-brand-900/8 bg-white p-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-brand-950">Clinic hours</p>
                <p className="text-sm text-ink-600">
                  {settings.openDays}: {settings.clinicHours}
                </p>
                <p className="mt-0.5 text-sm text-ink-600">
                  Home visit: {settings.homeVisitHours}
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 rounded-2xl border border-brand-900/8 bg-white p-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">
                <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-brand-950">What happens next</p>
                <p className="text-sm text-ink-600">
                  We call or message you to confirm the slot. Bring any previous reports or
                  prescriptions to your appointment.
                </p>
              </div>
            </li>

            <li className="flex items-start gap-3 rounded-2xl border border-brand-900/8 bg-white p-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-royal-50 text-royal-700">
                <Phone className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-brand-950">Prefer to talk?</p>
                <p className="text-sm text-ink-600">
                  Call{' '}
                  <a href={callHref} className="link-underline">
                    {contact.phoneDisplay}
                  </a>{' '}
                  and we will book it for you.
                </p>
              </div>
            </li>
          </ul>

          {!compact && (
            <p className="mt-6 text-xs leading-relaxed text-ink-500">
              This form is for appointment requests only. If you have a medical emergency, call the
              centre immediately or visit the nearest hospital emergency department.
            </p>
          )}
        </div>

        <Suspense fallback={<FormFallback />}>
          <AppointmentForm
            doctors={visible}
            departments={departments}
            timeSlots={timeSlots}
            notice={settings.appointmentNotice}
            compact={compact}
          />
        </Suspense>
      </div>
    </section>
  );
}
