import React from "react";
import Section from "@/components/ui/Section";
import StoryItem from "@/components/ui/StoryItem";
import { WEDDING } from "@/lib/wedding-data";

export default function OurStory() {
    return (
        <div className="pt-20">
            {/* Page header */}
            <Section className="text-center pb-8">
                <div className="flex items-center justify-center gap-4 mb-5">
                    <span className="h-px w-12 bg-accent" />
                    <span className="uppercase tracking-[0.3em] text-xs text-accent font-medium">
                        Our Story
                    </span>
                    <span className="h-px w-12 bg-accent" />
                </div>
                <h1 className="font-heading text-5xl md:text-7xl mb-6 text-primary">
                    {WEDDING.couple.names}
                </h1>
                <p className="max-w-xl mx-auto text-text-secondary leading-relaxed">
                    From a chance meeting to a lifetime commitment. Here is a glimpse into our journey together.
                </p>
            </Section>

            {/* Thin burgundy rule to anchor the section */}
            <div className="flex items-center justify-center mb-16 px-6">
                <span className="h-px flex-1 max-w-xs bg-surface" />
                <span className="mx-4 text-secondary text-xs">&#10022;</span>
                <span className="h-px flex-1 max-w-xs bg-surface" />
            </div>

            {/* Timeline items */}
            <div className="max-w-6xl mx-auto px-6 pb-32 space-y-28">
                {WEDDING.story.map((item, index) => (
                    <StoryItem key={item.title} item={item} index={index} />
                ))}
            </div>
        </div>
    );
}
