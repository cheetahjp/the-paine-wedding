import React from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { Gift, Heart } from "lucide-react";

const registries = [
    {
        name: "Crate & Barrel",
        description: "For our home and kitchen essentials.",
        link: "#",
        icon: Gift,
    },
    {
        name: "Williams Sonoma",
        description: "Fine dining and cooking equipment.",
        link: "#",
        icon: Gift,
    },
    {
        name: "Honeymoon Fund",
        description: "Contribute to our trip to the Amalfi Coast.",
        link: "#",
        icon: Heart,
    },
];

export default function Registry() {
    return (
        <div className="pt-20">
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Registry</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide leading-relaxed">
                    Your presence at our wedding is the greatest gift of all. However, if you wish to honor us with a gift, we have registered at the following.
                </p>
            </Section>

            <Section background="base" className="pt-0">
                <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
                    {registries.map((registry, idx) => {
                        const Icon = registry.icon;
                        return (
                            <div
                                key={idx}
                                className="bg-surface p-10 text-center rounded-sm transition-transform duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center text-primary">
                                    <Icon size={32} strokeWidth={1} />
                                </div>
                                <h2 className="font-heading text-xl mb-3">{registry.name}</h2>
                                <p className="text-sm text-text-secondary mb-8 h-10">{registry.description}</p>
                                <Button variant="outline" className="w-full text-xs" href={registry.link}>
                                    View Registry
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}
