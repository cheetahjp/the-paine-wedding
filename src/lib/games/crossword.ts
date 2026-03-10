export type CrosswordDirection = "across" | "down";

export type CrosswordEntry = {
    id: string;
    answer: string;
    clue: string;
    direction: CrosswordDirection;
    row: number;
    col: number;
};

export type CrosswordCell = {
    row: number;
    col: number;
    key: string;
    answer: string | null;
    number: number | null;
    entryIds: string[];
};

export type CrosswordNumberedEntry = CrosswordEntry & {
    number: number;
    cells: string[];
};

export type CrosswordPuzzle = {
    id: string;
    title: string;
    subtitle: string;
    rows: number;
    cols: number;
    entries: CrosswordEntry[];
};

const RAW_CROSSWORD_PUZZLE: CrosswordPuzzle = {
    id: "ashlyn-jeffrey-mini-crossword-2026",
    title: "Ashlyn & Jeffrey Mini Crossword",
    subtitle: "Fill in the blanks with details from their story, their proposal, and the wedding weekend.",
    rows: 12,
    cols: 10,
    entries: [
        {
            id: "galveston",
            answer: "GALVESTON",
            clue: "Ashlyn finally said yes to another date in 2024 at ____ Bay Brewing.",
            direction: "across",
            row: 6,
            col: 0,
        },
        {
            id: "commerce",
            answer: "COMMERCE",
            clue: "They first met at Texas A&M University-____.",
            direction: "down",
            row: 2,
            col: 4,
        },
        {
            id: "jeffrey",
            answer: "JEFFREY",
            clue: "Ashlyn's groom is ____.",
            direction: "across",
            row: 9,
            col: 3,
        },
        {
            id: "houston",
            answer: "HOUSTON",
            clue: "Jeffrey drove four and a half hours to take Ashlyn on a date in ____.",
            direction: "down",
            row: 0,
            col: 8,
        },
        {
            id: "celeste",
            answer: "CELESTE",
            clue: "The wedding city is ____, Texas.",
            direction: "down",
            row: 1,
            col: 6,
        },
        {
            id: "ashlyn",
            answer: "ASHLYN",
            clue: "Jeffrey's bride is ____.",
            direction: "down",
            row: 6,
            col: 1,
        },
        {
            id: "sonic",
            answer: "SONIC",
            clue: "Their first official date included a trip to ____.",
            direction: "across",
            row: 2,
            col: 0,
        },
        {
            id: "vines",
            answer: "VINES",
            clue: "After the proposal, they had dinner at 60 ____.",
            direction: "down",
            row: 0,
            col: 2,
        },
    ],
};

function createEmptyCells(rows: number, cols: number) {
    return Array.from({ length: rows }, (_, row) =>
        Array.from({ length: cols }, (_, col) => ({
            row,
            col,
            key: `${row}:${col}`,
            answer: null as string | null,
            number: null as number | null,
            entryIds: [] as string[],
        }))
    );
}

function buildCrossword(puzzle: CrosswordPuzzle) {
    const grid = createEmptyCells(puzzle.rows, puzzle.cols);
    const startNumbers = new Map<string, number>();
    let nextNumber = 1;

    for (const entry of puzzle.entries) {
        const isAcross = entry.direction === "across";
        const startKey = `${entry.row}:${entry.col}`;

        if (!startNumbers.has(startKey)) {
            startNumbers.set(startKey, nextNumber);
            grid[entry.row][entry.col].number = nextNumber;
            nextNumber += 1;
        } else {
            grid[entry.row][entry.col].number = startNumbers.get(startKey) ?? null;
        }

        entry.answer.split("").forEach((letter, index) => {
            const row = entry.row + (isAcross ? 0 : index);
            const col = entry.col + (isAcross ? index : 0);
            const cell = grid[row]?.[col];

            if (!cell) {
                throw new Error(`Crossword entry "${entry.id}" falls outside the grid.`);
            }

            if (cell.answer && cell.answer !== letter) {
                throw new Error(`Crossword entry "${entry.id}" conflicts at ${row},${col}.`);
            }

            cell.answer = letter;
            cell.entryIds.push(entry.id);
        });
    }

    const numberedEntries: CrosswordNumberedEntry[] = puzzle.entries
        .map((entry) => ({
            ...entry,
            number: startNumbers.get(`${entry.row}:${entry.col}`) ?? 0,
            cells: entry.answer.split("").map((_, index) => {
                const row = entry.row + (entry.direction === "across" ? 0 : index);
                const col = entry.col + (entry.direction === "across" ? index : 0);
                return `${row}:${col}`;
            }),
        }))
        .sort((a, b) => a.number - b.number || a.direction.localeCompare(b.direction));

    return {
        ...puzzle,
        cells: grid.flat(),
        entries: numberedEntries,
        across: numberedEntries.filter((entry) => entry.direction === "across"),
        down: numberedEntries.filter((entry) => entry.direction === "down"),
    };
}

export const CROSSWORD_PUZZLE = buildCrossword(RAW_CROSSWORD_PUZZLE);
export const CROSSWORD_PUZZLE_KEY = CROSSWORD_PUZZLE.id;
export const CROSSWORD_STORAGE_KEY = `wedding-crossword-state:${CROSSWORD_PUZZLE_KEY}`;

export type CrosswordMetadata = {
    duration_seconds: number;
    checks_used: number;
    reveals_used: number;
    completed_at: string;
};

export function computeCrosswordScore(durationSeconds: number, checksUsed: number, revealsUsed: number) {
    const timePenalty = Math.floor(durationSeconds / 30);
    return Math.max(20, 100 - timePenalty - checksUsed * 4 - revealsUsed * 10);
}
