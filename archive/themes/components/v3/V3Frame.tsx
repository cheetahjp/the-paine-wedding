import React from "react";

interface V3FrameProps {
  children: React.ReactNode;
  caption?: string;
  captionSub?: string;
  className?: string;
  /** Extra padding on the mat (default: 12px) */
  matPadding?: number;
  /** Whether to apply a subtle gallery-light radial overlay on the content */
  withLight?: boolean;
}

/**
 * V3Frame — wraps content in a gallery-style frame.
 * Outer border in gold/tan, inner cream mat, optional plaque caption below.
 */
export default function V3Frame({
  children,
  caption,
  captionSub,
  className = "",
  matPadding = 12,
  withLight = false,
}: V3FrameProps) {
  return (
    <div className={`inline-block ${className}`} style={{ display: "block" }}>
      {/* Outer frame border */}
      <div
        style={{
          border: "2px solid var(--v-tan)",
          padding: `${matPadding}px`,
          backgroundColor: "var(--v-cream)",
        }}
      >
        {/* Gallery light wrapper */}
        <div
          className={withLight ? "v3-gallery-light" : ""}
          style={{ position: "relative" }}
        >
          {children}
          {withLight && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse at 35% 20%, rgba(255,255,255,0.18) 0%, transparent 65%)",
                pointerEvents: "none",
              }}
            />
          )}
        </div>
      </div>

      {/* Plaque caption below frame */}
      {(caption || captionSub) && (
        <div
          style={{
            borderTop: "2px solid var(--v-navy)",
            paddingTop: "8px",
            marginTop: "6px",
          }}
        >
          {caption && (
            <p
              style={{
                fontFamily: "var(--font-playfair)",
                fontSize: "0.9rem",
                color: "var(--v-text)",
                marginBottom: "2px",
              }}
            >
              {caption}
            </p>
          )}
          {captionSub && (
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.65rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--v-text-muted)",
              }}
            >
              {captionSub}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
