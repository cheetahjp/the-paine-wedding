import Section from "@/components/ui/Section";
import CoupleTriviaGame from "@/components/games/CoupleTriviaGame";
import TriviaGate from "@/components/games/TriviaGate";
import LeaderboardPanel from "@/components/games/LeaderboardPanel";

export default function TriviaPage() {
    return (
        <div className="pt-20 bg-[linear-gradient(180deg,#f7f2eb_0%,#f5f3ef_50%,#ffffff_100%)]">
            <Section className="pb-12 pt-12 md:pt-16">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/10 bg-[linear-gradient(135deg,#251323_0%,#5a1d28_48%,#b5855a_100%)] px-8 py-12 text-white shadow-[0_30px_90px_rgba(20,42,68,0.16)] md:px-12 md:py-16">
                    <div className="pointer-events-none absolute -right-14 top-0 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="pointer-events-none absolute left-0 top-1/2 h-52 w-52 -translate-x-14 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl" />

                    <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-white/65">/games/trivia</p>
                            <h1 className="mt-5 font-heading text-5xl md:text-7xl">Couple Trivia</h1>
                            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                                Ten wedding-story questions, immediate answer feedback, and a ranked finish once the
                                game unlocks on wedding day.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                { label: "Questions", value: "10 prompts" },
                                { label: "Flow", value: "Welcome -> Play -> Results" },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[1.6rem] border border-white/15 bg-white/8 p-5 backdrop-blur-sm"
                                >
                                    <p className="text-xs uppercase tracking-[0.28em] text-white/60">{item.label}</p>
                                    <p className="mt-3 font-heading text-3xl text-white">{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            <Section className="py-12 md:py-16">
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
