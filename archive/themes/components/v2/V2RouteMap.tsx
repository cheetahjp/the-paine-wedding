/**
 * V2RouteMap — horizontal SVG route line motif
 * Commerce → Long Distance → Houston → Celeste, TX
 * Used on the homepage and story page.
 */
export default function V2RouteMap({ className = "" }: { className?: string }) {
  const stops = [
    { city: "Commerce, TX", year: "2021" },
    { city: "Long Distance", year: "2022–24" },
    { city: "Houston, TX", year: "2024" },
    { city: "Celeste, TX", year: "2026 ★" },
  ];

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <div style={{ minWidth: "480px", padding: "20px 0" }}>
        {/* SVG route line */}
        <svg
          width="100%"
          height="60"
          viewBox="0 0 600 60"
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block" }}
        >
          {/* Dashed route line */}
          <line
            x1="30" y1="30"
            x2="570" y2="30"
            stroke="var(--v-tan)"
            strokeWidth="1.5"
            strokeDasharray="6 4"
          />

          {/* Stops: at x = 30, 210, 390, 570 */}
          {[30, 210, 390, 570].map((x, i) => (
            <g key={i}>
              {/* Dot */}
              <circle
                cx={x} cy={30} r={i === 3 ? 7 : 5}
                fill={i === 3 ? "var(--v-navy)" : "var(--v-tan)"}
                stroke="var(--v-bg)"
                strokeWidth="2"
              />
              {/* Star on last stop */}
              {i === 3 && (
                <text x={x} y={34} textAnchor="middle"
                  style={{ fontSize: "8px", fill: "var(--v-cream)", fontFamily: "sans-serif" }}>
                  ★
                </text>
              )}
            </g>
          ))}
        </svg>

        {/* City labels */}
        <div className="flex justify-between px-0" style={{ marginTop: "-4px" }}>
          {stops.map((stop, i) => (
            <div key={i} className="text-center" style={{ flex: 1 }}>
              <p
                className="uppercase"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "9px",
                  letterSpacing: "0.12em",
                  color: i === 3 ? "var(--v-navy)" : "var(--v-text-muted)",
                  fontWeight: i === 3 ? "700" : "400",
                }}
              >
                {stop.city}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-caveat, cursive)",
                  fontSize: "13px",
                  color: "var(--v-tan)",
                  marginTop: "2px",
                }}
              >
                {stop.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
