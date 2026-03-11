import React from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
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
            <Section className="text-center pb-12">
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
                        const isReady = registry.url !== "TODO";
                        return (
                            <div
                                key={idx}
                                className="bg-surface p-10 text-center rounded-sm transition-transform duration-300 hover:-translate-y-1"
                            >
                                <div className="w-12 h-12 mx-auto mb-6 flex items-center justify-center text-primary">
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
                                {isReady ? (
                                    <Button variant="outline" className="w-full text-xs" href={registry.url}>
                                        View Registry
                                    </Button>
                                ) : (
                                    <div className="space-y-2">
                                        <span className="block w-full text-center text-xs tracking-widest uppercase text-text-secondary/50 py-2 border border-dashed border-gray-300 rounded-full">
                                            Coming Soon
                                        </span>
                                        <p
                                            className="text-xs text-text-secondary/40 italic"
                                            data-admin-key={`registry.${idx}.url`}
                                            data-admin-type="text"
                                            data-admin-current-text={registry.url}
                                            data-admin-label={`Registry #${idx + 1} — URL`}
                                        >
                                            Click to add URL ✎
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Section>
        </div>
    );
}
