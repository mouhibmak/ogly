'use client';

import { useMemo, useState } from 'react';
import { trackToolUsed, trackBadgeClicked } from '../lib/analytics';

const PRESETS = [
  { name: 'Midnight', bg: '#0f172a', accent: '#f59e0b' },
  { name: 'Forest', bg: '#14532d', accent: '#bef264' },
  { name: 'Ocean', bg: '#0c4a6e', accent: '#38bdf8' },
  { name: 'Plum', bg: '#4c1d95', accent: '#f0abfc' },
];

const FAQS = [
  {
    q: 'What size is the event badge?',
    a: '1200 × 630 pixels — the same size as a link-preview image, so it works both as a social post and as a share preview.',
  },
  {
    q: 'Is the event badge maker free?',
    a: 'Yes. Type the name, role, event and date, pick one of the four styles, and download the PNG. No account, no sign-up, no watermark.',
  },
  {
    q: 'What is the badge for?',
    a: 'Speaker and guest announcements: post it when you announce a speaker, or share it as the image for an event page or post.',
  },
  {
    q: 'Can I make a badge for someone else?',
    a: 'Yes — fill in their name, role, event and date, download the PNG, and send it to them.',
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

export default function EventBadgePage() {
  const [name, setName] = useState('Your Name');
  const [role, setRole] = useState('Speaker & Founder');
  const [event, setEvent] = useState('Tech Talks 2026');
  const [date, setDate] = useState('Nov 7, 2026');
  const [preset, setPreset] = useState(PRESETS[0]);

  const url = useMemo(() => {
    const p = new URLSearchParams({
      name,
      role,
      event,
      date,
      bg: preset.bg.replace('#', ''),
      accent: preset.accent.replace('#', ''),
    });
    return `/api/badge?${p.toString()}`;
  }, [name, role, event, date, preset]);

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>Event Badge Maker</h1>
      <p style={styles.tag}>
        Free speaker / event badge image. Type the details, pick a style, download.
        No sign-up.
      </p>

      <div style={styles.grid}>
        <div style={styles.panel}>
          <label style={styles.label}>
            Name
            <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
          </label>
          <label style={styles.label}>
            Role / title
            <input style={styles.input} value={role} onChange={(e) => setRole(e.target.value)} maxLength={80} />
          </label>
          <label style={styles.label}>
            Event name
            <input style={styles.input} value={event} onChange={(e) => setEvent(e.target.value)} maxLength={80} />
          </label>
          <label style={styles.label}>
            Date
            <input style={styles.input} value={date} onChange={(e) => setDate(e.target.value)} maxLength={40} />
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
          <a href={url} download="ogly-event-badge.png" style={styles.button} onClick={() => trackToolUsed('badge')}>
            Download PNG (1200 × 630)
          </a>
          <p style={styles.note}>
            Badge image for speakers, guests and event announcements — one request, one image.
          </p>
        </div>

        <div style={styles.panel}>
          <div style={styles.label}>Live preview</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Event badge preview" style={styles.preview} />
          <p style={styles.note}>
            <a href="/" onClick={() => trackBadgeClicked('badge')}>
              Made with Ogly
            </a>{' '}
            — free event badge maker.
          </p>
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
