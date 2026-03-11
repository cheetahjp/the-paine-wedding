import { getWeddingData } from "@/lib/site-settings";

export const metadata = { title: "The Day | Midnight Editorial" };

export default async function V1DayPage() {
  const wedding = await getWeddingData();

  return (
    <div className="v1-theme">
      {/* ── Page Header ─────────────────────────────── */}
      <section className="relative px-8 pt-24 pb-16 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, #0d1e30 0%, #08111d 100%)" }}
        />
        <div className="relative max-w-5xl mx-auto">
          <p
            className="uppercase tracking-widest mb-4"
            style={{ fontSize: "11px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
          >
            Chapter III
          </p>
          <h1
            className="font-bold italic leading-none"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(72px, 10vw, 120px)",
              color: "var(--v-cream)",
            }}
          >
            The Day
          </h1>
          <div
            className="mt-6 w-16 h-px"
            style={{ backgroundColor: "var(--v-burgundy)" }}
          />
          <p
            className="mt-6 max-w-xl"
            style={{
              fontFamily: "var(--font-inter)",
              fontSize: "15px",
              color: "var(--v-text-muted)",
              lineHeight: "1.7",
            }}
          >
            {wedding.date.dayOfWeek}, {wedding.date.display} &mdash;{" "}
            {wedding.venue.name}, {wedding.venue.cityDisplay}
          </p>
        </div>
      </section>

      {/* ── Main Content ─────────────────────────────── */}
      <section className="px-8 pb-24">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-16">

          {/* Timeline */}
          <div className="flex-1">
            <p
              className="uppercase tracking-widest mb-10"
              style={{ fontSize: "10px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
            >
              Schedule of Events
            </p>

            <div className="relative">
              {/* Vertical burgundy line */}
              <div
                className="absolute left-5 top-3 bottom-3 w-px"
                style={{ backgroundColor: "var(--v-burgundy)", opacity: 0.5 }}
              />

              <div className="space-y-0">
                {wedding.schedule.map((item, idx) => (
                  <div key={idx} className="relative flex gap-8 pb-10">
                    {/* Dot */}
                    <div className="relative flex-shrink-0 w-10 flex justify-center">
                      <div
                        className="mt-1 w-3 h-3 rounded-full border-2 z-10"
                        style={{
                          backgroundColor: "var(--v-burgundy)",
                          borderColor: "var(--v-burgundy)",
                          boxShadow: "0 0 0 3px #08111d",
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 pt-0">
                      <p
                        className="uppercase tracking-widest mb-1"
                        style={{
                          fontSize: "10px",
                          color: "var(--v-tan)",
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        {item.time}
                      </p>
                      <h3
                        className="font-bold mb-2"
                        style={{
                          fontFamily: "var(--font-playfair)",
                          fontSize: "clamp(22px, 3vw, 30px)",
                          color: "var(--v-cream)",
                          lineHeight: "1.1",
                        }}
                      >
                        {item.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--font-inter)",
                          fontSize: "14px",
                          color: "var(--v-text-muted)",
                          lineHeight: "1.7",
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-72 space-y-6">

            {/* Venue Card */}
            <div
              className="p-6 border"
              style={{
                backgroundColor: "var(--v-surface)",
                borderColor: "var(--v-border)",
                borderTopColor: "var(--v-burgundy)",
                borderTopWidth: "2px",
              }}
            >
              <p
                className="uppercase tracking-widest mb-4"
                style={{ fontSize: "9px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
              >
                The Venue
              </p>
              <h3
                className="font-bold mb-1"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "22px",
                  color: "var(--v-cream)",
                }}
              >
                {wedding.venue.name}
              </h3>
              <p
                className="mb-1"
                style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)" }}
              >
                {wedding.venue.address}
              </p>
              <p
                className="mb-6"
                style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)" }}
              >
                {wedding.venue.city}
              </p>
              <a
                href={wedding.venue.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="v1-btn-outline inline-block"
                style={{ fontSize: "11px", padding: "10px 20px" }}
              >
                Get Directions
              </a>
            </div>

            {/* Parking Card */}
            <div
              className="p-6 border"
              style={{
                backgroundColor: "var(--v-surface)",
                borderColor: "var(--v-border)",
              }}
            >
              <p
                className="uppercase tracking-widest mb-3"
                style={{ fontSize: "9px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
              >
                Parking
              </p>
              <p
                style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)", lineHeight: "1.7" }}
              >
                {wedding.venue.parking}
              </p>
            </div>

            {/* Quick Facts */}
            <div
              className="p-6 border"
              style={{
                backgroundColor: "var(--v-surface)",
                borderColor: "var(--v-border)",
              }}
            >
              <p
                className="uppercase tracking-widest mb-4"
                style={{ fontSize: "9px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
              >
                Quick Facts
              </p>
              {[
                { label: "Ceremony", value: wedding.venue.ceremonyTime },
                { label: "Cocktail Hour", value: wedding.venue.cocktailTime },
                { label: "Reception", value: wedding.venue.receptionTime },
                { label: "Send-Off", value: wedding.venue.sendOffTime },
                { label: "Dress Code", value: wedding.dresscode.short },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-baseline mb-3 last:mb-0">
                  <span
                    className="uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: "var(--v-text-muted)" }}
                  >
                    {label}
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-cream)" }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
