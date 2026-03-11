import { getWeddingData } from "@/lib/site-settings";

export const metadata = { title: "Getting There | Midnight Editorial" };

export default async function V1TravelPage() {
  const { wedding } = await getWeddingData();

  return (
    <div className="v1-theme">
      {/* ── Header ─────────────────────────────────── */}
      <section className="px-8 pt-24 pb-16" style={{ background: "linear-gradient(180deg, #0d1e30 0%, #08111d 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="uppercase tracking-widest mb-4"
            style={{ fontSize: "11px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Chapter IV
          </p>
          <h1 className="font-bold italic leading-none"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(60px, 9vw, 110px)",
              color: "var(--v-cream)",
            }}>
            Getting<br />There
          </h1>
          <div className="mt-6 w-16 h-px" style={{ backgroundColor: "var(--v-burgundy)" }} />
          <p className="mt-6 max-w-xl"
            style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--v-text-muted)", lineHeight: "1.7" }}>
            {wedding.venue.name} &mdash; {wedding.venue.fullAddress}
          </p>
        </div>
      </section>

      {/* ── Airports ────────────────────────────────── */}
      <section className="px-8 py-16" style={{ borderTop: "1px solid var(--v-border)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="uppercase tracking-widest mb-10"
            style={{ fontSize: "10px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Arriving by Air
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {wedding.travel.airports.map((airport, idx) => (
              <div key={idx} className="p-8 border"
                style={{
                  backgroundColor: "var(--v-surface)",
                  borderColor: "var(--v-border)",
                  borderTopColor: idx === 0 ? "var(--v-burgundy)" : "var(--v-tan)",
                  borderTopWidth: "2px",
                }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="uppercase tracking-widest mb-1"
                      style={{ fontSize: "9px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                      {idx === 0 ? "Closest Option" : "More Flights"}
                    </p>
                    <h3 className="font-bold"
                      style={{ fontFamily: "var(--font-playfair)", fontSize: "26px", color: "var(--v-cream)" }}>
                      {airport.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="font-bold"
                      style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "36px",
                        color: idx === 0 ? "var(--v-burgundy)" : "var(--v-tan)",
                        lineHeight: "1",
                      }}>
                      {airport.code}
                    </div>
                  </div>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--v-text-muted)", lineHeight: "1.7" }}>
                  {airport.description}
                </p>
                <a href={airport.url} target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-6 uppercase tracking-widest"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "10px",
                    color: "var(--v-tan)",
                    borderBottom: "1px solid var(--v-tan)",
                    paddingBottom: "2px",
                  }}>
                  Airport Info →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Driving ─────────────────────────────────── */}
      <section className="px-8 py-16" style={{ borderTop: "1px solid var(--v-border)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="uppercase tracking-widest mb-10"
            style={{ fontSize: "10px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            By Road
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { from: "Dallas", approx: "~1 hr", note: "Head northeast on US-75" },
              { from: "DFW Airport", approx: "~1.5 hrs", note: "Take I-635 east to US-75 north" },
              { from: "Greenville", approx: "~30 min", note: "Head north on US-69" },
            ].map(({ from, approx, note }) => (
              <div key={from} className="p-6 border"
                style={{ backgroundColor: "var(--v-surface)", borderColor: "var(--v-border)" }}>
                <p className="uppercase tracking-widest mb-2"
                  style={{ fontSize: "9px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  From {from}
                </p>
                <div className="font-bold mb-2"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "32px", color: "var(--v-tan)" }}>
                  {approx}
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)" }}>
                  {note}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-start">
            <a href={wedding.venue.mapsUrl} target="_blank" rel="noopener noreferrer"
              className="v1-btn-primary inline-block" style={{ fontSize: "11px" }}>
              Open in Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* ── Hotels ──────────────────────────────────── */}
      <section className="px-8 py-16" style={{ borderTop: "1px solid var(--v-border)" }}>
        <div className="max-w-5xl mx-auto">
          <p className="uppercase tracking-widest mb-4"
            style={{ fontSize: "10px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Where to Stay
          </p>
          <h2 className="font-bold italic mb-10"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px, 4vw, 48px)", color: "var(--v-cream)" }}>
            Lodging Near Celeste
          </h2>

          {wedding.hotels.length > 0 ? (
            <div className="space-y-4">
              {wedding.hotels.map((hotel, idx) => (
                <div key={idx} className="p-6 border flex items-start justify-between gap-6"
                  style={{ backgroundColor: "var(--v-surface)", borderColor: "var(--v-border)" }}>
                  <div>
                    <h3 className="font-bold mb-1"
                      style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "var(--v-cream)" }}>
                      {hotel.name}
                    </h3>
                    <p className="mb-2"
                      style={{ fontFamily: "var(--font-inter)", fontSize: "11px", color: "var(--v-tan)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                      {hotel.distance} from venue
                    </p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--v-text-muted)", lineHeight: "1.6" }}>
                      {hotel.description}
                    </p>
                  </div>
                  <a href={hotel.bookingUrl} target="_blank" rel="noopener noreferrer"
                    className="v1-btn-outline flex-shrink-0" style={{ fontSize: "10px", whiteSpace: "nowrap" }}>
                    Book Now
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-10 border text-center"
              style={{ backgroundColor: "var(--v-surface)", borderColor: "var(--v-border)" }}>
              <p className="font-bold italic mb-3"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "var(--v-cream)" }}>
                Hotel recommendations coming soon
              </p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--v-text-muted)" }}>
                We recommend searching for hotels in Greenville, TX (closest town) or McKinney, TX.
                Greenville is about 20 minutes from the venue and has several chain hotel options.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Rideshare Note ──────────────────────────── */}
      <section className="px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="p-8 border-l-2 flex gap-6 items-start"
            style={{ backgroundColor: "var(--v-surface)", borderColor: "var(--v-burgundy)" }}>
            <div className="flex-1">
              <p className="uppercase tracking-widest mb-3"
                style={{ fontSize: "9px", color: "var(--v-burgundy)", fontFamily: "var(--font-inter)" }}>
                Open Bar Advisory
              </p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--v-text-muted)", lineHeight: "1.7" }}>
                We will have a beer and wine open bar at the reception.
                If you plan to enjoy the festivities, we strongly recommend arranging a rideshare or
                designated driver in advance. Celeste is a small town — plan ahead!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
