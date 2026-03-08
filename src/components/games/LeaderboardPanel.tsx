"use client";

import { useEffect, useState } from "react";
import {
    fetchLeaderboard,
    GAME_LEADERBOARD_REFRESH_EVENT,
    type GameType,
    type LeaderboardEntry,
} from "@/lib/games/leaderboard";

type LeaderboardPanelProps = {
    game: GameType;
    title: string;
    subtitle: string;
    puzzleKey?: string;
    refreshKey?: number;
};

export default function LeaderboardPanel({
    game,
    title,
    subtitle,
    puzzleKey,
    refreshKey = 0,
}: LeaderboardPanelProps) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshVersion, setRefreshVersion] = useState(0);

    useEffect(() => {
        let isActive = true;

        async function loadLeaderboard() {
            setLoading(true);
            setError(null);

            try {
                const data = await fetchLeaderboard(game, { limit: 10, puzzleKey });
                if (isActive) {
                    setEntries(data);
                }
            } catch {
                if (isActive) {
                    setError("Leaderboard unavailable right now.");
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        }

        void loadLeaderboard();

        return () => {
            isActive = false;
        };
    }, [game, puzzleKey, refreshKey, refreshVersion]);

    useEffect(() => {
        function handleRefresh() {
            setRefreshVersion((current) => current + 1);
        }

        window.addEventListener(GAME_LEADERBOARD_REFRESH_EVENT, handleRefresh);
        return () => window.removeEventListener(GAME_LEADERBOARD_REFRESH_EVENT, handleRefresh);
    }, []);

    return (
        <div className="rounded-[2rem] border border-primary/15 bg-white p-6 shadow-[0_20px_60px_rgba(20,42,68,0.06)] md:p-8">
            <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Leaderboard</p>
            <h3 className="mt-4 font-heading text-3xl text-primary">{title}</h3>
            <p className="mt-3 text-text-secondary">{subtitle}</p>

            {loading ? (
                <p className="mt-8 text-text-secondary">Loading scores...</p>
            ) : error ? (
                <p className="mt-8 text-secondary">{error}</p>
            ) : entries.length === 0 ? (
                <p className="mt-8 text-text-secondary">No scores yet. First one on the board wins the room.</p>
            ) : (
                <div className="mt-8 space-y-3">
                    {entries.map((entry, index) => (
                        <div
                            key={entry.id}
                            className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1.25rem] bg-surface/70 px-4 py-4"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                                {index + 1}
                            </div>
                            <div>
                                <p className="font-medium text-primary">{entry.username}</p>
                                <p className="text-sm text-text-secondary">
                                    {game === "trivia"
                                        ? `${entry.score}${entry.maxScore ? ` / ${entry.maxScore}` : ""}`
                                        : entry.solved
                                            ? `Solved in ${entry.attempts} ${entry.attempts === 1 ? "guess" : "guesses"}`
                                            : "Unsolved"}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-heading text-2xl text-primary">{entry.score}</p>
                                <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Points</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
