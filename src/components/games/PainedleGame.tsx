"use client";

import { useEffect, useEffectEvent, useState } from "react";
import ScoreSubmissionForm from "@/components/games/ScoreSubmissionForm";
import {
    KEYBOARD_ROWS,
    MAX_GUESSES,
    WORD_LENGTH,
    evaluateGuess,
    getDailyWord,
    getStorageKey,
    getTodayKey,
    getWordStatusMap,
    isValidGuess,
    type LetterStatus,
} from "@/lib/games/painedle";

type GameStatus = "playing" | "won" | "lost";

type SavedGameState = {
    guesses: string[];
    currentGuess: string;
    status: GameStatus;
    message: string;
};

function tileClasses(status?: LetterStatus, hasLetter?: boolean) {
    if (status === "correct") {
        return "border-emerald-400 bg-emerald-500 text-white shadow-[0_10px_24px_rgba(16,185,129,0.28)]";
    }

    if (status === "present") {
        return "border-[#d6b073] bg-[#c69a72] text-slate-950 shadow-[0_10px_24px_rgba(198,154,114,0.22)]";
    }

    if (status === "absent") {
        return "border-[#4e6782] bg-[#28415d] text-white";
    }

    if (hasLetter) {
        return "border-[#d8b686] bg-[#f8efe1] text-primary";
    }

    return "border-white/12 bg-[#10263d]/82 text-white/55";
}

function keyboardKeyClasses(status?: LetterStatus) {
    if (status === "correct") return "border-emerald-400 bg-emerald-500 text-white";
    if (status === "present") return "border-[#d6b073] bg-[#c69a72] text-slate-950";
    if (status === "absent") return "border-[#4e6782] bg-[#28415d] text-white";
    return "border-[#6a8097] bg-[#eef2f6] text-primary hover:bg-white";
}

function createInitialState(dateKey: string): SavedGameState {
    if (typeof window === "undefined") {
        return {
            guesses: [],
            currentGuess: "",
            status: "playing",
            message: "A new five-letter answer every day.",
        };
    }

    const savedState = window.localStorage.getItem(getStorageKey(dateKey));
    if (!savedState) {
        return {
            guesses: [],
            currentGuess: "",
            status: "playing",
            message: "A new five-letter answer every day.",
        };
    }

    try {
        const parsed = JSON.parse(savedState) as SavedGameState;
        return {
            guesses: parsed.guesses ?? [],
            currentGuess: parsed.currentGuess ?? "",
            status: parsed.status ?? "playing",
            message: parsed.message ?? (parsed.status === "won" ? "You already solved today's Painedle." : "Welcome back."),
        };
    } catch {
        return {
            guesses: [],
            currentGuess: "",
            status: "playing",
            message: "A new five-letter answer every day.",
        };
    }
}

