import { addressOneLine, contact, clinic } from './site';
import { slugify } from './utils';

/** Build a tel: link from raw digits (country code defaults to India). */
export function telHref(digits: string) {
  const clean = digits.replace(/\D/g, '');
  return `tel:+${clean.startsWith('91') ? clean : `91${clean}`}`;
}

/** Canonical click-to-call link for the clinic line. */
export const callHref = telHref(contact.phoneDigits);

/**
 * WhatsApp deep link. When no message is supplied the clinic's default
 * greeting is pre-filled so every enquiry is recognisable.
 */
export function whatsappHref(message?: string) {
  const text =
    message ?? `Hello ${clinic.legalName}, I would like to enquire about your services.`;
  return `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const whatsappHrefDefault = whatsappHref();

/** Pre-filled appointment enquiry for WhatsApp. */
export function appointmentWhatsappHref(fields: {
  name?: string;
  phone?: string;
  email?: string;
  doctor?: string;
  department?: string;
  date?: string;
  time?: string;
  reason?: string;
}) {
  const message = [
    `Hello ${clinic.legalName},`,
    '',
    'I would like to book an appointment.',
    '',
    `Name: ${fields.name || '-'}`,
    `Phone: ${fields.phone || '-'}`,
    `Email: ${fields.email || '-'}`,
    `Doctor: ${fields.doctor || '-'}`,
    `Department: ${fields.department || '-'}`,
    `Preferred Date: ${fields.date || '-'}`,
    `Preferred Time: ${fields.time || '-'}`,
    `Reason: ${fields.reason || '-'}`,
  ].join('\n');
  return whatsappHref(message);
}

/** Pre-filled home-visit enquiry for WhatsApp. */
export const homeVisitWhatsappHref = whatsappHref(
  `Hello ${clinic.legalName}, I would like to enquire about a home visit.`,
);

/** mailto: link with an optional subject/body. */
export function mailtoHref(subject?: string, body?: string) {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString();
  return `mailto:${contact.email}${query ? `?${query}` : ''}`;
}

export const emailHref = mailtoHref(`Enquiry — ${clinic.legalName}`);

const encodedAddress = encodeURIComponent(addressOneLine);

/** Google Maps directions (deep links into the Maps app on mobile). */
export const mapsDirectionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

/** Google Maps search result for the clinic address. */
export const mapsSearchHref = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;

/**
 * Map embed source.
 *
 * The official Google Maps Embed API needs a key, which the clinic has not
 * supplied yet. When `NEXT_PUBLIC_MAPS_EMBED_URL` (or an API key) is present we
 * use it; otherwise we fall back to the key-less embed view of the address so
 * visitors still get a working map plus a "Get Directions" link.
 */
export function mapsEmbedSrc(): string {
  const configured = process.env.NEXT_PUBLIC_MAPS_EMBED_URL;
  if (configured) return configured;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}`;
  }

  return `https://maps.google.com/maps?q=${encodedAddress}&z=16&hl=en&output=embed`;
}

/** Appointment booking URL with an optional pre-selected department/doctor. */
export function appointmentHref(params?: { doctor?: string; department?: string; service?: string }) {
  const search = new URLSearchParams();
  if (params?.doctor) search.set('doctor', params.doctor);
  if (params?.department) search.set('department', params.department);
  if (params?.service) search.set('service', params.service);
  const query = search.toString();
  return `/book-appointment${query ? `?${query}` : ''}`;
}

/** Diagnostic enquiry link (booking form pre-filled with the department). */
export function diagnosticEnquiryHref(serviceName: string) {
  return appointmentHref({ department: 'Diagnostics', service: serviceName });
}

export { slugify };
