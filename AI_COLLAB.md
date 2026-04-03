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

> **Font note:** Both `main` and all worktrees use `next/font/google`. The old `<link>` tag approach is gone.
> Font utilities (`.font-heading`, `.font-body`) are in `@layer utilities` in `globals.css` — intentional for Tailwind v4 compatibility with `next/font` CSS variables.

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
│   ├── registry/page.tsx           # Registry links (Amazon + Target)
│   ├── faq/page.tsx                # FAQ cards
│   ├── attire/page.tsx             # Dress code / attire guide
│   ├── rsvp/page.tsx               # Full RSVP flow (4-step wizard)
│   ├── api/
│   │   ├── admin/auth/route.ts     # Server-side password validation
│   │   ├── games/submit-score/route.ts     # Server-side score submission
│   │   ├── games/validate-word/route.ts    # Server-side word validation for Painedle
│   │   └── games/trivia-questions/route.ts # Public GET — non-archived questions
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
│   │   ├── MiniCrosswordGame.tsx   # Client-side mini crossword (194 daily puzzles, timer, scoring)
│   │   ├── CrosswordGate.tsx       # Unlock gating wrapper for crossword
│   │   ├── PainedleGame.tsx        # Client-side daily Wordle-style game
│   │   ├── GameAccountPanel.tsx    # Persistent browser profile (username/email)
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
    ├── site-settings.ts            # ⭐ SERVER-ONLY — fetches `site_settings` table from Supabase
    │                               #    and merges overrides onto wedding-data.ts
    │                               #    Exports: getWeddingData(), getSettingsMap()
    ├── supabase.ts                 # Client-side Supabase client (anon key)
    └── games/
        ├── crossword.ts            # 194 daily crossword puzzles (RAW_PUZZLES array + buildPuzzle helper)
        │                           # ⚠️ Generated by scripts/generate-crosswords.mjs — do NOT hand-edit
        ├── trivia-questions.ts     # 10 trivia questions (static — future: load from Supabase)
        ├── word-list.ts            # 310-word Painedle answer bank (5-letter only)
        │                           # Runtime guards: throws on duplicates, throws if < 200 words, throws if non-5-letter
        ├── painedle.ts             # Daily sequential rotation + scoring helpers
        │                           # Anchor: 2026-03-08 = "sparkle"; each day advances one slot
        ├── schedule.ts             # Trivia + crossword unlock date/countdown helpers
        ├── leaderboard.ts          # Score submission + leaderboard fetch helpers
        └── admin-types.ts          # Shared admin type definitions
scripts/
└── generate-crosswords.mjs        # One-time generator for 194 crossword puzzles
                                    # Outputs TypeScript to replace RAW_PUZZLES in crossword.ts
supabase/
├── migrations/
│   ├── 0000_schema.sql
│   ├── 20260307000000_add_rsvp_fields.sql
│   ├── 20260308010000_add_game_leaderboards.sql
│   ├── 20260315000000_add_dietary_restrictions.sql  # ⚠️ NOT YET APPLIED
│   ├── 20260315010000_default_page_visibility.sql   # ⚠️ NOT YET APPLIED
│   ├── 20260315020000_trivia_questions.sql          # ⚠️ NOT YET APPLIED
│   └── 20260315030000_rsvp_history.sql             # ⚠️ NOT YET APPLIED
└── seed_guest_list.sql             # Round 1: 178 guests / 85 households (applied to Supabase)
public/
├── A&J_Box.svg                     # Box monogram logo (used as favicon)
├── A&J.svg                         # Inline monogram (used in mobile navbar)
└── images/
    ├── hero/                       # JeffAshlyn-7977 2.jpg
    ├── story/                      # First round.jpg, A&M Game(Reunion).jpg, Lake.jpg, NYC.jpg,
    │                               # Hammock.jpg, Photographers.jpg, San Antonio.jpg,
    │                               # Fredricksburg.jpg, Proposal.jpg
    ├── bridal-party/
    │   ├── Bridesmaids/            # Paige.jpg, Shelvy.jpg, Izzy.jpg, Alondra.jpg, Megan.jpg, Brynn.jpg, Emma.jpg
    │   └── Groomsmen/              # John.jpg, Hudson.jpg, Roman.jpg, Justin.jpg, Duncan.jpg, Collin.jpg, Blake.jpg
    ├── attire/                     # Womens Outfit 1–12, Mens Outfit 1–9 (.jpg/.png)
    ├── venue/
    └── rsvp/                       # Photos used in RSVP masonry backdrop
```

---

## 🗄 Database Schema (Supabase)

### `households`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | auto-generated |
| `name` | TEXT UNIQUE | e.g. "The Smith Family" |
| `created_at` | TIMESTAMP | |

### `guests`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | auto-generated |
| `household_id` | UUID FK | → `households(id)` |
| `first_name` | TEXT | |
| `last_name` | TEXT | |
| `suffix` | TEXT | optional |
| `nicknames` | TEXT | optional, used for fuzzy RSVP search |
| `plus_one_allowed` | BOOLEAN | default false |
| `attending` | BOOLEAN/NULL | NULL = pending, true = yes, false = no |
| `meal_choice` | TEXT | optional (hidden — no per-guest selection needed) |
| `food_allergies` | TEXT | used for dietary restrictions in RSVP |
| `dietary_restrictions` | TEXT | per-guest dietary info — **migration NOT yet applied** |
| `song_request` | TEXT | |
| `advice` | TEXT | |
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
| `id` | UUID PK | |
| `email` | TEXT UNIQUE | normalized lowercase |
| `username` | TEXT | display name |
| `created_at` / `updated_at` | TIMESTAMP | |

### `game_scores`
| Column | Type | Notes |
|---|---|---|
| `id` | UUID PK | |
| `player_id` | UUID FK | → `game_players(id)` |
| `game` | TEXT | `trivia`, `painedle`, or `crossword` |
| `puzzle_key` | TEXT | date key or `wedding-day-trivia` |
| `score` | INTEGER | |
| `max_score` | INTEGER/NULL | |
| `attempts` | INTEGER/NULL | |
| `solved` | BOOLEAN/NULL | |
| `metadata` | JSONB | device, locale, timezone, platform, IP |
| `created_at` / `updated_at` | TIMESTAMP | |

### `guests` (additional columns added later)
| `is_plus_one` | BOOLEAN | default false |
| `plus_one_for_id` | UUID FK | → `guests(id)` |
| `plus_one_claimed` | BOOLEAN | default false |
| `plus_one_allowed` | BOOLEAN | default false |
| `viewed_rsvp` | BOOLEAN | default false — true once guest opens or submits RSVP |
| `nicknames` | TEXT | comma-separated alternate first names for fuzzy search |
| `updated_at` | TIMESTAMPTZ | auto-updated by trigger on every UPDATE |

### `rsvp_history`
Append-only audit log. One row per guest per RSVP event.
Fields: `id`, `guest_id`, `household_id`, `recorded_at`, `attending`, `food_allergies`, `song_request`, `advice`, `event_type` (submitted/viewed), `actor_guest_id`, `event_group_id`.

### `trivia_questions`
Fields: `id`, `prompt`, `answer_a/b/c/d`, `correct_index`, `fun_fact`, `sort_order`, `archived`, `created_at`, `updated_at`.

### `api_rate_limits`
Server-side fixed-window rate limiting. Managed via `consume_rate_limit()` Supabase RPC.

### `page_visibility`
Per-page visibility flags (`schedule`, `wedding_details`, etc.). Managed via admin content panel.

### `site_settings`
Key-value store for all admin-editable content overrides.

> **RLS:** Enabled on wedding tables as of migration `20260325090000`. Service role key required for write operations.

---

## 🌐 Environment Variables

`.env.local` (never committed, already configured in Vercel):
```env
NEXT_PUBLIC_SUPABASE_URL=https://khqmbphkdmexkknzvtgb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>
SUPABASE_SERVICE_ROLE_KEY=<service role key>   # server-side only — used by site-settings.ts
ADMIN_PASSWORD_MASTER=<master password>
ADMIN_PASSWORD_1=<password1>
ADMIN_PASSWORD_2=<password2>
ADMIN_PASSWORD_3=<password3>
ADMIN_PASSWORD_4=<password4>
ADMIN_PASSWORD_5=<password5>
```

> `SUPABASE_SERVICE_ROLE_KEY` is required for `site-settings.ts`. Without it, all content falls back to `wedding-data.ts` defaults (safe degradation, not a crash).

---

## 🧠 wedding-data.ts — The Content Config

**`src/lib/wedding-data.ts` is the most important file for content work.**

Pages import from `getWeddingData()` in `site-settings.ts`, which merges Supabase `site_settings` overrides onto `WEDDING`/`IMAGES` from `wedding-data.ts`.

Key top-level keys:
- `WEDDING.couple` — `names: 'Ashlyn & Jeffrey'` (**canonical display order**)
- `WEDDING.date` — Sept 26 2026, RSVP deadline Aug 1 2026
- `WEDDING.venue` — Davis & Grey Farms, Celeste TX; ceremony 5:00 PM, send-off 10:00 PM
- `WEDDING.story[]` — Our Story timeline (9 real items with photos)
- `WEDDING.bridalParty` — 7 bridesmaids (Paige Bimmerle MOH) + 7 groomsmen (John Paine Best Man)
- `WEDDING.hotels[]` — 6 real hotels (3 Greenville, 2 McKinney, 1 Farmersville Airbnb)
- `WEDDING.mealOptions[]` — intentionally empty (Urban Crust pizza — no per-guest selection)
- `WEDDING.registry[]` — Amazon: `https://www.amazon.com/wedding/share/ThePaineWedding`; Target: `https://www.target.com/gift-registry/gift/ThePaineWedding`

