# The Paine Wedding — AI Collaboration Document

> **This is the single source of truth for any AI working on this project.**
> Update this file at the end of every session. Any AI (Claude, Codex, Gemini, etc.)
> picking this up should have everything they need to contribute immediately.

---

## 🔑 Project Identity

- **Site:** Ashlyn & Jeffrey Paine's wedding website
- **Wedding date:** September 26, 2026
- **Venue:** Davis & Grey Farms, 2975 CR 1110, Celeste, TX 75423
- **GitHub:** https://github.com/cheetahjp/the-paine-wedding (public repo)
- **Production URL:** https://www.thepainewedding.com (Vercel — auto-deploys from `main`)
- **Vercel project:** `prj_DABsrDtW4OBQCaaOKHrojfO1dVJr` / org `team_mivyuF1xTTkf7ieeeuXoxaJF`
- **Supabase project ref:** `khqmbphkdmexkknzvtgb`
- **Owner:** Jeff Paine — `jeffreyraypaine@gmail.com`

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 with `@theme` custom variables in `globals.css` |
| Database | Supabase (PostgreSQL) — free Hobby tier |
| Deployment | Vercel (auto-deploys from `main` branch on GitHub) |
| Fonts | Bodoni Moda + Montserrat via `next/font/google` in `layout.tsx` |
| Images | `next/image` — `images.unsplash.com` and `plus.unsplash.com` whitelisted in `next.config.ts` |

> **Font note (as of Session 14+):** Both `main` and the `claude/sweet-robinson` worktree
> now use `next/font/google`. The old `<link>` tag approach and the "do NOT use next/font"
> warning are obsolete — `next/font` is working correctly.
> - **`main` branch:** `Bodoni_Moda` (700/800/900) + `Montserrat`
> - **`claude/sweet-robinson` worktree:** `Cormorant_Garamond` (500/600/700) + `Montserrat`
>
> The worktree's Cormorant Garamond change may or may not be merged to main — see Branch State section.

---

## 📁 Key File Locations

