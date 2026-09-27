import type { SiteSettings } from '../types';
import { contact, timings, clinic } from '../site';

/**
 * Default settings — every value here is editable from Admin → Settings.
 * Nothing is invented: hours and the emergency line come from the clinic's
 * own material.
 */
export const defaultSettings: SiteSettings = {
  emergencyPhone: contact.phoneDigits,
  emergencyNote: timings.emergency,
  emergencyEnabled: true,
  clinicHours: timings.clinic,
  homeVisitHours: timings.homeVisit,
  openDays: 'Monday – Sunday',
  showSameDayResults: true,
  diagnosticTagline: 'Accurate Reports | Affordable Rates | Same Day Results',
  appointmentNotice:
    'Appointment requests are confirmed by our team on call or WhatsApp. For urgent medical needs, please call the centre directly.',
  whatsappEnabled: true,
  floatingButtonsEnabled: true,
  facebookUrl: '',
  instagramUrl: '',
  youtubeUrl: '',
  mapsEmbedUrl: process.env.NEXT_PUBLIC_MAPS_EMBED_URL ?? '',
  geoLat: process.env.NEXT_PUBLIC_CLINIC_LAT ?? '',
  geoLng: process.env.NEXT_PUBLIC_CLINIC_LNG ?? '',
  heroHeading: clinic.tagline,
  heroSubheading: clinic.subTagline,
};
