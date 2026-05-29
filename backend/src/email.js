// Email sending via the Resend HTTP API (https://resend.com/docs).
// Uses the built-in fetch (Node 18+), so there's no SDK dependency.
// If RESEND_API_KEY isn't set, sending is skipped gracefully so the
// rest of the API keeps working in local dev.

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Kept intentionally plain and personal (no big card, no images, no emoji) so
// Gmail files it under Primary rather than Promotions.
function confirmationHtml() {
  return `
  <div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#1B1B18;max-width:480px;">
    <p style="margin:0 0 16px;">Hi,</p>
    <p style="margin:0 0 16px;">Thanks for joining the Lenzli waitlist — you're in. We'll email you as soon as we open up access.</p>
    <p style="margin:0 0 16px;">If you have any questions, just reply to this email.</p>
    <p style="margin:0;">— The Lenzli team</p>
  </div>`;
}

const confirmationText = `Hi,

Thanks for joining the Lenzli waitlist — you're in. We'll email you as soon as we open up access.

If you have any questions, just reply to this email.

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
    subject: "You're on the Lenzli waitlist",
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
