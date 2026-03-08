# The Paine Wedding — AI Collaboration Document

> **This is the single source of truth for any AI working on this project.**
> Update this file at the end of every session. Any AI (Claude, Codex, Gemini, etc.)
> picking this up should have everything they need to contribute immediately.

---

## 🔑 Project Identity

- **Site:** Jeff & Ashlyn Paine's wedding website
- **Wedding date:** September 26, 2026
- **Venue:** Davis & Grey Farms, 2975 CR 1110, Celeste, TX 75423
- **GitHub:** https://github.com/cheetahjp/the-paine-wedding (public repo)
- **Production URL:** Deployed on Vercel (check Vercel dashboard for live URL)
- **Supabase project ref:** `khqmbphkdmexkknzvtgb`
- **Owner:** Jeff Paine — `jeffreyraypaine@gmail.com`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS with custom `@theme` variables in `globals.css` |
| Database | Supabase (PostgreSQL) — free Hobby tier |
| Deployment | Vercel (auto-deploys from `main` branch on GitHub) |
| Fonts | Bodoni Moda + Montserrat via `<link>` tags in `layout.tsx` (NOT `next/font`) |
| Images | `next/image` — `images.unsplash.com` and `plus.unsplash.com` whitelisted in `next.config.ts` |

> **IMPORTANT:** Do NOT switch fonts back to `next/font/google`. The `<link>` tag approach
> is intentional — `next/font` caused caching failures with Bodoni Moda locally.

---

## 📁 Key File Locations

```
src/
├── app/
│   ├── layout.tsx                  # Root layout, Google Fonts <link> tags, nav
│   ├── page.tsx                    # Homepage / hero
│   ├── our-story/page.tsx          # Story timeline (uses StoryImage client component)
│   ├── wedding-details/page.tsx    # Ceremony/reception details, map, schedule
│   ├── schedule/page.tsx           # Day-of schedule
│   ├── bridal-party/page.tsx       # Wedding party (placeholder names — needs real data)
│   ├── games/page.tsx              # QR-style games hub
│   ├── games/trivia/page.tsx       # Couple trivia game route
│   ├── games/painedle/page.tsx     # Daily Painedle word game route
│   ├── travel/page.tsx             # Hotels, travel tips
│   ├── registry/page.tsx           # Registry links (Amazon + honeymoon fund — TODOs)
│   ├── faq/page.tsx                # FAQ cards (fully expanded, no accordion yet)
│   ├── attire/page.tsx             # Dress code / attire guide
│   ├── rsvp/page.tsx               # Full RSVP flow (search → household → form)
│   └── admin/
│       ├── page.tsx                # Admin dashboard (metrics, guest table, bulk import)
│       └── api/auth/route.ts       # Server-side password validation (passwords in .env.local)
├── components/
│   ├── ui/
│   │   ├── Section.tsx             # Standard page section wrapper
│   │   ├── StoryImage.tsx          # "use client" wrapper for Image with onError fallback
│   │   └── MobileNav.tsx           # Hamburger drawer navigation
│   ├── games/
│   │   ├── CoupleTriviaGame.tsx    # Client-side 3-screen trivia experience
│   │   └── PainedleGame.tsx        # Client-side daily Wordle-style game
│   ├── admin/
│   │   └── GamesAdminPanel.tsx     # Games control panel with modal drill-down views
│   └── Nav.tsx                     # Desktop + mobile nav shell
└── lib/
    └── wedding-data.ts             # ⭐ SINGLE SOURCE OF TRUTH for all wedding content
                                    #    Edit this file to update content across all pages
    └── games/
        ├── trivia-questions.ts     # 10 trivia questions with answer indexes and fun facts
        ├── word-list.ts            # 20–50 five-letter words for Painedle
        └── painedle.ts             # Daily seed + scoring helpers
supabase/
├── migrations/
│   └── 20260307000000_add_rsvp_fields.sql   # Adds food_allergies, song_request, advice
│   └── 20260308010000_add_game_leaderboards.sql # Adds game_players + game_scores tables
└── seed_guest_list.sql             # 178 guests / 85 households (idempotent with unique constraints)
public/
└── images/                         # Drop real photos here — subfolders match wedding-data.ts paths
    ├── hero/
    ├── engagement/
    ├── story/
    ├── bridal-party/               # Format: [firstname-lastname].webp
    ├── venue/
    └── attire/
```

