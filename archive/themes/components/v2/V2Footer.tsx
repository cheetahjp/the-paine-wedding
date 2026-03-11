export default function V2Footer() {
  return (
    <footer
      className="px-8 py-12"
      style={{ borderTop: "1px solid var(--v-border)", backgroundColor: "var(--v-surface)" }}
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Route line motif */}
        <div className="flex items-center gap-3">
          <div
            style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--v-tan)", flexShrink: 0 }}
          />
          <div
            style={{
              width: "60px",
              height: "1px",
              backgroundImage:
                "repeating-linear-gradient(to right, var(--v-tan) 0, var(--v-tan) 4px, transparent 4px, transparent 8px)",
            }}
          />
          <span
            className="font-bold italic"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "18px", color: "var(--v-text)" }}
          >
            Ashlyn &amp; Jeffrey
          </span>
          <div
            style={{
              width: "60px",
              height: "1px",
              backgroundImage:
                "repeating-linear-gradient(to right, var(--v-tan) 0, var(--v-tan) 4px, transparent 4px, transparent 8px)",
            }}
          />
          <div
            style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--v-navy)", flexShrink: 0 }}
          />
        </div>

        <div className="text-center sm:text-right">
          <p
            className="uppercase tracking-widest"
            style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: "var(--v-text-muted)" }}
          >
            September 26, 2026 &middot; Celeste, Texas
          </p>
          <p
            className="uppercase tracking-widest mt-1"
            style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: "var(--v-text-muted)" }}
          >
            Davis &amp; Grey Farms
          </p>
        </div>
      </div>
    </footer>
  );
}
