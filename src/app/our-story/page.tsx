import React from "react";
import Section from "@/components/ui/Section";
import Image from "next/image";

const timelineItems = [
    {
        title: "How We Met",
        date: "Autumn 2021",
        description:
            "Our story began on a crisp evening in downtown Dallas. We found ourselves deep in conversation about our shared love for travel and strong coffee. What was supposed to be a quick drink turned into a five-hour conversation that changed everything.",
        image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80",
    },
    {
        title: "Dating",
        date: "2021 - 2023",
        description:
            "The next two years were a blur of weekend road trips, exploring new restaurants, and learning everything about each other. Through every high and low, we realized that there was no one else we'd rather have by our side.",
        image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80",
    },
    {
        title: "The Proposal",
        date: "Spring 2025",
        description:
            "Under the soft glow of string lights in our favorite vineyard, Jeff got down on one knee. With tears of joy and surrounded by the quiet beauty of the countryside, the answer was the easiest 'yes' ever spoken.",
        image: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80",
    },
];

export default function OurStory() {
    return (
        <div className="pt-20">
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Our Story</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide leading-relaxed">
                    From a chance meeting to a lifetime commitment. Here is a glimpse into our journey together.
                </p>
            </Section>

            {/* Timeline */}
            <div className="max-w-6xl mx-auto px-6 pb-32 space-y-32">
                {timelineItems.map((item, index) => (
                    <div
                        key={item.title}
                        className={`flex flex-col md:flex-row items-center gap-16 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
                            }`}
                    >
                        <div className="w-full md:w-1/2">
                            <div className="relative aspect-[4/5] w-full overflow-hidden shadow-[0_20px_50px_rgba(20,42,68,0.1)]">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 hover:scale-105"
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                            <p className="uppercase tracking-[0.2em] text-sm text-text-secondary font-medium">
                                {item.date}
                            </p>
                            <h2 className="font-heading text-4xl text-primary">{item.title}</h2>
                            <p className="text-text-secondary leading-relaxed md:pr-12">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
