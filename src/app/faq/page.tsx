import React from "react";
import Section from "@/components/ui/Section";

const faqs = [
    {
        q: "When is the RSVP deadline?",
        a: "Please RSVP by August 1st, 2026, so we can have an accurate headcount.",
    },
    {
        q: "Can I bring a date?",
        a: "Due to venue capacity constraints, we are only able to accommodate the guests formally named on your invitation.",
    },
    {
        q: "Are kids welcome?",
        a: "While we love your little ones, our wedding will be an adults-only event. We appreciate you making arrangements ahead of time and leaving the kids at home so you can celebrate with us.",
    },
    {
        q: "Is there parking at the venue?",
        a: "Yes, complimentary valet parking will be available at both the ceremony and reception locations.",
    },
    {
        q: "What is the dress code?",
        a: "Black-tie optional. We would love to see our family and friends dress up with us! Floor-length gowns or formal cocktail dresses, tuxes, or dark suits.",
    },
];

export default function FAQ() {
    return (
        <div className="pt-20">
            <Section className="text-center pb-12">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">F.A.Q.</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide">
                    Some common questions regarding our wedding weekend.
                </p>
            </Section>

            <Section background="surface" className="py-24">
                <div className="max-w-3xl mx-auto space-y-8">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-white p-8 md:p-10 shadow-sm rounded-sm">
                            <h3 className="font-heading text-2xl text-primary mb-4">{faq.q}</h3>
                            <p className="text-text-secondary leading-relaxed">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </Section>
        </div>
    );
}