---

## 🗄 Database Schema (Supabase)

### `households`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | auto-generated |
| `name` | TEXT UNIQUE | e.g. "The Smith Family" — has unique constraint |
| `created_at` | TIMESTAMP | |

### `guests`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | auto-generated |
| `household_id` | UUID FK | → `households(id)` |
| `first_name` | TEXT | |
| `last_name` | TEXT | |
| `suffix` | TEXT | optional, e.g. "III" |
| `nicknames` | TEXT | optional, used for fuzzy RSVP search |
| `plus_one_allowed` | BOOLEAN | default false |
| `attending` | BOOLEAN/NULL | NULL = pending, true = yes, false = no |
| `meal_choice` | TEXT | optional |
| `food_allergies` | TEXT | added March 2026 |
| `song_request` | TEXT | added March 2026 |
| `advice` | TEXT | added March 2026 |
| `created_at` | TIMESTAMP | |

### `admin_logs`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `password_used` | TEXT | which password was used to log in |
| `created_at` | TIMESTAMP | |

### `game_players`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | auto-generated |
| `email` | TEXT UNIQUE | normalized lowercase email |
| `username` | TEXT | display name for leaderboards |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

### `game_scores`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | auto-generated |
| `player_id` | UUID FK | → `game_players(id)` |
| `game` | TEXT | `trivia` or `painedle` |
| `puzzle_key` | TEXT | `wedding-day-trivia` for trivia, daily date key for Painedle |
| `score` | INTEGER | higher is better |
| `max_score` | INTEGER/NULL | question count or max points |
| `attempts` | INTEGER/NULL | number of guesses / prompts used |
| `solved` | BOOLEAN/NULL | useful for Painedle |
| `metadata` | JSONB | extra per-game context |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

> **⚠️ RLS is currently DISABLED.** Guest data is publicly readable with the anon key.
> To fix: Supabase dashboard → Table Editor → guests → Enable RLS → add policy.

---

## 🌐 Environment Variables

`.env.local` (never committed, already in Vercel):
```env
NEXT_PUBLIC_SUPABASE_URL=https://khqmbphkdmexkknzvtgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
ADMIN_PASSWORDS=JeffreyAndAshlyn!,JeffreyAndAshlyn1!,...   # server-side only
```

---

## 🧠 wedding-data.ts — The Content Config

**`src/lib/wedding-data.ts` is the most important file for content work.**

All pages import from `WEDDING`. To update content across the whole site, edit this one file.
Key top-level keys:
- `WEDDING.couple` — Jeff & Ashlyn info
- `WEDDING.event` — date, venue, address, times (many still `TODO`)
- `WEDDING.story[]` — Our Story timeline items (year, title, description, image, imageFallback)
- `WEDDING.bridalParty[]` — Wedding party (all placeholder names — needs real data from Ashlyn)
- `WEDDING.hotels[]` — Travel accommodations (currently empty array, needs real hotels)
- `WEDDING.registry[]` — Registry links (Amazon URL = `TODO`, Honeymoon Fund = `TODO`)
- `WEDDING.faq[]` — FAQ items
- `WEDDING.attire` — Dress code details
- `WEDDING.schedule[]` — Day-of schedule (times are `TODO`)
- `WEDDING.map.embedSrc` — Google Maps iframe embed URL (`TODO`)
- `WEDDING.rsvpDeadline` — August 1, 2026
- `src/lib/games/trivia-questions.ts` — edit trivia content without touching UI code
- `src/lib/games/word-list.ts` — edit the rotating five-letter Painedle answer list
- `src/lib/games/schedule.ts` — trivia unlock date/countdown helpers
- `src/lib/games/leaderboard.ts` — score submission + leaderboard fetch helpers

---

## 🎨 Design System

**Vibe:** Minimal, elegant, romantic, editorial — "fine art wedding"

**Colors (defined in `globals.css`):**
```
--color-primary: #142A44      (Navy)
--color-secondary: #7A1F24    (Burgundy)
--color-accent: #C69A72       (Tan/Gold)
--color-background: #FFFFFF
--color-surface: #F4F4F4
```

**Typography:**
- `font-heading` → Bodoni Moda (serif, high contrast Didone — similar to Lust Didone)
- `font-body` → Montserrat (sans-serif)

