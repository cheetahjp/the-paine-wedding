"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { WEDDING } from "@/lib/wedding-data";

const navLinks = [
    { name: "Our Story", href: "/our-story" },
    { name: "Bridal Party", href: "/bridal-party" },
    { name: "Details", href: "/wedding-details" },
    { name: "Schedule", href: "/schedule" },
    { name: "Travel", href: "/travel" },
    { name: "Attire", href: "/attire" },
    { name: "Registry", href: "/registry" },
    { name: "Games", href: "/games" },
    { name: "RSVP", href: "/rsvp" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        if (!menuOpen) return;
        function handleClick(e: MouseEvent) {
            if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [menuOpen]);

    // Close on Escape key
    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") setMenuOpen(false);
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, []);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [menuOpen]);

    return (
        <>
            <header className="sticky top-0 z-50 w-full bg-base/90 backdrop-blur-md border-b border-surface">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link
                        href="/"
                        className="font-heading text-xl tracking-wide uppercase"
                        onClick={() => setMenuOpen(false)}
                    >
                        {WEDDING.couple.names}
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm uppercase tracking-widest text-text-secondary hover:text-primary transition-colors duration-300"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        className="md:hidden text-text-primary p-1 -mr-1"
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? (
                            /* X icon */
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            /* Hamburger icon */
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-16 6h16" />
                            </svg>
                        )}
                    </button>
                </div>
            </header>

            {/* Mobile drawer overlay */}
            <div
                className={`fixed inset-0 bg-text-primary/40 z-40 md:hidden transition-opacity duration-300 ${
                    menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                aria-hidden="true"
            />

            {/* Mobile drawer panel */}
            <div
                ref={drawerRef}
                className={`fixed top-20 left-0 right-0 z-50 md:hidden bg-base border-b border-surface shadow-lg transition-all duration-300 ease-in-out ${
                    menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                }`}
            >
                <nav className="flex flex-col px-6 py-6 space-y-1">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="text-sm uppercase tracking-widest text-text-secondary hover:text-primary py-3 border-b border-surface/60 last:border-0 transition-colors duration-200"
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
}
