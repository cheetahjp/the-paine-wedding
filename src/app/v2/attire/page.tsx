import { getWeddingData } from "@/lib/site-settings";
import { IMAGES } from "@/lib/wedding-data";
import Image from "next/image";

export const metadata = {
  title: "What to Wear | Paper Atlas",
  description: "Attire guide for the Paine Wedding — September 26, 2026.",
};

export default async function V2AttirePage() {
  const { wedding } = await getWeddingData();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-20 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Chapter Five · Packing List
          </p>
          <h1 className="text-5xl md:text-7xl mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)", lineHeight: 1.1 }}>
            What to Wear
          </h1>
          <p className="text-base" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Semi-formal · Indoor ceremony &amp; reception
          </p>
          <p className="mt-3 text-xl" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            when in doubt, dress up ↑
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Dress code stamp card */}
        <div className="text-center">
          <div
            className="inline-block px-10 py-8"
            style={{
              border: "2px dashed var(--v-navy)",
              backgroundColor: "var(--v-surface)",
              maxWidth: "420px",
            }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: "var(--v-navy)", color: "#fbf8f4" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              Dress Code
            </p>
            <h2 className="text-4xl mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-navy)" }}>
              {wedding.dresscode.short}
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              {wedding.dresscode.summary}
            </p>
          </div>
        </div>

        {/* Ladies section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
            <span className="text-xs tracking-widest uppercase px-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              For the Ladies
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="text-2xl mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                Cocktail &amp; Beyond
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                {wedding.dresscode.ladies}
              </p>
              <div className="space-y-2">
                {[
                  "Cocktail, midi, or maxi dress",
                  "Dressy jumpsuit or pantsuit",
                  "Any color welcome",
                  "Lighter fabrics for the Texas heat",
                  "Comfortable heels or dressy flats",
                ].map((tip) => (
                  <div key={tip} className="flex items-center gap-2 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                    <span style={{ color: "var(--v-tan)" }}>✓</span>
                    <span style={{ color: "var(--v-text)" }}>{tip}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-base" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
                you'll look beautiful ✨
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {IMAGES.attire.ladies.map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden"
                  style={{
                    paddingBottom: "140%",
                    border: "6px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transform: i === 1 ? "rotate(-1deg)" : i === 2 ? "rotate(0.5deg)" : "rotate(-0.5deg)",
                  }}
                >
                  <Image
                    src={src}
                    alt={`Ladies attire inspiration ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gentlemen section */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
            <span className="text-xs tracking-widest uppercase px-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              For the Gentlemen
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="grid grid-cols-3 gap-2 md:order-1">
              {IMAGES.attire.gents.map((src, i) => (
                <div
                  key={i}
                  className="relative overflow-hidden"
                  style={{
                    paddingBottom: "140%",
                    border: "6px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transform: i === 0 ? "rotate(0.5deg)" : i === 2 ? "rotate(-0.5deg)" : "rotate(1deg)",
                  }}
                >
                  <Image
                    src={src}
                    alt={`Gents attire inspiration ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="md:order-2">
              <h3 className="text-2xl mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                Dressed to Impress
              </h3>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                {wedding.dresscode.gentlemen}
              </p>
              <div className="space-y-2">
                {[
                  "Dress pants + button-down or blazer",
                  "Suit and tie (always welcome)",
                  "Dress shoes — no sneakers or boots",
                  "No shorts or casual wear",
                  "Come ready to hit the dance floor",
                ].map((tip) => (
                  <div key={tip} className="flex items-center gap-2 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                    <span style={{ color: "var(--v-tan)" }}>✓</span>
                    <span style={{ color: "var(--v-text)" }}>{tip}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-base" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
                sharp & ready to celebrate ✦
              </p>
            </div>
          </div>
        </section>

        {/* Final note stamp */}
        <div
          className="v2-stamp text-center py-8"
          style={{ borderColor: "var(--v-border)", maxWidth: "480px", margin: "0 auto" }}
        >
          <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            A Note from the Couple
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--v-text)", fontFamily: "var(--font-inter)" }}>
            Both the ceremony and reception are indoors — and late September in Texas can still be warm.
            We want you to feel comfortable and look great. When in doubt: dress up, have fun with it,
            and come ready to celebrate!
          </p>
          <p className="mt-4 text-lg" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            — Ashlyn &amp; Jeffrey
          </p>
        </div>
      </div>
    </div>
  );
}