---

## 🎨 Design System

**Vibe:** Minimal, elegant, romantic, editorial — "fine art wedding"

**Colors (defined in `globals.css`):**
```
--color-primary:        #1A3F6F   (Lighter navy)
--color-secondary:      #7A1F24   (Burgundy)
--color-accent:         #C69A72   (Tan / warm gold)
--color-base:           #FFFFFF   (White)
--color-surface:        #F7F5F0   (Warm cream — NOT cold neutral gray)
--color-text-primary:   #0F1720   (Near-black)
--color-text-secondary: #3F5B7A   (Slate blue)
--color-text-light:     #FFFFFF
```

**Typography:**
- `font-heading` → `--font-playfair` → Bodoni Moda (700/800/900)
- `font-body` → `--font-inter` → Montserrat
- `.font-amp` → Bodoni Moda italic 700 — used for the `&` in "Ashlyn & Jeffrey"

**Shared CSS utilities (globals.css):**
- `.surface-panel` / `.surface-inset` — rounded, stroked, diffused, cream gradient cards
- `.page-fade-up` — bottom-up reveal animation
- `rsvp-scroll-up` / `rsvp-scroll-down` keyframes — RSVP masonry backdrop drift

---

## 🎮 Games System

### Painedle
- Daily word game (Wordle-style), 5-letter words only
- Anchor: `2026-03-08` = `sparkle`; each day advances one slot
- 310-word answer bank in `src/lib/games/word-list.ts`
- Persistent browser profile via `GameAccountPanel`

### Couple Trivia
- 10 questions, unlocks on wedding day
- Static in `trivia-questions.ts`; future CRUD via `trivia_questions` Supabase table (migration pending)

### Mini Crossword
- 194 daily puzzles covering March 17 – September 26, 2026
- Unlocks one week before the wedding
- Each puzzle is a 5×5 grid using 4 templates (A/B/C/D) with black squares
- Words are 3–5 letters, wedding/couple-themed when possible, common English words otherwise
- **Timer with start overlay and pause button**
- **Auto-check toggle** — optional real-time letter feedback
- Score submission to leaderboard on solve

#### Crossword generator (`scripts/generate-crosswords.mjs`)
- Runs with `node scripts/generate-crosswords.mjs > /tmp/puzzles-out.txt`
- Outputs TypeScript to paste into `crossword.ts` replacing `RAW_PUZZLES`
- Word pool: WORD_CLUES (470 themed) + FILL_CLUES (~1100 curated) + EXTRA_FILL (~280 additional) + system dict (~5000+ filtered)
- System dict filter: lowercase-only (no proper nouns), ≥1 vowel, no 3+ consonant runs, not in BLOCKED_WORDS
- 3-tier solver: tier1=wedding words, tier2=all curated words, tier3=system dict — front-loaded per slot
- 14-puzzle word reuse cooldown
- **⚠️ Clue quality issue (Session 22):** Some system dict words fall through to generic clues ("English word", "Four-letter word"). Fix in progress — see Session 22 notes.

---

## 🌿 Branch / Worktree State

| Branch | Location | Status |
|---|---|---|
| `main` | `/Users/jeffpaine/Documents/Antigravity/ThePaineWedding/` | Production — deployed to Vercel |
| `claude/dazzling-wozniak` | `.claude/worktrees/dazzling-wozniak/` | Active dev worktree |

---

## ✅ WHAT HAS BEEN BUILT (Completed)

### Infrastructure
- [x] Next.js 16 App Router project scaffolded and deployed to Vercel
- [x] Supabase connected with full schema
- [x] 178 guests / 85 households seeded (Round 1 — live)
- [x] `src/lib/wedding-data.ts` — central content config
- [x] `src/lib/site-settings.ts` — server-side Supabase override layer
- [x] `game_players` + `game_scores` tables migrated and applied

### Pages (all live)
- [x] Homepage / hero — with Registry CTA section and Quick Details grid with personality copy
- [x] Our Story — alternating timeline with real photos and descriptions
- [x] Wedding Details — venue, map embed, schedule, Urban Crust Food & Drinks card
- [x] Schedule — day-of timeline with per-item scroll reveal
- [x] Bridal Party — real photos, placeholder copy
- [x] Travel — real hotel data, Google Maps embed, airport cards, DFW guide, McKinney guide
- [x] Registry — brand-colored Amazon + Target cards
- [x] FAQ — fully built, cards layout
- [x] Attire — tabbed Ladies/Gentlemen masonry moodboard
- [x] Games hub — three stacked cards (Painedle live, Crossword ~1wk before, Trivia day-of)
- [x] Painedle — live, 5-letter daily word game
- [x] Mini Crossword — 194 daily puzzles, timer with start overlay + pause, auto-check toggle, leaderboard submit
- [x] Couple Trivia — locked until wedding day
- [x] RSVP — 4-step wizard with progress bar and masonry photo backdrop
- [x] Admin Dashboard — RSVP metrics, sortable guest table, bulk importer, History tab (pending migration)
- [x] Games Admin — crossword preview, trivia bank, score logs, player directory
- [x] Security Admin — login tracking

### RSVP Flow
- [x] 4-step wizard: Find Invitation → Who's Coming → A Few More Things → All Set!
- [x] Levenshtein fuzzy search on both first AND last name
- [x] Per-guest dietary_restrictions (using `food_allergies` column — live)
- [x] Song request + advice
- [x] Append-only `rsvp_history` audit log (migration pending)
- [x] Returning visitor memory via localStorage — pre-fills step 4 on revisit
- [x] Make changes flow — re-fetches from DB and allows re-submit

### Admin
- [x] Server-side password auth
- [x] Sortable guest columns (grouped by household when sorting by household)
- [x] Extras tab: dietary_restrictions / food_allergies, song_request, advice — **shown inline within household grouping**
- [x] History tab (pending `rsvp_history` migration)
- [x] Bulk importer from Google Sheets paste
- [x] In-page visual edit mode (Master role only) via `AdminEditBar.tsx`

### Design
- [x] Elegant ampersand via `.font-amp` in Navbar + homepage hero
- [x] Hero focal point `center 25%`
- [x] A&J box monogram as favicon, A&J SVG in mobile navbar
- [x] `surface-panel` / `surface-inset` shared card styles
- [x] Active nav state styling (desktop + mobile)
- [x] Per-item scroll reveal on schedule timeline
- [x] RSVP masonry photo backdrop with slow drift

---

## ⏳ WHAT NEEDS REAL CONTENT

- [ ] Ceremony/cocktail/reception exact times (venue confirmed 5 PM ceremony start)
- [ ] Full day-of schedule with exact times
- [ ] Dress code copy (ladies + gentlemen)
- [ ] Parking and shuttle details
- [ ] Google Maps iframe embed `src` for Davis & Grey Farms
- [ ] Real bridal party names, roles, descriptions
- [ ] Favicon — Ashlyn is making a logo → replace `public/favicon.ico`
- [ ] OG image → `public/images/engagement/og-image.jpg`
- [ ] Honeymoon fund URL (if applicable)

---

## 🔜 FEATURES TO BUILD (Prioritized)

