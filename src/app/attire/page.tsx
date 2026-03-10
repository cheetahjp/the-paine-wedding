import React from "react";
import Section from "@/components/ui/Section";
import { AttireImage } from "@/components/ui/AttireImage";
import { getWeddingData } from "@/lib/site-settings";

export default async function Attire() {
    const { wedding, images, overlays } = await getWeddingData();
    const dresscodeReady = wedding.dresscode.short !== "TBD";

    // Build combined moodboard: ladies images first, then gents
    const moodboardImages = [
        ...images.attire.ladies.map((src, i) => ({
            src,
            fallback: images.attire.ladiesFallbacks[i],
            label: `Ladies Attire ${i + 1}`,
            adminKey: `images.attire.ladies.${i}`,
            overlay: overlays.attireLadies[i],
        })),
        ...images.attire.gents.map((src, i) => ({
            src,
            fallback: images.attire.gentsFallbacks[i],
            label: `Gentlemen Attire ${i + 1}`,
            adminKey: `images.attire.gents.${i}`,
            overlay: overlays.attireGents[i],
        })),
    ];

    return (
        <div>
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Attire</h1>
                <p className="max-w-2xl mx-auto text-text-secondary tracking-wide leading-relaxed">
                    {dresscodeReady
                        ? `We respectfully request ${wedding.dresscode.short.toLowerCase()} attire for our celebration.`
                        : "Dress code details coming soon — we can\u2019t wait to celebrate with you in style."}
                </p>
            </Section>

            <Section background="surface" className="py-24">
                <div className="grid md:grid-cols-2 gap-16 max-w-4xl mx-auto mb-20 text-center md:text-left">
                    <div className="space-y-4">
                        <h2 className="font-heading text-3xl text-primary">For the Ladies</h2>
                        <p
                            className="text-text-secondary leading-relaxed"
                            data-admin-key="dresscode.ladies"
                            data-admin-type="rich-text"
                            data-admin-current-text={wedding.dresscode.ladies}
                            data-admin-label="Attire — Ladies"
                        >
                            {wedding.dresscode.ladies === "TBD"
                                ? "Attire guidance for ladies is coming soon. Use the moodboard below for inspiration."
                                : wedding.dresscode.ladies}
                        </p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="font-heading text-3xl text-primary">For the Gentlemen</h2>
                        <p
                            className="text-text-secondary leading-relaxed"
                            data-admin-key="dresscode.gentlemen"
                            data-admin-type="rich-text"
                            data-admin-current-text={wedding.dresscode.gentlemen}
                            data-admin-label="Attire — Gentlemen"
                        >
                            {wedding.dresscode.gentlemen === "TBD"
                                ? "Attire guidance for gentlemen is coming soon. Use the moodboard below for inspiration."
                                : wedding.dresscode.gentlemen}
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto mt-16">
                    <h3 className="text-center uppercase tracking-[0.3em] text-sm text-text-secondary mb-12">
                        Moodboard Inspiration
                    </h3>
                    <div className="columns-2 md:columns-3 gap-4 space-y-4">
                        {moodboardImages.map((img, idx) => (
                            <AttireImage
                                key={idx}
                                src={img.src}
                                fallback={img.fallback ?? ""}
                                alt={img.label}
                                adminKey={img.adminKey}
                                overlayColor={img.overlay?.color}
                                overlayOpacity={img.overlay?.opacity}
                            />
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
}
