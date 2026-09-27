import 'server-only';
import { addressOneLine, clinic, contact } from './site';
import type { Appointment } from './types';

/**
 * Optional e-mail notification for new appointment requests (Resend).
 *
 * Requires RESEND_API_KEY on the server. When it is not configured the function
 * is a no-op — the appointment is still stored and the visitor is always given
 * the WhatsApp/phone confirmation path, so nothing is silently lost.
 */
export async function sendAppointmentEmail(appointment: Appointment): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;

  const to = process.env.APPOINTMENT_NOTIFY_EMAIL || contact.email;
  const from = process.env.EMAIL_FROM || `Dwarkesh Medical Centre <onboarding@resend.dev>`;

  const rows = [
    ['Patient name', appointment.patient_name],
    ['Mobile', appointment.phone],
    ['Email', appointment.email || '—'],
    ['Doctor', appointment.doctor || 'Any available doctor'],
    ['Department', appointment.department || '—'],
    ['Preferred date', appointment.date],
    ['Preferred time', appointment.time],
    ['Reason', appointment.reason || '—'],
    ['Reference', appointment.id],
    ['Status', appointment.status],
  ] as const;

  const text = [
    `New appointment request — ${clinic.legalName}`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    `Clinic: ${addressOneLine}`,
    `Phone: ${contact.phoneDisplay}`,
  ].join('\n');

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#eef9fa;padding:24px">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:14px;overflow:hidden;border:1px solid #d5f0f3">
      <div style="background:#1d5e6d;color:#fff;padding:20px 24px">
        <h1 style="margin:0;font-size:18px">New appointment request</h1>
        <p style="margin:6px 0 0;font-size:13px;opacity:.85">${clinic.legalName}</p>
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:10px 24px;background:#f6f8f9;color:#526472;font-weight:600;width:38%">${label}</td><td style="padding:10px 24px;color:#1c242a">${String(
                value,
              )
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')}</td></tr>`,
          )
          .join('')}
      </table>
      <p style="padding:18px 24px;font-size:12px;color:#667c89;margin:0">
        Confirm the slot by calling or messaging the patient on the number above.
      </p>
    </div>
  </div>`;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: appointment.email || undefined,
        subject: `Appointment request — ${appointment.patient_name} (${appointment.date})`,
        text,
        html,
      }),
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}
