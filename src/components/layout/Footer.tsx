import React from "react";
import Link from "next/link";
import { WEDDING } from "@/lib/wedding-data";

export default function Footer() {
    return (
        <footer className="w-full bg-surface py-12 mt-20 text-center border-t border-gray-200">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="font-heading text-3xl mb-4 text-primary">{WEDDING.couple.names}</h2>
                <p className="text-text-secondary tracking-widest uppercase text-sm mb-8">
                    {WEDDING.date.display} &bull; {WEDDING.venue.cityDisplay}
                </p>
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-xs text-text-secondary/60 uppercase tracking-[0.2em]">
                    {[
                        { label: "Our Story", href: "/our-story" },
                        { label: "Travel", href: "/travel" },
                        { label: "Attire", href: "/attire" },
                        { label: "FAQ", href: "/faq" },
                        { label: "Registry", href: "/registry" },
                        { label: "Games", href: "/games" },
                        { label: "RSVP", href: "/rsvp" },
                    ].map((link) => (
                        <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">{link.label}</Link>
                    ))}
                </nav>
                <p className="text-xs text-text-secondary opacity-70">
                    &copy; {new Date().getFullYear()} The {WEDDING.couple.lastName} Wedding. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
