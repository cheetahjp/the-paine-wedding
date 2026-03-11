# The Paine Wedding Website — Context for Claude

This document contains full context, architecture details, and design decisions for the wedding website of Ashlyn & Jeffrey (September 26, 2026, Celeste, Texas). It is tailored to give Claude full knowledge of the project's current state and technical implementation to seamlessly continue development.

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"` + `@theme` block in `globals.css`)
- **Database / Backend:** Supabase (PostgreSQL)
- **Deployment:** Vercel (GitHub → Vercel auto-deploy on push to `main`)
- **Fonts:** `Bodoni_Moda` (headings) and `Montserrat` (body) loaded via `next/font/google` in `src/app/layout.tsx`. They inject CSS custom properties (`--font-playfair`, `--font-inter`) onto the `<body>` element at runtime.
- **Images:** Standard `<img>` / CSS `background-image` for the hero. `next/image` used in other places with whitelisted `images.unsplash.com` domain in `next.config.ts`.

---

## Font Architecture (Tailwind v4 quirk)

Tailwind v4 processes `@theme` at **build time**. Putting `--font-heading: var(--font-playfair)` inside `@theme` creates a nested `var()` chain that silently fails at runtime (IACVT — invalid at computed value time), causing the browser to fall back to the system serif or sans-serif.

**Fix in place:** Font utilities are defined directly in `@layer utilities` in `globals.css`, bypassing `@theme` entirely:

```css
@layer utilities {
  .font-heading { font-family: var(--font-playfair), serif; }
  .font-body    { font-family: var(--font-inter), sans-serif; }
}
```

The `h1–h6` global rule also references `var(--font-playfair)` directly at `font-weight: 700`.

---

## Design System

**Vibe:** Minimal, elegant, romantic, editorial — "fine art wedding."

**Colors (defined in `globals.css` `@theme` block):**

| Token | Hex | Use |
|---|---|---|
| `--color-primary` | `#1A3F6F` | Lighter navy — buttons, links, accents |
| `--color-secondary` | `#7A1F24` | Burgundy — secondary accents |
| `--color-accent` | `#C69A72` | Tan / warm gold — highlights |
| `--color-base` | `#FFFFFF` | White — page background |
| `--color-surface` | `#F7F5F0` | Warm cream — card/section backgrounds |
| `--color-text-primary` | `#0F1720` | Near-black — body text |
| `--color-text-secondary` | `#3F5B7A` | Slate blue — secondary/muted text |
| `--color-text-light` | `#FFFFFF` | White — text on dark backgrounds |

**Typography:**
- `Bodoni Moda` (serif, weights 700/800/900): All headings via `.font-heading` and `h1–h6` global rule.
- `Montserrat` (sans-serif): Body text via `.font-body` and `body` global rule.

---

## Content Source of Truth

**`src/lib/wedding-data.ts`** — All site copy lives here. Every page pulls from `WEDDING` and `IMAGES` exported constants. Editing this file propagates changes everywhere automatically.

Key fields:
- `WEDDING.couple.groom.first` → `'Jeffrey'`
- `WEDDING.couple.names` → `'Ashlyn & Jeffrey'`
- `IMAGES.hero.main` → `/images/hero/JeffAshlyn-7977 2.jpg` (real photo; falls back to Unsplash)

---

## Database Schema (Supabase)

### RSVP Tables

**`households`** — Groups guests into families/couples.
- `id` UUID PK, `name` Text, `created_at` Timestamp

**`guests`** — Individual invited people.
- `id` UUID PK
- `first_name`, `last_name`, `suffix` (optional), `nicknames` (optional, for fuzzy search)
- `household_id` UUID FK → `households(id)`
- `plus_one_allowed` Boolean (default false)
- `attending` Boolean | Null (Null = Pending, true = Attending, false = Declined)
- `meal_choice` Text (optional)
- `created_at` Timestamp