### High priority
- [ ] **Round 2 guest seed** — additional guests may need to be added
- [ ] **RSVP revisit flow** — returning visitors can make changes but the flow could be improved
- [ ] **FAQ accordion** — collapse/expand instead of all stacked
- [ ] **CSV export** in admin dashboard
- [ ] **RSVP deadline countdown** on RSVP page

### Medium priority
- [ ] **Countdown timer** on homepage
- [ ] **Custom 404 page**
- [ ] **OG / social meta tags** (needs real OG image)
- [ ] **Supabase RLS** — enable Row Level Security on `guests`
- [ ] **Attire color swatches**
- [ ] **Accessibility audit**

---

## 🐛 KNOWN QUIRKS

- **Fonts:** `next/font/google`, CSS vars in `@layer utilities` (not `@theme`) — intentional Tailwind v4 workaround
- **Supabase anon key:** Readable in client bundle — RLS should be enabled
- **`food_allergies` vs `dietary_restrictions`:** RSVP saves to `food_allergies` — the column used everywhere for dietary info. The `dietary_restrictions` column was never added and is not needed.
- **Painedle anchor:** `2026-03-08` = `sparkle`. Changing word bank order changes all future daily words.
- **Trivia questions are static:** Full CRUD requires `trivia_questions` migration to be applied.
- **Crossword generator:** `scripts/generate-crosswords.mjs` produces 194 puzzles. Output goes into `crossword.ts` as `RAW_PUZZLES`. Never hand-edit `crossword.ts` — re-run the generator instead.
- **Crossword clue quality:** Fully resolved as of Session 29. Generator uses curated-only pool; verifier confirms 0 generic clues, 0 uncued words.
- **Admin cookies:** Shared-domain `thepainewedding.com` scoped. After any auth change deploy, admin must log in fresh.
- **site-settings.ts:** Server-only. Without `SUPABASE_SERVICE_ROLE_KEY`, gracefully falls back to `wedding-data.ts`.

---

## 📋 SESSION LOG

### Sessions 1–3 (Feb–Mar 2026)
- Scaffolded full Next.js project, built all pages, RSVP flow, Admin, Supabase schema, deployed to Vercel

### Session 4 (Mar 7)
- Merged all worktree work into `main`; created `wedding-data.ts`; seeded 178 guests; deployed

### Session 5 (Mar 8)
- Fixed `/our-story` crash (StoryImage client component); created `AI_COLLAB.md`

### Session 6 (Mar 8)
- Added `/games` hub, Couple Trivia, Painedle with localStorage persistence

### Session 7 (Mar 8)
- Supabase `game_players` + `game_scores` tables; leaderboard submission; trivia lock + countdown

### Session 8 (Mar 8)
- Added Games to main nav; redesigned games pages; upgraded admin Games into real control panel with modals

### Session 9 (Mar 8)
- Expanded Painedle to 4/5/6/7-letter words; real-word validation API; persistent browser game profiles; split admin IA

### Session 10 (Mar 8)
- Fixed Painedle keyboard bug hijacking Backspace/letters in form fields

### Session 11 (Mar 8)
- Compact account summary bar for GameAccountPanel

### Session 12 (Mar 8)
- True sequential daily rotation for Painedle; expanded word bank to 310 words; runtime guardrails

### Session 13 (Mar 9)
- Planning session for Mini Crossword game

### Session 14 (Mar 10)
- Added Mini Crossword: `crossword.ts`, `/games/crossword`, `MiniCrosswordGame.tsx`, `CrosswordGate.tsx`; initial 8-word static puzzle; crossword admin in `GamesAdminPanel`

### Session 15 (Mar 10)
- Comprehensive AI_COLLAB.md update; confirmed Round 2 guest seed status; corrected color documentation

### Session 16 (Mar 12)
- Complete rebuild of `AdminEditBar.tsx`: inline text editing over live page regions, contextual image panels, crop tool as centered modal

### Session 16b (Mar 10 — Full Admin Edit Mode)
- `site-settings.ts` expanded with per-item overrides for story, FAQ, schedule, bridal party, registry, travel
- All page content tagged with `data-admin-key` attributes
- New client wrapper components: `StoryItem`, `AttireImage`, `PersonPortrait`

### Session 17 (Mar 15)
- RSVP fuzzy search upgrade (Levenshtein, both names, client-side)
- Per-guest dietary restrictions field
- Email notifications via Resend added (then removed in Session 18)
- Admin sortable guest table
- Wedding Details: Urban Crust food card
- Travel: full rewrite with real hotels, DFW guide
- Nav: mobile X button z-index fix
- Design: `.font-amp`, hero focal point fix
- DB migration: `dietary_restrictions` column (NOT YET APPLIED)

### Session 18 (Mar 15)
- Fixed admin logout bug (cookie deduplication via `headers.append`)
- RSVP 4-step wizard with `RSVPProgressBar`
- Removed Resend email notifications
- Fixed RSVP success screen

### Session 19 (Mar 15)
- `rsvp_history` migration (audit log)
- RSVP toggle deselect, dietary ✕ Remove, back from step 4, navy checkmark
- Returning visitor localStorage memory; Make changes flow
- Admin History tab

### Session 20 (Mar 15)
- Homepage: "Our Story" hero button, Registry CTA section, Quick Details personality copy
- Attire: white background, tighter padding
- Registry: brand-colored Amazon + Target cards
- Section component: added `"white"` background option
- GamesHubClient: removed jarring text drift animation

### Session 21 (Mar 15)
- Painedle locked to 5-letter words only; runtime guard throws on non-5-letter words
- `trivia_questions` Supabase table migration created (NOT YET APPLIED)
- `rsvp_history` migration recreated as `20260315030000_rsvp_history.sql` (NOT YET APPLIED)
- GameAccountPanel: removed verbose explanatory paragraph

### Session 22 (Mar 17)
- **Crossword clue quality fix (in progress)**
- Problem: Mini Crossword was showing clues like "dictionary word" / "English word" — obscure system dict words slipping into puzzles with no real clues
- Root cause 1: Many common English words (EAT, PAW, FEAR, HERO, LAMB, MELEE, EYRIE, etc.) were missing from FILL_CLUES
- Root cause 2: System dict contains thousands of obscure/foreign/archaic words (UTEES, USNEA, RAUPO, etc.) with no pattern-based clues
- Root cause 3: Curated pool needed A-Z validation (`/^[A-Z]+$/` check added to prevent hyphens/apostrophes crashing the letter-position index)
- Fixes applied to `scripts/generate-crosswords.mjs`:
  - Added `EXTRA_FILL` Batch 2: ~130 common words (EYRIE, MELEE, ANION, OPAL, SAGO, FEAR, HERO, LAMB, etc.) with real clues
  - Expanded `BLOCKED_WORDS`: ~400 obscure/foreign words blocked from pool
  - Added `/^[A-Z]+$/` validation when loading curated words into WORDS_BY_LEN
- Status: 194/194 puzzles still generating; generic clue rate dropped from original but still ~27% (522/1940 clue slots)
- **Next step:** Use ChatGPT to generate a larger batch of EXTRA_FILL entries + BLOCKED_WORDS additions, then paste into generator script, re-run, and update `crossword.ts`
- Also in this session:
  - Admin: guest table updated to show household grouping with song/advice/allergies inline; removed affiliation/side/likelihood columns
  - Crossword: added start overlay + pause button to timer
  - Crossword: fixed score submission, congrats screen, email copy, input behavior
  - Crossword: fixed letter visibility, added auto-check toggle
  - Registry: removed "Wishlist" eyebrow text from page header

### Session 23 (Mar 17)
- **Crossword generator hardening pass (still in progress)**
- Files touched:
  - `scripts/generate-crosswords.mjs`
  - `scripts/verify-crosswords.mjs`
  - `src/lib/games/crossword.ts`
- What changed:
  - Added a much larger `EXTRA_FILL` batch with many common 3/4/5-letter words and the requested clue coverage pass
  - Expanded the manual `BLOCKED_WORDS` list significantly
  - Added `AUTO_BLOCKED_WORDS` derived from leaked uncued words in generated puzzle output
  - Changed solver behavior so uncued system-dictionary words are only considered when a slot has zero explicitly-clued options
  - Added `scripts/verify-crosswords.mjs` to validate:
    - puzzle count
    - entry counts
    - intersection consistency
    - generic clue leakage
    - uncued word leakage
    - blocked-word hits
  - Regenerated `src/lib/games/crossword.ts`
