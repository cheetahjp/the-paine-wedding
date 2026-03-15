import Section from "@/components/ui/Section";
import CrosswordGate from "@/components/games/CrosswordGate";
import GameAccountPanel from "@/components/games/GameAccountPanel";
import CollapsibleLeaderboard from "@/components/games/CollapsibleLeaderboard";
import MiniCrosswordGame from "@/components/games/MiniCrosswordGame";
import { getDailyCrosswordPuzzle } from "@/lib/games/crossword";

function getTodayKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function CrosswordPage() {
    const todayKey = getTodayKey();
    const todayPuzzle = getDailyCrosswordPuzzle(todayKey);

    return (
        <div className="bg-[linear-gradient(180deg,#f8f3ec_0%,#eff1f4_34%,#ffffff_100%)]">
            <Section className="pb-16 pt-8 md:pb-18 md:pt-10">
                <div className="mb-6">
                    <GameAccountPanel />
                </div>
                <CrosswordGate>
                    <MiniCrosswordGame />
                </CrosswordGate>
                <CollapsibleLeaderboard
                    game="crossword"
                    title="Crossword Leaders"
                    subtitle="Fastest clean solves and fewer reveals rise to the top."
                    puzzleKey={todayPuzzle.id}
                />
            </Section>
        </div>
    );
}
