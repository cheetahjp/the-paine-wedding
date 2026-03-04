import React from "react";

export default function Footer() {
    return (
        <footer className="w-full bg-surface py-12 mt-20 text-center border-t border-gray-200">
            <div className="max-w-4xl mx-auto px-6">
                <h2 className="font-heading text-3xl mb-4 text-primary">Jeff & Ashlyn</h2>
                <p className="text-text-secondary tracking-widest uppercase text-sm mb-8">
                    September 2026 • Dallas, Texas
                </p>
                <p className="text-xs text-text-secondary opacity-70">
                    © {new Date().getFullYear()} The Paine Wedding. All Rights Reserved.
                </p>
            </div>
        </footer>
    );
}