```
src/
├── app/
│   ├── layout.tsx                  # Root layout, next/font/google setup, nav
│   ├── page.tsx                    # Homepage / hero
│   ├── our-story/page.tsx          # Story timeline (uses StoryImage client component)
│   ├── wedding-details/page.tsx    # Ceremony/reception details, map, schedule
│   ├── schedule/page.tsx           # Day-of schedule
│   ├── bridal-party/page.tsx       # Wedding party (placeholder names — needs real data)
│   ├── games/page.tsx              # QR-style games hub
│   ├── games/crossword/page.tsx    # Mini crossword route (unlocks one week before wedding)
│   ├── games/trivia/page.tsx       # Couple trivia game route
│   ├── games/painedle/page.tsx     # Daily Painedle word game route
│   ├── travel/page.tsx             # Hotels, travel tips
│   ├── registry/page.tsx           # Registry links (Amazon + honeymoon fund — TODOs)
│   ├── faq/page.tsx                # FAQ cards (fully expanded, no accordion yet)
│   ├── attire/page.tsx             # Dress code / attire guide
│   ├── rsvp/page.tsx               # Full RSVP flow (search → household → form)
│   ├── api/
│   │   ├── admin/auth/route.ts     # Server-side password validation
│   │   ├── games/submit-score/route.ts     # Server-side score submission (captures metadata)
│   │   ├── games/validate-word/route.ts    # Server-side word validation for Painedle
│   │   └── games/trivia-questions/route.ts # Public GET — non-archived questions (future CRUD)
│   └── admin/
│       ├── page.tsx                # Admin dashboard — RSVP only (metrics, guest table, bulk import)
│       ├── games/page.tsx          # Games admin control room
│       └── security/page.tsx       # Admin login tracking
├── components/
│   ├── ui/
│   │   ├── Section.tsx             # Standard page section wrapper
│   │   ├── StoryImage.tsx          # "use client" wrapper for Image with onError fallback
│   │   └── MobileNav.tsx           # Hamburger drawer navigation
│   ├── games/
│   │   ├── CoupleTriviaGame.tsx    # Client-side 3-screen trivia experience
│   │   ├── MiniCrosswordGame.tsx   # Client-side fill-in-the-blank crossword puzzle
│   │   ├── CrosswordGate.tsx       # Unlock gating wrapper for crossword
│   │   ├── PainedleGame.tsx        # Client-side daily Wordle-style game
│   │   ├── GameAccountPanel.tsx    # Persistent browser profile (username/email, edit/logout)
│   │   ├── ScoreSubmissionForm.tsx # Score submission form after game completion
│   │   ├── LeaderboardPanel.tsx    # Top-score leaderboard display
│   │   └── GamesHubClient.tsx      # Public games hub — three game cards
│   ├── admin/
│   │   ├── GamesAdminPanel.tsx     # Games control panel with modal drill-down views
│   │   └── ContentAdminPanel.tsx   # Content management (site_settings editor)
│   └── layout/
│       ├── Navbar.tsx              # Desktop + mobile nav shell
│       └── Footer.tsx              # Footer component
└── lib/
    ├── wedding-data.ts             # ⭐ STATIC source of truth for all wedding content
    │                               #    Used directly in worktree; wrapped by site-settings.ts on main
    ├── site-settings.ts            # ⭐ SERVER-ONLY (main branch) — fetches `site_settings` table
    │                               #    from Supabase and merges overrides onto wedding-data.ts
    │                               #    Exports: getWeddingData(), getSettingsMap()
    │                               #    Usage: import { getWeddingData } from "@/lib/site-settings"
    ├── supabase.ts                 # Client-side Supabase client (anon key)
    └── games/
        ├── crossword.ts            # Crossword data, layout, scoring, storage key
        ├── trivia-questions.ts     # 10 trivia questions with answer indexes and fun facts
        │                           # (Static for now — future: load from Supabase trivia_questions table)
        ├── word-list.ts            # 310-word Painedle answer bank (4/5/6/7-letter words)
        │                           # Has runtime guards: throws on duplicates, throws if < 200 words
        ├── painedle.ts             # Daily sequential rotation + scoring helpers
        │                           # Anchor: 2026-03-08 = "sparkle"; each day advances one slot
        ├── schedule.ts             # Trivia + crossword unlock date/countdown helpers
        ├── leaderboard.ts          # Score submission + leaderboard fetch helpers
        └── admin-types.ts          # Shared admin type definitions
supabase/
├── migrations/
│   ├── 0000_schema.sql                         # Base schema: households, guests, admin_logs
│   ├── 20260307000000_add_rsvp_fields.sql       # Adds food_allergies, song_request, advice
│   └── 20260308010000_add_game_leaderboards.sql # Adds game_players + game_scores tables
└── seed_guest_list.sql             # Round 1: 178 guests / 85 households (applied to Supabase)
                                    # Round 2: 192 guests / 103 households (generated, NOT YET APPLIED)
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

> **⚠️ Gap:** The Round 2 seed data references `plus_one_name`, `affiliation`, `side`, and `likelihood`
> columns that do NOT exist in the current schema (`0000_schema.sql`). A migration will be needed
> before applying the Round 2 seed. The Round 2 seed also uses TRUNCATE (full replacement).

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
| `game` | TEXT | `trivia`, `painedle`, or `crossword` |
| `puzzle_key` | TEXT | `wedding-day-trivia` for trivia, daily date key for Painedle |
| `score` | INTEGER | higher is better |
| `max_score` | INTEGER/NULL | question count or max points |
| `attempts` | INTEGER/NULL | number of guesses / prompts used |
| `solved` | BOOLEAN/NULL | useful for Painedle |
| `metadata` | JSONB | extra per-game context (device, locale, timezone, platform, IP) |
| `created_at` | TIMESTAMP | |
| `updated_at` | TIMESTAMP | |

> **⚠️ RLS is currently DISABLED.** Guest data is publicly readable with the anon key.
> To fix: Supabase dashboard → Table Editor → guests → Enable RLS → add policy.

---

## 🌐 Environment Variables

`.env.local` (never committed, already configured in Vercel):
```env
NEXT_PUBLIC_SUPABASE_URL=https://khqmbphkdmexkknzvtgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server-side only — used by site-settings.ts
ADMIN_PASSWORDS=JeffreyAndAshlyn!,JeffreyAndAshlyn1!,...   # server-side only (legacy comma format)
ADMIN_PASSWORD_MASTER=<master password>        # preferred format — each role is its own var
ADMIN_PASSWORD_1=<password1>
ADMIN_PASSWORD_2=<password2>
ADMIN_PASSWORD_3=<password3>
ADMIN_PASSWORD_4=<password4>
ADMIN_PASSWORD_5=<password5>
```

> `SUPABASE_SERVICE_ROLE_KEY` is required for `site-settings.ts` to read the `site_settings`
> table server-side. Without it, `getSettingsMap()` returns `{}` and all content falls back
> to `wedding-data.ts` defaults (safe degradation, not a crash).

---

## 🧠 wedding-data.ts — The Content Config

**`src/lib/wedding-data.ts` is the most important file for content work.**

On the `main` branch, pages import from `getWeddingData()` in `site-settings.ts`, which merges
Supabase `site_settings` overrides onto `WEDDING`/`IMAGES` from `wedding-data.ts`. In the
`claude/sweet-robinson` worktree, pages still import `WEDDING` directly from `wedding-data.ts`.

Key top-level keys:
- `WEDDING.couple` — `names: 'Ashlyn & Jeffrey'` (**canonical display order** for public copy)
- `WEDDING.date` — Sept 26 2026, RSVP deadline Aug 1 2026
- `WEDDING.venue` — Davis & Grey Farms, Celeste TX; ceremony 5:00 PM, send-off 10:00 PM
- `WEDDING.story[]` — Our Story timeline items (year, title, description, image, imageFallback)
- `WEDDING.bridalParty` — 7 bridesmaids (Paige Bimmerle MOH) + 7 groomsmen (John Paine Best Man)
- `WEDDING.hotels[]` — currently empty array (needs real hotels)
- `WEDDING.mealOptions[]` — currently empty (meal section hidden from RSVP when empty)
- `WEDDING.registry[]` — Amazon + Honeymoon Fund both have `url: 'TODO'`
- `WEDDING.faq[]` — FAQ items
- `WEDDING.dresscode` — dress code details (ladies + gentlemen)
- `WEDDING.schedule[]` — day-of schedule
- `WEDDING.travel` — travel info section
- `WEDDING.meta` — page title and description for SEO

Game content files (edit these to update game content without touching UI):
- `src/lib/games/trivia-questions.ts` — trivia questions (static for now)
- `src/lib/games/crossword.ts` — crossword clue set, answers, and board layout
- `src/lib/games/word-list.ts` — 310 rotating Painedle answer words
- `src/lib/games/schedule.ts` — trivia + crossword unlock date/countdown helpers
- `src/lib/games/leaderboard.ts` — score submission + leaderboard fetch helpers

---

## 🎨 Design System

**Vibe:** Minimal, elegant, romantic, editorial — "fine art wedding"

**Colors (defined in `globals.css` — main branch values, verified from source):**
```
--color-primary:        #1A3F6F   (Lighter navy — vibrant, clearly blue)
--color-secondary:      #7A1F24   (Burgundy)
--color-accent:         #C69A72   (Tan / warm gold)
--color-base:           #FFFFFF   (White)
--color-surface:        #F7F5F0   (Warm cream — NOT cold neutral gray)
--color-text-primary:   #0F1720   (Near-black for body text)
--color-text-secondary: #3F5B7A   (Slate blue for secondary text)
--color-text-light:     #FFFFFF
```

> **⚠️ Old color values in earlier docs were wrong.** The primary was documented as `#142A44`
> (too dark/muted). The surface was documented as `#F4F4F4` (cold gray). Both are corrected above.

