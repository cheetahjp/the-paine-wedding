"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ScoreSubmissionForm from "@/components/games/ScoreSubmissionForm";
import {
    computeCrosswordScore,
    CROSSWORD_PUZZLE,
    CROSSWORD_PUZZLE_KEY,
    CROSSWORD_STORAGE_KEY,
    type CrosswordCell,
    type CrosswordDirection,
    type CrosswordMetadata,
    type CrosswordNumberedEntry,
} from "@/lib/games/crossword";

type SavedCrosswordState = {
    letters: Record<string, string>;
    activeEntryId: string;
    checksUsed: number;
    revealedEntryIds: string[];
    startedAt: string;
    completedAt: string | null;
    scoreSubmitted: boolean;
};

const ENTRY_MAP = new Map(CROSSWORD_PUZZLE.entries.map((entry) => [entry.id, entry]));
const ENTRY_IDS_BY_CELL = new Map<string, string[]>(
    CROSSWORD_PUZZLE.cells
        .filter((cell) => cell.answer)
        .map((cell) => [cell.key, cell.entryIds])
);

function getEmptyLetters() {
    return Object.fromEntries(
        CROSSWORD_PUZZLE.cells.filter((cell) => cell.answer).map((cell) => [cell.key, ""])
    ) as Record<string, string>;
}

function getDefaultState(): SavedCrosswordState {
    return {
        letters: getEmptyLetters(),
        activeEntryId: CROSSWORD_PUZZLE.entries[0]?.id ?? "",
        checksUsed: 0,
        revealedEntryIds: [],
        startedAt: new Date().toISOString(),
        completedAt: null,
        scoreSubmitted: false,
    };
}

function getInitialState(): SavedCrosswordState {
    if (typeof window === "undefined") {
        return getDefaultState();
    }

    try {
        const rawValue = window.localStorage.getItem(CROSSWORD_STORAGE_KEY);
        if (!rawValue) return getDefaultState();

        const parsed = JSON.parse(rawValue) as Partial<SavedCrosswordState>;
        return {
            letters: parsed.letters ? { ...getEmptyLetters(), ...parsed.letters } : getEmptyLetters(),
            activeEntryId: parsed.activeEntryId && ENTRY_MAP.has(parsed.activeEntryId)
                ? parsed.activeEntryId
                : (CROSSWORD_PUZZLE.entries[0]?.id ?? ""),
            checksUsed: typeof parsed.checksUsed === "number" ? parsed.checksUsed : 0,
            revealedEntryIds: Array.isArray(parsed.revealedEntryIds)
                ? parsed.revealedEntryIds.filter((id) => ENTRY_MAP.has(id))
                : [],
            startedAt: typeof parsed.startedAt === "string" ? parsed.startedAt : new Date().toISOString(),
            completedAt: typeof parsed.completedAt === "string" || parsed.completedAt === null ? parsed.completedAt : null,
            scoreSubmitted: typeof parsed.scoreSubmitted === "boolean" ? parsed.scoreSubmitted : false,
        };
    } catch {
        window.localStorage.removeItem(CROSSWORD_STORAGE_KEY);
        return getDefaultState();
    }
}

function isSolvedLetters(letters: Record<string, string>) {
    return CROSSWORD_PUZZLE.cells.every((cell) => !cell.answer || letters[cell.key] === cell.answer);
}

function getEntryById(entryId: string | null) {
    return entryId ? ENTRY_MAP.get(entryId) ?? null : null;
}

function focusInput(inputRefs: React.MutableRefObject<Record<string, HTMLInputElement | null>>, cellKey: string) {
    const input = inputRefs.current[cellKey];
    input?.focus();
    input?.select();
}

