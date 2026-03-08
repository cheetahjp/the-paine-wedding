"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import type { AdminGameScore, GamePlayerRecord } from "@/lib/games/admin-types";
import { TRIVIA_QUESTIONS } from "@/lib/games/trivia-questions";
import { PAINEDLE_WORDS } from "@/lib/games/word-list";
import { getDailyWord, getTodayKey } from "@/lib/games/painedle";
import { getTimeRemaining, getTriviaUnlockDate, TRIVIA_UNLOCK_LABEL } from "@/lib/games/schedule";

type GamesAdminPanelProps = {
    gameScores: AdminGameScore[];
    gameScoresError: string | null;
};

type ModalView =
    | "today-word"
    | "schedule"
    | "word-bank"
    | "trivia-bank"
    | "leaderboards"
    | "submissions"
    | "players";

type ScoreFilter = "all" | "trivia" | "painedle";

type PlayerSummary = {
    email: string;
    username: string;
    createdAt: string | null;
    totalSubmissions: number;
    triviaSubmissions: number;
    painedleSubmissions: number;
    bestTriviaScore: number | null;
    bestPainedleScore: number | null;
    latestSeenAt: string | null;
    latestTimezone: string | null;
    latestLocation: string | null;
    latestDevice: string | null;
    latestIp: string | null;
};

function getPlayerDetails(score: AdminGameScore): GamePlayerRecord | undefined {
    return Array.isArray(score.game_players) ? score.game_players[0] : score.game_players;
}

function getSubmissionSortValue(score: AdminGameScore) {
    return new Date(score.created_at).getTime();
}

function sortTriviaScores(a: AdminGameScore, b: AdminGameScore) {
    return b.score - a.score || getSubmissionSortValue(a) - getSubmissionSortValue(b);
}

function sortPainedleScores(a: AdminGameScore, b: AdminGameScore) {
    return b.score - a.score || (a.attempts ?? 99) - (b.attempts ?? 99) || getSubmissionSortValue(a) - getSubmissionSortValue(b);
}

function formatSubmissionTime(value: string) {
    return new Date(value).toLocaleString();
}

function getMetadataValue(score: AdminGameScore, key: string) {
    const value = score.metadata?.[key];
    return typeof value === "string" && value.trim() ? value.trim() : null;
}

function getProfileSummary(score: AdminGameScore) {
    const timezone = getMetadataValue(score, "browser_timezone");
    const city = getMetadataValue(score, "request_city");
    const region = getMetadataValue(score, "request_region");
    const country = getMetadataValue(score, "request_country");
    const userAgent = getMetadataValue(score, "browser_user_agent") || getMetadataValue(score, "request_user_agent");

    const location = [city, region, country].filter(Boolean).join(", ") || timezone || "Unknown location";
    const device = userAgent
        ? /mobile|iphone|android/i.test(userAgent)
            ? "Mobile browser"
            : "Desktop browser"
        : "Unknown device";

    return {
        location,
        device,
        timezone,
        ip: getMetadataValue(score, "request_ip"),
    };
}

function buildUpcomingSchedule(days: number) {
    const today = new Date();

    return Array.from({ length: days }, (_, index) => {
        const date = new Date(today);
        date.setDate(today.getDate() + index);
        const key = getTodayKey(date);

        return {
            key,
            label: date.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
            }),
            word: getDailyWord(key),
        };
    });
}

function getScoreLabel(score: AdminGameScore) {
    if (score.game === "trivia") {
        return `${score.score}${score.max_score ? ` / ${score.max_score}` : ""}`;
    }

    return `${score.score} pts${score.attempts ? ` • ${score.attempts} guesses` : ""}`;
}

function getPuzzleLabel(score: AdminGameScore) {
    return score.game === "trivia" ? "Wedding-day trivia" : score.puzzle_key;
}

function PillButton({
    label,
    onClick,
}: {
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="rounded-full border border-primary/12 bg-white px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
        >
            {label}
        </button>
    );
}