- Verification status at end of session:
  - `npm run build` passes
  - generator still produces `194/194` puzzles
  - verifier reports:
    - `puzzleCount: 194`
    - `intersectionMismatchPuzzles: 0`
    - `blockedWordHits: 0`
    - `genericClues: 282`
    - `uncuedWords: 483`
- Interpretation:
  - The crossword bank is structurally valid now
  - The remaining problem is clue quality / rescue-fill leakage, not broken puzzle geometry
  - The pipeline is much better than before, but **not yet fully clean**
- Next AI should:
  1. run `node scripts/verify-crosswords.mjs`
  2. extract remaining uncued words from the current generated bank
  3. split them into:
     - acceptable/common words to add to `EXTRA_FILL`
     - obscure/foreign/archaic words to add to the blocklist
  4. regenerate `src/lib/games/crossword.ts`
  5. repeat until verifier reaches:
     - `genericClues: 0`
     - `uncuedWords: 0`

### Session 24 (Mar 17)
- **Crossword launch-clean pass completed**
- Final crossword files:
  - `scripts/generate-crosswords.mjs`
  - `scripts/verify-crosswords.mjs`
  - `src/lib/games/crossword.ts`
- Final generator behavior:
  - system dictionary fill is now intentionally disabled for shipped puzzle generation
  - generator runs from the curated clue pool only
  - clue quality is enforced by `scripts/verify-crosswords.mjs`
  - cooldown was relaxed to `0` to ensure the curated-only bank can still generate all 194 puzzles
  - generation is slower now, but clean and reliable
- Final verification result:
  - `puzzleCount: 194`
  - `genericClues: 0`
  - `uncuedWords: 0`
  - `blockedWordHits: 0`
  - `intersectionMismatchPuzzles: 0`
  - `wrongEntryCountPuzzles: 0`
- Build result:
  - `npm run build` passes after the final crossword update
- Operational note:
  - Regeneration now takes noticeably longer because the bank is curated-only, but the resulting crossword set is launch-ready
- If a future AI touches crossword generation:
  1. update curated clues in `generate-crosswords.mjs`
  2. regenerate `src/lib/games/crossword.ts`
  3. run `node scripts/verify-crosswords.mjs`
  4. do not ship if verifier is non-zero on generic or uncued words

### Session 25 (Mar 17)
- **Final readiness verification completed**
- Reason for this pass:
  - user asked to finish every remaining crossword requirement and leave the project in a documented ready-to-ship state
  - this pass re-ran the live checks after Session 24 instead of relying on earlier output
- Commands re-run:
  - `node scripts/verify-crosswords.mjs`
  - `npm run build`
- Current verification result:
  - `puzzleCount: 194`
  - `explicitClueWords: 2822`
  - `blockedWordCount: 1470`
  - `genericClues: 0`
  - `uncuedWords: 0`
  - `blockedWordHits: 0`
  - `intersectionMismatchPuzzles: 0`
  - `wrongEntryCountPuzzles: 0`
- Current build result:
  - `npm run build` passes cleanly
- Ship status:
  - crossword content quality is clean
  - crossword structure is clean
  - generated crossword bank is present in `src/lib/games/crossword.ts`
  - no additional crossword cleanup work is required for launch
- Future maintenance plan:
  1. treat `scripts/generate-crosswords.mjs` as the source of truth
  2. only regenerate `src/lib/games/crossword.ts` from the script
  3. always run `node scripts/verify-crosswords.mjs` after any clue-bank edit
  4. only ship crossword changes when verifier stays at zero for generic clues, uncued words, blocked hits, and mismatches

### Session 26 (Mar 17)
- **Production deployment completed for crossword cleanup**
- Why this was needed:
  - user reported the live site still showed old generic crossword clues after the local cleanup work was finished
- Deployment action:
  - ran `vercel --prod --yes`
  - production deployment created:
    - `https://the-paine-wedding-p0ktnr8p6-jeffreyraypaine-7939s-projects.vercel.app`
  - Vercel aliased production to:
    - `https://www.thepainewedding.com`
- Post-deploy live check:
  - fetched `https://thepainewedding.com/games/crossword`
  - confirmed the live page response no longer exposed the old generic clue strings that were present before the deployment
- Interpretation:
  - if a browser still shows the old crossword clues after this point, treat it first as stale client/browser cache and hard-refresh before debugging code

### Session 28 (Mar 22)
- **Crossword admin panel redesign + word/clue export utility**
- User feedback: the crossword preview modal was "old style and so much bigger than it needs to be"
- Files changed:
  - `src/components/admin/GamesAdminPanel.tsx`
  - `scripts/export-crossword-words.mjs` (new — one-time utility)
- Admin panel change:
  - removed the three large `OverviewMetric` cards at the top; replaced with a compact inline status bar (pill + key + clue count)
  - replaced the full-width board preview + side-by-side oversized clue cards with a 2-col layout matching the front-end design language
  - board: same dark-blue gradient, same cell style (`rounded-[0.4rem] border-white/20 bg-white/80`), fills left column
  - clue cards: `rounded-xl bg-[#f9f6f1] px-3 py-2.5`, answer label in `text-accent` (gold), clue text below — matches game UI
  - overall footprint is roughly half the vertical space of the old design
- Word/clue export script:
  - `node scripts/export-crossword-words.mjs` → prints JSON array of `{word, clue}` pairs sorted alphabetically
  - useful for passing to ChatGPT to review/improve clue quality
  - extracts from `src/lib/games/crossword.ts` RAW_PUZZLES using regex
- SOP reminder captured: always deploy after code changes, always update AI_COLLAB.md
- Verification:
  - `npx tsc --noEmit` passes
  - tested in browser — compact layout renders correctly at desktop width
  - deployed to production with `vercel --prod --yes`
  - production alias updated to `https://www.thepainewedding.com`

### Session 27 (Mar 18)
- **Crossword interaction + leaderboard reliability pass completed**
- User-reported issues:
  - typing on iPhone felt sticky because replacing an existing letter often required tapping backspace first
  - cursor movement did not skip past already-filled crossing letters during entry
  - crossword completion flow said `Could not submit score right now.`
- Files changed:
  - `src/components/games/MiniCrosswordGame.tsx`
  - `src/components/games/ScoreSubmissionForm.tsx`
  - `supabase/migrations/20260318010000_allow_crossword_scores.sql`
- Gameplay fixes shipped:
  - typing a new letter now replaces the current letter directly
  - programmatic focus now selects the whole cell value so overwrite-on-type works better on mobile
  - entry advance now skips over already-filled cells in the active answer instead of getting hung up on them
  - manual edits still work by tapping a filled square and typing a replacement
- Leaderboard fix shipped:
  - found a schema mismatch: application code allowed `crossword`, but the `game_scores` database check constraint still allowed only `trivia` and `painedle`
  - added and pushed a Supabase migration to update the `game_scores` constraint to allow `crossword`
  - error handling in `ScoreSubmissionForm` now shows the real server message instead of always collapsing to a generic failure string
- Verification:
  - `npm run build` passes
  - `supabase db push` completed successfully for `20260318010000_allow_crossword_scores.sql`
  - deployed to production with `vercel --prod --yes`
  - production alias updated to `https://www.thepainewedding.com`

### Session 29 (Mar 29 — Claude)
- **Crossword clue quality overhaul (completed)**
- Context: ChatGPT provided analysis of bad fill (AEGIS, AERIE, ALAR, ALEE, ARS, EYRIE, ODEON, OGEE, SAPA, YAR, BEGAT) and inappropriate words (ABUSE, ARSON, BULLY, DRUNK, GRAVE, HATE, IDIOT, VENOM) plus a ~300-word curated clue bank
- Files changed:
  - `scripts/generate-crosswords.mjs`
  - `src/lib/games/crossword.ts` (regenerated)
- Changes to generator:
  - Added all bad-fill and inappropriate words to `BLOCKED_WORDS`
  - Merged ChatGPT's ~300 improved clues into `FILL_CLUES` and `WORD_CLUES`
  - Regenerated all 194 puzzles
- Final verifier result: `genericClues: 0`, `uncuedWords: 0`, `blockedWordHits: 0`, `intersectionMismatchPuzzles: 0`
- Deployed to production

