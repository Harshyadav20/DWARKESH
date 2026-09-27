import { NextResponse } from 'next/server';
import { appointmentSchema, isSubmissionTooFast, normalizeMobile, sanitizeText } from '@/lib/validation';
import { createAppointment, storageMode } from '@/lib/store';
import { sendAppointmentEmail } from '@/lib/notify';
import { appointmentWhatsappHref } from '@/lib/links';
import { clinic } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/appointments — create an appointment request.
 *
 * Protections:
 *  • Zod schema validation (identical to the client schema)
 *  • honeypot field (`company`) that must stay empty
 *  • minimum completion time, so instant bot posts are rejected
 *  • in-memory per-IP rate limit
 *  • text sanitisation before storage
 * No API keys are involved, and nothing sensitive is returned to the client.
 */

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
const RATE_LIMIT = 6;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function clientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() ?? 'unknown';
  return request.headers.get('x-real-ip') ?? 'unknown';
}

function rateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  bucket.count += 1;
  if (bucket.count > RATE_LIMIT) return true;
  return false;
}

// Keep the map from growing without bound.
function pruneBuckets() {
  if (buckets.size < 500) return;
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt < now) buckets.delete(key);
  }
}

export async function POST(request: Request) {
  pruneBuckets();

  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: 'Too many requests. Please try again in a few minutes, or call the centre.' },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = appointmentSchema.safeParse(payload);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        error: 'Please check the highlighted fields.',
        issues: parsed.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
        firstIssue: firstIssue?.message,
      },
      { status: 422 },
    );
  }

  const values = parsed.data;

  // Honeypot filled or submitted impossibly fast → almost certainly a bot.
  // Respond as if it worked (so scrapers get no signal) but store nothing.
  if ((values.company ?? '').trim() !== '' || isSubmissionTooFast(values.formStartedAt)) {
    return NextResponse.json({ ok: true, reference: 'pending', stored: false, ignored: true });
  }

  const phone = normalizeMobile(values.mobile);

  const appointment = await createAppointment({
    patient_name: sanitizeText(values.patientName),
    phone,
    email: values.email ? sanitizeText(values.email) : '',
    doctor: sanitizeText(values.doctor || ''),
    department: sanitizeText(values.department || ''),
    date: values.preferredDate,
    time: sanitizeText(values.preferredTime),
    reason: sanitizeText(values.reason || ''),
  });

  if (!appointment) {
    return NextResponse.json(
      {
        ok: false,
        error: 'We could not save your request just now. Please call or send it on WhatsApp.',
        whatsapp: appointmentWhatsappHref({
          name: values.patientName,
          phone,
          email: values.email,
          doctor: values.doctor,
          department: values.department,
          date: values.preferredDate,
          time: values.preferredTime,
          reason: values.reason,
        }),
      },
      { status: 500 },
    );
  }

  const stored = storageMode() !== 'read-only';

  // Fire-and-forget style notification; failures must never block the patient.
  void sendAppointmentEmail(appointment).catch(() => false);

  return NextResponse.json({
    ok: true,
    reference: appointment.id,
    stored,
    clinic: clinic.legalName,
    whatsapp: appointmentWhatsappHref({
      name: appointment.patient_name,
      phone: appointment.phone,
      email: appointment.email,
      doctor: appointment.doctor,
      department: appointment.department,
      date: appointment.date,
      time: appointment.time,
      reason: appointment.reason,
    }),
  });
}
