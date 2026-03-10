/**
 * site-settings.ts — Server-side only
 *
 * Fetches key/value overrides from the `site_settings` Supabase table and
 * merges them onto top of the static defaults in `wedding-data.ts`.
 *
 * Usage (server components and API routes):
 *   const { wedding, images, overlays, content } = await getWeddingData();
 */

import { createClient } from "@supabase/supabase-js";
import { WEDDING, IMAGES } from "./wedding-data";

// ── Types ─────────────────────────────────────────────────────────────────

type SettingsMap = Record<string, unknown>;

export type ImageOverlay = {
  color: string;   // hex e.g. "#0f2439"
  opacity: number; // 0–1
};

export type HeroImageSettings = {
  main: string;
  overlay: ImageOverlay | null;
};

export type AttireImageSettings = {
  src: string;
  overlay: ImageOverlay | null;
};

// ── Helpers ───────────────────────────────────────────────────────────────

function str(map: SettingsMap, key: string, def: string): string {
  const v = map[key];
  return typeof v === "string" ? v : def;
}

function arr<T>(map: SettingsMap, key: string, def: T[]): T[] {
  const v = map[key];
  return Array.isArray(v) ? (v as T[]) : def;
}

function obj<T>(map: SettingsMap, key: string, def: T): T {
  const v = map[key];
  return v !== null && typeof v === "object" && !Array.isArray(v) ? (v as T) : def;
}

// Merge per-item overrides onto a base array, by index
function mergeItems<T extends Record<string, unknown>>(
  map: SettingsMap,
  prefix: string,
  base: T[]
): T[] {
  return base.map((item, i) => {
    const override = obj<Partial<T>>(map, `${prefix}.${i}`, {});
    return { ...item, ...override };
  });
}

// ── Fetch from Supabase ───────────────────────────────────────────────────

export async function getSettingsMap(): Promise<SettingsMap> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return {};

  try {
    const supabase = createClient(url, key, { auth: { persistSession: false } });
    const { data, error } = await supabase
      .from("site_settings")
      .select("key, value");

    if (error || !data) return {};

    const map: SettingsMap = {};
    for (const row of data) {
      map[row.key as string] = row.value;
    }
    return map;
  } catch {
    return {};
  }
}

// ── Merge & export ────────────────────────────────────────────────────────

