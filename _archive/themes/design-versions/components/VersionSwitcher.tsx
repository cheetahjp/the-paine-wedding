"use client";
import Link from "next/link";

interface VersionSwitcherProps {
  current: "v1" | "v2" | "v3";
}

export default function VersionSwitcher({ current }: VersionSwitcherProps) {
  const versions = [
    { id: "v1", label: "A · Editorial", href: "/v1" },
    { id: "v2", label: "B · Atlas", href: "/v2" },
    { id: "v3", label: "C · Gallery", href: "/v3" },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 text-xs">
      <span className="text-white/40 font-mono uppercase tracking-widest text-[10px] pr-1">
        Design
      </span>
      {versions.map((v) => (
        <Link
          key={v.id}
          href={v.href}
          className={`px-3 py-1 rounded-full text-[10px] font-semibold tracking-widest uppercase transition-all ${
            current === v.id
              ? "bg-white text-black"
              : "text-white/60 hover:text-white hover:bg-white/10"
          }`}
        >
          {v.label}
        </Link>
      ))}
      <span className="text-white/20 mx-1">|</span>
      <Link
        href="/"
        className="text-white/50 hover:text-white text-[10px] tracking-widest uppercase transition-colors"
      >
        Main
      </Link>
    </div>
  );
}
