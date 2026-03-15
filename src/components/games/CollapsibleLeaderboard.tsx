"use client";

import { useState } from "react";
import LeaderboardPanel from "@/components/games/LeaderboardPanel";
import type { GameType } from "@/lib/games/leaderboard";

type Props = {
    game: GameType;
    title: string;
    subtitle: string;
    puzzleKey?: string;
    refreshKey?: number;
};

export default function CollapsibleLeaderboard({ game, title, subtitle, puzzleKey, refreshKey }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="mt-4">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-3 rounded-[1.4rem] border border-primary/10 bg-white/70 px-5 py-4 text-left transition-colors hover:bg-white/90"
            >
                <div className="flex items-center gap-3">
                    {/* Trophy icon */}
                    <svg
                        className="h-4 w-4 shrink-0 text-accent"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                        <path d="M4 22h16" />
                        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                    <span className="text-xs uppercase tracking-[0.24em] text-primary">{title}</span>
                </div>
                {/* Chevron */}
                <svg
                    className={`h-4 w-4 shrink-0 text-text-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>

            {open ? (
                <div className="mt-3">
                    <LeaderboardPanel
                        game={game}
                        title={title}
                        subtitle={subtitle}
                        puzzleKey={puzzleKey}
                        refreshKey={refreshKey}
                    />
                </div>
            ) : null}
        </div>
    );
}