function PainedleBoard({ dateKey }: { dateKey: string }) {
    const [guesses, setGuesses] = useState<string[]>(() => createInitialState(dateKey).guesses);
    const [currentGuess, setCurrentGuess] = useState(() => createInitialState(dateKey).currentGuess);
    const [status, setStatus] = useState<GameStatus>(() => createInitialState(dateKey).status);
    const [message, setMessage] = useState(() => createInitialState(dateKey).message);
    const [flippingRow, setFlippingRow] = useState<number | null>(null);
    const [shakingRow, setShakingRow] = useState<number | null>(null);

    const solution = getDailyWord(dateKey);
    const storageKey = getStorageKey(dateKey);
    const keyboardStatuses = getWordStatusMap(guesses, solution);
    const score = status === "won" ? MAX_GUESSES - guesses.length + 1 : 0;

    useEffect(() => {
        const stateToSave: SavedGameState = {
            guesses,
            currentGuess,
            status,
            message,
        };

        window.localStorage.setItem(storageKey, JSON.stringify(stateToSave));
    }, [currentGuess, guesses, message, status, storageKey]);

    function triggerShake() {
        const rowIndex = guesses.length;
        setShakingRow(rowIndex);
        window.setTimeout(() => setShakingRow(null), 450);
    }

    function handleSubmit() {
        if (status !== "playing") return;

        if (currentGuess.length !== WORD_LENGTH) {
            setMessage("Enter a full five-letter word.");
            triggerShake();
            return;
        }

        if (!isValidGuess(currentGuess)) {
            setMessage("That guess is not in the Painedle word list.");
            triggerShake();
            return;
        }

        const guess = currentGuess.toLowerCase();
        const nextGuesses = [...guesses, guess];
        const nextRowIndex = nextGuesses.length - 1;
        const hasWon = guess === solution;
        const hasLost = nextGuesses.length === MAX_GUESSES && !hasWon;

        setGuesses(nextGuesses);
        setCurrentGuess("");
        setFlippingRow(nextRowIndex);
        setStatus(hasWon ? "won" : hasLost ? "lost" : "playing");
        setMessage(
            hasWon
                ? "Solved. Strong work."
                : hasLost
                    ? `The word was ${solution.toUpperCase()}.`
                    : "Guess locked in."
        );
        window.setTimeout(() => setFlippingRow(null), 900);
    }

    function handleKeyInput(key: string) {
        if (status !== "playing") return;

        if (key === "Enter") {
            handleSubmit();
            return;
        }

        if (key === "Backspace") {
            setCurrentGuess((guess) => guess.slice(0, -1));
            return;
        }

        if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
            setCurrentGuess((guess) => `${guess}${key.toLowerCase()}`);
        }
    }

    const handlePhysicalKeyInput = useEffectEvent((key: string) => {
        if (key === "Enter" || key === "Backspace") {
            handleKeyInput(key);
            return;
        }

        if (/^[A-Z]$/.test(key)) {
            handleKeyInput(key);
        }
    });

    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.metaKey || event.ctrlKey || event.altKey) return;

            const key = event.key;
            if (key === "Enter" || key === "Backspace") {
                event.preventDefault();
                handlePhysicalKeyInput(key);
                return;
            }

            if (/^[a-zA-Z]$/.test(key)) {
                handlePhysicalKeyInput(key.toUpperCase());
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    function resetForToday() {
        setGuesses([]);
        setCurrentGuess("");
        setStatus("playing");
        setMessage("Fresh board. Same daily word.");
        setFlippingRow(null);
        setShakingRow(null);
        window.localStorage.removeItem(storageKey);
    }

    return (
        <div className="relative overflow-hidden rounded-[2.3rem] border border-primary/10 bg-[linear-gradient(155deg,#0f2439_0%,#15314f_58%,#1e4566_100%)] p-6 text-white shadow-[0_28px_90px_rgba(20,42,68,0.20)] md:p-10">
            <div className="pointer-events-none absolute -right-12 top-0 h-52 w-52 rounded-full bg-accent/16 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 bottom-0 h-44 w-44 rounded-full bg-white/10 blur-3xl" />

            <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/60">Daily Puzzle</p>
                    <h2 className="mt-4 font-heading text-4xl text-white">Painedle</h2>
                    <p className="mt-4 max-w-2xl leading-relaxed text-white/78">
                        Guess the daily five-letter wedding word in six tries. Progress saves in your browser.
                    </p>
                </div>
                <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm uppercase tracking-[0.24em] text-white/72 backdrop-blur-sm">
                    Today: {dateKey}
                </div>
            </div>

            <div className="relative mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="rounded-full border border-white/12 bg-white/8 px-5 py-3 text-sm text-white/80 backdrop-blur-sm">
                    {message}
                </div>
                <button
                    type="button"
                    onClick={resetForToday}
                    className="inline-flex items-center justify-center rounded-full border border-[#d6b073] px-5 py-3 text-xs font-medium uppercase tracking-[0.2em] text-[#f7dec0] transition-colors duration-200 hover:bg-[#d6b073] hover:text-primary"
                >
                    Reset Today
                </button>
            </div>

            <div className="relative mt-10 flex flex-col items-center gap-3">
                {Array.from({ length: MAX_GUESSES }, (_, rowIndex) => {
                    const submittedGuess = guesses[rowIndex];
                    const activeGuess = rowIndex === guesses.length ? currentGuess : "";
                    const letters = (submittedGuess ?? activeGuess).padEnd(WORD_LENGTH).split("");
                    const statuses = submittedGuess ? evaluateGuess(submittedGuess, solution) : [];

                    return (
                        <div
                            key={`row-${rowIndex + 1}`}
                            className={`flex gap-2 ${shakingRow === rowIndex ? "animate-painedle-shake" : ""}`}
                        >
                            {letters.map((letter, columnIndex) => (
                                <div
                                    key={`tile-${rowIndex + 1}-${columnIndex + 1}`}
                                    className={`flex h-14 w-14 items-center justify-center rounded-[1rem] border text-xl font-semibold uppercase tracking-[0.12em] transition-all duration-300 md:h-16 md:w-16 md:text-2xl ${tileClasses(statuses[columnIndex], Boolean(letter.trim()))} ${flippingRow === rowIndex && submittedGuess ? "animate-painedle-flip" : ""}`}
                                    style={{
                                        animationDelay: flippingRow === rowIndex && submittedGuess ? `${columnIndex * 120}ms` : undefined,
                                    }}
                                >
                                    {letter.trim()}
                                </div>
                            ))}
                        </div>
                    );
                })}
            </div>

            <div className="relative mt-10 space-y-3">
                {KEYBOARD_ROWS.map((row) => (
                    <div key={row.join("")} className="flex justify-center gap-2">
                        {row.map((key) => {
                            const keyStatus = key.length === 1 ? keyboardStatuses[key.toLowerCase()] : undefined;
                            const statusClass = key.length === 1
                                ? keyboardKeyClasses(keyStatus)
                                : "border-primary bg-primary text-white hover:bg-[#1e4566]";
                            const sizeClass = key === "ENTER" ? "min-w-20 px-4" : key === "BACK" ? "min-w-20 px-4" : "w-10 md:w-12";

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => handleKeyInput(key === "BACK" ? "Backspace" : key)}
                                    className={`flex h-12 items-center justify-center rounded-[0.9rem] border text-sm font-medium uppercase tracking-[0.12em] transition-colors duration-200 ${sizeClass} ${statusClass}`}
                                >
                                    {key === "BACK" ? "Back" : key}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>

            {status !== "playing" ? (
                <div className="relative mt-10">
                    {status === "won" ? (
                        <ScoreSubmissionForm
                            game="painedle"
                            score={score}
                            maxScore={MAX_GUESSES}
                            attempts={guesses.length}
                            solved
                            puzzleKey={dateKey}
                            metadata={{ solution }}
                            buttonLabel="Submit Painedle Score"
                            successMessage="Painedle score submitted."
                        />
                    ) : (
                        <div className="rounded-[1.75rem] border border-white/12 bg-white/8 p-6">
                            <p className="text-sm uppercase tracking-[0.3em] text-white/60">Round Complete</p>
                            <p className="mt-3 text-white/78">
                                Only solved games go on the leaderboard. Come back tomorrow for the next word, or
                                reset today and practice locally.
                            </p>
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}

export default function PainedleGame() {
    const [dateKey, setDateKey] = useState(() => getTodayKey());

    useEffect(() => {
        const now = new Date();
        const nextMidnight = new Date(now);
        nextMidnight.setHours(24, 0, 0, 0);
        const timeout = window.setTimeout(() => {
            setDateKey(getTodayKey());
        }, nextMidnight.getTime() - now.getTime() + 50);

        return () => window.clearTimeout(timeout);
    }, [dateKey]);

    return <PainedleBoard key={dateKey} dateKey={dateKey} />;
}
