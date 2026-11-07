'use client';

import { useMemo, useState } from 'react';

const PRESETS = [
  { name: 'Midnight', bg: '#0f172a', accent: '#f59e0b' },
  { name: 'Forest', bg: '#14532d', accent: '#bef264' },
  { name: 'Ocean', bg: '#0c4a6e', accent: '#38bdf8' },
  { name: 'Plum', bg: '#4c1d95', accent: '#f0abfc' },
];

export default function QuoteCardPage() {
  const [quote, setQuote] = useState('The best time to start was yesterday. The second best time is now.');
  const [author, setAuthor] = useState('Anonymous');
  const [brand, setBrand] = useState('Ogly');
  const [preset, setPreset] = useState(PRESETS[0]);

  const url = useMemo(() => {
    const p = new URLSearchParams({
      quote,
      author,
      brand,
      bg: preset.bg.replace('#', ''),
      accent: preset.accent.replace('#', ''),
    });
    return `/api/quote?${p.toString()}`;
  }, [quote, author, brand, preset]);

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>Quote Card Maker</h1>
      <p style={styles.tag}>
        Free 1080 × 1080 quote cards for X and LinkedIn. Type your quote, pick a
        style, download. No sign-up.
      </p>

      <div style={styles.grid}>
        <div style={styles.panel}>
          <label style={styles.label}>
            Quote
            <textarea
              style={styles.textarea}
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              maxLength={280}
              rows={4}
            />
          </label>
          <label style={styles.label}>
            Author
            <input style={styles.input} value={author} onChange={(e) => setAuthor(e.target.value)} maxLength={60} />
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
                  color: '#fff',
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
          <a href={url} download="ogly-quote-card.png" style={styles.button}>
            Download PNG (1080 × 1080)
          </a>
          <p style={styles.note}>
            Square format — made for X and LinkedIn feeds.
          </p>
        </div>

        <div style={styles.panel}>
          <div style={styles.label}>Live preview</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Quote card preview" style={styles.preview} />
          <code style={styles.code}>{url}</code>
        </div>
      </div>

      <footer style={styles.footer}>
        Ogly — free tools first. Pro API + brand kits coming soon.
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
  textarea: { fontSize: 16, padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, resize: 'vertical' },
  presets: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  preset: { padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 14, fontWeight: 700 },
  button: { display: 'inline-block', textAlign: 'center', background: '#111827', color: '#fff', padding: '14px 18px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, marginTop: 8 },
  note: { fontSize: 13, color: '#6b7280', margin: 0 },
  preview: { width: '100%', borderRadius: 8, border: '1px solid #e5e7eb' },
  code: { fontSize: 12, background: '#f3f4f6', padding: 8, borderRadius: 6, wordBreak: 'break-all' },
  footer: { marginTop: 40, fontSize: 13, color: '#9ca3af' },
};
