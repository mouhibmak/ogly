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
  const name = clean(searchParams.get('name'), 'Your Name', 80);
  const course = clean(searchParams.get('course'), 'Course or achievement', 120);
  const date = clean(searchParams.get('date'), 'November 2026', 40);
  const issuer = clean(searchParams.get('issuer'), 'Ogly', 40);
  const bg = color(searchParams.get('bg'), '#fdfbf7');
  const accent = color(searchParams.get('accent'), '#1e3a5f');

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: bg,
          padding: 56,
          fontFamily: 'serif',
          color: '#111827',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: `6px solid ${accent}`,
            padding: '72px 96px',
          }}
        >
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
            }}
          >
            <div
              style={{
                width: 120,
                height: 6,
                background: accent,
              }}
            />
            <div
              style={{
                fontSize: 30,
                letterSpacing: 8,
                fontWeight: 400,
                color: accent,
                textTransform: 'uppercase',
              }}
            >
              Certificate of Completion
            </div>
            <div style={{ fontSize: 26, fontFamily: 'sans-serif', color: '#6b7280' }}>
              This certificate is proudly presented to
            </div>
            <div
              style={{
                fontSize: 96,
                fontWeight: 700,
                lineHeight: 1.1,
                textAlign: 'center',
                fontFamily: 'serif',
              }}
            >
              {name}
            </div>
            <div
              style={{
                width: 480,
                height: 2,
                background: accent,
              }}
            />
            <div
              style={{
                fontSize: 36,
                lineHeight: 1.3,
                textAlign: 'center',
                fontFamily: 'sans-serif',
                color: '#374151',
              }}
            >
              {course}
            </div>
          </div>

          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              fontFamily: 'sans-serif',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 26, fontWeight: 700 }}>{date}</div>
              <div style={{ fontSize: 18, color: '#6b7280' }}>Date</div>
            </div>
            <div
              style={{ fontSize: 18, color: '#9ca3af', alignSelf: 'flex-end' }}
            >
              Made with Ogly
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                alignItems: 'flex-end',
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 700 }}>{issuer}</div>
              <div style={{ fontSize: 18, color: '#6b7280' }}>Issued by</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1600, height: 1200 }
  );
}
