"use client";

import { startTransition, useEffect, useState } from "react";

export const ADMIN_SESSION_EVENT = "admin-session-changed";

type AdminSessionEventDetail = {
    role: string;
    status: "authenticated" | "unauthenticated";
};

type LoginResult = {
    ok: boolean;
    error?: string;
};

export function emitAdminSessionChange(detail: AdminSessionEventDetail) {
    window.dispatchEvent(new CustomEvent<AdminSessionEventDetail>(ADMIN_SESSION_EVENT, { detail }));
}

export function useAdminSession() {
    const [status, setStatus] = useState<"checking" | "authenticated" | "unauthenticated">("checking");
    const [role, setRole] = useState("");

    async function refreshSession() {
        try {
            const response = await fetch("/api/admin/session", {
                method: "GET",
                cache: "no-store",
                credentials: "same-origin",
            });

            if (!response.ok) {
                startTransition(() => {
                    setRole("");
                    setStatus("unauthenticated");
                });
                emitAdminSessionChange({ role: "", status: "unauthenticated" });
                return;
            }

            const data = await response.json() as { role?: string };
            const nextRole = data.role ?? "";

            startTransition(() => {
                setRole(nextRole);
                setStatus("authenticated");
            });
            emitAdminSessionChange({ role: nextRole, status: "authenticated" });
        } catch {
            startTransition(() => {
                setRole("");
                setStatus("unauthenticated");
            });
            emitAdminSessionChange({ role: "", status: "unauthenticated" });
        }
    }

    async function login(password: string): Promise<LoginResult> {
        try {
            const response = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password }),
                credentials: "same-origin",
            });

            const data = await response.json() as { role?: string; error?: string };

            if (!response.ok || !data.role) {
                return { ok: false, error: data.error || "Invalid password." };
            }

            startTransition(() => {
                setRole(data.role ?? "");
                setStatus("authenticated");
            });
            emitAdminSessionChange({ role: data.role ?? "", status: "authenticated" });

            return { ok: true };
        } catch {
            return { ok: false, error: "Could not reach the auth server." };
        }
    }

    async function logout() {
        await fetch("/api/admin/session", {
            method: "DELETE",
            credentials: "same-origin",
        });

        startTransition(() => {
            setRole("");
            setStatus("unauthenticated");
        });
        emitAdminSessionChange({ role: "", status: "unauthenticated" });
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