export async function getWeddingData() {
  const map = await getSettingsMap();

  // ── Hero image ──────────────────────────────────────────────────────────
  const heroRaw = obj<{ main?: string; overlay?: ImageOverlay | null }>(
    map,
    "images.hero",
    {}
  );
  const heroMain = heroRaw.main ?? IMAGES.hero.main;
  const heroOverlay: ImageOverlay | null = heroRaw.overlay ?? null;

  // ── Attire images ───────────────────────────────────────────────────────
  const defaultLadies: AttireImageSettings[] = IMAGES.attire.ladies.map((src) => ({
    src,
    overlay: null,
  }));
  const defaultGents: AttireImageSettings[] = IMAGES.attire.gents.map((src) => ({
    src,
    overlay: null,
  }));
  const attireRaw = obj<{ ladies?: AttireImageSettings[]; gents?: AttireImageSettings[] }>(
    map,
    "images.attire",
    {}
  );
  const attireLadies = attireRaw.ladies ?? defaultLadies;
  const attireGents = attireRaw.gents ?? defaultGents;

  // ── Per-image attire overrides (images.attire.ladies.N / .gents.N) ──────
  const attireLadiesMerged: AttireImageSettings[] = attireLadies.map((item, i) => {
    const override = obj<Partial<AttireImageSettings>>(map, `images.attire.ladies.${i}`, {});
    return { ...item, ...override };
  });
  const attireGentsMerged: AttireImageSettings[] = attireGents.map((item, i) => {
    const override = obj<Partial<AttireImageSettings>>(map, `images.attire.gents.${i}`, {});
    return { ...item, ...override };
  });

  // ── Editable content strings ────────────────────────────────────────────
  const homeIntro = str(
    map,
    "home.intro",
    "We are so excited to celebrate this special moment in our lives with our closest family and friends. Your love and support mean the world to us, and we can't wait to share this unforgettable day with you."
  );
  const storySubtitle = str(
    map,
    "story.subtitle",
    "From a chance meeting to a lifetime commitment — a glimpse into their journey together."
  );

  // ── Story items (story.item.N.title / .description / .image) ───────────
  type StoryItem = { year: string; title: string; description: string; image: string; imageFallback: string };
  const storyItems: StoryItem[] = WEDDING.story.map((item, i) => {
    const titleOverride = str(map, `story.item.${i}.title`, item.title);
    const descOverride = str(map, `story.item.${i}.description`, item.description);
    const yearOverride = str(map, `story.item.${i}.year`, item.year);
    const imgRaw = obj<{ main?: string }>(map, `story.item.${i}.image`, {});
    const imgOverride = imgRaw.main ?? str(map, `story.item.${i}.image`, item.image);
    return {
      ...item,
      year: yearOverride,
      title: titleOverride,
      description: descOverride,
      image: imgOverride,
    };
  });

  // ── FAQ items (faq.N.q / faq.N.a) ──────────────────────────────────────
  type FaqItem = { q: string; a: string };
  const faqItems: FaqItem[] = WEDDING.faq.map((item, i) => ({
    q: str(map, `faq.${i}.q`, item.q),
    a: str(map, `faq.${i}.a`, item.a),
  }));

  // ── Schedule items (schedule.N.time / .title / .description) ───────────
  type ScheduleItem = { time: string; title: string; description: string };
  const scheduleItems: ScheduleItem[] = WEDDING.schedule.map((item, i) => ({
    time: str(map, `schedule.${i}.time`, item.time),
    title: str(map, `schedule.${i}.title`, item.title),
    description: str(map, `schedule.${i}.description`, item.description),
  }));

  // ── Bridal party photo overrides (bridal-party.bridesmaids.N.image etc.) ─
  type PartyMember = { name: string; role: string; relationship: string; image: string };
  const bridesmaids: PartyMember[] = WEDDING.bridalParty.bridesmaids.map((m, i) => ({
    ...m,
    image: str(map, `bridal-party.bridesmaids.${i}.image`, m.image),
  }));
  const groomsmen: PartyMember[] = WEDDING.bridalParty.groomsmen.map((m, i) => ({
    ...m,
    image: str(map, `bridal-party.groomsmen.${i}.image`, m.image),
  }));

  // ── Registry overrides (registry.N.url / .description) ─────────────────
  type RegistryItem = { name: string; description: string; url: string; icon: "gift" | "heart" };
  const registryItems: RegistryItem[] = WEDDING.registry.map((item, i) => ({
    ...item,
    url: str(map, `registry.${i}.url`, item.url),
    description: str(map, `registry.${i}.description`, item.description),
  }));

  // ── Travel / airport overrides ──────────────────────────────────────────
  type Airport = { name: string; code: string; description: string; url: string };
  const airports: Airport[] = WEDDING.travel.airports.map((a, i) => ({
    ...a,
    description: str(map, `travel.airport.${i}.description`, a.description),
    name: str(map, `travel.airport.${i}.name`, a.name),
    url: str(map, `travel.airport.${i}.url`, a.url),
  }));

  return {
    wedding: {
      ...WEDDING,
      couple: {
        ...WEDDING.couple,
        names: str(map, "couple.names", WEDDING.couple.names),
      },
      date: {
        ...WEDDING.date,
        display: str(map, "date.display", WEDDING.date.display),
        dayOfWeek: str(map, "date.dayOfWeek", WEDDING.date.dayOfWeek),
        rsvpDeadline: str(map, "date.rsvpDeadline", WEDDING.date.rsvpDeadline),
        rsvpDeadlineIso: str(map, "date.rsvpDeadlineIso", WEDDING.date.rsvpDeadlineIso),
      },
      venue: {
        ...WEDDING.venue,
        name: str(map, "venue.name", WEDDING.venue.name),
        address: str(map, "venue.address", WEDDING.venue.address),
        city: str(map, "venue.city", WEDDING.venue.city),
        fullAddress: str(map, "venue.fullAddress", WEDDING.venue.fullAddress),
        cityDisplay: str(map, "venue.cityDisplay", WEDDING.venue.cityDisplay),
        mapsUrl: str(map, "venue.mapsUrl", WEDDING.venue.mapsUrl),
        mapsEmbedSrc: str(map, "venue.mapsEmbedSrc", WEDDING.venue.mapsEmbedSrc),
        ceremonyTime: str(map, "venue.ceremonyTime", WEDDING.venue.ceremonyTime),
        cocktailTime: str(map, "venue.cocktailTime", WEDDING.venue.cocktailTime),
        receptionTime: str(map, "venue.receptionTime", WEDDING.venue.receptionTime),
        sendOffTime: str(map, "venue.sendOffTime", WEDDING.venue.sendOffTime),
        parking: str(map, "venue.parking", WEDDING.venue.parking),
        shuttle: str(map, "venue.shuttle", WEDDING.venue.shuttle),
      },
      dresscode: {
        ...WEDDING.dresscode,
        short: str(map, "dresscode.short", WEDDING.dresscode.short),
        summary: str(map, "dresscode.summary", WEDDING.dresscode.summary),
        ladies: str(map, "dresscode.ladies", WEDDING.dresscode.ladies),
        gentlemen: str(map, "dresscode.gentlemen", WEDDING.dresscode.gentlemen),
      },
      schedule: scheduleItems,
      faq: faqItems,
      registry: registryItems,
      // Override-capable via index
      bridalParty: { bridesmaids, groomsmen },
      story: storyItems,
      travel: { ...WEDDING.travel, airports },
      hotels: arr(map, "hotels", WEDDING.hotels),
      mealOptions: WEDDING.mealOptions,
      meta: {
        ...WEDDING.meta,
        title: str(map, "meta.title", WEDDING.meta.title),
        description: str(map, "meta.description", WEDDING.meta.description),
      },
    },
    images: {
      ...IMAGES,
      hero: {
        ...IMAGES.hero,
        main: heroMain,
      },
      attire: {
        ...IMAGES.attire,
        ladies: attireLadiesMerged.map((i) => i.src),
        gents: attireGentsMerged.map((i) => i.src),
        // Full settings (src + overlay) for admin edit bar
        ladiesSettings: attireLadiesMerged,
        gentsSettings: attireGentsMerged,
      },
    },
    /** Editable body-copy strings (overrideable via site_settings) */
    content: {
      homeIntro,
      storySubtitle,
    },
    /** Per-image overlay settings for pages that render overlays */
    overlays: {
      hero: heroOverlay,
      attireLadies: attireLadiesMerged.map((i) => i.overlay),
      attireGents: attireGentsMerged.map((i) => i.overlay),
    },
    /** Raw settings map for admin panels */
    settingsMap: map,
  };
}

// Helper export so mergeItems is available to other modules if needed
export { mergeItems };
