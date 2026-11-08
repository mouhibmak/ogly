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

## Traffic measurement (free only, $0)

- **Vercel Web Analytics** — enabled via `@vercel/analytics` (`<Analytics />` in the
  root layout). Free on the Vercel Hobby plan: 50,000 events/month, 1-month
  reporting window, no custom events; collection simply pauses if the cap is
  hit — Hobby cannot be charged, so there is no overage bill. Dashboard:
  Vercel project → Analytics tab.
- **Vercel deployment logs** — function invocations per API route give a rough
  count of images rendered (not unique visitors).
- **Waitlist** — the real signup count lives only in the Google Form
  ("Ogly Waitlist") Responses tab / linked Sheet; the `/api/waitlist` GET
  returns no count because reading form responses needs Google auth the
  serverless route does not have. Never invent a count.
- **No Google Search Console yet** — not signed in as the owner; that step
  needs the owner, not an agent.
- Week-0 baseline (7 Nov 2026): visits unknown — no analytics existed before
  this work. See `~/workspace/my-own-project/traffic-log.md`.
