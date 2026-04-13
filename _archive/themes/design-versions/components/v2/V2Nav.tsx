"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/v2/story", label: "Our Journey" },
  { href: "/v2/day", label: "Itinerary" },
  { href: "/v2/travel", label: "Getting There" },
  { href: "/v2/attire", label: "What to Wear" },
  { href: "/v2/party", label: "The Crew" },
  { href: "/v2/registry", label: "Registry" },
  { href: "/v2/play", label: "Field Notes" },
  { href: "/v2/rsvp", label: "RSVP" },
];

export default function V2Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "var(--v-bg)",
          borderBottom: "1px solid var(--v-border)",
          boxShadow: "0 1px 8px rgba(8,17,29,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/v2" style={{ textDecoration: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                className="font-bold italic"
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontSize: "22px",
                  color: "var(--v-text)",
                  lineHeight: "1",
                }}
              >
                A &amp; J
              </span>
              {/* Route-line underline motif */}
              <span
                style={{
                  display: "inline-block",
                  width: "36px",
                  height: "2px",
                  background: `linear-gradient(to right, var(--v-tan), transparent)`,
                  borderRadius: "1px",
                }}
              />
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-6">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="uppercase tracking-widest transition-colors"
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "10px",
                  color: "var(--v-text-muted)",
                  textDecoration: "none",
                  paddingBottom: "2px",
                  borderBottom: "1px solid transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--v-navy)";
                  (e.currentTarget as HTMLElement).style.borderBottomColor = "var(--v-tan)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--v-text-muted)";
                  (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent";
                }}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                style={{
                  display: "block",
                  width: "22px",
                  height: "1.5px",
                  backgroundColor: "var(--v-text)",
                  transition: "transform 0.2s, opacity 0.2s",
                  transform:
                    open && i === 0
                      ? "rotate(45deg) translate(4px, 4px)"
                      : open && i === 2
                      ? "rotate(-45deg) translate(4px, -4px)"
                      : "none",
                  opacity: open && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col pt-16"
          style={{ backgroundColor: "var(--v-bg)", borderTop: "1px solid var(--v-border)" }}
        >
          <div className="px-8 py-10 space-y-6">
            {/* Route decoration */}
            <div className="flex items-center gap-3 mb-8">
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--v-tan)" }} />
              <div style={{ flex: 1, height: "1px", backgroundImage: "repeating-linear-gradient(to right, var(--v-tan) 0, var(--v-tan) 6px, transparent 6px, transparent 12px)" }} />
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "var(--v-navy)" }} />
            </div>
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  fontFamily: "var(--font-playfair)",
                  fontSize: "28px",
                  color: "var(--v-text)",
                  textDecoration: "none",
                  fontWeight: "700",
                }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
