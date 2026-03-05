import React from "react";
import Section from "@/components/ui/Section";

const scheduleItems = [
    { time: "3:00 PM", event: "Guests Arrive", detail: "Welcome drinks and seating" },
    { time: "3:30 PM", event: "Ceremony", detail: "The exchange of vows" },
    { time: "4:00 PM", event: "Cocktail Hour", detail: "Light bites and signature drinks" },
    { time: "5:00 PM", event: "Dinner", detail: "A seated formal dinner" },
    { time: "6:00 PM", event: "Toasts", detail: "Words from our closest friends and family" },
    { time: "7:00 PM", event: "Dancing", detail: "Live band and celebration" },
    { time: "9:30 PM", event: "Send Off", detail: "Sparkler farewell" },
];

export default function Schedule() {
    return (
        <div className="pt-20">
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Schedule of Events</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide">
                    A timeline of our wedding day. We can&apos;t wait to share these moments with you.
                </p>
            </Section>

            <Section background="surface" className="py-24">
                <div className="max-w-3xl mx-auto">
                    <div className="relative border-l border-primary/20 pl-8 ml-4 md:pl-12 md:ml-12 space-y-16">
                        {scheduleItems.map((item, index) => (
                            <div key={index} className="relative">
                                {/* Timeline Dot */}
                                <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-surface" />

                                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                                    <h2 className="font-heading text-2xl text-primary">{item.event}</h2>
                                    <span className="text-sm font-medium tracking-[0.2em] text-accent mt-2 md:mt-0 uppercase">
                                        {item.time}
                                    </span>
                                </div>
                                <p className="text-text-secondary leading-relaxed">
                                    {item.detail}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
}
