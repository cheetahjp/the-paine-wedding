"use client";
import { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";

const links = [
  { href: "/v1/story", label: "Our Story" },
  { href: "/v1/day", label: "The Day" },
  { href: "/v1/travel", label: "Travel" },
  { href: "/v1/attire", label: "Attire" },
  { href: "/v1/party", label: "The Party" },
  { href: "/v1/registry", label: "Registry" },
  { href: "/v1/play", label: "Play" },
  { href: "/v1/rsvp", label: "RSVP" },
];

export default function V1Nav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-12 h-16"
        style={{
          background: "rgba(8,17,29,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #1e3450",
        }}
      >
        {/* Logo */}
        <Link
          href="/v1"
          className="font-heading italic text-xl tracking-tight"
          style={{ color: "#f0e7dd" }}
        >
          A &amp; J
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="v1-label transition-colors hover:text-[#7c1f28]"
              style={{ color: "#8a9ab5" }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="md:hidden"
          style={{ color: "#8a9ab5" }}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{ background: "#08111d" }}
        >
          <div className="flex items-center justify-between px-6 h-16 border-b border-[#1e3450]">
            <Link
              href="/v1"
              onClick={() => setOpen(false)}
              className="font-heading italic text-xl tracking-tight"
              style={{ color: "#f0e7dd" }}
            >
              A &amp; J
            </Link>
            <button
              onClick={() => setOpen(false)}
              style={{ color: "#8a9ab5" }}
              aria-label="Close menu"
            >
              <X size={22} />
            </button>
          </div>
          <div className="flex flex-col gap-0 px-6 pt-8">
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-5 border-b font-heading text-3xl transition-colors hover:text-[#7c1f28]"
                style={{
                  color: "#f5f1eb",
                  borderColor: "#1e3450",
                  animationDelay: `${i * 40}ms`,
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
