'use client';

import { useMemo, useState } from 'react';
import { trackToolUsed, trackSignup, trackBadgeClicked } from './lib/analytics';

const PRESETS = [
  { name: 'Midnight', bg: '#0f172a', accent: '#f59e0b' },
  { name: 'Forest', bg: '#14532d', accent: '#bef264' },
  { name: 'Ocean', bg: '#0c4a6e', accent: '#38bdf8' },
  { name: 'Plum', bg: '#4c1d95', accent: '#f0abfc' },
  { name: 'Paper', bg: '#fafaf9', accent: '#ea580c' },
  { name: 'Sunset', bg: '#7c2d12', accent: '#fdba74' },
  { name: 'Coral', bg: '#9f1239', accent: '#fda4af' },
  { name: 'Teal', bg: '#134e4a', accent: '#5eead4' },
];

const FAQS = [
  {
    q: 'What size is the OG image?',
    a: '1200 × 630 pixels — the standard size for link previews on X, LinkedIn, Facebook and most messaging apps.',
  },
  {
    q: 'Is the OG generator really free?',
    a: 'Yes. Type your title, subtitle and brand, pick one of the eight styles, and download the PNG. No account, no sign-up, no watermark.',
  },
  {
    q: 'Can I use my own brand colours?',
    a: 'The eight built-in styles (Midnight, Forest, Ocean, Plum, Paper, Sunset, Coral, Teal) each pair a background with an accent colour. Custom colours are planned for the paid API and Pro brand kits.',
  },
  {
    q: 'How do I use the image on my blog or newsletter?',
    a: 'Download the PNG and set it as your page’s social / Open Graph image — in most platforms that is the “social image” or “OG image” field. When someone shares your link, this image shows in the preview.',
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

const TOOLS = [
  { href: '/certificate', name: 'Certificate Maker', desc: 'Printable certificates, 1600 × 1200' },
  { href: '/quote-card', name: 'Quote Card Maker', desc: 'Square quote cards, 1080 × 1080' },
  { href: '/event-badge', name: 'Event Badge Maker', desc: 'Speaker cards, 1200 × 630' },
  { href: '/thumbnail', name: 'YouTube Thumbnail Maker', desc: 'Thumbnails, 1280 × 720' },
];

export default function Home() {
  const [title, setTitle] = useState('Your newsletter title here');
  const [subtitle, setSubtitle] = useState('One line that makes people click.');
  const [brand, setBrand] = useState('Ogly');
  const [preset, setPreset] = useState(PRESETS[0]);
  const [email, setEmail] = useState('');
  const [waitMsg, setWaitMsg] = useState('');

  async function joinWaitlist(e) {
    e.preventDefault();
    setWaitMsg('Joining…');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        trackSignup('home');
        setWaitMsg(data.already ? 'You are already on the list.' : 'You are on the list. Thank you!');
        setEmail('');
      } else {
        setWaitMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setWaitMsg('Something went wrong. Please try again.');
    }
  }

  const url = useMemo(() => {
    const p = new URLSearchParams({
      title,
      subtitle,
      brand,
      bg: preset.bg.replace('#', ''),
      accent: preset.accent.replace('#', ''),
    });
    return `/api/og?${p.toString()}`;
  }, [title, subtitle, brand, preset]);

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>Ogly</h1>
      <p style={styles.tag}>
        Free OG images for your newsletter or blog post. Type, pick a style, download.
        No sign-up.
      </p>

      <div style={styles.grid}>
        <div style={styles.panel}>
          <label style={styles.label}>
            Title
            <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
          </label>
          <label style={styles.label}>
            Subtitle
            <input style={styles.input} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} maxLength={160} />
          </label>
          <label style={styles.label}>
            Brand
            <input style={styles.input} value={brand} onChange={(e) => setBrand(e.target.value)} maxLength={40} />
          </label>
          <div style={styles.label}>Style</div>
          <div style={styles.presets}>
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => setPreset(p)}
                style={{
                  ...styles.preset,
                  background: p.bg,
                  border: preset.name === p.name ? `3px solid ${p.accent}` : '3px solid transparent',
                  color: p.name === 'Paper' ? '#111' : '#fff',
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
          <a href={url} download="ogly-og.png" style={styles.button} onClick={() => trackToolUsed('og')}>
            Download PNG (1200 × 630)
          </a>
          <p style={styles.note}>
            API v1 is live in beta: one request, one image.{' '}
            <a href="/api-docs">Read the API docs</a> — free, no key, 100 renders/day.
          </p>
        </div>

        <div style={styles.panel}>
          <div style={styles.label}>Live preview</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="OG preview" style={styles.preview} />
          <p style={styles.note}>
            <a href="/" onClick={() => trackBadgeClicked('og')}>
              Made with Ogly
            </a>{' '}
            — free OG images for newsletters &amp; blogs.
          </p>
          <code style={styles.code}>{url}</code>
        </div>
      </div>

      <h2 style={styles.h2}>More free tools</h2>
      <div style={styles.tools}>
        {TOOLS.map((t) => (
          <a key={t.href} href={t.href} style={styles.tool}>
            <strong>{t.name}</strong>
            <span style={styles.toolDesc}>{t.desc}</span>
          </a>
        ))}
      </div>

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

      <form onSubmit={joinWaitlist} style={styles.waitlist}>
        <h2 style={styles.h2}>Get the API + Pro first</h2>
        <p style={styles.tag}>
          Join the waitlist for the paid API and Pro brand kits. No spam, one email when it launches.
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
          <button type="submit" style={styles.waitButton}>Join waitlist</button>
        </div>
        {waitMsg ? <p style={styles.note}>{waitMsg}</p> : null}
      </form>

      <footer style={styles.footer}>
        Ogly — free tools first. <a href="/api-docs">API v1 (beta)</a> ·{' '}
        <a href="/pricing">Pricing</a> · <a href="/usage">Usage &amp; rate limits</a> + Pro brand kits.
      </footer>
    </main>
  );
}

