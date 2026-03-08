"use client";

import { useState } from "react";
import {
    captureBrowserProfile,
    clearStoredGamePlayer,
    getStoredGamePlayer,
    saveStoredGamePlayer,
} from "@/lib/games/leaderboard";

export default function GameAccountPanel() {
    const storedPlayer = getStoredGamePlayer();
    const [username, setUsername] = useState(storedPlayer?.username ?? "");
    const [email, setEmail] = useState(storedPlayer?.email ?? "");
    const [savedPlayer, setSavedPlayer] = useState(storedPlayer);
    const [isEditing, setIsEditing] = useState(!storedPlayer);
    const [message, setMessage] = useState("");

    function handleSave(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const browserProfile = captureBrowserProfile();
        const nextPlayer = {
            username: username.trim(),
            email: email.trim(),
            browserProfile: browserProfile ?? undefined,
        };

        saveStoredGamePlayer(nextPlayer);
        setSavedPlayer(getStoredGamePlayer());
        setIsEditing(false);
        setMessage("Profile saved on this browser.");
    }

    function handleLogout() {
        clearStoredGamePlayer();
        setSavedPlayer(null);
        setUsername("");
        setEmail("");
        setIsEditing(true);
        setMessage("Profile cleared from this browser.");
    }

    return (
        <div className="rounded-[1.9rem] border border-primary/10 bg-[linear-gradient(160deg,#fffaf4_0%,#f3ebe0_100%)] p-6 shadow-[0_12px_34px_rgba(20,42,68,0.08)]">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">Player Account</p>
                    <h3 className="mt-3 font-heading text-3xl text-primary">
                        {savedPlayer ? savedPlayer.username : "Save your profile"}
                    </h3>
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-secondary">
                        Use one username and email so your leaderboard entries stay consistent. This browser will keep
                        you signed in until you open account settings and log out.
                    </p>
                </div>

                {savedPlayer && !isEditing ? (
                    <div className="flex gap-3">
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
                ) : null}
            </div>

            {savedPlayer && !isEditing ? (
                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-[1.2rem] border border-primary/8 bg-white/85 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Username</p>
                        <p className="mt-2 text-lg text-primary">{savedPlayer.username}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-primary/8 bg-white/85 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Email</p>
                        <p className="mt-2 text-lg text-primary">{savedPlayer.email}</p>
                    </div>
                    <div className="rounded-[1.2rem] border border-primary/8 bg-white/85 px-4 py-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-text-secondary">Saved State</p>
                        <p className="mt-2 text-lg text-primary">Persistent on this browser</p>
                    </div>
                </div>
            ) : (
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
                        Save Profile
                    </button>
                </form>
            )}

            {message ? (
                <p className="mt-4 text-sm text-text-secondary">{message}</p>
            ) : null}

            <p className="mt-4 text-xs leading-relaxed text-text-secondary">
                Score submissions also save basic device, language, timezone, and approximate request-location data so
                the games admin can tell real guests apart. No separate password is required for game profiles.
            </p>
        </div>
    );
}
