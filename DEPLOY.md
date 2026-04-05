# Deploy checklist — Signal: Restore

Tailored for this repo: **Next.js 16** (App Router), static-friendly routes, **no server secrets** (rule engine runs in the browser).

## Before you deploy

1. **Branch is clean** — `npm run lint` and `npm run build` pass locally.
2. **Repo remote** — Code is pushed to GitHub, GitLab, or Bitbucket (Vercel needs a Git connection for the smoothest flow).

## Vercel (recommended)

1. Go to [vercel.com](https://vercel.com) → **Add New…** → **Project**.
2. **Import** the `signal-restore` repository.
3. **Framework preset:** Next.js (auto-detected).
4. **Root directory:** repo root (default).
5. **Build command:** `npm run build` (default).
6. **Output:** leave default (Vercel handles Next.js).
7. **Environment variables:** **none required** for this app. There is no API key, database, or external inference service.

Deploy. Vercel will assign a production URL (and preview URLs per PR).

## After deploy — smoke test

Open your production URL and confirm:

| Check | Expected |
|--------|----------|
| `/` | Landing: hero, trust block, example, CTAs to `/reflect`. |
| `/reflect` | Boot → prompts → scan → result flow works. |
| Fallback copy | Vague input still shows fallback + **EARLY SIGNALS** when hints apply. |
| `?debug=1` on `/reflect` | **No** engine debug panel in production (`NODE_ENV === "production"` gates it). |

Optional: run the same checks on a **Preview** deployment from a PR.

## Custom domain (optional)

In Vercel: **Project → Settings → Domains** → add your domain and follow DNS instructions.

## If something fails

- **Build fails:** Read the Vercel build log; fix TypeScript/ESLint issues locally first.
- **404 on `/reflect`:** Ensure `app/reflect/page.tsx` is committed and the deployment picked up the latest commit.
- **Wrong Node version:** In Vercel **Settings → General → Node.js Version**, use **22.x** or **20.x** (match your local LTS if you use one).

## Notes for demos and writeups

- **Share link:** production URL → landing (`/`) for first impressions; `/reflect` for the live session.
- **Engine debug:** use `http://localhost:3000/reflect?debug=1` in **local dev only** when recording technical demos.
