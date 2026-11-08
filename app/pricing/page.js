'use client';

import { useState } from 'react';
import { trackSignup, trackCheckoutStarted } from '../lib/analytics';

const TIERS = [
  {
    name: 'Free beta',
    price: '$0',
    per: 'forever',
    tag: 'Live now — no key, no sign-up',
    features: [
      '100 renders/day per IP (best-effort)',
      'All 5 templates: og, certificate, quote, badge, thumbnail',
      'Free web tools, no watermark',
      'Rate-limit headers on every response',
    ],
    cta: 'Try the free tools',
    href: '/',
  },
  {
    name: 'API Starter',
    price: '$19',
    per: '/month',
    tag: 'Coming soon — join the waitlist',
    features: [
      '1,000 renders/month',
      'API key with higher limits',
      'All 5 templates',
      'Overage: $10 per extra 1,000 renders',
    ],
    cta: 'Join the waitlist',
    href: '#waitlist',
  },
  {
    name: 'API Growth',
    price: '$49',
    per: '/month',
    tag: 'Coming soon — join the waitlist',
    features: [
      '10,000 renders/month',
      'API key with higher limits',
      'All 5 templates',
      'Overage: $10 per extra 1,000 renders',
    ],
    cta: 'Join the waitlist',
    href: '#waitlist',
  },
  {
    name: 'API Scale',
    price: '$99',
    per: '/month',
    tag: 'Coming soon — join the waitlist',
    features: [
      '50,000 renders/month',
      'API key with higher limits',
      'All 5 templates',
      'Overage: $10 per extra 1,000 renders',
    ],
    cta: 'Join the waitlist',
    href: '#waitlist',
  },
  {
    name: 'Pro (web app)',
    price: '$12',
    per: '/month',
    tag: 'Coming soon — join the waitlist',
    features: [
      'Brand kits: logo, colours, fonts saved',
      'Bulk CSV → ZIP of images',
      'Saved templates',
      'No “Made with Ogly” badge, higher resolution',
    ],
    cta: 'Join the waitlist',
    href: '#waitlist',
  },
];

const FAQS = [
  {
    q: 'Can I pay for a plan today?',
    a: 'No — there is no checkout yet. The paid plans above are coming soon. Join the waitlist below and you will get an email when paid plans open. The free beta stays free.',
  },
  {
    q: 'What does the free beta include?',
    a: '100 renders a day per IP through POST /v1/render, no API key and no sign-up, all five templates. The limit is best-effort (see /usage): the counter lives in memory on each server instance, so a burst spread across instances can go slightly over 100.',
  },
  {
    q: 'How does overage work on paid API plans?',
    a: '$10 per extra 1,000 renders beyond your monthly included renders. Overage only applies once paid billing is live.',
  },
  {
    q: 'What is Pro for, if I only need the API?',
    a: 'Pro is the web app, not the API: brand kits, bulk CSV rendering and saved templates for people who make images by hand. API plans are for developers calling POST /v1/render.',
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

export default function Pricing() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  async function joinWaitlist(e) {
    e.preventDefault();
    setMsg('Joining…');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        trackSignup('pricing');
        setMsg('You are on the list. We will email you when paid plans open.');
        setEmail('');
      } else {
        setMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setMsg('Something went wrong. Please try again.');
    }
  }

  return (
    <main style={styles.main}>
      <p style={styles.back}>
        <a href="/">← Back to Ogly</a>
      </p>
      <h1 style={styles.h1}>Pricing</h1>
      <p style={styles.tag}>
        Start free — 100 renders a day, no key, no sign-up. Paid API plans and
        Pro are coming soon: join the waitlist and we will email you the day
        they open. No checkout exists yet, so nothing here can be bought today.
      </p>

      <div style={styles.grid}>
        {TIERS.map((t) => (
          <div key={t.name} style={styles.card}>
            <h2 style={styles.cardName}>{t.name}</h2>
            <p style={styles.price}>
              {t.price}
              <span style={styles.per}>{t.per}</span>
            </p>
            <p style={styles.cardTag}>{t.tag}</p>
            <ul style={styles.list}>
              {t.features.map((f) => (
                <li key={f} style={styles.li}>{f}</li>
              ))}
            </ul>
            <a
              href={t.href}
              style={styles.button}
              onClick={() => {
                // Only paid tiers start a checkout. The Free beta button
                // just scrolls to the tools; the paid buttons scroll to
                // the waitlist today (no checkout exists yet) and will
                // open checkout once the M1 payment route is live.
                if (t.name !== 'Free beta') trackCheckoutStarted(t.name);
              }}
            >
              {t.cta}
            </a>
          </div>
        ))}
      </div>

      <p style={styles.note}>
        Prices in USD. API renders are counted per month on paid plans; the
        free beta is 100 renders/day per IP. Full technical docs:{' '}
        <a href="/api-docs">/api-docs</a> — limits in plain English:{' '}
        <a href="/usage">/usage</a>.
      </p>

      <form id="waitlist" onSubmit={joinWaitlist} style={styles.waitlist}>
        <h2 style={styles.h2}>Get notified when paid plans open</h2>
        <p style={styles.tag}>
          One email when API Starter, Growth, Scale or Pro launches. No spam.
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
        {msg ? <p style={styles.note}>{msg}</p> : null}
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />

      <footer style={styles.footer}>
        Ogly — free tools first. <a href="/api-docs">API v1 (beta)</a> ·{' '}
        <a href="/usage">Usage &amp; rate limits</a>
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
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 },
  card: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 10 },
  cardName: { fontSize: 20, margin: 0 },
  price: { fontSize: 36, fontWeight: 800, margin: 0 },
  per: { fontSize: 16, fontWeight: 400, color: '#6b7280' },
  cardTag: { fontSize: 14, fontWeight: 700, color: '#0f766e', margin: 0 },
  list: { margin: '8px 0', paddingLeft: 20, fontSize: 15, lineHeight: 1.7, color: '#374151' },
  li: { marginBottom: 4 },
  button: { display: 'inline-block', textAlign: 'center', background: '#111827', color: '#fff', padding: '12px 18px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, marginTop: 'auto' },
  note: { fontSize: 13, color: '#6b7280', margin: '16px 0 0' },
  waitlist: { border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginTop: 40 },
  waitRow: { display: 'flex', gap: 12 },
  input: { fontSize: 16, padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, flex: 1 },
  waitButton: { background: '#111827', color: '#fff', padding: '10px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 16, whiteSpace: 'nowrap' },
  faq: { marginTop: 40 },
  faqItem: { borderTop: '1px solid #e5e7eb', padding: '16px 0' },
  faqQ: { fontSize: 17, margin: '0 0 6px' },
  faqA: { fontSize: 15, color: '#4b5563', margin: 0, lineHeight: 1.6 },
  footer: { marginTop: 40, fontSize: 13, color: '#9ca3af' },
};
