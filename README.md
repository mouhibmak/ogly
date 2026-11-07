# Ogly

API-first branded-image generation. Free web tools + paid API (planned) that turn
text/data into on-brand images: OG/social images, newsletter headers, certificates,
quote cards, event badges.

Rendering is pure SVG→PNG (Satori / `@vercel/og`) — no AI, no headless Chrome,
~$0 cost per image.

## Free tools (live)

- OG image generator — 1200×630
- Certificate maker — 1600×1200
- Quote-card maker — 1080×1080
- Event-badge maker — 1200×630

Live: https://ogly-mouhib2.vercel.app/

## Run locally

```bash
npm install
npm run dev
```

## API

- `GET /api/og?title=…&subtitle=…&brand=…&preset=…` → 1200×630 PNG
- `GET /api/certificate`, `/api/quote`, `/api/badge` → rendered PNGs
- `POST /api/waitlist` → joins the Ogly waitlist (Google Form backend)

## Stack

Next.js 14, React 18, `@vercel/og`. Deploys on Vercel (free tier).
