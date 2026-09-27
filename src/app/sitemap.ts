import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';
import { defaultDoctors } from '@/lib/data/doctors';
import { allDefaultServices } from '@/lib/store';

export const dynamic = 'force-static';

/**
 * sitemap.xml
 *
 * Routes are listed from the same content source the site renders from, so
 * every URL in the sitemap is a real, working page.
 */
export default function Sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${siteUrl}/doctors`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/diagnostics`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/dental`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/home-visit`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
    { url: `${siteUrl}/gallery`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/book-appointment`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${siteUrl}/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ];

  const doctorRoutes: MetadataRoute.Sitemap = defaultDoctors.map((doctor) => ({
    url: `${siteUrl}/doctors/${doctor.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.75,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = allDefaultServices
    .filter((service) => service.visible !== false && service.group !== 'dental' && service.group !== 'home-visit')
    .map((service) => ({
      url: `${siteUrl}/${service.group === 'diagnostic' ? 'diagnostics' : 'services'}/${service.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [...staticRoutes, ...doctorRoutes, ...serviceRoutes];
}
