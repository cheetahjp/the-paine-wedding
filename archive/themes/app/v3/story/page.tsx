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
          {wedding.story.length} chapters · Commerce to Celeste
        </p>
      </div>

      {/* Chapters (Dynamic Mapping) */}
      <div className="max-w-5xl mx-auto">
        {wedding.story.map((story, i) => {
          const isEven = i % 2 === 0;
          const chapterNumeral = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"][i] || (i + 1).toString();

          return (
            <section
              key={i}
              className="py-20 px-6"
              style={{
                backgroundColor: i === wedding.story.length - 1 ? "var(--v-navy)" : "transparent",
                color: i === wedding.story.length - 1 ? "var(--v-cream)" : "var(--v-text)",
              }}
            >
              <V3RoomDivider roomNumber={`Room ${chapterNumeral}`} title={story.title} />

              <div className="grid md:grid-cols-2 gap-12 items-start mt-6">
                {/* ── Framed Portrait ── */}
                <div className={!isEven ? "md:order-2" : ""}>
                  <V3Frame
                    caption={story.title}
                    captionSub={`${story.year}`}
                    withLight
                    matPadding={i === wedding.story.length - 1 ? 12 : 14}
                    className="w-full"
                  >
                    <div className="relative w-full" style={{ paddingBottom: "125%" }}>
                      <Image
                        src={story.image}
                        alt={story.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </V3Frame>
                </div>

                {/* ── Plaque Text ── */}
                <div className={`space-y-6 ${!isEven ? "md:order-1" : ""}`}>
                  <div
                    style={
                      i === wedding.story.length - 1
                        ? { borderTop: "2px solid var(--v-burgundy)", paddingTop: "10px" }
                        : {}
                    }
                  >
                    {i === wedding.story.length - 1 ? (
                      <>
                        <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", color: "var(--v-cream)", marginBottom: "6px" }}>
                          {story.title}
                        </h3>
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--v-burgundy)" }}>
                          Chapter {chapterNumeral} · {story.year}
                        </p>
                      </>
                    ) : (
                      <V3Plaque
                        title={story.year}
                        medium={`Chapter ${chapterNumeral}`}
                      />
                    )}
                  </div>
                  
                  {story.description && (
                    <p style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.875rem",
                      color: i === wedding.story.length - 1 ? "#8a9ab5" : "var(--v-text-muted)",
                      lineHeight: 1.8
                    }}>
                      {story.description}
                    </p>
                  )}

                  {/* Add RSVP button on final step */}
                  {i === wedding.story.length - 1 && (
                    <Link
                      href="/v3/rsvp"
                      className="inline-block mt-4 px-6 py-3 text-xs tracking-widest uppercase"
                      style={{ backgroundColor: "var(--v-burgundy)", color: "var(--v-cream)", fontFamily: "var(--font-inter)" }}
                    >
                      Reserve Your Place →
                    </Link>
                  )}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
