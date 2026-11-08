// Ogly custom analytics events (Vercel Analytics) — M2 of the execution
// plan, required before the 22 Nov gate.
//
// The <Analytics /> component in app/layout.js records pageviews. The
// helpers below record the 7 custom events the plan needs in metrics.csv:
//   tool_used, signup, api_key_created, badge_clicked, checkout_started,
//   paid, first_api_call.
//
// track() sends a beacon to /_vercel/insights/event, so it survives the
// navigation that follows a download click. No event here invents data:
// every call sits on a real user action, except `paid` — see its note.
//
// `paid` — NO payment route exists yet (M1: Polar primary, Lemon Squeezy
// fallback, decision pending). trackPaid is intentionally NOT called
// anywhere today. The checkout-success handler (payment webhook / return
// page, added the day billing goes live) must call trackPaid(plan) — that
// is the point where payment completion is handled. Do NOT call it from a
// button click: a click is checkout_started, not a payment.
//
// `first_api_call` — there are no API keys in the beta, so "first call per
// key" cannot exist yet. The /v1/render route marks the first successful
// render per IP with the X-Ogly-First-Render response header (best-effort,
// same in-memory approach as the rate limit); the /api-docs try-it box
// fires trackFirstApiCall when it sees that header. True per-key
// first-call tracking arrives with API keys, post-beta.

import { track } from '@vercel/analytics';

export function trackToolUsed(tool) {
  track('tool_used', { tool });
}

export function trackSignup(source) {
  track('signup', { source });
}

export function trackApiKeyCreated(source) {
  track('api_key_created', { source });
}

export function trackBadgeClicked(location) {
  track('badge_clicked', { location });
}

export function trackCheckoutStarted(plan) {
  track('checkout_started', { plan });
}

export function trackPaid(plan) {
  track('paid', { plan });
}

export function trackFirstApiCall(template) {
  track('first_api_call', { template });
}
