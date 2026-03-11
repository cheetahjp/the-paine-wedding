import { getWeddingData } from "@/lib/site-settings";
import { IMAGES } from "@/lib/wedding-data";
import Image from "next/image";

export const metadata = { title: "Attire | Midnight Editorial" };

export default async function V1AttirePage() {
  const wedding = await getWeddingData();

  return (
    <div className="v1-theme">
      {/* ── Editorial Header ──────────────────────── */}
      <section
        className="relative px-8 pt-24 pb-20 overflow-hidden"
        style={{ background: "linear-gradient(180deg, #0d1e30 0%, #08111d 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase tracking-widest mb-4"
            style={{ fontSize: "11px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
          >
            Chapter V
          </p>
          <h1
            className="font-bold italic leading-none"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(60px, 9vw, 110px)",
              color: "var(--v-cream)",
            }}
          >
            What to<br />Wear
          </h1>
          <div className="mt-6 w-16 h-px" style={{ backgroundColor: "var(--v-burgundy)" }} />

          {/* Dress Code Feature Plaque */}
          <div
            className="mt-10 inline-flex items-center gap-6 px-8 py-5 border"
            style={{ backgroundColor: "var(--v-surface)", borderColor: "var(--v-burgundy)", borderWidth: "1px" }}
          >
            <div>
              <p
                className="uppercase tracking-widest mb-1"
                style={{ fontSize: "9px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
              >
                Dress Code
              </p>
              <p
                className="font-bold"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "28px", color: "var(--v-cream)" }}
              >
                {wedding.dresscode.short}
              </p>
            </div>
            <div
              className="w-px self-stretch"
              style={{ backgroundColor: "var(--v-border)" }}
            />
            <p
              className="max-w-xs"
              style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)", lineHeight: "1.6" }}
            >
              {wedding.dresscode.summary}
            </p>
          </div>
        </div>
      </section>

      {/* ── Ladies Section ───────────────────────── */}
      <section className="px-8 py-20" style={{ borderTop: "1px solid var(--v-border)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="lg:w-1/2">
              <p
                className="uppercase tracking-widest mb-3"
                style={{ fontSize: "9px", color: "var(--v-burgundy)", fontFamily: "var(--font-inter)" }}
              >
                For the Ladies
              </p>
              <h2
                className="font-bold italic mb-6"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(36px, 5vw, 54px)", color: "var(--v-cream)", lineHeight: "1.1" }}
              >
                Dressed to<br />Celebrate
              </h2>
              <p
                style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--v-text-muted)", lineHeight: "1.8" }}
              >
                {wedding.dresscode.ladies}
              </p>
              <div className="mt-8 space-y-3">
                {["Cocktail dresses", "Midi dresses", "Dressy jumpsuits", "Any color welcome", "No casual or beachwear"].map((tip) => (
                  <div key={tip} className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--v-burgundy)" }} />
                    <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)" }}>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-3 gap-3">
              {IMAGES.attire.ladies.map((src, i) => (
                <div key={i} className="aspect-[3/4] relative overflow-hidden" style={{ border: "1px solid var(--v-border)" }}>
                  <Image
                    src={src}
                    alt={`Ladies attire reference ${i + 1}`}
                    fill
                    className="object-cover"
                    onError={undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Burgundy Rule Divider ────────────────── */}
      <div className="px-8">
        <div className="max-w-5xl mx-auto h-px" style={{ backgroundColor: "var(--v-burgundy)", opacity: 0.3 }} />
      </div>

      {/* ── Gentlemen Section ────────────────────── */}
      <section className="px-8 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row-reverse gap-12 items-start">
            <div className="lg:w-1/2">
              <p
                className="uppercase tracking-widest mb-3"
                style={{ fontSize: "9px", color: "var(--v-tan)", fontFamily: "var(--font-inter)" }}
              >
                For the Gentlemen
              </p>
              <h2
                className="font-bold italic mb-6"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(36px, 5vw, 54px)", color: "var(--v-cream)", lineHeight: "1.1" }}
              >
                Sharp &amp;<br />Ready to Dance
              </h2>
              <p
                style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--v-text-muted)", lineHeight: "1.8" }}
              >
                {wedding.dresscode.gentlemen}
              </p>
              <div className="mt-8 space-y-3">
                {["Dress pants + button-down", "Blazer encouraged", "Suit &amp; tie welcome", "No shorts or casual wear", "Dance floor ready"].map((tip) => (
                  <div key={tip} className="flex items-center gap-3">
                    <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: "var(--v-tan)" }} />
                    <span
                      style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)" }}
                      dangerouslySetInnerHTML={{ __html: tip }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 grid grid-cols-3 gap-3">
              {IMAGES.attire.gents.map((src, i) => (
                <div key={i} className="aspect-[3/4] relative overflow-hidden" style={{ border: "1px solid var(--v-border)" }}>
                  <Image
                    src={src}
                    alt={`Gentlemen attire reference ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────── */}
      <section
        className="px-8 py-16"
        style={{ borderTop: "2px solid var(--v-burgundy)", borderBottom: "1px solid var(--v-border)" }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p
            className="font-bold italic"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "24px", color: "var(--v-cream)" }}
          >
            When in doubt — dress up.
          </p>
          <a href="/v1/rsvp" className="v1-btn-primary" style={{ fontSize: "11px" }}>
            RSVP Now
          </a>
        </div>
      </section>
    </div>
  );
}
