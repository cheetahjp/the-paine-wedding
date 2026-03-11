export default function V3Footer() {
  return (
    <footer
      style={{
        backgroundColor: "var(--v-surface)",
        borderTop: "2px solid var(--v-tan)",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      {/* Gold rule */}
      <div
        className="mx-auto mb-6 h-px w-16"
        style={{ backgroundColor: "var(--v-tan)" }}
      />

      {/* Names */}
      <p
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1.4rem",
          color: "var(--v-text)",
          marginBottom: "6px",
          letterSpacing: "0.05em",
        }}
      >
        Ashlyn &amp; Jeffrey
      </p>

      {/* Exhibition info */}
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.65rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--v-text-muted)",
          marginBottom: "4px",
        }}
      >
        An Exhibition Opening September 26, 2026
      </p>
      <p
        style={{
          fontFamily: "var(--font-inter)",
          fontSize: "0.65rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--v-text-muted)",
        }}
      >
        Davis &amp; Grey Farms · Celeste, Texas
      </p>

      {/* Gold rule */}
      <div
        className="mx-auto mt-6 h-px w-16"
        style={{ backgroundColor: "var(--v-tan)" }}
      />
    </footer>
  );
}
