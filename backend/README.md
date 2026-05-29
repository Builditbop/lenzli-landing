# Lenzli Waitlist Backend

A tiny, self-contained API for the landing page. It stores waitlist signups and
sends each new signup a branded confirmation email. No database setup required —
signups persist to a JSON file out of the box; add one API key to turn on email.

## Endpoints

| Method | Path                   | Description                                            |
| ------ | ---------------------- | ------------------------------------------------------ |
| GET    | `/health`              | Liveness check.                                        |
| POST   | `/api/waitlist`        | Body `{ "email": "..." }`. Saves + emails. Idempotent. |
| GET    | `/api/waitlist/count`  | Number of signups. *(admin)*                           |
| GET    | `/api/waitlist`        | All signups. *(admin)*                                 |

Admin routes are open when `ADMIN_TOKEN` is unset; once set, pass it as the
`x-admin-token` header.

## Run locally

```bash
cd backend
npm install
cp .env.example .env      # already done for you
npm run dev               # auto-reloads on changes  (or: npm start)
```

The API listens on `http://localhost:8787`. The frontend calls it automatically
in dev (it defaults to that URL when `VITE_WAITLIST_API` is unset).

## Turn on real emails (Resend)

Signups save without any email config — you'll just see a warning in the logs.
To actually send the confirmation email:

1. Create a free account at <https://resend.com>.
2. **Add and verify a sending domain** (e.g. `lenzli.com`). For quick testing you
   can use Resend's shared `onboarding@resend.dev` sender with no domain.
3. Create an **API key** and put it in `.env`:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
   FROM_EMAIL=Lenzli <hello@lenzli.com>
   ```
4. Restart the server. New signups now receive the email.

Optional: set `NOTIFY_EMAIL=you@example.com` to get pinged on every signup.

> Prefer a different provider (SendGrid, Mailgun, Postmark, Gmail SMTP)? Only
> `src/email.js` needs to change — swap the `fetch` call for that provider's API
> or use `nodemailer` for raw SMTP. The rest of the app stays the same.

## Data

Signups are written to `backend/data/waitlist.json` (git-ignored). De-duplication
is case-insensitive. To export, just read that file or hit `GET /api/waitlist`.

## Deploy

This is a standard Node/Express service — deploy it anywhere that runs Node 18+:

- **Render / Railway / Fly.io**: point at the `backend/` folder, build = `npm install`,
  start = `npm start`. Set the env vars from `.env.example` in the dashboard. Note
  that file storage is ephemeral on some hosts — for production durability, set
  `NOTIFY_EMAIL` and/or move storage to a DB (see `src/store.js`).
- Set `FRONTEND_ORIGIN` to your real site origin (e.g. `https://lenzli.com`).

Then, in the **frontend's** environment, set:

```
VITE_WAITLIST_API=https://your-backend-url
```

and redeploy the frontend so it points at the live API.
