import Link from "next/link";
import React from "react";

const navLinks = [
    { name: "Our Story", href: "/our-story" },
    { name: "Details", href: "/wedding-details" },
    { name: "Schedule", href: "/schedule" },
    { name: "Travel", href: "/travel" },
    { name: "Attire", href: "/attire" },
    { name: "Registry", href: "/registry" },
    { name: "RSVP", href: "/rsvp" },
];

export default function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full bg-base/90 backdrop-blur-md border-b border-surface">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="font-heading text-xl tracking-wide uppercase">
                    Jeff & Ashlyn
                </Link>
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
                {/* Mobile menu toggle would go here */}
                <button className="md:hidden text-text-primary">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-16 6h16" />
                    </svg>
                </button>
            </div>
        </header>
    );
}
