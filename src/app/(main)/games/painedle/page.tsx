"use client";

import Section from "@/components/ui/Section";
import PainedleGame from "@/components/games/PainedleGame";
import CollapsibleLeaderboard from "@/components/games/CollapsibleLeaderboard";
import GameAccountPanel from "@/components/games/GameAccountPanel";
import { getTodayKey } from "@/lib/games/painedle";
import GameSuggestions from "@/components/games/GameSuggestions";

export default function PainedlePage() {
    const todayKey = getTodayKey();

    return (
        <div className="bg-[linear-gradient(180deg,#f7f2eb_0%,#eef1f4_34%,#ffffff_100%)]">
            <Section background="surface" className="pb-10 pt-12 text-center md:pb-12 md:pt-16">
                <div className="mb-5 flex items-center justify-center gap-4">
                    <span className="h-px w-12 bg-accent" />
                    <span className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Daily Word Game</span>
                    <span className="h-px w-12 bg-accent" />
                </div>
                <h1 className="mb-4 font-heading text-5xl text-primary md:text-6xl">Painedle</h1>
                <p className="mx-auto max-w-xl text-text-secondary leading-relaxed">
                    Guess the hidden word in six tries. Green means right spot, amber means wrong spot — the word is about us.
                </p>
            </Section>
            <Section className="pb-16 pt-8 md:pt-10 md:pb-18">
                <div className="mb-6">
                    <GameAccountPanel />
                </div>
                <div className="mb-10">
                    <PainedleGame />
                </div>
                <CollapsibleLeaderboard
                    game="painedle"
                    title="Today's Painedle Leaders"
                    subtitle="Best scores for the current daily puzzle."
                    puzzleKey={todayKey}
                />
                <GameSuggestions current="painedle" />
            </Section>
        </div>
    );
}
