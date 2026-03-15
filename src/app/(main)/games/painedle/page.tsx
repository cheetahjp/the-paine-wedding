"use client";

import Section from "@/components/ui/Section";
import PainedleGame from "@/components/games/PainedleGame";
import CollapsibleLeaderboard from "@/components/games/CollapsibleLeaderboard";
import GameAccountPanel from "@/components/games/GameAccountPanel";
import { getTodayKey } from "@/lib/games/painedle";

export default function PainedlePage() {
    const todayKey = getTodayKey();

    return (
        <div className="bg-[linear-gradient(180deg,#f7f2eb_0%,#eef1f4_34%,#ffffff_100%)]">
            <Section className="pb-16 pt-8 md:pt-10 md:pb-18">
                <div className="mb-6">
                    <GameAccountPanel />
                </div>
                <PainedleGame />
                <CollapsibleLeaderboard
                    game="painedle"
                    title="Today's Painedle Leaders"
                    subtitle="Best scores for the current daily puzzle."
                    puzzleKey={todayKey}
                />
            </Section>
        </div>
    );
}
