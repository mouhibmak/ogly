'use client';

import { useState } from 'react';
import { trackToolUsed, trackApiKeyCreated, trackFirstApiCall } from '../lib/analytics';

const BASE = 'https://ogly-mouhib2.vercel.app';

const TEMPLATES = [
  { name: 'og', size: '1200 × 630', desc: 'OG / social preview image.', fields: 'title, subtitle, brand, bg, accent' },
  { name: 'certificate', size: '1600 × 1200', desc: 'Certificate of completion.', fields: 'name, course, date, issuer, bg, accent' },
  { name: 'quote', size: '1080 × 1080', desc: 'Square quote card.', fields: 'quote, author, brand, bg, accent' },
  { name: 'badge', size: '1200 × 630', desc: 'Event speaker badge.', fields: 'name, role, event, date, bg, accent' },
  { name: 'thumbnail', size: '1280 × 720', desc: 'YouTube thumbnail.', fields: 'title, subtitle, brand, bg, accent' },
];

// Every field, its default when omitted, and its max length — taken from the
// API itself (app/v1/render/route.js). All fields are optional: omit one and
// the default below is used. Text outside the supported characters
// (letters, digits, space _ - . , ! ? ' " ( ) & : # /) falls back to the
// default. bg / accent must be a 6-digit hex colour, with or without '#'.
const PARAMS = [
  { template: 'og', field: 'title', def: 'Ogly', max: 120 },
  { template: 'og', field: 'subtitle', def: 'On-brand images from text, in seconds.', max: 160 },
  { template: 'og', field: 'brand', def: 'Ogly', max: 40 },
  { template: 'og', field: 'bg', def: '#0f172a', max: 'hex colour' },
  { template: 'og', field: 'accent', def: '#f59e0b', max: 'hex colour' },
  { template: 'certificate', field: 'name', def: 'Your Name', max: 80 },
  { template: 'certificate', field: 'course', def: 'Course or achievement', max: 120 },
  { template: 'certificate', field: 'date', def: 'November 2026', max: 40 },
  { template: 'certificate', field: 'issuer', def: 'Ogly', max: 40 },
  { template: 'certificate', field: 'bg', def: '#fdfbf7', max: 'hex colour' },
  { template: 'certificate', field: 'accent', def: '#1e3a5f', max: 'hex colour' },
  { template: 'quote', field: 'quote', def: 'Your quote goes here.', max: 280 },
  { template: 'quote', field: 'author', def: 'Anonymous', max: 60 },
  { template: 'quote', field: 'brand', def: 'Ogly', max: 40 },
  { template: 'quote', field: 'bg', def: '#0f172a', max: 'hex colour' },
  { template: 'quote', field: 'accent', def: '#f59e0b', max: 'hex colour' },
  { template: 'badge', field: 'name', def: 'Your Name', max: 60 },
  { template: 'badge', field: 'role', def: 'Speaker', max: 80 },
  { template: 'badge', field: 'event', def: 'Event', max: 80 },
  { template: 'badge', field: 'date', def: '(empty)', max: 40 },
  { template: 'badge', field: 'bg', def: '#0f172a', max: 'hex colour' },
  { template: 'badge', field: 'accent', def: '#f59e0b', max: 'hex colour' },
  { template: 'thumbnail', field: 'title', def: 'Your video title here', max: 100 },
  { template: 'thumbnail', field: 'subtitle', def: 'One line that makes people click.', max: 120 },
  { template: 'thumbnail', field: 'brand', def: 'Ogly', max: 40 },
  { template: 'thumbnail', field: 'bg', def: '#0f172a', max: 'hex colour' },
  { template: 'thumbnail', field: 'accent', def: '#f59e0b', max: 'hex colour' },
];

