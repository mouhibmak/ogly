'use client';

import { useMemo, useState } from 'react';

const PRESETS = [
  { name: 'Classic', bg: '#fdfbf7', accent: '#1e3a5f' },
  { name: 'Forest', bg: '#f0fdf4', accent: '#166534' },
  { name: 'Ocean', bg: '#f0f9ff', accent: '#075985' },
  { name: 'Plum', bg: '#fdf4ff', accent: '#701a75' },
];

export default function Certificate() {
  const [name, setName] = useState('Your Name');
  const [course, setCourse] = useState('Course or achievement');
  const [date, setDate] = useState('November 2026');
  const [issuer, setIssuer] = useState('Ogly');
  const [preset, setPreset] = useState(PRESETS[0]);

  const url = useMemo(() => {
    const p = new URLSearchParams({
      name,
      course,
      date,
      issuer,
      bg: preset.bg.replace('#', ''),
      accent: preset.accent.replace('#', ''),
    });
    return `/api/certificate?${p.toString()}`;
  }, [name, course, date, issuer, preset]);

  return (
    <main style={styles.main}>
      <h1 style={styles.h1}>Certificate Maker</h1>
      <p style={styles.tag}>
        Free printable certificate PNG. Type a name, pick a style, download.
        No sign-up.
      </p>

      <div style={styles.grid}>
        <div style={styles.panel}>
          <label style={styles.label}>
            Recipient name
            <input style={styles.input} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
          </label>
          <label style={styles.label}>
            Course / achievement
            <input style={styles.input} value={course} onChange={(e) => setCourse(e.target.value)} maxLength={120} />
          </label>
          <label style={styles.label}>
            Date
            <input style={styles.input} value={date} onChange={(e) => setDate(e.target.value)} maxLength={40} />
          </label>
          <label style={styles.label}>
            Issuer / brand
            <input style={styles.input} value={issuer} onChange={(e) => setIssuer(e.target.value)} maxLength={40} />
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
                  color: '#111',
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
          <a href={url} download="ogly-certificate.png" style={styles.button}>
            Download PNG (1600 × 1200)
          </a>
          <p style={styles.note}>
            Print-ready landscape certificate — great for courses, workshops and events.
          </p>
        </div>

        <div style={styles.panel}>
          <div style={styles.label}>Live preview</div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="Certificate preview" style={styles.preview} />
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
  presets: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  preset: { padding: '8px 14px', borderRadius: 999, cursor: 'pointer', fontSize: 14, fontWeight: 700 },
  button: { display: 'inline-block', textAlign: 'center', background: '#111827', color: '#fff', padding: '14px 18px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, marginTop: 8 },
  note: { fontSize: 13, color: '#6b7280', margin: 0 },
  preview: { width: '100%', borderRadius: 8, border: '1px solid #e5e7eb' },
  code: { fontSize: 12, background: '#f3f4f6', padding: 8, borderRadius: 6, wordBreak: 'break-all' },
  footer: { marginTop: 40, fontSize: 13, color: '#9ca3af' },
};
