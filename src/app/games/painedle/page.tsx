"use client";

import Section from "@/components/ui/Section";
import PainedleGame from "@/components/games/PainedleGame";
import LeaderboardPanel from "@/components/games/LeaderboardPanel";
import { getTodayKey } from "@/lib/games/painedle";

export default function PainedlePage() {
    const todayKey = getTodayKey();

    return (
        <div className="pt-20 bg-[linear-gradient(180deg,#f7f2eb_0%,#eef1f4_46%,#ffffff_100%)]">
            <Section className="pb-12 pt-12 md:pt-16">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/10 bg-[linear-gradient(135deg,#10253c_0%,#173756_52%,#3a5879_100%)] px-8 py-12 text-white shadow-[0_30px_90px_rgba(20,42,68,0.16)] md:px-12 md:py-16">
                    <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
                    <div className="pointer-events-none absolute left-0 top-1/2 h-48 w-48 -translate-x-16 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-white/65">/games/painedle</p>
                            <h1 className="mt-5 font-heading text-5xl md:text-7xl">Painedle</h1>
                            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                                A fresh five-letter wedding puzzle every day. The board now uses a darker surface and
                                much stronger contrast so guests can actually read the game state.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                { label: "Puzzle Date", value: todayKey },
                                { label: "Format", value: "6 guesses / 5 letters" },
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
