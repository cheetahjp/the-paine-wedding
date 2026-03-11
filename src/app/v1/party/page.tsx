import { getWeddingData } from "@/lib/site-settings";
import Image from "next/image";

export const metadata = { title: "The Party | Midnight Editorial" };

export default async function V1PartyPage() {
  const wedding = await getWeddingData();
  const { bridesmaids, groomsmen } = wedding.bridalParty;

  const moh = bridesmaids[0];
  const bestMan = groomsmen[0];
  const restBridesmaids = bridesmaids.slice(1);
  const restGroomsmen = groomsmen.slice(1);

  return (
    <div className="v1-theme">
      {/* ── Header ────────────────────────────────── */}
      <section
        className="px-8 pt-24 pb-16"
        style={{ background: "linear-gradient(180deg, #0d1e30 0%, #08111d 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase tracking-widest mb-4"
            style={{ fontSize: "11px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
          >
            Chapter VI
          </p>
          <h1
            className="font-bold italic leading-none"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(64px, 9vw, 110px)",
              color: "var(--v-cream)",
            }}
          >
            Our People
          </h1>
          <div className="mt-6 w-16 h-px" style={{ backgroundColor: "var(--v-burgundy)" }} />
          <p
            className="mt-6 max-w-xl"
            style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--v-text-muted)", lineHeight: "1.7" }}
          >
            The people who walked beside us — and will stand with us on the day.
          </p>
        </div>
      </section>

      {/* ── Featured: MOH & Best Man ─────────────── */}
      <section className="px-8 py-16" style={{ borderTop: "1px solid var(--v-border)" }}>
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase tracking-widest mb-10"
            style={{ fontSize: "10px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
          >
            Leading the Party
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { person: moh, accent: "var(--v-burgundy)", label: "Maid of Honor" },
              { person: bestMan, accent: "var(--v-tan)", label: "Best Man" },
            ].map(({ person, accent, label }) => (
              <div
                key={person.name}
                className="flex gap-6 p-6 border"
                style={{
                  backgroundColor: "var(--v-surface)",
                  borderColor: "var(--v-border)",
                  borderTopColor: accent,
                  borderTopWidth: "2px",
                }}
              >
                <div
                  className="relative flex-shrink-0 overflow-hidden"
                  style={{ width: "100px", height: "120px", border: "1px solid var(--v-border)" }}
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p
                    className="uppercase tracking-widest mb-1"
                    style={{ fontSize: "9px", color: accent, fontFamily: "var(--font-inter)" }}
                  >
                    {label}
                  </p>
                  <h3
                    className="font-bold mb-1"
                    style={{ fontFamily: "var(--font-playfair)", fontSize: "24px", color: "var(--v-cream)" }}
                  >
                    {person.name}
                  </h3>
                  <p
                    style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)" }}
                  >
                    {person.relationship}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bridesmaids ───────────────────────────── */}
      <section className="px-8 py-16" style={{ borderTop: "1px solid var(--v-border)" }}>
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase tracking-widest mb-10"
            style={{ fontSize: "10px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
          >
            The Bridesmaids
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {restBridesmaids.map((person) => (
              <div key={person.name} className="text-center">
                <div
                  className="relative mx-auto mb-3 overflow-hidden"
                  style={{
                    width: "100%",
                    paddingBottom: "133%",
                    border: "1px solid var(--v-border)",
                  }}
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p
                  className="font-bold"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "14px", color: "var(--v-cream)" }}
                >
                  {person.name.split(" ")[0]}
                </p>
                <p
                  style={{ fontFamily: "var(--font-inter)", fontSize: "10px", color: "var(--v-text-muted)" }}
                >
                  {person.relationship}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Groomsmen ────────────────────────────── */}
      <section className="px-8 pb-24" style={{ borderTop: "1px solid var(--v-border)", paddingTop: "4rem" }}>
        <div className="max-w-5xl mx-auto">
          <p
            className="uppercase tracking-widest mb-10"
            style={{ fontSize: "10px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
          >
            The Groomsmen
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {restGroomsmen.map((person) => (
              <div key={person.name} className="text-center">
                <div
                  className="relative mx-auto mb-3 overflow-hidden"
                  style={{
                    width: "100%",
                    paddingBottom: "133%",
                    border: "1px solid var(--v-border)",
                  }}
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <p
                  className="font-bold"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "14px", color: "var(--v-cream)" }}
                >
                  {person.name.split(" ")[0]}
                </p>
                <p
                  style={{ fontFamily: "var(--font-inter)", fontSize: "10px", color: "var(--v-text-muted)" }}
                >
                  {person.relationship}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
