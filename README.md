# Zero1 Money Circle

Event management + QR check-in system built with Next.js 14, Prisma, PostgreSQL, and Gupshup WhatsApp.

## Setup

### 1. Environment variables

```bash
cp .env.example .env.local
```

Fill in:
- `DATABASE_URL` — Supabase or local Postgres connection string
- `ADMIN_SECRET` — any password for the admin dashboard
- `QR_SECRET` — 32+ char random string for signing QR JWTs
- `GUPSHUP_*` — from your Gupshup dashboard
- `NEXT_PUBLIC_BASE_URL` — your deployed URL (e.g. `https://zero1.vercel.app`)

### 2. Database

```bash
# Apply migrations (creates tables)
npx prisma migrate deploy

# Seed with event + 8 dummy attendees (5 selected with QRs, 2 not-selected, 1 rejected)
npm run db:seed
```

### 3. Dev server

```bash
npm run dev
```

**One-command dev setup** (after adding `DATABASE_URL` to `.env.local`):

```bash
npx prisma migrate deploy && npm run db:seed && npm run dev
```

---

## Project structure

```
app/
  admin/                  → password-protected admin UI
    page.tsx              → login
    dashboard/            → stats overview
    attendees/            → CSV upload + attendees table
    checkin/              → QR scanner
    settings/             → event config + images + WhatsApp templates
  pass/[passId]/          → public QR pass page
  api/
    admin/                → protected admin API routes
    pass/[passId]/        → public pass data
    plusone/invite/       → +1 registration

lib/
  prisma.ts               → singleton Prisma client
  auth.ts                 → session cookie helpers
  qr.ts                   → JWT QR generation + verification
  whatsapp.ts             → Gupshup REST API wrapper
  phone.ts                → E.164 phone normalisation

prisma/
  schema.prisma
  seed.ts
```

## Key flows

### CSV upload → QR generation
1. Admin uploads CSV (columns: `name`, `phone`, `status`, optional `seatLabel`)
2. `POST /api/admin/attendees/upload` upserts by `(eventId, phone)`
3. Attendees marked `selected` get a signed JWT stored in `qrPayload` and a `passUrl`

### Attendee marked Selected via UI
`PATCH /api/admin/attendees/[id]` with `{ status: "SELECTED" }` generates QR + optionally fires WhatsApp

### QR check-in
1. Admin scanner (`/admin/checkin`) decodes QR with `html5-qrcode`
2. Calls `POST /api/admin/checkin/verify` with the raw JWT token
3. Server verifies signature, checks DB flags, marks `checkedIn`

### +1 invite
1. Attendee taps "Invite +1" on `/pass/[passId]`
2. `POST /api/plusone/invite` generates a second JWT (`passType: plusone`) and sends WhatsApp to the +1
3. Pass page shows both QR codes side-by-side

## Deployment (Railway)

### Deploy steps

1. Push this repo to GitHub.
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → select the repo, set **Root Directory** to `zero1/`.
3. Add a **PostgreSQL** plugin — Railway injects `DATABASE_URL` automatically.
4. Set the following env vars in the Railway dashboard:

| Variable | Value |
|---|---|
| `ADMIN_EMAIL` | e.g. `admin@yourdomain.com` |
| `ADMIN_SECRET` | a strong password |
| `QR_SECRET` | 32+ char random string |
| `NEXT_PUBLIC_BASE_URL` | your Railway public URL |
| `NEXT_PUBLIC_EVENT_NAME` | event name |
| `NEXT_PUBLIC_EVENT_DATE` | e.g. `May 24, 2025` |
| `NEXT_PUBLIC_EVENT_TIME` | e.g. `6:00 PM – 9:00 PM` |
| `NEXT_PUBLIC_EVENT_CITY` | city |
| `NEXT_PUBLIC_EVENT_VENUE` | venue |
| `GUPSHUP_API_KEY` | from Gupshup dashboard |
| `GUPSHUP_SOURCE_NUMBER` | WhatsApp number |
| `GUPSHUP_APP_NAME` | app name |

5. Railway automatically runs:
   - `npm ci` → `postinstall` (prisma generate) → `npm run build` (prisma generate + next build)
   - On start: `npx prisma migrate deploy && npm start`

6. After first successful deploy, seed the production database once:
   ```bash
   DATABASE_URL=<your_railway_postgres_url> npm run db:seed
   ```

### How it works

```
Railway Postgres  ──►  App Service
                        npm ci
                        postinstall: prisma generate
                        build:       prisma generate + next build
                        start:       prisma migrate deploy + next start
```

- `prisma migrate deploy` runs every time the app starts — it is a no-op when schema is already up to date, and applies new migrations safely on redeploy.
- `railway.json` at the project root configures the builder (Nixpacks) and the start command.
- `/api/health` is the healthcheck endpoint Railway pings after each deploy.
