import { getWeddingData } from "@/lib/site-settings";
import V2RouteMap from "@/components/v2/V2RouteMap";
import Image from "next/image";
import { IMAGES } from "@/lib/wedding-data";

export const metadata = {
  title: "The Paine Wedding | Paper Atlas",
};

export default async function V2HomePage() {
  const wedding = await getWeddingData();

  return (
    <div className="v2-theme">

      {/* ── 1. COVER PAGE ──────────────────────────── */}
      <section
        className="relative px-8 pt-24 pb-20 flex flex-col items-center text-center"
        style={{ borderBottom: "1px solid var(--v-border)", minHeight: "92vh", justifyContent: "center" }}
      >
        {/* Postmark stamp */}
        <div
          className="mb-10 w-28 h-28 rounded-full flex items-center justify-center text-center"
          style={{
            border: "2px solid var(--v-navy)",
            backgroundColor: "var(--v-surface)",
          }}
        >
          <div>
            <p
              className="uppercase tracking-widest leading-tight"
              style={{ fontFamily: "var(--font-inter)", fontSize: "8px", color: "var(--v-navy)" }}
            >
              Celeste, TX
            </p>
            <p
              className="font-bold leading-tight"
              style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "var(--v-navy)" }}
            >
              Sept 26<br />2026
            </p>
            <div className="mt-1 mx-auto" style={{ width: "40px", height: "1px", backgroundColor: "var(--v-navy)" }} />
          </div>
        </div>

        {/* Title */}
        <h1
          className="font-bold leading-none mb-4"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(52px, 9vw, 100px)",
            color: "var(--v-text)",
          }}
        >
          The Paine<br />Wedding
        </h1>
        <p
          className="italic mb-10"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "18px",
            color: "var(--v-text-muted)",
          }}
        >
          A keepsake guide for our guests.
        </p>

        {/* Route Map */}
        <div className="w-full max-w-2xl mb-10">
          <V2RouteMap />
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/v2/rsvp" className="v2-btn-primary">RSVP</a>
          <a href="/v2/story" className="v2-btn-outline">Start Exploring</a>
        </div>

        {/* Corner annotations */}
        <p
          className="absolute bottom-8 right-8 font-caveat"
          style={{ fontFamily: "var(--font-caveat)", fontSize: "16px", color: "var(--v-tan)", transform: "rotate(-3deg)" }}
        >
          page 01 ↓
        </p>
      </section>

      {/* ── 2. THREE PATHS ─────────────────────────── */}
      <section className="px-8 py-20" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase tracking-widest mb-10 text-center"
            style={{ fontFamily: "var(--font-inter)", fontSize: "10px", color: "var(--v-text-muted)" }}
          >
            Navigate Your Guide
          </p>
          <div className="grid md:grid-cols-3 gap-0 border" style={{ borderColor: "var(--v-border)" }}>
            {[
              {
                tab: "Essentials",
                icon: "📋",
                items: ["Ceremony · 5:00 PM", "Davis & Grey Farms", "Semi-Formal attire", "RSVP by Aug 1"],
                href: "/v2/day",
                color: "var(--v-navy)",
              },
              {
                tab: "Our Journey",
                icon: "✈",
                items: ["Commerce, TX · 2021", "Long distance", "Houston reunion", "The proposal"],
                href: "/v2/story",
                color: "var(--v-burgundy)",
              },
              {
                tab: "Travel Plans",
                icon: "🗺",
                items: ["Dallas Love Field", "DFW International", "Hotels nearby", "Getting there"],
                href: "/v2/travel",
                color: "var(--v-tan)",
              },
            ].map(({ tab, icon, items, href, color }) => (
              <a
                key={tab}
                href={href}
                className="block p-8 transition-all"
                style={{
                  textDecoration: "none",
                  borderRight: "1px solid var(--v-border)",
                  backgroundColor: "var(--v-surface)",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--v-cream)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = "var(--v-surface)")}
              >
                {/* Tab label */}
                <div
                  className="inline-block px-3 py-1 mb-5 text-center"
                  style={{ backgroundColor: color }}
                >
                  <span
                    className="uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: "var(--v-cream)" }}
                  >
                    {tab}
                  </span>
                </div>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)" }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <p
                  className="mt-6 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color }}
                >
                  Open chapter →
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. ITINERARY RIBBON ────────────────────── */}
      <section
        className="px-8 py-10 overflow-x-auto"
        style={{ borderBottom: "1px solid var(--v-border)", backgroundColor: "var(--v-surface)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-4 min-w-max mx-auto">
            {[
              { label: "Date", value: "Sept 26, 2026" },
              { label: "Ceremony", value: "5:00 PM" },
              { label: "Venue", value: "Davis & Grey Farms" },
              { label: "Dress", value: "Semi-Formal" },
              { label: "RSVP By", value: "August 1, 2026" },
              { label: "Open Bar", value: "Beer & Wine" },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="v2-stamp flex-shrink-0 text-center"
                style={{ minWidth: "130px", padding: "14px 16px" }}
              >
                <p
                  className="uppercase tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-inter)", fontSize: "8px", color: "var(--v-text-muted)" }}
                >
                  {label}
                </p>
                <p
                  className="font-bold"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "14px", color: "var(--v-navy)" }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. ROUTE STORY TEASER ──────────────────── */}
      <section className="px-8 py-20" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase tracking-widest mb-6"
            style={{ fontFamily: "var(--font-inter)", fontSize: "10px", color: "var(--v-text-muted)" }}
          >
            The Route
          </p>

          {/* Route stops */}
          <div className="flex flex-col lg:flex-row gap-0 relative mb-10">
            {/* Vertical connector line on mobile */}
            <div
              className="absolute left-4 top-0 bottom-0 w-px lg:hidden"
              style={{ backgroundImage: "repeating-linear-gradient(to bottom, var(--v-tan) 0, var(--v-tan) 6px, transparent 6px, transparent 12px)" }}
            />
            {[
              { city: "Commerce, TX", year: "2021", event: "Ice cream social at A&M — where it all began." },
              { city: "Long Distance", year: "2022–2024", event: "860 miles apart. Monthly check-ins. Something still there." },
              { city: "Houston, TX", year: "October 2024", event: "A brewery. Four hours of talking. Better versions of themselves." },
              { city: "Celeste, TX", year: "February 2026", event: "A path through the trees. He was waiting. She said yes." },
            ].map((stop, i) => (
              <div key={i} className="flex-1 flex gap-4 pl-10 lg:pl-0 lg:flex-col pb-8 lg:pb-0 lg:pr-6">
                <div
                  className="flex-shrink-0 w-3 h-3 rounded-full mt-1 lg:mb-3 lg:mt-0"
                  style={{ backgroundColor: i === 3 ? "var(--v-navy)" : "var(--v-tan)" }}
                />
                <div>
                  <p
                    className="uppercase tracking-widest mb-1"
                    style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: "var(--v-text-muted)" }}
                  >
                    {stop.year}
                  </p>
                  <p
                    className="font-bold mb-2"
                    style={{ fontFamily: "var(--font-playfair)", fontSize: "16px", color: "var(--v-text)" }}
                  >
                    {stop.city}
                  </p>
                  <p
                    style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)", lineHeight: "1.6" }}
                  >
                    {stop.event}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <a href="/v2/story" className="v2-btn-primary" style={{ fontSize: "11px" }}>
              Read the Full Journey
            </a>
            <p
              className="font-caveat"
              style={{ fontFamily: "var(--font-caveat)", fontSize: "18px", color: "var(--v-tan)", transform: "rotate(-2deg)" }}
            >
              the long way home ↗
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. CHAPTER PREVIEW (The Wedding Day) ───── */}
      <section
        className="px-8 py-20"
        style={{ backgroundColor: "var(--v-navy)", borderBottom: "1px solid var(--v-border)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
          <div>
            <p
              className="uppercase tracking-widest mb-3"
              style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: "rgba(240,231,221,0.5)" }}
            >
              Chapter 4 · Celeste
            </p>
            <h2
              className="font-bold italic mb-4"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(36px, 5vw, 60px)", color: "var(--v-cream)" }}
            >
              The Wedding Day
            </h2>
            <p
              style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "rgba(240,231,221,0.7)", lineHeight: "1.7", maxWidth: "400px" }}
            >
              {wedding.date.display} · {wedding.venue.ceremonyTime} · {wedding.venue.name}
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <a
              href="/v2/day"
              className="inline-block text-center px-8 py-3 uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "11px",
                color: "var(--v-navy)",
                backgroundColor: "var(--v-cream)",
                textDecoration: "none",
              }}
            >
              See the Full Itinerary →
            </a>
          </div>
        </div>
      </section>

      {/* ── 6. ARRIVALS TEASER ────────────────────── */}
      <section className="px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase tracking-widest mb-8"
            style={{ fontFamily: "var(--font-inter)", fontSize: "10px", color: "var(--v-text-muted)" }}
          >
            Arrivals
          </p>
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {wedding.travel.airports.map((airport) => (
              <div
                key={airport.code}
                className="v2-stamp flex items-center gap-5"
              >
                <div
                  className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "var(--v-cream)", border: "1px solid var(--v-border)" }}
                >
                  <span
                    className="font-bold"
                    style={{ fontFamily: "var(--font-playfair)", fontSize: "13px", color: "var(--v-navy)" }}
                  >
                    {airport.code}
                  </span>
                </div>
                <div>
                  <p
                    className="font-bold mb-1"
                    style={{ fontFamily: "var(--font-playfair)", fontSize: "16px", color: "var(--v-text)" }}
                  >
                    {airport.name}
                  </p>
                  <p
                    style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "var(--v-text-muted)" }}
                  >
                    {airport.description.split(".")[0]}.
                  </p>
                </div>
              </div>
            ))}
          </div>
          <a
            href="/v2/travel"
            className="uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "10px",
              color: "var(--v-navy)",
              textDecoration: "none",
              borderBottom: "1px solid var(--v-navy)",
              paddingBottom: "2px",
            }}
          >
            Plan Your Arrival →
          </a>
        </div>
      </section>

    </div>
  );
}