**Typography:**
- `font-heading` → maps to `--font-playfair` CSS variable
  - **main branch:** Bodoni Moda (700/800/900, normal+italic) — high-contrast Didone
  - **sweet-robinson worktree:** Cormorant Garamond (500/600/700, normal+italic) — elegant, legible
- `font-body` → maps to `--font-inter` CSS variable → Montserrat (both branches)

**Tailwind v4 font utility note:**
`.font-heading` and `.font-body` are defined in `@layer utilities` (NOT `@theme`) as a workaround
for Tailwind v4's inability to resolve `next/font` CSS variable references inside `@theme`. This
is intentional — do not move them back to `@theme`.

### Games Cleanup & Admin Rebuild Plan (Mar 10, 2026)

A comprehensive cleanup plan exists in `.claude/plans/noble-dazzling-shell.md`. Key items:

**Critical bugs (Phase 1):**
- `GameAccountPanel.tsx` — no Cancel button when editing; fields blank on open (hydration bug)
- `ScoreSubmissionForm.tsx` — form stays open after successful submit (should collapse to success state)

**UX cleanup (Phase 2):**
- Remove "Reset Today" button from Painedle public UI
- Remove date pill from Painedle header
- Lock Painedle word length to 5 letters only (current 4/5/6/7 is confusing)
- Remove stat cards from Trivia welcome screen
- Remove mid-game Reset button from Trivia playing screen
- Verbose explanatory text in GameAccountPanel (reads like a privacy policy) — strip down to essentials
- Compact mobile layout for GameAccountPanel (single-line bar instead of full card above game)

