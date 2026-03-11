interface V3PlaqueProps {
  title: string;
  description?: string;
  year?: string;
  medium?: string;
  className?: string;
}

/**
 * V3Plaque — museum-style label displayed beneath or beside a piece.
 * Navy rule on top, title in Bodoni, description in Montserrat.
 */
export default function V3Plaque({
  title,
  description,
  year,
  medium,
  className = "",
}: V3PlaqueProps) {
  return (
    <div
      className={className}
      style={{
        borderTop: "2px solid var(--v-navy)",
        paddingTop: "10px",
      }}
    >
      {/* Title */}
      <h3
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "1rem",
          color: "var(--v-text)",
          marginBottom: "4px",
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      {/* Secondary info row */}
      {(medium || year) && (
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.65rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--v-text-muted)",
            marginBottom: description ? "6px" : "0",
          }}
        >
          {[medium, year].filter(Boolean).join(" · ")}
        </p>
      )}

      {/* Description */}
      {description && (
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.8rem",
            color: "var(--v-text-muted)",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
