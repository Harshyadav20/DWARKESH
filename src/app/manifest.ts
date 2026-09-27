import type { MetadataRoute } from 'next';
import { clinic } from '@/lib/site';

export const dynamic = 'force-static';

export default function Manifest(): MetadataRoute.Manifest {
  return {
    name: clinic.legalName,
    short_name: 'Dwarkesh',
    description:
      'Medical, diagnostic, dental and home-visit healthcare services in Malad East, Mumbai.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1d414c',
    lang: 'en-IN',
    categories: ['health', 'medical', 'lifestyle'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
