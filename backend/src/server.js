import "dotenv/config";
import express from "express";
import cors from "cors";

import { addEmail, getAll, count } from "./store.js";
import { sendConfirmationEmail, sendOperatorNotification } from "./email.js";

const app = express();
const PORT = process.env.PORT || 8787;

// ── CORS ──
const origins = (process.env.FRONTEND_ORIGIN || "*")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origins.includes("*") ? true : origins,
    methods: ["GET", "POST"],
  })
);
app.use(express.json({ limit: "10kb" }));

// Basic email shape check (defence-in-depth; the real validity test is delivery).
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Health check ──
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "lenzli-waitlist", time: new Date().toISOString() });
});

// ── Join the waitlist ──
app.post("/api/waitlist", async (req, res) => {
  const email = (req.body?.email || "").toString().trim();
  const source = (req.body?.source || "landing_page").toString().slice(0, 64);

  if (!EMAIL_RE.test(email) || email.length > 254) {
    return res.status(400).json({ ok: false, error: "Please enter a valid email address." });
  }

  try {
    const result = await addEmail(email, source);

    // Already on the list — treat as success (idempotent), don't re-email.
    if (result.alreadyJoined) {
      return res.json({ ok: true, alreadyJoined: true });
    }

    // Fire off emails but don't fail the request if delivery hiccups —
    // the signup is already saved.
    sendConfirmationEmail(email).catch((err) =>
      console.error("[waitlist] confirmation email failed:", err.message)
    );
    sendOperatorNotification(email).catch((err) =>
      console.error("[waitlist] operator notification failed:", err.message)
    );

    return res.json({ ok: true, alreadyJoined: false });
  } catch (err) {
    console.error("[waitlist] failed to save signup:", err);
    return res.status(500).json({ ok: false, error: "Something went wrong. Please try again." });
  }
});

// ── Admin: optional token gate ──
function requireAdmin(req, res, next) {
  const token = process.env.ADMIN_TOKEN;
  if (!token) return next(); // open in dev when unset
  if (req.get("x-admin-token") === token) return next();
  return res.status(401).json({ ok: false, error: "Unauthorized" });
}

app.get("/api/waitlist/count", requireAdmin, async (_req, res) => {
  res.json({ ok: true, count: await count() });
});

app.get("/api/waitlist", requireAdmin, async (_req, res) => {
  res.json({ ok: true, entries: await getAll() });
});

app.listen(PORT, () => {
  console.log(`Lenzli waitlist API listening on http://localhost:${PORT}`);
  console.log(`Allowed origins: ${origins.join(", ")}`);
  if (!process.env.RESEND_API_KEY) {
    console.log("⚠  RESEND_API_KEY not set — signups save but no emails send yet.");
  }
});
