"use client";

import { useState } from "react";

type AdminLoginCardProps = {
    onLogin: (password: string) => Promise<{ ok: boolean; error?: string }>;
};

export default function AdminLoginCard({ onLogin }: AdminLoginCardProps) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);

        const result = await onLogin(password);

        if (!result.ok) {
            setError(result.error ?? "Invalid password.");
        }

        setIsSubmitting(false);
    }

    return (
        <div className="min-h-screen flex flex-col bg-base">
            <div className="w-full flex-grow px-6 py-8 md:py-10">
                <div className="mx-auto max-w-md rounded-[2rem] border border-primary/10 bg-[linear-gradient(160deg,#fffaf4_0%,#f3ebe0_100%)] p-10 shadow-[0_16px_44px_rgba(20,42,68,0.08)]">
                    <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">Admin</p>
                    <h1 className="mt-4 font-heading text-4xl text-primary">Admin Access</h1>

                    {error ? (
                        <div className="mt-6 rounded-[1rem] border border-red-200 bg-red-50 p-4 text-left text-sm text-red-800">
                            {error}
                        </div>
                    ) : null}

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div className="space-y-2 text-left">
                            <label className="block text-xs uppercase tracking-widest text-text-secondary">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                className="w-full rounded-[1rem] border border-primary/12 bg-white px-4 py-3 text-text-primary outline-none transition-colors focus:border-primary"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full rounded-full bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
                        >
                            {isSubmitting ? "Verifying..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