const CURL_EXAMPLE = `curl -X POST ${BASE}/v1/render \\
  -H "Content-Type: application/json" \\
  -d '{"template": "og", "data": {"title": "Our October Newsletter", "subtitle": "What we shipped, and what is next.", "brand": "Acme", "bg": "#0f172a", "accent": "#f59e0b"}}' \\
  --output og.png`;

const JS_EXAMPLE = `const res = await fetch("${BASE}/v1/render", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    template: "og",
    data: {
      title: "Our October Newsletter",
      subtitle: "What we shipped, and what is next.",
      brand: "Acme",
      bg: "#0f172a",
      accent: "#f59e0b",
    },
  }),
});
if (!res.ok) throw new Error(await res.text());
const blob = await res.blob(); // image/png — save it or use URL.createObjectURL(blob)`;

const PY_EXAMPLE = `import requests

res = requests.post("${BASE}/v1/render", json={
    "template": "og",
    "data": {
        "title": "Our October Newsletter",
        "subtitle": "What we shipped, and what is next.",
        "brand": "Acme",
        "bg": "#0f172a",
        "accent": "#f59e0b",
    },
})
res.raise_for_status()
open("og.png", "wb").write(res.content)  # image/png`;

const FAQS = [
  {
    q: 'Do I need an API key?',
    a: 'Not during the beta. The API is free and open — just POST to /v1/render. When the API leaves beta, keys will be issued to everyone on the request list below, and the free tier stays free.',
  },
  {
    q: 'What is the rate limit?',
    a: '100 renders per day per IP, free, best-effort: the counter lives in memory on each server instance, so a burst spread across instances can go slightly over 100 before the limit bites (see /usage). The response carries X-RateLimit-Limit, X-RateLimit-Remaining and X-RateLimit-Reset headers; over the limit you get a 429 with a Retry-After header.',
  },
  {
    q: 'What does the API return?',
    a: 'A PNG image (image/png) at the template size — 1200 × 630 for og and badge, 1600 × 1200 for certificate, 1080 × 1080 for quote, 1280 × 720 for thumbnail. Errors return JSON with { ok: false, error }. Unknown template or bad JSON returns 400.',
  },
  {
    q: 'Can I use the images commercially?',
    a: 'Yes. Images you generate — free tools or API — are yours to use on your blog, newsletter, course or product. There is no watermark.',
  },
];

function Example({ title, code }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the text is still selectable below.
    }
  }
  return (
    <div style={styles.example}>
      <div style={styles.exampleHead}>
        <strong>{title}</strong>
        <button type="button" onClick={copy} style={styles.copyBtn}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre style={styles.pre}>{code}</pre>
    </div>
  );
}

