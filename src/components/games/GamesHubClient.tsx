"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTodayKey } from "@/lib/games/painedle";
import { getTimeRemaining, getTriviaUnlockDate, TRIVIA_UNLOCK_LABEL } from "@/lib/games/schedule";

export default function GamesHubClient() {
    const [remaining, setRemaining] = useState(() => getTimeRemaining(getTriviaUnlockDate()));
    const todayKey = getTodayKey();

    useEffect(() => {
        const interval = window.setInterval(() => {
            setRemaining(getTimeRemaining(getTriviaUnlockDate()));
        }, 1000);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            {remaining.isUnlocked ? (
                <Link
                    href="/games/trivia"
                    className="group relative overflow-hidden rounded-[2.25rem] border border-primary/15 bg-[linear-gradient(140deg,#16314f_0%,#1d4365_55%,#8c2531_100%)] p-8 text-white shadow-[0_24px_80px_rgba(20,42,68,0.18)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_90px_rgba(20,42,68,0.22)] md:p-10"
                >
                    <div className="pointer-events-none absolute right-0 top-0 h-56 w-56 translate-x-14 -translate-y-10 rounded-full bg-accent/20 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 -translate-x-14 translate-y-10 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm uppercase tracking-[0.3em] text-white/65">Game One</p>
                            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white/80">
                                Open
                            </span>
                        </div>
                        <h2 className="mt-5 font-heading text-4xl md:text-5xl">Couple Trivia</h2>
                        <p className="mt-4 max-w-xl leading-relaxed text-white/80">
                            Ten multiple-choice questions about Jeff and Ashlyn, with fun facts, instant answer
                            feedback, and a wedding-day leaderboard finish.
                        </p>

                        <div className="mt-8 grid gap-3 sm:grid-cols-3">
                            {[
                                "3-screen flow",
                                "10 questions",
                                "Score leaderboard",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-[1.2rem] border border-white/15 bg-white/10 px-4 py-4 text-sm text-white/85 backdrop-blur-sm"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>

                        <p className="mt-8 text-sm uppercase tracking-[0.24em] text-white/85 transition-transform duration-300 group-hover:translate-x-1">
                            Open Trivia
                        </p>
                    </div>
                </Link>
            ) : (
                <div className="relative overflow-hidden rounded-[2.25rem] border border-primary/15 bg-[linear-gradient(140deg,#fffaf4_0%,#f7f0e7_54%,#f1e9df_100%)] p-8 shadow-[0_24px_80px_rgba(20,42,68,0.10)] md:p-10">
                    <div className="pointer-events-none absolute -right-12 top-0 h-52 w-52 rounded-full bg-accent/20 blur-3xl" />
                    <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 -translate-x-10 translate-y-10 rounded-full bg-primary/8 blur-3xl" />

                    <div className="relative">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Game One</p>
                            <span className="rounded-full border border-secondary/20 bg-secondary/8 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-secondary">
                                Opens Wedding Day
                            </span>
                        </div>
                        <h2 className="mt-5 font-heading text-4xl text-primary md:text-5xl">Couple Trivia</h2>
                        <p className="mt-4 max-w-xl leading-relaxed text-text-secondary">
                            Opens on wedding day. Come back on {TRIVIA_UNLOCK_LABEL} to play for the live table
                            leaderboard and the real-time reception bragging rights.
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
                                    className="rounded-[1.25rem] border border-primary/8 bg-white/80 px-4 py-4 text-center shadow-[0_8px_22px_rgba(20,42,68,0.05)]"
                                >
                                    <p className="font-heading text-3xl text-primary">{item.value}</p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-text-secondary">{item.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            {["Wedding-day unlock", "Fun facts", "Live score submission"].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-full border border-primary/10 bg-primary/5 px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <Link
                href="/games/painedle"
                className="group relative overflow-hidden rounded-[2.25rem] border border-primary/15 bg-[linear-gradient(145deg,#ffffff_0%,#f2efe8_62%,#e9e4db_100%)] p-8 shadow-[0_24px_80px_rgba(20,42,68,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(20,42,68,0.14)] md:p-10"
            >
                <div className="pointer-events-none absolute -left-10 top-4 h-44 w-44 rounded-full bg-accent/18 blur-3xl" />
                <div className="pointer-events-none absolute bottom-0 right-0 h-52 w-52 translate-x-10 translate-y-10 rounded-full bg-primary/8 blur-3xl" />

                <div className="relative">
                    <div className="flex items-center justify-between gap-4">
                        <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Game Two</p>
                        <span className="rounded-full border border-primary/15 bg-primary px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-white">
                            Live Now
                        </span>
                    </div>
                    <h2 className="mt-5 font-heading text-4xl text-primary md:text-5xl">Painedle</h2>
                    <p className="mt-4 max-w-xl leading-relaxed text-text-secondary">
                        A daily five-letter puzzle with stronger contrast, keyboard support, saved progress, and a
                        fresh word every day.
                    </p>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {[
                            { label: "Today", value: todayKey },
                            { label: "Word Bank", value: "31 themed answers" },
                            { label: "Progress", value: "Saved in browser" },
                            { label: "Leaderboard", value: "Daily rankings" },
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
        </div>
    );
}
