import React from "react";

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    background?: "base" | "surface" | "white" | "primary" | "accent";
    id?: string;
}

export default function Section({
    children,
    className = "",
    background = "base",
    id,
}: SectionProps) {
    const bgs = {
        base: "bg-base text-text-primary",
        surface: "bg-surface text-text-primary",
        white: "bg-white text-text-primary",
        primary: "bg-primary text-text-light",
        accent: "bg-accent text-white",
    };

    return (
        <section
            id={id}
            className={`w-full py-24 md:py-32 px-6 ${bgs[background]} ${className}`}
        >
            <div className="max-w-5xl mx-auto">{children}</div>
        </section>
    );
}
