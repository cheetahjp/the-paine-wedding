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
| `meal_choice` | TEXT | optional (hidden in RSVP when `mealOptions` is empty) |
| `food_allergies` | TEXT | household-level legacy field (added March 2026) |
| `dietary_restrictions` | TEXT | **per-guest** dietary info entered at RSVP (added Session 17) |
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
# Email notifications (added Session 17 — set in Vercel dashboard):
RESEND_API_KEY=<resend api key>                # get from resend.com
RSVP_NOTIFY_EMAIL=jeff@jeffpainemedia.com      # where admin RSVP notifications go
RSVP_FROM_EMAIL=noreply@thepainewedding.com    # verified sender domain in Resend
```

> `SUPABASE_SERVICE_ROLE_KEY` is required for `site-settings.ts` to read the `site_settings`
> table server-side. Without it, `getSettingsMap()` returns `{}` and all content falls back
> to `wedding-data.ts` defaults (safe degradation, not a crash).

> `RESEND_API_KEY` — if absent, RSVP notify API returns 200 silently (no crash). Resend client
> is lazily initialized at request time, so a missing key won't break the build or RSVP submission.
> The `RSVP_FROM_EMAIL` domain must be verified in the Resend dashboard.

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
- `WEDDING.hotels[]` — **6 real hotels populated** (Session 17): 3 Greenville, 2 McKinney, 1 Farmersville Airbnb; each has `name`, `distance`, `description`, `address`, `phone`, `bookingUrl`, `hub`, `badge`
- `WEDDING.mealOptions[]` — intentionally empty (pizzas from Urban Crust — no per-guest meal selection)
- `WEDDING.registry[]` — Amazon: `https://www.amazon.com/wedding/share/ThePaineWedding`; Target: `https://www.target.com/gift-registry/gift/ThePaineWedding`
- `WEDDING.faq[]` — FAQ items
- `WEDDING.dresscode` — dress code details (ladies + gentlemen)
- `WEDDING.schedule[]` — day-of schedule
- `WEDDING.travel` — travel info section (airports, etc.)
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
- [x] `dietary_restrictions` (TEXT) column added to `guests` via migration `20260315000000_add_dietary_restrictions.sql` — **⚠️ migration generated, needs to be applied to Supabase hosted project**
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
- [x] Wedding Details — venue, map embed, schedule; **Urban Crust Food & Drinks card added (Session 17)**
- [x] Schedule — day-of timeline
- [x] Bridal Party — layout ready, data is placeholder
- [x] Travel — **full rewrite (Session 17)**: real hotel data, Google Maps embed, airport cards, Getting Around section, Things to Do in Dallas guide, McKinney local guide, State Fair callout
- [x] Registry — Amazon + Target links wired
- [x] FAQ — fully built, cards layout (no accordion yet)
- [x] Attire — dress code page
- [x] Games hub — public landing page linked in main nav
- [x] Couple Trivia — separate route with welcome → play → results flow
- [x] Painedle — separate daily word game with keyboard support + persistent browser save
- [x] Mini Crossword — static story-based crossword with fill-in-the-blank clues, local progress save, and leaderboard submission
- [x] Game leaderboards — username/email submission + top-score boards
- [x] Trivia lock gate — countdown on `/games`, trivia opens on wedding day
- [x] RSVP — **4-step flow with horizontal progress bar (Session 18)**: Find Invitation → Who's Coming → A Few More Things → All Set!
- [x] Admin Dashboard (`/admin`) — RSVP metrics, guest data table, bulk importer
- [x] Games Admin (`/admin/games`) — games control room with modal drill-down views
- [x] Security Admin (`/admin/security`) — admin login tracking

### RSVP Flow
- [x] Guest search by first/last name + nicknames — **upgraded to Levenshtein fuzzy matching on BOTH first AND last name (Session 17)**
  - Fetches all guests client-side, scores by `firstScore × lastScore` combined similarity
  - Auto-matches above 0.72 threshold; shows ranked suggestions between 0.35–0.72
  - Handles misspellings, partial names, and searching by first name only
