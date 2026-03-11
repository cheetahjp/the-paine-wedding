import React from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { getWeddingData } from "@/lib/site-settings";

export default async function Travel() {
    const { wedding } = await getWeddingData();
    const hasHotels = wedding.hotels.length > 0;

    return (
        <div>
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Travel &amp; Stay</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide leading-relaxed">
                    Everything you need to get here and settle in. The venue is located at{" "}
                    <span className="font-medium text-primary">{wedding.venue.fullAddress}</span> in
                    the Dallas / Celeste area of Texas.
                </p>
            </Section>

            {/* Airports */}
            <Section className="py-20">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-heading text-3xl text-center text-primary mb-12">
                        Nearest Airports
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {wedding.travel.airports.map((airport, idx) => (
                            <div
                                key={airport.code}
                                className="bg-white border border-surface p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] rounded-sm"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="font-heading text-xl text-primary pr-4">
                                        {airport.name}
                                    </h3>
                                    <span className="text-sm font-bold tracking-widest text-accent uppercase shrink-0 bg-surface px-2 py-1 rounded">
                                        {airport.code}
                                    </span>
                                </div>
                                <p
                                    className="text-text-secondary leading-relaxed mb-4"
                                    data-admin-key={`travel.airport.${idx}.description`}
                                    data-admin-type="rich-text"
                                    data-admin-current-text={airport.description}
                                    data-admin-label={`Airport ${airport.code} — Description`}
                                >
                                    {airport.description}
                                </p>
                                <a
                                    href={airport.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm underline underline-offset-4 text-primary/70 hover:text-primary transition-colors"
                                >
                                    Airport Website &rarr;
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Hotels & Map */}
            <Section background="surface" className="py-24">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 space-y-8">
                        <h2 className="font-heading text-3xl text-primary">Accommodations</h2>

                        {hasHotels ? (
                            <div className="space-y-6 text-left">
                                {wedding.hotels.map((hotel, idx) => (
                                    <div
                                        key={idx}
                                        className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
                                    >
                                        <h3 className="font-heading text-xl text-primary mb-1">
                                            {hotel.name}
                                        </h3>
                                        <p className="text-sm font-medium tracking-widest text-accent uppercase mb-2">
                                            {hotel.distance}
                                        </p>
                                        <p className="text-text-secondary mb-4">
                                            {hotel.description}
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="text-xs px-6 py-2 border-primary/20 hover:border-primary"
                                            href={hotel.bookingUrl}
                                        >
                                            Book Room
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-left space-y-4 text-text-secondary">
                                <p className="leading-relaxed">
                                    Hotel recommendations are coming soon! The venue is in the Celeste, TX
                                    area — about an hour northeast of Dallas — with accommodation options
                                    available in both the local area and the greater Dallas metro.
                                </p>
                                <p className="text-sm">
                                    In the meantime, check{" "}
                                    <a
                                        href="https://www.google.com/maps/search/hotels+near+Celeste+TX"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline underline-offset-4 hover:text-primary transition-colors"
                                    >
                                        hotels near Celeste, TX
                                    </a>{" "}
                                    for available options close to {wedding.venue.name}.
                                </p>
                                <p className="text-sm italic text-text-secondary/70">
                                    We recommend booking early — September is a popular travel season!
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="order-1 md:order-2">
                        <div className="w-full aspect-square bg-gray-200 shadow-sm relative overflow-hidden group">
                            <iframe
                                src={wedding.venue.mapsEmbedSrc}
                                className="absolute inset-0 w-full h-full grayscale opacity-80 transition-opacity duration-300 group-hover:grayscale-0 group-hover:opacity-100 mix-blend-multiply"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title={`Map showing ${wedding.venue.name}`}
                            ></iframe>
                        </div>
                        <p className="text-center text-xs text-text-secondary mt-3 tracking-wider uppercase">
                            {wedding.venue.name} &mdash; {wedding.venue.fullAddress}
                        </p>
                        <div className="text-center mt-3">
                            <a
                                href={wedding.venue.mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm underline underline-offset-4 text-primary/70 hover:text-primary transition-colors"
                            >
                                Open in Google Maps &rarr;
                            </a>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
}