### Session 30 (Mar 29 — Codex)
- **Major site redesign**
- Codex performed a large visual/UX overhaul of the public site
- Key changes included (not exhaustive — check git log for full diff):
  - RSVP page redesigned with full-screen backdrop (masonry photo grid with dark overlay), centered card wizard
  - New multi-step progress bar UI: circular step indicators with checkmarks, connecting line
  - `RSVPPageClient.tsx` extracted from `rsvp/page.tsx` as a client component
  - New `src/app/api/rsvp/viewed/route.ts` — tracks when guests open the RSVP form
  - New `src/app/api/rsvp/household/route.ts` — fetches household data for returning visitors
  - Rate limiting system added: `src/lib/server/request-security.ts` + `consume_rate_limit` Supabase RPC
  - RSVP access tokens: `src/lib/rsvp/access-token.ts` — HMAC-signed tokens for secure RSVP session
  - Name matching library: `src/lib/rsvp/name-matching.ts` — fuzzy search logic extracted
  - New Supabase migrations applied:
    - `20260325090000_enable_rls_on_wedding_tables.sql`
    - `20260325093000_harden_functions_and_site_settings_policy.sql`
    - `20260329000100_rsvp_history_events.sql` — adds `event_type`, `actor_guest_id`, `event_group_id` to `rsvp_history`
    - `20260329010000_request_hardening.sql` — adds `api_rate_limits` table, `consume_rate_limit()` RPC, `updated_at` + trigger on `guests` and `households`
  - All migrations confirmed applied: `supabase db push --dry-run` → "Remote database is up to date"

### Session 31 (Mar 29 — Claude)
- **RSVP submit bug fix (critical)**
- Symptom: guests hitting "Something went wrong while saving your RSVP. Please try again." on step 3 (A Few More Things)
- Root cause:
  1. When a guest confirmed their identity ("That's Me"), `handleConfirm` fire-and-forgot a call to `/api/rsvp/viewed`
  2. The `viewed` endpoint updated `viewed_rsvp = true` on all household guests via `sb.update()`
  3. This triggered the `guests_updated_at` BEFORE UPDATE trigger, bumping `updated_at` to `now()` for every guest
  4. The submit route then compared `body.versions[guestId]` (old `updated_at` from search) against `guest.updated_at` (now newer) → version conflict → 409 → generic catch message
- Files changed:
  - `src/app/api/rsvp/viewed/route.ts` — after updating guests, queries and returns fresh `updated_at` values as `versions`
  - `src/app/(main)/rsvp/RSVPPageClient.tsx`:
    - `handleConfirm` now awaits the `viewed` call and syncs `guestVersions` with returned fresh timestamps
    - `handleMakeChanges` likewise awaits and syncs
    - submit catch block now surfaces the actual server error message instead of always showing generic text
- Deployed to production with `vercel --prod --yes`
- All migrations already applied — DB was fully up to date

---

## 📋 CODEX WORK ORDER (Session 32)

> **This section is a precise task list for Codex to execute.** Claude will verify correctness afterward — do not cut corners. Each task includes the exact files to touch and the precise behavior expected.

---

### ✅ TASK 1 — Fix guest name "Cailey Taylor" → "Kailey Taylor" in DB

**Why:** The guest list has a misspelling.

**What to do:**
1. Run this SQL against the production Supabase DB (`khqmbphkdmexkknzvtgb`):
   ```sql
   UPDATE guests SET first_name = 'Kailey' WHERE first_name = 'Cailey' AND last_name = 'Taylor';
   ```
2. Also update `supabase/seed_guest_list.sql` line 700: change `'Cailey'` → `'Kailey'`

---

### ✅ TASK 2 — RSVP disambiguation: show suffix in name display

**Why:** If two people share a name (e.g., John Paine Sr. and John Paine Jr.), the picker cards need to show the suffix to distinguish them.

**Files:** `src/app/api/rsvp/search/route.ts`

**What to do:**
- The `SearchableGuest` type currently fetches: `id, household_id, first_name, last_name, nicknames, is_plus_one`
- Add `suffix` to the select: `id, household_id, first_name, last_name, suffix, nicknames, is_plus_one`
- Add `suffix: string | null` to the `SearchableGuest` type
- When building `matchedName` for each choice, include suffix if present:
  ```ts
  const suffix = guest.suffix ? ` ${guest.suffix}` : '';
  matchedName: `${guest.first_name} ${guest.last_name}${suffix}`
  ```
- Apply this in BOTH the exact-match disambiguation block AND the single-match return at the bottom of the route (so suffix always appears in confirmation cards)
- Also update the `householdLabel` for plus-one members in `householdGuests` filtering to include suffix if present

---

### ✅ TASK 3 — Admin stats bar: 2×2 grid → compact 4×1 row

**Why:** The four stats cards (Total Invited, Attending, Declined, Awaiting) take up too much space in a 2×2 grid.

**Files:** `src/app/(main)/admin/page.tsx`

**What to do:**
- Find the stats section (contains "Total Invited", "Attending", "Declined", "Awaiting")
- Change from a 2-column grid to a single flex row: `flex flex-row gap-2` or `grid grid-cols-4 gap-2`
- Reduce font sizes significantly — the numbers should be compact, not large hero text
- Each stat card should be narrow, using small labels and medium numbers
- Make sure this still looks good on mobile (can scroll horizontally or stack 2×2 on very small screens if needed, but should be much more compact than the current large cards)

---

### ✅ TASK 4 — Admin table header: mobile overflow fix

**Why:** The table header bar (sort buttons, search, filters) overflows horizontally on mobile and looks broken.

**Files:** `src/app/(main)/admin/page.tsx`

**What to do:**
- The action bar above the guest table (sort controls, search input, any filter buttons) should collapse gracefully on mobile
- On mobile (`< md`), replace text labels in buttons with icons only (use Lucide icons already imported)
- Ensure the table itself has horizontal scroll (`overflow-x-auto`) rather than overflowing the page
- The column headers in the table should be abbreviated or hidden on mobile (show only Name and RSVP status on smallest screens)
- Test at 375px width — nothing should extend beyond the viewport

---

### ✅ TASK 5 — Share score button on all three games

**Why:** Users want to share their score like NYT games.

**Files:**
- `src/components/games/PainedleGame.tsx`
- `src/components/games/MiniCrosswordGame.tsx`
- `src/components/games/CoupleTriviaGame.tsx`

**What to do — Painedle:**
- After the game ends (win or lose), show a "Share" button below the score
- Generate a shareable text block:
  ```
  Painedle #[puzzle number] [X/6 or 6/6]

  🟩⬛🟨⬛🟩
  ⬛🟩🟩⬛⬛
  🟩🟩🟩🟩🟩

  thepainewedding.com/games/painedle
  ```
  - Green square = correct position
  - Yellow square = wrong position
  - Black square = not in word
- Use `navigator.clipboard.writeText()` with a fallback, then show a brief "Copied!" toast

**What to do — Mini Crossword:**
- After the puzzle is solved, show a "Share" button
- Generate:
  ```
  The Paine Wedding Mini Crossword [date]
  Solved in [X:XX] ⏱

  thepainewedding.com/games/crossword
  ```
- Simple — no grid emoji needed for crossword

**What to do — Trivia:**
- After submitting score, show a "Share" button
- Generate:
  ```
  The Paine Wedding Trivia
  [X]/[Y] correct 🎉

  thepainewedding.com/games/trivia
  ```

**All three:** Use `navigator.share()` if available (mobile native sheet), fall back to `navigator.clipboard.writeText()` on desktop. Show a "Copied!" confirmation briefly.

---

### ✅ TASK 6 — Painedle: auto-submit score on game end

**Why:** Currently players must manually click "Submit Score" — it should happen automatically.

**Files:** `src/components/games/PainedleGame.tsx`, `src/components/games/ScoreSubmissionForm.tsx`

**What to do:**
- When the game ends (player wins OR uses all 6 guesses), automatically submit the score if the player has a stored account (email/username in localStorage via `GameAccountPanel`)
- If no account is stored, still show the `ScoreSubmissionForm` for them to enter their info
- If auto-submit succeeds, show a brief success message instead of the full form
- If auto-submit fails, gracefully fall back to showing the form
- The `ScoreSubmissionForm` currently handles submission — extract the submission logic into a shared helper or call the API directly from `PainedleGame` when account info is available

---

### ✅ TASK 7 — Mini Crossword: fix click mechanics

**Why:** Clicking a cell has two bugs: (1) it sometimes switches to vertical entry when it should stay horizontal, (2) the page scrolls slightly on each click.

**Files:** `src/components/games/MiniCrosswordGame.tsx`

