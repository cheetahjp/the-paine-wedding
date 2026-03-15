import React from "react";
import Section from "@/components/ui/Section";
import { getWeddingData } from "@/lib/site-settings";

export default async function FAQ() {
    const { wedding } = await getWeddingData();

    return (
        <div>
            <Section background="surface" className="text-center pb-14 pt-12 md:pb-16 md:pt-16">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">F.A.Q.</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide">
                    Some common questions regarding our wedding day.
                </p>
            </Section>

            <Section background="surface" className="py-24">
                <div className="max-w-3xl mx-auto space-y-8">
                    {wedding.faq.map((faq, idx) => (
                        <div key={idx} className="surface-panel p-8 md:p-10">
                            <h3
                                className="font-heading text-2xl text-primary mb-4"
                                data-admin-key={`faq.${idx}.q`}
                                data-admin-type="text"
                                data-admin-current-text={faq.q}
                                data-admin-label={`FAQ #${idx + 1} — Question`}
                            >
                                {faq.q}
                            </h3>
                            <p
                                className="text-text-secondary leading-relaxed"
                                data-admin-key={`faq.${idx}.a`}
                                data-admin-type="rich-text"
                                data-admin-current-text={faq.a === "TBD" ? "Details coming soon — check back as we get closer to the date!" : faq.a}
                                data-admin-label={`FAQ #${idx + 1} — Answer`}
                            >
                                {faq.a === "TBD" ? "Details coming soon — check back as we get closer to the date!" : faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
