import Section from "@/components/ui/Section";
import CrosswordGate from "@/components/games/CrosswordGate";
import GameAccountPanel from "@/components/games/GameAccountPanel";
import LeaderboardPanel from "@/components/games/LeaderboardPanel";
import MiniCrosswordGame from "@/components/games/MiniCrosswordGame";
import { CROSSWORD_PUZZLE_KEY } from "@/lib/games/crossword";

export default function CrosswordPage() {
    return (
        <div className="bg-[linear-gradient(180deg,#f8f3ec_0%,#eff1f4_34%,#ffffff_100%)]">
            <Section className="pb-16 pt-8 md:pb-18 md:pt-10">
                <div className="mb-6">
                    <GameAccountPanel />
                </div>
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <CrosswordGate>
                        <MiniCrosswordGame />
                    </CrosswordGate>
                    <LeaderboardPanel
                        game="crossword"
                        title="Crossword Leaders"
                        subtitle="Fastest clean solves and fewer reveals rise to the top once the puzzle opens."
                        puzzleKey={CROSSWORD_PUZZLE_KEY}
                    />
                </div>
            </Section>
        </div>
    );
}
