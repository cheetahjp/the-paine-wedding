"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTimeRemaining, getTriviaUnlockDate, TRIVIA_UNLOCK_LABEL } from "@/lib/games/schedule";

export default function GamesHubClient() {
    const [remaining, setRemaining] = useState(() => getTimeRemaining(getTriviaUnlockDate()));

    useEffect(() => {
        const interval = window.setInterval(() => {
            setRemaining(getTimeRemaining(getTriviaUnlockDate()));
        }, 1000);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <div className="grid gap-8 md:grid-cols-2">
            {remaining.isUnlocked ? (
                <Link
                    href="/games/trivia"
                    className="group rounded-[2rem] border border-primary/20 bg-white p-8 shadow-[0_20px_60px_rgba(20,42,68,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary"
                >
                    <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Game One</p>
                    <h2 className="mt-4 font-heading text-4xl text-primary">Couple Trivia</h2>
                    <p className="mt-4 text-text-secondary leading-relaxed">
                        Ten multiple-choice questions about Jeff and Ashlyn, with fun facts and a scored finish.
                    </p>
                    <p className="mt-8 text-sm uppercase tracking-[0.24em] text-primary transition-transform duration-300 group-hover:translate-x-1">
                        Open Trivia
                    </p>
                </Link>
            ) : (
                <div className="rounded-[2rem] border border-primary/15 bg-white p-8 shadow-[0_20px_60px_rgba(20,42,68,0.06)]">
                    <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Game One</p>
                    <h2 className="mt-4 font-heading text-4xl text-primary">Couple Trivia</h2>
                    <p className="mt-4 text-text-secondary leading-relaxed">
                        Opens on wedding day. Come back on {TRIVIA_UNLOCK_LABEL} to play for the live table leaderboard.
                    </p>

                    <div className="mt-8 grid grid-cols-4 gap-3">
                        {[
                            { label: "Days", value: remaining.days },
                            { label: "Hours", value: remaining.hours },
                            { label: "Min", value: remaining.minutes },
                            { label: "Sec", value: remaining.seconds },
                        ].map((item) => (
                            <div key={item.label} className="rounded-[1.25rem] bg-surface px-4 py-4 text-center">
                                <p className="font-heading text-3xl text-primary">{item.value}</p>
                                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-text-secondary">{item.label}</p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-sm uppercase tracking-[0.24em] text-secondary">Opens Wedding Day</p>
                </div>
            )}

            <Link
                href="/games/painedle"
                className="group rounded-[2rem] border border-primary/20 bg-white p-8 shadow-[0_20px_60px_rgba(20,42,68,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary"
            >
                <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Game Two</p>
                <h2 className="mt-4 font-heading text-4xl text-primary">Painedle</h2>
                <p className="mt-4 text-text-secondary leading-relaxed">
                    A daily five-letter puzzle with keyboard support, saved progress, and wedding-themed words.
                </p>
                <p className="mt-8 text-sm uppercase tracking-[0.24em] text-primary transition-transform duration-300 group-hover:translate-x-1">
                    Play Painedle
                </p>
            </Link>
        </div>
    );
}