export default function ApiDocs() {
  const [template, setTemplate] = useState('og');
  const [title, setTitle] = useState('Our October Newsletter');
  const [imgUrl, setImgUrl] = useState('');
  const [tryMsg, setTryMsg] = useState('');
  const [email, setEmail] = useState('');
  const [keyMsg, setKeyMsg] = useState('');

  async function tryIt(e) {
    e.preventDefault();
    setTryMsg('Rendering…');
    setImgUrl('');
    // The try-it box only asks for one line of text: send it as the
    // template's first field (title / name / quote) and let the rest
    // fall back to defaults — same as the API does for omitted fields.
    const firstField = template === 'quote' ? 'quote' : template === 'certificate' || template === 'badge' ? 'name' : 'title';
    try {
      const res = await fetch('/v1/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template, data: { [firstField]: title } }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setTryMsg(data.error || `Request failed (${res.status}).`);
        return;
      }
      const blob = await res.blob();
      setImgUrl(URL.createObjectURL(blob));
      setTryMsg('');
      // A successful try-it render is a tool use. The API marks the first
      // successful render per IP with the X-Ogly-First-Render header
      // (best-effort, in-memory — see app/v1/render/route.js); that is
      // the first_api_call signal until API keys exist post-beta.
      trackToolUsed(template);
      if (res.headers.get('X-Ogly-First-Render') === '1') {
        trackFirstApiCall(template);
      }
    } catch {
      setTryMsg('Something went wrong. Please try again.');
    }
  }

  async function requestKey(e) {
    e.preventDefault();
    setKeyMsg('Sending…');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        trackApiKeyCreated('api-docs');
        setKeyMsg('Request received — we will email your free API key when the API leaves beta.');
        setEmail('');
      } else {
        setKeyMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setKeyMsg('Something went wrong. Please try again.');
    }
  }

  return (
    <main style={styles.main}>
      <p style={styles.back}>
        <a href="/">← Back to Ogly</a>
      </p>
      <h1 style={styles.h1}>Ogly API v1 — docs</h1>
      <p style={styles.tag}>
        One POST request, one on-brand PNG. Free beta — no key needed, 100 renders/day per IP.
        The API renders exactly the same images as the free tools.
      </p>

      <h2 style={styles.h2}>Endpoint</h2>
      <pre style={styles.pre}>POST {BASE}/v1/render</pre>
      <p style={styles.body}>
        Send JSON <code>{'{ "template": "og", "data": { ... } }'}</code>. The response is a PNG
        (<code>image/png</code>). Errors return JSON <code>{'{ ok: false, error }'}</code> with
        status 400 (bad template or JSON) or 429 (rate limit). Every response carries{' '}
        <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code> and{' '}
        <code>X-RateLimit-Reset</code> headers.
      </p>

      <h2 style={styles.h2}>Templates</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Template</th>
            <th style={styles.th}>Size</th>
            <th style={styles.th}>What it is</th>
            <th style={styles.th}>Fields (data)</th>
          </tr>
        </thead>
        <tbody>
          {TEMPLATES.map((t) => (
            <tr key={t.name}>
              <td style={styles.td}><code>{t.name}</code></td>
              <td style={styles.td}>{t.size}</td>
              <td style={styles.td}>{t.desc}</td>
              <td style={styles.td}><code>{t.fields}</code></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={styles.h2}>Parameters</h2>
      <p style={styles.body}>
        Every field is optional — omit one and its default is used. Send them
        inside <code>data</code>: <code>{'{ "template": "og", "data": { "title": "..." } }'}</code>.
      </p>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Template</th>
            <th style={styles.th}>Field</th>
            <th style={styles.th}>Default if omitted</th>
            <th style={styles.th}>Max / format</th>
          </tr>
        </thead>
        <tbody>
          {PARAMS.map((p) => (
            <tr key={`${p.template}-${p.field}`}>
              <td style={styles.td}><code>{p.template}</code></td>
              <td style={styles.td}><code>{p.field}</code></td>
              <td style={styles.td}>{p.def}</td>
              <td style={styles.td}>{typeof p.max === 'number' ? `${p.max} chars` : p.max}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={styles.note}>
        Text longer than the max is cut off; text with unsupported characters
        falls back to the default. <code>bg</code> and <code>accent</code> are
        6-digit hex colours, with or without a leading <code>#</code>.
      </p>

      <h2 style={styles.h2}>Errors</h2>
      <p style={styles.body}>
        Errors return JSON <code>{'{ ok: false, error }'}</code>: <code>400</code> for
        an unknown template or invalid JSON, <code>429</code> when the daily
        limit is reached (with a <code>Retry-After</code> header in seconds).
        A successful render returns the PNG directly (<code>image/png</code>),
        not JSON.
      </p>
      <pre style={styles.pre}>{`{ "ok": false, "error": "Unknown template \\"foo\\". Valid templates: og, certificate, quote, badge, thumbnail." }`}</pre>

      <h2 style={styles.h2}>Pricing</h2>
      <p style={styles.body}>
        The beta is free: 100 renders/day per IP, no key, no sign-up. Paid
        plans are coming soon — API Starter <strong>$19/mo</strong> (1,000
        renders/mo), Growth <strong>$49/mo</strong> (10,000 renders/mo), Scale{' '}
        <strong>$99/mo</strong> (50,000 renders/mo), plus Pro{' '}
        <strong>$12/mo</strong> for the web app (brand kits, bulk CSV, saved
        templates). There is no checkout yet — see the full{' '}
        <a href="/pricing">pricing page</a> and join the waitlist there to be
        notified when paid plans open.
      </p>

      <h2 style={styles.h2}>Examples</h2>
      <Example title="curl" code={CURL_EXAMPLE} />
      <Example title="JavaScript (fetch)" code={JS_EXAMPLE} />
      <Example title="Python (requests)" code={PY_EXAMPLE} />

      <h2 style={styles.h2}>Try it now</h2>
      <form onSubmit={tryIt} style={styles.panel}>
        <label style={styles.label}>
          Template
          <select style={styles.input} value={template} onChange={(e) => setTemplate(e.target.value)}>
            {TEMPLATES.map((t) => (
              <option key={t.name} value={t.name}>
                {t.name} — {t.size}
              </option>
            ))}
          </select>
        </label>
        <label style={styles.label}>
          Title / name / quote (first field — the rest use defaults)
          <input
            style={styles.input}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
        </label>
        <button type="submit" style={styles.button}>Render image</button>
        {tryMsg ? <p style={styles.note}>{tryMsg}</p> : null}
        {imgUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imgUrl} alt="Rendered preview" style={styles.preview} />
        ) : null}
      </form>

      <h2 style={styles.h2}>Request a free API key</h2>
      <form onSubmit={requestKey} style={styles.panel}>
        <p style={styles.body}>
          No key is needed during the beta. Leave your email and we will send you a free
          API key when the API leaves beta — higher limits, same free tier. No spam.
        </p>
        <div style={styles.waitRow}>
          <input
            style={styles.input}
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
          />
          <button type="submit" style={styles.waitButton}>Request free key</button>
        </div>
        {keyMsg ? <p style={styles.note}>{keyMsg}</p> : null}
      </form>

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
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }),
        }}
      />

      <footer style={styles.footer}>
        Ogly — free tools first. API v1 beta: free, no key, 100 renders/day per IP (best-effort).{' '}
        <a href="/pricing">Pricing</a> · <a href="/usage">Usage &amp; rate limits</a>
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
  pre: { fontSize: 13, background: '#111827', color: '#e5e7eb', padding: 16, borderRadius: 10, overflowX: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-word' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: 15 },
  th: { textAlign: 'left', borderBottom: '2px solid #e5e7eb', padding: '10px 8px' },
  td: { borderBottom: '1px solid #f1f5f9', padding: '10px 8px', verticalAlign: 'top' },
  note: { fontSize: 13, color: '#6b7280', margin: '12px 0 0' },
  example: { marginBottom: 16 },
  exampleHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  copyBtn: { background: '#fff', border: '1px solid #d1d5db', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontWeight: 700, fontSize: 13 },
  panel: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 },
  label: { fontSize: 14, fontWeight: 700, display: 'flex', flexDirection: 'column', gap: 6 },
  input: { fontSize: 16, padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, width: '100%' },
  button: { display: 'inline-block', textAlign: 'center', background: '#111827', color: '#fff', padding: '14px 18px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', border: 'none', fontSize: 16 },
  waitRow: { display: 'flex', gap: 12 },
  waitButton: { background: '#111827', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' },
  preview: { width: '100%', borderRadius: 8, border: '1px solid #e5e7eb' },
  faq: { marginTop: 40 },
  faqItem: { borderTop: '1px solid #e5e7eb', padding: '16px 0' },
  faqQ: { fontSize: 17, margin: '0 0 6px' },
  faqA: { fontSize: 15, color: '#4b5563', margin: 0, lineHeight: 1.6 },
  footer: { marginTop: 40, fontSize: 13, color: '#9ca3af' },
};
