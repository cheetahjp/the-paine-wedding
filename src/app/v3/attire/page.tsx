import { getWeddingData } from "@/lib/site-settings";
import { IMAGES } from "@/lib/wedding-data";
import Image from "next/image";
import V3Frame from "@/components/v3/V3Frame";
import V3Plaque from "@/components/v3/V3Plaque";
import V3RoomDivider from "@/components/v3/V3RoomDivider";

export const metadata = {
  title: "Dress for the Exhibition | Velvet Gallery",
  description: "Attire guide for the Paine Wedding.",
};

export default async function V3AttirePage() {
  const { wedding } = await getWeddingData();

  return (
    <div style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-24 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <p className="v3-label mb-4">Dress Code · Attire Guide</p>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "var(--v-text)",
            lineHeight: 1.1,
          }}
        >
          Dress for the Exhibition
        </h1>
        <p className="mt-4 v3-label">Indoor ceremony & reception · September 26, 2026</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 space-y-16">

        {/* Featured dress code plaque */}
        <div className="text-center">
          <div
            className="inline-block px-10 py-8 text-center"
            style={{
              border: "2px solid var(--v-tan)",
              backgroundColor: "var(--v-cream)",
              maxWidth: "380px",
            }}
          >
            <p className="v3-label mb-3">Dress Code · As Requested by the Curators</p>
            <h2
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "2.5rem",
                color: "var(--v-navy)",
                letterSpacing: "0.06em",
                marginBottom: "12px",
              }}
            >
              {wedding.dresscode.short}
            </h2>
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)", lineHeight: 1.7 }}>
              {wedding.dresscode.summary}
            </p>
          </div>
        </div>

        {/* Ladies */}
        <section>
          <V3RoomDivider roomNumber="Gallery A" title="For the Ladies" />

          <div className="grid md:grid-cols-2 gap-12 items-start mt-6">
            <div className="grid grid-cols-3 gap-3">
              {IMAGES.attire.ladies.map((src, i) => (
                <div key={i}>
                  <V3Frame withLight matPadding={8} className="w-full">
                    <div className="relative w-full" style={{ paddingBottom: "145%" }}>
                      <Image
                        src={src}
                        alt={`Ladies attire ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </V3Frame>
                  <V3Plaque
                    title={["Cocktail Dress", "Midi Dress", "Dressy Jumpsuit"][i]}
                    medium="Reference"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-6">
              <V3Plaque
                title="Ladies' Gallery"
                medium="Cocktail · Semi-Formal"
                description={wedding.dresscode.ladies}
              />
              <div className="space-y-2">
                {[
                  "Cocktail, midi, or maxi dress",
                  "Dressy jumpsuit or pantsuit",
                  "Any color is welcome",
                  "Lighter fabrics recommended",
                  "No casual or beach attire",
                ].map((tip) => (
                  <div key={tip} className="flex gap-2 items-center">
                    <span style={{ color: "var(--v-tan)", fontSize: "0.55rem" }}>◆</span>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)" }}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gentlemen */}
        <section>
          <V3RoomDivider roomNumber="Gallery B" title="For the Gentlemen" />

          <div className="grid md:grid-cols-2 gap-12 items-start mt-6">
            <div className="space-y-6">
              <V3Plaque
                title="Gentlemen's Gallery"
                medium="Smart Casual · Semi-Formal"
                description={wedding.dresscode.gentlemen}
              />
              <div className="space-y-2">
                {[
                  "Dress pants + button-down or blazer",
                  "Suit and tie always welcome",
                  "Dress shoes only",
                  "No shorts or casual wear",
                  "Come ready to dance",
                ].map((tip) => (
                  <div key={tip} className="flex gap-2 items-center">
                    <span style={{ color: "var(--v-tan)", fontSize: "0.55rem" }}>◆</span>
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)" }}>
                      {tip}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {IMAGES.attire.gents.map((src, i) => (
                <div key={i}>
                  <V3Frame withLight matPadding={8} className="w-full">
                    <div className="relative w-full" style={{ paddingBottom: "145%" }}>
                      <Image
                        src={src}
                        alt={`Gents attire ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </V3Frame>
                  <V3Plaque
                    title={["Dress Pants", "Blazer & Tie", "Classic Suit"][i]}
                    medium="Reference"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing note */}
        <div
          className="p-8 text-center"
          style={{ border: "1px solid var(--v-border)", backgroundColor: "var(--v-surface)" }}
        >
          <p className="v3-label mb-3">From the Curators</p>
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.05rem",
              fontStyle: "italic",
              color: "var(--v-text)",
              lineHeight: 1.7,
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            "We want everyone to feel their best. Come dressed up, bring your dancing shoes, and get ready to celebrate with us."
          </p>
          <p className="v3-label mt-4" style={{ color: "var(--v-tan)" }}>— Ashlyn &amp; Jeffrey</p>
        </div>
      </div>
    </div>
  );
}
