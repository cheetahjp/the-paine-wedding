"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
    CROSSWORD_UNLOCK_LABEL,
    getCrosswordUnlockDate,
    getTimeRemaining,
    getTriviaUnlockDate,
    TRIVIA_UNLOCK_LABEL,
} from "@/lib/games/schedule";

function CountdownCard({
    eyebrow,
    title,
    copy,
    href,
    cta,
    status,
    remaining,
    unlockLabel,
    muted = false,
}: {
    eyebrow: string;
    title: string;
    copy: string;
    href: string;
    cta: string;
    status: string;
    remaining: ReturnType<typeof getTimeRemaining>;
    unlockLabel?: string;
    muted?: boolean;
}) {
    const sharedContent = (
        <>
            <div className="pointer-events-none absolute inset-0 bg-white/35" />
            <div className="pointer-events-none absolute -right-12 top-0 h-52 w-52 rounded-full bg-accent/18 blur-3xl" />
            <div className="relative">
                <div className="flex items-center justify-between gap-4">
                    <p className="text-sm uppercase tracking-[0.3em] text-text-secondary/80">{eyebrow}</p>
                    <span className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${
                        remaining.isUnlocked
                            ? "border-primary/15 bg-primary text-white"
                            : muted
                                ? "border-secondary/20 bg-white/80 text-secondary"
                                : "border-primary/12 bg-white/85 text-primary"
                    }`}>
                        {status}
                    </span>
                </div>

                <h2 className={`mt-5 font-heading text-4xl md:text-5xl ${remaining.isUnlocked ? "text-primary" : muted ? "text-primary/68" : "text-primary/78"}`}>
                    {title}
                </h2>
                <p className={`mt-4 max-w-xl leading-relaxed ${remaining.isUnlocked ? "text-text-secondary" : muted ? "text-text-secondary/72" : "text-text-secondary/82"}`}>
                    {copy}
                </p>

                {remaining.isUnlocked ? (
                    <p className="mt-8 text-sm uppercase tracking-[0.24em] text-primary transition-transform duration-300 group-hover:translate-x-1">
                        {cta}
                    </p>
                ) : (
                    <>
                        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {[
                                { label: "Days", value: remaining.days },
                                { label: "Hours", value: remaining.hours },
                                { label: "Min", value: remaining.minutes },
                                { label: "Sec", value: remaining.seconds },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[1.25rem] border border-accent/30 bg-white px-4 py-4 text-center shadow-[0_8px_22px_rgba(20,42,68,0.05)]"
                                >
                                    <p className="font-heading text-3xl text-primary">{item.value}</p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.24em] text-text-secondary">{item.label}</p>
                                </div>
                            ))}
                        </div>
                        {unlockLabel ? (
                            <p className="mt-6 text-xs uppercase tracking-[0.26em] text-secondary">
                                Opens {unlockLabel}
                            </p>
                        ) : null}
                    </>
                )}
            </div>
        </>
    );

    if (remaining.isUnlocked) {
        return (
            <Link
                href={href}
                className="group relative overflow-hidden rounded-[2.1rem] border border-primary/16 bg-[linear-gradient(145deg,#fffdfa_0%,#f4eee4_62%,#ece5d9_100%)] p-8 shadow-[0_10px_0_rgba(20,42,68,0.06),0_24px_70px_rgba(20,42,68,0.10)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_0_rgba(20,42,68,0.08),0_28px_80px_rgba(20,42,68,0.14)] md:p-9"
            >
                {sharedContent}
            </Link>
        );
    }

    return (
        <div
            className={`relative overflow-hidden rounded-[2.1rem] border border-primary/12 ${
                muted
                    ? "bg-[linear-gradient(145deg,#f0ede7_0%,#e7e2d9_100%)]"
                    : "bg-[linear-gradient(145deg,#f8f4ee_0%,#ede7de_100%)]"
            } p-8 shadow-[0_10px_0_rgba(20,42,68,0.05),0_24px_70px_rgba(20,42,68,0.08)] md:p-9`}
        >
            {sharedContent}
        </div>
    );
}

export default function GamesHubClient() {
    const [crosswordRemaining, setCrosswordRemaining] = useState(() => getTimeRemaining(getCrosswordUnlockDate()));
    const [triviaRemaining, setTriviaRemaining] = useState(() => getTimeRemaining(getTriviaUnlockDate()));

    useEffect(() => {
        const interval = window.setInterval(() => {
            setCrosswordRemaining(getTimeRemaining(getCrosswordUnlockDate()));
            setTriviaRemaining(getTimeRemaining(getTriviaUnlockDate()));
        }, 1000);

        return () => window.clearInterval(interval);
    }, []);

    return (
        <div className="grid gap-8 xl:grid-cols-3">
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

            <CountdownCard
                eyebrow="Game Two"
                title="Mini Crossword"
                copy="A fill-in-the-blank crossword built from Ashlyn and Jeffrey's story opens the week before the wedding."
                href="/games/crossword"
                cta="Open Crossword"
                status={crosswordRemaining.isUnlocked ? "Live Now" : "Unlocks Soon"}
                remaining={crosswordRemaining}
                unlockLabel={CROSSWORD_UNLOCK_LABEL}
            />

            <CountdownCard
                eyebrow="Game Three"
                title="Couple Trivia"
                copy="Reception-day trivia stays locked until the wedding so the room can play it live together."
                href="/games/trivia"
                cta="Open Trivia"
                status={triviaRemaining.isUnlocked ? "Open" : "Locked"}
                remaining={triviaRemaining}
                unlockLabel={TRIVIA_UNLOCK_LABEL}
                muted
            />
        </div>
    );
}
