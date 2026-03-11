import { getWeddingData } from "@/lib/site-settings";
import Link from "next/link";
import V3Frame from "@/components/v3/V3Frame";
import V3Plaque from "@/components/v3/V3Plaque";
import V3RoomDivider from "@/components/v3/V3RoomDivider";

export const metadata = {
  title: "The Programme | Velvet Gallery",
  description: "Schedule for the Paine Wedding — September 26, 2026.",
};

export default async function V3DayPage() {
  const { wedding } = await getWeddingData();

  return (
    <div style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-24 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <p className="v3-label mb-4">Room I · The Wedding</p>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "var(--v-text)",
            lineHeight: 1.1,
          }}
        >
          Curator's Programme
        </h1>
        <p className="mt-4 v3-label">{wedding.date.display} · {wedding.venue.name}</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">

          {/* Left: Full programme list */}
          <div className="md:col-span-2">
            <V3RoomDivider roomNumber="Programme" title="Schedule of Events" />

            <div className="space-y-0 mt-4">
              {wedding.schedule.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-0 group"
                  style={{ borderBottom: "1px solid var(--v-border)" }}
                >
                  {/* Time */}
                  <div
                    className="w-28 shrink-0 py-6 pr-5"
                    style={{ borderRight: "1px solid var(--v-border)" }}
                  >
                    <p className="v3-label" style={{ color: "var(--v-tan)" }}>
                      {item.time}
                    </p>
                  </div>

                  {/* Event */}
                  <div className="flex-1 py-6 pl-6">
                    <p className="v3-label mb-1.5" style={{ color: "var(--v-text-muted)" }}>
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3
                      style={{
                        fontFamily: "var(--font-playfair)",
                        fontSize: "1.2rem",
                        color: "var(--v-text)",
                        marginBottom: "6px",
                      }}
                    >
                      {item.title}
                    </h3>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)", lineHeight: 1.7 }}>
                      {item.description}
                    </p>
                    <p
                      className="mt-2"
                      style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: "var(--v-text-muted)", fontStyle: "italic" }}
                    >
                      {wedding.venue.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Note */}
            <div
              className="mt-8 p-5"
              style={{ border: "1px solid var(--v-border)", backgroundColor: "var(--v-surface)" }}
            >
              <p className="v3-label mb-2">A Note on Arrivals</p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)", lineHeight: 1.7 }}>
                Doors open at 4:30 PM. Please arrive early to find your seat — the ceremony will begin promptly and late arrivals will not be seated after it starts.
              </p>
            </div>
          </div>

          {/* Right: Venue card + facts */}
          <div className="space-y-8">
            {/* Venue as host institution card in V3Frame */}
            <div>
              <p className="v3-label mb-4">Host Institution</p>
              <V3Frame
                caption={wedding.venue.name}
                captionSub="Celeste, Texas · Est. 2026"
                matPadding={16}
                className="w-full"
              >
                <div className="p-2 space-y-4 text-sm">
                  <div>
                    <p className="v3-label mb-1">Address</p>
                    <p style={{ fontFamily: "var(--font-inter)", color: "var(--v-text)" }}>
                      {wedding.venue.address}
                    </p>
                    <p style={{ fontFamily: "var(--font-inter)", color: "var(--v-text)" }}>
                      {wedding.venue.city}
                    </p>
                  </div>
                  <div>
                    <p className="v3-label mb-1">Ceremony</p>
                    <p style={{ fontFamily: "var(--font-inter)", color: "var(--v-text)" }}>
                      {wedding.venue.ceremonyTime}
                    </p>
                  </div>
                  <div>
                    <p className="v3-label mb-1">Parking</p>
                    <p style={{ fontFamily: "var(--font-inter)", color: "var(--v-text-muted)", lineHeight: 1.6, fontSize: "0.78rem" }}>
                      {wedding.venue.parking}
                    </p>
                  </div>
                </div>
              </V3Frame>

              <a
                href={wedding.venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center mt-4 py-3 text-xs tracking-widest uppercase"
                style={{ border: "1px solid var(--v-navy)", color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
              >
                Get Directions →
              </a>
            </div>

            {/* Plaque facts */}
            <div className="space-y-0">
              {[
                { label: "Date", value: wedding.date.display },
                { label: "Dress Code", value: wedding.dresscode.short },
                { label: "Bar", value: "Beer & Wine, Open" },
                { label: "Children", value: "Adults Only" },
                { label: "RSVP By", value: wedding.date.rsvpDeadline },
              ].map((fact) => (
                <div
                  key={fact.label}
                  className="flex justify-between py-3"
                  style={{ borderBottom: "1px solid var(--v-border)" }}
                >
                  <span className="v3-label">{fact.label}</span>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text)" }}>
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/v3/rsvp"
              className="block text-center py-3 text-xs tracking-widest uppercase"
              style={{ backgroundColor: "var(--v-navy)", color: "var(--v-cream)", fontFamily: "var(--font-inter)" }}
            >
              Reserve Your Place →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
