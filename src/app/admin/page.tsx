"use client";

import React, { useState } from "react";
import Section from "@/components/ui/Section";
import { supabase } from "@/lib/supabase";
import { getTodayKey } from "@/lib/games/painedle";

type Guest = {
    id: string;
    first_name: string;
    last_name: string;
    suffix: string | null;
    nicknames: string | null;
    attending: boolean | null;
    meal_choice: string | null;
    food_allergies: string | null;
    song_request: string | null;
    advice: string | null;
    households: {
        name: string;
    };
};

type GameScore = {
    id: string;
    game: "trivia" | "painedle";
    puzzle_key: string;
    score: number;
    max_score: number | null;
    attempts: number | null;
    solved: boolean | null;
    created_at: string;
    game_players: {
        username: string;
        email: string;
    } | {
        username: string;
        email: string;
    }[];
};

export default function AdminDashboard() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [importText, setImportText] = useState("");
    const [importing, setImporting] = useState(false);
    const [importMessage, setImportMessage] = useState("");
    const [envError, setEnvError] = useState(false);
    const [gameScores, setGameScores] = useState<GameScore[]>([]);
    const [gameScoresError, setGameScoresError] = useState<string | null>(null);

    // Auth state
    const [passwordInput, setPasswordInput] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [adminLogs, setAdminLogs] = useState<
        { id: string; password_used: string; created_at: string }[]
    >([]);
    const [authLoading, setAuthLoading] = useState(false);

    // Active tab in the data section
    const [activeTab, setActiveTab] = useState<"guests" | "extras" | "games">("guests");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setAuthLoading(true);

        try {
            const res = await fetch("/api/admin/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: passwordInput }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Invalid password.");
                setAuthLoading(false);
                return;
            }

            const role: string = data.role;
            setUserRole(role);
            setIsAuthenticated(true);
            fetchData();

            // Log the login attempt asynchronously
            supabase
                .from("admin_logs")
                .insert({ password_used: role })
                .then(({ error }) => {
                    if (error)
                        console.error("Could not log login attempt. Ensure admin_logs table exists.");
                });

            if (role === "Master") {
                const { data: logs } = await supabase
                    .from("admin_logs")
                    .select("*")
                    .order("created_at", { ascending: false });
                if (logs) setAdminLogs(logs);
            }
        } catch {
            setError("Could not connect to the authentication server. Please try again.");
        } finally {
            setAuthLoading(false);
        }
    };

    const fetchData = async () => {
        setLoading(true);

        const isMissingEnv =
            process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") ||
            !process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (isMissingEnv) {
            setEnvError(true);
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("guests")
            .select("*, households(name)")
            .order("last_name", { ascending: true });

        if (error) {
            setError(error.message);
        } else {
            setGuests(data as unknown as Guest[]);
        }

        const { data: scoreData, error: scoreError } = await supabase
            .from("game_scores")
            .select("id, game, puzzle_key, score, max_score, attempts, solved, created_at, game_players(username, email)")
            .order("created_at", { ascending: false })
            .limit(200);

        if (scoreError) {
            setGameScores([]);
            setGameScoresError(
                scoreError.message.includes("game_scores")
                    ? "Leaderboard tables are not available yet. Run the game leaderboard migration first."
                    : scoreError.message
            );
        } else {
            setGameScores(scoreData as unknown as GameScore[]);
            setGameScoresError(null);
        }

        setLoading(false);
    };

    const handleImport = async () => {
        setImporting(true);
        setImportMessage("");

        const allRows = importText.split("\n").filter((r) => r.trim());
        // Skip header row if present (first cell contains "household")
        const firstCell = (allRows[0] || "").split("\t")[0] || (allRows[0] || "").split(",")[0];
        const rows = firstCell.toLowerCase().includes("household") ? allRows.slice(1) : allRows;
        if (rows.length === 0) {
            setImportMessage("No data found to import.");
            setImporting(false);
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const row of rows) {
            const cols = row.split("\t").map((c) => c.trim());
            const finalCols = cols.length >= 3 ? cols : row.split(",").map((c) => c.trim());

            if (finalCols.length < 3) {
                errorCount++;
                continue;
            }

            const householdName = finalCols[0];
            const firstName = finalCols[1];
            const lastName = finalCols[2];
            const rawSuffix = (finalCols[3] || '').trim();
            const suffix = rawSuffix === '' || rawSuffix === '#N/A' ? null : rawSuffix;
            const rawNicknames = (finalCols[4] || '').trim();
            const nicknames = rawNicknames === '' || rawNicknames === '#N/A' ? null : rawNicknames;

            try {
                let { data: hh } = await supabase
                    .from("households")
                    .select("id")
                    .eq("name", householdName)
                    .single();

                if (!hh) {
                    const { data: newHh, error: hhErr } = await supabase
                        .from("households")
                        .insert({ name: householdName })
                        .select()
                        .single();
                    if (hhErr) throw hhErr;
                    hh = newHh;
                }

                if (!hh) throw new Error("Failed to resolve household");

                const { error: gErr } = await supabase.from("guests").insert({
                    first_name: firstName,
                    last_name: lastName,
                    suffix,
                    nicknames,
                    household_id: hh.id,
                });

                if (gErr) throw gErr;
                successCount++;
            } catch (err) {
                console.error(err);
                errorCount++;
            }
        }

        setImportMessage(
            `Import complete! Successfully added ${successCount} guests.${
                errorCount > 0 ? ` Failed parsing ${errorCount} rows.` : ""
            }`
        );
        setImportText("");
        setImporting(false);
        fetchData();
    };

    // Analytics
    const totalInvited = guests.length;
    const totalAttending = guests.filter((g) => g.attending === true).length;
    const totalDeclined = guests.filter((g) => g.attending === false).length;
    const totalPending = guests.filter((g) => g.attending === null).length;
    const meals = {
        beef: guests.filter((g) => g.meal_choice === "beef").length,
        fish: guests.filter((g) => g.meal_choice === "fish").length,
        veg: guests.filter((g) => g.meal_choice === "veg").length,
    };

    const guestsWithExtras = guests.filter(
        (g) => g.food_allergies || g.song_request || g.advice
    );
    const todayPuzzleKey = getTodayKey();
    const triviaScores = gameScores.filter((score) => score.game === "trivia");
    const painedleScores = gameScores.filter((score) => score.game === "painedle");
    const todaysPainedleScores = painedleScores.filter((score) => score.puzzle_key === todayPuzzleKey);

    function getPlayerDetails(score: GameScore) {
        return Array.isArray(score.game_players) ? score.game_players[0] : score.game_players;
    }

    if (!isAuthenticated) {
        return (
            <div className="pt-32 min-h-screen flex flex-col bg-surface">
                <Section className="text-center pb-12 flex-grow flex flex-col justify-start">
                    <div className="max-w-md mx-auto w-full bg-white p-10 shadow-sm border border-gray-100 mt-10">
                        <h1 className="font-heading text-3xl mb-6 text-primary">Admin Access</h1>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-800 text-sm border border-red-200 text-left">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2 text-left">
                                <label className="block text-xs uppercase tracking-widest text-text-secondary">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary transition-colors bg-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full bg-primary text-white px-6 py-3 hover:bg-primary-light transition-colors disabled:opacity-60"
                            >
                                {authLoading ? "Verifying..." : "Login"}
                            </button>
                        </form>
                    </div>
                </Section>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-surface">
            <Section className="pb-12">
                <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="font-heading text-4xl mb-2 text-primary">RSVP Dashboard</h1>
                        <p className="text-text-secondary">
                            Logged in as: <strong className="text-primary">{userRole}</strong>
                        </p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="text-sm bg-primary text-white px-4 py-2 hover:bg-primary-light transition-colors"
                    >
                        Refresh Data
                    </button>
                </div>

                {envError && (
                    <div className="mb-8 p-6 bg-red-50 text-red-900 border border-red-200 shadow-sm rounded-sm">
                        <h3 className="font-heading text-xl mb-2 text-red-800">
                            Database Connection Error
                        </h3>
                        <p className="mb-4">
                            Add your keys to an <code>.env.local</code> file to test locally, or use
                            the live Vercel domain.
                        </p>
                        <p className="text-sm font-mono">
                            NEXT_PUBLIC_SUPABASE_URL=your_url
                            <br />
                            NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
                        </p>
                    </div>
                )}

                {error && !envError && (
                    <div className="mb-8 p-4 bg-red-50 text-red-800 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-text-secondary">Loading analytics...</div>
                ) : (
                    <div className="space-y-10">
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "Total Invited", value: totalInvited, color: "text-primary" },
                                { label: "Attending", value: totalAttending, color: "text-green-700" },
                                { label: "Declined", value: totalDeclined, color: "text-red-700" },
                                { label: "Pending", value: totalPending, color: "text-yellow-600" },
                            ].map(({ label, value, color }) => (
                                <div
                                    key={label}
                                    className="bg-white p-6 border border-gray-100 shadow-sm text-center"
                                >
                                    <h3 className="text-xs uppercase tracking-widest text-text-secondary mb-2">
                                        {label}
                                    </h3>
                                    <p className={`text-4xl font-heading ${color}`}>{value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Meals */}
                        <div className="bg-white p-8 border border-gray-100 shadow-sm">
                            <h2 className="font-heading text-2xl text-primary mb-6">Meal Selections</h2>
                            <div className="grid grid-cols-3 gap-8 text-center">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider text-text-secondary mb-1">
                                        Filet Mignon
                                    </h4>
                                    <p className="text-3xl font-heading text-primary">{meals.beef}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider text-text-secondary mb-1">
                                        Sea Bass
                                    </h4>
                                    <p className="text-3xl font-heading text-primary">{meals.fish}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider text-text-secondary mb-1">
                                        Vegetarian
                                    </h4>
                                    <p className="text-3xl font-heading text-primary">{meals.veg}</p>
                                </div>
                            </div>
                        </div>

                        {/* Guest Table + Extras Tabs */}
                        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-surface/50 flex items-center gap-6">
                                <button
                                    onClick={() => setActiveTab("guests")}
                                    className={`text-sm uppercase tracking-widest pb-1 border-b-2 transition-colors ${
                                        activeTab === "guests"
                                            ? "border-primary text-primary"
                                            : "border-transparent text-text-secondary hover:text-primary"
                                    }`}
                                >
                                    Guest List
                                </button>
                                <button
                                    onClick={() => setActiveTab("extras")}
                                    className={`text-sm uppercase tracking-widest pb-1 border-b-2 transition-colors ${
                                        activeTab === "extras"
                                            ? "border-primary text-primary"
                                            : "border-transparent text-text-secondary hover:text-primary"
                                    }`}
                                >
                                    Extras
                                    {guestsWithExtras.length > 0 && (
                                        <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                            {guestsWithExtras.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab("games")}
                                    className={`text-sm uppercase tracking-widest pb-1 border-b-2 transition-colors ${
                                        activeTab === "games"
                                            ? "border-primary text-primary"
                                            : "border-transparent text-text-secondary hover:text-primary"
                                    }`}
                                >
                                    Games
                                    {gameScores.length > 0 && (
                                        <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                            {gameScores.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {activeTab === "guests" && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-surface/80 text-text-secondary uppercase tracking-widest text-xs border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 font-normal">
                                                    Household / Guest Name
                                                </th>
                                                <th className="px-6 py-4 font-normal">Status</th>
                                                <th className="px-6 py-4 font-normal">Meal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {Object.entries(
                                                guests.reduce(
                                                    (acc, guest) => {
                                                        const hh =
                                                            guest.households?.name ||
                                                            "Unknown Household";
                                                        if (!acc[hh]) acc[hh] = [];
                                                        acc[hh].push(guest);
                                                        return acc;
                                                    },
                                                    {} as Record<string, Guest[]>
                                                )
                                            )
                                                .sort(([a], [b]) => a.localeCompare(b))
                                                .map(([householdName, householdGuests]) => (
                                                    <React.Fragment key={householdName}>
                                                        <tr className="bg-surface/30 border-t-2 border-gray-100">
                                                            <td
                                                                colSpan={3}
                                                                className="px-6 py-3 font-heading text-primary font-bold"
                                                            >
                                                                {householdName}
                                                            </td>
                                                        </tr>
                                                        {householdGuests.map((g) => (
                                                            <tr
                                                                key={g.id}
                                                                className="hover:bg-surface/10 transition-colors"
                                                            >
                                                                <td className="px-6 py-3 pl-10 font-medium text-text-secondary">
                                                                    {g.first_name} {g.last_name}{" "}
                                                                    {g.suffix && (
                                                                        <span className="text-gray-400 ml-1">
                                                                            {g.suffix}
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-3">
                                                                    {g.attending === true && (
                                                                        <span className="text-green-700 bg-green-50 px-2 py-1 rounded text-xs">
                                                                            Attending
                                                                        </span>
                                                                    )}
                                                                    {g.attending === false && (
                                                                        <span className="text-red-700 bg-red-50 px-2 py-1 rounded text-xs">
                                                                            Declined
                                                                        </span>
                                                                    )}
                                                                    {g.attending === null && (
                                                                        <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs">
                                                                            Pending
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-3 text-text-secondary">
                                                                    {g.meal_choice
                                                                        ? ({ beef: "Beef", fish: "Fish", veg: "Vegetarian" }[g.meal_choice] ?? g.meal_choice)
                                                                        : "—"}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                ))}
                                            {guests.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={3}
                                                        className="px-6 py-8 text-center text-text-secondary"
                                                    >
                                                        No guests found. Have you imported the data?
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === "extras" && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-surface/80 text-text-secondary uppercase tracking-widest text-xs border-b border-gray-200">
                                            <tr>
                                                <th className="px-6 py-4 font-normal">Guest</th>
                                                <th className="px-6 py-4 font-normal">Food Allergy</th>
                                                <th className="px-6 py-4 font-normal">Song Request</th>
                                                <th className="px-6 py-4 font-normal">Advice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {guestsWithExtras.map((g) => (
                                                <tr key={g.id} className="hover:bg-surface/10 transition-colors align-top">
                                                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                                                        {g.first_name} {g.last_name}
                                                        <span className="block text-xs text-text-secondary font-normal">
                                                            {g.households?.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-text-secondary max-w-[200px]">
                                                        {g.food_allergies || "—"}
                                                    </td>
                                                    <td className="px-6 py-4 text-text-secondary italic max-w-[200px]">
                                                        {g.song_request || "—"}
                                                    </td>
                                                    <td className="px-6 py-4 text-text-secondary max-w-[300px] leading-relaxed">
                                                        {g.advice || "—"}
                                                    </td>
                                                </tr>
                                            ))}
                                            {guestsWithExtras.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={4}
                                                        className="px-6 py-8 text-center text-text-secondary"
                                                    >
                                                        No song requests, allergies, or advice submitted yet.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === "games" && (
                                <div className="p-6 space-y-8">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {[
                                            { label: "Total Game Scores", value: gameScores.length },
                                            { label: "Trivia Submissions", value: triviaScores.length },
                                            { label: "Painedle Submissions", value: painedleScores.length },
                                            { label: "Today's Painedle", value: todaysPainedleScores.length },
                                        ].map(({ label, value }) => (
                                            <div key={label} className="bg-surface/60 p-5 text-center rounded-sm">
                                                <h3 className="text-xs uppercase tracking-widest text-text-secondary mb-2">
                                                    {label}
                                                </h3>
                                                <p className="text-3xl font-heading text-primary">{value}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {gameScoresError ? (
                                        <div className="p-4 bg-yellow-50 text-yellow-900 border border-yellow-200">
                                            {gameScoresError}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-surface/80 text-text-secondary uppercase tracking-widest text-xs border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-6 py-4 font-normal">Player</th>
                                                        <th className="px-6 py-4 font-normal">Game</th>
                                                        <th className="px-6 py-4 font-normal">Puzzle</th>
                                                        <th className="px-6 py-4 font-normal">Score</th>
                                                        <th className="px-6 py-4 font-normal">Attempts</th>
                                                        <th className="px-6 py-4 font-normal">Solved</th>
                                                        <th className="px-6 py-4 font-normal">Submitted</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {gameScores.map((score) => {
                                                        const player = getPlayerDetails(score);
                                                        return (
                                                            <tr key={score.id} className="hover:bg-surface/10 transition-colors">
                                                                <td className="px-6 py-4">
                                                                    <div className="font-medium text-primary">{player?.username ?? "Guest"}</div>
                                                                    <div className="text-xs text-text-secondary">{player?.email ?? "—"}</div>
                                                                </td>
                                                                <td className="px-6 py-4 text-text-secondary uppercase tracking-wide">
                                                                    {score.game}
                                                                </td>
                                                                <td className="px-6 py-4 text-text-secondary">
                                                                    {score.puzzle_key || "—"}
                                                                </td>
                                                                <td className="px-6 py-4 text-text-secondary">
                                                                    {score.score}
                                                                    {score.max_score ? ` / ${score.max_score}` : ""}
                                                                </td>
                                                                <td className="px-6 py-4 text-text-secondary">
                                                                    {score.attempts ?? "—"}
                                                                </td>
                                                                <td className="px-6 py-4">
                                                                    {score.solved === null ? "—" : score.solved ? (
                                                                        <span className="text-green-700 bg-green-50 px-2 py-1 rounded text-xs">
                                                                            Solved
                                                                        </span>
                                                                    ) : (
                                                                        <span className="text-red-700 bg-red-50 px-2 py-1 rounded text-xs">
                                                                            Missed
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 text-text-secondary">
                                                                    {new Date(score.created_at).toLocaleString()}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                    {gameScores.length === 0 && (
                                                        <tr>
                                                            <td
                                                                colSpan={7}
                                                                className="px-6 py-8 text-center text-text-secondary"
                                                            >
                                                                No game submissions yet.
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bulk Importer */}
                        <div className="bg-white p-8 border border-gray-100 shadow-sm">
                            <h2 className="font-heading text-2xl text-primary mb-2">Import Guests</h2>
                            <p className="text-sm text-text-secondary mb-6">
                                Paste data directly from Excel or Google Sheets. Required columns (in
                                order):{" "}
                                <strong>
                                    Household Name, First Name, Last Name, Suffix (optional),
                                    Nicknames (optional)
                                </strong>
                                .
                            </p>

                            {importMessage && (
                                <div
                                    className={`mb-6 p-4 text-sm border ${
                                        importMessage.includes("Failed")
                                            ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                                            : "bg-green-50 text-green-800 border-green-200"
                                    }`}
                                >
                                    {importMessage}
                                </div>
                            )}

                            <div className="space-y-4">
                                <textarea
                                    className="w-full border border-gray-200 p-4 min-h-[150px] text-sm focus:outline-none focus:border-primary font-mono bg-surface resize-none"
                                    placeholder={`The Paine Family\tJeffrey\tPaine\t\tJeff\nThe Paine Family\tAshlyn\tBimmerle\t\tAsh`}
                                    value={importText}
                                    onChange={(e) => setImportText(e.target.value)}
                                />

                                <button
                                    onClick={handleImport}
                                    disabled={importing || !importText.trim()}
                                    className="bg-primary text-white px-6 py-3 hover:bg-primary-light transition-colors disabled:opacity-50"
                                >
                                    {importing ? "Importing Data..." : "Run Import"}
                                </button>
                            </div>
                        </div>

                        {/* Master Admin Login Tracking */}
                        {userRole === "Master" && (
                            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden mb-12 animate-fade-in-up">
                                <div className="p-6 border-b border-gray-100 bg-primary/5 flex justify-between items-center">
                                    <h2 className="font-heading text-2xl text-primary">
                                        Security & Login Tracking
                                    </h2>
                                    <span className="text-xs uppercase tracking-widest text-primary font-bold">
                                        Master View
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-surface/50 text-text-secondary uppercase tracking-widest text-xs border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 font-normal">Account Used</th>
                                                <th className="px-6 py-4 font-normal">Time (UTC)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {adminLogs.map((log) => (
                                                <tr
                                                    key={log.id}
                                                    className="hover:bg-surface/30 transition-colors"
                                                >
                                                    <td className="px-6 py-4 font-medium text-primary">
                                                        {log.password_used}
                                                    </td>
                                                    <td className="px-6 py-4 text-text-secondary">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                            {adminLogs.length === 0 && (
                                                <tr>
                                                    <td
                                                        colSpan={2}
                                                        className="px-6 py-8 text-center text-text-secondary"
                                                    >
                                                        No login history available.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Section>
        </div>
    );
}
