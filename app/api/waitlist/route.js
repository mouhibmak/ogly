// Waitlist storage: Google Form (free, persistent, works on Vercel).
//
// The old local data/waitlist.json store could not persist on Vercel
// (serverless filesystem is read-only) and has been retired. Signups are
// now submitted to the public Google Form response endpoint — no auth
// needed for submissions.
//
// Form: "Ogly Waitlist"
//   formId: 1s6026kRhHSrhGiy6Y83sE6OnUM6KpIkrsubhnsB38ew
//   responderUri: https://docs.google.com/forms/d/e/1FAIpQLSfEHrl7v_u33gwNTXxNbmwYjcZJ3oChMQ2FHodKTr3eg3MdPA/viewform
//   Email question entry field: entry.1481238504
//   (verified: POSTing entry.1481238504=<email> returns 200 and the
//   response appears in the form's response list)
//
// Honest limits (no faking):
// - GET cannot read the real signup count from Vercel: reading form
//   responses needs Google auth, which the serverless route does not
//   have. So GET returns { ok: true } with NO count rather than a
//   made-up number. The real count lives in the form's Responses tab
//   (or the linked Sheet).
// - POST cannot detect duplicates for the same reason, so it never
//   returns { already: true }. A repeated email is submitted again and
//   can be de-duplicated by the owner in the Responses/Sheet view.

export const runtime = 'nodejs';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const FORM_RESPONSE_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSfEHrl7v_u33gwNTXxNbmwYjcZJ3oChMQ2FHodKTr3eg3MdPA/formResponse';
const ENTRY_EMAIL = 'entry.1481238504';

export async function GET() {
  // No fake count: the real count is only visible in the Google Form.
  return Response.json({ ok: true });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }
  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  if (!EMAIL.test(email) || email.length > 120) {
    return Response.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 });
  }

  try {
    const res = await fetch(FORM_RESPONSE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // Google rejects some non-browser user agents on formResponse.
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
      },
      body: new URLSearchParams({ [ENTRY_EMAIL]: email }),
    });
    if (!res.ok) {
      return Response.json(
        { ok: false, error: 'Waitlist storage is unavailable right now. Please try again later.' },
        { status: 500 }
      );
    }
  } catch {
    return Response.json(
      { ok: false, error: 'Waitlist storage is unavailable right now. Please try again later.' },
      { status: 500 }
    );
  }

  return Response.json({ ok: true });
}
