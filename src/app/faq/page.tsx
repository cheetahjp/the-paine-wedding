import React from "react";
import Section from "@/components/ui/Section";
import { WEDDING } from "@/lib/wedding-data";

export default function FAQ() {
    return (
        <div>
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">F.A.Q.</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide">
                    Some common questions regarding our wedding day.
                </p>
            </Section>

            <Section background="surface" className="py-24">
                <div className="max-w-3xl mx-auto space-y-8">
                    {WEDDING.faq.map((faq, idx) => (
                        <div key={idx} className="bg-white p-8 md:p-10 shadow-sm rounded-sm">
                            <h3 className="font-heading text-2xl text-primary mb-4">{faq.q}</h3>
                            <p className="text-text-secondary leading-relaxed">
                                {faq.a === "TBD" ? "Details coming soon — check back as we get closer to the date!" : faq.a}
                            </p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
