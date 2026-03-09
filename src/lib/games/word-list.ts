// 5-letter wedding words only — ordered to keep the most recognisable ones up front.
const PAINEDLE_WORD_LIST = [
    "lucky", "honey", "bride", "bloom", "dance", "dress", "faith", "guest", "party", "smile",
    "story", "toast", "union", "venue", "altar", "waltz", "roses", "petal", "peony", "choir",
    "adore", "charm", "grace", "heart", "dream", "bliss", "sweet", "unity", "share", "cheer",
    "clink", "spark", "first", "crown", "flute", "table", "chair", "candy", "frost", "layer",
    "slice", "cream", "sugar", "spice", "favor", "photo", "frame", "grins", "laugh", "blush",
    "berry", "linen", "texas", "amour", "flair", "shine", "music", "ranch", "bells", "hills",
    "river", "cedar", "maple", "hotel", "house", "lover", "mercy", "twirl", "piano", "lyric",
    "cider", "peach", "lemon", "coral", "ivory", "pearl", "plaid", "gleam", "scope", "bring",
] as const;

const uniqueWordCount = new Set(PAINEDLE_WORD_LIST).size;

if (uniqueWordCount !== PAINEDLE_WORD_LIST.length) {
    throw new Error("PAINEDLE_WORD_LIST contains duplicate entries.");
}

if (PAINEDLE_WORD_LIST.length < 50) {
    throw new Error("PAINEDLE_WORD_LIST must contain at least 50 words.");
}

export const PAINEDLE_WORDS = PAINEDLE_WORD_LIST;