**Admin Trivia CRUD (Phase 3 — not yet implemented):**
- New `trivia_questions` Supabase table with CRUD
- Public `GET /api/games/trivia-questions` route (non-archived, ordered by sort_order)
- Admin `GET/POST /api/admin/trivia-questions` + `PUT/DELETE /api/admin/trivia-questions/[id]`
- `CoupleTriviaGame.tsx` loads questions from API instead of static import
- `GamesAdminPanel.tsx` trivia bank view becomes a full editor (edit/archive/delete/add)

---

## 🌿 Branch / Worktree State

### Active branches
| Branch | Location | Status |
|---|---|---|
| `main` | `/Users/jeffpaine/Documents/Antigravity/ThePaineWedding/` | Production — deployed to Vercel |
| `claude/sweet-robinson` | `.claude/worktrees/sweet-robinson/` | Active dev worktree — diverged from main |

### Divergence point
Both branches share commits through `b67b276`. After that they diverged:

**`main` has (not in worktree):**
- `site-settings.ts` — Supabase-backed site content overrides
- `ContentAdminPanel.tsx` — admin editor for site_settings table
- Bodoni Moda font (via next/font)
- Games crossword additions from Session 14
- Admin split into `/admin`, `/admin/games`, `/admin/security`

**`claude/sweet-robinson` worktree has (not yet in main):**
- Cormorant Garamond font swap
- RSVP UX overhaul (improved search, household flow)
- Round 2 guest list (192 guests / 103 households) — **generated but NOT applied to Supabase**
- Round 2 seed SQL generated as base64 in task output `bj6f2y0q3.output`

### Round 2 guest seed status
- **Generated:** Yes — 103 households / 192 guests (vs Round 1: 85 households / 178 guests)
- **Applied to Supabase:** ❌ NOT YET
- **Blocker:** Round 2 seed references columns (`plus_one_name`, `affiliation`, `side`, `likelihood`)
  that don't exist in the current schema. Need to add those columns in a migration first.
- **Format:** TRUNCATE + full re-insert (idempotent replacement, not additive)

---

## ✅ WHAT HAS BEEN BUILT (Completed)

### Infrastructure
- [x] Next.js 16 App Router project scaffolded and deployed to Vercel
- [x] Supabase connected with `households` + `guests` + `admin_logs` schema
- [x] `food_allergies`, `song_request`, `advice` columns added to `guests`
- [x] `households.name` unique constraint added (enables idempotent seeding)
- [x] **178 guests / 85 households seeded** into Supabase (Round 1 — live)
- [x] **192 guests / 103 households** Round 2 seed generated — pending schema migration + apply
- [x] `src/lib/wedding-data.ts` — central content config (all pages pull from here)
- [x] `src/lib/site-settings.ts` — server-side Supabase override layer (main branch)
- [x] `.claude/` and `.claire/` added to `.gitignore`
- [x] Supabase `game_players` + `game_scores` tables migrated and applied to hosted Supabase

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
- [x] Mini Crossword — static story-based crossword with fill-in-the-blank clues, local progress save, and leaderboard submission
- [x] Game leaderboards — username/email submission + top-score boards
- [x] Trivia lock gate — countdown on `/games`, trivia opens on wedding day
- [x] RSVP — full 3-step flow (search → household → submit)
- [x] Admin Dashboard (`/admin`) — RSVP metrics, guest data table, bulk importer
- [x] Games Admin (`/admin/games`) — games control room with modal drill-down views
- [x] Security Admin (`/admin/security`) — admin login tracking

