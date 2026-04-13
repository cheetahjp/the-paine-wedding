import { getWeddingData } from "@/lib/site-settings";
import Link from "next/link";

export const metadata = {
  title: "The Itinerary | Paper Atlas",
  description: "The schedule for the Paine Wedding — September 26, 2026.",
};

export default async function V2DayPage() {
  const { wedding } = await getWeddingData();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-20 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <div className="max-w-2xl mx-auto">
          {/* Chapter label */}
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Chapter Three
          </p>

          {/* Postmark decoration */}
          <div className="inline-flex items-center justify-center mb-6">
            <div
              className="w-28 h-28 rounded-full flex flex-col items-center justify-center text-center"
              style={{
                border: "2px solid var(--v-navy)",
                borderStyle: "dashed",
                backgroundColor: "var(--v-surface)",
              }}
            >
              <span className="text-xs tracking-widest uppercase block" style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}>
                Sept 26
              </span>
              <span className="text-xl font-bold block" style={{ color: "var(--v-navy)", fontFamily: "var(--font-playfair)" }}>
                2026
              </span>
              <span className="text-xs tracking-widest uppercase block" style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}>
                Celeste, TX
              </span>
            </div>
          </div>

          <h1
            className="text-5xl md:text-7xl mb-4"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)", lineHeight: 1.1 }}
          >
            The Itinerary
          </h1>
          <p className="text-base" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            {wedding.venue.name} &nbsp;·&nbsp; {wedding.date.display}
          </p>
          {/* Caveat annotation */}
          <p className="mt-3 text-lg" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            plan accordingly ↓
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Left: Schedule itinerary */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
              <span className="text-xs tracking-widest uppercase px-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                Schedule of Events
              </span>
              <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
            </div>

            <div className="space-y-0">
              {wedding.schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-0 group"
                  style={{ borderBottom: "1px solid var(--v-border)" }}
                >
                  {/* Time column */}
                  <div
                    className="w-28 shrink-0 py-6 pr-5"
                    style={{ borderRight: "1px solid var(--v-border)" }}
                  >
                    <span
                      className="text-xs tracking-widest uppercase font-medium block"
                      style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
                    >
                      {item.time}
                    </span>
                  </div>

                  {/* Event details */}
                  <div className="flex-1 py-6 pl-6">
                    {/* Entry number */}
                    <span
                      className="text-xs tracking-widest uppercase block mb-1"
                      style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)", fontSize: "0.85rem" }}
                    >
                      {String(index + 1).padStart(2, "0")} ·
                    </span>
                    <h3
                      className="text-xl md:text-2xl mb-2"
                      style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
                    >
                      {item.description}
                    </p>
                    <p
                      className="text-xs mt-2 italic"
                      style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
                    >
                      {wedding.venue.name}, {wedding.venue.cityDisplay}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Open bar note */}
            <div
              className="mt-8 p-5 v2-stamp"
              style={{ borderColor: "var(--v-tan)" }}
            >
              <div className="flex gap-3 items-start">
                <span className="text-xl">🍺</span>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}>
                    Open Bar
                  </p>
                  <p className="text-sm" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                    Beer and wine will be served throughout the evening. Please arrange your own transportation if you plan to indulge — rideshare is recommended.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Destination card + quick facts */}
          <div className="space-y-6">
            {/* The Destination card */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  The Destination
                </span>
                <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
              </div>

              <div
                className="p-5"
                style={{
                  border: "1px solid var(--v-border)",
                  backgroundColor: "var(--v-surface)",
                }}
              >
                {/* Venue stamp */}
                <div
                  className="text-center py-4 mb-4"
                  style={{
                    borderBottom: "1px dashed var(--v-border)",
                  }}
                >
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--v-tan)", fontFamily: "var(--font-inter)" }}>
                    Venue
                  </p>
                  <h3
                    className="text-lg"
                    style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}
                  >
                    {wedding.venue.name}
                  </h3>
                </div>

                <div className="space-y-3 text-sm" style={{ fontFamily: "var(--font-inter)" }}>
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "var(--v-text-muted)" }}>
                      Address
                    </p>
                    <p style={{ color: "var(--v-text)" }}>{wedding.venue.address}</p>
                    <p style={{ color: "var(--v-text)" }}>{wedding.venue.city}</p>
                  </div>

                  <div>
                    <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "var(--v-text-muted)" }}>
                      Ceremony
                    </p>
                    <p style={{ color: "var(--v-text)" }}>{wedding.venue.ceremonyTime}</p>
                  </div>

                  <div>
                    <p className="text-xs tracking-widest uppercase mb-0.5" style={{ color: "var(--v-text-muted)" }}>
                      Parking
                    </p>
                    <p style={{ color: "var(--v-text)" }}>{wedding.venue.parking}</p>
                  </div>
                </div>

                <a
                  href={wedding.venue.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center mt-5 py-2.5 text-xs tracking-widest uppercase transition-colors"
                  style={{
                    border: "1px solid var(--v-navy)",
                    color: "var(--v-navy)",
                    fontFamily: "var(--font-inter)",
                    backgroundColor: "transparent",
                  }}
                >
                  Get Directions →
                </a>
              </div>
            </div>

            {/* Quick facts stamps */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
                <span className="text-xs tracking-widest uppercase" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  At a Glance
                </span>
                <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
              </div>

              {[
                { label: "Date", value: wedding.date.display },
                { label: "Day", value: wedding.date.dayOfWeek },
                { label: "Doors Open", value: "4:30 PM" },
                { label: "Ceremony", value: wedding.venue.ceremonyTime },
                { label: "Dress Code", value: wedding.dresscode.short },
                { label: "RSVP By", value: wedding.date.rsvpDeadline },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="flex justify-between items-center py-3"
                  style={{ borderBottom: "1px dashed var(--v-border)" }}
                >
                  <span className="text-xs tracking-widest uppercase" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                    {fact.label}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--v-text)", fontFamily: "var(--font-inter)" }}>
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Caveat note */}
            <p className="text-base text-center" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
              see you there! ✈
            </p>

            <Link
              href="/v2/rsvp"
              className="block text-center py-3 text-xs tracking-widest uppercase transition-colors"
              style={{
                backgroundColor: "var(--v-navy)",
                color: "#fbf8f4",
                fontFamily: "var(--font-inter)",
              }}
            >
              Confirm Your Journey →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