**`admin_logs`** — Tracks admin logins.
- `id` UUID PK, `password_used` Text, `created_at` Timestamp

### Games Tables

**`game_players`** — Leaderboard profiles for guests playing games.
- `id` UUID PK
- `username` Text (display name)
- `email` Text
- `fingerprint` Text (browser fingerprint for deduplication)
- `created_at` Timestamp

**`game_scores`** — Individual score submissions.
- `id` UUID PK
- `player_id` UUID FK → `game_players(id)`
- `game` Text (e.g., `'painedle'`, `'trivia'`)
- `score` Integer
- `metadata` JSONB (game-specific data like word guessed, trivia tier)
- `created_at` Timestamp

**`trivia_questions`** — Editable trivia question bank (admin-managed).
- `id` UUID PK
- `prompt` Text
- `answer_a`, `answer_b`, `answer_c`, `answer_d` Text
- `correct_index` Integer (0–3)
- `fun_fact` Text (optional)
- `sort_order` Integer
- `archived` Boolean (default false)
- `created_at`, `updated_at` Timestamp

RLS: anon key can SELECT non-archived questions; writes go through service role key (server-side API routes only).

---

## Core Features & Logic

### RSVP Flow (`src/app/rsvp/page.tsx`)
- **Search:** `ilike` against `first_name`, `last_name`, `nicknames`
- **Household grouping:** Pulls all guests sharing the matched `household_id`
- **Submission:** Sets `attending` true/false per guest; null = still pending
- **Meal choices:** Shown only if `WEDDING.mealOptions` array is non-empty

### Admin Dashboard (`src/app/admin/page.tsx`)
**Password tiers:**
- Master: `JeffreyAndAshlyn!` — full access including login tracking board
- Users: `JeffreyAndAshlyn1!` through `JeffreyAndAshlyn5!` — standard access, no security section

Every login inserts into `admin_logs`.

**Features:** RSVP metrics, bulk guest importer (tab-separated from Google Sheets, 5-column format: Household Name | First Name | Last Name | Suffix | Nicknames), data table grouped by household.

### Games (`src/app/games/`)

**Hub page:** `/games` — cards for Painedle and Couple Trivia.

**Painedle** (`/games/painedle`) — Daily Wordle variant using wedding-themed 5-letter words. Word is determined by the date (deterministic, same word all day for all players). Six guesses. Color-coded tile feedback. Score submission to leaderboard after game ends.

Key files:
- `src/lib/games/painedle.ts` — `getDailyWord()`, `checkGuess()`, scoring logic
- `src/lib/games/word-list.ts` — Filtered to 5-letter words only
- `src/components/games/PainedleGame.tsx` — Game UI

**Couple Trivia** (`/games/trivia`) — 10 multiple-choice questions loaded from `trivia_questions` Supabase table (via `GET /api/games/trivia-questions`). Four-tier score result. Score submission to leaderboard.

Key files:
- `src/components/games/CoupleTriviaGame.tsx` — Game UI (loads questions from API)
- `src/app/api/games/trivia-questions/route.ts` — Public GET, returns non-archived questions ordered by `sort_order`

**Shared game components:**
- `GameAccountPanel` — Collapsed "Playing as **Name**" bar; expands to edit username/email. Stores profile in localStorage. Compact by default on mobile.
- `ScoreSubmissionForm` — Submit score to leaderboard; collapses to a confirmation state after submit (no re-submit).
- `LeaderboardPanel` — Shows top scores from `game_scores`.