### RSVP Flow
- [x] Guest search by first/last name + nicknames (ilike fuzzy match)
- [x] Household grouping — one RSVP for the whole household
- [x] Attending checkboxes per guest
- [x] Meal choice per attending guest (hidden when `mealOptions` is empty)
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
- [x] Painedle keyboard bug — `window` key listener no longer hijacks Backspace/letters inside form fields

---

## ⏳ WHAT NEEDS REAL CONTENT (No code work — just fill in wedding-data.ts)

These are all `TODO` strings in `wedding-data.ts`. When info is ready, drop it in:

- [ ] Ceremony time, cocktail hour time, reception time, send-off time (venue confirmed 5 PM ceremony start)
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
- [ ] **Games cleanup** — Phase 1 bug fixes + Phase 2 UX cleanup (see plan in `.claude/plans/noble-dazzling-shell.md`)
- [ ] **Trivia CRUD admin** — Phase 3 of games plan: `trivia_questions` Supabase table + admin editor
- [ ] **Round 2 guest seed** — add missing columns migration + apply seed to Supabase
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

- **Fonts:** Both branches now use `next/font/google`. The old `<link>` tag approach is gone.
  - `main`: Bodoni Moda + Montserrat
  - `sweet-robinson` worktree: Cormorant Garamond + Montserrat
  - Font utilities (`.font-heading`, `.font-body`) are in `@layer utilities` in `globals.css` — this is intentional for Tailwind v4 compatibility with `next/font` CSS variables
- **Supabase anon key:** Readable in client bundle (by design for Supabase) — RLS should be enabled to protect data
- **`our-story/page.tsx`:** Has `"use client"` directive because `StoryImage` needs it
- **Admin passwords:** In `.env.local` as `ADMIN_PASSWORD_MASTER` + `ADMIN_PASSWORD_1`–`5` — also has `ADMIN_PASSWORDS` comma-separated format for backward compat
- **Seed SQL:** `supabase/seed_guest_list.sql` = Round 1 (178 guests / 85 households) — already applied. Round 2 (192 / 103) is generated but blocked on schema migration (missing columns)
- **plus_one RSVP gap:** `plus_one_allowed` is a boolean in the schema but there's no `plus_one_name` field for RSVPs. Guests with a plus-one can't register them. This is a known gap.
- **Trivia questions are static:** `trivia-questions.ts` is a hardcoded TS array. The admin can view them read-only. Full CRUD requires Phase 3 of the games plan.
- **Painedle word rotation anchor:** Anchor date `2026-03-08` = word `sparkle`. Each subsequent day advances sequentially through the 310-word bank. Changing the bank order will change all future daily words.
- **site-settings.ts is main-only:** The `claude/sweet-robinson` worktree does not have `site-settings.ts`. Pages in the worktree import `WEDDING` directly from `wedding-data.ts`. Don't mix approaches when merging.
- **Worktree divergence:** The `claude/sweet-robinson` worktree and `main` have diverged significantly (see Branch State section). They have NOT been merged as of Session 15. Be aware of which branch you're editing.

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
- Code is deployed live, but leaderboard writes were still blocked until the Supabase migration was applied

### Session 8 (Mar 8, 2026)
- Added `Games` to the main site nav so guests can actually find `/games`
- Redesigned `/games`, `/games/painedle`, and `/games/trivia` with stronger hero treatments, gradients, richer cards, and less empty white space
- Increased Painedle contrast substantially: dark board shell, clearer empty tiles, stronger keyboard states, and more readable leaderboard/form surfaces
- Upgraded the admin Games tab into a real control panel via `src/components/admin/GamesAdminPanel.tsx`
- Admin Games now includes modal drill-down views for: today's Painedle word, 21-day schedule, full word bank, trivia question bank, leaderboard views, submission log, and player directory
- Verified changes with `npm run build`

