"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AdminSection = "rsvp" | "games" | "security";

type AdminFrameProps = {
    section: AdminSection;
    role: string;
    title: string;
    description: string;
    onLogout: () => Promise<void>;
    children: ReactNode;
};

const ADMIN_LINKS: Array<{ label: string; href: string; section: AdminSection }> = [
    { label: "RSVP", href: "/admin", section: "rsvp" },
    { label: "Games", href: "/admin/games", section: "games" },
    { label: "Security", href: "/admin/security", section: "security" },
];

export default function AdminFrame({
    section,
    role,
    title,
    description,
    onLogout,
    children,
}: AdminFrameProps) {
    return (
        <div className="min-h-screen bg-surface">
            <div className="mx-auto max-w-6xl px-6 py-8 md:py-10">
                <div className="rounded-[2rem] border border-primary/10 bg-white p-8 shadow-[0_18px_52px_rgba(20,42,68,0.06)]">
                    <div className="flex flex-col gap-6 border-b border-primary/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">Admin</p>
                            <h1 className="mt-3 font-heading text-4xl text-primary">{title}</h1>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">{description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="rounded-full border border-primary/12 bg-primary/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary">
                                {role}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    void onLogout();
                                }}
                                className="rounded-full border border-secondary/18 bg-secondary/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-secondary transition-colors duration-200 hover:bg-secondary hover:text-white"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 border-b border-primary/10 pb-6">
                        {ADMIN_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.24em] transition-colors duration-200 ${
                                    section === link.section
                                        ? "bg-primary text-white"
                                        : "border border-primary/12 bg-[#fbf8f3] text-primary hover:bg-primary/5"
                                }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="mt-8">{children}</div>
                </div>
            </div>
        </div>
    );
}
