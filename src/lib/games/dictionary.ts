import "server-only";

import fs from "node:fs";
import wordListPath from "word-list";
import { PAINEDLE_WORDS } from "@/lib/games/word-list";
import { MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "@/lib/games/painedle";

let cachedDictionary: Set<string> | null = null;

function normalizeDictionaryWord(value: string) {
    return value.trim().toLowerCase();
}

function isDictionaryWord(value: string) {
    return /^[a-z]+$/.test(value) && value.length >= MIN_WORD_LENGTH && value.length <= MAX_WORD_LENGTH;
}

function loadDictionary() {
    if (cachedDictionary) {
        return cachedDictionary;
    }

    const words = new Set<string>();
    const dictionaryPaths = [wordListPath, "/usr/share/dict/words"];

    dictionaryPaths.forEach((dictionaryPath) => {
        if (!fs.existsSync(dictionaryPath)) {
            return;
        }

        const rawDictionary = fs.readFileSync(dictionaryPath, "utf8");
        rawDictionary.split("\n").forEach((word) => {
            const normalized = normalizeDictionaryWord(word);
            if (isDictionaryWord(normalized)) {
                words.add(normalized);
            }
        });
    });

    PAINEDLE_WORDS.forEach((word) => {
        words.add(word);
    });

    cachedDictionary = words;
    return words;
}

export function isValidDictionaryGuess(guess: string) {
    const normalizedGuess = normalizeDictionaryWord(guess);

    if (!isDictionaryWord(normalizedGuess)) {
        return false;
    }

    return loadDictionary().has(normalizedGuess);
}
