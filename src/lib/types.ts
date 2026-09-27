import type { LucideIcon } from 'lucide-react';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export type Doctor = {
  id: string;
  slug: string;
  name: string;
  qualifications: string;
  specialization: string;
  department: string;
  /** Only render if the clinic supplied a real photograph. */
  photo?: string | null;
  consultationTiming?: string | null;
  bio?: string | null;
  /** Extra points supplied by the clinic. Never invented. */
  highlights?: string[];
  order: number;
  visible: boolean;
};

export type ServiceItem = {
  id: string;
  slug: string;
  name: string;
  /** Collection this item belongs to. */
  group: 'medical' | 'diagnostic' | 'dental' | 'home-visit';
  shortDescription: string;
  description?: string;
  icon: string;
  image?: string | null;
  /** Bullet points rendered on the detail page. */
  points?: string[];
  ctaLabel?: string;
  department: string;
  order: number;
  visible: boolean;
  /** Marks items that support the "same day results" note. */
  sameDayResults?: boolean;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: 'Clinic' | 'Doctors' | 'Diagnostic Services' | 'Dental' | 'Medical Equipment' | 'Healthcare';
  caption?: string;
  order: number;
  visible: boolean;
};

export type Appointment = {
  id: string;
  patient_name: string;
  phone: string;
  email: string;
  doctor: string;
  department: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  created_at: string;
};

export type SiteSettings = {
  emergencyPhone: string;
  emergencyNote: string;
  emergencyEnabled: boolean;
  clinicHours: string;
  homeVisitHours: string;
  openDays: string;
  showSameDayResults: boolean;
  diagnosticTagline: string;
  appointmentNotice: string;
  whatsappEnabled: boolean;
  floatingButtonsEnabled: boolean;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  mapsEmbedUrl: string;
  geoLat: string;
  geoLng: string;
  heroHeading: string;
  heroSubheading: string;
  updatedAt?: string;
};

export type SiteContent = {
  settings: SiteSettings;
  doctors: Doctor[];
  services: ServiceItem[];
  gallery: GalleryItem[];
};

/** Icon lookup is done at render time so data stays JSON-serialisable. */
export type IconRegistry = Record<string, LucideIcon>;
