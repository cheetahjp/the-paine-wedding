# The Paine Wedding — thepainewedding.com

Wedding website for Ashlyn Bimmerle & Jeff Paine · September 26, 2026 · Davis & Grey Farms, Celeste, TX.

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Tailwind CSS v4**
- **Supabase** (Postgres — guests, RSVP, leaderboards, trivia, site settings)
- **Vercel** (hosting + deployment)

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Copy `.env.local.example` to `.env.local` and fill in your Supabase keys.

**Before deploying, always verify the build passes locally:**

```bash
npm run build
```

Fix any TypeScript or lint errors before pushing — Vercel will reject broken builds.

---

## Deploying to Production

### Option 1 — Push to GitHub (automatic)

Every push to `main` triggers a Vercel production deploy automatically.

```bash
git add src/path/to/changed-file.tsx
git commit -m "fix: describe what changed"
git push origin main
```

Then watch the build at [vercel.com/dashboard](https://vercel.com/dashboard). When the deployment shows **"Ready"**, the site is live at [thepainewedding.com](https://www.thepainewedding.com).

### Option 2 — Vercel CLI (direct, immediate)

Use this when you need to deploy right now without going through GitHub, or when deploying from a Claude worktree branch.

```bash
cd /Users/jeffpaine/Documents/Antigravity/ThePaineWedding
vercel deploy --prod
```

Wait for this line in the output:
```
Aliased: https://www.thepainewedding.com
```

That confirms the new build is live. If you don't see it, the deploy may have failed — scroll up for error output.

**First time setup (one-time):**
```bash
npm i -g vercel   # install CLI globally
vercel login      # authenticate
vercel link       # link CLI to this Vercel project
```

### Option 3 — Preview Deploy (not production)

Useful for testing a branch before merging to main:

```bash
vercel deploy   # no --prod flag
```

Vercel prints a unique preview URL like `https://the-paine-wedding-abc123.vercel.app`. Share it to review before making it live.

---

## After Deploying

**Hard-refresh your browser** to bust the cache and see the new version:
- Mac: `Cmd + Shift + R`
- Windows: `Ctrl + Shift + R`

If it still looks the same after a hard-refresh, double-check that the Vercel dashboard shows the new deployment as **"Production · Ready"** (not just a preview).

---

## Git Branching

This project uses a simple **feature branch → main** workflow.

```bash
# Start a new branch
git checkout main
git pull origin main
git checkout -b feat/my-change

# Make changes, stage, commit
git add src/components/Something.tsx
git commit -m "feat: add something new"

# Push branch to GitHub
git push -u origin feat/my-change
```

Then either open a pull request on GitHub and merge it, or for small/urgent changes push directly to `main`.

**Branch naming conventions:**
- `feat/` — new features
- `fix/` — bug fixes
- `content/` — copy/image updates
- `claude/` — branches created automatically by Claude Code worktrees

---

## Environment Variables

### Local (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_PASSWORD_HASH=your-bcrypt-hash
```

> `NEXT_PUBLIC_` = exposed to the browser. Never use `NEXT_PUBLIC_` for secret keys.

### Updating on Vercel

1. [vercel.com/dashboard](https://vercel.com/dashboard) → your project → **Settings** → **Environment Variables**
2. Add or edit the key/value
3. Choose environments: **Production**, **Preview**, **Development**
4. Click **Save**
5. **Redeploy** for the change to take effect (`vercel deploy --prod` or push to `main`)

---

## Claude Code Worktrees

Claude Code creates isolated Git worktrees so it can write code without touching your active files.

Worktrees live at:
```
ThePaineWedding/.claude/worktrees/<branch-name>/
```

### Merging a worktree branch to main

When Claude finishes a task it commits to a branch (e.g. `claude/sweet-robinson`). To ship those changes:

```bash
# From the main project folder
git fetch origin
git checkout main
git merge origin/claude/sweet-robinson

# Review the diff, resolve conflicts if any, then push
git push origin main
```

Or just use the **"Commit changes"** button inside Claude Code — it commits the worktree branch to GitHub, then you merge it manually using the steps above.

### Cleaning up old worktrees

```bash
git worktree list                                         # see all worktrees
git worktree remove .claude/worktrees/sweet-robinson      # remove local worktree
git push origin --delete claude/sweet-robinson            # delete remote branch
```

---

## Supabase / Database Changes

Schema changes (new tables, new columns) require **two steps**:

1. Write a `.sql` migration file in `supabase/migrations/`
2. Manually run it in [Supabase Dashboard → SQL Editor](https://supabase.com/dashboard)

Migrations are never applied automatically. If a new feature silently fails, check whether its migration has been run.

**Quick data edits** (no schema change) can be done directly in the Supabase Table Editor.

---

## Troubleshooting

### Build fails on Vercel

1. Check build logs: Vercel Dashboard → Deployment → **Build Logs**
2. Run `npm run build` locally to reproduce the error
3. Common causes:
   - TypeScript error — run `npx tsc --noEmit` locally
   - Missing env var — check Settings → Environment Variables in Vercel
   - Bad import path — make sure `@/` alias paths are correct

### Changes deployed but not visible

1. Hard-refresh: `Cmd+Shift+R` / `Ctrl+Shift+R`
2. Confirm the Vercel deployment is **Production · Ready** (not a preview URL)
3. Make sure you pushed/deployed to `main`, not a different branch

### Supabase images not showing in production

`next.config.ts` must include the Supabase hostname under `images.remotePatterns`:

```ts
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "*.supabase.co",
      pathname: "/storage/v1/object/public/**",
    },
  ],
},
```

After updating `next.config.ts`, redeploy.

### Game state is stale or wrong

Game progress is stored in `localStorage`. To reset it:

1. Open browser DevTools (`F12` / `Cmd+Option+I`)
2. Application tab → Local Storage → `localhost:3000` (or the live domain)
3. Find the key (e.g. `wedding-crossword-state:...`) and delete it
4. Refresh the page

---

## Key Pages

| URL | Description |
|-----|-------------|
| `/` | Homepage |
| `/our-story` | Couple's story timeline |
| `/bridal-party` | Wedding party portraits |
| `/wedding-details` | Ceremony & reception info |
| `/schedule` | Day-of timeline |
| `/travel` | Airports, hotels, Dallas guide |
| `/attire` | Dress code + outfit inspiration |
| `/registry` | Amazon & Target registries |
| `/rsvp` | Guest RSVP flow |
| `/faq` | Frequently asked questions |
| `/games` | Games hub |
| `/games/painedle` | Daily wedding word game |
| `/games/trivia` | Couple trivia quiz |
| `/games/crossword` | Mini crossword |
| `/admin` | Admin dashboard (password protected) |

## Admin

Access at `/admin`. Manage guests, RSVP tracking, site content, hero images, page visibility, and trivia questions.

## See Also

`CLAUDE.md` — full technical reference, deployment rules, file map, and Claude-specific instructions.