### Active Redesign / Games System Plan (Mar 8, 2026)

This plan was requested explicitly by Jeff before implementation. Update this section during work, even if unfinished, so another AI can pick up mid-stream.

#### Goals
- Replace the current heading font with a serif that keeps the editorial/fine-art feel but is easier to read than Bodoni Moda.
- Remove the redundant hero/announcement content from the public games hub so the page is mostly just the actual game cards.
- Fix the recurring horizontal band/bar below the sticky header across games/admin and any affected pages.
- Reorder the games on `/games` so `Painedle` is first and `Couple Trivia` is second.
- Make locked trivia visually subdued except for the countdown/timer so availability is obvious.
- Remove redundant badges/tags and stale “update” copy from the public games pages.
- Tighten the vertical lockup on `/games/painedle` so the header card, game card, and leaderboard panel feel intentionally grouped.
- Broaden Painedle from fixed 5-letter words to variable lengths (target: 4, 5, 6, and 7 letters).
- Accept normal real-word guesses, not just answers from the wedding word bank, so players can probe for hints.
- Build a more complete persistent game-user system:
- username + email capture
- browser-persisted signed-in state
- settings/account editing and explicit logout
- collect non-invasive browser profile data when available (user agent, locale, timezone, platform, screen, language)
- separate game administration from RSVP administration instead of nesting games inside the RSVP dashboard
- separate security/login tracking from RSVP/game management
- record future trivia-bank CRUD work in the collaboration docs, but do not implement the trivia editor in this pass

#### Implementation Order
1. Typography + layout cleanup
- choose a more legible editorial serif and update the Google Fonts `<link>` plus `globals.css`
- fix header/background banding globally by tightening top padding / section backgrounds where the sticky header meets page content

2. Public games hub cleanup
- remove the current top hero and secondary explainer cards from `/games`
- show only the actual game cards
- put `Painedle` first
- make `Couple Trivia` visually muted when locked
- remove the extra tag pills on the trivia card
- ensure both cards have matching thin strokes / slight depth treatment

3. Painedle public UX cleanup
- simplify the `/games/painedle` header copy so it reads like real product copy, not release notes
- remove redundant metadata (duplicate date/format callouts)
- reduce the vertical gap between the top header card and the lower card pair
- keep mobile layout consistent

4. Painedle engine overhaul
- replace fixed `WORD_LENGTH = 5` assumptions with variable-length puzzle settings per daily word
- update board rendering, validation, evaluation logic, keyboard handling, storage keys, and score calculation to work across 4/5/6/7-letter answers
- expand the answer bank with stronger wedding-relevant words
- add a broader valid-guess dictionary source and length-aware validation

5. Game account/profile system
- persist player identity in browser storage so guests stay signed in unless they explicitly log out
- add profile/settings UI for username/email edits and logout
- store additional non-invasive client metadata with player/session/profile records
- assess what can and cannot be captured reliably client-side; note that raw IP requires server capture, not browser JS

6. Admin information architecture split
- keep `/admin` focused on RSVP/guest operations
- move games management to its own admin route/tab/page
- move security/login tracking to its own admin route/tab/page
- remove guest importer from the games context once games are separated
- carry over the existing games insight panels into the dedicated games admin area

7. Future-not-now trivia bank work
- document follow-up requirements for add/edit/delete/archive question management
- include support for multiple-choice and true/false question types

#### Risks / Constraints
- Live leaderboard persistence is still blocked until Supabase migration `20260308010000_add_game_leaderboards.sql` is actually applied to hosted Supabase.
- Capturing IP address for player profiles cannot be done directly from front-end browser code; it requires a server/API layer or edge middleware to record request metadata.
- A broad real-word guess list may require a sizable dictionary asset or curated subset. Keep bundle size under control.
- Variable word length affects nearly every assumption in the current Painedle implementation and localStorage keys.

