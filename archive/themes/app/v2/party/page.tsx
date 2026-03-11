import { getWeddingData } from "@/lib/site-settings";
import Image from "next/image";

export const metadata = {
  title: "The Crew | Paper Atlas",
  description: "Meet the wedding party for the Paine Wedding.",
};

// Rotate slightly for a candid-photo feel
const rotations = ["-1deg", "0.5deg", "-0.5deg", "1deg", "-0.8deg", "0.3deg"];

export default async function V2PartyPage() {
  const { wedding } = await getWeddingData();
  const { bridesmaids, groomsmen } = wedding.bridalParty;

  const moh = bridesmaids.find((b) => b.role === "Maid of Honor");
  const bestMan = groomsmen.find((g) => g.role === "Best Man");
  const restBridesmaids = bridesmaids.filter((b) => b.role !== "Maid of Honor");
  const restGroomsmen = groomsmen.filter((g) => g.role !== "Best Man");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-20 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Chapter Six · Travel Companions
          </p>
          <h1 className="text-5xl md:text-7xl mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)", lineHeight: 1.1 }}>
            The Crew
          </h1>
          <p className="text-base" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            The people who made the journey with us
          </p>
          <p className="mt-3 text-xl" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            couldn't do it without them ♡
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-16">

        {/* Featured — MOH & Best Man */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
            <span className="text-xs tracking-widest uppercase px-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              Lead Navigators
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[moh, bestMan].filter(Boolean).map((person, i) => (
              <div
                key={person!.name}
                className="flex gap-5 p-5"
                style={{
                  border: "1px solid var(--v-border)",
                  backgroundColor: "var(--v-surface)",
                  borderTop: `3px solid ${i === 0 ? "var(--v-burgundy)" : "var(--v-navy)"}`,
                }}
              >
                {/* Photo with stamp treatment */}
                <div
                  className="relative shrink-0"
                  style={{
                    width: "120px",
                    height: "150px",
                    border: "6px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                    transform: i === 0 ? "rotate(-0.5deg)" : "rotate(0.5deg)",
                  }}
                >
                  <Image
                    src={person!.image}
                    alt={person!.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col justify-center">
                  {/* Role badge */}
                  <span
                    className="text-xs tracking-widest uppercase mb-2 inline-block"
                    style={{
                      color: i === 0 ? "var(--v-burgundy)" : "var(--v-navy)",
                      fontFamily: "var(--font-inter)",
                      border: `1px dashed ${i === 0 ? "var(--v-burgundy)" : "var(--v-navy)"}`,
                      padding: "2px 8px",
                      display: "inline-block",
                    }}
                  >
                    {person!.role}
                  </span>
                  <h3 className="text-xl mb-1" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                    {person!.name}
                  </h3>
                  <p className="text-xs tracking-wide italic" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                    {person!.relationship}
                  </p>
                  <p className="text-sm mt-3" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
                    {i === 0 ? "best co-pilot ✈" : "the man, the myth ✦"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bridesmaids */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
            <span className="text-xs tracking-widest uppercase px-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              Bridesmaids
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {restBridesmaids.map((person, i) => (
              <div key={person.name} className="text-center">
                <div
                  className="relative mx-auto mb-3"
                  style={{
                    width: "100%",
                    paddingBottom: "130%",
                    border: "5px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    transform: `rotate(${rotations[i % rotations.length]})`,
                  }}
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-sm font-medium" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                  {person.name.split(" ")[0]}
                </h4>
                <p className="text-xs mt-0.5 italic" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  {person.relationship.replace(/Ashlyn's |Jeffrey's /, "")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Groomsmen */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
            <span className="text-xs tracking-widest uppercase px-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              Groomsmen
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {restGroomsmen.map((person, i) => (
              <div key={person.name} className="text-center">
                <div
                  className="relative mx-auto mb-3"
                  style={{
                    width: "100%",
                    paddingBottom: "130%",
                    border: "5px solid white",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    transform: `rotate(${rotations[(i + 2) % rotations.length]})`,
                  }}
                >
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="text-sm font-medium" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                  {person.name.split(" ")[0]}
                </h4>
                <p className="text-xs mt-0.5 italic" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  {person.relationship.replace(/Ashlyn's |Jeffrey's /, "")}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Sign-off */}
        <div className="text-center py-8">
          <p className="text-2xl" style={{ color: "var(--v-text)", fontFamily: "var(--font-caveat)" }}>
            We are so lucky to have every one of them on this journey with us.
          </p>
          <p className="text-base mt-2" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            — Ashlyn &amp; Jeffrey
          </p>
        </div>
      </div>
    </div>
  );
}
