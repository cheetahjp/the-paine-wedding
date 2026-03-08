const PAINEDLE_WORD_LIST = [
    // 4 letters
    "vows", "veil", "kiss", "ring", "rose", "cake", "date", "pair", "gown", "band",
    "love", "lace", "moon", "star", "song", "poem", "bond", "glow", "dear", "ruby",
    "gold", "navy", "sage", "mint", "silk", "note", "card", "gift", "wish", "join",
    "ever", "held", "eyes", "hand", "dusk", "dawn", "walk", "path", "home", "fire",
    "warm", "kind", "calm", "hope", "true", "blue", "tied", "bell", "tune", "vase",
    "arch", "seat", "stay", "road", "opal", "jade", "zest", "glee", "glad", "clad",
    "beau", "vibe", "glam", "host", "west", "east", "drum", "snap", "swan", "pine",

    // 5 letters
    "lucky", "honey", "bride", "bloom", "dance", "dress", "faith", "guest", "party", "smile",
    "story", "toast", "union", "venue", "altar", "waltz", "roses", "petal", "peony", "choir",
    "adore", "charm", "grace", "heart", "dream", "bliss", "sweet", "unity", "share", "cheer",
    "clink", "spark", "first", "crown", "flute", "table", "chair", "candy", "frost", "layer",
    "slice", "cream", "sugar", "spice", "favor", "photo", "frame", "grins", "laugh", "blush",
    "berry", "linen", "texas", "amour", "flair", "shine", "music", "ranch", "bells", "hills",
    "river", "cedar", "maple", "hotel", "house", "lover", "mercy", "twirl", "piano", "lyric",
    "cider", "peach", "lemon", "coral", "ivory", "pearl", "plaid", "gleam", "scope", "bring",

    // 6 letters
    "ashlyn", "bridal", "dallas", "family", "flower", "photos", "prayer", "dinner", "camera", "romance",
    "toasts", "garden", "candle", "golden", "silver", "church", "chapel", "sunset", "melody", "violin",
    "guitar", "tender", "adored", "always", "lovely", "dearly", "future", "petals", "blooms", "orchid",
    "sprigs", "summer", "autumn", "spring", "winter", "ribbon", "vendor", "couple", "secret", "travel",
    "flight", "ticket", "brunch", "cookie", "memory", "velvet", "tuxedo", "jewels", "friend", "ballad",
    "sweets", "goblet", "powder", "rental", "stream", "plains", "pastel", "gilded", "favors", "mingle",
    "brides", "grooms", "prince", "merlot", "sonnet", "estate", "county", "meadow", "rustic", "escort",
    "rising", "sacred", "admire", "affair", "loving", "honest", "drapes", "custom", "beauty", "bright",

    // 7 letters
    "celeste", "diamond", "forever", "promise", "sparkle", "jeffrey", "wedding", "bouquet", "lantern", "starlit",
    "cherish", "darling", "blossom", "evening", "picture", "passage", "journey", "destiny", "morning", "sunrise",
    "moonlit", "counsel", "banquet", "dessert", "letters", "candles", "soulful", "firefly", "skyline", "prairie",
    "emerald", "rosette", "vintage", "special", "rejoice", "comfort", "glimmer", "happily", "tonight", "shimmer",
    "support", "kindred", "devoted", "hosting", "seating", "service", "buttery", "farmers", "orchids", "fiancee",
    "engaged", "ringing", "dearest", "passion", "warmest", "beloved", "fashion", "gathers", "nuptial", "sparkly",
    "western", "pasture", "harvest", "whisper", "daytime", "country", "sunbeam", "catered", "playful", "driving",
    "trellis", "airmail", "memento", "posters", "glowing", "reunion", "gallant", "bridled", "glisten", "sparked",
] as const;

const uniqueWordCount = new Set(PAINEDLE_WORD_LIST).size;

if (uniqueWordCount !== PAINEDLE_WORD_LIST.length) {
    throw new Error("PAINEDLE_WORD_LIST contains duplicate entries.");
}

if (PAINEDLE_WORD_LIST.length < 200) {
    throw new Error("PAINEDLE_WORD_LIST must contain at least 200 words.");
}

export const PAINEDLE_WORDS = PAINEDLE_WORD_LIST;
