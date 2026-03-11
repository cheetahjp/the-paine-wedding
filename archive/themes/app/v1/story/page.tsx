import { getWeddingData } from "@/lib/site-settings";
import Link from "next/link";

// Chapter metadata layered on top of the dynamic story data
const chapterMeta = [
  {
    folio: "01",
    locationLabel: "Commerce, Texas · 2021",
    pullQuote: "She had been hoping for a chance to talk to him.",
    palette: { accent: "#c89a73" }, // tan — warmth of beginning
  },
  {
    folio: "02",
    locationLabel: "Long Distance · 2021–2024",
    pullQuote: "860 miles apart. Every other weekend.",
    palette: { accent: "#4a5a70" }, // slate — distance, quiet
  },
  {
    folio: "03",
    locationLabel: "Houston, Texas · 2024",
    pullQuote: "Four and a half hours to take her on a date.",
    palette: { accent: "#c89a73" }, // tan — return, warmth
  },
  {
    folio: "04",
    locationLabel: "Arbor Hills, Texas · February 2026",
    pullQuote: "Yes, yes, yes, yes — I will.",
    palette: { accent: "#7c1f28" }, // burgundy — celebration
  },
];

export default async function V1Story() {
  const { wedding, images } = await getWeddingData();

  return (
    <>
      {/* PAGE HEADER */}
      <section
        className="relative flex items-end px-6 md:px-14 pb-16 pt-32"
        style={{ background: "#08111d", borderBottom: "1px solid #1e3450", minHeight: 320 }}
      >
        <span
          className="absolute right-8 top-8 font-heading font-black leading-none select-none hidden md:block"
          style={{ fontSize: "10rem", color: "#0d1e30" }}
        >
          II
        </span>
        <div className="max-w-4xl">
          <p className="v1-label mb-4" style={{ color: "#4a5a70" }}>Four Chapters</p>
          <h1
            className="font-heading font-black leading-none"
            style={{ fontSize: "clamp(3.5rem, 7vw, 6rem)", color: "#f0e7dd" }}
          >
            Our Story
          </h1>
        </div>
      </section>

      {/* CHAPTERS */}
      {wedding.story.map((chapter, i) => {
        const meta = chapterMeta[i] ?? chapterMeta[0];
        const isEven = i % 2 === 0;

        return (
          <article key={i}>
            {/* Chapter title card */}
            <div
              className="relative px-6 md:px-14 py-16 flex items-center gap-10"
              style={{ background: i === 3 ? "#0d1e30" : "#08111d", borderBottom: "1px solid #1e3450" }}
            >
              {/* Burgundy left rule */}
              <div
                className="absolute left-0 top-4 bottom-4 w-0.5"
                style={{ background: meta.palette.accent }}
              />
              <span
                className="font-heading font-black leading-none flex-shrink-0 hidden md:block"
                style={{ fontSize: "6rem", color: "#1e3450" }}
              >
                {meta.folio}
              </span>
              <div>
                <p className="v1-label mb-3" style={{ color: "#4a5a70" }}>
                  Chapter {String(i + 1).padStart(2, "0")} &nbsp;·&nbsp; {meta.locationLabel}
                </p>
                <h2
                  className="font-heading font-black mb-4"
                  style={{
                    fontSize: "clamp(2.5rem, 4vw, 4rem)",
                    color: "#f0e7dd",
                    lineHeight: 1.05,
                  }}
                >
                  {chapter.title}
                </h2>
                <p
                  className="font-heading italic"
                  style={{ fontSize: "1.35rem", color: meta.palette.accent, maxWidth: "50ch" }}
                >
                  &ldquo;{meta.pullQuote}&rdquo;
                </p>
              </div>
            </div>

            {/* Photo + text split */}
            <div
              className={`grid md:grid-cols-2 ${isEven ? "" : "md:direction-rtl"}`}
              style={{ background: "#08111d" }}
            >
              {/* Photo */}
              <div
                className={`min-h-72 md:min-h-96 ${isEven ? "md:order-2" : "md:order-1"}`}
                style={{
                  backgroundImage: `url('${chapter.image}'), url('${chapter.imageFallback}')`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              {/* Text */}
              <div
                className={`flex flex-col justify-center px-8 md:px-16 py-16 ${isEven ? "md:order-1" : "md:order-2"}`}
                style={{ background: "#0d1e30" }}
              >
                <p
                  className="font-heading text-3xl font-bold mb-2"
                  style={{ color: meta.palette.accent }}
                >
                  {chapter.year}
                </p>
                <p
                  className="leading-relaxed"
                  style={{ color: "#8a9ab5", lineHeight: 1.85, fontSize: "0.95rem" }}
                >
                  {chapter.description}
                </p>
              </div>
            </div>
          </article>
        );
      })}

      {/* CTA */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "#0d1e30", borderTop: "1px solid #7c1f28" }}
      >
        <p className="v1-label mb-6" style={{ color: "#4a5a70" }}>September 26, 2026</p>
        <h2
          className="font-heading font-black mb-10"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#f0e7dd" }}
        >
          The Next Chapter Starts Here.
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/v1/rsvp" className="v1-btn-primary">RSVP Now</Link>
          <Link href="/v1/day" className="v1-btn-outline">See the Day</Link>
        </div>
      </section>
    </>
  );
}
