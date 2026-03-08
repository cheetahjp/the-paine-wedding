import { supabase } from "@/lib/supabase";

export type GameType = "trivia" | "painedle";

export type LeaderboardEntry = {
    id: string;
    username: string;
    score: number;
    maxScore: number | null;
    attempts: number | null;
    solved: boolean | null;
    createdAt: string;
    puzzleKey: string;
};

export type SubmitGameScoreInput = {
    game: GameType;
    email: string;
    username: string;
    score: number;
    maxScore?: number | null;
    attempts?: number | null;
    solved?: boolean | null;
    puzzleKey?: string;
    metadata?: Record<string, string | number | boolean | null>;
};

type GamePlayer = {
    id: string;
    email: string;
    username: string;
};

export const GAME_PLAYER_STORAGE_KEY = "wedding-games-player";
export const GAME_LEADERBOARD_REFRESH_EVENT = "wedding-games-leaderboard-refresh";

export function normalizeEmail(email: string) {
    return email.trim().toLowerCase();
}

export function saveStoredGamePlayer(player: { email: string; username: string }) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
        GAME_PLAYER_STORAGE_KEY,
        JSON.stringify({
            email: normalizeEmail(player.email),
            username: player.username.trim(),
        })
    );
}

export function getStoredGamePlayer() {
    if (typeof window === "undefined") return null;

    const rawValue = window.localStorage.getItem(GAME_PLAYER_STORAGE_KEY);
    if (!rawValue) return null;

    try {
        const parsed = JSON.parse(rawValue) as { email?: string; username?: string };
        if (!parsed.email || !parsed.username) return null;
        return {
            email: parsed.email,
            username: parsed.username,
        };
    } catch {
        return null;
    }
}

async function upsertGamePlayer(email: string, username: string) {
    const normalizedEmail = normalizeEmail(email);
    const trimmedUsername = username.trim();

    const { data, error } = await supabase
        .from("game_players")
        .upsert(
            {
                email: normalizedEmail,
                username: trimmedUsername,
                updated_at: new Date().toISOString(),
            },
            { onConflict: "email" }
        )
        .select("id, email, username")
        .single();

    if (error) throw error;
    return data as GamePlayer;
}

function isBetterScore(existing: {
    score: number;
    attempts: number | null;
    solved: boolean | null;
}, incoming: {
    score: number;
    attempts: number | null;
    solved: boolean | null;
}) {
    if (incoming.score !== existing.score) {
        return incoming.score > existing.score;
    }

    if (incoming.solved !== existing.solved) {
        return Boolean(incoming.solved) && !existing.solved;
    }

    const existingAttempts = existing.attempts ?? Number.MAX_SAFE_INTEGER;
    const incomingAttempts = incoming.attempts ?? Number.MAX_SAFE_INTEGER;
    return incomingAttempts < existingAttempts;
}

export async function submitGameScore(input: SubmitGameScoreInput) {
    const player = await upsertGamePlayer(input.email, input.username);
    const puzzleKey = input.puzzleKey ?? "";

    const { data: existingScore, error: existingError } = await supabase
        .from("game_scores")
        .select("id, score, attempts, solved")
        .eq("player_id", player.id)
        .eq("game", input.game)
        .eq("puzzle_key", puzzleKey)
        .maybeSingle();

    if (existingError) throw existingError;

    const scorePayload = {
        player_id: player.id,
        game: input.game,
        puzzle_key: puzzleKey,
        score: input.score,
        max_score: input.maxScore ?? null,
        attempts: input.attempts ?? null,
        solved: input.solved ?? null,
        metadata: input.metadata ?? {},
        updated_at: new Date().toISOString(),
    };

    if (existingScore) {
        const shouldUpdate = isBetterScore(existingScore, {
            score: input.score,
            attempts: input.attempts ?? null,
            solved: input.solved ?? null,
        });

        if (!shouldUpdate) {
            return { improved: false };
        }

        const { error } = await supabase
            .from("game_scores")
            .update(scorePayload)
            .eq("id", existingScore.id);

        if (error) throw error;
        return { improved: true };
    }

    const { error } = await supabase.from("game_scores").insert(scorePayload);
    if (error) throw error;
    return { improved: true };
}

export async function fetchLeaderboard(game: GameType, options?: { limit?: number; puzzleKey?: string }) {
    const limit = options?.limit ?? 10;
    let query = supabase
        .from("game_scores")
        .select("id, score, max_score, attempts, solved, created_at, puzzle_key, game_players!inner(username)")
        .eq("game", game)
        .order("score", { ascending: false })
        .order("attempts", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true })
        .limit(limit);

    if (options?.puzzleKey !== undefined) {
        query = query.eq("puzzle_key", options.puzzleKey);
    }

    const { data, error } = await query;
    if (error) throw error;

    type RawLeaderboardRow = {
        id: string;
        score: number;
        max_score: number | null;
        attempts: number | null;
        solved: boolean | null;
        created_at: string;
        puzzle_key: string;
        game_players: { username: string } | Array<{ username: string }> | null;
    };

    return ((data ?? []) as RawLeaderboardRow[]).map((entry) => ({
        id: entry.id,
        username: Array.isArray(entry.game_players)
            ? entry.game_players[0]?.username ?? "Guest"
            : entry.game_players?.username ?? "Guest",
        score: entry.score,
        maxScore: entry.max_score,
        attempts: entry.attempts,
        solved: entry.solved,
        createdAt: entry.created_at,
        puzzleKey: entry.puzzle_key,
    })) as LeaderboardEntry[];
}
