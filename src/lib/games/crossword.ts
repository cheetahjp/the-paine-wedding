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

export type BuiltCrossword = Omit<CrosswordPuzzle, "entries"> & {
    cells: CrosswordCell[];
    entries: CrosswordNumberedEntry[];
    across: CrosswordNumberedEntry[];
    down: CrosswordNumberedEntry[];
};

export type CrosswordMetadata = {
    duration_seconds: number;
    checks_used: number;
    reveals_used: number;
    completed_at: string;
};

// ---------------------------------------------------------------------------
// Grid template
//
// 5 rows × 7 cols. Active cells only (letters).
// ACROSS: A1 = row 0, cols 1–5 | A2 = row 2, cols 1–5 | A3 = row 4, cols 1–5
// DOWN:   D1 = col 1, rows 0–4 | D2 = col 3, rows 0–4 | D3 = col 5, rows 0–4
//
// Intersection constraints (must match):
//   D1[0]=A1[0]  D2[0]=A1[2]  D3[0]=A1[4]
//   D1[2]=A2[0]  D2[2]=A2[2]  D3[2]=A2[4]
//   D1[4]=A3[0]  D2[4]=A3[2]  D3[4]=A3[4]
// ---------------------------------------------------------------------------

type RawPuzzleData = {
    id: string;
    a1: string; clue_a1: string;
    a2: string; clue_a2: string;
    a3: string; clue_a3: string;
    d1: string; clue_d1: string;
    d2: string; clue_d2: string;
    d3: string; clue_d3: string;
};

function buildPuzzle(raw: RawPuzzleData): CrosswordPuzzle {
    const a1 = raw.a1.toUpperCase();
    const a2 = raw.a2.toUpperCase();
    const a3 = raw.a3.toUpperCase();
    const d1 = raw.d1.toUpperCase();
    const d2 = raw.d2.toUpperCase();
    const d3 = raw.d3.toUpperCase();

    // Verify intersections
    const checks: [string, string, string][] = [
        [d1[0], a1[0], `d1[0]=a1[0] in puzzle ${raw.id}`],
        [d2[0], a1[2], `d2[0]=a1[2] in puzzle ${raw.id}`],
        [d3[0], a1[4], `d3[0]=a1[4] in puzzle ${raw.id}`],
        [d1[2], a2[0], `d1[2]=a2[0] in puzzle ${raw.id}`],
        [d2[2], a2[2], `d2[2]=a2[2] in puzzle ${raw.id}`],
        [d3[2], a2[4], `d3[2]=a2[4] in puzzle ${raw.id}`],
        [d1[4], a3[0], `d1[4]=a3[0] in puzzle ${raw.id}`],
        [d2[4], a3[2], `d2[4]=a3[2] in puzzle ${raw.id}`],
        [d3[4], a3[4], `d3[4]=a3[4] in puzzle ${raw.id}`],
    ];
    for (const [x, y, label] of checks) {
        if (x !== y) throw new Error(`Crossword intersection mismatch: ${label} (${x} ≠ ${y})`);
    }

    return {
        id: raw.id,
        title: "Ashlyn & Jeffrey Mini Crossword",
        subtitle: "Fill in the blanks — all answers are drawn from their story, their words, and their world.",
        rows: 5,
        cols: 7,
        entries: [
            { id: "a1", answer: a1, clue: raw.clue_a1, direction: "across", row: 0, col: 1 },
            { id: "a2", answer: a2, clue: raw.clue_a2, direction: "across", row: 2, col: 1 },
            { id: "a3", answer: a3, clue: raw.clue_a3, direction: "across", row: 4, col: 1 },
            { id: "d1", answer: d1, clue: raw.clue_d1, direction: "down",   row: 0, col: 1 },
            { id: "d2", answer: d2, clue: raw.clue_d2, direction: "down",   row: 0, col: 3 },
            { id: "d3", answer: d3, clue: raw.clue_d3, direction: "down",   row: 0, col: 5 },
        ],
    };
}

// ---------------------------------------------------------------------------
// 30-puzzle pool
// All word sets verified: each intersection letter matches.
// ---------------------------------------------------------------------------

