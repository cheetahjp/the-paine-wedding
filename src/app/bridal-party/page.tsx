import React from "react";
import Section from "@/components/ui/Section";
import Image from "next/image";

const bridesmaids = [
    { name: "Sarah Jenkins", role: "Maid of Honor", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80" },
    { name: "Emily Chen", role: "Bridesmaid", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80" },
    { name: "Jessica Smith", role: "Bridesmaid", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80" },
    { name: "Anna Davis", role: "Bridesmaid", image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=400&q=80" },
];

const groomsmen = [
    { name: "Michael Paine", role: "Best Man", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" },
    { name: "David Roberts", role: "Groomsman", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
    { name: "Christopher Lee", role: "Groomsman", image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80" },
    { name: "James Wilson", role: "Groomsman", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80" }, // Reusing one for placeholder
];

export default function BridalParty() {
    return (
        <div className="pt-20">
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Bridal Party</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide">
                    The friends and family standing by our side on our special day.
                </p>
            </Section>

            <Section background="surface" className="py-24">
                {/* Ladies */}
                <div className="max-w-6xl mx-auto mb-32">
                    <h2 className="font-heading text-4xl text-center mb-16 text-primary">The Ladies</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {bridesmaids.map((person, idx) => (
                            <div key={idx} className="group text-center">
                                <div className="relative aspect-[3/4] w-full mb-6 overflow-hidden rounded-sm shadow-sm">
                                    <Image
                                        src={person.image}
                                        alt={person.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="font-heading text-xl text-primary">{person.name}</h3>
                                <p className="uppercase tracking-[0.2em] text-xs text-text-secondary mt-2">{person.role}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Gentlemen */}
                <div className="max-w-6xl mx-auto">
                    <h2 className="font-heading text-4xl text-center mb-16 text-primary">The Gentlemen</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {groomsmen.map((person, idx) => (
                            <div key={idx} className="group text-center">
                                <div className="relative aspect-[3/4] w-full mb-6 overflow-hidden rounded-sm shadow-sm">
                                    <Image
                                        src={person.image}
                                        alt={person.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                                <h3 className="font-heading text-xl text-primary">{person.name}</h3>
                                <p className="uppercase tracking-[0.2em] text-xs text-text-secondary mt-2">{person.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
}
