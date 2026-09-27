import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';

import { buildMetadata, getSiteUrl } from '@/lib/seo';
import { clinic, contact } from '@/lib/site';

/**
 * Fonts are self-hosted variable fonts (see src/assets/fonts/LICENSE.md).
 * No third-party request at build or page-load time.
 */
const inter = localFont({
  src: [{ path: '../assets/fonts/InterVariable-latin.woff2', weight: '100 900', style: 'normal' }],
  variable: '--font-inter',
  display: 'swap',
  adjustFontFallback: 'Arial',
  fallback: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
});

const manrope = localFont({
  src: [{ path: '../assets/fonts/ManropeVariable-latin.woff2', weight: '200 800', style: 'normal' }],
  variable: '--font-manrope',
  display: 'swap',
  adjustFontFallback: 'Arial',
  fallback: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
});

const notoDevanagari = localFont({
  src: [
    { path: '../assets/fonts/NotoSansDevanagariVariable.woff2', weight: '100 900', style: 'normal' },
    { path: '../assets/fonts/NotoSansDevanagariVariable-latin.woff2', weight: '100 900', style: 'normal' },
  ],
  variable: '--font-noto-devanagari',
  display: 'swap',
  fallback: ['Nirmala UI', 'Mangal', 'sans-serif'],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  ...buildMetadata({
    title: `${clinic.legalName} | Medical & Diagnostic Centre in Malad East, Mumbai`,
    description: `${clinic.description} Doctor consultation, pathology, sonography, digital X-Ray, ECG, 2D Echo, dental care and home visits in Malad East, Mumbai. Call ${contact.phoneDisplay}.`,
    path: '/',
    keywords: [
      'Dwarkesh Medical Centre LLP',
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
    ],
  }),
  title: {
    default: `${clinic.legalName} | Medical & Diagnostic Centre in Malad East, Mumbai`,
    template: `%s | ${clinic.legalName}`,
  },
  applicationName: clinic.legalName,
  authors: [{ name: clinic.legalName }],
  creator: clinic.legalName,
  publisher: clinic.legalName,
  formatDetection: { telephone: true, email: true, address: true },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'health',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1d414c' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html
      lang="en-IN"
      className={`${inter.variable} ${manrope.variable} ${notoDevanagari.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-white font-sans text-ink-700 antialiased">
        {children}

        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId.replace(/'/g, '')}', { anonymize_ip: true });`}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
