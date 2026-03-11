import { getWeddingData } from "@/lib/site-settings";
import Link from "next/link";

export const metadata = {
  title: "Getting There | Paper Atlas",
  description: "Travel guide for the Paine Wedding — September 26, 2026.",
};

export default async function V2TravelPage() {
  const { wedding } = await getWeddingData();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-20 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Chapter Four
          </p>
          <h1 className="text-5xl md:text-7xl mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)", lineHeight: 1.1 }}>
            Getting There
          </h1>
          <p className="text-base" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Celeste, Texas &nbsp;·&nbsp; September 26, 2026
          </p>
          <p className="mt-3 text-lg" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            the final leg of the journey ↓
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Airports — departure board style */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
            <span className="text-xs tracking-widest uppercase px-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              Arriving By Air
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
          </div>

          {/* Departure board header */}
          <div
            className="hidden md:grid grid-cols-4 gap-4 px-5 py-2 mb-1 text-xs tracking-widest uppercase"
            style={{ backgroundColor: "var(--v-navy)", color: "#c8d8e8", fontFamily: "var(--font-inter)" }}
          >
            <span>Airport</span>
            <span>Code</span>
            <span>Drive Time</span>
            <span>Status</span>
          </div>

          <div className="space-y-px">
            {wedding.travel.airports.map((airport, index) => (
              <div
                key={index}
                className="p-5"
                style={{ backgroundColor: "var(--v-surface)", border: "1px solid var(--v-border)" }}
              >
                {/* Mobile layout */}
                <div className="md:hidden">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span
                        className="text-3xl font-bold block"
                        style={{ fontFamily: "var(--font-playfair)", color: "var(--v-navy)" }}
                      >
                        {airport.code}
                      </span>
                      <span className="text-sm" style={{ color: "var(--v-text)", fontFamily: "var(--font-inter)" }}>
                        {airport.name}
                      </span>
                    </div>
                    <div
                      className="text-xs tracking-widest uppercase px-2 py-1"
                      style={{ border: "1px dashed var(--v-tan)", color: "var(--v-tan)", fontFamily: "var(--font-inter)" }}
                    >
                      On Time
                    </div>
                  </div>
                  <p className="text-sm" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                    {airport.description}
                  </p>
                  <a
                    href={airport.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-widest uppercase mt-3 inline-block"
                    style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
                  >
                    Airport Info →
                  </a>
                </div>

                {/* Desktop layout — board style */}
                <div className="hidden md:grid grid-cols-4 gap-4 items-center">
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--v-text)", fontFamily: "var(--font-inter)" }}>
                      {airport.name}
                    </p>
                    <a
                      href={airport.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs"
                      style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
                    >
                      Airport Info →
                    </a>
                  </div>
                  <span
                    className="text-3xl font-bold"
                    style={{ fontFamily: "var(--font-playfair)", color: "var(--v-navy)" }}
                  >
                    {airport.code}
                  </span>
                  <span className="text-sm" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                    {index === 0 ? "~1 hour" : "~1–1.5 hours"}
                  </span>
                  <div
                    className="text-xs tracking-widest uppercase px-2 py-1 inline-block"
                    style={{ border: "1px dashed var(--v-tan)", color: "var(--v-tan)", fontFamily: "var(--font-inter)" }}
                  >
                    On Time
                  </div>
                </div>

                {/* Description below on desktop */}
                <p className="hidden md:block text-sm mt-3 pt-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)", borderTop: "1px dashed var(--v-border)" }}>
                  {airport.description}
                </p>
              </div>
            ))}
          </div>

          {/* Caveat annotation */}
          <p className="text-base mt-4 text-right pr-2" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            both work great — pick what suits you ↗
          </p>
        </section>

        {/* Driving directions */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
            <span className="text-xs tracking-widest uppercase px-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              By Road
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { from: "Dallas (DAL)", time: "~1 hour", note: "Head northeast on US-75 N toward McKinney, then east on TX-34." },
              { from: "DFW Airport", time: "~1–1.5 hrs", note: "Head northeast on TX-183 E, then north on US-75 toward McKinney." },
              { from: "Greenville, TX", time: "~30 min", note: "Closest major town — head south on TX-34 toward Celeste." },
            ].map((route) => (
              <div
                key={route.from}
                className="v2-stamp"
                style={{ borderColor: "var(--v-border)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                  style={{ backgroundColor: "var(--v-navy)", color: "#fbf8f4" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 14 8 14s8-8.75 8-14a8 8 0 0 0-8-8z" />
                  </svg>
                </div>
                <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  From
                </p>
                <p className="font-semibold mb-1" style={{ color: "var(--v-text)", fontFamily: "var(--font-playfair)", fontSize: "1.1rem" }}>
                  {route.from}
                </p>
                <p className="text-sm font-medium mb-2" style={{ color: "var(--v-tan)", fontFamily: "var(--font-inter)" }}>
                  {route.time}
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  {route.note}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <a
              href={wedding.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 text-xs tracking-widest uppercase transition-colors"
              style={{ border: "1px solid var(--v-navy)", color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
            >
              Open in Google Maps →
            </a>
          </div>
        </section>

        {/* Where to Stay */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
            <span className="text-xs tracking-widest uppercase px-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              Where to Stay
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
          </div>

          {wedding.hotels.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {wedding.hotels.map((hotel, index) => (
                <div key={index} className="v2-stamp" style={{ borderColor: "var(--v-border)" }}>
                  <h3 className="text-lg mb-1" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                    {hotel.name}
                  </h3>
                  <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--v-tan)", fontFamily: "var(--font-inter)" }}>
                    {hotel.distance}
                  </p>
                  <p className="text-sm mb-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                    {hotel.description}
                  </p>
                  {hotel.bookingUrl && hotel.bookingUrl !== "TODO" && (
                    <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs tracking-widest uppercase" style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}>
                      Book Now →
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              className="p-8 text-center"
              style={{ border: "1px dashed var(--v-border)", backgroundColor: "var(--v-surface)" }}
            >
              <p className="text-base mb-2" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)", fontSize: "1.3rem" }}>
                Hotel list coming soon!
              </p>
              <p className="text-sm mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                We're curating lodging options near Celeste, TX. In the meantime, we suggest checking hotels in
                <strong style={{ color: "var(--v-text)" }}> Greenville</strong> (~30 min) or
                <strong style={{ color: "var(--v-text)" }}> McKinney</strong> (~45 min).
              </p>
              <p className="text-sm" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                If you plan to enjoy the open bar, we strongly recommend booking a hotel nearby and arranging a rideshare.
              </p>
            </div>
          )}
        </section>

        {/* While you're in town — Dallas picks */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
            <span className="text-xs tracking-widest uppercase px-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              While You're In Town
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
          </div>

          <p className="text-center text-sm mb-8" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Make a weekend of it — Dallas has plenty to explore.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { category: "Food & Drink", icon: "🍽", picks: ["Uptown Dallas", "Deep Ellum", "Bishop Arts District"] },
              { category: "Culture", icon: "🎭", picks: ["Dallas Museum of Art", "Perot Museum", "The Sixth Floor Museum"] },
              { category: "Outdoors", icon: "🌿", picks: ["Arbor Hills Nature Preserve", "White Rock Lake", "Klyde Warren Park"] },
              { category: "Day Trips", icon: "🗺", picks: ["McKinney Town Square", "Granbury Historic District", "Waxahachie"] },
            ].map((section) => (
              <div
                key={section.category}
                className="v2-stamp"
                style={{ borderColor: "var(--v-border)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">{section.icon}</span>
                  <h3 className="text-sm tracking-widest uppercase font-medium" style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}>
                    {section.category}
                  </h3>
                </div>
                <ul className="space-y-1">
                  {section.picks.map((pick) => (
                    <li key={pick} className="flex items-center gap-2 text-sm" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                      <span style={{ color: "var(--v-tan)" }}>·</span>
                      {pick}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="text-center pt-4">
          <p className="text-lg mb-6" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            Ready to confirm your trip?
          </p>
          <Link
            href="/v2/rsvp"
            className="inline-block px-8 py-3 text-xs tracking-widest uppercase"
            style={{ backgroundColor: "var(--v-navy)", color: "#fbf8f4", fontFamily: "var(--font-inter)" }}
          >
            RSVP Now →
          </Link>
        </div>
      </div>
    </div>
  );
}
