import { getWeddingData } from "@/lib/site-settings";
import Image from "next/image";
import V3Frame from "@/components/v3/V3Frame";
import V3Plaque from "@/components/v3/V3Plaque";
import V3RoomDivider from "@/components/v3/V3RoomDivider";

export const metadata = {
  title: "The Exhibition Team | Velvet Gallery",
  description: "Meet the wedding party for the Paine Wedding.",
};

export default async function V3PartyPage() {
  const wedding = await getWeddingData();
  const { bridesmaids, groomsmen } = wedding.bridalParty;

  const moh = bridesmaids.find((b) => b.role === "Maid of Honor");
  const bestMan = groomsmen.find((g) => g.role === "Best Man");
  const restBridesmaids = bridesmaids.filter((b) => b.role !== "Maid of Honor");
  const restGroomsmen = groomsmen.filter((g) => g.role !== "Best Man");

  return (
    <div style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-24 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <p className="v3-label mb-4">Room V · The Exhibition Team</p>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "var(--v-text)",
            lineHeight: 1.1,
          }}
        >
          The Exhibition Team
        </h1>
        <p className="mt-4 v3-label">The people who made this all possible</p>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-20 space-y-16">

        {/* Lead curators — MOH & Best Man */}
        <section>
          <V3RoomDivider roomNumber="Lead Curators" title="Maid of Honor & Best Man" />

          <div className="grid md:grid-cols-2 gap-8 mt-6">
            {[moh, bestMan].filter(Boolean).map((person, i) => (
              <div key={person!.name} className="flex gap-5 items-start">
                <div className="shrink-0" style={{ width: "140px" }}>
                  <V3Frame withLight matPadding={10} className="w-full">
                    <div className="relative w-full" style={{ paddingBottom: "125%" }}>
                      <Image
                        src={person!.image}
                        alt={person!.name}
                        fill
                        className="object-cover"
                        onError={() => {}}
                      />
                    </div>
                  </V3Frame>
                  <V3Plaque
                    title={person!.name}
                    medium={person!.role}
                  />
                </div>
                <div className="pt-2">
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.7rem",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: i === 0 ? "var(--v-burgundy)" : "var(--v-navy)",
                      marginBottom: "6px",
                    }}
                  >
                    {person!.role}
                  </p>
                  <h3
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "1.3rem",
                      color: "var(--v-text)",
                      marginBottom: "4px",
                    }}
                  >
                    {person!.name}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.75rem",
                      color: "var(--v-text-muted)",
                      fontStyle: "italic",
                    }}
                  >
                    {person!.relationship}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bridesmaids */}
        <section>
          <V3RoomDivider roomNumber="Gallery A" title="Bridesmaids" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 mt-6">
            {restBridesmaids.map((person) => (
              <div key={person.name} className="text-center">
                <V3Frame withLight matPadding={8} className="w-full">
                  <div className="relative w-full" style={{ paddingBottom: "130%" }}>
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className="object-cover"
                      onError={() => {}}
                    />
                  </div>
                </V3Frame>
                <V3Plaque
                  title={person.name.split(" ")[0]}
                  medium={person.role}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Groomsmen */}
        <section>
          <V3RoomDivider roomNumber="Gallery B" title="Groomsmen" />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-5 mt-6">
            {restGroomsmen.map((person) => (
              <div key={person.name} className="text-center">
                <V3Frame withLight matPadding={8} className="w-full">
                  <div className="relative w-full" style={{ paddingBottom: "130%" }}>
                    <Image
                      src={person.image}
                      alt={person.name}
                      fill
                      className="object-cover"
                      onError={() => {}}
                    />
                  </div>
                </V3Frame>
                <V3Plaque
                  title={person.name.split(" ")[0]}
                  medium={person.role}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Closing */}
        <div className="text-center py-6">
          <div className="w-16 h-px mx-auto mb-6" style={{ backgroundColor: "var(--v-tan)" }} />
          <p
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "1.2rem",
              fontStyle: "italic",
              color: "var(--v-text)",
              maxWidth: "480px",
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            "We are so grateful for every one of them."
          </p>
          <p className="v3-label mt-3" style={{ color: "var(--v-tan)" }}>— Ashlyn &amp; Jeffrey</p>
        </div>
      </div>
    </div>
  );
}
