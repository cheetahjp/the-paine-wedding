# Wedding Site Images

Drop new photos into the correct folder below and redeploy. All image paths are defined in `src/lib/wedding-data.ts`.

## Folder Guide

| Folder | Contents | Notes |
|---|---|---|
| `hero/` | Homepage full-bleed background | Currently: `JeffAshlyn-7977_2.jpg` |
| `story/` | One photo per Our Story entry | 9 photos, named by moment (see wedding-data.ts) |
| `bridal-party/` | Headshot per bridal party member | 7 bridesmaids + 7 groomsmen |
| `attire/` | Outfit inspiration photos | 12 women's + 9 men's outfits |
| `rsvp/` | Engagement/couple photo gallery | 95 photos used in RSVP page slideshow |
| `engagement/` | Reserved for engagement photos | Currently empty — add here as needed |
| `venue/` | Davis & Grey Farms photos | Currently empty — add here as needed |

## Replacing the Hero Image

1. Upload via **Admin → Content → Hero Image** — shows immediately, no redeploy needed.
2. Or drop a file into `hero/`, update the path in `wedding-data.ts`, and redeploy.

## Notes

- `.jpg`, `.png`, `.webp` all work — `.webp` is smallest for same quality.
- The OG social preview image is auto-generated from code (`src/app/opengraph-image.tsx`).
