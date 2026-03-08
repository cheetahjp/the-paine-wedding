import { PAINEDLE_WORDS } from "@/lib/games/word-list";

export const MAX_GUESSES = 6;
export const MIN_WORD_LENGTH = 4;
export const MAX_WORD_LENGTH = 7;
export const KEYBOARD_ROWS = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACK"],
] as const;

export type LetterStatus = "correct" | "present" | "absent";

export function getTodayKey(date = new Date()) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function getStorageKey(dateKey: string) {
    return `painedle:${dateKey}`;
}

function hashDateKey(dateKey: string) {
    return dateKey.split("").reduce((total, char, index) => total + char.charCodeAt(0) * (index + 17), 0);
}

export function getDailyWord(dateKey: string) {
    return PAINEDLE_WORDS[hashDateKey(dateKey) % PAINEDLE_WORDS.length];
}

export function getWordLengthForPuzzle(dateKey: string) {
    return getDailyWord(dateKey).length;
}

export function isSupportedGuessLength(length: number) {
    return length >= MIN_WORD_LENGTH && length <= MAX_WORD_LENGTH;
}

export function evaluateGuess(guess: string, solution: string) {
    const statuses: LetterStatus[] = Array.from({ length: solution.length }, () => "absent");
    const solutionLetters = solution.split("");
    const guessLetters = guess.split("");

    guessLetters.forEach((letter, index) => {
        if (letter === solutionLetters[index]) {
            statuses[index] = "correct";
            solutionLetters[index] = "*";
            guessLetters[index] = "_";
        }
    });

    guessLetters.forEach((letter, index) => {
        if (letter === "_") return;

        const solutionIndex = solutionLetters.indexOf(letter);
        if (solutionIndex !== -1) {
            statuses[index] = "present";
            solutionLetters[solutionIndex] = "*";
        }
    });

    return statuses;
}

export function getWordStatusMap(guesses: string[], solution: string) {
    const statusMap: Record<string, LetterStatus | undefined> = {};
    const priority: Record<LetterStatus, number> = {
        absent: 0,
        present: 1,
        correct: 2,
    };

    guesses.forEach((guess) => {
        evaluateGuess(guess, solution).forEach((status, index) => {
            const letter = guess[index];
            const current = statusMap[letter];

            if (!current || priority[status] > priority[current]) {
                statusMap[letter] = status;
            }
        });
    });

    return statusMap;
}
