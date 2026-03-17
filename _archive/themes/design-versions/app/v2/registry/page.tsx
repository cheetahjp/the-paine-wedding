import { getWeddingData } from "@/lib/site-settings";

export const metadata = {
  title: "A Parting Gift | Paper Atlas",
  description: "Registry for the Paine Wedding.",
};

export default async function V2RegistryPage() {
  const { wedding } = await getWeddingData();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-20 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Chapter Eight · Gifts
          </p>
          <h1 className="text-5xl md:text-7xl mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)", lineHeight: 1.1, fontStyle: "italic" }}>
            A Parting Gift
          </h1>
          <p className="text-base" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            If you'd like to celebrate with a gift, here's where to find our registry.
          </p>
          <p className="mt-3 text-xl" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            your presence is the greatest gift ♡
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">

        {/* Personal note */}
        <div
          className="p-8 text-center"
          style={{
            border: "1px solid var(--v-border)",
            backgroundColor: "var(--v-surface)",
            position: "relative",
          }}
        >
          {/* Stamp corner decoration */}
          <div
            className="absolute top-3 right-3 w-14 h-14 rounded-full flex items-center justify-center"
            style={{ border: "2px dashed var(--v-tan)", backgroundColor: "var(--v-bg)" }}
          >
            <span className="text-lg">♡</span>
          </div>

          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            From the Couple
          </p>
          <p
            className="text-lg leading-relaxed italic"
            style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)", maxWidth: "480px", margin: "0 auto" }}
          >
            "Your presence at our wedding is the greatest gift we could ask for. If you'd like to give a little something extra, here are a few ways to celebrate with us."
          </p>
          <p className="text-xl mt-5" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            — Ashlyn &amp; Jeffrey
          </p>
        </div>

        {/* Registry cards — atlas destination style */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
            <span className="text-xs tracking-widest uppercase px-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              Registry Destinations
            </span>
            <div className="h-px flex-1" style={{ backgroundColor: "var(--v-border)" }} />
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {wedding.registry.map((item, index) => (
              <div
                key={item.name}
                className="p-6"
                style={{
                  border: "1px solid var(--v-border)",
                  backgroundColor: "var(--v-surface)",
                  borderTop: `3px solid ${index === 0 ? "var(--v-navy)" : "var(--v-burgundy)"}`,
                }}
              >
                {/* Icon */}
                <div className="mb-4">
                  {item.icon === "heart" ? (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--v-burgundy)", color: "white" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </div>
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "var(--v-navy)", color: "white" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20 12 20 22 4 22 4 12" />
                        <rect x="2" y="7" width="20" height="5" />
                        <line x1="12" y1="22" x2="12" y2="7" />
                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                      </svg>
                    </div>
                  )}
                </div>

                <h3 className="text-2xl mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                  {item.name}
                </h3>
                <p className="text-sm mb-5" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  {item.description}
                </p>

                {item.url && item.url !== "TODO" ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center py-2.5 text-xs tracking-widest uppercase transition-colors"
                    style={{
                      backgroundColor: index === 0 ? "var(--v-navy)" : "var(--v-burgundy)",
                      color: "#fbf8f4",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    View Registry →
                  </a>
                ) : (
                  <div
                    className="text-center py-2.5 text-xs tracking-widest uppercase"
                    style={{
                      border: "1px dashed var(--v-border)",
                      color: "var(--v-text-muted)",
                      fontFamily: "var(--font-inter)",
                    }}
                  >
                    Link Coming Soon
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Closing caveat */}
        <div className="text-center py-6">
          <p className="text-xl" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            No gift is ever required — just bring yourself and your dancing shoes.
          </p>
        </div>
      </div>
    </div>
  );
}
