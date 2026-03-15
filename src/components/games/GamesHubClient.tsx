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
                        <div className="mt-8 grid grid-cols-4 gap-2">
                            {[
                                { label: "Days", value: remaining.days },
                                { label: "Hr", value: remaining.hours },
                                { label: "Min", value: remaining.minutes },
                                { label: "Sec", value: remaining.seconds },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="surface-inset flex min-w-0 flex-col items-center justify-center px-2 py-3 text-center"
                                >
                                    <p className="font-heading text-2xl lg:text-3xl text-primary">{item.value}</p>
                                    <p className="mt-1 text-[9px] uppercase tracking-wider text-text-secondary truncate">{item.label}</p>
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
                className="surface-panel group relative block overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 md:p-9"
            >
                {sharedContent}
            </Link>
        );
    }

    return (
        <div
            className={`surface-panel relative overflow-hidden p-8 md:p-9 ${muted ? "opacity-80" : ""}`}
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
        <div className="mx-auto flex max-w-3xl flex-col gap-8">
            <Link
                href="/games/painedle"
                className="surface-panel group relative block overflow-hidden p-8 transition-all duration-300 hover:-translate-y-1 md:p-10"
            >
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
