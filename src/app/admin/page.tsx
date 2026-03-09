"use client";

import React, { useEffect, useState } from "react";
import AdminFrame from "@/components/admin/AdminFrame";
import AdminLoginCard from "@/components/admin/AdminLoginCard";
import { useAdminSession } from "@/components/admin/useAdminSession";
import { supabase } from "@/lib/supabase";

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

export default function AdminDashboard() {
    const { status, role, login, logout } = useAdminSession();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [importText, setImportText] = useState("");
    const [importing, setImporting] = useState(false);
    const [importMessage, setImportMessage] = useState("");
    const [envError, setEnvError] = useState(false);
    const [activeTab, setActiveTab] = useState<"guests" | "extras">("guests");

    useEffect(() => {
        if (status !== "authenticated") return;

        const timer = window.setTimeout(() => {
            void fetchData();
        }, 0);

        return () => window.clearTimeout(timer);
    }, [status]);

    async function fetchData() {
        setLoading(true);

        const isMissingEnv =
            process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") ||
            !process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (isMissingEnv) {
            setEnvError(true);
            setLoading(false);
            return;
        }

        const { data, error: guestError } = await supabase
            .from("guests")
            .select("*, households(name)")
            .order("last_name", { ascending: true });

        if (guestError) {
            setError(guestError.message);
        } else {
            setGuests(data as unknown as Guest[]);
            setError(null);
        }

        setLoading(false);
    }

    async function handleImport() {
        setImporting(true);
        setImportMessage("");

        const allRows = importText.split("\n").filter((row) => row.trim());
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
            const cols = row.split("\t").map((value) => value.trim());
            const finalCols = cols.length >= 3 ? cols : row.split(",").map((value) => value.trim());

            if (finalCols.length < 3) {
                errorCount++;
                continue;
            }

            const householdName = finalCols[0];
            const firstName = finalCols[1];
            const lastName = finalCols[2];
            const rawSuffix = (finalCols[3] || "").trim();
            const suffix = rawSuffix === "" || rawSuffix === "#N/A" ? null : rawSuffix;
            const rawNicknames = (finalCols[4] || "").trim();
            const nicknames = rawNicknames === "" || rawNicknames === "#N/A" ? null : rawNicknames;

            try {
                let { data: household } = await supabase
                    .from("households")
                    .select("id")
                    .eq("name", householdName)
                    .single();

                if (!household) {
                    const { data: newHousehold, error: householdError } = await supabase
                        .from("households")
                        .insert({ name: householdName })
                        .select()
                        .single();

                    if (householdError) throw householdError;
                    household = newHousehold;
                }

                if (!household) throw new Error("Failed to resolve household");

                const { error: guestError } = await supabase.from("guests").insert({
                    first_name: firstName,
                    last_name: lastName,
                    suffix,
                    nicknames,
                    household_id: household.id,
                });

                if (guestError) throw guestError;
                successCount++;
            } catch (importError) {
                console.error(importError);
                errorCount++;
            }
        }

        setImportMessage(
            `Import complete. Added ${successCount} guests.${errorCount > 0 ? ` Failed parsing ${errorCount} rows.` : ""}`
        );
        setImportText("");
        setImporting(false);
        void fetchData();
    }

    const totalInvited = guests.length;
    const totalAttending = guests.filter((guest) => guest.attending === true).length;
    const totalDeclined = guests.filter((guest) => guest.attending === false).length;
    const totalPending = guests.filter((guest) => guest.attending === null).length;
    const guestsWithExtras = guests.filter((guest) => guest.food_allergies || guest.song_request || guest.advice);
    const meals = {
        beef: guests.filter((guest) => guest.meal_choice === "beef").length,
        fish: guests.filter((guest) => guest.meal_choice === "fish").length,
        veg: guests.filter((guest) => guest.meal_choice === "veg").length,
    };

    if (status === "checking") {
        return <div className="min-h-screen bg-base" />;
    }

    if (status !== "authenticated") {
        return <AdminLoginCard onLogin={login} />;
    }

    return (
        <AdminFrame
            section="rsvp"
            role={role}
            title="RSVP Dashboard"
            description="Guest management, RSVP analytics, extras, and importer live here. Games and security now have their own admin sections."
            onLogout={logout}
        >
            {envError ? (
                <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-red-900">
                    Add valid Supabase keys to `.env.local` or use the live Vercel domain.
                </div>
            ) : null}

            {error ? (
                <div className="mb-8 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    {error}
                </div>
            ) : null}

            {loading ? (
                <div className="py-16 text-center text-text-secondary">Loading guest data...</div>
            ) : (
                <div className="space-y-10">
                    <div className="grid gap-4 md:grid-cols-4">
                        {[
                            { label: "Total Invited", value: totalInvited, color: "text-primary" },
                            { label: "Attending", value: totalAttending, color: "text-green-700" },
                            { label: "Declined", value: totalDeclined, color: "text-red-700" },
                            { label: "Pending", value: totalPending, color: "text-yellow-600" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="rounded-[1.5rem] border border-primary/8 bg-[#fbf8f3] p-6 text-center">
                                <h3 className="text-xs uppercase tracking-widest text-text-secondary">{label}</h3>
                                <p className={`mt-3 text-4xl font-heading ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-[1.8rem] border border-primary/10 bg-white p-8 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <h2 className="font-heading text-2xl text-primary">Meal Selections</h2>
                        <div className="mt-6 grid gap-6 text-center md:grid-cols-3">
                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-text-secondary">Filet Mignon</h4>
                                <p className="mt-2 text-3xl font-heading text-primary">{meals.beef}</p>
                            </div>
                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-text-secondary">Sea Bass</h4>
                                <p className="mt-2 text-3xl font-heading text-primary">{meals.fish}</p>
                            </div>
                            <div>
                                <h4 className="text-sm uppercase tracking-wider text-text-secondary">Vegetarian</h4>
                                <p className="mt-2 text-3xl font-heading text-primary">{meals.veg}</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-[1.8rem] border border-primary/10 bg-white shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <div className="flex items-center gap-6 border-b border-primary/8 bg-[#fbf8f3] px-6 py-5">
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
                                {guestsWithExtras.length > 0 ? (
                                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                        {guestsWithExtras.length}
                                    </span>
                                ) : null}
                            </button>
                        </div>

                        {activeTab === "guests" ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-gray-200 bg-surface/80 text-xs uppercase tracking-widest text-text-secondary">
                                        <tr>
                                            <th className="px-6 py-4 font-normal">Household / Guest Name</th>
                                            <th className="px-6 py-4 font-normal">Status</th>
                                            <th className="px-6 py-4 font-normal">Meal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {Object.entries(
                                            guests.reduce((accumulator, guest) => {
                                                const household = guest.households?.name || "Unknown Household";
                                                if (!accumulator[household]) accumulator[household] = [];
                                                accumulator[household].push(guest);
                                                return accumulator;
                                            }, {} as Record<string, Guest[]>)
                                        )
                                            .sort(([left], [right]) => left.localeCompare(right))
                                            .map(([householdName, householdGuests]) => (
                                                <React.Fragment key={householdName}>
                                                    <tr className="border-t-2 border-gray-100 bg-surface/30">
                                                        <td colSpan={3} className="px-6 py-3 font-heading font-bold text-primary">
                                                            {householdName}
                                                        </td>
                                                    </tr>
                                                    {householdGuests.map((guest) => (
                                                        <tr key={guest.id} className="transition-colors hover:bg-surface/10">
                                                            <td className="px-6 py-3 pl-10 font-medium text-text-secondary">
                                                                {guest.first_name} {guest.last_name}
                                                                {guest.suffix ? (
                                                                    <span className="ml-1 text-gray-400">{guest.suffix}</span>
                                                                ) : null}
                                                            </td>
                                                            <td className="px-6 py-3">
                                                                {guest.attending === true ? (
                                                                    <span className="rounded bg-green-50 px-2 py-1 text-xs text-green-700">Attending</span>
                                                                ) : guest.attending === false ? (
                                                                    <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-700">Declined</span>
                                                                ) : (
                                                                    <span className="rounded bg-yellow-50 px-2 py-1 text-xs text-yellow-600">Pending</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-3 text-text-secondary">
                                                                {guest.meal_choice
                                                                    ? ({ beef: "Beef", fish: "Fish", veg: "Vegetarian" }[guest.meal_choice] ?? guest.meal_choice)
                                                                    : "—"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-gray-200 bg-surface/80 text-xs uppercase tracking-widest text-text-secondary">
                                        <tr>
                                            <th className="px-6 py-4 font-normal">Guest</th>
                                            <th className="px-6 py-4 font-normal">Food Allergy</th>
                                            <th className="px-6 py-4 font-normal">Song Request</th>
                                            <th className="px-6 py-4 font-normal">Advice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {guestsWithExtras.map((guest) => (
                                            <tr key={guest.id} className="align-top transition-colors hover:bg-surface/10">
                                                <td className="px-6 py-4 font-medium">
                                                    {guest.first_name} {guest.last_name}
                                                    <span className="block text-xs font-normal text-text-secondary">
                                                        {guest.households?.name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-text-secondary">{guest.food_allergies || "—"}</td>
                                                <td className="px-6 py-4 italic text-text-secondary">{guest.song_request || "—"}</td>
                                                <td className="px-6 py-4 leading-relaxed text-text-secondary">{guest.advice || "—"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div className="rounded-[1.8rem] border border-primary/10 bg-white p-8 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <h2 className="font-heading text-2xl text-primary">Import Guests</h2>
                        <p className="mt-3 text-sm text-text-secondary">
                            Paste data from Excel or Google Sheets in this order: household, first name, last name, suffix, nicknames.
                        </p>

                        {importMessage ? (
                            <div className={`mt-6 rounded-[1rem] border p-4 text-sm ${
                                importMessage.includes("Failed")
                                    ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                                    : "border-green-200 bg-green-50 text-green-800"
                            }`}>
                                {importMessage}
                            </div>
                        ) : null}

                        <div className="mt-6 space-y-4">
                            <textarea
                                className="min-h-[150px] w-full resize-none rounded-[1rem] border border-gray-200 bg-surface p-4 font-mono text-sm focus:border-primary focus:outline-none"
                                placeholder={`The Paine Family\tAshlyn\tBimmerle\t\t\nThe Paine Family\tJeffrey\tPaine\t\t`}
                                value={importText}
                                onChange={(event) => setImportText(event.target.value)}
                            />
                            <button
                                onClick={() => {
                                    void handleImport();
                                }}
                                disabled={importing || !importText.trim()}
                                className="rounded-full bg-primary px-6 py-3 text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
                            >
                                {importing ? "Importing..." : "Run Import"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminFrame>
    );
}