#### Current Progress Snapshot
- [x] Replaced `Bodoni Moda` with `Cormorant Garamond` in `src/app/layout.tsx` / `src/app/globals.css`
- [x] Removed the redundant hero/explainer stack from `/games`; the page is now just the two game cards
- [x] Reordered `/games` so `Painedle` is first and locked trivia is second
- [x] Muted the locked trivia card and removed the redundant trivia tag pills
- [x] Strengthened border/shadow treatment so navy cards now carry the same thin-stroke / slight-depth feel as the tan cards
- [x] Removed the redundant extra hero blocks from `/games/painedle` and `/games/trivia`; the account panel now leads directly into the playable content
- [x] Removed the extra top-padding band on the games/admin pages by tightening the wrappers instead of stacking `pt-20` / `pt-24` under the sticky header
- [x] Expanded Painedle answers to 4/5/6/7-letter words via `src/lib/games/word-list.ts` and dynamic logic in `src/lib/games/painedle.ts`
- [x] Added real-word guess validation via server route `/api/games/validate-word` and packaged dictionary source `word-list`
- [x] Added persistent browser game profiles with edit/logout controls in `src/components/games/GameAccountPanel.tsx`
- [x] Moved score submission to server route `/api/games/submit-score` so request metadata can be captured (IP/header/location when available)
- [x] Split admin into three top-level sections:
- `/admin` = RSVP
- `/admin/games` = games control room
- `/admin/security` = admin login tracking
- [x] Expanded Games Admin to show player/profile signals alongside submissions and player summaries
- [ ] Future trivia bank CRUD is documented only, not implemented yet

---

## ✅ WHAT HAS BEEN BUILT (Completed)

### Infrastructure
- [x] Next.js 16 App Router project scaffolded and deployed to Vercel
- [x] Supabase connected with `households` + `guests` + `admin_logs` schema
- [x] `food_allergies`, `song_request`, `advice` columns added to `guests`
- [x] `households.name` unique constraint added (enables idempotent seeding)
- [x] **178 guests / 85 households seeded** into Supabase
- [x] `src/lib/wedding-data.ts` — central content config (all pages pull from here)
- [x] `.claude/` and `.claire/` added to `.gitignore`

### Pages (all live, all populated with real structure)
- [x] Homepage / hero
- [x] Our Story — alternating timeline layout with image fallback (via `StoryImage` client component)
- [x] Wedding Details — venue, map placeholder, schedule
- [x] Schedule — day-of timeline
- [x] Bridal Party — layout ready, data is placeholder
- [x] Travel — layout ready, hotels array is empty (needs real hotels)
- [x] Registry — layout ready, links are `TODO`
- [x] FAQ — fully built, cards layout (no accordion yet)
- [x] Attire — dress code page
- [x] Games hub — public landing page linked in main nav
- [x] Couple Trivia — separate route with welcome → play → results flow
- [x] Painedle — separate daily word game with keyboard support + persistent browser save
- [x] Game leaderboards — username/email submission + top-score boards
- [x] Trivia lock gate — countdown on `/games`, trivia opens on wedding day
- [x] RSVP — full 3-step flow (search → household → submit)
- [x] Admin Dashboard — metrics, guest data table grouped by household, bulk importer

### RSVP Flow
- [x] Guest search by first/last name + nicknames (ilike fuzzy match)
- [x] Household grouping — one RSVP for the whole household
- [x] Attending checkboxes per guest
- [x] Meal choice per attending guest
- [x] Food allergy checkbox → text reveal on Step 2
- [x] Song request input with greyed placeholder format hint
- [x] Advice for the couple textarea
- [x] All new fields saved to Supabase

### Admin Dashboard
- [x] Server-side password auth via `/api/admin/auth` (passwords not exposed in client bundle)
- [x] Master password sees login tracking board; user passwords see standard view
- [x] Metrics: total invited, attending, declined, pending, meal counts
- [x] Guest table grouped by household
- [x] `food_allergies`, `song_request`, `advice` columns visible in admin table
- [x] Bulk importer from Google Sheets paste

### Navigation
- [x] Desktop nav with all page links
- [x] Mobile hamburger drawer (smooth CSS transition, closes on link/outside click)
- [x] Bridal Party added to nav
- [x] Games added to main nav so guests can reach it normally

### Bug Fixes
- [x] `StoryImage` client component — fixes "Event handlers cannot be passed to Client Component props" on `/our-story`

---

## ⏳ WHAT NEEDS REAL CONTENT (No code work — just fill in wedding-data.ts)

These are all `TODO` strings in `wedding-data.ts`. When info is ready, drop it in:

