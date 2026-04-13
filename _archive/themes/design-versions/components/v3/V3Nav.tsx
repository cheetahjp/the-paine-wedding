"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/v3", label: "Entrance" },
  { href: "/v3/story", label: "The Story" },
  { href: "/v3/day", label: "Programme" },
  { href: "/v3/travel", label: "Visitor Guide" },
  { href: "/v3/attire", label: "Attire" },
  { href: "/v3/party", label: "The Team" },
  { href: "/v3/rsvp", label: "Reserve" },
  { href: "/v3/registry", label: "Gift Room" },
  { href: "/v3/play", label: "Puzzle Room" },
];

export default function V3Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: "var(--v-bg)",
        borderBottom: "1px solid var(--v-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/v3"
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "0.95rem",
            color: "var(--v-text)",
            letterSpacing: "0.06em",
            textDecoration: "none",
          }}
        >
          The Paine Wedding
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.slice(1).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="v3-nav-link"
                style={isActive ? { color: "var(--v-text)", borderBottomColor: "var(--v-text)" } : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span
            className="block w-5 h-px transition-all"
            style={{
              backgroundColor: "var(--v-text)",
              transformOrigin: "center",
              transform: mobileOpen ? "rotate(45deg) translate(2px, 2px)" : "none",
            }}
          />
          <span
            className="block w-5 h-px transition-all"
            style={{
              backgroundColor: "var(--v-text)",
              opacity: mobileOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-5 h-px transition-all"
            style={{
              backgroundColor: "var(--v-text)",
              transformOrigin: "center",
              transform: mobileOpen ? "rotate(-45deg) translate(2px, -2px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 py-6 space-y-5"
          style={{
            backgroundColor: "var(--v-bg)",
            borderTop: "1px solid var(--v-border)",
          }}
        >
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <div key={link.href}>
                <Link
                  href={link.href}
                  className="v3-nav-link block"
                  style={isActive ? { color: "var(--v-text)", borderBottomColor: "var(--v-text)" } : undefined}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </div>
            );
          })}

          {/* Gold divider */}
          <div className="h-px w-8" style={{ backgroundColor: "var(--v-tan)" }} />
        </div>
      )}
    </nav>
  );
}
