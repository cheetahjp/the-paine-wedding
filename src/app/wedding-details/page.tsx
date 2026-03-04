import React from "react";
import Section from "@/components/ui/Section";
import { MapPin, Clock, CalendarHeart, GlassWater } from "lucide-react";

const details = [
    {
        title: "Ceremony",
        icon: CalendarHeart,
        content: (
            <>
                <p className="font-medium text-lg mb-2">3:30 PM</p>
                <p>The Grand Cathedral</p>
                <p>123 Wedding Way, Dallas, TX</p>
            </>
        ),
    },
    {
        title: "Reception",
        icon: GlassWater,
        content: (
            <>
                <p className="font-medium text-lg mb-2">5:00 PM</p>
                <p>The Modern Estate</p>
                <p>456 Celebration Cir, Dallas, TX</p>
            </>
        ),
    },
    {
        title: "Attire",
        icon: Clock, // We'll use a generic icon or change it later
        content: (
            <>
                <p className="font-medium text-lg mb-2">Formal Black-Tie Optional</p>
                <p>Floor-length gowns for ladies.</p>
                <p>Tuxedos or dark suits for gentlemen.</p>
            </>
        ),
    },
    {
        title: "Location Details",
        icon: MapPin,
        content: (
            <>
                <p className="font-medium text-lg mb-2">Parking & Transport</p>
                <p>Valet parking is compliments of the couple.</p>
                <p>Shuttles provided from main hotels.</p>
            </>
        ),
    },
];

export default function WeddingDetails() {
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
