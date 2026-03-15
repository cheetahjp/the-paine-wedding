"use client";

import { useEffect, useState } from "react";

/**
 * Checks whether the current browser session has Master-level admin access.
 * Returns isAdmin=false while loading, so UI stays in the non-admin state
 * until the check completes.
 */
export function useAdminSession() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;

        void (async () => {
            try {
                const r = await fetch("/api/admin/session");
                if (r.ok && active) {
                    const data = (await r.json()) as { role?: string };
                    setIsAdmin(data.role === "Master");
                }
            } catch {
                // Not authenticated — stay false
            } finally {
                if (active) setLoading(false);
            }
        })();

        return () => {
            active = false;
        };
    }, []);

    return { isAdmin, loading };
}