**Admin games panel** (`/admin` → Games tab → `GamesAdminPanel`):
- 7 data views (players, scores, leaderboards, etc.)
- **Trivia Bank:** Full CRUD editor — add/edit/archive/delete questions, correct-answer radio selector, sort order controls
    
    API routes for admin trivia CRUD:
    - `GET/POST /api/admin/trivia-questions`
    - `GET/PUT/DELETE /api/admin/trivia-questions/[id]`
    All admin routes validate the session cookie (set on login).

    ### Site-Wide Visual Edit Mode
    Available only to the `'Master'` admin role. When logged in, a floating toolbar appears at the bottom of the page allowing the user to toggle "Edit Mode".
    
    **Architecture:**
    - Active edit mode injects a `admin-edit-active` class to the HTML, which highlights all elements with a `data-admin-key` attribute (yellow dashed border, hover labels).
    - Clicks on these elements are intercepted globally in `AdminEditBar.tsx` via the capture phase.
    - Edits are saved to the `site_settings` Supabase table as JSON key-value pairs.
    - The `site-settings.ts` utility runs on the server to merge these DB overrides on top of the default `WEDDING.ts` data before rendering the pages.
    
    **Text Editing:**
    - Supports both plain text and rich text (via `document.execCommand`).
    - The click handler captures text using `editable.innerText` (to strip React `<!-- -->` comment nodes) or `editable.innerHTML` (for rich text).
    - **CRITICAL:** If a visual element combines multiple data fields (e.g. `{date.dayOfWeek}, {date.display}`), it MUST have a `data-admin-current-text={date.display}` attribute so the editor only captures and overwrites the intended editable portion.
    
    **Image Editing:**
    - Supports uploading replacements, adjusting a translucent color overlay/opacity, and cropping.
    - **SmartCropTool:** Uses a fixed-aspect-ratio frame. The aspect ratio is derived from the `data-admin-key`. Users drag the image to pan and use a slider to zoom. Exports a clean 1200px image via Canvas.
    - **Compression:** Vercel serverless functions have a 4.5MB request body limit (413 errors). Admin image uploads are pre-compressed locally on the client via Canvas (max 2400px, 0.92 JPEG quality) before `apiUploadImage` is called.

    ---

## Environment Variables

Required in `.env.local` for local development (already set in Vercel for production):

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

The service role key is used server-side only (API routes) for admin writes that bypass RLS.

---

## Key Architectural Notes

- **`wedding-data.ts` is the single content source.** Never hardcode copy in components; always add it to this file.
- **Tailwind v4 `@theme` cannot use `var()` references to runtime CSS variables.** Font utilities must be defined in `@layer utilities` directly. Colors and spacing are safe in `@theme`.
- **Trivia questions live in Supabase**, not in the static `trivia-questions.ts` file. The static file (`src/lib/games/trivia-questions.ts`) is kept as a reference/seed but is no longer used by `CoupleTriviaGame.tsx` at runtime.
- **Admin auth uses a simple session cookie** (`admin_session`) set on the server after password validation. No NextAuth or JWT.
- **Hero image:** CSS `background-image` (not `next/image`), references `IMAGES.hero.main` with a Unsplash fallback.

---

## Recent Architectural Updates & Changes

- **Themes Archiving:** The legacy `v1`, `v2`, and `v3` template layouts (and their associated components/routing) have been excised from the Next.js cache and the live `src/app` architecture. They are preserved locally within the `archive/themes` directory. The production deployment now only serves the main site at `/` and throws a `404` for the old version routes.
- **Story Structure:** The `Our Story` page is now dynamically built. The `WEDDING.story` array was expanded into 9 discrete chapters with custom imagery (from `/images/story`), mapping exactly to the components layout. 
- **Attire Scaling Arrays:** The Attire layout was modified to run a dynamic flex grid driven by the length of the `IMAGES.attire` array, accommodating arbitrary payloads of inspiration photos. Current active arrays contain 12 Ladies and 9 Gents photos.
- **Registry Reduction:** Scrapped the Honeymoon Fund block from `wedding-data.ts`. The registry array only contains dynamic routing options to Amazon and Target.
- **Games Hub Timers:** Updated the structural break units for the grid in `GamesHubClient.tsx`, narrowing padding limits and reducing the time string labels (ex: "Hours" -> "Hr") so they fit inside viewport containers without overflowing bounds on smaller devices.
