"use client";

import Section from "@/components/ui/Section";
import PainedleGame from "@/components/games/PainedleGame";
import LeaderboardPanel from "@/components/games/LeaderboardPanel";
import { getTodayKey } from "@/lib/games/painedle";

export default function PainedlePage() {
    const todayKey = getTodayKey();

    return (
        <div className="pt-20">
            <Section className="pb-12 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">/games/painedle</p>
                <h1 className="mt-4 font-heading text-5xl md:text-6xl text-primary">Painedle</h1>
                <p className="mx-auto mt-6 max-w-2xl text-text-secondary leading-relaxed">
                    A fresh five-letter puzzle every day. Come back tomorrow for the next word.
                </p>
            </Section>

            <Section background="surface" className="py-20">
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <PainedleGame />
                    <LeaderboardPanel
                        game="painedle"
                        title="Today's Painedle Leaders"
                        subtitle="Best scores for the current daily puzzle."
                        puzzleKey={todayKey}
                    />
                </div>
            </Section>
        </div>
    );
}
