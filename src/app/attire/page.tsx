"use client";

import React from "react";
import Section from "@/components/ui/Section";
import Image from "next/image";
import { WEDDING, IMAGES } from "@/lib/wedding-data";

export default function Attire() {
    const dresscodeReady = WEDDING.dresscode.short !== "TBD";

    // Build combined moodboard: ladies images first, then gents
    const moodboardImages = [
        ...IMAGES.attire.ladies.map((src, i) => ({ src, fallback: IMAGES.attire.ladiesFallbacks[i], label: `Ladies Attire ${i + 1}` })),
        ...IMAGES.attire.gents.map((src, i) => ({ src, fallback: IMAGES.attire.gentsFallbacks[i], label: `Gentlemen Attire ${i + 1}` })),
    ];

    return (
        <div>
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Attire</h1>
                <p className="max-w-2xl mx-auto text-text-secondary tracking-wide leading-relaxed">
                    {dresscodeReady
                        ? `We respectfully request ${WEDDING.dresscode.short.toLowerCase()} attire for our celebration.`
                        : "Dress code details coming soon — we can\u2019t wait to celebrate with you in style."}
                </p>
            </Section>

            <Section background="surface" className="py-24">
                <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto mb-20 text-center md:text-left">
                    <div className="space-y-4">
                        <h2 className="font-heading text-3xl text-primary">For the Ladies</h2>
                        <p className="text-text-secondary leading-relaxed">
                            {WEDDING.dresscode.ladies === "TBD"
                                ? "Attire guidance for ladies is coming soon. Use the moodboard below for inspiration."
                                : WEDDING.dresscode.ladies}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-heading text-3xl text-primary">For the Gentlemen</h2>
                        <p className="text-text-secondary leading-relaxed">
                            {WEDDING.dresscode.gentlemen === "TBD"
                                ? "Attire guidance for gentlemen is coming soon. Use the moodboard below for inspiration."
                                : WEDDING.dresscode.gentlemen}
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mt-16">
                    <h3 className="text-center uppercase tracking-[0.3em] text-sm text-text-secondary mb-12">
                        Moodboard Inspiration
                    </h3>
                    <div className="columns-2 md:columns-3 gap-4 space-y-4">
                        {moodboardImages.map((img, idx) => (
                            <div key={idx} className="break-inside-avoid relative hover:opacity-90 transition-opacity">
                                <Image
                                    src={img.src}
                                    alt={img.label}
                                    width={600}
                                    height={800}
                                    className="w-full rounded-sm shadow-sm"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = img.fallback;
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
}
