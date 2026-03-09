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
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <Link
                href="/games/painedle"
                className="group relative overflow-hidden rounded-[2.25rem] border border-primary/16 bg-[linear-gradient(145deg,#fffdfa_0%,#f4eee4_62%,#ece5d9_100%)] p-8 shadow-[0_10px_0_rgba(20,42,68,0.06),0_24px_70px_rgba(20,42,68,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_0_rgba(20,42,68,0.08),0_28px_80px_rgba(20,42,68,0.14)] md:p-10"
            >
                <div className="pointer-events-none absolute -left-10 top-4 h-44 w-44 rounded-full bg-accent/18 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-52 w-52 translate-x-10 translate-y-10 rounded-full bg-primary/8 blur-3xl" />

                <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Game One</p>
                        <span className="rounded-full border border-primary/15 bg-primary px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white">
                            Live Now
                        </span>
                    </div>
                    <h2 className="mt-5 font-heading text-4xl text-primary md:text-5xl">Painedle</h2>
                    <p className="mt-4 max-w-xl leading-relaxed text-text-secondary">
                        Crack the daily wedding word in six guesses. Every board saves in your browser, and every
                        solved round can land on the leaderboard.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {[
                            { label: "Play Style", value: "Daily puzzle" },
                            { label: "Progress", value: "Saved locally" },
                            { label: "Leaderboard", value: "Daily ranks" },
                            { label: "Feel", value: "Wedding words" },
                        ].map((item) => (
                            <div
                                key={item.label}
                                className="rounded-[1.2rem] border border-primary/10 bg-white/85 px-4 py-4 shadow-[0_8px_22px_rgba(20,42,68,0.05)]"
                            >
                                <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">{item.label}</p>
                                <p className="mt-2 text-lg text-primary">{item.value}</p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-8 text-sm uppercase tracking-[0.24em] text-primary transition-transform duration-300 group-hover:translate-x-1">
                        Play Painedle
                    </p>
                </div>
            </Link>

            {remaining.isUnlocked ? (
                <Link
                    href="/games/trivia"
                    className="group relative overflow-hidden rounded-[2.25rem] border border-white/18 bg-[linear-gradient(140deg,#112a46_0%,#1a4065_55%,#7f2432_100%)] p-8 text-white shadow-[0_10px_0_rgba(12,24,39,0.22),0_24px_80px_rgba(20,42,68,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_0_rgba(12,24,39,0.24),0_30px_90px_rgba(20,42,68,0.22)] md:p-10"
                >
                    <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 translate-x-14 -translate-y-10 rounded-full bg-accent/20 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 -translate-x-14 translate-y-10 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm uppercase tracking-[0.3em] text-white/65">Game Two</p>
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/80">
                                Open
                            </span>
                        </div>
                        <h2 className="mt-5 font-heading text-4xl md:text-5xl">Couple Trivia</h2>
                        <p className="mt-4 max-w-xl leading-relaxed text-white/80">
                            Test how well you know Ashlyn and Jeffrey with a fast round of story, proposal, and
                            personality questions.
                        </p>

                        <p className="mt-10 text-sm uppercase tracking-[0.24em] text-white/85 transition-transform duration-300 group-hover:translate-x-1">
                            Open Trivia
                        </p>
                    </div>
                </Link>
            ) : (
                <div className="relative overflow-hidden rounded-[2.25rem] border border-primary/12 bg-[linear-gradient(145deg,#f0ede7_0%,#e7e2d9_100%)] p-8 shadow-[0_10px_0_rgba(20,42,68,0.05),0_24px_70px_rgba(20,42,68,0.08)] md:p-10">
                    <div className="pointer-events-none absolute inset-0 bg-white/40" />
                    <div className="pointer-events-none absolute -right-12 top-0 h-52 w-52 rounded-full bg-accent/18 blur-3xl" />

                    <div className="relative">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm uppercase tracking-[0.3em] text-text-secondary/80">Game Two</p>
                            <span className="rounded-full border border-secondary/20 bg-white/80 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-secondary">
                                Locked
                            </span>
                        </div>
                        <h2 className="mt-5 font-heading text-4xl text-primary/68 md:text-5xl">Couple Trivia</h2>
                        <p className="mt-4 max-w-xl leading-relaxed text-text-secondary/72">
                            Reception-day trivia stays locked until the wedding so the room can play it live together.
                        </p>

                        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {[
                                { label: "Days", value: remaining.days },
                                { label: "Hours", value: remaining.hours },
                                { label: "Min", value: remaining.minutes },
                                { label: "Sec", value: remaining.seconds },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[1.25rem] border border-accent/35 bg-white px-4 py-4 text-center shadow-[0_8px_22px_rgba(20,42,68,0.05)]"
                                >
                                    <p className="font-heading text-3xl text-primary">{item.value}</p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-text-secondary">{item.label}</p>
                                </div>
                            ))}
                        </div>

                        <p className="mt-6 text-xs uppercase tracking-[0.26em] text-secondary">
                            Opens {TRIVIA_UNLOCK_LABEL}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