**NYT behavior to replicate:**
- If you click a cell that is NOT the currently selected cell → move to that cell, keep the current direction IF the new cell belongs to both an across and down entry; otherwise switch to whichever entry the new cell belongs to
- If you click the SAME cell that is already selected → toggle between across and down
- Clicking should NEVER scroll the page — add `e.preventDefault()` on all `onClick` handlers for grid cells

**Scroll fix:**
- All `<button>` or `<div onClick>` elements in the grid must call `e.preventDefault()` and `e.stopPropagation()` to prevent scroll jump
- Consider using `onPointerDown` instead of `onClick` with `e.preventDefault()` to catch scroll at the right event

---

### ✅ TASK 8 — Mini Crossword: mobile layout fixes

**Why:** The header overlaps the timer on mobile, and the Clear button falls off the page.

**Files:** `src/components/games/MiniCrosswordGame.tsx`

**Header / timer overlap fix:**
- On mobile, the game header (title + timer row + button row) is too wide
- The timer and Pause/Autocheck/Reveal/Clear buttons need to wrap or compress on small screens
- Use `flex-wrap` on the button row, or split into two rows on mobile: top row = title + timer, bottom row = buttons
- Ensure nothing clips or overlaps at 375px

**Clear button fix:**
- The Clear button is falling off the right edge of the screen on mobile
- The action button row needs `flex-wrap: wrap` or the buttons need to shrink with `text-sm` on mobile
- All four buttons (Pause, Autocheck, Reveal, Clear) must be visible and tappable on mobile without horizontal scroll

---

### ✅ TASK 9 — Mini Crossword: auto-complete celebration overlay + auto-submit

**Why:** Players currently have to scroll down to see a completion message and click "Submit Score." The completion experience should be instant and zero-scroll.

**Files:** `src/components/games/MiniCrosswordGame.tsx`

**What to do:**
- When all squares are filled correctly:
  1. Automatically submit the score (same logic as TASK 6 — check for stored account, submit, fall back to form if needed)
  2. Show a celebration overlay on top of the game board — SAME style as the start overlay (blurred backdrop over the grid, centered card with message)
  3. The celebration overlay should show:
     - A congratulations headline
     - Their solve time
     - A "Share" button (from TASK 5)
     - A "Submit Score" form if auto-submit failed OR if no account stored
  4. Scrolling to a bottom section should NOT be required — everything happens in the overlay

**Start overlay reference:** The existing start overlay (`showStartOverlay` state) uses a blurred overlay over the grid area. Replicate that exact visual pattern for the completion overlay.

---

### ✅ TASK 10 — Trivia: UI fix for True/False questions (phantom C/D options)

**Why:** T/F questions have `answer_c = "—"` and `answer_d = "—"` in the DB. The game currently shows all 4 answer buttons even when C and D are blank placeholders, creating phantom empty options.

**Files:** `src/components/games/CoupleTriviaGame.tsx`

**What to do:**
- Before rendering answer buttons, filter the answers array to remove any that are `"—"`, `""`, or `null`
- Only render as many buttons as there are real answers
- A/B/C/D labels should map to the rendered index (so a T/F question shows just "A. True" and "B. False")
- This fix must also handle the post-answer state — when the game shows which answer was correct after a T/F question, it must not add phantom C/D buttons back

---

### ✅ TASK 11 — Trivia: overhaul the question set (DB changes)

**Why:** 50 questions is too many; there are redundancies, wrong answers, and too many questions about the 2024 reconnection.

**The live questions are in the `trivia_questions` Supabase table (not the static file).** Update via SQL migration or admin panel.

**Target: 20–25 active questions total.**

**Questions to ARCHIVE (set `archived = true`) — remove these from the active set:**
- Q7: "About how long did Jeff and Ashlyn go without seeing each other" — redundant with Q8/Q9 context
- Q11: "During the season...how often were they checking in" — vague and overly specific
- Q13: "What happened when Jeff first asked Ashlyn to hang out again" — covered by Q14
- Q15: "After Ashlyn turned Jeff down...what did Ashlyn do next" — overly granular
- Q17: "What city did Jeff drive to" — this is just Houston, covered by Q16's drive context
- Q19: "How did Jeff and Ashlyn describe the first time they hung out again" — too soft
- Q20: "When did Jeff and Ashlyn realize their first reconnection hangout had turned into a real first date" — overly granular
- Q23: "What has been a normal rhythm of their long distance relationship" — visiting every other week is wrong/debatable
- Q24: "Which description sounds most like their long distance" — too vague
- Q32: "Which phrase has real significance" — "put your thing down" is unexplained
- Q33: "What love language detail especially matters" — specific claim may be inaccurate
- Q34: "Which quality is most true of how Jeff tries to love Ashlyn" — awkward phrasing
- Q35: "What kind of stories and entertainment does Jeff tend to love" — too niche
- Q36: "Which author fits Jeff's reading taste" — too niche
- Q37: "Which of these books is one Jeff has especially enjoyed" — too niche
- Q38: "Which drink choice is the most Jeff coded" — may be inaccurate
- Q39: "Which bourbon is one Jeff especially likes" — Four Roses claim needs verification; archive if unsure
- Q40: "Which creative field best describes Jeff" — OK, but borderline
- Q41: "What kind of projects does Jeff naturally get excited about" — screen printing claim needs verification

**Questions to FIX (update in DB):**

**Q26 — Fix the correct answer:**
- Prompt: "Which food related activity fits Jeff and Ashlyn best?"
- Current correct answer: index 3 = "Hunting for the best tacos in every city"
- **Correct answer should be index 0** = "Trying new pizza places" (their caterer is Urban Crust pizza and they love finding new pizza spots)
- Update: `UPDATE trivia_questions SET correct_index = 0 WHERE sort_order = 26;`

**Q28 — Fix the correct answer:**
- Prompt: "What movie is listed as Jeff and Ashlyn's favorite movie together?"
- Current answers: A=Interstellar, B=Inception, C=The Prestige, D=La La Land
- Current correct_index = 3 (La La Land) — **THIS IS WRONG**
- The original verified answer was **Inception** (correct_index = 1)
- Update: `UPDATE trivia_questions SET correct_index = 1 WHERE sort_order = 28;`

**Q18 — Review:**
- Prompt: "Where did Jeff take Ashlyn when they finally hung out again during their reconnection in 2024?"
- Answer: 60 Vines (correct_index = 0) — this appears correct per story context
- **No change needed** unless Jeff confirms otherwise

**Rename pronoun usage in remaining questions:**
- Any question that says "him," "her," "they," "their" without first establishing Jeff and Ashlyn's names should be rewritten to use "Jeff" and "Ashlyn" by name — use the `fun_fact` field and prompts that always name both people
- Go through each remaining (non-archived) question and ensure "Jeff" and "Ashlyn" appear by name rather than just "they" or "their" in isolation

**After archiving and fixing, re-number `sort_order` values** to be sequential 1–N with no gaps.

---

### ✅ TASK 12 — Trivia: remove review page, auto-submit score on last question

**Why:** After answering the last question, a review/summary page appears and users must scroll down to submit. This should be automatic.

**Files:** `src/components/games/CoupleTriviaGame.tsx`

**What to do:**
- After the player answers the final question:
  1. Automatically submit the score (check for stored account, same pattern as TASK 6/9)
  2. Immediately show the results screen (score, share button)
  3. Do NOT show a separate review/question-list page before the results screen
- A "Submit Score" button should still exist on the results screen as a fallback if auto-submit failed
- The results screen should be visible without any scrolling

---

### ✅ TASK 13 — Fix "weird UI when returning to site" (state/cache issue)

**Why:** When a user closes and reopens the site on mobile, the page looks broken or shows a stale state.

**What this likely is:** Either a Next.js router cache issue, a bad localStorage state that causes hydration mismatch, or the RSVP page trying to restore from localStorage into an inconsistent state.

**Investigation steps:**
1. Check if the issue is on the RSVP page specifically (localStorage rsvp_submitted) or site-wide
2. On the RSVP page, if `rsvp_submitted` in localStorage has an expired access token, the page might try to show step 4 but then fail silently — add a try/catch that clears localStorage and resets to step 1 if the stored token is stale
3. For games: check if `localStorage` game state (Painedle, crossword) has a `dateKey` mismatch — if the stored puzzle key doesn't match today, it should reset cleanly rather than showing a broken board
4. Add `router.refresh()` or ensure pages use `export const dynamic = 'force-dynamic'` to prevent stale RSC cache
5. Test by hard-closing the browser and reopening to `/rsvp` and to `/games/painedle`

---

### 📋 VERIFICATION CHECKLIST (for Claude to check after Codex runs)

