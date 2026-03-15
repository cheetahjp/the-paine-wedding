"use client";

import { useMemo, useState } from "react";
import { AttireImage } from "@/components/ui/AttireImage";

type AttireImageItem = {
    src: string;
    fallback: string;
    label: string;
    adminKey: string;
    overlay?: {
        color?: string;
        opacity?: number;
    } | null;
};

type AttireTabsProps = {
    ladiesText: string;
    gentlemenText: string;
    ladiesImages: AttireImageItem[];
    gentlemenImages: AttireImageItem[];
    ladiesAdminKey: string;
    gentlemenAdminKey: string;
};

export default function AttireTabs({
    ladiesText,
    gentlemenText,
    ladiesImages,
    gentlemenImages,
    ladiesAdminKey,
    gentlemenAdminKey,
}: AttireTabsProps) {
    const [activeTab, setActiveTab] = useState<"ladies" | "gentlemen">("ladies");

    const tabContent = useMemo(() => {
        return activeTab === "ladies"
            ? {
                  title: "For the Ladies",
                  description: ladiesText,
                  images: ladiesImages,
                  adminKey: ladiesAdminKey,
                  adminLabel: "Attire — Ladies",
              }
            : {
                  title: "For the Gentlemen",
                  description: gentlemenText,
                  images: gentlemenImages,
                  adminKey: gentlemenAdminKey,
                  adminLabel: "Attire — Gentlemen",
              };
    }, [activeTab, gentlemenAdminKey, gentlemenImages, gentlemenText, ladiesAdminKey, ladiesImages, ladiesText]);

    return (
        <div className="mx-auto max-w-6xl">
            <div className="relative">
                <div className="relative z-10 flex items-end gap-2 pl-4 md:pl-8">
                    {[
                        { key: "ladies" as const, label: "For the Ladies" },
                        { key: "gentlemen" as const, label: "For the Gentlemen" },
                    ].map((tab) => {
                        const active = activeTab === tab.key;

                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                className={`relative rounded-t-[1.8rem] border px-5 py-4 text-left transition-all duration-300 md:px-8 ${
                                    active
                                        ? "z-20 -mb-px border-primary/18 border-b-transparent bg-primary text-white"
                                        : "z-0 mb-0.5 border-primary/12 bg-[linear-gradient(180deg,rgba(251,248,243,0.98)_0%,rgba(245,240,231,0.98)_100%)] text-primary hover:bg-[linear-gradient(180deg,rgba(248,243,235,0.98)_0%,rgba(241,235,226,0.98)_100%)]"
                                }`}
                            >
                                <div className={`font-heading text-2xl leading-none md:text-3xl ${active ? "text-white" : "text-primary"}`}>
                                    {tab.label}
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="surface-panel relative z-10 -mt-px p-8 md:p-10">
                    <div className="mx-auto max-w-2xl text-center">
                    <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">
                        {tabContent.title}
                    </p>
                    <p
                        className="mt-5 text-base leading-8 text-text-secondary md:text-lg"
                        data-admin-key={tabContent.adminKey}
                        data-admin-type="rich-text"
                        data-admin-current-text={tabContent.description}
                        data-admin-label={tabContent.adminLabel}
                    >
                        {tabContent.description}
                    </p>
                    </div>

                    <div className="mt-10 columns-2 gap-4 space-y-4 md:columns-3">
                        {tabContent.images.map((img) => (
                            <AttireImage
                                key={img.adminKey}
                                src={img.src}
                                fallback={img.fallback}
                                alt={img.label}
                                adminKey={img.adminKey}
                                overlayColor={img.overlay?.color}
                                overlayOpacity={img.overlay?.opacity}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
