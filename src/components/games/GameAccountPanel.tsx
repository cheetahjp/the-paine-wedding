"use client";

import { useState, useSyncExternalStore } from "react";
import {
    captureBrowserProfile,
    clearStoredGamePlayer,
    getStoredGamePlayer,
    saveStoredGamePlayer,
    type StoredGamePlayer,
} from "@/lib/games/leaderboard";

export default function GameAccountPanel() {
    const isClient = useSyncExternalStore(
        () => () => {},
        () => true,
        () => false
    );
    const [savedPlayer, setSavedPlayer] = useState<StoredGamePlayer | null>(() => {
        if (typeof window === "undefined") return null;
        return getStoredGamePlayer();
    });
    const [firstName, setFirstName] = useState(() => {
        if (typeof window === "undefined") return "";
        const p = getStoredGamePlayer();
        if (!p) return "";
        // Support old username field as fallback
        return p.firstName ?? (p.username?.split(" ")[0] ?? "");
    });
    const [lastName, setLastName] = useState(() => {
        if (typeof window === "undefined") return "";
        const p = getStoredGamePlayer();
        if (!p) return "";
        return p.lastName ?? (p.username?.includes(" ") ? p.username.split(" ").slice(1).join(" ") : "");
    });
    const [email, setEmail] = useState(() => {
        if (typeof window === "undefined") return "";
        return getStoredGamePlayer()?.email ?? "";
    });
    const [isEditing, setIsEditing] = useState(() => {
        if (typeof window === "undefined") return false;
        return !getStoredGamePlayer();
    });

    function getDisplayName(player: StoredGamePlayer): string {
        if (player.firstName && player.lastName) return `${player.firstName} ${player.lastName}`;
        if (player.firstName) return player.firstName;
        return player.username ?? "";
    }

    function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
        const browserProfile = captureBrowserProfile();
        saveStoredGamePlayer({
            username: fullName,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            browserProfile: browserProfile ?? undefined,
        });
        const stored = getStoredGamePlayer();
        setSavedPlayer(stored);
        setIsEditing(false);
    }

    function handleCancel() {
        if (savedPlayer) {
            setFirstName(savedPlayer.firstName ?? savedPlayer.username?.split(" ")[0] ?? "");
            setLastName(savedPlayer.lastName ?? (savedPlayer.username?.includes(" ") ? savedPlayer.username.split(" ").slice(1).join(" ") : ""));
            setEmail(savedPlayer.email);
        }
        setIsEditing(false);
    }

    function handleLogout() {
        clearStoredGamePlayer();
        setSavedPlayer(null);
        setFirstName("");
        setLastName("");
        setEmail("");
        setIsEditing(true);
    }

    if (!isClient) return null;

    // Collapsed display
    if (savedPlayer && !isEditing) {
        return (
            <div className="rounded-[1.2rem] border border-primary/10 bg-[linear-gradient(160deg,#fffaf4_0%,#f3ebe0_100%)] px-4 py-2.5 shadow-[0_4px_16px_rgba(20,42,68,0.07)]">
                <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex items-center gap-3">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-text-secondary whitespace-nowrap">Player Account</p>
                        <span className="text-text-secondary/30 text-xs">·</span>
                        <p className="text-sm font-semibold text-primary truncate">{getDisplayName(savedPlayer)}</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="rounded-full border border-primary/12 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-primary transition-colors duration-200 hover:bg-primary hover:text-white whitespace-nowrap"
                        >
                            Settings
                        </button>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-full border border-secondary/18 bg-secondary/6 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-secondary transition-colors duration-200 hover:bg-secondary hover:text-white whitespace-nowrap"
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
            <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">Player Account</p>
            <h3 className="mt-3 font-heading text-3xl text-primary">
                {savedPlayer ? "Account Settings" : "Save your profile"}
            </h3>

            <form className="mt-6 space-y-4" onSubmit={handleSave}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-text-secondary/60">First Name</p>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            placeholder="First name"
                            required
                            className="w-full rounded-[1rem] border border-primary/12 bg-white px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent"
                        />
                    </div>
                    <div>
                        <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-text-secondary/60">Last Name</p>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            placeholder="Last name"
                            required
                            className="w-full rounded-[1rem] border border-primary/12 bg-white px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent"
                        />
                    </div>
                </div>
                <div>
                    <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-text-secondary/60">Email Address</p>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="w-full rounded-[1rem] border border-primary/12 bg-white px-4 py-3 text-text-primary outline-none transition-colors focus:border-accent"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                    <button
                        type="submit"
                        className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary/90"
                    >
                        {savedPlayer ? "Save Changes" : "Save Profile"}
                    </button>
                    {savedPlayer && (
                        <>
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
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}