After Codex completes the above tasks, Claude will verify:

- [ ] "Kailey Taylor" shows correctly in admin guest list
- [ ] RSVP disambiguation shows suffix in name cards
- [ ] Admin stats are in a compact single row, not 2×2
- [ ] Admin table header doesn't overflow on 375px width
- [ ] Share button works on Painedle (copies correct emoji grid)
- [ ] Share button works on Crossword (copies time + link)
- [ ] Share button works on Trivia (copies score + link)
- [ ] Painedle auto-submits score when game ends (with stored account)
- [ ] Crossword auto-submits score when completed (no scrolling needed)
- [ ] Trivia auto-submits score on last answer (no review page)
- [ ] Crossword grid click: same cell toggles direction, different cell keeps direction
- [ ] Crossword grid click: no page scroll
- [ ] Crossword header + timer + buttons all fit on 375px mobile without clipping
- [ ] Crossword completion shows overlay (same style as start overlay), not a below-the-fold section
- [ ] Trivia T/F questions show only 2 answer buttons, not 4
- [ ] Trivia Q26 correct answer is "Trying new pizza places"
- [ ] Trivia Q28 correct answer is "Inception"
- [ ] Trivia active question count is 20–25 (archived the rest)
- [ ] TypeScript check passes: `npx tsc --noEmit`
- [ ] Production deployment succeeds: `vercel --prod --yes`

---

### Session 32 (Mar 29 — Claude)
**Completed all Codex-missed items from the Session 32 work order:**

- **PainedleGame.tsx post-game JSX** — wired up share button + `autoSubmitStatus` display. Shows "Score Submitted ✓" if auto-submit succeeded, fallback `ScoreSubmissionForm` if not, and always shows "Share Result" button above. Logic was already added last session; this session finished the render section.
- **CoupleTriviaGame.tsx** — complete rewrite:
  - Added auto-submit useEffect: triggers when `screen === "results"`, checks `getStoredGamePlayer()`, calls `submitGameScore()` with `username`/`email` fields spread from player object
  - Added share button on results screen using `navigator.share()` / clipboard fallback with "✓ Copied!" feedback
  - Removed question review list from results screen (was showing all Q&A pairs — removed entirely per spec)
  - Fixed T/F phantom C/D: `visibleAnswers` filters out `answer.trim() === "—"` before rendering answer buttons; `LETTERS[index]` still uses original DB index for label
- **MiniCrosswordGame.tsx**:
  - Added auto-submit useEffect: triggers when `solved` becomes true, checks for stored player, calls `submitGameScore()`, sets `scoreSubmitted` on success
  - Added share button in completion section ("Share Result" above score submission)
  - `autoSubmitStatus` drives display: "submitting" → spinner text, "success" → green "Score Locked In" card (same as `scoreSubmitted`), fallback → `ScoreSubmissionForm`
- **supabase/seed_guest_list.sql** line 700: `'Cailey'` → `'Kailey'` (DB was already fixed in Session 31 via REST API)
- `npx tsc --noEmit` → Exit 0 (clean)
- `vercel --prod --yes` → deployed to `https://www.thepainewedding.com`

**Still pending from the Codex work order (not fixed this session):**
- TASK 3: Admin stats 2×2 → compact 4×1 row ← fixed in Session 33
- TASK 4: Admin table header mobile overflow ← fixed in Session 33
- TASK 7: Crossword grid click direction toggle / scroll prevention
- TASK 8: Crossword mobile layout (header/timer overlap, Clear button overflow)
- TASK 9: Crossword completion overlay (currently still renders below the fold, not as an overlay)
- TASK 13: Weird UI on site return (cache/localStorage stale state)

---

### Session 33 (Mar 29 — Claude)
**Admin dashboard mobile layout fixes (TASKS 3 + 4 from the Codex work order):**

- **Stats grid** (`src/app/(main)/admin/page.tsx`): Changed from `grid-cols-2 gap-3 md:grid-cols-4` → `grid-cols-4 gap-2` always. Cards are now compact at all screen sizes (`rounded-[1.2rem]`, `px-2 py-3`, `text-[9px]` label, `text-xl` value on mobile). All four stats (Total Invited, Attending, Declined, Pending) fit in a single row even at 375px.
- **Tab/action bar** (same file): Restructured from a single overflowing flex row into two stacked rows:
  - Row 1: GUESTS / HISTORY tabs only (`flex items-center gap-6`)
  - Row 2: all action buttons (`flex flex-wrap gap-2`) — Add Guest, By Household, Export CSV, Search, Edit — wrap naturally instead of overflowing off-screen
  - Shortened two labels: "Close Add Guest" → "Close", "Group by Household" → "By Household"
- `npx tsc --noEmit` → Exit 0
- `vercel --prod --yes` → deployed to `https://www.thepainewedding.com`

**Still pending:**
- TASK 7: Crossword grid click direction toggle / scroll prevention ← partially fixed in Session 34 (scroll fixed; direction toggle already worked)
- TASK 8: Crossword mobile layout (header/timer overlap, Clear button overflow)
- TASK 9: Crossword completion overlay (still renders below the fold, not as an overlay)
- TASK 13: Weird UI on site return (cache/localStorage stale state)

---

### Session 34 (Apr 3 — Claude)
**Crossword mobile scroll jump fix (`src/components/games/MiniCrosswordGame.tsx`):**

Root cause: Three scroll events fired per keystroke on mobile —
1. `input.focus()` → browser auto-scrolls to the newly focused cell
2. `scheduleMobileViewportAdjustment()` inside `focusAndSelectCell` → `window.scrollBy()` 90ms later
3. `handleCellFocus` fires (focus event) → `scheduleMobileViewportAdjustment()` again

Fix:
- Added `programmaticFocusRef = useRef(false)` to track when focus is triggered by code (typing advance) vs. a real user tap
- In `focusCell` and `focusAndSelectCell`: set `programmaticFocusRef.current = true` before focusing, add `{ preventScroll: true }` to all `focus()` calls, removed the `scheduleMobileViewportAdjustment()` calls from these functions
- In `handleCellFocus`: reads and resets the ref; only runs `scheduleMobileViewportAdjustment()` when the focus came from a real user tap (`!wasProgrammatic`)

Result: typing a letter advances to the next cell with zero scroll. Tapping a cell for the first time still triggers the viewport adjustment to position the clue bar correctly.

Also in Session 34:
- Crossword: iOS "Paste/Select/Select All" popup fixed (`onContextMenu`, `onSelect` prevention, `-webkit-touch-callout:none`, `select-none`)
- Crossword: Direction toggle moved from `handleCellClick` to `handleCellPointerDown` (reliable on iOS)
- Crossword: Advance-to-next-box now walks forward through `tabOrder` skipping fully-filled entries
- Crossword: "Hold to view board" → simple "View Board" tap + "← Back to Results" button in header

- `npx tsc --noEmit` → Exit 0
- `vercel --prod --yes` → deployed to `https://www.thepainewedding.com`

---

## 📋 SONNET WORK ORDER — Admin Mobile Table Redesign (Session 35)

> **This is a task list for Sonnet to implement.** Claude has researched the codebase and planned every detail below. Follow the plan precisely. Do NOT remove, break, or alter any existing desktop behavior or table features.

### Overview

The admin dashboard tables (Guests + History) are unusable on mobile — columns are crammed into 375px, text wraps to one character per line. The fix: add a toggle that lets the admin switch between two mobile views:

1. **Sticky Column** — The table stays as a table, but the name column is frozen/sticky on the left. Rest scrolls horizontally. A "← Swipe →" hint shown.
2. **Accordion** — Each row becomes a card. Name + primary info (RSVP badge) always visible. Tap to expand and see all detail fields.

The toggle is **mobile-only** (below `md` breakpoint / 768px). Desktop tables are completely unchanged.

### File

`src/app/(main)/admin/page.tsx` (~2240 lines)

---

### STEP 1 — Add types and state

Add near the existing type definitions (around line 33):

```ts
type MobileViewMode = "sticky" | "accordion";
```

Add in the component body (around line 320 near other `useState` calls):

```ts
const [guestMobileView, setGuestMobileView] = useState<MobileViewMode>("accordion");
const [historyMobileView, setHistoryMobileView] = useState<MobileViewMode>("accordion");
const [expandedGuestAccordionIds, setExpandedGuestAccordionIds] = useState<Set<string>>(new Set());
```

Default to `"accordion"` since it's the better mobile experience.