### Session 9 (Mar 8, 2026)
- Wrote and maintained the explicit redesign/game-system implementation plan in this doc before continuing code work
- Swapped the heading font to `Cormorant Garamond` (worktree only — main still has Bodoni Moda)
- Simplified `/games` to only the two actual game cards; removed the big hero/explainer stack
- Kept `Painedle` first and `Couple Trivia` second, with the locked trivia card visually subdued
- Removed redundant release-note style copy and extra metadata/hero clutter from the Painedle and Trivia routes
- Fixed the extra horizontal band under the sticky header on the games/admin pages
- Expanded Painedle from fixed five-letter answers to mixed 4/5/6/7-letter answers
- Added real-word guess validation using a packaged dictionary source (`word-list`) plus a validation API route
- Added persistent browser game profiles with account edit/logout controls
- Moved score submission to `/api/games/submit-score` so request metadata can be captured server-side
- Separated admin IA cleanly: `/admin` = RSVP, `/admin/games` = games, `/admin/security` = login tracking
- Documented future trivia-bank CRUD requirements only — not implemented in this pass
- Verified with `npm run lint` + `npm run build` — passes
- Committed to `main` as `c565864`; deployed to Vercel production
- Applied Supabase migration `20260308010000_add_game_leaderboards.sql` to hosted project

### Session 10 (Mar 8, 2026)
- Fixed a Painedle front-end keyboard bug where the global `window` key listener was hijacking `Backspace` and letter keys while focus was inside the username/email fields
- Added an editable-target guard for `input`, `textarea`, `select`, and `contentEditable` elements
- Revalidated with `npm run lint` + `npm run build` — passes

### Session 11 (Mar 8, 2026)
- Adjusted the signed-in games account UI in `src/components/games/GameAccountPanel.tsx`
- New behavior: saved players now see a compact account summary bar by default
- Username/email editing still exists, but the full form is only shown when account settings are opened
- Revalidated with `npm run lint` + `npm run build` — passes

### Session 12 (Mar 8, 2026)
- Fixed repeat-word scheduling in Painedle — replaced date-hash modulo with a true sequential daily rotation
- Anchor date: `2026-03-08` = `sparkle`; each following day advances exactly one slot through the bank
- Expanded `src/lib/games/word-list.ts` from a small list to a 310-word answer bank
- Added runtime guardrails in `word-list.ts`: throws on duplicates, throws if bank drops below 200 words
- Updated admin wording in `GamesAdminPanel.tsx` to correctly describe sequential rotation
- Revalidated with `npm run lint` + `npm run build` — passes

### Session 13 (Mar 9, 2026)
- User requested a new mini crossword game after Claude ran out of credits before documenting follow-up work
- New requirement: fill-in-the-blank, relationship-facts crossword that unlocks one week before the wedding
- This session is intentionally updating `AI_COLLAB.md` as work progresses so another AI can pick up mid-implementation if needed

### Session 14 (Mar 10, 2026)
- Added `src/lib/games/crossword.ts` with an 8-entry mini crossword built from real story/proposal/wedding facts:
  `GALVESTON`, `COMMERCE`, `JEFFREY`, `HOUSTON`, `CELESTE`, `ASHLYN`, `SONIC`, `VINES`
- Added `/games/crossword` via `src/app/games/crossword/page.tsx`
- Added `src/components/games/MiniCrosswordGame.tsx` and `CrosswordGate.tsx`
- Crossword behavior: unlocks one week before wedding via `schedule.ts`, saves progress in localStorage, allows clue selection, direct grid typing, check-board feedback, clue reveals, reset, freezes on solve, then allows leaderboard submission
- Expanded shared game plumbing so `crossword` is a first-class game type in leaderboard, submit-score route, and admin-types
- Reworked `GamesHubClient.tsx` so public hub has three cards: Painedle (live), Mini Crossword (one week before), Couple Trivia (wedding day)
- Expanded `GamesAdminPanel.tsx` so `/admin/games` can preview crossword grid, inspect clue lists, see crossword submissions, and track crossword unlock timing
- Normalized couple name order to `Ashlyn & Jeffrey` / `Ashlyn and Jeffrey` across the whole site
- Updated `WEDDING.couple.names` in `wedding-data.ts` — this is now the canonical source for brand text
- Validated with `npm run build` — passes

