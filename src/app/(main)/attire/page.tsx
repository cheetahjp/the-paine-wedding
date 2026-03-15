import React from "react";
import Section from "@/components/ui/Section";
import AttireTabs from "@/components/ui/AttireTabs";
import { getWeddingData } from "@/lib/site-settings";

export default async function Attire() {
    const { wedding, images, overlays } = await getWeddingData();
    const dresscodeReady = wedding.dresscode.short !== "TBD";

    const ladiesImages = images.attire.ladies.map((src, i) => ({
            src,
            fallback: images.attire.ladiesFallbacks[i],
            label: `Ladies Attire ${i + 1}`,
            adminKey: `images.attire.ladies.${i}`,
            overlay: overlays.attireLadies[i],
        }));
    const gentlemenImages = images.attire.gents.map((src, i) => ({
            src,
            fallback: images.attire.gentsFallbacks[i],
            label: `Gentlemen Attire ${i + 1}`,
            adminKey: `images.attire.gents.${i}`,
            overlay: overlays.attireGents[i],
        }));

    return (
        <div>
            <Section background="surface" className="text-center pb-14 pt-12 md:pb-16 md:pt-16">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Attire</h1>
                <p className="max-w-2xl mx-auto text-text-secondary tracking-wide leading-relaxed">
                    {dresscodeReady
                        ? `We respectfully request ${wedding.dresscode.short.toLowerCase()} attire for our celebration.`
                        : "Dress code details coming soon — we can\u2019t wait to celebrate with you in style."}
                </p>
            </Section>

            <Section background="surface" className="py-24">
                <div className="mx-auto max-w-6xl">
                    <AttireTabs
                        ladiesText={
                            wedding.dresscode.ladies === "TBD"
                                ? "Dressy cocktail inspiration for the ladies is coming soon."
                                : wedding.dresscode.ladies
                        }
                        gentlemenText={
                            wedding.dresscode.gentlemen === "TBD"
                                ? "Dressy tailored inspiration for the gentlemen is coming soon."
                                : wedding.dresscode.gentlemen
                        }
                        ladiesImages={ladiesImages}
                        gentlemenImages={gentlemenImages}
                        ladiesAdminKey="dresscode.ladies"
                        gentlemenAdminKey="dresscode.gentlemen"
                    />
                </div>
            </Section>
        </div>
    );
}