---

### STEP 2 — Add toggle buttons to the mobile toolbar

The mobile action icons are in a `md:hidden` grid (around line 1355). There are currently:
- **Guests tab**: 5 icon buttons (Add, Household, Export, Search, Edit)
- **History tab**: 2 icon buttons (Export, Search)

**For each tab**, add a view-mode toggle. This should be a **segmented pair of small icons** (table icon + list icon) that fits in one grid cell. Add it as the LAST button in each tab's row.

Update the grid column counts:
- Guests: `repeat(5, ...)` → `repeat(6, ...)`
- History: `repeat(2, ...)` → `repeat(3, ...)`

The toggle button should show:
- Table/grid icon when in accordion mode (click to switch to sticky)
- List/card icon when in sticky mode (click to switch to accordion)

Use inline SVGs matching the existing icon style (12×12, stroke-based).

---

### STEP 3 — Modify the mobile column headers

The mobile column headers (around lines 1571–1601) are separate CSS grids in the sticky toolbar area. These should ONLY show in sticky column mode:

- Guests mobile headers: add condition `guestMobileView === "sticky" &&`
- History mobile headers: add condition `historyMobileView === "sticky" &&`

In accordion mode, these headers are irrelevant (there's no table).

---

### STEP 4 — Implement Sticky Column mode for Guests table

The guests table (around line 1713) is already inside an `overflow-x-auto` div. To make the first column sticky:

**On the `<table>` itself** (both `<thead>` and `<tbody>`):
- First `<th>` and first `<td>` in every row: add `sticky left-0 z-10` and an **opaque** background color matching the row type:
  - Normal rows: `bg-white`
  - Household header rows: use opaque equivalent of `bg-surface/40` → `bg-[#f5f1eb]`
  - Plus-one rows: use opaque equivalent of `bg-amber-50/20` → `bg-[#fefcf6]`
- Add `shadow-[2px_0_4px_-1px_rgba(0,0,0,0.06)]` to the sticky cells for visual separation
- Add `group` to each `<tr>` and `group-hover:bg-[#f9f5ef]` to the sticky `<td>` for consistent hover

**CRITICAL: Background transparency bug.** Semi-transparent backgrounds on sticky cells will show content scrolling underneath. You MUST use opaque color equivalents.

**Header alignment issue:** The mobile column headers are a SEPARATE grid in the sticky bar; the table scrolls independently below. When the user scrolls the table horizontally, the headers don't move with it. Fix: in sticky mode, USE the `<thead>` inside the `<table>` (there's one at ~line 1722 for mobile), make its first `<th>` also sticky, and hide the separate grid headers (already done in Step 3).

---

### STEP 5 — Implement Accordion mode for Guests table

When `guestMobileView === "accordion"`, render cards instead of the table on mobile. Wrap in `md:hidden`. Hide the existing table on mobile when accordion is active.

**Card structure — collapsed:**
```
┌──────────────────────────────┐
│ Guest Name          [Badge]  │
│ Household name       ▼       │
└──────────────────────────────┘
```

**Card structure — expanded:**
```
┌──────────────────────────────┐
│ Guest Name          [Badge]  │
│ Household name       ▲       │
├──────────────────────────────┤
│ ALLERGIES   None specified   │
│ SONG        UCLA             │
│ ADVICE      Love is an...    │
└──────────────────────────────┘
```

**Household grouping:** When `groupByHousehold` is true, render household name as a section header with aggregate RSVP badge, then individual guest cards beneath.

**Edit mode interactions — ALL MUST STILL WORK:**
- Clicking guest name → `setSelectedGuestId(guest.id)` (opens GuestEditDrawer)
- Clicking RSVP badge → `openRsvp(e, ...)` (opens rsvpPopover). Pass `e` for `DOMRect`.
- Clicking text cells (allergies/song/advice) in expanded view → `openTextEdit(e, ...)`. Same `DOMRect` principle.
- **IMPORTANT**: In edit mode, clicking badge/text should call the edit handler and `e.stopPropagation()` — NOT toggle expand. Toggle expand only on the card header area, not on interactive edit targets.

**Plus-one indicators:** Amber left border + "+1" badge on plus-one cards.

**Sorting:** Column headers are hidden in accordion. Add a compact sort pill above the cards: "Sort: Name ↑" that opens a small dropdown or cycles on tap. Reuse `handleSort(field)`.

**Expand state:** Track in `expandedGuestAccordionIds`. Toggle on card header tap.

---

### STEP 6 — Implement Sticky Column mode for History table

The mobile history view (~line 1893) is currently div-based (5-column CSS grid), NOT a `<table>`. When `historyMobileView === "sticky"`, convert to a `<table>` inside `overflow-x-auto` with sticky first column (When).

Columns: When, Guest, Household, Activity, Notes. Apply same sticky styling. Unread highlighting (`bg-blue-50/70 ring-1 ring-inset ring-blue-300`) still applies.

---

### STEP 7 — Implement Accordion mode for History table

When `historyMobileView === "accordion"`, render history entries as cards:

**Card — collapsed:**
```
┌──────────────────────────────┐
│ Apr 2, 7:47 PM    [Yes badge]│
│ Roman Richichi  +1           │
│ Changed RSVP · Updated Song  │
└──────────────────────────────┘
```

**Card — expanded:**
```
┌──────────────────────────────┐
│ (collapsed content)          │
├──────────────────────────────┤
│ HOUSEHOLD  The Richichi Family│
│ SONG       Son Bellion       │
│ ADVICE     Have a lot of sex.│
└──────────────────────────────┘
```

Reuse `expandedHistoryIds` state for expand/collapse. Unread highlighting applies to the card.

---

### STEP 8 — Ensure nothing breaks on desktop

ALL changes are gated behind `md:hidden`. Desktop rendering is completely untouched. Double-check:
- Desktop guests table renders exactly as before
- Desktop history table renders exactly as before
- All sort, search, filter, edit, export, add-guest features still work on desktop
- GuestEditDrawer still opens from both mobile accordion and desktop table

---

### Potential Bugs to Watch For

| Bug | Prevention |
|---|---|
| Sticky cell shows content scrolling underneath | Use OPAQUE backgrounds, never semi-transparent |
| Mobile headers out of sync with table scroll | In sticky mode, use `<thead>` inside the table, hide the separate grid |
| Edit popovers positioned wrong in accordion | They use `DOMRect` from click target — works automatically, just pass `e` correctly |
| Accordion expand triggers when clicking RSVP badge in edit mode | Check `editMode` — if true and clicking badge/text, call the edit handler and `e.stopPropagation()` instead of toggling expand |
| Sort broken in accordion mode | Add sort controls (pill/dropdown) since column headers are hidden |
| Search stops filtering | Search filters at the data level, not the rendering level — works automatically |
| Toggle resets scroll position | When switching views, scroll to the top of the table card |
| Dark mode colors wrong on sticky cells | Use Tailwind's `bg-white` which auto-resolves in dark mode; for opaque composites, provide `dark:bg-[...]` variants |
| Household group headers look like guest cards | Use visually distinct style: bold font, full-width, different background |
| Long advice text in accordion not truncated | In collapsed state, DON'T show advice. Only show in expanded state |

---

### Verification Checklist

- [ ] Toggle appears on mobile only (hidden on desktop)
- [ ] Default is accordion view
- [ ] Switching to sticky shows table with frozen name column + horizontal scroll
- [ ] Switching back to accordion shows cards
- [ ] Guests accordion: Name + RSVP visible collapsed, tap expands to show allergies/song/advice
- [ ] Guests accordion: Household grouping works (section headers)
- [ ] Guests accordion: Plus-one cards have amber indicator
- [ ] Guests accordion: Edit mode — name click opens drawer
- [ ] Guests accordion: Edit mode — RSVP badge click opens popover
- [ ] Guests accordion: Edit mode — text cell tap opens inline edit
- [ ] Guests sticky: First column stays in place during horizontal scroll
- [ ] Guests sticky: No transparency glitch on sticky cells
- [ ] History accordion: Date/guest/activity visible collapsed, tap for notes
- [ ] History accordion: Unread highlighting works
- [ ] History sticky: First column frozen
- [ ] Search works in both views (guests + history)
- [ ] Sort works in both views
- [ ] Add Guest form still accessible
- [ ] Export CSV still works
- [ ] Desktop tables completely unchanged
- [ ] TypeScript check passes: `npx tsc --noEmit`
- [ ] Production deployment succeeds: `vercel --prod --yes`
