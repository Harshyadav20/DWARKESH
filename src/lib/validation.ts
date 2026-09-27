import { z } from 'zod';

/**
 * Form validation schemas.
 *
 * Written with plain refinements instead of version-specific helpers so the
 * same schema works on the server (API routes) and the client (React Hook Form).
 */

const MOBILE_RE = /^(\+?91)?[6-9]\d{9}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Indian mobile number: 10 digits, optionally prefixed with +91 / 91. */
const indianMobile = z
  .string()
  .transform((v) => v.replace(/[\s()\-]/g, ''))
  .refine((v) => MOBILE_RE.test(v), { message: 'Enter a valid 10-digit mobile number' });

/** Optional email — missing or empty is allowed; anything else must look valid. */
const optionalEmail = z
  .string()
  .trim()
  .toLowerCase()
  .refine((v) => v === '' || EMAIL_RE.test(v), { message: 'Enter a valid email address' })
  .default('');

const shortText = (max: number, label: string) =>
  z.string().trim().min(1, `${label} is required`).max(max, `${label} is too long`);

const optionalText = (max: number) => z.string().trim().max(max).optional().default('');

export const appointmentSchema = z.object({
  patientName: shortText(80, 'Patient name'),
  mobile: indianMobile,
  email: optionalEmail,
  doctor: optionalText(120),
  department: optionalText(120),
  preferredDate: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid date'),
  preferredTime: z.string().trim().min(1, 'Choose a preferred time').max(40),
  reason: optionalText(600),
  /** Honeypot — hidden from humans; when filled, the request is discarded silently. */
  company: z.string().max(200).optional(),
  /** Timestamp used for a minimum-completion-time bot check. */
  formStartedAt: z.string().optional(),
});

export type AppointmentInput = z.input<typeof appointmentSchema>;
export type AppointmentValues = z.output<typeof appointmentSchema>;

export const contactSchema = z.object({
  name: shortText(80, 'Name'),
  mobile: indianMobile,
  email: optionalEmail,
  subject: optionalText(120),
  message: shortText(1200, 'Message'),
  company: z.string().max(0).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;

export const settingsSchema = z.object({
  emergencyPhone: z
    .string()
    .trim()
    .refine((v) => v === '' || /^\d{10}$/.test(v), 'Enter a 10-digit phone number'),
  emergencyNote: z.string().trim().max(120),
  emergencyEnabled: z.boolean(),
  clinicHours: z.string().trim().max(120),
  homeVisitHours: z.string().trim().max(120),
  openDays: z.string().trim().max(120),
  showSameDayResults: z.boolean(),
  diagnosticTagline: z.string().trim().max(160),
  appointmentNotice: z.string().trim().max(400),
  whatsappEnabled: z.boolean(),
  floatingButtonsEnabled: z.boolean(),
  facebookUrl: z.string().trim().max(200),
  instagramUrl: z.string().trim().max(200),
  youtubeUrl: z.string().trim().max(200),
  mapsEmbedUrl: z.string().trim().max(500),
  geoLat: z.string().trim().max(24),
  geoLng: z.string().trim().max(24),
  heroHeading: z.string().trim().max(120),
  heroSubheading: z.string().trim().max(200),
});

export const doctorSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().trim().min(1).max(120),
  qualifications: z.string().trim().max(200),
  specialization: z.string().trim().max(200),
  department: z.string().trim().max(120),
  photo: z.string().trim().max(500).nullable().optional(),
  consultationTiming: z.string().trim().max(200).nullable().optional(),
  bio: z.string().trim().max(1200).nullable().optional(),
  highlights: z.array(z.string().trim().max(200)).max(8).optional(),
  order: z.number().int().min(0).max(999),
  visible: z.boolean(),
});

export const galleryItemSchema = z.object({
  id: z.string().min(1),
  src: z.string().trim().min(1).max(500),
  alt: z.string().trim().min(1).max(300),
  category: z.enum([
    'Clinic',
    'Doctors',
    'Diagnostic Services',
    'Dental',
    'Medical Equipment',
    'Healthcare',
  ]),
  caption: z.string().trim().max(200).optional(),
  order: z.number().int().min(0).max(999),
  visible: z.boolean(),
});

/** Strip control characters and angle brackets from free text. */
export function sanitizeText(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/[<>]/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Reject submissions that arrive impossibly fast (classic bot signature). */
export function isSubmissionTooFast(startedAt?: string, minMs = 1500): boolean {
  if (!startedAt) return false;
  const start = Number(startedAt);
  if (!Number.isFinite(start)) return false;
  return Date.now() - start < minMs;
}

/** Normalise a mobile number to 10 digits for display / storage. */
export function normalizeMobile(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  return digits;
}
