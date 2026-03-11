import React from "react";
import { WEDDING } from "@/lib/wedding-data";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Footer() {
    return (
        <footer className="w-full bg-surface py-12 mt-20 text-center border-t border-gray-200">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="font-heading text-3xl mb-4 text-primary">{WEDDING.couple.names}</h2>
                <p className="text-text-secondary tracking-widest uppercase text-sm mb-8">
                    {WEDDING.date.display} &bull; {WEDDING.venue.cityDisplay}
                </p>
                <p className="text-xs text-text-secondary opacity-70 mb-6">
                    &copy; {new Date().getFullYear()} The {WEDDING.couple.lastName} Wedding. All Rights Reserved.
                </p>
                <div className="flex justify-center">
                    <ThemeToggle />
                </div>
            </div>
        </footer>
    );
}
