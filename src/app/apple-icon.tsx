import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#163865",
                    borderRadius: 36,
                    fontFamily: "Georgia, serif",
                }}
            >
                <div style={{
                    fontSize: 88,
                    fontWeight: "bold",
                    color: "#f0e7dd",
                    letterSpacing: "-3px",
                    lineHeight: 1,
                    fontStyle: "italic",
                }}>
                    A&amp;J
                </div>
            </div>
        ),
        { width: 180, height: 180 }
    );
}
