# Top Secret — Internal Team Portal (Chat • Tasks • Apps • Meet)

A zero-cost Next.js app for a 3-person team: secure login (no public signup), group chat, file/app uploads, task management, and a simple Google Meet launcher link. Dark/Light themes with a Discord-inspired UI.

## Tech
- Next.js (React) on Vercel (free)
- Supabase (free) — Postgres + Storage (service role key used in serverless API routes)
- Tailwind CSS
- JWT auth (HttpOnly cookie), bcryptjs for password hashing
- Polling for updates (simple + reliable for small teams)

## 1) Create Supabase project
1. Create a Supabase project at https://supabase.com (Free Plan is enough).
2. In **Table Editor**, run the SQL in `supabase.sql` to create tables and RPC.
3. In **Storage**, create a bucket named `apps` (private).
4. Copy **Project URL** and **Service Role Key** from Project Settings → API.

## 2) Create Vercel project
1. Push this repo to GitHub.
2. Import into Vercel and set Environment Variables (Project → Settings → Environment Variables):

```
SUPABASE_URL=...         # from Supabase
SUPABASE_SERVICE_ROLE_KEY=...
JWT_SECRET=some-long-random-string
NEXT_PUBLIC_PROJECT_NAME=Top Secret
ADMIN_INIT_SECRET=strong-init-secret
```

3. Deploy. (Vercel auto-builds Next.js)

## 3) Initialize the first admin user
- Visit `https://<your-deploy-url>/init` and submit:
  - `ADMIN_INIT_SECRET` (the one you set),
  - admin username (e.g., `admin`),
  - admin password.
- You should see success. **Then delete the `pages/init.js` file** or block the route.

## 4) Login
- Go to `/login` and sign in with the admin credentials.
- Open `/admin` to create additional users (role `member`).

## 5) Features
- **Chat** — `/chat`: group chat. Polls updates every ~2.5s.
- **Tasks** — `/tasks`: admin creates tasks; assignees can change their own task status.
- **Apps/Files** — `/apps`: admin uploads files (.py/.exe/etc., small size); team can download.
- **Meet** — Add a button in UI to open `https://meet.google.com/new` and paste the link into chat.

## 6) Local Dev
```bash
npm i
cp .env.example .env.local  # fill values
npm run dev
```
Open http://localhost:3000

## Notes
- For realtime chat, consider Supabase Realtime in future (requires RLS policies & auth setup).
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only (never expose to browser).
- For security, enforce strong passwords. JWT cookie is HttpOnly + SameSite=Lax + Secure (prod).

© Built 2025-08-31
