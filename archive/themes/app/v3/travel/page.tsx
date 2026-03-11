import { getWeddingData } from "@/lib/site-settings";
import Link from "next/link";
import V3Frame from "@/components/v3/V3Frame";
import V3Plaque from "@/components/v3/V3Plaque";
import V3RoomDivider from "@/components/v3/V3RoomDivider";

export const metadata = {
  title: "Visitor Guide | Velvet Gallery",
  description: "Travel information for the Paine Wedding.",
};

export default async function V3TravelPage() {
  const { wedding } = await getWeddingData();

  return (
    <div style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-24 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <p className="v3-label mb-4">Room III · The Journey</p>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "var(--v-text)",
            lineHeight: 1.1,
          }}
        >
          Visitor Guide
        </h1>
        <p className="mt-4 v3-label">Getting to Celeste, Texas</p>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 space-y-16">

        {/* Airports — arrival instructions in plaque style */}
        <section>
          <V3RoomDivider roomNumber="Arrival" title="By Air" />

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {wedding.travel.airports.map((airport, index) => (
              <div key={index}>
                <V3Frame
                  matPadding={20}
                  className="w-full"
                >
                  <div className="text-center pb-4 mb-4" style={{ borderBottom: "1px solid var(--v-border)" }}>
                    <p
                      style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "3rem",
                        color: "var(--v-navy)",
                        lineHeight: 1,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {airport.code}
                    </p>
                    <p className="v3-label mt-1">{index === 0 ? "~1 hour" : "~1–1.5 hours"}</p>
                  </div>
                  <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)", lineHeight: 1.6 }}>
                    {airport.description}
                  </p>
                  <a
                    href={airport.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 text-xs tracking-widest uppercase block"
                    style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
                  >
                    Airport Info →
                  </a>
                </V3Frame>
                <V3Plaque
                  title={airport.name}
                  medium={`Airport · ${index === 0 ? "Dallas" : "DFW Metroplex"}`}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Driving — coordinates + route */}
        <section>
          <V3RoomDivider roomNumber="Arrival" title="By Road" />

          <div className="grid md:grid-cols-3 gap-5 mt-6">
            {[
              { from: "Dallas (DAL)", time: "~1 hour", coords: "32.8481° N, 96.8512° W" },
              { from: "DFW Airport", time: "~1–1.5 hrs", coords: "32.8998° N, 97.0403° W" },
              { from: "Greenville, TX", time: "~30 min", coords: "33.1373° N, 96.1108° W" },
            ].map((route) => (
              <div
                key={route.from}
                className="p-5"
                style={{ border: "1px solid var(--v-border)", backgroundColor: "var(--v-surface)" }}
              >
                <p className="v3-label mb-2">From</p>
                <h4 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", color: "var(--v-text)", marginBottom: "4px" }}>
                  {route.from}
                </h4>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-tan)", marginBottom: "8px" }}>
                  {route.time}
                </p>
                <p className="v3-label" style={{ color: "var(--v-text-muted)", fontStyle: "italic" }}>
                  {route.coords}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-6">
            <a
              href={wedding.venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-6 py-3 text-xs tracking-widest uppercase"
              style={{ border: "1px solid var(--v-navy)", color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
            >
              Open in Google Maps →
            </a>
          </div>
        </section>

        {/* Partner Accommodations */}
        <section>
          <V3RoomDivider roomNumber="Lodging" title="Partner Accommodations" />

          {wedding.hotels.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {wedding.hotels.map((hotel, i) => (
                <div key={i}>
                  <V3Frame matPadding={16} className="w-full">
                    <h4 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", color: "var(--v-text)", marginBottom: "4px" }}>
                      {hotel.name}
                    </h4>
                    <p className="v3-label mb-3">{hotel.distance}</p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)", lineHeight: 1.6 }}>
                      {hotel.description}
                    </p>
                    {hotel.bookingUrl !== "TODO" && (
                      <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer"
                        className="mt-3 text-xs tracking-widest uppercase block"
                        style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}>
                        Book Now →
                      </a>
                    )}
                  </V3Frame>
                  <V3Plaque title={hotel.name} medium="Partner Hotel" />
                </div>
              ))}
            </div>
          ) : (
            <div
              className="mt-6 p-8 text-center"
              style={{ border: "1px solid var(--v-border)", backgroundColor: "var(--v-surface)" }}
            >
              <p className="v3-label mb-3">Coming Soon</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", color: "var(--v-text)", marginBottom: "8px" }}>
                Accommodations List Pending
              </p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)", lineHeight: 1.7 }}>
                We are curating lodging options near Celeste, TX. In the meantime, we recommend checking hotels in{" "}
                <strong style={{ color: "var(--v-text)" }}>Greenville</strong> (~30 min) or{" "}
                <strong style={{ color: "var(--v-text)" }}>McKinney</strong> (~45 min).
                If you plan to enjoy the open bar, please arrange transportation in advance.
              </p>
            </div>
          )}
        </section>

        {/* Points of Interest */}
        <section>
          <V3RoomDivider roomNumber="Local Collection" title="Points of Interest" />

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            {[
              { category: "Dining & Culture", icon: "🍽", items: ["Uptown Dallas", "Deep Ellum", "Bishop Arts District"] },
              { category: "Museums & Arts", icon: "🎨", items: ["Dallas Museum of Art", "Perot Museum of Science", "The Sixth Floor Museum"] },
              { category: "Nature & Outdoors", icon: "🌿", items: ["Arbor Hills Nature Preserve", "White Rock Lake", "Klyde Warren Park"] },
              { category: "Day Excursions", icon: "🗺", items: ["McKinney Historic Square", "Granbury", "Waxahachie Courthouse Square"] },
            ].map((poi) => (
              <div
                key={poi.category}
                className="p-5"
                style={{ border: "1px solid var(--v-border)", backgroundColor: "var(--v-cream)" }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">{poi.icon}</span>
                  <p className="v3-label">{poi.category}</p>
                </div>
                <ul className="space-y-1.5">
                  {poi.items.map((item) => (
                    <li key={item} className="flex gap-2 items-center">
                      <span style={{ color: "var(--v-tan)", fontSize: "0.6rem" }}>◆</span>
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)" }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/v3/rsvp"
            className="inline-block px-8 py-3 text-xs tracking-widest uppercase"
            style={{ backgroundColor: "var(--v-navy)", color: "var(--v-cream)", fontFamily: "var(--font-inter)" }}
          >
            Reserve Your Place →
          </Link>
        </div>
      </div>
    </div>
  );
}
