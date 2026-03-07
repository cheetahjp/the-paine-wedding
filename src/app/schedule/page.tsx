import React from "react";
import Section from "@/components/ui/Section";
import { WEDDING } from "@/lib/wedding-data";

export default function Schedule() {
    const hasSchedule = WEDDING.schedule.length > 0;

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
                    {hasSchedule ? (
                        <div className="relative border-l border-primary/20 pl-8 ml-4 md:pl-12 md:ml-12 space-y-16">
                            {WEDDING.schedule.map((item, index) => (
                                <div key={index} className="relative">
                                    {/* Timeline Dot */}
                                    <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-4 h-4 rounded-full bg-primary ring-4 ring-surface" />

                                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                                        <h2 className="font-heading text-2xl text-primary">{item.title}</h2>
                                        <span className="text-sm font-medium tracking-[0.2em] text-accent mt-2 md:mt-0 uppercase">
                                            {item.time}
                                        </span>
                                    </div>
                                    <p className="text-text-secondary leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 space-y-4">
                            <p className="font-heading text-2xl text-primary">Schedule Coming Soon</p>
                            <p className="text-text-secondary max-w-sm mx-auto leading-relaxed">
                                We&apos;re finalizing the details for {WEDDING.date.display}. Check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
