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
│   └── Nav.tsx                     # Desktop + mobile nav shell
└── lib/
    └── wedding-data.ts             # ⭐ SINGLE SOURCE OF TRUTH for all wedding content
                                    #    Edit this file to update content across all pages
supabase/
├── migrations/
│   └── 20260307000000_add_rsvp_fields.sql   # Adds food_allergies, song_request, advice
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
- [ ] **Couple trivia game** — playable quiz at tables, questions TBD
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
