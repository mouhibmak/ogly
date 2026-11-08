const FAQS = [
  {
    q: 'Do I need an API key?',
    a: 'Not during the beta. The API is free and open — just POST to /v1/render. When the API leaves beta, keys will be issued to everyone on the request list, and the free tier stays free.',
  },
  {
    q: 'What is the rate limit?',
    a: '100 renders per day per IP, free. Every response carries X-RateLimit-Limit, X-RateLimit-Remaining and X-RateLimit-Reset headers. Over the limit you get a 429 response with a Retry-After header telling you how many seconds to wait.',
  },
  {
    q: 'What happens when I hit the limit?',
    a: 'You get HTTP 429 with a JSON error and a Retry-After header (seconds until the daily window resets). Wait that long, or request a free API key — key holders get higher limits when the API leaves beta.',
  },
  {
    q: 'How do I request a free API key?',
    a: 'Leave your email on the request form on the API docs page (/api-docs). We will email your key when the API leaves beta. No spam, one email.',
  },
  {
    q: 'Is the limit exact?',
    a: 'It is best-effort: the counter lives in memory on each server instance, so a burst spread across instances can go slightly over 100 before the limit bites. It stops casual abuse; exact per-account limits arrive with API keys.',
  },
];

const FAQ_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

const TEMPLATES = [
  { name: 'og', size: '1200 × 630', desc: 'OG / social preview image' },
  { name: 'certificate', size: '1600 × 1200', desc: 'Certificate of completion' },
  { name: 'quote', size: '1080 × 1080', desc: 'Square quote card' },
  { name: 'badge', size: '1200 × 630', desc: 'Event speaker badge' },
  { name: 'thumbnail', size: '1280 × 720', desc: 'YouTube thumbnail' },
];

export default function UsagePage() {
  return (
    <main style={styles.main}>
      <p style={styles.back}>
        <a href="/">← Back to Ogly</a>
      </p>
      <h1 style={styles.h1}>Usage &amp; rate limits</h1>
      <p style={styles.tag}>
        Ogly API v1 is in free beta: no key, no sign-up, 100 renders a day per IP.
        This page is the plain-English version of the limits.
      </p>

      <h2 style={styles.h2}>Free tier</h2>
      <table style={styles.table}>
        <tbody>
          <tr>
            <td style={styles.td}><strong>Price</strong></td>
            <td style={styles.td}>Free, no API key needed during the beta</td>
          </tr>
          <tr>
            <td style={styles.td}><strong>Limit</strong></td>
            <td style={styles.td}>100 renders per day, per IP address</td>
          </tr>
          <tr>
            <td style={styles.td}><strong>Window</strong></td>
            <td style={styles.td}>Rolling 24 hours from your first render of the day</td>
          </tr>
          <tr>
            <td style={styles.td}><strong>Response</strong></td>
            <td style={styles.td}>A PNG image (image/png) at the template size</td>
          </tr>
          <tr>
            <td style={styles.td}><strong>Errors</strong></td>
            <td style={styles.td}>JSON <code>{'{ ok: false, error }'}</code> — 400 for a bad template or JSON, 429 for the rate limit</td>
          </tr>
        </tbody>
      </table>

      <h2 style={styles.h2}>Templates</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Template</th>
            <th style={styles.th}>Size</th>
            <th style={styles.th}>What it is</th>
          </tr>
        </thead>
        <tbody>
          {TEMPLATES.map((t) => (
            <tr key={t.name}>
              <td style={styles.td}><code>{t.name}</code></td>
              <td style={styles.td}>{t.size}</td>
              <td style={styles.td}>{t.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={styles.h2}>Rate-limit headers</h2>
      <p style={styles.body}>
        Every API response carries these headers, so you can watch your quota
        without guessing:
      </p>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Header</th>
            <th style={styles.th}>Meaning</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={styles.td}><code>X-RateLimit-Limit</code></td>
            <td style={styles.td}>100 — the daily renders allowed per IP</td>
          </tr>
          <tr>
            <td style={styles.td}><code>X-RateLimit-Remaining</code></td>
            <td style={styles.td}>Renders left in your current window</td>
          </tr>
          <tr>
            <td style={styles.td}><code>X-RateLimit-Reset</code></td>
            <td style={styles.td}>Unix time when the window resets</td>
          </tr>
          <tr>
            <td style={styles.td}><code>Retry-After</code></td>
            <td style={styles.td}>Only on 429 — seconds to wait before retrying</td>
          </tr>
        </tbody>
      </table>

      <h2 style={styles.h2}>How to request a free API key</h2>
      <p style={styles.body}>
        No key is needed during the beta. When the API leaves beta, keys go to
        everyone on the request list first — higher limits, same free tier.
        Leave your email on the request form on the{' '}
        <a href="/api-docs">API docs page</a>. We will email your key when it
        is ready. No spam, one email.
      </p>
      <p style={styles.body}>
        Full technical docs, with curl, JavaScript and Python examples:{' '}
        <a href="/api-docs">/api-docs</a>.
      </p>

      <section style={styles.faq}>
        <h2 style={styles.h2}>Frequently asked questions</h2>
        {FAQS.map((f) => (
          <div key={f.q} style={styles.faqItem}>
            <h3 style={styles.faqQ}>{f.q}</h3>
            <p style={styles.faqA}>{f.a}</p>
          </div>
        ))}
      </section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      <footer style={styles.footer}>
        Ogly — free tools first. API v1 beta: free, no key, 100 renders/day per IP.
      </footer>
    </main>
  );
}

const styles = {
  main: { maxWidth: 1020, margin: '0 auto', padding: '48px 20px', fontFamily: 'sans-serif', color: '#111827' },
  back: { margin: '0 0 16px', fontSize: 15 },
  h1: { fontSize: 40, margin: '0 0 8px' },
  tag: { fontSize: 19, color: '#4b5563', margin: '0 0 32px' },
  h2: { fontSize: 28, margin: '40px 0 16px' },
  body: { fontSize: 16, lineHeight: 1.6, color: '#374151' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 15 },
  th: { textAlign: 'left', borderBottom: '2px solid #e5e7eb', padding: '10px 8px' },
  td: { borderBottom: '1px solid #f1f5f9', padding: '10px 8px', verticalAlign: 'top' },
  faq: { marginTop: 40 },
  faqItem: { borderTop: '1px solid #e5e7eb', padding: '16px 0' },
  faqQ: { fontSize: 17, margin: '0 0 6px' },
  faqA: { fontSize: 15, color: '#4b5563', margin: 0, lineHeight: 1.6 },
  footer: { marginTop: 40, fontSize: 13, color: '#9ca3af' },
};
