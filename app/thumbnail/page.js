'use client';

import { useMemo, useState } from 'react';

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
    q: 'What size is the YouTube thumbnail?',
    a: '1280 × 720 pixels (16:9) — the size YouTube recommends for thumbnails. It stays sharp on desktop, mobile and TV.',
  },
  {
    q: 'Is the thumbnail maker free?',
    a: 'Yes. Type your video title, add a subtitle and your channel name, pick one of the eight styles, and download the PNG. No account, no sign-up, no watermark.',
  },
  {
    q: 'How long should the title be?',
    a: 'Keep it short — 3 to 6 words read best at feed size. The title can be up to 100 characters; longer titles are rendered smaller so they still fit.',
  },
  {
    q: 'How do I use the image on YouTube?',
    a: 'Download the PNG, then in YouTube Studio open your video, go to “Thumbnail” and upload it as a custom thumbnail. It works for any video, new or already published.',
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

export default function ThumbnailPage() {
  const [title, setTitle] = useState('I tried this for 30 days');
  const [subtitle, setSubtitle] = useState('Here is what actually happened.');
  const [brand, setBrand] = useState('Ogly');
  const [preset, setPreset] = useState(PRESETS[0]);

  const url = useMemo(() => {
    const p = new URLSearchParams({
      title,
      subtitle,
      brand,
      bg: preset.bg.replace('#', ''),
      accent: preset.accent.replace('#', ''),
    });
    return `/api/thumbnail?${p.toString()}`;
  }, [title, subtitle, brand, preset]);

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>YouTube Thumbnail Maker</h1>
      <p style={styles.tag}>
        Free 1280 × 720 thumbnails for YouTube. Type your video title, pick a
        style, download. No sign-up.
      </p>

      <div style={styles.grid}>
        <div style={styles.panel}>
          <label style={styles.label}>
            Video title
            <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
          </label>
          <label style={styles.label}>
            Subtitle
            <input style={styles.input} value={subtitle} onChange={(e) => setSubtitle(e.target.value)} maxLength={120} />
          </label>
          <label style={styles.label}>
            Channel / brand
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
          <a href={url} download="ogly-thumbnail.png" style={styles.button}>
            Download PNG (1280 × 720)
          </a>
          <p style={styles.note}>
            16:9 — the size YouTube recommends. Upload it as a custom thumbnail in YouTube Studio.
          </p>
        </div>

        <div style={styles.panel}>
          <div style={styles.label}>Live preview</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="YouTube thumbnail preview" style={styles.preview} />
          <code style={styles.code}>{url}</code>
        </div>
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
  presets: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  preset: { padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 14, fontWeight: 700 },
  button: { display: 'inline-block', textAlign: 'center', background: '#111827', color: '#fff', padding: '14px 18px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, marginTop: 8 },
  note: { fontSize: 13, color: '#6b7280', margin: 0 },
  preview: { width: '100%', borderRadius: 8, border: '1px solid #e5e7eb' },
  code: { fontSize: 12, background: '#f3f4f6', padding: 8, borderRadius: 6, wordBreak: 'break-all' },
  faq: { marginTop: 40 },
  faqItem: { borderTop: '1px solid #e5e7eb', padding: '16px 0' },
  faqQ: { fontSize: 17, margin: '0 0 6px' },
  faqA: { fontSize: 15, color: '#4b5563', margin: 0, lineHeight: 1.6 },
  footer: { marginTop: 40, fontSize: 13, color: '#9ca3af' },
};
