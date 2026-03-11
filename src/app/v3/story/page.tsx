import { getWeddingData } from "@/lib/site-settings";
import Image from "next/image";
import Link from "next/link";
import V3Frame from "@/components/v3/V3Frame";
import V3Plaque from "@/components/v3/V3Plaque";
import V3RoomDivider from "@/components/v3/V3RoomDivider";

export const metadata = {
  title: "The Story Exhibition | Velvet Gallery",
  description: "How Ashlyn & Jeffrey found each other.",
};

export default async function V3StoryPage() {
  const { wedding } = await getWeddingData();
  const [meetStory, reunionStory, proposalStory] = wedding.story;

  return (
    <div style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-24 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <p className="v3-label mb-4">The Story Exhibition</p>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "var(--v-text)",
            lineHeight: 1.1,
            letterSpacing: "0.03em",
          }}
        >
          How We Got Here
        </h1>
        <p className="mt-4" style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", letterSpacing: "0.1em", color: "var(--v-text-muted)" }}>
          Four rooms · Commerce to Celeste
        </p>
      </div>

      {/* ── ROOM I: THE BEGINNING ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <V3RoomDivider roomNumber="Room I" title="The Beginning" />

        <div className="grid md:grid-cols-2 gap-12 items-start mt-6">
          {/* Framed portrait */}
          <V3Frame
            caption={meetStory.title}
            captionSub={`${meetStory.year} · Commerce, Texas`}
            withLight
            matPadding={14}
            className="w-full"
          >
            <div className="relative w-full" style={{ paddingBottom: "125%" }}>
              <Image
                src={meetStory.image}
                alt={meetStory.title}
                fill
                className="object-cover"
              />
            </div>
          </V3Frame>

          {/* Story plaques */}
          <div className="space-y-8">
            <V3Plaque
              title="Commerce, Texas · 2021"
              medium="Chapter I"
            />
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "var(--v-text)", lineHeight: 1.8 }}>
              {meetStory.description}
            </p>

            {/* Pull quote */}
            <div
              className="p-5"
              style={{
                borderLeft: "3px solid var(--v-tan)",
                backgroundColor: "var(--v-surface)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.05rem",
                  fontStyle: "italic",
                  color: "var(--v-text)",
                  lineHeight: 1.6,
                }}
              >
                "She had been hoping for a chance to talk to him."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROOM II: THE DISTANCE ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--v-surface)" }}>
        <div className="max-w-5xl mx-auto">
          <V3RoomDivider roomNumber="Room II" title="The Distance" />

          <div className="grid md:grid-cols-2 gap-12 items-center mt-6">
            {/* Stat artwork */}
            <div className="text-center py-12">
              <p className="v3-label mb-4">Measurement, 2022–2024</p>
              <h2
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  color: "var(--v-text)",
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                }}
              >
                860
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--v-text-muted)",
                  marginTop: "8px",
                }}
              >
                Miles Apart
              </p>
              <div className="w-12 h-px mx-auto my-5" style={{ backgroundColor: "var(--v-tan)" }} />
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "2rem",
                  color: "var(--v-text-muted)",
                }}
              >
                ~2 Years
              </p>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "var(--v-text-muted)",
                  marginTop: "8px",
                }}
              >
                Apart
              </p>
            </div>

            {/* Plaque text */}
            <div className="space-y-6">
              <V3Plaque
                title="The Distance"
                medium="Chapter II · 2022–2024"
              />
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "var(--v-text-muted)", lineHeight: 1.8 }}>
                After six months together, they went their separate ways — not with bitterness, but with the quiet understanding that they both needed time to grow. The miles between them stretched long. But some stories aren't finished in the first chapter.
              </p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "var(--v-text-muted)", lineHeight: 1.8 }}>
                They stayed in each other's thoughts across the years that followed — two people growing into better versions of themselves, unknowingly growing back toward each other.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROOM III: THE RETURN ── */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <V3RoomDivider roomNumber="Room III" title="The Return" />

        <div className="grid md:grid-cols-2 gap-12 items-start mt-6">
          {/* Story text */}
          <div className="space-y-6 md:order-2">
            <V3Plaque
              title="Houston, Texas · 2024"
              medium="Chapter III"
            />
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "var(--v-text)", lineHeight: 1.8 }}>
              {reunionStory.description}
            </p>

            {/* Pull quote */}
            <div
              className="p-5"
              style={{
                borderLeft: "3px solid var(--v-burgundy)",
                backgroundColor: "var(--v-surface)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "1.05rem",
                  fontStyle: "italic",
                  color: "var(--v-text)",
                  lineHeight: 1.6,
                }}
              >
                "They were just better versions of themselves."
              </p>
            </div>
          </div>

          {/* Three small frames */}
          <div className="grid grid-cols-1 gap-4 md:order-1">
            <V3Frame
              caption={reunionStory.title}
              captionSub={reunionStory.year}
              withLight
              matPadding={10}
              className="w-full"
            >
              <div className="relative w-full" style={{ paddingBottom: "70%" }}>
                <Image
                  src={reunionStory.image}
                  alt={reunionStory.title}
                  fill
                  className="object-cover"
                />
              </div>
            </V3Frame>
          </div>
        </div>
      </section>

      {/* ── ROOM IV: THE PROPOSAL ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--v-navy)" }}>
        <div className="max-w-5xl mx-auto">
          {/* Room divider on dark bg */}
          <div className="flex items-center gap-5 py-8">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--v-burgundy)" }} />
            <div className="text-center shrink-0">
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--v-burgundy)", marginBottom: "4px" }}>
                Room IV
              </p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", color: "var(--v-cream)" }}>
                The Proposal
              </p>
            </div>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--v-burgundy)" }} />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start mt-6">
            {/* Ornate frame — largest */}
            <div>
              {/* Double-border effect for "most ornate" */}
              <div style={{ border: "4px solid var(--v-burgundy)", padding: "6px" }}>
                <V3Frame
                  caption="The Proposal"
                  captionSub="February 21, 2026 · Celeste, Texas"
                  withLight
                  matPadding={12}
                  className="w-full"
                >
                  <div className="relative w-full" style={{ paddingBottom: "130%" }}>
                    <Image
                      src={proposalStory.image}
                      alt="The Proposal"
                      fill
                      className="object-cover"
                    />
                  </div>
                </V3Frame>
              </div>
            </div>

            {/* Featured plaque — cream on dark */}
            <div className="space-y-6">
              <div style={{ borderTop: "2px solid var(--v-burgundy)", paddingTop: "10px" }}>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", color: "var(--v-cream)", marginBottom: "6px" }}>
                  The Proposal
                </h3>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--v-burgundy)" }}>
                  Chapter IV · February 2026
                </p>
              </div>

              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.875rem", color: "#8a9ab5", lineHeight: 1.8 }}>
                {proposalStory.description}
              </p>

              {/* "Yes yes yes" pull quote */}
              <div style={{ borderLeft: "3px solid var(--v-burgundy)", paddingLeft: "16px" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.4rem", fontStyle: "italic", color: "var(--v-cream)", lineHeight: 1.5 }}>
                  "Yes, yes, yes, yes — I will!"
                </p>
              </div>

              <Link
                href="/v3/rsvp"
                className="inline-block mt-4 px-6 py-3 text-xs tracking-widest uppercase"
                style={{ backgroundColor: "var(--v-burgundy)", color: "var(--v-cream)", fontFamily: "var(--font-inter)" }}
              >
                Reserve Your Place →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
