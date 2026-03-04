import React from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

const hotels = [
    {
        name: "The Ritz-Carlton, Dallas",
        distance: "1.2 miles from ceremony",
        link: "#",
        description: "Luxury accommodations with a spa and fine dining.",
    },
    {
        name: "Hotel ZaZa Uptown",
        distance: "0.8 miles from ceremony",
        link: "#",
        description: "A boutique hotel offering unique, art-filled rooms.",
    },
    {
        name: "The Adolphus",
        distance: "2.5 miles from ceremony",
        link: "#",
        description: "Historic elegance in the heart of downtown.",
    },
];

export default function Travel() {
    return (
        <div className="pt-20">
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Travel & Stay</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide leading-relaxed">
                    For our out-of-town guests, we have arranged room blocks at a few of our favorite hotels.
                    Dallas is best accessed via DFW or Dallas Love Field (DAL).
                </p>
            </Section>

            <Section background="surface" className="py-24">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 space-y-8">
                        <h2 className="font-heading text-3xl text-primary">Accommodations</h2>
                        <div className="space-y-6 text-left">
                            {hotels.map((hotel, idx) => (
                                <div key={idx} className="border-b border-gray-200 pb-6 last:border-0 last:pb-0">
                                    <h3 className="font-heading text-xl text-primary mb-1">{hotel.name}</h3>
                                    <p className="text-sm font-medium tracking-widest text-accent uppercase mb-2">
                                        {hotel.distance}
                                    </p>
                                    <p className="text-text-secondary mb-4">{hotel.description}</p>
                                    <Button
                                        variant="outline"
                                        className="text-xs px-6 py-2 border-primary/20 hover:border-primary"
                                        href={hotel.link}
                                    >
                                        Book Room
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="w-full aspect-square bg-gray-200 shadow-sm relative overflow-hidden group">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3353.793740927763!2d-96.80496888481483!3d32.79774698096538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864e9921473d09a1%3A0xe542a2d7fec0dfdc!2sDallas%2C%20TX!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                                className="absolute inset-0 w-full h-full grayscale opacity-80 transition-opacity duration-300 group-hover:grayscale-0 group-hover:opacity-100 mix-blend-multiply"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="Wedding Map Location"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