export default function MiniCrosswordGame() {
    const [initialState] = useState(getInitialState);
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const [letters, setLetters] = useState<Record<string, string>>(initialState.letters);
    const [activeEntryId, setActiveEntryId] = useState<string>(initialState.activeEntryId);
    const [checksUsed, setChecksUsed] = useState(initialState.checksUsed);
    const [revealedEntryIds, setRevealedEntryIds] = useState<string[]>(initialState.revealedEntryIds);
    const [startedAt, setStartedAt] = useState(initialState.startedAt);
    const [completedAt, setCompletedAt] = useState<string | null>(initialState.completedAt);
    const [scoreSubmitted, setScoreSubmitted] = useState(initialState.scoreSubmitted);
    const [notice, setNotice] = useState("Tap a clue or a square to start filling the board.");
    const [incorrectKeys, setIncorrectKeys] = useState<string[]>([]);
    const [durationSeconds, setDurationSeconds] = useState(1);

    useEffect(() => {
        const payload: SavedCrosswordState = {
            letters,
            activeEntryId,
            checksUsed,
            revealedEntryIds,
            startedAt,
            completedAt,
            scoreSubmitted,
        };

        window.localStorage.setItem(CROSSWORD_STORAGE_KEY, JSON.stringify(payload));
    }, [letters, activeEntryId, checksUsed, revealedEntryIds, startedAt, completedAt, scoreSubmitted]);

    const activeEntry = getEntryById(activeEntryId);
    const activeCells = activeEntry?.cells ?? [];

    const solvedCellCount = useMemo(
        () =>
            CROSSWORD_PUZZLE.cells.filter((cell) => cell.answer && letters[cell.key] === cell.answer).length,
        [letters]
    );
    const fillCount = useMemo(
        () => Object.values(letters).filter(Boolean).length,
        [letters]
    );
    const totalFillableCells = Object.keys(getEmptyLetters()).length;
    const isSolved = useMemo(
        () => CROSSWORD_PUZZLE.cells.every((cell) => !cell.answer || letters[cell.key] === cell.answer),
        [letters]
    );

    useEffect(() => {
        function updateDuration() {
            const endTime = completedAt ? new Date(completedAt).getTime() : Date.now();
            setDurationSeconds(Math.max(1, Math.round((endTime - new Date(startedAt).getTime()) / 1000)));
        }

        updateDuration();

        if (completedAt) return;

        const interval = window.setInterval(updateDuration, 1000);
        return () => window.clearInterval(interval);
    }, [completedAt, startedAt]);

    const score = computeCrosswordScore(durationSeconds, checksUsed, revealedEntryIds.length);
    const metadata: CrosswordMetadata = {
        duration_seconds: durationSeconds,
        checks_used: checksUsed,
        reveals_used: revealedEntryIds.length,
        completed_at: completedAt ?? startedAt,
    };

    function selectEntry(entry: CrosswordNumberedEntry, focus = true) {
        setActiveEntryId(entry.id);
        const firstOpenCell = entry.cells.find((cellKey) => !letters[cellKey]) ?? entry.cells[0];

        if (focus) {
            window.requestAnimationFrame(() => focusInput(inputRefs, firstOpenCell));
        }
    }

    function getEntryForCell(cellKey: string, preferredDirection?: CrosswordDirection) {
        const entryIds = ENTRY_IDS_BY_CELL.get(cellKey) ?? [];
        if (entryIds.length === 0) return null;

        if (preferredDirection) {
            const matching = entryIds.find((entryId) => ENTRY_MAP.get(entryId)?.direction === preferredDirection);
            if (matching) return ENTRY_MAP.get(matching) ?? null;
        }

        return ENTRY_MAP.get(entryIds[0]) ?? null;
    }

    function moveWithinEntry(entry: CrosswordNumberedEntry | null, currentKey: string, step: 1 | -1) {
        if (!entry) return;
        const currentIndex = entry.cells.indexOf(currentKey);
        if (currentIndex === -1) return;
        const nextKey = entry.cells[currentIndex + step];
        if (nextKey) {
            focusInput(inputRefs, nextKey);
        }
    }

    function updateCell(cellKey: string, rawValue: string) {
        const nextValue = rawValue.replace(/[^a-z]/gi, "").slice(-1).toUpperCase();
        const nextLetters = { ...letters, [cellKey]: nextValue };
        setLetters(nextLetters);

        if (!completedAt && isSolvedLetters(nextLetters)) {
            setCompletedAt(new Date().toISOString());
            setNotice("Puzzle complete. Submit your score to lock in your spot on the board.");
        }

        if (nextValue && activeEntry) {
            const currentIndex = activeEntry.cells.indexOf(cellKey);
            const nextKey = activeEntry.cells[currentIndex + 1];
            if (nextKey) {
                window.requestAnimationFrame(() => focusInput(inputRefs, nextKey));
            }
        }
    }

    function handleCellClick(cell: CrosswordCell) {
        if (!cell.answer) return;
        const entryIds = ENTRY_IDS_BY_CELL.get(cell.key) ?? [];
        if (entryIds.length === 2) {
            const nextId = activeEntryId === entryIds[0] ? entryIds[1] : entryIds[0];
            setActiveEntryId(nextId);
            return;
        }

        const entry = getEntryForCell(cell.key, activeEntry?.direction);
        if (entry) setActiveEntryId(entry.id);
    }

    function handleCheckBoard() {
        const incorrect = CROSSWORD_PUZZLE.cells
            .filter((cell) => cell.answer && letters[cell.key] && letters[cell.key] !== cell.answer)
            .map((cell) => cell.key);

        setChecksUsed((current) => current + 1);
        setIncorrectKeys(incorrect);
        window.setTimeout(() => setIncorrectKeys([]), 1400);

        if (incorrect.length === 0) {
            setNotice(isSolved ? "Everything is correct. Submit your score when you're ready." : "No mistakes in the filled squares so far.");
            return;
        }

        setNotice(`${incorrect.length} square${incorrect.length === 1 ? "" : "s"} need another look.`);
    }

    function handleRevealEntry() {
        if (!activeEntry) return;

        const nextLetters = { ...letters };
        activeEntry.cells.forEach((cellKey, index) => {
            nextLetters[cellKey] = activeEntry.answer[index] ?? "";
        });
        setLetters(nextLetters);
        setRevealedEntryIds((current) => (current.includes(activeEntry.id) ? current : [...current, activeEntry.id]));

        if (!completedAt && isSolvedLetters(nextLetters)) {
            setCompletedAt(new Date().toISOString());
            setNotice("Puzzle complete. Submit your score to lock in your spot on the board.");
            return;
        }

        setNotice(`Revealed ${activeEntry.number} ${activeEntry.direction}.`);
    }

    function handleClearEntry() {
        if (!activeEntry) return;

        const nextLetters = { ...letters };
        activeEntry.cells.forEach((cellKey) => {
            nextLetters[cellKey] = "";
        });
        setLetters(nextLetters);
        setNotice(`Cleared ${activeEntry.number} ${activeEntry.direction}.`);
        window.requestAnimationFrame(() => focusInput(inputRefs, activeEntry.cells[0]));
    }

    function handleResetPuzzle() {
        const shouldReset = window.confirm("Reset the crossword and clear the saved progress on this browser?");
        if (!shouldReset) return;

        const freshLetters = getEmptyLetters();
        setLetters(freshLetters);
        setActiveEntryId(CROSSWORD_PUZZLE.entries[0]?.id ?? "");
        setChecksUsed(0);
        setRevealedEntryIds([]);
        setStartedAt(new Date().toISOString());
        setCompletedAt(null);
        setScoreSubmitted(false);
        setNotice("Puzzle reset. Start with any clue.");
        window.localStorage.removeItem(CROSSWORD_STORAGE_KEY);
    }

    function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>, cell: CrosswordCell) {
        if (!cell.answer) return;

        if (event.key === "Backspace") {
            event.preventDefault();
            if (letters[cell.key]) {
                setLetters((current) => ({ ...current, [cell.key]: "" }));
                return;
            }

            moveWithinEntry(activeEntry, cell.key, -1);
            return;
        }

        if (event.key === "ArrowRight") {
            event.preventDefault();
            const nextEntry = getEntryForCell(cell.key, "across");
            if (nextEntry) {
                setActiveEntryId(nextEntry.id);
                moveWithinEntry(nextEntry, cell.key, 1);
            }
            return;
        }

        if (event.key === "ArrowLeft") {
            event.preventDefault();
            const nextEntry = getEntryForCell(cell.key, "across");
            if (nextEntry) {
                setActiveEntryId(nextEntry.id);
                moveWithinEntry(nextEntry, cell.key, -1);
            }
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();
            const nextEntry = getEntryForCell(cell.key, "down");
            if (nextEntry) {
                setActiveEntryId(nextEntry.id);
                moveWithinEntry(nextEntry, cell.key, 1);
            }
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            const nextEntry = getEntryForCell(cell.key, "down");
            if (nextEntry) {
                setActiveEntryId(nextEntry.id);
                moveWithinEntry(nextEntry, cell.key, -1);
            }
        }
    }

    return (
        <div className="overflow-hidden rounded-[2.2rem] border border-primary/12 bg-[linear-gradient(160deg,#fffdf8_0%,#f4efe6_100%)] p-6 shadow-[0_24px_80px_rgba(20,42,68,0.10)] md:p-8">
            <div className="flex flex-col gap-6 border-b border-primary/8 pb-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Mini Crossword</p>
                    <h2 className="mt-4 font-heading text-4xl text-primary md:text-5xl">{CROSSWORD_PUZZLE.title}</h2>
                    <p className="mt-4 max-w-3xl leading-relaxed text-text-secondary">{CROSSWORD_PUZZLE.subtitle}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.2rem] border border-primary/10 bg-white/90 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Filled</p>
                        <p className="mt-2 text-lg text-primary">{fillCount} / {totalFillableCells}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-primary/10 bg-white/90 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Correct</p>
                        <p className="mt-2 text-lg text-primary">{solvedCellCount} / {totalFillableCells}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-primary/10 bg-white/90 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Projected Score</p>
                        <p className="mt-2 text-lg text-primary">{score}</p>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <button
                    type="button"
                    onClick={handleCheckBoard}
                    className="rounded-full border border-primary/12 bg-white px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
                >
                    Check board
                </button>
                <button
                    type="button"
                    onClick={handleRevealEntry}
                    disabled={!activeEntry || isSolved}
                    className="rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary transition-colors duration-200 hover:bg-accent/20 disabled:cursor-not-allowed disabled:opacity-45"
                >
                    Reveal clue
                </button>
                <button
                    type="button"
                    onClick={handleClearEntry}
                    disabled={!activeEntry}
                    className="rounded-full border border-primary/12 bg-white px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary transition-colors duration-200 hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                >
                    Clear clue
                </button>
                <button
                    type="button"
                    onClick={handleResetPuzzle}
                    className="rounded-full border border-secondary/18 bg-secondary/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-secondary transition-colors duration-200 hover:bg-secondary hover:text-white"
                >
                    Reset puzzle
                </button>
            </div>

            <div className="mt-5 rounded-[1.3rem] border border-primary/8 bg-white/85 px-4 py-4 text-sm text-text-secondary">
                {notice}
            </div>

            <div className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.9rem] border border-primary/10 bg-[linear-gradient(155deg,#173756_0%,#214467_100%)] p-5 text-white shadow-[0_18px_48px_rgba(20,42,68,0.14)]">
                    <div className="mb-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-white/62">Board</p>
                            <p className="mt-2 text-sm text-white/76">Tap a crossing square twice to switch direction.</p>
                        </div>
                        {activeEntry ? (
                            <div className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/85">
                                {activeEntry.number} {activeEntry.direction}
                            </div>
                        ) : null}
                    </div>

                    <div
                        className="grid gap-1.5"
                        style={{ gridTemplateColumns: `repeat(${CROSSWORD_PUZZLE.cols}, minmax(0, 1fr))` }}
                    >
                        {CROSSWORD_PUZZLE.cells.map((cell) => {
                            if (!cell.answer) {
                                return <div key={cell.key} className="aspect-square rounded-[0.72rem] bg-[#0f2033]" />;
                            }

                            const isActive = activeCells.includes(cell.key);
                            const isCurrentDirection = activeEntry?.cells.includes(cell.key);
                            const isIncorrect = incorrectKeys.includes(cell.key);

                            return (
                                <label
                                    key={cell.key}
                                    className={`relative flex aspect-square items-stretch overflow-hidden rounded-[0.82rem] border ${
                                        isIncorrect
                                            ? "border-secondary bg-secondary/15"
                                            : isActive
                                                ? "border-accent bg-white"
                                                : isCurrentDirection
                                                    ? "border-white/30 bg-white/92"
                                                    : "border-white/16 bg-white/82"
                                    } transition-colors`}
                                >
                                    {cell.number ? (
                                        <span className="pointer-events-none absolute left-1.5 top-1 text-[10px] font-medium text-primary/70">
                                            {cell.number}
                                        </span>
                                    ) : null}
                                    <input
                                        ref={(element) => {
                                            inputRefs.current[cell.key] = element;
                                        }}
                                        value={letters[cell.key] ?? ""}
                                        onChange={(event) => updateCell(cell.key, event.target.value)}
                                        onFocus={() => {
                                            const entry = getEntryForCell(cell.key, activeEntry?.direction);
                                            if (entry) setActiveEntryId(entry.id);
                                        }}
                                        onClick={() => handleCellClick(cell)}
                                        onKeyDown={(event) => handleInputKeyDown(event, cell)}
                                        maxLength={1}
                                        inputMode="text"
                                        autoCapitalize="characters"
                                        aria-label={`Crossword cell ${cell.row + 1}, ${cell.col + 1}`}
                                        disabled={isSolved}
                                        className="h-full w-full bg-transparent px-0 pb-0 pt-3 text-center text-lg font-semibold uppercase tracking-[0.08em] text-primary outline-none md:text-xl"
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-[1.9rem] border border-primary/10 bg-white p-6 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Active clue</p>
                        <h3 className="mt-3 font-heading text-3xl text-primary">
                            {activeEntry ? `${activeEntry.number} ${activeEntry.direction}` : "Select a clue"}
                        </h3>
                        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                            {activeEntry?.clue ?? "Choose an across or down clue to focus the board."}
                        </p>
                        {activeEntry ? (
                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="rounded-full border border-primary/10 bg-[#fbf8f3] px-3 py-1 text-xs uppercase tracking-[0.22em] text-primary">
                                    {activeEntry.answer.length} letters
                                </span>
                                <span className="rounded-full border border-primary/10 bg-[#fbf8f3] px-3 py-1 text-xs uppercase tracking-[0.22em] text-primary">
                                    {revealedEntryIds.includes(activeEntry.id) ? "Revealed" : "Hidden"}
                                </span>
                            </div>
                        ) : null}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-[1.9rem] border border-primary/10 bg-white p-6 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                            <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Across</p>
                            <div className="mt-5 space-y-3">
                                {CROSSWORD_PUZZLE.across.map((entry) => (
                                    <button
                                        key={entry.id}
                                        type="button"
                                        onClick={() => selectEntry(entry)}
                                        className={`w-full rounded-[1.2rem] border px-4 py-4 text-left transition-colors ${
                                            activeEntryId === entry.id
                                                ? "border-primary bg-primary text-white"
                                                : "border-primary/10 bg-[#fbf8f3] text-primary hover:border-primary/30"
                                        }`}
                                    >
                                        <p className="text-xs uppercase tracking-[0.22em] opacity-75">{entry.number}</p>
                                        <p className="mt-2 text-sm leading-relaxed">{entry.clue}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[1.9rem] border border-primary/10 bg-white p-6 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                            <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Down</p>
                            <div className="mt-5 space-y-3">
                                {CROSSWORD_PUZZLE.down.map((entry) => (
                                    <button
                                        key={entry.id}
                                        type="button"
                                        onClick={() => selectEntry(entry)}
                                        className={`w-full rounded-[1.2rem] border px-4 py-4 text-left transition-colors ${
                                            activeEntryId === entry.id
                                                ? "border-primary bg-primary text-white"
                                                : "border-primary/10 bg-[#fbf8f3] text-primary hover:border-primary/30"
                                        }`}
                                    >
                                        <p className="text-xs uppercase tracking-[0.22em] opacity-75">{entry.number}</p>
                                        <p className="mt-2 text-sm leading-relaxed">{entry.clue}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {isSolved ? (
                        scoreSubmitted ? (
                            <div className="rounded-[1.85rem] border border-emerald-200/70 bg-[linear-gradient(160deg,#f2faf5_0%,#e8f5ed_100%)] p-6 shadow-[0_12px_34px_rgba(20,42,68,0.06)]">
                                <p className="text-sm uppercase tracking-[0.3em] text-emerald-700">Crossword Complete</p>
                                <p className="mt-3 text-text-secondary">
                                    Your score is locked in. You can still revisit the board from this browser.
                                </p>
                            </div>
                        ) : (
                            <ScoreSubmissionForm
                                game="crossword"
                                score={score}
                                maxScore={100}
                                attempts={checksUsed + revealedEntryIds.length}
                                solved={true}
                                puzzleKey={CROSSWORD_PUZZLE_KEY}
                                metadata={metadata}
                                buttonLabel="Submit Crossword Score"
                                successMessage="Crossword score submitted."
                                onSubmitted={() => setScoreSubmitted(true)}
                            />
                        )
                    ) : null}
                </div>
            </div>
        </div>
    );
}
