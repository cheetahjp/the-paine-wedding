interface V3RoomDividerProps {
  roomNumber: string;
  title: string;
  accentColor?: string;
}

/**
 * V3RoomDivider — section transition with room number and title.
 * "Room 01 · The Beginning" — wide-tracked small caps, centered,
 * with tan rule lines flanking on both sides.
 */
export default function V3RoomDivider({
  roomNumber,
  title,
  accentColor,
}: V3RoomDividerProps) {
  const color = accentColor ?? "var(--v-text-muted)";

  return (
    <div className="flex items-center gap-5 py-8">
      {/* Left rule */}
      <div className="flex-1 h-px" style={{ backgroundColor: "var(--v-tan)" }} />

      {/* Label */}
      <div className="text-center shrink-0">
        <p
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--v-tan)",
            marginBottom: "4px",
          }}
        >
          {roomNumber}
        </p>
        <p
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "1.1rem",
            color: color,
            letterSpacing: "0.04em",
          }}
        >
          {title}
        </p>
      </div>

      {/* Right rule */}
      <div className="flex-1 h-px" style={{ backgroundColor: "var(--v-tan)" }} />
    </div>
  );
}
