# Flappy Void (dev)

New implementation lives in `/dev` so the old game stays intact. This folder is ready for Vercel deployment.

## Local Run

```bash
cd /home/zcai/workspace/flappy_void/dev
npm install
npm run dev
```

Open `http://localhost:5173`.

## Supabase Setup (Required)

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql`.
3. Enable Email/Password auth in **Authentication → Providers**.
4. (Optional) Disable email confirmation for quick testing.
5. Get keys from **Project Settings → API**.

Create `.env.local` in `/dev`:

```bash
VITE_SUPABASE_URL=YOUR_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

If you want to use the optional Vercel API routes (`/api/*`):

```bash
SUPABASE_URL=YOUR_PROJECT_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

## Vercel Deploy

- Import the repo into Vercel.
- Set **Root Directory** to `dev`.
- Add the environment variables above in Vercel → Project Settings → Environment Variables.
- Deploy.

## Supabase Tables

- `profiles`: one row per user (username, best_score, avatar_url).
- `scores`: every game run inserts a row (for history).
- `leaderboard` view + `get_user_rank(uid)` function for ranking.

## Optional Backend Endpoints

These endpoints are already included under `dev/api`:

- `GET /api/leaderboard?limit=20`
- `POST /api/submit-score` (requires `Authorization: Bearer <access_token>` and body `{ score }`)

They use the Supabase **service role key**, so only enable them on the server.
