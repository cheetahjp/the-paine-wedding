"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scrolls the window to the top whenever the route changes.
 * Next.js App Router doesn't always reset scroll position on client-side
 * navigation, so this ensures pages always start at the top.
 */
export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, [pathname]);

    return null;
}
