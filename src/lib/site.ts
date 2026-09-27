/**
 * Single source of truth for the clinic's public identity.
 *
 * Everything here comes from information supplied by Dwarkesh Medical Centre LLP.
 * Anything that has NOT been supplied by the clinic is intentionally left empty
 * (see `unknown`) rather than invented — the UI renders "Details to be updated".
 */

export const unknown = 'Details to be updated';

export const clinic = {
  legalName: 'Dwarkesh Medical Centre LLP',
  name: 'Dwarkesh Medical Centre',
  shortName: 'Dwarkesh',
  hindiName: 'द्वारकेश मेडिकल सेंटर एल एल पी',
  dentalClinicName: 'Dwarkesh Dental Clinic',
  dentalTagline: 'Complete Dental Solution',
  tagline: 'Your Health, Our Commitment',
  subTagline: 'Trusted Medical, Diagnostic & Healthcare Services Under One Roof',
  description:
    'Dwarkesh Medical Centre LLP provides accessible healthcare, diagnostic and dental services with a focus on patient care, accurate diagnostics and convenient healthcare solutions.',
  type: ['MedicalClinic', 'DiagnosticLab', 'Dentist', 'LocalBusiness'] as const,
} as const;

export const contact = {
  /** Raw digits, used to build tel: links. */
  phoneDigits: '8655919879',
  /** E.164 format. */
  phoneInternational: '+918655919879',
  /** Human readable. */
  phoneDisplay: '86559 19879',
  /** WhatsApp number without the leading +. */
  whatsapp: '918655919879',
  email: 'dwarkeshmedicalcentre06@gmail.com',
} as const;

export const address = {
  line1: 'Shop No. 4, Swapnikiran Building',
  line2: 'Pimparipada',
  locality: 'Malad East',
  city: 'Mumbai',
  postalCode: '400097',
  region: 'Maharashtra',
  country: 'India',
  countryCode: 'IN',
} as const;

export const addressOneLine = [
  address.line1,
  address.line2,
  address.locality,
  address.city,
  address.postalCode,
  address.region,
  address.country,
].join(', ');

/** Street address used by schema.org / map queries. */
export const streetAddress = `${address.line1}, ${address.line2}`;

/**
 * The clinic has supplied a home-visit window of 8:00 AM – 10:00 PM.
 * Overall clinic hours are editable from the admin panel (Settings).
 */
export const timings = {
  homeVisit: '8:00 AM – 10:00 PM',
  clinic: '8:00 AM – 10:00 PM',
  emergency: '24 × 7 Emergency Assistance',
} as const;

/**
 * Exact coordinates were not supplied, so they are only published when
 * configured through environment variables or admin settings. Never guessed.
 */
export const geo = {
  lat: process.env.NEXT_PUBLIC_CLINIC_LAT || '',
  lng: process.env.NEXT_PUBLIC_CLINIC_LNG || '',
} as const;

export const serviceAreas = [
  'Malad East',
  'Malad West',
  'Pimparipada',
  'Kandivali East',
  'Goregaon',
  'Mumbai',
] as const;

/** Local SEO phrases — used naturally in copy and metadata, never stuffed. */
export const seoKeywords = [
  'medical centre in Malad East',
  'diagnostic centre in Malad East',
  'pathology lab in Malad East',
  'digital X-ray Malad East',
  'sonography Malad East',
  'ECG Malad East',
  'dental clinic Malad East',
  'blood test Malad East',
  'home visit doctor Malad East',
  'doctor consultation Malad East',
] as const;

export const navigation = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Doctors', href: '/doctors' },
  { label: 'Services', href: '/services' },
  { label: 'Diagnostics', href: '/diagnostics' },
  { label: 'Dental', href: '/dental' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
] as const;

export const footerServices = [
  { label: 'Polyclinic', href: '/services/polyclinic' },
  { label: 'Pathology', href: '/diagnostics/pathology-blood-test' },
  { label: 'Dental', href: '/dental' },
  { label: 'Sonography', href: '/diagnostics/sonography-ultrasound' },
  { label: 'ECG', href: '/diagnostics/ecg' },
  { label: 'Digital X-Ray', href: '/diagnostics/digital-x-ray' },
  { label: '2D Echo', href: '/diagnostics/2d-echo' },
  { label: 'Home Visit', href: '/home-visit' },
] as const;
