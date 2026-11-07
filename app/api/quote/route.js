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
  const quote = clean(searchParams.get('quote'), 'Your quote goes here.', 280);
  const author = clean(searchParams.get('author'), 'Anonymous', 60);
  const brand = clean(searchParams.get('brand'), 'Ogly', 40);
  const bg = color(searchParams.get('bg'), '#0f172a');
  const accent = color(searchParams.get('accent'), '#f59e0b');
  // Shrink long quotes so a full 280-char quote still fits in the square.
  const quoteSize = quote.length > 180 ? 44 : quote.length > 120 ? 52 : 62;

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
          padding: '96px 90px',
          fontFamily: 'serif',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 160, lineHeight: 0.6, color: accent, fontFamily: 'serif' }}>
            “
          </div>
          <div style={{ fontSize: quoteSize, fontWeight: 700, lineHeight: 1.25 }}>{quote}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{ width: 120, height: 8, borderRadius: 4, background: accent }}
          />
          <div style={{ fontSize: 38, fontWeight: 700, fontFamily: 'sans-serif' }}>
            {`— ${author}`}
          </div>
          <div style={{ fontSize: 28, opacity: 0.8, fontFamily: 'sans-serif' }}>{brand}</div>
          <div style={{ fontSize: 22, opacity: 0.6, fontFamily: 'sans-serif' }}>
            Made with Ogly
          </div>
        </div>
      </div>
    ),
    { width: 1080, height: 1080 }
  );
}