- [x] Household grouping — one RSVP for the whole household
- [x] Attending checkboxes per guest
- [x] Meal choice per attending guest (hidden when `mealOptions` is empty — currently always hidden, Urban Crust pizza doesn't require per-guest selection)
- [x] **Per-guest `dietary_restrictions` text field** (Session 17) — shown for each attending guest; replaces household-level food allergy checkbox
- [x] ~~Optional guest email field~~ — **removed in Session 18** (email confirmations removed)
- [x] Song request input with greyed placeholder format hint
- [x] Advice for the couple textarea
- [x] All new fields saved to Supabase
- [x] ~~**Email notifications via Resend**~~ — **removed in Session 18** (route file kept but no longer called)
- [x] **RSVP multi-step redesign with horizontal progress bar (Session 18)** — 4 steps: Find Invitation → Who's Coming → A Few More Things → All Set!
- [x] **RSVP success screen fixed (Session 18)** — no more "please RSVP by" text on confirmation; shows warm "We've got you!" message with context-aware copy (attending vs. declining)

### Admin Dashboard
- [x] Server-side password auth via `/api/admin/auth` (passwords not exposed in client bundle)
- [x] Master password sees login tracking board; user passwords see standard view
- [x] Metrics: total invited, attending, declined, pending, meal counts
- [x] Guest table with **sortable columns** (Session 17): click any header to sort; grouped view when sorting by household, flat list otherwise
- [x] `food_allergies`, `song_request`, `advice`, **`dietary_restrictions`** columns visible in admin Extras tab
- [x] Bulk importer from Google Sheets paste

### Navigation
- [x] Desktop nav with all page links
- [x] Mobile hamburger drawer (smooth CSS transition, closes on link/outside click)
- [x] Bridal Party added to nav
- [x] Games added to main nav so guests can reach it normally
- [x] **Mobile X button fix (Session 17)** — header `z-[60]`, hamburger button `z-[61]`, overlay starts at `top-[80px]` (never covers the header); X button always reachable on iOS Safari

### Design
- [x] **Elegant ampersand (Session 17)** — `&` in "Ashlyn & Jeffrey" uses Bodoni Moda italic via `.font-amp` CSS utility in `@layer utilities`; applied in Navbar desktop, Navbar mobile logo area, and homepage hero h1
- [x] **Hero focal point fix (Session 17)** — `backgroundPosition: 'center 25%'` shifts the hero crop upward so heads aren't cut off on unusual viewport sizes

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
- [x] ~~Hotel recommendations near Celeste TX with booking URLs~~ — **done Session 17** (6 hotels in wedding-data.ts)
- [x] ~~Amazon registry URL~~ — live: `https://www.amazon.com/wedding/share/ThePaineWedding`
- [x] ~~Target registry URL~~ — live: `https://www.target.com/gift-registry/gift/ThePaineWedding`
- [ ] Honeymoon fund URL (if applicable)
- [ ] Meal options — **not needed**: switching to Urban Crust pizza; no per-guest meal selection
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
- [ ] **Apply `dietary_restrictions` migration** — `supabase/migrations/20260315000000_add_dietary_restrictions.sql` exists but has NOT been applied to hosted Supabase yet — run in Supabase SQL editor
- [x] ~~**Set Resend env vars in Vercel**~~ — email notifications removed in Session 18 (unnecessary complexity)
- [ ] **RSVP edit/update flow** — guests currently can't find their RSVP and change it
- [ ] **FAQ accordion** — collapse/expand instead of all cards stacked
- [ ] **CSV export** in admin dashboard (one button for caterer/venue/planner)
- [x] ~~**Email confirmation** after RSVPing~~ — removed in Session 18 (not needed; route file kept but no longer called)
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

### Session 16 (Mar 12, 2026)
- User requested a full UX rework of the in-page backend editor because the existing `AdminEditBar` used tiny right-side flyout/drawer editing that felt cramped for both text and images.
- Root problem area was confirmed to be `src/components/admin/AdminEditBar.tsx`, not `ContentAdminPanel.tsx`.
- The underlying backend/API model was intentionally preserved:
  - `site_settings` table still stores the overrides
  - `/api/admin/site-settings` still handles save/delete
  - `/api/admin/upload-image` still handles image uploads
- Reworked `AdminEditBar.tsx` editing interaction:
  - Removed the narrow slide-in right drawer
  - Text fields now open an inline editor positioned over the selected content region on the live page
  - Image fields now open a larger contextual panel anchored near the actual image, typically below it when space allows
  - Selected editable regions now get a stronger highlighted state via `data-admin-selected`
  - The crop tool remains available, but opens as a centered modal instead of living inside the skinny drawer
- New text editing behavior:
  - edit locally over the real page region instead of in a detached flyout
  - plain text uses a large textarea shell
  - rich text uses an in-place contentEditable surface with the existing toolbar controls
  - save / restore default / close actions live in the inline shell footer
- New image editing behavior:
  - larger preview surface
  - upload / crop / restore default controls in the anchored panel
  - URL override and overlay controls remain available
  - save / close actions live directly in that contextual panel
- Cleanup:
  - removed the now-unused old crop helper path that was no longer referenced
  - kept session gating and page edit interception logic intact
- Verification:
  - `npx eslint src/components/admin/AdminEditBar.tsx` passes
  - `npm run build` passes
- Note:
  - A full repo-wide `npm run lint` is currently noisy because the workspace contains `.claude/.next`, archive theme files, and unrelated warnings/errors outside this edit path. The editor rework itself was checked with targeted eslint plus a full production build.

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

---

## Session Log — 2026-03-11

### What was done
Real photos added to `public/images/` subfolders by the user. Two component bugs were fixed so local image paths actually display. Our Story descriptions were rewritten with real content.

### Bug fixes

| File | Fix |
|------|-----|
| `src/components/ui/PersonPortrait.tsx` | `safeSrc` regex only allowed `https://` URLs — any local path (`/images/...`) was immediately discarded and the Unsplash fallback used instead. Fixed to also accept paths starting with `/`. |
| `src/components/ui/AttireImage.tsx` | Same `safeSrc` bug — same fix. |

### Content updated — `src/lib/wedding-data.ts`

All `WEDDING.story` items rewritten with real text provided by Jeff (third-person narrative, no fluff):
- **How We Met** — refined from Jeff's notes
- **Our Reunion** — expanded with correct detail (Oct 18 start date moved here)
- **Beach & Lake Days** — title updated, new description
- **New York City** — title updated from "Trip to NY", new description
- **Hammocking** — new description
- **Photography** — title updated from "Starting up a photography business", new description
- **San Antonio** — title updated from "One-year trip to San Antonio", new description
- **Fredericksburg** — new description (image path `Fredricksburg.jpg` unchanged to match actual filename)
- **The Proposal** — tightened description

### Images now live (no code changes needed — paths were already in wedding-data.ts)

| Folder | Files |
|--------|-------|
| `public/images/hero/` | `JeffAshlyn-7977 2.jpg` |
| `public/images/story/` | `First round.jpg`, `A&M Game(Reunion).jpg`, `Lake.jpg`, `NYC.jpg`, `Hammock.jpg`, `Photographers.jpg`, `San Antonio.jpg`, `Fredricksburg.jpg`, `Proposal.jpg` |
| `public/images/bridal-party/Bridesmaids/` | `Paige.jpg`, `Shelvy.jpg`, `Izzy.jpg`, `Alondra.jpg`, `Megan.jpg`, `Brynn.jpg`, `Emma.jpg` |
| `public/images/bridal-party/Groomsmen/` | `John.jpg`, `Hudson.jpg`, `Roman.jpg`, `Justin.jpg`, `Duncan.jpg`, `Collin.jpg`, `Blake.jpg` |
| `public/images/attire/` | `Womens Outfit 1–12` (.jpg/.png), `Mens Outfit 1–9` (.jpg/.png) |

### Build status
`npm run build` — passes cleanly, 29 routes, zero TypeScript or prerender errors.

---

## Session Log — 2026-03-12 (Admin bar refresh persistence fix)

### Problem
- The in-page admin bar could disappear after a hard refresh on public pages.
- Navigating back to `/admin` would make it appear again.

### Root cause
- The admin session cookie was being written as a host-only cookie.
- Production traffic is split between `thepainewedding.com` and `www.thepainewedding.com`, so a login created on one host was not reliably visible on the other.
- Session fetches also relied on implicit browser credential behavior instead of explicitly requesting same-origin credentials.

### Fix

| File | Change |
|------|--------|
| `src/lib/admin/session.ts` | Added `getAdminSessionCookieDomain()` so production admin cookies are scoped to `thepainewedding.com` and shared by apex + `www`. |
| `src/app/api/admin/auth/route.ts` | Session cookie now sets `domain: thepainewedding.com` in production. |
| `src/app/api/admin/session/route.ts` | Logout clears the same shared-domain cookie instead of only clearing a host-only variant. |
| `src/components/admin/useAdminSession.ts` | Added `credentials: "same-origin"` to session/auth/logout requests. |
| `src/components/admin/AdminEditBar.tsx` | Added `credentials: "same-origin"` to the refresh-time session check used by the public-page editor bar. |

### Important note
- Existing host-only admin cookies do not automatically become shared-domain cookies.
- After this deploy, the admin should log in once more so the new cookie is issued in the correct scope.

### Verification
- `npm run build` passes
- Fix is intended to make the Master admin bar persist across refreshes and between apex / `www`

---

## Session Log — 2026-03-13 (RSVP masonry background)

### What changed
- Reworked the RSVP page visual treatment so the form sits over a moving photo wall built from images in `public/images/rsvp/`.
- The background now uses small masonry-style tiles in multiple columns with slow infinite vertical drift.
- Added layered color washes so the RSVP form remains the visual focus, similar to the home-page overlay treatment.

### Files modified

| File | Change |
|------|--------|
| `src/app/(main)/rsvp/page.tsx` | Added `RSVPBackdrop`, wired in the RSVP photo list, and wrapped the RSVP card in a blurred cream glass panel over the moving image grid. |
| `src/app/globals.css` | Added `rsvp-scroll-up` and `rsvp-scroll-down` keyframes plus utility animation classes for the infinite masonry drift. |

### Notes
- RSVP image sources are currently hardcoded from `public/images/rsvp/` in `src/app/(main)/rsvp/page.tsx`.
- The backdrop is decorative only (`aria-hidden`) and the form remains the main interaction target.

### Verification
- `npm run build` passes

---

## Session Log — 2026-03-13 (Admin bar logout/settings fix)

### Problem
- The floating admin bar could remain visible with no easy way to fully sign out from a public page.
- Users needed a local control in the bottom bar to either stop editing or fully leave admin mode without navigating back to `/admin`.

### What changed

| File | Change |
|------|--------|
| `src/components/admin/AdminEditBar.tsx` | Added a `Settings` button to the bottom admin bar, plus a small settings popover with two actions: `Exit editing on this page` and `Log out of admin mode`. Logging out now clears edit state, closes active panels, clears selection state, calls `DELETE /api/admin/session`, and removes the bar immediately. |

### Verification
- `npx eslint src/components/admin/AdminEditBar.tsx` passes
- `npm run build` passes

### Follow-up fix
- Logout still reappeared after refresh because old host-only admin cookies could coexist with the newer shared-domain cookie.
- Auth/logout flow was tightened so login first clears any host-only `wedding_admin_session` cookie, and logout now clears both:
  - the shared-domain cookie for `thepainewedding.com`
  - the host-only cookie on the current hostname
- This is intended to stop the floating admin bar from coming back after refresh.

### Second follow-up fix
- There was also a separate client-state bug: the admin dashboard login/logout flow (`useAdminSession`) and the floating `AdminEditBar` were not sharing session updates.
- Result: `/admin` could show the logged-out login card while the floating bar still thought the user was authenticated.
- Fix:
  - added a shared browser event (`admin-session-changed`) in `src/components/admin/useAdminSession.ts`
  - login/logout/session refresh now emit that event
  - `src/components/admin/AdminEditBar.tsx` now listens for it and immediately hides itself when logout happens anywhere in the app
  - the floating bar also re-checks session on window focus

---

## Session Log — 2026-03-13 (RSVP masonry visibility fix)

### Problem
- The RSVP masonry/photo wall was not visible even though the backdrop component existed.

### Root cause
- `Section` defaults to `bg-base`, and the RSVP page was still rendering that opaque section background over the moving image wall.

### Fix

| File | Change |
|------|--------|
| `src/app/(main)/rsvp/page.tsx` | Added `bg-transparent` to the RSVP section wrapper so the masonry backdrop can show through. |
| `src/app/api/admin/auth/route.ts` | Login now clears any old host-only admin cookie before issuing the shared-domain cookie. |
| `src/app/api/admin/session/route.ts` | Logout now clears both host-only and shared-domain admin cookies. |
| `src/lib/admin/session.ts` | Added shared cookie option helper used by the auth/session routes. |

### Verification
- `npm run build` passes
- `npx eslint ...` passes with one existing RSVP backdrop warning about raw `<img>` usage for the decorative background

---

## Session Log — 2026-03-13 (Attire / Registry / RSVP polish pass)

### Attire
- Reworked the attire page into two clickable tabs:
  - `Ladies`
  - `Gentlemen`
- Each tab now has its own masonry-style moodboard instead of one mixed grid.
- Added a new client component:
  - `src/components/ui/AttireTabs.tsx`
- Updated attire image cards to use the newer rounded/stroked/diffused visual language:
  - `src/components/ui/AttireImage.tsx`
- Updated the default dress-code copy in `src/lib/wedding-data.ts` so the descriptions better match the actual image styling:
  - ladies = polished cocktail / satin / florals / elevated midi styling
  - gentlemen = tailored suits / separates / dress shoes / reception-ready styling

### Registry
- Removed the user-facing `Click to add URL` / `Coming Soon` admin-looking placeholder behavior from the frontend registry page.
- Wired in the live registry links supplied by Jeff:
  - Amazon: `https://www.amazon.com/wedding/share/ThePaineWedding`
  - Target: `https://www.target.com/gift-registry/gift/ThePaineWedding`
- Registry cards now use the shared softer panel treatment instead of the older flatter card style.

### RSVP
- Slowed the moving RSVP photo wall substantially.
- Removed the vignette treatment and replaced it with a consistent darker overlay.
- Moved the `RSVP` title and intro copy inside the main RSVP card.
- Made the RSVP card more responsive by allowing a wider desktop width and better stacking behavior for the name inputs.
- Kept the masonry/photo-wall treatment behind the form.

### Shared styling
- Added shared panel styles in `src/app/globals.css`:
  - `.surface-panel`
  - `.surface-inset`
- These establish more consistent:
  - rounded corners
  - thin stroke outlines
  - diffused shadows
  - warm cream gradient card surfaces
- Added a reusable bottom-up page reveal animation:
  - `.page-fade-up`
- Applied it globally through `src/components/ui/Section.tsx` so most page sections now fade up on load, while `StoryItem` still keeps its left/right reveal behavior.

### Files changed
- `src/app/(main)/attire/page.tsx`
- `src/app/(main)/registry/page.tsx`
- `src/app/(main)/rsvp/page.tsx`
- `src/components/ui/AttireTabs.tsx`
- `src/components/ui/AttireImage.tsx`
- `src/components/ui/Section.tsx`
- `src/app/globals.css`
- `src/lib/wedding-data.ts`

### Verification
- `npm run build` passes
- targeted `npx eslint ...` passes after switching the RSVP backdrop to `next/image`

---

## Session Log — 2026-03-13 (Compact logo integration)

### What changed
- Two new logo assets were added by Jeff:
  - `public/A&J_Box.svg`
  - `public/A&J.svg`
- Integrated them in the two small-scale brand touchpoints they fit best:
  - browser/tab icon now uses `A&J_Box.svg`
  - mobile navbar brand now uses `A&J.svg`
- Desktop navbar still keeps the full `Ashlyn & Jeffrey` wordmark, while mobile swaps to the compact monogram-style logo for cleaner small-screen spacing.

### Files changed
- `src/app/layout.tsx`
- `src/components/layout/Navbar.tsx`

### Verification
- `npm run build` passes

---

## Session Log — 2026-03-13 (Visual hierarchy second pass)

### What changed
- Removed the global automatic bottom-up reveal from `Section`, because it was applying to page headers and making the hero/header blocks feel unnecessarily animated.
- Kept the custom Our Story left/right reveal behavior intact in `StoryItem`.

### Attire follow-up
- Reworked `AttireTabs` so the tab control reads more like an attached filing-tab treatment:
  - active tab blends into the main tan panel
  - inactive tab sits behind in navy
- Removed the oversized `Style` heading from the tab buttons.
- Switched the attire image layout away from fixed-height grid tiles and back to a masonry/column flow so outfits are not cropped.
- Updated `AttireImage` to use `object-contain` instead of crop-heavy behavior.

### Registry follow-up
- Registry cards are now fully clickable cards instead of tiny-button-only interactions.
- The CTA treatment is now navy by default and lifts slightly on hover.

### Games follow-up
- Reworked the games hub so the game cards are vertically stacked instead of side-by-side.
- Removed the inconsistent reddish/greenish glow treatment from those cards.
- Unified the cards around the shared cream panel treatment to reduce clipping and keep the color language consistent.

### Files changed
- `src/components/ui/Section.tsx`
- `src/components/ui/AttireTabs.tsx`
- `src/components/ui/AttireImage.tsx`
- `src/app/(main)/registry/page.tsx`
- `src/components/games/GamesHubClient.tsx`

### Verification
- `npm run build` passes
- targeted `npx eslint ...` passes

---

## Session Log — 2026-03-13 (Consistency pass: headers, nav, story titles, schedule motion)

### Navbar
- Added current-page state styling in `src/components/layout/Navbar.tsx`
  - active route now gets a slightly bolder treatment and primary color
  - hover state transitions toward the same active appearance for smoother feedback
- Applied the same active-state logic to the mobile drawer nav.

### Header sections
- Standardized the first header block on these pages to use the same surface-backed hero treatment with aligned spacing and text color:
  - `src/app/(main)/travel/page.tsx`
  - `src/app/(main)/schedule/page.tsx`
  - `src/app/(main)/faq/page.tsx`
  - `src/app/(main)/registry/page.tsx`
  - `src/app/(main)/attire/page.tsx`
  - `src/app/(main)/bridal-party/page.tsx`
  - `src/app/(main)/our-story/page.tsx`
- Removed the automatic global section fade so page headers no longer animate in.

### Story timeline headings
- Updated several story item titles in `src/lib/wedding-data.ts` to be cleaner and more editorial:
  - `Beach & Lake Days` → `Days by the Water`
  - `New York City` → `Their First Trip to New York`
  - `Hammocking` → `Quiet Weekends Together`
  - `Photography` → `Creating Together`
  - `San Antonio` → `An Anniversary Weekend`
  - `Fredericksburg` → `A Hill Country Escape`

### Image rounding consistency
- Normalized visible image corner treatment to the newer rounded style in:
  - `src/components/ui/StoryItem.tsx`
  - `src/components/ui/PersonPortrait.tsx`
  - travel map block in `src/app/(main)/travel/page.tsx`
- Attire images were already aligned in the prior pass.

### Attire follow-up
- Swapped the attire tab color logic so the active tab is now navy and the inactive tab sits behind in tan.

### Schedule animation
- Added `src/components/ui/ScheduleTimelineItem.tsx`
- Each schedule event now reveals as its own chunk instead of the whole timeline moving together.
- The reveal unit is:
  - timeline dot
  - title
  - time
  - description

### Verification
- `npm run build` passes
- targeted `npx eslint ...` passes

### Small follow-up
- Registry cards now open external registries in a new tab.
- RSVP card styling was corrected again:
  - restored the shared panel gradient/stroke look by removing the one-off white border/background override
  - strengthened the intro copy contrast
  - strengthened input/placeholder contrast so the search form reads correctly over the photo wall
- RSVP backdrop speed was reduced again to roughly 3x slower than the prior pass for a calmer background treatment.

---

## Session Log — 2026-03-15 (Session 17 — RSVP improvements, email notifications, travel & admin overhaul)

### Summary
Large batch of improvements across RSVP, admin, travel page, navigation, and design.

### RSVP — Fuzzy name search upgrade
- **File:** `src/app/(main)/rsvp/page.tsx`
- Previous search: Supabase `ilike` on last name only (then substring check on first name)
- New search: fetches all guests client-side, computes Levenshtein distance for BOTH first AND last name independently, then multiplies scores for a combined similarity
- Auto-matches above `EXACT_THRESHOLD = 0.72`; shows ranked suggestions between `THRESHOLD = 0.35` and `0.72`
- Handles misspellings, partial names, and searching by first name only
- Suggestions are sorted by combined score descending

### RSVP — Per-guest dietary restrictions
- **File:** `src/app/(main)/rsvp/page.tsx`
- Replaced household-level food allergy checkbox with a per-guest `dietary_restrictions` text field
- Field appears for each guest who marks "Attending" (hidden for those marking No)
- `responses` state type changed from `{ attending, meal_choice }` to `{ attending, dietary_restrictions }`
- New field saved to Supabase `guests.dietary_restrictions` column

### RSVP — Meal options removed
- Removed "Meal Choice" from the RSVP form entirely
- Catering is now Urban Crust wood-fired pizza — no per-guest selection needed
- `mealOptions` array remains in `wedding-data.ts` but is empty; RSVP hides the meal section when empty

### RSVP — Optional email for confirmation
- Added optional `guestEmail` field in the "A Few More Things" section
- If provided, the notify API sends a guest confirmation email

### Email notifications via Resend
- **New file:** `src/app/api/rsvp/notify/route.ts`
- Sends admin notification to `RSVP_NOTIFY_EMAIL` on every RSVP submission
- Sends guest confirmation if they provide `guestEmail`
- Resend client is **lazily initialized** (null at module load) to avoid `next build` throw when `RESEND_API_KEY` is absent
- API always returns 200 — never fails the RSVP submission
- **Required env vars (set in Vercel dashboard):** `RESEND_API_KEY`, `RSVP_NOTIFY_EMAIL`, `RSVP_FROM_EMAIL`

### Admin — Sortable guest table
- **File:** `src/app/(main)/admin/page.tsx`
- Added `SortField` type union: `"name" | "household" | "affiliation" | "side" | "likelihood" | "rsvp" | "plusone"`
- Added `sortField` / `sortDir` state, `handleSort()`, `getSortedGuests()`, `SortIcon`, `ThSortable` components
- Clicking any column header sorts ascending; clicking again reverses; grouped household view when sorting by household
- Removed "Meal Selections" summary card (meals removed from RSVP)
- Extras tab now shows `dietary_restrictions || food_allergies` (both legacy and new field)

### Wedding Details — Urban Crust food section
- **File:** `src/app/(main)/wedding-details/page.tsx`
- Added "Food & Drinks" card with Urban Crust mention, pizza selection placeholder, beer & wine open bar note
- Grid changed from `md:grid-cols-2` to `md:grid-cols-2 xl:grid-cols-3` for 5 cards

### Travel page — Complete rewrite
- **File:** `src/app/(main)/travel/page.tsx`
- 6 sections: Hero, Map + Venue directions, Airports, Accommodations, Things to Do, Getting Around
- Google Maps embed for Davis & Grey Farms; drive-time links from both airports
- 6 real hotel options in three hubs (Greenville, McKinney, Farmersville) with address, phone, booking link, badge
- **"Exploring Dallas & DFW" section** built from research document:
  - State Fair of Texas callout (happening Sep 25–Oct 18, same weekend as wedding!)
  - Arts & Culture grid: Dallas Arts District, DMA, Nasher, Perot Museum, Sixth Floor Museum
  - Food & Neighborhoods grid: Deep Ellum, Bishop Arts, Klyde Warren Park, Legacy Hall, Katy Trail Ice House
  - Day Trips: Fort Worth Stockyards, Fort Worth Museum Triangle, Meow Wolf, Dallas Arboretum
  - McKinney Local Guide: Historic Downtown, Adriatica Village, Heard Museum, Chestnut Square Market

### Navigation — Mobile X button fix
- **File:** `src/components/layout/Navbar.tsx`
- Root cause: overlay (`fixed inset-0`) was potentially covering the sticky header button on iOS Safari
- Fix: overlay starts at `top-[80px]` (not `inset-0`); header `z-[60]`, hamburger button `z-[61]`, drawer `z-[55]`, overlay `z-[54]`

### Design — Elegant ampersand
- **File:** `src/app/globals.css`
- Added `.font-amp` utility in `@layer utilities`:
  ```css
  .font-amp { font-family: var(--font-playfair), serif; font-style: italic; font-weight: 700; letter-spacing: 0.02em; }
  ```
- Applied in Navbar desktop wordmark, homepage hero h1

### Design — Hero focal point
- **File:** `src/app/(main)/page.tsx`
- `backgroundPosition: 'center 25%'` (was `bg-center` / `center center`) — shifts crop upward

### Database migration
- **New file:** `supabase/migrations/20260315000000_add_dietary_restrictions.sql`
- `ALTER TABLE guests ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT;`
- **⚠️ NOT YET APPLIED** to hosted Supabase — run in Supabase SQL editor or via CLI

### Files created / modified this session
| File | Change |
|------|--------|
| `src/app/(main)/rsvp/page.tsx` | Levenshtein fuzzy search, per-guest dietary_restrictions, removed meals, optional email |
| `src/app/(main)/admin/page.tsx` | Sortable columns, dietary_restrictions in Extras tab, removed Meal Selections card |
| `src/app/(main)/travel/page.tsx` | Full rewrite: real hotels, map, airport cards, Things to Do section, McKinney guide |
| `src/app/(main)/wedding-details/page.tsx` | Added Urban Crust Food & Drinks card |
| `src/components/layout/Navbar.tsx` | Mobile X button z-index fix; italic ampersand rendering |
| `src/app/(main)/page.tsx` | Hero focal point `center 25%`; italic ampersand in h1 |
| `src/app/globals.css` | `.font-amp` utility added |
| `src/app/api/rsvp/notify/route.ts` | **NEW** — Resend email notifications for admin + guest |
| `supabase/migrations/20260315000000_add_dietary_restrictions.sql` | **NEW** — dietary_restrictions column |
| `src/lib/wedding-data.ts` | 6 real hotels with full details; WeddingConfig type updated |
| `AI_COLLAB.md` | This update |

### Verification
- `tsc --noEmit` — 0 errors
- `next build` — passes, all routes including `/api/rsvp/notify`

### Pending actions for Jeff
1. **Apply DB migration:** Open Supabase SQL editor → paste `supabase/migrations/20260315000000_add_dietary_restrictions.sql` → Run
2. ~~Set Resend env vars~~ — no longer needed; email notifications removed

---

## Session Log — 2026-03-15 (Session 18 — Admin logout fix, RSVP multi-step redesign, email removal)

### Summary
Fixed persistent admin logout bug caused by cookie de-duplication in Next.js response headers. Redesigned RSVP as a 4-step wizard with a horizontal dot progress bar. Removed Resend email notifications from the RSVP flow (not needed). Fixed the RSVP success/thank-you screen.

### Bug fix: Admin logout persistence
- **File:** `src/app/api/admin/session/route.ts`
- **Root cause:** `response.cookies.set()` in Next.js deduplicates `Set-Cookie` headers by cookie name. The DELETE handler called it twice with the same name — first with `domain: thepainewedding.com`, then without domain. The second call silently overwrote the first, so only a host-only clear was sent. The domain-scoped cookie (set on login) was never deleted.
- **Also:** `AdminEditBar` re-checks the session on every pathname change (`useEffect([pathname])`). If the cookie persisted, the bar came back after navigation.
- **Fix:** Changed DELETE handler to use `response.headers.append("Set-Cookie", ...)` directly, which allows multiple `Set-Cookie` headers for the same name. Now sends BOTH the domain-scoped clear AND host-only clear correctly.
- **Side effect cleanup:** Removed now-unused `getAdminSessionCookieBaseOptions` import from session route.

### RSVP — Multi-step redesign with progress bar
- **File:** `src/app/(main)/rsvp/page.tsx`
- Replaced 2-state (search/respond/success) flow with a 4-step numbered wizard
- **Step 1 — Find Your Invitation:** Name search only (first + last)
- **Step 2 — Who's Coming?:** Attendance toggle per guest (Attending / Declined) + dietary restrictions for attending guests. "Next" advances to step 3 if anyone is attending; if all decline, submits directly and jumps to step 4.
- **Step 3 — A Few More Things:** Song request + advice for the couple (both optional). Submit button.
- **Step 4 — All Set!:** Success screen — no deadline text, clear confirmation.
- **Progress bar (`RSVPProgressBar` component):** 4 labeled dots connected by a horizontal line. Completed steps show a checkmark (✓), current step is highlighted with a ring, future steps are muted. Line fills proportionally as steps complete. Hidden on step 4.
- Step heading and subtitle update dynamically per step.

### RSVP — Success screen fix
- Step 4 shows: checkmark circle → "Response Received" label → "We've got you!" heading
- Context-aware body text: attending guests get "We can't wait to celebrate with you on [day]"; declining guests get "We're sorry you can't make it, but we appreciate you letting us know."
- Two CTAs: "Return Home" + "Plan Your Trip" (only if attending)
- No "Please RSVP by" date visible anywhere on the success screen

### RSVP — Email notifications removed
- Removed `guestEmail` state, email input field, and `fetch("/api/rsvp/notify", ...)` call
- The route file `src/app/api/rsvp/notify/route.ts` is **kept** (not deleted) in case it's useful later, but it is no longer called anywhere
- Resend env vars (`RESEND_API_KEY`, etc.) no longer needed

### Files created / modified this session
| File | Change |
|------|--------|
| `src/app/api/admin/session/route.ts` | DELETE handler rewritten with `headers.append` to properly clear domain + host cookies |
| `src/app/(main)/rsvp/page.tsx` | Full redesign: 4-step wizard, `RSVPProgressBar` component, email removed, success screen fixed |
| `AI_COLLAB.md` | This update |

### Verification
- TypeScript: no new type errors (step type is `1 | 2 | 3 | 4`, all arms accounted for)
- RSVP flow: step 1 → 2 → 3 → 4 (attending path); step 1 → 2 → 4 (declining path, auto-submit)
- Logout: DELETE now sends two distinct `Set-Cookie` headers via `headers.append`, clearing both domain and host-only cookies

### Pending actions for Jeff
1. **Apply DB migration:** `supabase/migrations/20260315000000_add_dietary_restrictions.sql` — run in Supabase SQL editor
2. **Apply page visibility migration:** `supabase/migrations/20260315010000_default_page_visibility.sql` — run in Supabase SQL editor (sets Schedule and Details as hidden by default)
3. **Test logout:** After deploying, log in as admin → log out via the floating bar → navigate to another page. The bar should NOT reappear.
