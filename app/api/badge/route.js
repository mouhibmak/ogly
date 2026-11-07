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
  const name = clean(searchParams.get('name'), 'Your Name', 60);
  const role = clean(searchParams.get('role'), 'Speaker', 80);
  const event = clean(searchParams.get('event'), 'Event', 80);
  const date = clean(searchParams.get('date'), '', 40);
  const bg = color(searchParams.get('bg'), '#0f172a');
  const accent = color(searchParams.get('accent'), '#f59e0b');

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
          padding: '64px 80px 48px',
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
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase' }}>
            {event}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div
            style={{
              display: 'flex',
              alignSelf: 'flex-start',
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: 'uppercase',
              color: accent,
            }}
          >
            Speaker
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05 }}>{name}</div>
          <div style={{ fontSize: 34, lineHeight: 1.3, opacity: 0.85 }}>{role}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 26, fontWeight: 600, opacity: 0.9 }}>{date}</div>
          <div style={{ fontSize: 20, opacity: 0.6 }}>Made with Ogly</div>
        </div>
        <div
          style={{ width: 160, height: 10, borderRadius: 5, background: accent }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
