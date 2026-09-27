'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CalendarCheck,
  CheckCircle2,
  Loader2,
  MessageCircle,
  Phone,
  ShieldCheck,
  TriangleAlert,
} from 'lucide-react';
import { Button, buttonStyles } from '@/components/ui/button';
import { appointmentSchema } from '@/lib/validation';
import { appointmentWhatsappHref, callHref } from '@/lib/links';
import { clinic, contact } from '@/lib/site';
import { cn, formatDate, todayInIst } from '@/lib/utils';
import type { Doctor } from '@/lib/types';

type Props = {
  doctors: Doctor[];
  departments: string[];
  timeSlots: string[];
  notice?: string;
  compact?: boolean;
};

type FormState = {
  patientName: string;
  mobile: string;
  email: string;
  doctor: string;
  department: string;
  preferredDate: string;
  preferredTime: string;
  reason: string;
  /** Honeypot field — hidden from users, must stay empty. */
  company?: string;
};

const emptyForm: FormState = {
  patientName: '',
  mobile: '',
  email: '',
  doctor: '',
  department: '',
  preferredDate: '',
  preferredTime: '',
  reason: '',
};

/**
 * Appointment request form.
 *
 * Validation: React Hook Form + Zod (same schema as the API route).
 * Submission: POST /api/appointments. The visitor always gets a way through —
 * on success a confirmation with a reference, and a WhatsApp/phone fallback if
 * the request could not be stored (e.g. no database configured yet).
 */