- [ ] Ceremony time, cocktail hour time, reception time, send-off time
- [ ] Full schedule with exact times
- [ ] Dress code wording for guests (ladies + gentlemen sections)
- [ ] Parking and shuttle details at Davis & Grey Farms
- [ ] Hotel recommendations near Celeste TX with booking URLs
- [ ] Amazon registry URL
- [ ] Honeymoon fund URL
- [ ] Meal options (not decided yet — can be added to RSVP flow later)
- [ ] Google Maps iframe embed `src` for Davis & Grey Farms
- [ ] Real bridal party names, roles, relationship descriptions, photo paths
- [ ] Real engagement/story/hero photos (drop `.webp` into `public/images/` subfolders)
- [ ] Favicon — Ashlyn is making a logo → replace `public/favicon.ico`
- [ ] OG image for social sharing → drop into `public/images/engagement/og-image.jpg`

---

## 🔜 FEATURES TO BUILD (Prioritized)

### High priority
- [ ] **RSVP edit/update flow** — guests currently can't find their RSVP and change it
- [ ] **FAQ accordion** — collapse/expand instead of all cards stacked
- [ ] **CSV export** in admin dashboard (one button for caterer/venue/planner)
- [ ] **Email confirmation** after RSVPing (Resend or SendGrid — meal options TBD)
- [ ] **RSVP deadline countdown** on RSVP page ("X days left to RSVP" — deadline Aug 1 2026)
- [ ] **Supabase RLS** — enable Row Level Security on `guests` table (currently disabled)

### Medium priority
- [ ] **Countdown timer** on homepage ("X days until we say I do")
- [ ] **Custom 404 page** (still default Next.js)
- [ ] **OG / social meta tags** (structure is ready, just needs the real OG image)
- [ ] **Personalized RSVP confirmation** — "We can't wait to see you, [Name]!"
- [ ] **Attire color swatches** — show visual color palette instead of just text
- [ ] **Accessibility audit** — ARIA labels, keyboard nav, focus states

### Fun / later
- [ ] **Animated Our Story** — scroll-driven timeline animation (subtle, not crazy)
- [ ] **Day-of schedule view** — simplified large-text phone view
- [ ] **Guest digital guestbook** — admin-only view of messages
- [ ] **Honeymoon fund progress bar** — if using direct fund

---

## 🐛 KNOWN QUIRKS

- **Fonts:** Use `<link>` tags in `layout.tsx` — do NOT switch to `next/font/google` (breaks locally)
- **Supabase anon key:** Readable in client bundle (by design for Supabase) — RLS should be enabled to protect data
- **`our-story/page.tsx`:** Has `"use client"` directive because `StoryImage` needs it (and the page is simple enough that this is fine)
- **Admin passwords:** In `.env.local` as `ADMIN_PASSWORDS` comma-separated — also hardcoded as fallback in `/api/admin/auth/route.ts` for local dev without env file
- **Seed SQL:** `supabase/seed_guest_list.sql` is idempotent — safe to re-run after TRUNCATE. Do NOT run it twice without truncating first (guests have no unique constraint, duplicates will be inserted)
- **Worktree:** Previous work was done in `.claude/worktrees/sweet-robinson` on branch `claude/sweet-robinson` — all merged into `main` as of March 7, 2026

---

## 📋 SESSION LOG

### Session 1–3 (Feb–Mar 2026)
- Scaffolded full Next.js project
- Built all pages with placeholder content
- Built RSVP flow, Admin Dashboard, Supabase schema
- Added tiered admin auth, bulk importer, household grouping
- Deployed to Vercel

### Session 4 (Mar 7, 2026)
- Discovered all Session 1–3 work was in a git worktree (uncommitted) — merged into `main`
- Committed and merged `claude/sweet-robinson` → `main`
- Created `src/lib/wedding-data.ts` central config — refactored all pages to use it
- Added `food_allergies`, `song_request`, `advice` to RSVP + Supabase
- Ran migration + seeded 178 guests / 85 households
- Fixed duplicate seed issue (TRUNCATE + reseed)
- Fixed mobile nav, added Bridal Party to nav, moved admin auth to server-side
- Deployed to production

### Session 5 (Mar 8, 2026)
- Fixed `/our-story` crash: `onError` event handler in Server Component
- Created `StoryImage.tsx` client component wrapper
- Pushed and deployed — site is live and error-free
- Updated Notion Improvement Ideas doc with full status
- Created this `AI_COLLAB.md` file

