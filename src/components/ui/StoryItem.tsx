"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface StoryItemData {
    year: string;
    title: string;
    description: string;
    image: string;
    imageFallback: string;
}

interface StoryItemProps {
    item: StoryItemData;
    index: number;
}

export default function StoryItem({ item, index }: StoryItemProps) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const isReversed = index % 2 !== 0;

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.12 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`flex flex-col md:flex-row items-center gap-12 lg:gap-20 ${
                isReversed ? "md:flex-row-reverse" : ""
            }`}
        >
            {/* Image panel */}
            <div
                className={`w-full md:w-1/2 transition-all duration-700 ease-out ${
                    visible
                        ? "opacity-100 translate-x-0"
                        : isReversed
                        ? "opacity-0 translate-x-12"
                        : "opacity-0 -translate-x-12"
                }`}
            >
                <div className="relative aspect-[4/5] w-full overflow-hidden shadow-[0_24px_64px_rgba(26,63,111,0.13)]">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-700 hover:scale-105"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = item.imageFallback;
                        }}
                    />
                </div>
            </div>

            {/* Text panel */}
            <div
                className={`w-full md:w-1/2 space-y-5 text-center md:text-left transition-all duration-700 ease-out delay-150 ${
                    visible
                        ? "opacity-100 translate-x-0"
                        : isReversed
                        ? "opacity-0 -translate-x-12"
                        : "opacity-0 translate-x-12"
                }`}
            >
                {/* Year label with tan accent lines */}
                <div className="flex items-center gap-3 justify-center md:justify-start">
                    <span className="h-px w-8 bg-accent" />
                    <p className="uppercase tracking-[0.25em] text-xs text-accent font-medium">
                        {item.year}
                    </p>
                    <span className="h-px w-8 bg-accent md:hidden" />
                </div>

                <h2 className="font-heading text-4xl lg:text-5xl text-primary leading-tight">
                    {item.title}
                </h2>

                <p className="text-text-secondary leading-relaxed md:pr-10">
                    {item.description.startsWith("TODO")
                        ? "Our story is being written… check back soon."
                        : item.description}
                </p>
            </div>
        </div>
    );
}