export function AppointmentForm({
  doctors,
  departments,
  timeSlots,
  notice,
  compact = false,
}: Props) {
  const searchParams = useSearchParams();
  const startedAt = useRef<number>(Date.now());
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<
    | { status: 'success'; reference: string; stored: boolean }
    | { status: 'error'; message: string }
    | null
  >(null);
  const [submitting, setSubmitting] = useState(false);

  const defaultDoctor = searchParams.get('doctor') ?? '';
  const defaultDepartment =
    searchParams.get('department') ??
    (doctors.find((d) => d.name === defaultDoctor)?.department || '');
  const defaultService = searchParams.get('service') ?? '';

  const formMethods = useForm<FormState>({
    resolver: zodResolver(appointmentSchema) as unknown as Resolver<FormState>,
    defaultValues: {
      ...emptyForm,
      doctor: defaultDoctor,
      department: defaultDepartment,
      reason: defaultService ? `Enquiry about ${defaultService}` : '',
    },
    mode: 'onBlur',
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitSuccessful },
  } = formMethods;

  // `watch()` (no field name) subscribes to the whole form so the WhatsApp
  // fallback link below always reflects what the visitor has typed.
  const watched = watch();
  const doctorValue = watched.doctor ?? '';
  const departmentValue = watched.department ?? '';

  // Keep department in sync when a doctor is chosen.
  useEffect(() => {
    if (!doctorValue) return;
    const doctor = doctors.find((d) => d.name === doctorValue);
    if (doctor?.department) setValue('department', doctor.department);
  }, [doctorValue, doctors, setValue]);

  // Re-apply URL params when the user navigates to the form with a new query.
  useEffect(() => {
    if (defaultDoctor) setValue('doctor', defaultDoctor);
    if (defaultDepartment) setValue('department', defaultDepartment);
    if (defaultService) setValue('reason', `Enquiry about ${defaultService}`);
  }, [defaultDoctor, defaultDepartment, defaultService, setValue]);

  /**
   * WhatsApp link rebuilt from the current field values on every render, so the
   * "Book on WhatsApp" button always carries exactly what the visitor typed —
   * even if the API request fails or no backend is configured.
   */
  const whatsappFallback = appointmentWhatsappHref({
    name: watched.patientName ?? '',
    phone: watched.mobile ?? '',
    email: watched.email ?? '',
    doctor: doctorValue,
    department: departmentValue,
    date: watched.preferredDate ?? '',
    time: watched.preferredTime ?? '',
    reason: watched.reason ?? '',
  });

  const onSubmit = (values: FormState) => {
    setSubmitting(true);
    startTransition(async () => {
      try {
        const response = await fetch('/api/appointments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...values,
            formStartedAt: String(startedAt.current),
          }),
        });
        const data = (await response.json()) as {
          ok?: boolean;
          reference?: string;
          stored?: boolean;
          error?: string;
        };

        if (response.ok && data.ok) {
          setResult({
            status: 'success',
            reference: data.reference ?? '—',
            stored: data.stored !== false,
          });
        } else {
          setResult({
            status: 'error',
            message: data.error ?? 'We could not submit your request. Please call or use WhatsApp.',
          });
        }
      } catch {
        setResult({
          status: 'error',
          message: 'Network problem while submitting. Please call or send the request on WhatsApp.',
        });
      } finally {
        setSubmitting(false);
      }
    });
  };

  if (result?.status === 'success' || isSubmitSuccessful) {
    const reference = result?.status === 'success' ? result.reference : '—';
    const stored = result?.status === 'success' ? result.stored : true;

    return (
      <div className="card p-7 sm:p-9" role="status" aria-live="polite">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-leaf-50 text-leaf-600 ring-1 ring-leaf-100">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </span>
        <h3 className="mt-5 font-display text-2xl font-extrabold text-brand-950">
          Appointment request received
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Thank you. Our team will call you on{' '}
          <span className="font-semibold text-brand-900">{contact.phoneDisplay}</span> to confirm the
          slot. Your reference is{' '}
          <span className="font-semibold text-brand-900">{reference}</span>.
        </p>
        {!stored && (
          <p className="mt-3 rounded-xl bg-brand-50 p-3 text-sm text-brand-800 ring-1 ring-brand-100">
            To make sure we have your request on record, please also send it on WhatsApp using the
            button below.
          </p>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={whatsappFallback}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonStyles({ variant: 'whatsapp', size: 'md' })}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Send details on WhatsApp
          </a>
          <a href={callHref} className={buttonStyles({ variant: 'outline', size: 'md' })}>
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {contact.phoneDisplay}
          </a>
          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              reset(emptyForm);
              setResult(null);
              startedAt.current = Date.now();
            }}
          >
            Book another appointment
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className={cn('card p-6 sm:p-8', compact && 'p-5 sm:p-6')}
      aria-labelledby="appointment-form-heading"
    >
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register('company')}
      />

      <h3
        id="appointment-form-heading"
        className="font-display text-xl font-extrabold text-brand-950 sm:text-2xl"
      >
        Request an appointment
      </h3>
      <p className="mt-1.5 text-sm text-ink-600">
        Fill in your details and we will confirm your slot by phone or WhatsApp.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="patientName" className="label">
            Patient name <span className="text-alert">*</span>
          </label>
          <input
            id="patientName"
            autoComplete="name"
            className={cn('input', errors.patientName && 'input-error')}
            placeholder="Full name"
            aria-invalid={Boolean(errors.patientName)}
            aria-describedby={errors.patientName ? 'patientName-error' : undefined}
            {...register('patientName')}
          />
          {errors.patientName && (
            <p className="error-text" id="patientName-error" role="alert">
              {errors.patientName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="mobile" className="label">
            Mobile number <span className="text-alert">*</span>
          </label>
          <input
            id="mobile"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className={cn('input', errors.mobile && 'input-error')}
            placeholder="10-digit mobile number"
            aria-invalid={Boolean(errors.mobile)}
            aria-describedby={errors.mobile ? 'mobile-error' : undefined}
            {...register('mobile')}
          />
          {errors.mobile && (
            <p className="error-text" id="mobile-error" role="alert">
              {errors.mobile.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="label">
            Email <span className="font-normal text-ink-400">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={cn('input', errors.email && 'input-error')}
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p className="error-text" id="email-error" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="department" className="label">
            Department <span className="text-alert">*</span>
          </label>
          <select
            id="department"
            className={cn('input', errors.department && 'input-error')}
            aria-invalid={Boolean(errors.department)}
            {...register('department')}
          >
            <option value="">Select department</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="doctor" className="label">
            Doctor <span className="font-normal text-ink-400">(optional)</span>
          </label>
          <select id="doctor" className="input" {...register('doctor')}>
            <option value="">Any available doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.name}>
                {doctor.name} — {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="preferredDate" className="label">
            Preferred date <span className="text-alert">*</span>
          </label>
          <input
            id="preferredDate"
            type="date"
            min={todayInIst()}
            className={cn('input', errors.preferredDate && 'input-error')}
            aria-invalid={Boolean(errors.preferredDate)}
            aria-describedby={errors.preferredDate ? 'preferredDate-error' : undefined}
            {...register('preferredDate')}
          />
          {errors.preferredDate && (
            <p className="error-text" id="preferredDate-error" role="alert">
              {errors.preferredDate.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="preferredTime" className="label">
            Preferred time <span className="text-alert">*</span>
          </label>
          <select
            id="preferredTime"
            className={cn('input', errors.preferredTime && 'input-error')}
            aria-invalid={Boolean(errors.preferredTime)}
            aria-describedby={errors.preferredTime ? 'preferredTime-error' : undefined}
            {...register('preferredTime')}
          >
            <option value="">Select a time</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.preferredTime && (
            <p className="error-text" id="preferredTime-error" role="alert">
              {errors.preferredTime.message}
            </p>
          )}
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="reason" className="label">
            Reason for visit <span className="font-normal text-ink-400">(optional)</span>
          </label>
          <textarea
            id="reason"
            rows={3}
            className="input resize-y"
            placeholder="e.g. fever and cough for 3 days, dental pain, blood test follow-up"
            {...register('reason')}
          />
          <p className="mt-1.5 text-xs text-ink-500">
            Please do not share detailed medical records here — bring them to your appointment.
          </p>
        </div>
      </div>

      {result?.status === 'error' && (
        <p
          className="mt-5 flex items-start gap-2 rounded-xl bg-alert-soft p-3.5 text-sm font-medium text-alert ring-1 ring-alert/20"
          role="alert"
        >
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            {result.message} You can also{' '}
            <a href={whatsappFallback} target="_blank" rel="noopener noreferrer" className="underline">
              send this request on WhatsApp
            </a>{' '}
            or call {contact.phoneDisplay}.
          </span>
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" variant="primary" size="lg" disabled={submitting || isPending}>
          {submitting || isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <CalendarCheck className="h-5 w-5" aria-hidden="true" />
          )}
          {submitting || isPending ? 'Sending request…' : 'Request Appointment'}
        </Button>

        <a
          href={whatsappFallback}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles({ variant: 'whatsapp', size: 'lg' })}
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          Book on WhatsApp
        </a>
      </div>

      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-500">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-leaf-600" aria-hidden="true" />
        Your details are used only to arrange this appointment at {clinic.legalName}. We do not sell
        or share patient information.
      </p>

      {notice && (
        <p className="mt-3 rounded-xl bg-brand-50 p-3.5 text-xs leading-relaxed text-brand-800 ring-1 ring-brand-100">
          {notice}
        </p>
      )}

      <p className="mt-3 text-xs text-ink-500">
        Preferred date and time are requests — the centre confirms the final slot by phone.{' '}
        <span className="font-semibold text-brand-800">
          Today: {formatDate(new Date().toISOString())}
        </span>
      </p>
    </form>
  );
}
