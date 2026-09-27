import { promises as fs } from 'fs';
import path from 'path';
import { ImageResponse } from 'next/og';
import { addressOneLine, clinic, contact } from '@/lib/site';

export const runtime = 'nodejs';

/**
 * Fonts live in /public/fonts so they are always present at runtime (dev,
 * Docker and serverless). OG generation therefore never needs the network.
 */
const FONT_DIR = path.join(process.cwd(), 'public', 'fonts');

const loadFonts = () =>
  Promise.all([
    fs.readFile(path.join(FONT_DIR, 'Inter-ExtraBold.woff')),
    fs.readFile(path.join(FONT_DIR, 'Inter-SemiBold.woff')),
    fs.readFile(path.join(FONT_DIR, 'NotoSansDevanagari-Bold.woff')),
  ]).then(([extraBold, semiBold, devanagari]) => [
    extraBold.buffer.slice(
      extraBold.byteOffset,
      extraBold.byteOffset + extraBold.byteLength,
    ) as ArrayBuffer,
    semiBold.buffer.slice(
      semiBold.byteOffset,
      semiBold.byteOffset + semiBold.byteLength,
    ) as ArrayBuffer,
    devanagari.buffer.slice(
      devanagari.byteOffset,
      devanagari.byteOffset + devanagari.byteLength,
    ) as ArrayBuffer,
  ] as [ArrayBuffer, ArrayBuffer, ArrayBuffer]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const title = (searchParams.get('title') || clinic.tagline).slice(0, 90);
  const subtitle = (searchParams.get('subtitle') || clinic.subTagline).slice(0, 140);
  const eyebrow = (searchParams.get('eyebrow') || 'Dwarkesh Medical Centre LLP').slice(0, 60);

  const [interExtraBold, interSemiBold, notoDevanagari] = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #1d414c 0%, #1d5e6d 45%, #1e328a 100%)',
          padding: '72px 80px',
          fontFamily: 'Inter',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* soft accent circle */}
        <div
          style={{
            position: 'absolute',
            right: -140,
            top: -160,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: 'rgba(124, 203, 214, 0.16)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 120,
            bottom: -200,
            width: 420,
            height: 420,
            borderRadius: 420,
            background: 'rgba(85, 189, 127, 0.14)',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 26,
              background: 'rgba(255,255,255,0.14)',
              border: '2px solid rgba(255,255,255,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{ position: 'absolute', width: 16, height: 56, background: '#fff', display: 'flex' }}
            />
            <div
              style={{ position: 'absolute', width: 56, height: 16, background: '#fff', display: 'flex' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>{eyebrow}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#b0e1e7', fontFamily: 'NotoDevanagari' }}>
              {clinic.hindiName}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1000 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 24,
              fontWeight: 600,
              color: '#8ad7a8',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            <div style={{ width: 48, height: 3, background: '#55bd7f', display: 'flex' }} />
            Malad East, Mumbai
          </div>
          <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            {title}
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, color: '#d5f0f3', lineHeight: 1.35 }}>
            {subtitle}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '2px solid rgba(255,255,255,0.22)',
            paddingTop: 28,
            fontSize: 26,
            fontWeight: 600,
            color: '#eef9fa',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                background: 'rgba(124, 203, 214, 0.25)',
                border: '2px solid #7ccbd6',
                display: 'flex',
              }}
            />
            {contact.phoneDisplay}
          </div>
          <div style={{ display: 'flex', maxWidth: 620, textAlign: 'right' }}>{addressOneLine}</div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
        { name: 'Inter', data: interExtraBold, weight: 800, style: 'normal' },
        { name: 'NotoDevanagari', data: notoDevanagari, weight: 700, style: 'normal' },
      ],
      headers: {
        'Cache-Control': 'public, max-age=604800, stale-while-revalidate=86400',
      },
    },
  );
}