### Session 6 (Mar 8, 2026)
- Added `/games` hub plus separate `/games/trivia` and `/games/painedle` routes
- Implemented Couple Trivia with 10 questions, answer reveal states, progress bar, and results screen
- Implemented Painedle as a date-seeded daily word game with physical keyboard support, on-screen keyboard, tile flip animation, row shake on invalid guess, and localStorage persistence
- Moved editable game content into `src/lib/games/trivia-questions.ts` and `src/lib/games/word-list.ts`
- Verified the games routes with `npm run build`

### Session 7 (Mar 8, 2026)
- Added Supabase-backed `game_players` and `game_scores` tables via migration `20260308010000_add_game_leaderboards.sql`
- Added leaderboard submission flow with username + email capture and local browser prefill for repeat play
- Added live leaderboard panels for trivia and Painedle
- Locked trivia until wedding day with a countdown on `/games` and a gate on `/games/trivia`
- Kept Painedle available immediately with a daily leaderboard keyed by the current puzzle date
- Added a Games tab to `/admin` so scores can be reviewed inside the existing dashboard
- Fixed production admin login by setting `ADMIN_PASSWORD_MASTER` and `ADMIN_PASSWORD_1`–`5` in Vercel and redeploying
- Code is deployed live, but leaderboard writes are still blocked until the Supabase migration is actually applied to the hosted database

### Session 8 (Mar 8, 2026)
- Added `Games` to the main site nav so guests can actually find `/games`
- Redesigned `/games`, `/games/painedle`, and `/games/trivia` with stronger hero treatments, gradients, richer cards, and less empty white space
- Increased Painedle contrast substantially: dark board shell, clearer empty tiles, stronger keyboard states, and more readable leaderboard/form surfaces
- Upgraded the admin Games tab into a real control panel via `src/components/admin/GamesAdminPanel.tsx`
- Admin Games now includes modal drill-down views for:
  - today's Painedle word reveal
  - 21-day Painedle schedule preview
  - full Painedle word bank with search
  - full trivia question bank with correct answers + fun facts
  - leaderboard views for trivia and today's Painedle
  - recent submission log with game filter
  - player directory / unique player summaries
- Verified changes with `npm run build`
- `npm run lint` still only shows the two pre-existing warnings: custom font warning in `src/app/layout.tsx` and unrelated `.claire` worktree warning

### Session 9 (Mar 8, 2026)
- Wrote and maintained the explicit redesign/game-system implementation plan in this doc before continuing code work
- Swapped the heading font to `Cormorant Garamond` to keep the editorial serif feel with better legibility
- Simplified `/games` to only the two actual game cards; removed the big hero/explainer stack
- Kept `Painedle` first and `Couple Trivia` second, with the locked trivia card visually subdued except for the countdown
- Removed redundant release-note style copy and extra metadata/hero clutter from the Painedle and Trivia routes
- Fixed the extra horizontal band under the sticky header on the games/admin pages by removing redundant top-padding wrappers
- Expanded Painedle from fixed five-letter answers to mixed 4/5/6/7-letter answers
- Added real-word guess validation using a packaged dictionary source (`word-list`) plus a validation API route
- Added persistent browser game profiles with account edit/logout controls so players stay signed in on that browser until they explicitly clear it
- Moved score submission to `/api/games/submit-score` so request metadata can be captured server-side (IP/header/location when available) and stored in score metadata
- Separated admin IA cleanly:
- `/admin` = RSVP dashboard only
- `/admin/games` = games control room
- `/admin/security` = admin login tracking
- Expanded Games Admin so submission/player views now show device/location/profile signals instead of just bare scores
- Documented future trivia-bank CRUD requirements only (add/edit/delete/archive, plus true/false support) — not implemented in this pass
- Verified with:
- `npm run lint` -> only the 2 known warnings remain (`src/app/layout.tsx` custom-font warning and unrelated `.claire` worktree warning)
- `npm run build` -> passes
- Committed to `main` as `c565864` (`Redesign games and split admin controls`)
- Pushed to GitHub and deployed to Vercel production
- Current production alias: `https://www.thepainewedding.com`
- Supabase leaderboard migration is still the final external blocker for live score persistence because the Supabase CLI on this machine is not authenticated
