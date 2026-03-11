import React from "react";
import Section from "@/components/ui/Section";
import { PersonPortrait } from "@/components/ui/PersonPortrait";
import { getWeddingData } from "@/lib/site-settings";

export default async function BridalParty() {
    const { wedding } = await getWeddingData();
    const { bridesmaids, groomsmen } = wedding.bridalParty;
    const hasParty = bridesmaids.length > 0 || groomsmen.length > 0;

    const fallback =
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

    return (
        <div>
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Bridal Party</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide">
                    The friends and family standing by our side on our special day.
                </p>
            </Section>

            <Section background="surface" className="py-24">
                {!hasParty ? (
                    <div className="max-w-xl mx-auto text-center py-20 space-y-5">
                        <div className="w-16 h-px bg-primary/30 mx-auto" />
                        <h2 className="font-heading text-3xl text-primary">Coming Soon</h2>
                        <p className="text-text-secondary leading-relaxed">
                            We can&apos;t wait to introduce you to the incredible people standing by our
                            side. Check back as we get closer to the date!
                        </p>
                        <div className="w-16 h-px bg-primary/30 mx-auto" />
                    </div>
                ) : (
                    <div className="max-w-6xl mx-auto space-y-32">
                        {bridesmaids.length > 0 && (
                            <div>
                                <h2 className="font-heading text-4xl text-center mb-16 text-primary">
                                    The Ladies
                                </h2>
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                                    {bridesmaids.map((person, idx) => (
                                        <div
                                            key={idx}
                                            className={`${bridesmaids.length > 3
                                                ? "w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)]"
                                                : "w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1.333rem)]"
                                                }`}
                                        >
                                            <PersonPortrait
                                                src={person.image}
                                                fallback={fallback}
                                                name={person.name}
                                                role={person.role}
                                                relationship={person.relationship}
                                                adminKey={`bridal-party.bridesmaids.${idx}.image`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {groomsmen.length > 0 && (
                            <div>
                                <h2 className="font-heading text-4xl text-center mb-16 text-primary">
                                    The Gentlemen
                                </h2>
                                <div className="flex flex-wrap justify-center gap-x-4 gap-y-8 md:gap-x-8 md:gap-y-12">
                                    {groomsmen.map((person, idx) => (
                                        <div
                                            key={idx}
                                            className={`${groomsmen.length > 3
                                                ? "w-[calc(50%-0.5rem)] md:w-[calc(25%-1.5rem)]"
                                                : "w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1.333rem)]"
                                                }`}
                                        >
                                            <PersonPortrait
                                                src={person.image}
                                                fallback={fallback}
                                                name={person.name}
                                                role={person.role}
                                                relationship={person.relationship}
                                                adminKey={`bridal-party.groomsmen.${idx}.image`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Section>
        </div>
    );
}
