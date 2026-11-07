import { ImageResponse } from '@vercel/og';

export const runtime = 'edge';

const SAFE = /^[a-zA-Z0-9 _\-.,!?'’"()&:#\/]+$/;
const HEX = /^#?[0-9a-fA-F]{6}$/;

function clean(value, fallback, max = 120) {
  if (!value || typeof value !== 'string') return fallback;
  const v = value.slice(0, max).trim();
  return SAFE.test(v) ? v : fallback;
}

function color(value, fallback) {
  if (!value || typeof value !== 'string') return fallback;
  const v = value.trim();
  return HEX.test(v) ? (v.startsWith('#') ? v : `#${v}`) : fallback;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const title = clean(searchParams.get('title'), 'Ogly');
  const subtitle = clean(searchParams.get('subtitle'), 'On-brand images from text, in seconds.', 160);
  const bg = color(searchParams.get('bg'), '#0f172a');
  const accent = color(searchParams.get('accent'), '#f59e0b');
  const brand = clean(searchParams.get('brand'), 'Ogly', 40);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: bg,
          padding: '72px 80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 800,
              color: '#0f172a',
            }}
          >
            B
          </div>
          <div style={{ fontSize: 30, fontWeight: 700 }}>{brand}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 32, lineHeight: 1.3, opacity: 0.85 }}>{subtitle}</div>
        </div>
        <div
          style={{ width: 160, height: 10, borderRadius: 5, background: accent }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
