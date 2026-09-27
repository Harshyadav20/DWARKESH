import type { Metadata } from 'next';
import { address, addressOneLine, clinic, contact, serviceAreas, unknown } from './site';
import type { Doctor, ServiceItem, SiteSettings } from './types';
import { absoluteUrl, parseHours } from './utils';

/**
 * Resolves the public base URL used for canonical tags, sitemap, robots and
 * schema.org. Configure `NEXT_PUBLIC_SITE_URL` for production.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/$/, '');
  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}

type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article';
};

/** Consistent metadata (title, description, canonical, Open Graph, Twitter). */
export function buildMetadata({
  title,
  description,
  path,
  keywords,
  image = '/images/og-cover.png',
  imageAlt = `${clinic.legalName} — ${address.locality}, ${address.city}`,
  type = 'website',
}: BuildMetadataOptions): Metadata {
  const siteUrl = getSiteUrl();
  const canonical = path === '/' ? siteUrl : absoluteUrl(path, siteUrl);
  const ogImage = absoluteUrl(image, siteUrl);

  return {
    title,
    description,
    keywords,
    alternates: { canonical },
    openGraph: {
      type,
      url: canonical,
      siteName: clinic.legalName,
      locale: 'en_IN',
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/** LocalBusiness + MedicalClinic structured data (only supplied facts). */
export function clinicJsonLd(settings: SiteSettings) {
  const siteUrl = getSiteUrl();
  const hours = parseHours(settings.clinicHours);
  const geo =
    settings.geoLat && settings.geoLng
      ? {
          '@type': 'GeoCoordinates',
          latitude: settings.geoLat,
          longitude: settings.geoLng,
        }
      : undefined;

  const sameAs = [settings.facebookUrl, settings.instagramUrl, settings.youtubeUrl].filter(Boolean);

  const json: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'LocalBusiness'],
    '@id': `${siteUrl}/#organisation`,
    name: clinic.legalName,
    alternateName: clinic.hindiName,
    slogan: clinic.tagline,
    description: clinic.description,
    url: siteUrl,
    telephone: contact.phoneInternational,
    email: contact.email,
    logo: absoluteUrl('/logo.svg', siteUrl),
    image: absoluteUrl('/images/hero-medical-centre.jpg', siteUrl),
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.line1}, ${address.line2}`,
      addressLocality: `${address.locality}, ${address.city}`,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    areaServed: serviceAreas.map((area) => ({ '@type': 'Place', name: area })),
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: contact.phoneInternational,
        contactType: 'appointment',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Marathi'],
      },
    ],
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressOneLine)}`,
  };

  if (geo) json.geo = geo;
  if (sameAs.length > 0) json.sameAs = sameAs;
  if (hours) {
    json.openingHoursSpecification = [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: daysOfWeek,
        opens: hours.opens,
        closes: hours.closes,
      },
    ];
    json.openingHours = `Mo-Su ${hours.opens}-${hours.closes}`;
  }
  if (settings.emergencyEnabled && settings.emergencyPhone) {
    json.contactPoint = [
      ...(json.contactPoint as unknown[]),
      {
        '@type': 'ContactPoint',
        telephone: `+91${settings.emergencyPhone}`,
        contactType: 'emergency',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Marathi'],
      },
    ];
  }
  return json;
}

/** Diagnostic tests / procedures offered by the clinic. */
export function servicesJsonLd(services: ServiceItem[]) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: services
      .filter((s) => s.visible !== false)
      .map((service, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': service.group === 'diagnostic' ? 'MedicalTest' : 'MedicalProcedure',
          name: service.name,
          description: service.shortDescription,
          url: absoluteUrl(serviceUrl(service), siteUrl),
        },
      })),
  };
}

/** Canonical URL for any service record, based on its group. */
export function serviceUrl(service: ServiceItem): string {
  if (service.group === 'diagnostic') return `/diagnostics/${service.slug}`;
  if (service.group === 'dental') return `/dental#${service.slug}`;
  if (service.group === 'home-visit') return `/home-visit#${service.slug}`;
  return `/services/${service.slug}`;
}

/** Physician structured data for a doctor profile. */
export function physicianJsonLd(doctor: Doctor) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `${siteUrl}/doctors/${doctor.slug}#physician`,
    name: doctor.name,
    description: `${doctor.qualifications || unknown} — ${doctor.specialization}`,
    medicalSpecialty: doctor.specialization,
    url: `${siteUrl}/doctors/${doctor.slug}`,
    memberOf: { '@id': `${siteUrl}/#organisation` },
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${address.line1}, ${address.line2}`,
      addressLocality: `${address.locality}, ${address.city}`,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    telephone: contact.phoneInternational,
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(
  trail: { name: string; path: string }[],
) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path, siteUrl),
    })),
  };
}

export function websiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    url: siteUrl,
    name: clinic.legalName,
    inLanguage: 'en-IN',
    publisher: { '@id': `${siteUrl}/#organisation` },
  };
}
