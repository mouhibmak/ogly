// Shared image renderers for Ogly.
//
// The four free-tool GET routes (/api/og, /api/certificate, /api/quote,
// /api/badge) and the API v1 POST route (/v1/render) all render through
// these functions, so the API returns exactly the same images as the
// free tools. Rendered with @vercel/og (Satori under the hood).
//
// Satori constraints learned the hard way (see portfolio.md):
// - `inline-flex` is rejected; use `display: flex`.
// - A div with more than one child needs `display: flex`.

const SAFE = /^[a-zA-Z0-9 _\-.,!?'’"()&:#\/]+$/;
const HEX = /^#?[0-9a-fA-F]{6}$/;

export function clean(value, fallback, max = 120) {
  if (!value || typeof value !== 'string') return fallback;
  const v = value.slice(0, max).trim();
  return SAFE.test(v) ? v : fallback;
}

export function color(value, fallback) {
  if (!value || typeof value !== 'string') return fallback;
  const v = value.trim();
  return HEX.test(v) ? (v.startsWith('#') ? v : `#${v}`) : fallback;
}

export function renderOg({ title, subtitle, brand, bg, accent }) {
  return (
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
  );
}

export function renderCertificate({ name, course, date, issuer, bg, accent }) {
  return (
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
  );
}

export function renderQuote({ quote, author, brand, bg, accent }) {
  // Shrink long quotes so a full 280-char quote still fits in the square.
  const quoteSize = quote.length > 180 ? 44 : quote.length > 120 ? 52 : 62;
  return (
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
  );
}

export function renderBadge({ name, role, event, date, bg, accent }) {
  return (
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
  );
}

// Template registry: name -> size + renderer + the data fields it takes.
// The v1 API and the docs page both read this list, so they cannot drift.
export const TEMPLATES = {
  og: {
    width: 1200,
    height: 630,
    render: renderOg,
    fields: ['title', 'subtitle', 'brand', 'bg', 'accent'],
    description: 'OG / social preview image, 1200 × 630',
  },
  certificate: {
    width: 1600,
    height: 1200,
    render: renderCertificate,
    fields: ['name', 'course', 'date', 'issuer', 'bg', 'accent'],
    description: 'Certificate of completion, 1600 × 1200',
  },
  quote: {
    width: 1080,
    height: 1080,
    render: renderQuote,
    fields: ['quote', 'author', 'brand', 'bg', 'accent'],
    description: 'Square quote card, 1080 × 1080',
  },
  badge: {
    width: 1200,
    height: 630,
    render: renderBadge,
    fields: ['name', 'role', 'event', 'date', 'bg', 'accent'],
    description: 'Event speaker badge, 1200 × 630',
  },
};
