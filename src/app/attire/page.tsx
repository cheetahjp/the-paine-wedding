import React from "react";
import Section from "@/components/ui/Section";
import Image from "next/image";

const inspirationImages = [
    "https://images.unsplash.com/photo-1594892415170-071a93e3d622?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1596704017254-9b121068fb29?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1605655787612-409dd786d7cd?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1563720235374-9b418d184ebc?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1588665792942-d392376dc372?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1564883401567-27e1fecde59b?auto=format&fit=crop&q=80",
];

export default function Attire() {
    return (
        <div className="pt-20">
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Attire</h1>
                <p className="max-w-2xl mx-auto text-text-secondary tracking-wide leading-relaxed">
                    We respectfully request black-tie optional attire for our celebration.
                </p>
            </Section>

            <Section background="surface" className="py-24">
                <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto mb-20 text-center md:text-left">
                    <div className="space-y-4">
                        <h2 className="font-heading text-3xl text-primary">For the Ladies</h2>
                        <p className="text-text-secondary leading-relaxed">
                            Floor-length gowns, elegant slip dresses, or formal cocktail dresses. Earth tones, deep rich colors, or classic black are encouraged.
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-heading text-3xl text-primary">For the Gentlemen</h2>
                        <p className="text-text-secondary leading-relaxed">
                            Tuxedos are warmly welcomed but not required. A dark, formal suit and tie will also be perfectly suited for the evening.
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mt-16">
                    <h3 className="text-center uppercase tracking-[0.3em] text-sm text-text-secondary mb-12">
                        Moodboard Inspiration
                    </h3>
                    <div className="columns-2 md:columns-3 gap-4 space-y-4">
                        {inspirationImages.map((src, idx) => (
                            <div key={idx} className="break-inside-avoid relative hover:opacity-90 transition-opacity">
                                <Image
                                    src={src}
                                    alt={`Attire Inspiration ${idx + 1}`}
                                    width={600}
                                    height={800}
                                    className="w-full rounded-sm shadow-sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
}