function ModalButton({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.22em] transition-colors duration-200 ${
                active ? "bg-primary text-white" : "border border-primary/12 bg-white text-primary hover:bg-primary/5"
            }`}
        >
            {label}
        </button>
    );
}

function OverviewMetric({
    label,
    value,
    note,
}: {
    label: string;
    value: string | number;
    note: string;
}) {
    return (
        <div className="rounded-[1.5rem] border border-primary/8 bg-[#fbf8f3] p-5 shadow-[0_8px_24px_rgba(20,42,68,0.04)]">
            <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">{label}</p>
            <p className="mt-3 font-heading text-4xl text-primary">{value}</p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{note}</p>
        </div>
    );
}

function ControlCard({
    eyebrow,
    title,
    copy,
    children,
}: {
    eyebrow: string;
    title: string;
    copy: string;
    children: ReactNode;
}) {
    return (
        <div className="rounded-[1.9rem] border border-primary/10 bg-white p-6 shadow-[0_16px_50px_rgba(20,42,68,0.06)]">
            <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">{eyebrow}</p>
            <h3 className="mt-4 font-heading text-3xl text-primary">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{copy}</p>
            <div className="mt-6 flex flex-wrap gap-3">{children}</div>
        </div>
    );
}

export default function GamesAdminPanel({ gameScores, gameScoresError }: GamesAdminPanelProps) {
    const [modalView, setModalView] = useState<ModalView | null>(null);
    const [scoreFilter, setScoreFilter] = useState<ScoreFilter>("all");
    const [wordSearch, setWordSearch] = useState("");
    const [remaining, setRemaining] = useState(() => getTimeRemaining(getTriviaUnlockDate()));
    const [todayKey] = useState(() => getTodayKey());
    const todayWord = getDailyWord(todayKey);

    useEffect(() => {
        const interval = window.setInterval(() => {
            setRemaining(getTimeRemaining(getTriviaUnlockDate()));
        }, 1000);

        return () => window.clearInterval(interval);
    }, []);

    useEffect(() => {
        document.body.style.overflow = modalView ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [modalView]);

    const triviaScores = useMemo(
        () => gameScores.filter((score) => score.game === "trivia").sort(sortTriviaScores),
        [gameScores]
    );
    const painedleScores = useMemo(
        () => gameScores.filter((score) => score.game === "painedle").sort(sortPainedleScores),
        [gameScores]
    );
    const todaysPainedleScores = useMemo(
        () => painedleScores.filter((score) => score.puzzle_key === todayKey),
        [painedleScores, todayKey]
    );
    const averageTriviaScore = triviaScores.length
        ? (triviaScores.reduce((sum, score) => sum + score.score, 0) / triviaScores.length).toFixed(1)
        : "0.0";
    const uniquePlayers = useMemo(() => {
        const playerMap = new Map<string, PlayerSummary>();

        gameScores.forEach((score) => {
            const player = getPlayerDetails(score);
            if (!player) return;

            const key = player.email || `${player.username}:${score.id}`;
            const existing = playerMap.get(key);

            if (!existing) {
                playerMap.set(key, {
                    email: player.email,
                    username: player.username,
                    createdAt: player.created_at ?? null,
                    totalSubmissions: 1,
                    triviaSubmissions: score.game === "trivia" ? 1 : 0,
                    painedleSubmissions: score.game === "painedle" ? 1 : 0,
                    bestTriviaScore: score.game === "trivia" ? score.score : null,
                    bestPainedleScore: score.game === "painedle" ? score.score : null,
                    latestSeenAt: score.created_at,
                    latestTimezone: getMetadataValue(score, "browser_timezone"),
                    latestLocation: getProfileSummary(score).location,
                    latestDevice: getProfileSummary(score).device,
                    latestIp: getProfileSummary(score).ip,
                });
                return;
            }

            existing.totalSubmissions += 1;
            if (score.game === "trivia") {
                existing.triviaSubmissions += 1;
                existing.bestTriviaScore = Math.max(existing.bestTriviaScore ?? 0, score.score);
            } else {
                existing.painedleSubmissions += 1;
                existing.bestPainedleScore = Math.max(existing.bestPainedleScore ?? 0, score.score);
            }
            if (!existing.createdAt && player.created_at) {
                existing.createdAt = player.created_at;
            }

            if (!existing.latestSeenAt || new Date(score.created_at).getTime() > new Date(existing.latestSeenAt).getTime()) {
                existing.latestSeenAt = score.created_at;
                existing.latestTimezone = getMetadataValue(score, "browser_timezone");
                existing.latestLocation = getProfileSummary(score).location;
                existing.latestDevice = getProfileSummary(score).device;
                existing.latestIp = getProfileSummary(score).ip;
            }
        });

        return Array.from(playerMap.values()).sort((a, b) => {
            return b.totalSubmissions - a.totalSubmissions || a.username.localeCompare(b.username);
        });
    }, [gameScores]);
    const leaderboardPreview = useMemo(
        () => ({
            trivia: triviaScores.slice(0, 5),
            painedle: todaysPainedleScores.slice(0, 5),
        }),
        [todaysPainedleScores, triviaScores]
    );
    const upcomingSchedule = useMemo(() => buildUpcomingSchedule(21), []);
    const filteredWordBank = useMemo(() => {
        if (!wordSearch.trim()) return PAINEDLE_WORDS;
        return PAINEDLE_WORDS.filter((word) => word.includes(wordSearch.trim().toLowerCase()));
    }, [wordSearch]);
    const filteredScores = useMemo(() => {
        if (scoreFilter === "all") return gameScores;
        return gameScores.filter((score) => score.game === scoreFilter);
    }, [gameScores, scoreFilter]);

    function renderModalContent() {
        if (modalView === "today-word") {
            return (
                <div className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-3">
                        <OverviewMetric
                            label="Today's Key"
                            value={todayKey}
                            note="This is the live puzzle key guests submit against."
                        />
                        <OverviewMetric
                            label="Rotation Slot"
                            value={`${PAINEDLE_WORDS.indexOf(todayWord) + 1} / ${PAINEDLE_WORDS.length}`}
                            note="Position of the current answer inside the word bank."
                        />
                        <OverviewMetric
                            label="Submissions Today"
                            value={todaysPainedleScores.length}
                            note="Live score rows currently tied to today's puzzle key."
                        />
                    </div>

                    <div className="rounded-[2rem] border border-primary/10 bg-[linear-gradient(145deg,#173756_0%,#10253c_100%)] p-8 text-white shadow-[0_16px_44px_rgba(20,42,68,0.14)]">
                        <p className="text-xs uppercase tracking-[0.3em] text-white/60">Current Answer</p>
                        <h3 className="mt-4 font-heading text-6xl tracking-[0.2em] md:text-7xl">{todayWord.toUpperCase()}</h3>
                        <p className="mt-4 max-w-2xl text-white/76">
                            This reveal stays out of the overview tab on purpose. Open it only when you actually need to verify the live answer.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            {todayWord.toUpperCase().split("").map((letter, index) => (
                                <div
                                    key={`${letter}-${index}`}
                                    className="flex h-14 w-14 items-center justify-center rounded-[1rem] border border-white/15 bg-white/10 text-2xl font-semibold"
                                >
                                    {letter}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (modalView === "schedule") {
            return (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <OverviewMetric
                            label="Schedule Window"
                            value="21 days"
                            note="Preview of the next 3 weeks of daily answers."
                        />
                        <OverviewMetric
                            label="Start"
                            value={upcomingSchedule[0]?.key ?? todayKey}
                            note="The first row is always today's live puzzle key."
                        />
                        <OverviewMetric
                            label="Cycle"
                            value={`${PAINEDLE_WORDS.length} words`}
                            note="The rotation advances one word per day and only loops after the full bank is exhausted."
                        />
                    </div>

                    <div className="overflow-hidden rounded-[1.8rem] border border-primary/10 bg-white shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-primary/8 bg-[#fbf8f3] px-6 py-4 text-xs uppercase tracking-[0.26em] text-text-secondary">
                            <div>Date</div>
                            <div>Key</div>
                            <div>Word</div>
                        </div>
                        <div className="max-h-[28rem] overflow-auto divide-y divide-primary/6">
                            {upcomingSchedule.map((entry) => (
                                <div key={entry.key} className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-4 text-sm text-text-secondary">
                                    <div className="font-medium text-primary">{entry.label}</div>
                                    <div>{entry.key}</div>
                                    <div className="font-mono uppercase text-primary">{entry.word}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (modalView === "word-bank") {
            return (
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Painedle Library</p>
                            <h3 className="mt-3 font-heading text-4xl text-primary">Full word bank</h3>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
                                Search the entire answer list, confirm spelling, and sanity-check how many usable words are currently available.
                            </p>
                        </div>
                        <div className="w-full md:max-w-xs">
                            <label className="mb-2 block text-xs uppercase tracking-[0.24em] text-text-secondary">
                                Filter words
                            </label>
                            <input
                                type="text"
                                value={wordSearch}
                                onChange={(event) => setWordSearch(event.target.value.toLowerCase())}
                                placeholder="Search the word bank"
                                className="w-full rounded-[1rem] border border-primary/12 bg-white px-4 py-3 text-text-primary outline-none transition-colors focus:border-primary"
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <OverviewMetric
                            label="Bank Size"
                            value={PAINEDLE_WORDS.length}
                            note="Current number of daily answers in rotation."
                        />
                        <OverviewMetric
                            label="Search Results"
                            value={filteredWordBank.length}
                            note="Words matching the current search query."
                        />
                        <OverviewMetric
                            label="Today's Word"
                            value={todayWord.toUpperCase()}
                            note="Quick confirmation without opening the separate reveal again."
                        />
                    </div>

                    <div className="rounded-[1.8rem] border border-primary/10 bg-white p-6 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <div className="flex max-h-[28rem] flex-wrap gap-3 overflow-auto">
                            {filteredWordBank.map((word) => (
                                <span
                                    key={word}
                                    className={`rounded-full border px-4 py-2 text-sm uppercase tracking-[0.22em] ${
                                        word === todayWord
                                            ? "border-primary bg-primary text-white"
                                            : "border-primary/12 bg-[#fbf8f3] text-primary"
                                    }`}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (modalView === "trivia-bank") {
            return (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <OverviewMetric
                            label="Question Count"
                            value={TRIVIA_QUESTIONS.length}
                            note="Number of prompts in the live trivia round."
                        />
                        <OverviewMetric
                            label="Unlock"
                            value={remaining.isUnlocked ? "Live" : TRIVIA_UNLOCK_LABEL}
                            note="Current status of the trivia launch gate."
                        />
                        <OverviewMetric
                            label="Perfect Score"
                            value={TRIVIA_QUESTIONS.length}
                            note="Maximum points a guest can submit for trivia."
                        />
                    </div>

                    <div className="space-y-4">
                        {TRIVIA_QUESTIONS.map((question, index) => (
                            <div key={question.prompt} className="rounded-[1.8rem] border border-primary/10 bg-white p-6 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Question {index + 1}</p>
                                        <h3 className="mt-3 font-heading text-3xl text-primary">{question.prompt}</h3>
                                    </div>
                                    <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs uppercase tracking-[0.22em] text-emerald-700">
                                        Correct: {String.fromCharCode(65 + question.correctIndex)}
                                    </div>
                                </div>
                                <div className="mt-6 grid gap-3 md:grid-cols-2">
                                    {question.answers.map((answer, answerIndex) => (
                                        <div
                                            key={answer}
                                            className={`rounded-[1.2rem] border px-4 py-4 text-sm ${
                                                answerIndex === question.correctIndex
                                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                                    : "border-primary/8 bg-[#fbf8f3] text-text-secondary"
                                            }`}
                                        >
                                            <span className="mr-2 text-xs uppercase tracking-[0.26em] text-text-secondary">
                                                {String.fromCharCode(65 + answerIndex)}
                                            </span>
                                            {answer}
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 rounded-[1.2rem] border border-primary/8 bg-[#fbf8f3] px-4 py-4 text-sm leading-relaxed text-text-secondary">
                                    <span className="mr-2 text-xs uppercase tracking-[0.26em] text-text-secondary">Fun Fact</span>
                                    {question.funFact ?? "No fun fact provided for this question yet."}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        if (modalView === "leaderboards") {
            return (
                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-[1.8rem] border border-primary/10 bg-white p-6 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <div className="flex items-end justify-between gap-4 border-b border-primary/8 pb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Trivia</p>
                                <h3 className="mt-3 font-heading text-3xl text-primary">Top trivia scores</h3>
                            </div>
                            <p className="text-sm text-text-secondary">{triviaScores.length} submissions</p>
                        </div>
                        {gameScoresError ? (
                            <p className="mt-6 text-sm leading-relaxed text-secondary">{gameScoresError}</p>
                        ) : triviaScores.length === 0 ? (
                            <p className="mt-6 text-sm text-text-secondary">No trivia submissions yet.</p>
                        ) : (
                            <div className="mt-6 space-y-3">
                                {triviaScores.slice(0, 10).map((score, index) => {
                                    const player = getPlayerDetails(score);
                                    return (
                                        <div key={score.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1.2rem] border border-primary/8 bg-[#fbf8f3] px-4 py-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">{index + 1}</div>
                                            <div>
                                                <p className="font-medium text-primary">{player?.username ?? "Guest"}</p>
                                                <p className="text-sm text-text-secondary">{player?.email ?? "No email"}</p>
                                            </div>
                                            <div className="text-right text-primary">
                                                <p className="font-heading text-2xl">{score.score}</p>
                                                <p className="text-xs uppercase tracking-[0.22em] text-text-secondary">points</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rounded-[1.8rem] border border-primary/10 bg-white p-6 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <div className="flex items-end justify-between gap-4 border-b border-primary/8 pb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Painedle</p>
                                <h3 className="mt-3 font-heading text-3xl text-primary">Today&rsquo;s leaders</h3>
                            </div>
                            <p className="text-sm text-text-secondary">{todayKey}</p>
                        </div>
                        {gameScoresError ? (
                            <p className="mt-6 text-sm leading-relaxed text-secondary">{gameScoresError}</p>
                        ) : todaysPainedleScores.length === 0 ? (
                            <p className="mt-6 text-sm text-text-secondary">No Painedle scores for today yet.</p>
                        ) : (
                            <div className="mt-6 space-y-3">
                                {todaysPainedleScores.slice(0, 10).map((score, index) => {
                                    const player = getPlayerDetails(score);
                                    return (
                                        <div key={score.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1.2rem] border border-primary/8 bg-[#fbf8f3] px-4 py-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">{index + 1}</div>
                                            <div>
                                                <p className="font-medium text-primary">{player?.username ?? "Guest"}</p>
                                                <p className="text-sm text-text-secondary">{score.attempts ?? "-"} guesses</p>
                                            </div>
                                            <div className="text-right text-primary">
                                                <p className="font-heading text-2xl">{score.score}</p>
                                                <p className="text-xs uppercase tracking-[0.22em] text-text-secondary">points</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (modalView === "submissions") {
            return (
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Activity Feed</p>
                            <h3 className="mt-3 font-heading text-4xl text-primary">Recent submissions</h3>
                            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
                                Full score log with usernames, puzzle keys, timestamps, attempts, and profile signals pulled from the browser and request headers.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <ModalButton label="All" active={scoreFilter === "all"} onClick={() => setScoreFilter("all")} />
                            <ModalButton label="Trivia" active={scoreFilter === "trivia"} onClick={() => setScoreFilter("trivia")} />
                            <ModalButton label="Painedle" active={scoreFilter === "painedle"} onClick={() => setScoreFilter("painedle")} />
                        </div>
                    </div>

                    {gameScoresError ? (
                        <div className="rounded-[1.5rem] border border-yellow-200 bg-yellow-50 px-5 py-5 text-sm leading-relaxed text-yellow-900">
                            {gameScoresError}
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-[1.8rem] border border-primary/10 bg-white shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                            <div className="grid grid-cols-[1.1fr_0.8fr_0.6fr_0.6fr_0.9fr_1fr] gap-4 border-b border-primary/8 bg-[#fbf8f3] px-6 py-4 text-xs uppercase tracking-[0.26em] text-text-secondary">
                                <div>Player</div>
                                <div>Game / Puzzle</div>
                                <div>Score</div>
                                <div>Attempts</div>
                                <div>Profile</div>
                                <div>Submitted</div>
                            </div>
                            <div className="max-h-[32rem] overflow-auto divide-y divide-primary/6">
                                {filteredScores.map((score) => {
                                    const player = getPlayerDetails(score);
                                    const profile = getProfileSummary(score);
                                    return (
                                        <div key={score.id} className="grid grid-cols-[1.1fr_0.8fr_0.6fr_0.6fr_0.9fr_1fr] gap-4 px-6 py-4 text-sm text-text-secondary">
                                            <div>
                                                <p className="font-medium text-primary">{player?.username ?? "Guest"}</p>
                                                <p className="text-xs text-text-secondary">{player?.email ?? "No email"}</p>
                                            </div>
                                            <div>
                                                <p className="uppercase tracking-[0.14em] text-primary">{score.game}</p>
                                                <p className="text-xs text-text-secondary">{getPuzzleLabel(score)}</p>
                                            </div>
                                            <div className="text-primary">{getScoreLabel(score)}</div>
                                            <div>{score.attempts ?? "-"}</div>
                                            <div>
                                                <p className="text-primary">{profile.device}</p>
                                                <p className="text-xs text-text-secondary">{profile.location}</p>
                                                {profile.ip ? <p className="text-xs text-text-secondary">IP {profile.ip}</p> : null}
                                            </div>
                                            <div>{formatSubmissionTime(score.created_at)}</div>
                                        </div>
                                    );
                                })}
                                {filteredScores.length === 0 ? (
                                    <div className="px-6 py-10 text-center text-sm text-text-secondary">No submissions for this filter yet.</div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        if (modalView === "players") {
            return (
                <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-3">
                        <OverviewMetric
                            label="Unique Players"
                            value={uniquePlayers.length}
                            note="Distinct emails currently attached to game submissions."
                        />
                        <OverviewMetric
                            label="Most Active"
                            value={uniquePlayers[0]?.username ?? "-"}
                            note="Player with the highest number of total submissions."
                        />
                        <OverviewMetric
                            label="Trivia Players"
                            value={uniquePlayers.filter((player) => player.triviaSubmissions > 0).length}
                            note="Unique guests who have submitted at least one trivia score."
                        />
                    </div>

                    {gameScoresError ? (
                        <div className="rounded-[1.5rem] border border-yellow-200 bg-yellow-50 px-5 py-5 text-sm leading-relaxed text-yellow-900">
                            {gameScoresError}
                        </div>
                    ) : (
                        <div className="overflow-hidden rounded-[1.8rem] border border-primary/10 bg-white shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                            <div className="grid grid-cols-[1fr_0.55fr_0.7fr_0.7fr_1fr] gap-4 border-b border-primary/8 bg-[#fbf8f3] px-6 py-4 text-xs uppercase tracking-[0.26em] text-text-secondary">
                                <div>Player</div>
                                <div>Total</div>
                                <div>Best Trivia</div>
                                <div>Best Painedle</div>
                                <div>Latest Profile</div>
                            </div>
                            <div className="max-h-[32rem] overflow-auto divide-y divide-primary/6">
                                {uniquePlayers.map((player) => (
                                    <div key={player.email || player.username} className="grid grid-cols-[1fr_0.55fr_0.7fr_0.7fr_1fr] gap-4 px-6 py-4 text-sm text-text-secondary">
                                        <div>
                                            <p className="font-medium text-primary">{player.username}</p>
                                            <p className="text-xs text-text-secondary">{player.email || "No email"}</p>
                                        </div>
                                        <div>{player.totalSubmissions}</div>
                                        <div>{player.bestTriviaScore ?? "-"}</div>
                                        <div>{player.bestPainedleScore ?? "-"}</div>
                                        <div>
                                            <p className="text-primary">{player.latestDevice ?? "Unknown device"}</p>
                                            <p className="text-xs text-text-secondary">{player.latestLocation ?? "Unknown location"}</p>
                                            <p className="text-xs text-text-secondary">
                                                {player.latestSeenAt ? `Seen ${formatSubmissionTime(player.latestSeenAt)}` : "No recent activity"}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {uniquePlayers.length === 0 ? (
                                    <div className="px-6 py-10 text-center text-sm text-text-secondary">No players yet.</div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            );
        }

        return null;
    }

    return (
        <>
            <div className="space-y-8">
                {gameScoresError ? (
                    <div className="rounded-[1.8rem] border border-yellow-200 bg-yellow-50 px-6 py-5 text-sm leading-relaxed text-yellow-900">
                        <p className="text-xs uppercase tracking-[0.28em] text-yellow-800">Games Health</p>
                        <p className="mt-3">
                            {gameScoresError} Static admin controls below still work, so you can review trivia content,
                            today&rsquo;s word, and the full Painedle bank even before the tables are ready.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-[1.8rem] border border-primary/10 bg-[linear-gradient(145deg,#173756_0%,#10253c_100%)] px-6 py-5 text-white shadow-[0_16px_44px_rgba(20,42,68,0.12)]">
                        <p className="text-xs uppercase tracking-[0.28em] text-white/60">Games Status</p>
                        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <p className="max-w-3xl text-sm leading-relaxed text-white/80">
                                Trivia is {remaining.isUnlocked ? "live" : `locked until ${TRIVIA_UNLOCK_LABEL}`}. Painedle is live now, today&rsquo;s answer is loaded, and leaderboard data is available in this panel.
                            </p>
                            <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/78">
                                {remaining.isUnlocked
                                    ? "Trivia Live"
                                    : `${remaining.days}d ${remaining.hours}h ${remaining.minutes}m until unlock`}
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                    <OverviewMetric
                        label="Total Scores"
                        value={gameScores.length}
                        note="All leaderboard rows across both games."
                    />
                    <OverviewMetric
                        label="Unique Players"
                        value={uniquePlayers.length}
                        note="Distinct users by email."
                    />
                    <OverviewMetric
                        label="Trivia Scores"
                        value={triviaScores.length}
                        note="All trivia submissions so far."
                    />
                    <OverviewMetric
                        label="Avg Trivia"
                        value={averageTriviaScore}
                        note="Average trivia score out of 10."
                    />
                    <OverviewMetric
                        label="Today's Painedle"
                        value={todaysPainedleScores.length}
                        note="Submissions against today's puzzle key."
                    />
                    <OverviewMetric
                        label="Word Bank"
                        value={PAINEDLE_WORDS.length}
                        note="Total Painedle answers in rotation."
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-3">
                    <ControlCard
                        eyebrow="Painedle Control Room"
                        title="Daily puzzle management"
                        copy="Keep the live word hidden in the overview, then drill into the answer, the upcoming schedule, or the full bank only when needed."
                    >
                        <PillButton label="Reveal today's word" onClick={() => setModalView("today-word")} />
                        <PillButton label="Preview schedule" onClick={() => setModalView("schedule")} />
                        <PillButton label="View word bank" onClick={() => setModalView("word-bank")} />
                    </ControlCard>

                    <ControlCard
                        eyebrow="Trivia Control Room"
                        title="Question and launch management"
                        copy="Review every trivia prompt, the correct answer, fun facts, and the current launch state without dumping the entire question bank into the tab body."
                    >
                        <PillButton label="Question bank" onClick={() => setModalView("trivia-bank")} />
                        <PillButton label="Leaderboards" onClick={() => setModalView("leaderboards")} />
                    </ControlCard>

                    <ControlCard
                        eyebrow="Player Activity"
                        title="Submissions and people"
                        copy="Track recent submissions, inspect score timing, and see who is actually playing without turning the overview into a giant table."
                    >
                        <PillButton label="Recent submissions" onClick={() => setModalView("submissions")} />
                        <PillButton label="Player directory" onClick={() => setModalView("players")} />
                    </ControlCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-[1.8rem] border border-primary/10 bg-white p-6 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <div className="flex items-end justify-between gap-4 border-b border-primary/8 pb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Preview</p>
                                <h3 className="mt-3 font-heading text-3xl text-primary">Trivia leaderboard</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalView("leaderboards")}
                                className="text-xs uppercase tracking-[0.22em] text-primary hover:text-secondary"
                            >
                                View full
                            </button>
                        </div>
                        {gameScoresError ? (
                            <p className="mt-6 text-sm leading-relaxed text-secondary">{gameScoresError}</p>
                        ) : leaderboardPreview.trivia.length === 0 ? (
                            <p className="mt-6 text-sm text-text-secondary">No trivia scores yet.</p>
                        ) : (
                            <div className="mt-6 space-y-3">
                                {leaderboardPreview.trivia.map((score, index) => {
                                    const player = getPlayerDetails(score);
                                    return (
                                        <div key={score.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1.2rem] border border-primary/8 bg-[#fbf8f3] px-4 py-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">{index + 1}</div>
                                            <div>
                                                <p className="font-medium text-primary">{player?.username ?? "Guest"}</p>
                                                <p className="text-sm text-text-secondary">{player?.email ?? "No email"}</p>
                                            </div>
                                            <div className="text-primary">{score.score}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="rounded-[1.8rem] border border-primary/10 bg-white p-6 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <div className="flex items-end justify-between gap-4 border-b border-primary/8 pb-4">
                            <div>
                                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Preview</p>
                                <h3 className="mt-3 font-heading text-3xl text-primary">Today&rsquo;s Painedle board</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalView("today-word")}
                                className="text-xs uppercase tracking-[0.22em] text-primary hover:text-secondary"
                            >
                                Reveal word
                            </button>
                        </div>
                        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                            <div>
                                <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Today&rsquo;s key</p>
                                <p className="mt-2 text-lg text-primary">{todayKey}</p>
                                <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                                    Live answer is hidden from the overview. Open the reveal view when you need it.
                                </p>
                            </div>
                            <div className="rounded-[1.4rem] border border-primary/10 bg-[#fbf8f3] px-5 py-4 text-center">
                                <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Today&rsquo;s plays</p>
                                <p className="mt-2 font-heading text-4xl text-primary">{todaysPainedleScores.length}</p>
                            </div>
                        </div>

                        {gameScoresError ? (
                            <p className="mt-6 text-sm leading-relaxed text-secondary">{gameScoresError}</p>
                        ) : leaderboardPreview.painedle.length === 0 ? (
                            <p className="mt-6 text-sm text-text-secondary">No Painedle submissions for today yet.</p>
                        ) : (
                            <div className="mt-6 space-y-3">
                                {leaderboardPreview.painedle.map((score, index) => {
                                    const player = getPlayerDetails(score);
                                    return (
                                        <div key={score.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-[1.2rem] border border-primary/8 bg-[#fbf8f3] px-4 py-4">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">{index + 1}</div>
                                            <div>
                                                <p className="font-medium text-primary">{player?.username ?? "Guest"}</p>
                                                <p className="text-sm text-text-secondary">{score.attempts ?? "-"} guesses</p>
                                            </div>
                                            <div className="text-primary">{score.score}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {modalView ? (
                <div className="fixed inset-0 z-[70] bg-primary/60 px-4 py-6 backdrop-blur-sm">
                    <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-[2rem] border border-primary/12 bg-[linear-gradient(180deg,#fcfaf6_0%,#f5efe6_100%)] shadow-[0_30px_90px_rgba(20,42,68,0.25)]">
                        <div className="flex flex-col gap-4 border-b border-primary/10 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-8">
                            <div>
                                <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">Games Admin</p>
                                <h2 className="mt-2 font-heading text-3xl text-primary">
                                    {modalView === "today-word" && "Today's Painedle"}
                                    {modalView === "schedule" && "Painedle schedule preview"}
                                    {modalView === "word-bank" && "Painedle word bank"}
                                    {modalView === "trivia-bank" && "Trivia question bank"}
                                    {modalView === "leaderboards" && "Leaderboard views"}
                                    {modalView === "submissions" && "Recent submissions"}
                                    {modalView === "players" && "Player directory"}
                                </h2>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={() => setModalView(null)}
                                    className="rounded-full border border-primary/12 bg-white px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
                                >
                                    Back to Games Overview
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModalView(null)}
                                    className="rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-[0.22em] text-white transition-colors duration-200 hover:bg-primary/90"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto px-6 py-6 md:px-8 md:py-8">{renderModalContent()}</div>
                    </div>
                </div>
            ) : null}
        </>
    );
}
