import { getWeddingData } from "@/lib/site-settings";
import Link from "next/link";

export default async function V1Home() {
  const { wedding, images } = await getWeddingData();

  const facts = [
    { label: "Date", value: wedding.date.display },
    { label: "Ceremony", value: wedding.venue.ceremonyTime },
    { label: "Dress Code", value: wedding.dresscode.short },
    { label: "Venue", value: wedding.venue.name },
    { label: "RSVP By", value: wedding.date.rsvpDeadline },
    { label: "Bar", value: "Open Bar" },
  ];

  const paths = [
    {
      folio: "01",
      label: "Essentials",
      title: "The Basics",
      desc: "Date, venue, schedule, attire — everything at a glance.",
      href: "/v1/day",
    },
    {
      folio: "02",
      label: "Our Story",
      title: "How We Got Here",
      desc: "Four chapters. Two cities. One very long drive.",
      href: "/v1/story",
    },
    {
      folio: "03",
      label: "Travel",
      title: "Getting There",
      desc: "Airports, hotels, and everything you need for the trip.",
      href: "/v1/travel",
    },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ height: "100svh", minHeight: 600 }}
      >
        {/* Background photo */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('${images.hero.main}'), url('${images.hero.fallback}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Dark overlays */}
        <div className="absolute inset-0" style={{ background: "rgba(8,17,29,0.55)" }} />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(8,17,29,0.2) 0%, rgba(8,17,29,0.65) 100%)" }}
        />

        {/* Folio corner */}
        <span
          className="absolute bottom-10 right-10 font-heading text-[7rem] font-black leading-none select-none hidden md:block"
          style={{ color: "rgba(30,52,80,0.5)" }}
        >
          01
        </span>

        {/* Burgundy rule — left edge */}
        <div
          className="absolute left-0 top-1/4 bottom-1/4 w-px hidden md:block"
          style={{ background: "#7c1f28" }}
        />

        {/* Content */}
        <div className="relative z-10 text-center px-6 space-y-8">
          <p className="v1-label" style={{ color: "#8a9ab5", letterSpacing: "0.3em" }}>
            {wedding.date.dayOfWeek} &nbsp;·&nbsp; {wedding.date.display}
          </p>
          <h1
            className="font-heading font-black leading-[0.9] tracking-tight"
            style={{
              fontSize: "clamp(3.5rem, 10vw, 9rem)",
              color: "#f0e7dd",
            }}
          >
            {wedding.couple.bride.first}
            <span style={{ color: "#7c1f28" }}> &amp; </span>
            {wedding.couple.groom.first}
          </h1>
          <p className="v1-label" style={{ color: "#8a9ab5" }}>
            {wedding.venue.name} &nbsp;·&nbsp; {wedding.venue.cityDisplay}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/v1/rsvp" className="v1-btn-primary">RSVP</Link>
            <Link href="/v1/day" className="v1-btn-outline">Explore</Link>
          </div>
        </div>
      </section>

      {/* ── CHOOSE YOUR PATH ── */}
      <section className="py-24 px-6" style={{ background: "#08111d" }}>
        <div className="max-w-6xl mx-auto">
          <p className="v1-label text-center mb-16" style={{ color: "#4a5a70" }}>
            Where would you like to begin?
          </p>
          <div className="grid md:grid-cols-3 gap-px" style={{ background: "#1e3450" }}>
            {paths.map((p) => (
              <Link
                key={p.folio}
                href={p.href}
                className="group relative flex flex-col justify-between p-10 transition-colors"
                style={{ background: "#08111d", minHeight: 280 }}
              >
                {/* Hover burgundy left rule */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                  style={{ background: "#7c1f28" }}
                />
                <div>
                  <span
                    className="font-heading font-black text-7xl leading-none block mb-6"
                    style={{ color: "#1e3450" }}
                  >
                    {p.folio}
                  </span>
                  <p className="v1-label mb-3" style={{ color: "#4a5a70" }}>{p.label}</p>
                  <h2
                    className="font-heading text-3xl mb-3 transition-colors group-hover:text-[#c89a73]"
                    style={{ color: "#f0e7dd" }}
                  >
                    {p.title}
                  </h2>
                  <p style={{ color: "#8a9ab5", fontSize: "0.9rem", lineHeight: 1.6 }}>
                    {p.desc}
                  </p>
                </div>
                <span className="v1-label mt-6 transition-colors group-hover:text-[#7c1f28]" style={{ color: "#2a3a50" }}>
                  Continue →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ESSENTIAL FACTS RIBBON ── */}
      <section
        className="py-5 overflow-x-auto"
        style={{ background: "#0d1e30", borderTop: "1px solid #7c1f28", borderBottom: "1px solid #7c1f28" }}
      >
        <div className="flex items-center gap-0 min-w-max px-6 md:px-12 mx-auto">
          {facts.map((f, i) => (
            <div key={f.label} className="flex items-center">
              <div className="px-6 md:px-10 text-center">
                <p className="v1-label" style={{ color: "#4a5a70" }}>{f.label}</p>
                <p
                  className="font-heading mt-1 text-sm md:text-base"
                  style={{ color: "#f0e7dd" }}
                >
                  {f.value}
                </p>
              </div>
              {i < facts.length - 1 && (
                <div className="w-px h-8 flex-shrink-0" style={{ background: "#1e3450" }} />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── STORY TEASER ── */}
      <section className="relative overflow-hidden" style={{ background: "#08111d" }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-5">
          {/* Text — 2/5 */}
          <div
            className="md:col-span-2 flex flex-col justify-center px-8 md:px-14 py-20 md:py-28 relative"
          >
            {/* Left burgundy rule */}
            <div
              className="absolute left-6 top-1/4 bottom-1/4 w-px hidden md:block"
              style={{ background: "#7c1f28" }}
            />
            <span
              className="font-heading font-black leading-none mb-6 block"
              style={{ fontSize: "5.5rem", color: "#1e3450" }}
            >
              02
            </span>
            <p className="v1-label mb-4" style={{ color: "#4a5a70" }}>
              Commerce, Texas &nbsp;·&nbsp; 2021
            </p>
            <h2
              className="font-heading font-black mb-6"
              style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)", color: "#f0e7dd", lineHeight: 1.05 }}
            >
              The Beginning
            </h2>
            <p style={{ color: "#8a9ab5", lineHeight: 1.75, fontSize: "0.9rem", maxWidth: "34ch" }}>
              An ice cream social, a mutual friend, and two people who weren&apos;t quite ready yet.
              Four chapters. Commerce to Celeste.
            </p>
            <Link
              href="/v1/story"
              className="v1-label mt-10 inline-flex items-center gap-2 transition-colors hover:text-[#7c1f28]"
              style={{ color: "#4a5a70" }}
            >
              Read the full story →
            </Link>
          </div>

          {/* Photo — 3/5 */}
          <div
            className="md:col-span-3 min-h-80 md:min-h-0"
            style={{
              backgroundImage: `url('${images.engagement.main}'), url('${images.engagement.fallback}')`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          />
        </div>
      </section>

      {/* ── DAY TEASER ── */}
      <section className="py-24 px-6" style={{ background: "#0d1e30" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <p className="v1-label mb-6" style={{ color: "#4a5a70" }}>September 26, 2026</p>
              <h2
                className="font-heading font-black mb-12"
                style={{ fontSize: "clamp(3rem, 5vw, 4.5rem)", color: "#f0e7dd", lineHeight: 1.0 }}
              >
                The Day
              </h2>
              <Link href="/v1/day" className="v1-btn-outline">
                Full Schedule
              </Link>
            </div>
            {/* Mini timeline */}
            <div className="space-y-0">
              {wedding.schedule.slice(0, 5).map((item, i) => (
                <div
                  key={item.time}
                  className="flex gap-6 pb-7 relative"
                >
                  {/* Timeline line */}
                  {i < 4 && (
                    <div
                      className="absolute left-[2.15rem] top-6 w-px"
                      style={{ bottom: 0, background: "#1e3450" }}
                    />
                  )}
                  {/* Dot */}
                  <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 mt-0.5 z-10"
                    style={{ background: "#7c1f28", borderColor: "#7c1f28" }}
                  />
                  <div>
                    <p className="v1-label" style={{ color: "#4a5a70" }}>{item.time}</p>
                    <p className="font-heading text-xl mt-1" style={{ color: "#f0e7dd" }}>
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
              <p className="v1-label pl-11" style={{ color: "#2a3a50" }}>
                + {wedding.schedule.length - 5} more
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLAY ── */}
      <section
        className="py-20 px-6"
        style={{ borderTop: "1px solid #1e3450", background: "#08111d" }}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="v1-label mb-3" style={{ color: "#4a5a70" }}>Interactive</p>
            <h2
              className="font-heading font-black"
              style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", color: "#f0e7dd", lineHeight: 1.05 }}
            >
              Play
            </h2>
            <p className="mt-4" style={{ color: "#8a9ab5", fontSize: "0.9rem", maxWidth: "44ch" }}>
              Painedle — our daily wedding Wordle — and Couple Trivia. How well do you know the story?
            </p>
          </div>
          <Link href="/v1/play" className="v1-btn-primary flex-shrink-0">
            Play Now
          </Link>
        </div>
      </section>
    </>
  );
}