const RAW_PUZZLES: RawPuzzleData[] = [
    // ACROSS: amber/ocean/roses  |  DOWN: amour/bless/rings
    {
        id: "p01",
        a1: "amber", clue_a1: "Warm golden hue woven through the wedding palette",
        a2: "ocean", clue_a2: "What long distance can feel like — vast, but crossable",
        a3: "roses", clue_a3: "Classic bloom in Ashlyn's bouquet",
        d1: "amour", clue_d1: "French for what they found at A&M Commerce",
        d2: "bless", clue_d2: "What vows do for a marriage",
        d3: "rings", clue_d3: "Exchanged September 26, 2026",
    },
    // ACROSS: baker/ocean/match  |  DOWN: bloom/knelt/ranch
    {
        id: "p02",
        a1: "baker", clue_a1: "Ashlyn's signature Sunday morning role",
        a2: "ocean", clue_a2: "The scale of what they missed during the years apart",
        a3: "match", clue_a3: "What everyone said they were — from the beginning",
        d1: "bloom", clue_d1: "What the ceremony florals do, what their love did in 2024",
        d2: "knelt", clue_d2: "What Jeffrey did on the Arbor Hills path with ring in hand",
        d3: "ranch", clue_d3: "The style of Davis & Grey Farms — rustic, wide, Texan",
    },
    // ACROSS: cedar/amity/theme  |  DOWN: coast/drive/rhyme
    {
        id: "p03",
        a1: "cedar", clue_a1: "Fragrant wood in the barn beams at Davis & Grey Farms",
        a2: "amity", clue_a2: "Warm friendship that grew into something more",
        a3: "theme", clue_a3: "Autumn warmth and rustic elegance — the evening's aesthetic",
        d1: "coast", clue_d1: "What they did through the hard years — kept moving forward",
        d2: "drive", clue_d2: "Jeffrey's 4.5-hour commitment to their Houston reunion date",
        d3: "rhyme", clue_d3: "Their story — it all rhymes in the end",
    },
    // ACROSS: cedar/ocean/roses  |  DOWN: choir/dress/rings
    {
        id: "p04",
        a1: "cedar", clue_a1: "Warm wood scent of the farm on the wedding evening",
        a2: "ocean", clue_a2: "Distance that separated them — and couldn't stop them",
        a3: "roses", clue_a3: "Blooms carried down the aisle at Davis & Grey Farms",
        d1: "choir", clue_d1: "Voices lifted together in the ceremony",
        d2: "dress", clue_d2: "What Ashlyn spent months perfecting — and it was worth it",
        d3: "rings", clue_d3: "Two circles. One commitment. Forever.",
    },
    // ACROSS: charm/ember/march  |  DOWN: cream/amber/mirth
    {
        id: "p05",
        a1: "charm", clue_a1: "What Jeffrey brought to that ice cream social in 2021",
        a2: "ember", clue_a2: "What remained of their connection through three quiet years",
        a3: "march", clue_a3: "The pace of a processional — steady, intentional, beautiful",
        d1: "cream", clue_d1: "The warm tones threading through their floral palette",
        d2: "amber", clue_d2: "Golden hue of late-afternoon Texas light",
        d3: "mirth", clue_d3: "The laughter that fills every room they enter together",
    },
    // ACROSS: charm/ember/marry  |  DOWN: cream/amber/merry
    {
        id: "p06",
        a1: "charm", clue_a1: "Jeffrey's secret weapon at the A&M ice cream social",
        a2: "ember", clue_a2: "The low glow of a love that never fully went dark",
        a3: "marry", clue_a3: "What they finally, officially, joyfully did",
        d1: "cream", clue_d1: "The color of the linens at the reception tables",
        d2: "amber", clue_d2: "Warm honey-gold of sunset at Davis & Grey Farms",
        d3: "merry", clue_d3: "The mood — all night, all year, for the rest of it",
    },
    // ACROSS: choir/amity/theme  |  DOWN: coast/olive/rhyme
    {
        id: "p07",
        a1: "choir", clue_a1: "Voices lifted together in the ceremony",
        a2: "amity", clue_a2: "The friendship at the root of everything they built",
        a3: "theme", clue_a3: "The one running through their whole story: found, lost, found",
        d1: "coast", clue_d1: "What they did when apart — kept drifting toward each other",
        d2: "olive", clue_d2: "Branch of peace, carried into the new chapter",
        d3: "rhyme", clue_d3: "Their story has one — it all comes around",
    },
    // ACROSS: dates/image/knelt  |  DOWN: drink/trace/scent
    {
        id: "p08",
        a1: "dates", clue_a1: "Sonic drives, Houston dinners, Arbor Hills walks — all of these",
        a2: "image", clue_a2: "The photo from the A&M game: 100,000 people, five rows apart",
        a3: "knelt", clue_a3: "How Jeffrey proposed — on one knee at Arbor Hills",
        d1: "drink", clue_d1: "Raised at the reception — a toast to Ashlyn and Jeffrey",
        d2: "trace", clue_d2: "What remained between them through the years of distance",
        d3: "scent", clue_d3: "Cedar and wildflowers — the smell of the farm on wedding night",
    },
    // ACROSS: faith/clean/salty  |  DOWN: focus/ideal/honey
    {
        id: "p09",
        a1: "faith", clue_a1: "The anchor of their lives and their ceremony",
        a2: "clean", clue_a2: "The fresh start they gave each other in October 2024",
        a3: "salty", clue_a3: "The Texas Gulf Coast vibe of their early years",
        d1: "focus", clue_d1: "What Jeffrey kept on Ashlyn — even through the years apart",
        d2: "ideal", clue_d2: "What they are to each other — the vision they always had",
        d3: "honey", clue_d3: "Sweet endearment, sweeter life ahead",
    },
    // ACROSS: favor/ocean/roses  |  DOWN: flour/views/rings
    {
        id: "p10",
        a1: "favor", clue_a1: "What guests take home — a small keepsake of the day",
        a2: "ocean", clue_a2: "What three years apart can feel like — vast, but crossable",
        a3: "roses", clue_a3: "The classic bloom woven through the ceremony florals",
        d1: "flour", clue_d1: "The ingredient Ashlyn reaches for first on Sunday mornings",
        d2: "views", clue_d2: "The wide open Texas fields visible from the farm at sunset",
        d3: "rings", clue_d3: "Slipped on fingers, worn every day after",
    },
    // ACROSS: feast/cross/serve  |  DOWN: focus/amour/taste
    {
        id: "p11",
        a1: "feast", clue_a1: "The reception dinner — pasta, bread, and all the good things",
        a2: "cross", clue_a2: "The symbol at the center of their faith and their ceremony",
        a3: "serve", clue_a3: "What they committed to do for each other — in sickness and in health",
        d1: "focus", clue_d1: "The one thing Jeffrey never lost — on Ashlyn",
        d2: "amour", clue_d2: "French word for the feeling that started at A&M Commerce",
        d3: "taste", clue_d3: "What the evening had — in the décor, the food, every detail",
    },
    // ACROSS: feast/olive/rhyme  |  DOWN: flour/amity/theme
    {
        id: "p12",
        a1: "feast", clue_a1: "What the reception spread looked like — abundant and warm",
        a2: "olive", clue_a2: "Branch of peace — and an elegant garnish on the big night",
        a3: "rhyme", clue_a3: "Their story — it all rhymes: met, parted, returned",
        d1: "flour", clue_d1: "The Sunday baking staple Ashlyn keeps stocked",
        d2: "amity", clue_d2: "The friendship that began before anything else did",
        d3: "theme", clue_d3: "Rustic autumn elegance — the throughline of the evening",
    },
    // ACROSS: flair/robin/earth  |  DOWN: forge/amber/ranch
    {
        id: "p13",
        a1: "flair", clue_a1: "Ashlyn's signature quality — effortless and unmistakable",
        a2: "robin", clue_a2: "The first bird of spring — a symbol of new beginning",
        a3: "earth", clue_a3: "Down to ____ — how everyone describes them both",
        d1: "forge", clue_d1: "What the years of distance did to their bond — made it stronger",
        d2: "amber", clue_d2: "The golden color of the hour they said I do",
        d3: "ranch", clue_d3: "The Texas spread style of Davis & Grey Farms",
    },
    // ACROSS: glass/abide/scent  |  DOWN: grass/arise/sweet
    {
        id: "p14",
        a1: "glass", clue_a1: "Raised high during the toasts — full of something celebratory",
        a2: "abide", clue_a2: "To remain, to stay, to keep showing up — what they both do",
        a3: "scent", clue_a3: "Wildflowers and cedar on the night air at the farm",
        d1: "grass", clue_d1: "What the fields at Davis & Grey Farms are full of in September",
        d2: "arise", clue_d2: "What hope does after a long and quiet separation",
        d3: "sweet", clue_d3: "The flavor of every moment of September 26th",
    },
    // ACROSS: gleam/amber/earth  |  DOWN: grace/ember/march
    {
        id: "p15",
        a1: "gleam", clue_a1: "The shine of gold rings in the last light of the ceremony",
        a2: "amber", clue_a2: "Warm honey-gold — the color of the hour",
        a3: "earth", clue_a3: "What they both are: grounded, real, down to ____",
        d1: "grace", clue_d1: "Said before the meal — and modeled throughout the night",
        d2: "ember", clue_d2: "What never fully went out between the years of 2021 and 2024",
        d3: "march", clue_d3: "The steady pace of the processional",
    },
    // ACROSS: gleam/amber/north  |  DOWN: grain/ember/mirth
    {
        id: "p16",
        a1: "gleam", clue_a1: "What the rings did as they caught the golden hour light",
        a2: "amber", clue_a2: "The warm glow the farm took on as the sun went down",
        a3: "north", clue_a3: "True ____: what they are to each other",
        d1: "grain", clue_d1: "The wheat fields visible from the farm on a clear September day",
        d2: "ember", clue_d2: "The quiet warmth that never left — even in the years apart",
        d3: "mirth", clue_d3: "Pure joy and laughter — the reception's defining sound",
    },
    // ACROSS: lived/raise/cream  |  DOWN: lyric/voice/dream
    {
        id: "p17",
        a1: "lived", clue_a1: "They have truly ____ their story — not just told it",
        a2: "raise", clue_a2: "What you do with a glass when the best man speaks",
        a3: "cream", clue_a3: "The warm neutral woven through the tablecloths and florals",
        d1: "lyric", clue_d1: "The words to the first dance song that Ashlyn memorized first",
        d2: "voice", clue_d2: "What wavered, just slightly, when Jeffrey read his vows",
        d3: "dream", clue_d3: "What Ashlyn said it felt like — the whole day",
    },
    // ACROSS: loved/raise/cream  |  DOWN: lyric/voice/dream
    {
        id: "p18",
        a1: "loved", clue_a1: "What they have been, and always will be, to each other",
        a2: "raise", clue_a2: "What everyone did when the best man called the room to attention",
        a3: "cream", clue_a3: "The soft neutral threading through the florals and linens",
        d1: "lyric", clue_d1: "The first dance song has one — Ashlyn cried at the preview",
        d2: "voice", clue_d2: "Jeffrey's, when he said I do — steady, except for one breath",
        d3: "dream", clue_d3: "What the whole day felt like — and what it will always be",
    },
    // ACROSS: magic/share/cheer  |  DOWN: music/grace/clear
    {
        id: "p19",
        a1: "magic", clue_a1: "What the evening at Davis & Grey Farms genuinely had",
        a2: "share", clue_a2: "What marriage is — one long, beautiful act of ____",
        a3: "cheer", clue_a3: "The sound that rose when they were finally announced as husband and wife",
        d1: "music", clue_d1: "The soundtrack of their relationship — picked carefully",
        d2: "grace", clue_d2: "Said before the feast, embodied throughout the evening",
        d3: "clear", clue_d3: "The September sky over Celeste on the night they married",
    },
    // ACROSS: magic/shine/cheer  |  DOWN: music/guide/clear
    {
        id: "p20",
        a1: "magic", clue_a1: "The atmosphere at Davis & Grey Farms as the sun went down",
        a2: "shine", clue_a2: "What the rings did — and what Ashlyn did — and what the night did",
        a3: "cheer", clue_a3: "What erupted when they were pronounced husband and wife",
        d1: "music", clue_d1: "The first dance song: chosen carefully, danced to perfectly",
        d2: "guide", clue_d2: "What faith does — and what they've been for each other",
        d3: "clear", clue_d3: "The Texas sky above Celeste on September 26, 2026",
    },
    // ACROSS: magic/trace/honor  |  DOWN: match/grain/clear
    {
        id: "p21",
        a1: "magic", clue_a1: "What the evening had — undeniable, from start to finish",
        a2: "trace", clue_a2: "What remained between them through three years of silence",
        a3: "honor", clue_a3: "What guests did by showing up — and what the couple did for each other",
        d1: "match", clue_d1: "What everyone knew they were, even in 2021",
        d2: "grain", clue_d2: "Texas wheat fields stretching out beyond the farm on wedding night",
        d3: "clear", clue_d3: "How the September night sky looked — and how their path finally felt",
    },
    // ACROSS: magic/trail/honor  |  DOWN: match/grain/color
    {
        id: "p22",
        a1: "magic", clue_a1: "The undeniable quality of the evening at Davis & Grey Farms",
        a2: "trail", clue_a2: "The path at Arbor Hills where Ashlyn found Jeffrey waiting",
        a3: "honor", clue_a3: "What the guests brought by coming — and what the vows declared",
        d1: "match", clue_d1: "What they are — everyone said it first, they took a while longer",
        d2: "grain", clue_d2: "The texture of the wooden beams in the farm's ceremony barn",
        d3: "color", clue_d3: "Warm autumn palette: amber, cream, cedar, rust",
    },
    // ACROSS: merit/grace/thyme  |  DOWN: might/ready/theme
    {
        id: "p23",
        a1: "merit", clue_a1: "What their love has earned — through patience, distance, return",
        a2: "grace", clue_a2: "Said before the meal — embodied in every moment after",
        a3: "thyme", clue_a3: "The herbal garnish on the charcuterie board at cocktail hour",
        d1: "might", clue_d1: "The strength it takes to drive 4.5 hours for a first date",
        d2: "ready", clue_d2: "What Jeffrey was — when he got on one knee at Arbor Hills",
        d3: "theme", clue_d3: "Rustic, warm, Texan — the aesthetic of the entire evening",
    },
    // ACROSS: might/spark/clean  |  DOWN: music/grape/token
    {
        id: "p24",
        a1: "might", clue_a1: "The quiet strength that drove Jeffrey back to Ashlyn in 2024",
        a2: "spark", clue_a2: "What ignited at that ice cream social in Commerce, 2021",
        a3: "clean", clue_a3: "The fresh slate they gave each other when they reunited",
        d1: "music", clue_d1: "The first dance song: chosen carefully, heard only once before the wedding",
        d2: "grape", clue_d2: "The wine at the reception — because this is a celebration",
        d3: "token", clue_d3: "A small gesture carrying big meaning — like a 4.5-hour drive",
    },
    // ACROSS: plant/ivory/theme  |  DOWN: point/adore/thyme
    {
        id: "p25",
        a1: "plant", clue_a1: "What Davis & Grey Farms has in abundance — and what they did their roots",
        a2: "ivory", clue_a2: "The shade of Ashlyn's gown",
        a3: "theme", clue_a3: "Rustic autumn elegance — the look and feel of the entire evening",
        d1: "point", clue_d1: "The purpose of the day — to commit, for real, in front of everyone",
        d2: "adore", clue_d2: "What Jeffrey does, every day, without reservation",
        d3: "thyme", clue_d3: "Fragrant herb tucked into the farm's centerpieces",
    },
    // ACROSS: power/ocean/dates  |  DOWN: proud/wheat/rings
    {
        id: "p26",
        a1: "power", clue_a1: "What vows carry — spoken out loud, binding, real",
        a2: "ocean", clue_a2: "What distance felt like — vast, and still crossable",
        a3: "dates", clue_a3: "Sonic drives, Houston dinners, Arbor Hills walks — all of these",
        d1: "proud", clue_d1: "How Jeffrey looked when Ashlyn appeared at the end of the aisle",
        d2: "wheat", clue_d2: "Golden fields stretching beyond the farm on the wedding evening",
        d3: "rings", clue_d3: "Two circles. One promise. September 26, 2026.",
    },
    // ACROSS: rings/amber/theme  |  DOWN: roast/noble/serve
    {
        id: "p27",
        a1: "rings", clue_a1: "Circular symbols exchanged at the altar",
        a2: "amber", clue_a2: "The golden color the farm takes on as Texas sunset settles in",
        a3: "theme", clue_a3: "Found, lost, found — the running theme of their whole story",
        d1: "roast", clue_d1: "The affectionate speech that made everyone laugh and tear up",
        d2: "noble", clue_d2: "The quality both families brought to the evening",
        d3: "serve", clue_d3: "What they pledged to do — for each other, every day",
    },
    // ACROSS: spark/image/great  |  DOWN: swing/agape/knelt
    {
        id: "p28",
        a1: "spark", clue_a1: "What started it all — Commerce, 2021, an ice cream social",
        a2: "image", clue_a2: "The photo from the A&M game: 100,000 people, five rows apart",
        a3: "great", clue_a3: "The only word for what September 26th turned out to be",
        d1: "swing", clue_d1: "What the porch at the farm has, and what they did on it after",
        d2: "agape", clue_d2: "Wide-open, unconditional love — the Greek word for what this is",
        d3: "knelt", clue_d3: "What Jeffrey did at Arbor Hills Nature Preserve with ring in hand",
    },
    // ACROSS: saint/glory/rhyme  |  DOWN: sugar/ivory/thyme
    {
        id: "p29",
        a1: "saint", clue_a1: "What patience makes of a person — Jeffrey earned the title",
        a2: "glory", clue_a2: "The radiance of a September Texas sunset over the farm",
        a3: "rhyme", clue_a3: "Their story has one — it all comes around in the end",
        d1: "sugar", clue_d1: "The sweet staple in Ashlyn's Sunday baking lineup",
        d2: "ivory", clue_d2: "The shade of Ashlyn's gown — classic, timeless, perfect",
        d3: "thyme", clue_d3: "The fragrant herb tucked into the ceremony centerpieces",
    },
    // ACROSS: waltz/rings/honey  |  DOWN: worth/linen/zesty
    {
        id: "p30",
        a1: "waltz", clue_a1: "The tempo of their first dance — slow and sweeping",
        a2: "rings", clue_a2: "Two circles. One promise. Forever.",
        a3: "honey", clue_a3: "What September tastes like when you marry your person",
        d1: "worth", clue_d1: "What every mile of the drive was — and every year of waiting",
        d2: "linen", clue_d2: "The fabric draped across every reception table",
        d3: "zesty", clue_d3: "The lemon-herb vinaigrette on the salad course — an unexpected hit",
    },
];

