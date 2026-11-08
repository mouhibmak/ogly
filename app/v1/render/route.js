// Ogly API v1 (beta) — POST /v1/render
//
// Accepts JSON { template, data } and returns a PNG rendered by the same
// shared renderers as the free tools (see lib/renderers.jsx), so API
// images are identical to the ones the free tools produce.
//
// POST { "template": "og", "data": { "title": "...", "subtitle": "...",
//   "brand": "Acme", "bg": "#0f172a", "accent": "#f59e0b" } }
//   -> image/png, 1200x630
// Templates: og (1200x630), certificate (1600x1200), quote (1080x1080),
// badge (1200x630). Unknown template or bad JSON -> 400 JSON.
//
// No billing: the beta is free and needs no API key. A free API-key
// request form lives on /api-docs; requests join the Ogly waitlist
// (Google Form, same mechanism as /api/waitlist) and keys are issued by
// email when the API leaves beta. No keys are invented here.
//
// Rate limit: 100 renders/day per IP, in-memory. Honest limit of this
// approach: Vercel serverless runs many isolates, each with its own
// memory, so the count is per-instance, best-effort — a single IP
// hammering from many parallel connections can exceed it. It stops
// casual abuse; real per-account limits arrive with API keys.

import { ImageResponse } from '@vercel/og';
import { TEMPLATES, clean, color } from '../../../lib/renderers';

export const runtime = 'edge';

const LIMIT_PER_DAY = 100;
const WINDOW_MS = 24 * 60 * 60 * 1000;

// ip -> { count, resetAt }
const buckets = new Map();

function clientIp(request) {
  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return request.headers.get('x-real-ip') || 'unknown';
}

function checkLimit(ip) {
  const now = Date.now();
  // Opportunistic cleanup so the map cannot grow without bound.
  if (buckets.size > 10000) {
    for (const [key, b] of buckets) {
      if (now > b.resetAt) buckets.delete(key);
    }
  }
  let b = buckets.get(ip);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + WINDOW_MS };
    buckets.set(ip, b);
  }
  if (b.count >= LIMIT_PER_DAY) {
    return { allowed: false, remaining: 0, resetAt: b.resetAt };
  }
  b.count += 1;
  return { allowed: true, remaining: LIMIT_PER_DAY - b.count, resetAt: b.resetAt };
}

function rateHeaders(result) {
  return {
    'X-RateLimit-Limit': String(LIMIT_PER_DAY),
    'X-RateLimit-Remaining': String(result.remaining),
    'X-RateLimit-Reset': String(Math.ceil(result.resetAt / 1000)),
  };
}

// Per-template cleaning, mirroring the GET routes' defaults and limits.
function buildData(template, raw) {
  const d = raw && typeof raw === 'object' ? raw : {};
  switch (template) {
    case 'og':
      return {
        title: clean(d.title, 'Ogly'),
        subtitle: clean(d.subtitle, 'On-brand images from text, in seconds.', 160),
        brand: clean(d.brand, 'Ogly', 40),
        bg: color(d.bg, '#0f172a'),
        accent: color(d.accent, '#f59e0b'),
      };
    case 'certificate':
      return {
        name: clean(d.name, 'Your Name', 80),
        course: clean(d.course, 'Course or achievement', 120),
        date: clean(d.date, 'November 2026', 40),
        issuer: clean(d.issuer, 'Ogly', 40),
        bg: color(d.bg, '#fdfbf7'),
        accent: color(d.accent, '#1e3a5f'),
      };
    case 'quote':
      return {
        quote: clean(d.quote, 'Your quote goes here.', 280),
        author: clean(d.author, 'Anonymous', 60),
        brand: clean(d.brand, 'Ogly', 40),
        bg: color(d.bg, '#0f172a'),
        accent: color(d.accent, '#f59e0b'),
      };
    case 'badge':
      return {
        name: clean(d.name, 'Your Name', 60),
        role: clean(d.role, 'Speaker', 80),
        event: clean(d.event, 'Event', 80),
        date: clean(d.date, '', 40),
        bg: color(d.bg, '#0f172a'),
        accent: color(d.accent, '#f59e0b'),
      };
    default:
      return null;
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    api: 'Ogly API v1 (beta)',
    endpoint: 'POST /v1/render',
    free: true,
    api_key_required: false,
    rate_limit: `${LIMIT_PER_DAY} renders/day per IP`,
    templates: Object.entries(TEMPLATES).map(([name, t]) => ({
      name,
      width: t.width,
      height: t.height,
      description: t.description,
      fields: t.fields,
    })),
    docs: '/api-docs',
  });
}

export async function POST(request) {
  const ip = clientIp(request);
  const limit = checkLimit(ip);
  if (!limit.allowed) {
    const retryAfter = Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000));
    return Response.json(
      {
        ok: false,
        error: `Rate limit reached: ${LIMIT_PER_DAY} renders/day per IP. Try again later, or request a free API key at /api-docs.`,
      },
      {
        status: 429,
        headers: { ...rateHeaders(limit), 'Retry-After': String(retryAfter) },
      }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: 'Invalid JSON. Send { "template": "og", "data": { ... } }.' },
      { status: 400, headers: rateHeaders(limit) }
    );
  }

  const template = typeof body?.template === 'string' ? body.template : '';
  if (!TEMPLATES[template]) {
    return Response.json(
      {
        ok: false,
        error: `Unknown template "${template}". Valid templates: ${Object.keys(TEMPLATES).join(', ')}.`,
      },
      { status: 400, headers: rateHeaders(limit) }
    );
  }

  const data = buildData(template, body?.data);
  const t = TEMPLATES[template];
  return new ImageResponse(t.render(data), {
    width: t.width,
    height: t.height,
    headers: rateHeaders(limit),
  });
}