### Session 15 (Mar 10, 2026)
- A Codex AI session had investigated a task output file (`bj6f2y0q3.output`) as a potential security threat — it turned out to be the Round 2 guest list SQL seed data that a previous Claude session had base64-encoded (ironically flagging its own legitimate output)
- Confirmed the Round 2 seed is legitimate: 103 households / 192 guests; format is TRUNCATE + full INSERT
- Round 2 seed is NOT yet applied to Supabase — blocked on schema gap (missing `plus_one_name`, `affiliation`, `side`, `likelihood` columns in `guests` table)
- Comprehensive AI_COLLAB.md update performed:
  - Corrected primary color from `#142A44` to `#1A3F6F` (the actual value in `globals.css`)
  - Corrected surface color from `#F4F4F4` to `#F7F5F0` (warm cream, not cold gray)
  - Updated font documentation — both branches now use `next/font/google`, removed obsolete "do NOT use next/font" warning
  - Added `site-settings.ts` module documentation (server-only Supabase override layer, main branch only)
  - Added branch divergence section documenting what main has vs what the worktree has
  - Added `SUPABASE_SERVICE_ROLE_KEY` to environment variables section
  - Added Round 2 guest seed status and schema gap warning
  - Added `plus_one` RSVP gap to known quirks
  - Documented Games Cleanup & Admin Rebuild plan (reference to `.claude/plans/noble-dazzling-shell.md`)
  - Updated production URL (`https://www.thepainewedding.com`) and Vercel project ID
  - Updated file tree to reflect current admin split, new API routes, and component additions
  - Updated `game_scores` schema to include `crossword` as a game type
- Hand-off note: Next work should be the Games Cleanup plan — Phase 1 bug fixes in `GameAccountPanel.tsx` and `ScoreSubmissionForm.tsx`, then Phase 2 UX cleanup, then Phase 3 trivia CRUD

---

## Session Log — 2026-03-10 (Antigravity — Full Admin Edit Mode)

### What was built
Complete site-wide admin visual edit mode accessible only to the **Master** password role.

### Files modified / created

| File | Change |
|------|--------|
| `src/lib/site-settings.ts` | Major expansion: per-item overrides for story, FAQ, schedule, bridal party photos, registry, travel airports; fixed story subtitle default (removed "autumn") |
| `src/components/admin/AdminEditBar.tsx` | Full rebuild with: interactive canvas crop tool, rich text editor (bold/italic/underline/links/lists), edit-mode top nav bar showing all site pages, overlay controls, hover labels, URL paste field, Restore Original button |
| `src/components/ui/StoryItem.tsx` | Added optional `adminImageKey`, `adminTitleKey`, `adminDescKey` props so server pages can inject data-admin-key tags into the client component |
| `src/components/ui/AttireImage.tsx` | **NEW** — client wrapper for attire moodboard images; keeps `onError` fallback + admin-key |
| `src/components/ui/PersonPortrait.tsx` | **NEW** — client wrapper for bridal party portraits; keeps `onError` fallback + admin-key |
| `src/app/page.tsx` | Hero, intro, date, venue name, dress code card all tagged |
| `src/app/our-story/page.tsx` | Subtitle tagged; per-item title, description, image tagged via StoryItem props |
| `src/app/faq/page.tsx` | Per FAQ question + answer tagged |
| `src/app/schedule/page.tsx` | Per schedule item title, time, description tagged |
| `src/app/wedding-details/page.tsx` | Venue name, address, ceremony time, dress code summary, parking, RSVP deadline tagged |
| `src/app/attire/page.tsx` | Converted to server component; ladies/gents text + all moodboard images tagged |
| `src/app/bridal-party/page.tsx` | Converted to server component; per-person portrait photo tagged |
| `src/app/registry/page.tsx` | Per registry description + URL tagged |
| `src/app/travel/page.tsx` | Per airport description tagged |

### Admin edit mode UX
- Floating dark pill toolbar at bottom of viewport (Master role only)
- "✎ Edit Mode" toggle button — when ON, a top nav bar appears with links to all 9 site pages
- Yellow dashed outlines appear on all `[data-admin-key]` elements; hover shows a tooltip label
- Clicking any outlined element opens a slide-in right drawer:
  - **Image sections**: preview, Upload Photo button, Crop Image tool (draggable crop handles, Canvas export), URL paste field, Color overlay with color picker + opacity slider, Restore Original button
  - **Text sections**: plain textarea or rich text (contentEditable with Bold/Italic/Underline/Link/List toolbar), Restore Original button
- Save writes to Supabase `site_settings` table and reloads page
- Delete (`Restore Original`) removes the override key and reloads

### Build status
`npm run build` — passes cleanly, zero TypeScript or prerender errors across all 29 routes.

### Known limitation
Cropping requires the image to be CORS-accessible (same-origin or permissive headers). Supabase Storage public bucket URLs work fine; external URLs may fail with "Image load failed" and the admin should upload the image first.
