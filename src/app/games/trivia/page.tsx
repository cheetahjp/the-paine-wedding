import Section from "@/components/ui/Section";
import CoupleTriviaGame from "@/components/games/CoupleTriviaGame";
import GameAccountPanel from "@/components/games/GameAccountPanel";
import TriviaGate from "@/components/games/TriviaGate";
import LeaderboardPanel from "@/components/games/LeaderboardPanel";

export default function TriviaPage() {
    return (
        <div className="bg-[linear-gradient(180deg,#f7f2eb_0%,#f5f3ef_40%,#ffffff_100%)]">
            <Section className="pb-16 pt-8 md:pt-10 md:pb-18">
                <div className="mb-6">
                    <GameAccountPanel />
                </div>
                <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                    <TriviaGate>
                        <CoupleTriviaGame />
                    </TriviaGate>
                    <LeaderboardPanel
                        game="trivia"
                        title="Trivia Leaders"
                        subtitle="Highest scores rise to the top once trivia opens on wedding day."
                        puzzleKey="wedding-day-trivia"
                    />
                </div>
            </Section>
        </div>
    );
}
