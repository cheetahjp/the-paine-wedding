import { getWeddingData } from "@/lib/site-settings";

export const metadata = { title: "Registry | Midnight Editorial" };

export default async function V1RegistryPage() {
  const { wedding } = await getWeddingData();

  return (
    <div className="v1-theme">
      {/* ── Header ────────────────────────────────── */}
      <section
        className="px-8 pt-24 pb-20"
        style={{ background: "linear-gradient(180deg, #0d1e30 0%, #08111d 100%)" }}
      >
        <div className="max-w-4xl mx-auto">
          <p
            className="uppercase tracking-widest mb-4"
            style={{ fontSize: "11px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
          >
            Chapter VIII
          </p>
          <h1
            className="font-bold italic leading-none"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(52px, 8vw, 96px)",
              color: "var(--v-cream)",
            }}
          >
            A Gift,<br />If You Wish
          </h1>
          <div className="mt-6 w-16 h-px" style={{ backgroundColor: "var(--v-burgundy)" }} />
          <p
            className="mt-8 max-w-xl"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "20px",
              color: "var(--v-text-muted)",
              lineHeight: "1.6",
              fontStyle: "italic",
            }}
          >
            Your presence at our wedding is the greatest gift of all. But if you&apos;d like to
            celebrate us with something more, we&apos;ve put together a few options below.
          </p>
        </div>
      </section>

      {/* ── Registry Cards ────────────────────────── */}
      <section className="px-8 py-20" style={{ borderTop: "1px solid var(--v-border)" }}>
        <div className="max-w-4xl mx-auto">
          <p
            className="uppercase tracking-widest mb-10"
            style={{ fontSize: "10px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
          >
            Our Registries
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {wedding.registry.map((item, idx) => (
              <div
                key={idx}
                className="p-8 border flex flex-col"
                style={{
                  backgroundColor: "var(--v-surface)",
                  borderColor: "var(--v-border)",
                  borderTopColor: item.icon === "heart" ? "var(--v-burgundy)" : "var(--v-tan)",
                  borderTopWidth: "2px",
                }}
              >
                {/* Icon */}
                <div className="mb-6">
                  {item.icon === "heart" ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                      stroke="var(--v-burgundy)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                      stroke="var(--v-tan)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 12 20 22 4 22 4 12" />
                      <rect x="2" y="7" width="20" height="5" />
                      <line x1="12" y1="22" x2="12" y2="7" />
                      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
                    </svg>
                  )}
                </div>

                <h3
                  className="font-bold mb-2"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "28px", color: "var(--v-cream)" }}
                >
                  {item.name}
                </h3>
                <p
                  className="flex-1 mb-8"
                  style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--v-text-muted)", lineHeight: "1.7" }}
                >
                  {item.description}
                </p>

                {item.url && item.url !== "TODO" ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="v1-btn-outline inline-block text-center"
                    style={{ fontSize: "11px" }}
                  >
                    View Registry →
                  </a>
                ) : (
                  <div
                    className="text-center py-3 border"
                    style={{
                      borderColor: "var(--v-border)",
                      borderStyle: "dashed",
                    }}
                  >
                    <span
                      className="uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-inter)", fontSize: "10px", color: "var(--v-text-muted)" }}
                    >
                      Link Coming Soon
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Note ─────────────────────────────────── */}
      <section className="px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div
            className="p-8 border-l-2"
            style={{ backgroundColor: "var(--v-surface)", borderColor: "var(--v-burgundy)" }}
          >
            <p
              className="font-bold italic mb-2"
              style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "var(--v-cream)" }}
            >
              A personal note
            </p>
            <p
              style={{ fontFamily: "var(--font-inter)", fontSize: "14px", color: "var(--v-text-muted)", lineHeight: "1.8" }}
            >
              We truly mean it — having you with us on our wedding day is more than enough.
              If you choose to give a gift, know that it is received with a full and grateful heart.
              We love you all.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
