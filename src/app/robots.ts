import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

/**
 * robots.txt — allows all crawlers, points at the sitemap and keeps the
 * admin area and API routes out of the index.
 */
export default function Robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
