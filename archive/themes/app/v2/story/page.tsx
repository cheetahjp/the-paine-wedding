import { getWeddingData } from "@/lib/site-settings";
import Image from "next/image";

export const metadata = { title: "Our Journey | Paper Atlas" };

export default async function V2StoryPage() {
  const { wedding } = await getWeddingData();

  const stops = [
    {
      number: "01",
      city: "Commerce, TX",
      year: "2021",
      title: "Where It Started",
      story: wedding.story[0],
      annotation: "Summer 2021 →",
      accent: "var(--v-tan)",
    },
    {
      number: "02",
      city: "The Distance",
      year: "2022–2024",
      title: "860 Miles Apart",
      story: null,
      annotation: "a long way to go ↓",
      accent: "var(--v-text-muted)",
      statBlock: true,
    },
    {
      number: "03",
      city: "Houston, TX",
      year: "October 2024",
      title: "The Return",
      story: wedding.story[1],
      annotation: "found our way back ↗",
      accent: "var(--v-burgundy)",
    },
    {
      number: "04",
      city: "Celeste, TX",
      year: "February 2026",
      title: "The Proposal",
      story: wedding.story[2],
      annotation: "the best detour ★",
      accent: "var(--v-navy)",
    },
  ];

  return (
    <div className="v2-theme">
      {/* ── Header ──────────────────────────────────── */}
      <section
        className="px-8 pt-24 pb-16 relative overflow-hidden"
        style={{ backgroundColor: "var(--v-surface)", borderBottom: "1px solid var(--v-border)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-inter)", fontSize: "10px", color: "var(--v-text-muted)" }}
          >
            Route Journal
          </p>
          <h1
            className="font-bold italic leading-none mb-6"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(56px, 8vw, 96px)", color: "var(--v-text)" }}
          >
            Our Journey
          </h1>
          <div className="flex items-center gap-3">
            {["Commerce", "·", "Long Distance", "·", "Houston", "·", "Celeste ★"].map((s, i) => (
              <span
                key={i}
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "11px",
                  color: s === "·" ? "var(--v-tan)" : "var(--v-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Caveat annotation */}
        <p
          className="absolute bottom-6 right-8 font-caveat"
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: "18px",
            color: "var(--v-tan)",
            transform: "rotate(-2deg)",
          }}
        >
          four stops, one destination
        </p>
      </section>

      {/* ── Route Stops ─────────────────────────────── */}
      <div className="relative">
        {/* Left margin route line */}
        <div
          className="hidden lg:block absolute left-16 top-0 bottom-0 w-px"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, var(--v-tan) 0, var(--v-tan) 8px, transparent 8px, transparent 16px)",
          }}
        />

        {stops.map((stop, idx) => (
          <section
            key={idx}
            className="px-8 lg:pl-32 py-20"
            style={{ borderBottom: "1px solid var(--v-border)" }}
          >
            <div className="max-w-5xl mx-auto">

              {/* Stop marker */}
              <div className="hidden lg:flex items-center gap-4 mb-8" style={{ marginLeft: "-5.5rem" }}>
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: stop.accent,
                    border: "2px solid var(--v-bg)",
                    boxShadow: `0 0 0 3px ${stop.accent}`,
                  }}
                />
                <span
                  className="uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: "var(--v-text-muted)" }}
                >
                  Stop {stop.number}
                </span>
              </div>

              {/* Stop header */}
              <div className="mb-10">
                <p
                  className="uppercase tracking-widest mb-2"
                  style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: stop.accent }}
                >
                  {stop.city} · {stop.year}
                </p>
                <h2
                  className="font-bold italic"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(36px, 5vw, 58px)", color: "var(--v-text)", lineHeight: "1.1" }}
                >
                  {stop.title}
                </h2>
              </div>

              {/* Stat block for distance stop */}
              {stop.statBlock && (
                <div className="grid sm:grid-cols-3 gap-6 mb-8">
                  {[
                    { stat: "860", unit: "miles apart" },
                    { stat: "~2", unit: "years of check-ins" },
                    { stat: "∞", unit: "reasons to try again" },
                  ].map(({ stat, unit }) => (
                    <div key={unit} className="v2-stamp text-center p-8">
                      <p
                        className="font-bold italic mb-1"
                        style={{ fontFamily: "var(--font-playfair)", fontSize: "48px", color: "var(--v-text)" }}
                      >
                        {stat}
                      </p>
                      <p
                        className="uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: "var(--v-text-muted)" }}
                      >
                        {unit}
                      </p>
                    </div>
                  ))}
                  <div className="sm:col-span-3">
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "15px",
                        color: "var(--v-text-muted)",
                        lineHeight: "1.8",
                        maxWidth: "600px",
                      }}
                    >
                      After six months together in Commerce, they each needed space to grow.
                      They went their separate ways — but neither fully moved on. For two years,
                      they orbited each other quietly: occasional check-ins, wondering.
                    </p>
                  </div>
                </div>
              )}

              {/* Story block */}
              {stop.story && (
                <div className="flex flex-col lg:flex-row gap-10 items-start">
                  {/* Photo */}
                  <div
                    className="lg:w-2/5 flex-shrink-0"
                    style={{
                      border: "8px solid var(--v-bg)",
                      outline: "1px solid var(--v-border)",
                      boxShadow: "4px 4px 20px rgba(8,17,29,0.08)",
                    }}
                  >
                    <div className="relative" style={{ paddingBottom: "75%" }}>
                      <Image
                        src={stop.story.image}
                        alt={stop.story.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Photo caption */}
                    <div
                      className="px-4 py-3 flex items-center justify-between"
                      style={{ backgroundColor: "var(--v-surface)", borderTop: "1px solid var(--v-border)" }}
                    >
                      <span
                        className="uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-inter)", fontSize: "8px", color: "var(--v-text-muted)" }}
                      >
                        {stop.city}, {stop.year}
                      </span>
                      <span
                        className="font-caveat"
                        style={{ fontFamily: "var(--font-caveat)", fontSize: "14px", color: "var(--v-tan)" }}
                      >
                        {stop.annotation}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div className="flex-1">
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "15px",
                        color: "var(--v-text-muted)",
                        lineHeight: "1.9",
                      }}
                    >
                      {stop.story.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Annotation only (stat block stop) */}
              {stop.statBlock && (
                <p
                  className="font-caveat"
                  style={{
                    fontFamily: "var(--font-caveat)",
                    fontSize: "20px",
                    color: "var(--v-tan)",
                    transform: "rotate(-1deg)",
                    display: "inline-block",
                  }}
                >
                  {stop.annotation}
                </p>
              )}
            </div>
          </section>
        ))}
      </div>

      {/* ── CTA ─────────────────────────────────────── */}
      <section
        className="px-8 py-16"
        style={{ backgroundColor: "var(--v-surface)", borderTop: "2px solid var(--v-tan)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p
            className="font-bold italic"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "var(--v-text)" }}
          >
            Next stop: September 26th, 2026.
          </p>
          <a href="/v2/rsvp" className="v2-btn-primary" style={{ fontSize: "11px" }}>
            Confirm Your Journey →
          </a>
        </div>
      </section>
    </div>
  );
}
