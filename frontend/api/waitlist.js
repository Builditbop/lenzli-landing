// Vercel Serverless Function — POST /api/waitlist
//
// Sends the waitlist confirmation email via Resend. The API key lives in
// Vercel's environment variables (server-side only, never shipped to the
// browser). Signups themselves are stored in Firestore directly from the
// client, so this function's single job is to send the email securely.
//
// Required Vercel env vars (Project → Settings → Environment Variables):
//   RESEND_API_KEY   — your Resend API key (re_...)
//   FROM_EMAIL       — e.g. "Lenzli <hello@lenzli.com>"  (verified domain)
//   REPLY_TO_EMAIL   — where replies should land (optional)

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function confirmationHtml() {
  return `
  <div style="background:#FAFAF7;padding:40px 16px;">
    <div style="font-family:Inter,-apple-system,Segoe UI,Arial,sans-serif;max-width:480px;margin:0 auto;padding:36px 28px;color:#1B1B18;background:#FFFFFF;border:1px solid #ECEBE4;border-radius:18px;">
      <div style="display:inline-block;width:40px;height:40px;border:2px solid #1B1B18;border-radius:12px;text-align:center;line-height:40px;margin-bottom:20px;">
        <span style="display:inline-block;width:14px;height:14px;border:2px solid #1B1B18;border-radius:50%;"></span>
      </div>
      <h1 style="font-size:24px;font-weight:600;letter-spacing:-0.02em;margin:0 0 12px;">You're on the list 🎉</h1>
      <p style="font-size:15px;line-height:1.6;color:#56554f;margin:0 0 16px;">
        Thanks for joining the <strong style="color:#1B1B18;">Lenzli</strong> waitlist. You're officially in line — we'll reach out at this address the moment we launch.
      </p>
      <p style="font-size:15px;line-height:1.6;color:#56554f;margin:0 0 24px;">
        Lenzli is the network where image-makers discover each other by style, find real-time help on shoots, and build their crew.
      </p>
      <hr style="border:none;border-top:1px solid #ECEBE4;margin:24px 0;" />
      <p style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#9A998F;margin:0;">Connect · Collaborate · Create</p>
      <p style="font-size:13px;color:#9A998F;margin:6px 0 0;">— The Lenzli team</p>
    </div>
  </div>`;
}

const confirmationText = `You're on the list 🎉

Thanks for joining the Lenzli waitlist! You're officially in line — we'll email you the moment we launch.

Lenzli is the network where image-makers discover each other by style, find real-time help on shoots, and build their crew.

Connect · Collaborate · Create
— The Lenzli team`;

export default async function handler(req, res) {
  // Same-origin in production, but be permissive so it also works from
  // a separately-hosted frontend if you ever move it.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // req.body is auto-parsed by Vercel when Content-Type is application/json.
  const body = typeof req.body === "string" ? safeParse(req.body) : req.body || {};
  const email = (body.email || "").toString().trim();

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || "Lenzli <onboarding@resend.dev>";
  const replyTo = process.env.REPLY_TO_EMAIL;

  // No key configured → don't hard-fail the user; the signup is already
  // stored in Firestore. Report that email was skipped.
  if (!apiKey) {
    console.warn("[api/waitlist] RESEND_API_KEY not set — skipping email.");
    return res.status(200).json({ ok: true, emailed: false });
  }

  try {
    const payload = {
      from,
      to: [email],
      subject: "You're on the Lenzli waitlist 🎉",
      html: confirmationHtml(),
      text: confirmationText,
    };
    if (replyTo) payload.reply_to = replyTo;

    const r = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!r.ok) {
      const detail = await r.text().catch(() => "");
      console.error(`[api/waitlist] Resend ${r.status}: ${detail}`);
      // Email failed, but the signup is saved — don't block the user.
      return res.status(200).json({ ok: true, emailed: false });
    }

    return res.status(200).json({ ok: true, emailed: true });
  } catch (err) {
    console.error("[api/waitlist] send failed:", err);
    return res.status(200).json({ ok: true, emailed: false });
  }
}

function safeParse(s) {
  try { return JSON.parse(s); } catch { return {}; }
}
