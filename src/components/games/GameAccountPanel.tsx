"use client";

import { useEffect, useState } from "react";
import {
    captureBrowserProfile,
    clearStoredGamePlayer,
    getStoredGamePlayer,
    saveStoredGamePlayer,
    type StoredGamePlayer,
} from "@/lib/games/leaderboard";

export default function GameAccountPanel() {
    const [savedPlayer, setSavedPlayer] = useState<StoredGamePlayer | null>(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const stored = getStoredGamePlayer();
        setSavedPlayer(stored);
        if (stored) {
            setUsername(stored.username);
            setEmail(stored.email);
            setIsEditing(false);
        } else {
            setIsEditing(true);
        }
        setMounted(true);
    }, []);

    function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const browserProfile = captureBrowserProfile();
        saveStoredGamePlayer({
            username: username.trim(),
            email: email.trim(),
            browserProfile: browserProfile ?? undefined,
        });
        const stored = getStoredGamePlayer();
        setSavedPlayer(stored);
        setIsEditing(false);
    }

    function handleCancel() {
        if (savedPlayer) {
            setUsername(savedPlayer.username);
            setEmail(savedPlayer.email);
        }
        setIsEditing(false);
    }

    function handleLogout() {
        clearStoredGamePlayer();
        setSavedPlayer(null);
        setUsername("");
        setEmail("");
        setIsEditing(true);
    }

    // Don't render until client-side hydration is complete (localStorage isn't available on server)
    if (!mounted) return null;

    // Collapsed display — profile is saved and not editing
    if (savedPlayer && !isEditing) {
        return (
            <div className="rounded-[1.5rem] border border-primary/10 bg-[linear-gradient(160deg,#fffaf4_0%,#f3ebe0_100%)] px-5 py-4 shadow-[0_12px_34px_rgba(20,42,68,0.08)]">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                        <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">Player Account</p>
                        <div className="mt-2 flex min-w-0 flex-col gap-1 md:flex-row md:items-center md:gap-3">
                            <p className="text-lg text-primary">
                                Playing as <span className="font-semibold">{savedPlayer.username}</span>
                            </p>
                            <span className="hidden h-1 w-1 rounded-full bg-primary/25 md:block" />
                            <p className="truncate text-sm text-text-secondary">{savedPlayer.email}</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="rounded-full border border-primary/12 bg-white px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
                        >
                            Account Settings
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-full border border-secondary/18 bg-secondary/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-secondary transition-colors duration-200 hover:bg-secondary hover:text-white"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Editing / setup form
    return (
        <div className="rounded-[1.9rem] border border-primary/10 bg-[linear-gradient(160deg,#fffaf4_0%,#f3ebe0_100%)] p-6 shadow-[0_12px_34px_rgba(20,42,68,0.08)]">
            <div>
                <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">Player Account</p>
                <h3 className="mt-3 font-heading text-3xl text-primary">
                    {savedPlayer ? "Account Settings" : "Save your profile"}
                </h3>
                <p className="mt-2 text-sm text-text-secondary">
                    One name and email keeps your scores consistent on the leaderboard.
                </p>
            </div>

            <form className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSave}>
                <input
                    type="text"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="Username"
                    required
                    className="rounded-[1rem] border border-primary/12 bg-white px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Email address"
                    required
                    className="rounded-[1rem] border border-primary/12 bg-white px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent"
                />
                <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
                >
                    {savedPlayer ? "Save Changes" : "Save Profile"}
                </button>
            </form>

            {savedPlayer ? (
                <div className="mt-4 flex flex-wrap gap-3">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="rounded-full border border-primary/12 bg-white px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary transition-colors duration-200 hover:bg-primary hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-full border border-secondary/18 bg-secondary/6 px-4 py-2 text-xs uppercase tracking-[0.22em] text-secondary transition-colors duration-200 hover:bg-secondary hover:text-white"
                    >
                        Log Out
                    </button>
                </div>
            ) : null}
        </div>
    );
}
