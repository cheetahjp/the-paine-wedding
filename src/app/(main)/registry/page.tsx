import React from "react";
import Section from "@/components/ui/Section";
import Link from "next/link";
import { Gift, Heart } from "lucide-react";
import { getWeddingData } from "@/lib/site-settings";

const iconMap = {
    gift: Gift,
    heart: Heart,
};

export default async function Registry() {
    const { wedding } = await getWeddingData();

    return (
        <div>
            <Section background="surface" className="text-center pb-14 pt-12 md:pb-16 md:pt-16">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Registry</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide leading-relaxed">
                    Your presence at our wedding is the greatest gift of all. However, if you wish to honor us
                    with a gift, we have registered at the following.
                </p>
            </Section>

            <Section background="base" className="pt-0">
                <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
                    {wedding.registry.map((registry, idx) => {
                        const Icon = iconMap[registry.icon as keyof typeof iconMap] ?? Gift;
                        return (
                            <Link
                                key={idx}
                                href={registry.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="surface-panel group block p-10 text-center transition-transform duration-300 hover:-translate-y-1"
                            >
                                <div className="surface-inset mx-auto mb-6 flex h-14 w-14 items-center justify-center text-primary">
                                    <Icon size={32} strokeWidth={1} />
                                </div>
                                <h2 className="font-heading text-xl mb-3">{registry.name}</h2>
                                <p
                                    className="text-sm text-text-secondary mb-8 min-h-[40px]"
                                    data-admin-key={`registry.${idx}.description`}
                                    data-admin-type="text"
                                    data-admin-current-text={registry.description}
                                    data-admin-label={`Registry #${idx + 1} — Description`}
                                >
                                    {registry.description}
                                </p>
                                <span className="inline-flex w-full items-center justify-center rounded-full bg-primary px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-white shadow-[0_18px_38px_rgba(20,42,68,0.14)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_24px_48px_rgba(20,42,68,0.18)]">
                                    View Registry
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}
