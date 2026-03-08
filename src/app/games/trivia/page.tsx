import Section from "@/components/ui/Section";
import CoupleTriviaGame from "@/components/games/CoupleTriviaGame";
import TriviaGate from "@/components/games/TriviaGate";
import LeaderboardPanel from "@/components/games/LeaderboardPanel";

export default function TriviaPage() {
    return (
        <div className="pt-20">
            <Section className="pb-12 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">/games/trivia</p>
                <h1 className="mt-4 font-heading text-5xl md:text-6xl text-primary">Couple Trivia</h1>
                <p className="mx-auto mt-6 max-w-2xl text-text-secondary leading-relaxed">
                    Welcome, play through ten questions, then see how well you really know Jeff and Ashlyn.
                </p>
            </Section>

            <Section background="surface" className="py-20">
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
