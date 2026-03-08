"use client";

import React from "react";
import Section from "@/components/ui/Section";
import StoryImage from "@/components/ui/StoryImage";
import { WEDDING } from "@/lib/wedding-data";

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
                {WEDDING.story.map((item, index) => (
                    <div
                        key={item.title}
                        className={`flex flex-col md:flex-row items-center gap-16 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""
                            }`}
                    >
                        <div className="w-full md:w-1/2">
                            <div className="relative aspect-[4/5] w-full overflow-hidden shadow-[0_20px_50px_rgba(20,42,68,0.1)]">
                                <StoryImage
                                    src={item.image}
                                    alt={item.title}
                                    fallback={item.imageFallback}
                                />
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
                            <p className="uppercase tracking-[0.2em] text-sm text-text-secondary font-medium">
                                {item.year}
                            </p>
                            <h2 className="font-heading text-4xl text-primary">{item.title}</h2>
                            <p className="text-text-secondary leading-relaxed md:pr-12">
                                {item.description.startsWith("TODO")
                                    ? "Our story is being written... check back soon."
                                    : item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
