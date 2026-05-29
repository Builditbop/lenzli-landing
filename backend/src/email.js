// Email sending via the Resend HTTP API (https://resend.com/docs).
// Uses the built-in fetch (Node 18+), so there's no SDK dependency.
// If RESEND_API_KEY isn't set, sending is skipped gracefully so the
// rest of the API keeps working in local dev.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

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

async function sendViaResend({ to, subject, html, text }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || "Lenzli <onboarding@resend.dev>";
  const replyTo = process.env.REPLY_TO_EMAIL; // optional: where replies should land

  if (!apiKey) {
    console.warn(
      `[email] RESEND_API_KEY not set — skipping email to ${to}. (Signup was still saved.)`
    );
    return { sent: false, skipped: true };
  }

  const payload = { from, to: [to], subject, html, text };
  if (replyTo) payload.reply_to = replyTo;

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend responded ${res.status}: ${detail}`);
  }

  const data = await res.json().catch(() => ({}));
  return { sent: true, id: data.id };
}

/** Send the "you're on the waitlist" email to the person who signed up. */
export function sendConfirmationEmail(to) {
  return sendViaResend({
    to,
    subject: "You're on the Lenzli waitlist 🎉",
    html: confirmationHtml(),
    text: confirmationText,
  });
}

/** Optionally notify the operator that someone joined. No-op if NOTIFY_EMAIL is unset. */
export function sendOperatorNotification(joinedEmail) {
  const notify = process.env.NOTIFY_EMAIL;
  if (!notify) return Promise.resolve({ sent: false, skipped: true });
  return sendViaResend({
    to: notify,
    subject: `New Lenzli waitlist signup: ${joinedEmail}`,
    html: `<p style="font-family:Inter,Arial,sans-serif;">New waitlist signup: <strong>${joinedEmail}</strong></p>`,
    text: `New waitlist signup: ${joinedEmail}`,
  });
}