// ---------------------------------------------------------------------------
// Build engine
// ---------------------------------------------------------------------------

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

function buildCrossword(puzzle: CrosswordPuzzle): BuiltCrossword {
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
                throw new Error(
                    `Crossword entry "${entry.id}" conflicts at ${row},${col}: expected ${cell.answer}, got ${letter}`
                );
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
        across: numberedEntries.filter((e) => e.direction === "across"),
        down: numberedEntries.filter((e) => e.direction === "down"),
    };
}

// ---------------------------------------------------------------------------
// Daily rotation
// ---------------------------------------------------------------------------

export const PUZZLE_ROTATION_START = "2026-03-15";
const PUZZLE_POOL = RAW_PUZZLES.map((raw) => buildCrossword(buildPuzzle(raw)));

export function getDailyCrosswordPuzzle(dateKey: string): BuiltCrossword {
    const start = new Date(PUZZLE_ROTATION_START);
    const target = new Date(dateKey);
    const diffMs = target.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const index = ((diffDays % PUZZLE_POOL.length) + PUZZLE_POOL.length) % PUZZLE_POOL.length;
    return PUZZLE_POOL[index];
}

export function getCrosswordStorageKey(puzzleId: string, dateKey: string): string {
    return `wedding-crossword-state:${puzzleId}:${dateKey}`;
}

// ---------------------------------------------------------------------------
// Legacy exports (kept for compatibility while MiniCrosswordGame is updated)
// ---------------------------------------------------------------------------

export const CROSSWORD_PUZZLE = PUZZLE_POOL[0];
export const CROSSWORD_PUZZLE_KEY = CROSSWORD_PUZZLE.id;
export const CROSSWORD_STORAGE_KEY = getCrosswordStorageKey(CROSSWORD_PUZZLE.id, PUZZLE_ROTATION_START);

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

export function computeCrosswordScore(
    durationSeconds: number,
    checksUsed: number,
    revealsUsed: number
): number {
    const timePenalty = Math.floor(durationSeconds / 30);
    return Math.max(20, 100 - timePenalty - checksUsed * 4 - revealsUsed * 10);
}
