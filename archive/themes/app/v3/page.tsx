import { getWeddingData } from "@/lib/site-settings";
import { IMAGES } from "@/lib/wedding-data";
import Image from "next/image";
import Link from "next/link";
import V3Frame from "@/components/v3/V3Frame";
import V3Plaque from "@/components/v3/V3Plaque";
import V3RoomDivider from "@/components/v3/V3RoomDivider";

export const metadata = {
  title: "The Paine Wedding | Velvet Gallery",
  description: "An Exhibition Opening September 26, 2026 · Celeste, Texas.",
};

export default async function V3HomePage() {
  const { wedding } = await getWeddingData();

  return (
    <div style={{ backgroundColor: "var(--v-bg)" }}>

      {/* ── 1. EXHIBITION ENTRANCE ── */}
      <section className="min-h-screen flex flex-col items-center justify-center px-6 py-24 text-center">
        {/* Institution line */}
        <p
          className="mb-10"
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.6rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "var(--v-text-muted)",
          }}
        >
          Davis &amp; Grey Farms · Est. 2026 · Celeste, Texas
        </p>

        {/* Gold rule */}
        <div className="w-16 h-px mb-10" style={{ backgroundColor: "var(--v-tan)" }} />

        {/* Main title */}
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(3rem, 9vw, 7rem)",
            color: "var(--v-text)",
            lineHeight: 1.05,
            letterSpacing: "0.04em",
            marginBottom: "1.5rem",
            maxWidth: "700px",
          }}
        >
          The Paine Wedding
        </h1>

        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.7rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--v-text-muted)",
            marginBottom: "3rem",
          }}
        >
          An Exhibition Opening September 26, 2026 · Celeste, Texas
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/v3/rsvp"
            className="px-8 py-3 text-xs tracking-widest uppercase transition-opacity"
            style={{
              backgroundColor: "var(--v-navy)",
              color: "var(--v-cream)",
              fontFamily: "var(--font-inter)",
            }}
          >
            Reserve Your Place
          </Link>
          <Link
            href="/v3/story"
            className="px-8 py-3 text-xs tracking-widest uppercase transition-colors"
            style={{
              border: "1px solid var(--v-text)",
              color: "var(--v-text)",
              fontFamily: "var(--font-inter)",
            }}
          >
            View the Exhibition
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--v-text-muted)" }}>
            Continue
          </p>
          <div className="w-px h-10" style={{ backgroundColor: "var(--v-tan)" }} />
        </div>
      </section>

      {/* ── 2. THE FEATURED WORK ── */}
      <section className="py-20 px-6 text-center" style={{ backgroundColor: "var(--v-surface)" }}>
        <div className="max-w-lg mx-auto">
          <p className="v3-label mb-8">Featured Work · Gallery I</p>

          <V3Frame
            caption="Ashlyn & Jeffrey"
            captionSub="Photograph · 2026"
            withLight
            matPadding={16}
            className="w-full"
          >
            <div className="relative w-full" style={{ paddingBottom: "120%" }}>
              <Image
                src={IMAGES.engagement.main}
                alt="Ashlyn and Jeffrey engagement photo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </V3Frame>

          <p className="mt-6 text-sm max-w-sm mx-auto" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            {wedding.meta.description}
          </p>
        </div>
      </section>

      {/* ── 3. THE ROOMS ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <V3RoomDivider roomNumber="Exhibition Rooms" title="Explore the Collection" />

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {[
              {
                room: "Room I",
                title: "The Wedding",
                description: "Schedule, ceremony details, and everything you need for the day.",
                href: "/v3/day",
              },
              {
                room: "Room II",
                title: "Our Story",
                description: "How two people found each other — twice — across 860 miles.",
                href: "/v3/story",
              },
              {
                room: "Room III",
                title: "The Journey",
                description: "Travel guide, airports, hotels, and getting to Celeste, TX.",
                href: "/v3/travel",
              },
            ].map((room) => (
              <Link
                key={room.room}
                href={room.href}
                className="block p-6 transition-all group"
                style={{
                  border: "1px solid var(--v-border)",
                  backgroundColor: "var(--v-cream)",
                  textDecoration: "none",
                }}
              >
                <p className="v3-label mb-2" style={{ color: "var(--v-tan)" }}>
                  {room.room}
                </p>
                <h3
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: "1.4rem",
                    color: "var(--v-text)",
                    marginBottom: "8px",
                  }}
                >
                  {room.title}
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)", lineHeight: 1.6 }}>
                  {room.description}
                </p>
                <p
                  className="mt-4 text-xs tracking-widest uppercase transition-colors"
                  style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
                >
                  Enter →
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. COLLECTION FACTS ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--v-surface)" }}>
        <div className="max-w-4xl mx-auto">
          <V3RoomDivider roomNumber="Collection" title="Essential Information" />

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            {[
              { label: "Date", value: "Sept 26, 2026" },
              { label: "Ceremony", value: "5:00 PM" },
              { label: "Venue", value: "Davis & Grey Farms" },
              { label: "Dress Code", value: wedding.dresscode.short },
              { label: "RSVP By", value: "August 1, 2026" },
            ].map((fact) => (
              <div
                key={fact.label}
                className="p-4 text-center"
                style={{
                  border: "1px solid var(--v-border)",
                  backgroundColor: "var(--v-cream)",
                }}
              >
                <V3Plaque
                  title={fact.value}
                  medium={fact.label}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. STORY EXHIBITION TEASER ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <V3RoomDivider roomNumber="Room II" title="Our Story" />

          <div className="grid grid-cols-3 gap-4 mt-8">
            {wedding.story.map((chapter, i) => (
              <V3Frame
                key={i}
                caption={chapter.title}
                captionSub={chapter.year}
                withLight
                matPadding={10}
                className="w-full"
              >
                <div className="relative w-full" style={{ paddingBottom: "125%" }}>
                  <Image
                    src={chapter.image}
                    alt={chapter.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </V3Frame>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/v3/story"
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
            >
              Enter Room II →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. THE PROGRAMME ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--v-surface)" }}>
        <div className="max-w-3xl mx-auto">
          <V3RoomDivider roomNumber="Room I" title="The Programme" />

          <div className="space-y-0 mt-8">
            {wedding.schedule.slice(0, 3).map((item, i) => (
              <div
                key={i}
                className="flex gap-6 py-5"
                style={{ borderBottom: "1px solid var(--v-border)" }}
              >
                <div className="w-20 shrink-0">
                  <p className="v3-label" style={{ color: "var(--v-tan)" }}>{item.time}</p>
                </div>
                <div>
                  <h4
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "1.1rem",
                      color: "var(--v-text)",
                      marginBottom: "4px",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)" }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/v3/day"
              className="text-xs tracking-widest uppercase"
              style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
            >
              See the Full Programme →
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
