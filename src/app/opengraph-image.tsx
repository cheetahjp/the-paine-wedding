import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f5f1eb",
                    fontFamily: "Georgia, serif",
                    position: "relative",
                }}
            >
                {/* Subtle corner accents */}
                <div style={{ position: "absolute", top: 40, left: 40, width: 48, height: 2, backgroundColor: "#163865" }} />
                <div style={{ position: "absolute", top: 40, left: 40, width: 2, height: 48, backgroundColor: "#163865" }} />
                <div style={{ position: "absolute", top: 40, right: 40, width: 48, height: 2, backgroundColor: "#163865" }} />
                <div style={{ position: "absolute", top: 40, right: 40, width: 2, height: 48, backgroundColor: "#163865" }} />
                <div style={{ position: "absolute", bottom: 40, left: 40, width: 48, height: 2, backgroundColor: "#163865" }} />
                <div style={{ position: "absolute", bottom: 40, left: 40, width: 2, height: 48, backgroundColor: "#163865" }} />
                <div style={{ position: "absolute", bottom: 40, right: 40, width: 48, height: 2, backgroundColor: "#163865" }} />
                <div style={{ position: "absolute", bottom: 40, right: 40, width: 2, height: 48, backgroundColor: "#163865" }} />

                {/* Monogram */}
                <div style={{ fontSize: 96, fontWeight: "bold", color: "#163865", letterSpacing: "-2px", lineHeight: 1 }}>
                    A&amp;J
                </div>

                {/* Divider */}
                <div style={{ width: 64, height: 2, backgroundColor: "#c89a73", marginTop: 28, marginBottom: 28 }} />

                {/* Names */}
                <div style={{ fontSize: 44, color: "#163865", letterSpacing: "2px", fontStyle: "italic" }}>
                    Ashlyn &amp; Jeffrey Paine
                </div>

                {/* Date */}
                <div style={{
                    marginTop: 20,
                    fontSize: 20,
                    color: "#657791",
                    letterSpacing: "5px",
                    textTransform: "uppercase",
                }}>
                    September 26, 2026
                </div>

                {/* Venue */}
                <div style={{
                    marginTop: 10,
                    fontSize: 17,
                    color: "#8a9ab5",
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                }}>
                    Davis &amp; Grey Farms · Celeste, Texas
                </div>
            </div>
        ),
        { width: 1200, height: 630 }
    );
}
