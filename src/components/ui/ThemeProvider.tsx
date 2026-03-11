"use client";

import { useEffect } from "react";

/**
 * ThemeProvider — reads localStorage on mount and applies/removes the
 * `dark` class on <html>. Render this once in the root layout.
 *
 * A FOUC-prevention inline <script> in layout.tsx runs before hydration
 * so there's no flash of the wrong theme on page load.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (stored === "dark" || (!stored && prefersDark)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // localStorage unavailable (private browsing, SSR, etc.) — no-op
    }
  }, []);

  return <>{children}</>;
}
