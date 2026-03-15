/**
 * page-visibility.ts — Server-side only
 *
 * Utilities for admin-controlled page visibility. Pages that are marked
 * "hidden" in site_settings return a 404 to non-admin visitors.
 *
 * Usage in server components:
 *   await requirePageVisible("schedule");  // notFound() if hidden + not admin
 */

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "./admin/session";

// All pages that can be toggled in the admin dashboard
export const MANAGED_PAGES = [
    { slug: "our-story",       label: "Our Story" },
    { slug: "bridal-party",    label: "Bridal Party" },
    { slug: "wedding-details", label: "Details" },
    { slug: "schedule",        label: "Schedule" },
    { slug: "travel",          label: "Travel" },
    { slug: "attire",          label: "Attire" },
    { slug: "registry",        label: "Registry" },
    { slug: "faq",             label: "FAQ" },
    { slug: "games",           label: "Games" },
    { slug: "rsvp",            label: "RSVP" },
] as const;

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

/** Returns true if the page is currently set to hidden in site_settings. */
export async function isPageHidden(slug: string): Promise<boolean> {
    try {
        const sb = getServiceClient();
        const { data } = await sb
            .from("site_settings")
            .select("value")
            .eq("key", `page.${slug}.hidden`)
            .maybeSingle();
        return data?.value === "true";
    } catch {
        return false; // safe default: show the page
    }
}

/** Returns true if the current request has a valid admin session cookie. */
export async function isAdminAuthenticated(): Promise<boolean> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
        return verifyAdminSessionToken(token) !== null;
    } catch {
        return false;
    }
}

/**
 * Call at the top of any server-component page to enforce visibility.
 * If the page is hidden AND the visitor is not an admin, returns a 404.
 */
export async function requirePageVisible(slug: string): Promise<void> {
    const [hidden, isAdmin] = await Promise.all([
        isPageHidden(slug),
        isAdminAuthenticated(),
    ]);
    if (hidden && !isAdmin) {
        notFound();
    }
}