const styles = {
  main: { maxWidth: 1020, margin: '0 auto', padding: '48px 20px', fontFamily: 'sans-serif', color: '#111827' },
  h1: { fontSize: 48, margin: '0 0 8px' },
  tag: { fontSize: 19, color: '#4b5563', margin: '0 0 32px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 },
  panel: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 },
  label: { fontSize: 14, fontWeight: 700, display: 'flex', flexDirection: 'column', gap: 6 },
  input: { fontSize: 16, padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8 },
  presets: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  preset: { padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 14, fontWeight: 700 },
  button: { display: 'inline-block', textAlign: 'center', background: '#111827', color: '#fff', padding: '14px 18px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, marginTop: 8 },
  note: { fontSize: 13, color: '#6b7280', margin: 0 },
  h2: { fontSize: 28, margin: '40px 0 16px' },
  tools: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 },
  tool: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, textDecoration: 'none', color: '#111827', display: 'flex', flexDirection: 'column', gap: 6 },
  toolDesc: { fontSize: 14, color: '#6b7280' },
  waitlist: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginTop: 40 },
  waitRow: { display: 'flex', gap: 12 },
  faq: { marginTop: 40 },
  faqItem: { borderTop: '1px solid #e5e7eb', padding: '16px 0' },
  faqQ: { fontSize: 17, margin: '0 0 6px' },
  faqA: { fontSize: 15, color: '#4b5563', margin: 0, lineHeight: 1.6 },
  waitButton: { background: '#111827', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16 },
  preview: { width: '100%', borderRadius: 8, border: '1px solid #e5e7eb' },
  code: { fontSize: 12, background: '#f3f4f6', padding: 8, borderRadius: 6, wordBreak: 'break-all' },
  footer: { marginTop: 40, fontSize: 13, color: '#9ca3af' },
};
