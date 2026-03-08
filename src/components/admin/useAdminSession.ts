"use client";

import { startTransition, useEffect, useState } from "react";

type LoginResult = {
    ok: boolean;
    error?: string;
};

export function useAdminSession() {
    const [status, setStatus] = useState<"checking" | "authenticated" | "unauthenticated">("checking");
    const [role, setRole] = useState("");

    async function refreshSession() {
        try {
            const response = await fetch("/api/admin/session", {
                method: "GET",
                cache: "no-store",
            });

            if (!response.ok) {
                startTransition(() => {
                    setRole("");
                    setStatus("unauthenticated");
                });
                return;
            }

            const data = await response.json() as { role?: string };

            startTransition(() => {
                setRole(data.role ?? "");
                setStatus("authenticated");
            });
        } catch {
            startTransition(() => {
                setRole("");
                setStatus("unauthenticated");
            });
        }
    }

    async function login(password: string): Promise<LoginResult> {
        try {
            const response = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
            });

            const data = await response.json() as { role?: string; error?: string };

            if (!response.ok || !data.role) {
                return { ok: false, error: data.error || "Invalid password." };
            }

            startTransition(() => {
                setRole(data.role ?? "");
                setStatus("authenticated");
            });

            return { ok: true };
        } catch {
            return { ok: false, error: "Could not reach the auth server." };
        }
    }

    async function logout() {
        await fetch("/api/admin/session", {
            method: "DELETE",
        });

        startTransition(() => {
            setRole("");
            setStatus("unauthenticated");
        });
    }

    useEffect(() => {
        void refreshSession();
    }, []);

    return {
        status,
        role,
        refreshSession,
        login,
        logout,
    };
}
