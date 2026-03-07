import React from "react";
import Section from "@/components/ui/Section";
import { MapPin, Shirt, CalendarHeart, Info } from "lucide-react";
import { WEDDING } from "@/lib/wedding-data";
import Link from "next/link";

export default function WeddingDetails() {
    const details = [
        {
            title: "The Venue",
            icon: CalendarHeart,
            content: (
                <>
                    <p className="font-medium text-lg mb-2">{WEDDING.venue.name}</p>
                    <p>{WEDDING.venue.address}</p>
                    <p>{WEDDING.venue.city}</p>
                    {WEDDING.venue.ceremonyTime !== "TBD" && (
                        <p className="mt-2 text-sm font-medium tracking-widest uppercase text-accent">
                            Ceremony at {WEDDING.venue.ceremonyTime}
                        </p>
                    )}
                    <Link
                        href={WEDDING.venue.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-block text-sm underline underline-offset-4 text-primary/70 hover:text-primary transition-colors"
                    >
                        View on Google Maps &rarr;
                    </Link>
                </>
            ),
        },
        {
            title: "Attire",
            icon: Shirt,
            content: (
                <>
                    <p className="font-medium text-lg mb-2">
                        {WEDDING.dresscode.short === "TBD" ? "Details Coming Soon" : WEDDING.dresscode.short}
                    </p>
                    {WEDDING.dresscode.short !== "TBD" ? (
                        <>
                            <p className="text-sm">{WEDDING.dresscode.summary}</p>
                            <Link
                                href="/attire"
                                className="mt-4 inline-block text-sm underline underline-offset-4 text-primary/70 hover:text-primary transition-colors"
                            >
                                View Attire Details &rarr;
                            </Link>
                        </>
                    ) : (
                        <p className="text-sm">Full attire details will be posted soon.</p>
                    )}
                </>
            ),
        },
        {
            title: "Getting There",
            icon: MapPin,
            content: (
                <>
                    <p className="font-medium text-lg mb-2">Parking &amp; Transport</p>
                    <p>
                        {WEDDING.venue.parking === "TBD"
                            ? "Parking details coming soon."
                            : WEDDING.venue.parking}
                    </p>
                    {WEDDING.venue.shuttle !== "TBD" && WEDDING.venue.shuttle !== "none" && (
                        <p className="mt-2">{WEDDING.venue.shuttle}</p>
                    )}
                    {WEDDING.venue.shuttle === "none" && (
                        <p className="mt-2 text-sm">
                            No shuttle service is provided. Please arrange your own transportation.
                        </p>
                    )}
                </>
            ),
        },
        {
            title: "Day Of",
            icon: Info,
            content: (
                <>
                    <p className="font-medium text-lg mb-2">{WEDDING.date.dayOfWeek}</p>
                    <p>{WEDDING.date.display}</p>
                    <p className="mt-2 text-sm">
                        RSVP by <span className="font-medium">{WEDDING.date.rsvpDeadline}</span>
                    </p>
                </>
            ),
        },
    ];

    return (
        <div className="pt-20">
            <Section background="surface" className="text-center pb-24 top-0 mt-[-80px] pt-40">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Wedding Details</h1>
                <p className="max-w-2xl mx-auto text-text-secondary tracking-wide">
                    Everything you need to know about our special day to celebrate with us.
                </p>
            </Section>

            <Section background="base" className="pt-0 -mt-24">
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {details.map((detail, idx) => {
                        const Icon = detail.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-white p-12 text-center rounded-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-surface/50 transition-all duration-300 hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                            >
                                <div className="w-16 h-16 mx-auto mb-6 bg-surface rounded-full flex items-center justify-center text-primary">
                                    <Icon size={24} strokeWidth={1.5} />
                                </div>
                                <h2 className="font-heading text-2xl mb-4 text-primary">{detail.title}</h2>
                                <div className="text-text-secondary leading-relaxed space-y-1">
                                    {detail.content}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}
