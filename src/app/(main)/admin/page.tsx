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
    dietary_restrictions: string | null;
    song_request: string | null;
    advice: string | null;
    plus_one_name: string | null;
    affiliation: string | null;
    side: string | null;
    likelihood: string | null;
    households: {
        name: string;
    };
};

type SortField = "name" | "household" | "affiliation" | "side" | "likelihood" | "rsvp" | "plusone";
type SortDir = "asc" | "desc";

export default function AdminDashboard() {
    const { status, role, login, logout } = useAdminSession();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [importText, setImportText] = useState("");
    const [importing, setImporting] = useState(false);
    const [importMessage, setImportMessage] = useState("");
    const [envError, setEnvError] = useState(false);
    const [activeTab, setActiveTab] = useState<"guests" | "extras" | "pages">("guests");
    const [sortField, setSortField] = useState<SortField>("household");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [pageVisibility, setPageVisibility] = useState<Array<{ slug: string; label: string; hidden: boolean }>>([]);
    const [pagesLoading, setPagesLoading] = useState(false);
    const [pagesError, setPagesError] = useState<string | null>(null);

    useEffect(() => {
        if (status !== "authenticated") return;
        const timer = window.setTimeout(() => {
            void fetchData();
            void fetchPageVisibility();
        }, 0);
        return () => window.clearTimeout(timer);
    }, [status]);

    async function fetchPageVisibility() {
        setPagesLoading(true);
        setPagesError(null);
        try {
            const res = await fetch("/api/admin/page-visibility", { credentials: "same-origin" });
            if (!res.ok) throw new Error("Failed to load page visibility");
            const data = await res.json() as { pages: Array<{ slug: string; label: string; hidden: boolean }> };
            setPageVisibility(data.pages);
        } catch (e) {
            setPagesError(e instanceof Error ? e.message : "Unknown error");
        }
        setPagesLoading(false);
    }

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
            .select("*, households(name)");
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
            if (finalCols.length < 3) { errorCount++; continue; }
            const householdName = finalCols[0];
            const firstName = finalCols[1];
            const lastName = finalCols[2];
            const rawSuffix = (finalCols[3] || "").trim();
            const suffix = rawSuffix === "" || rawSuffix === "#N/A" ? null : rawSuffix;
            const rawNicknames = (finalCols[4] || "").trim();
            const nicknames = rawNicknames === "" || rawNicknames === "#N/A" ? null : rawNicknames;
            try {
                let { data: household } = await supabase
                    .from("households").select("id").eq("name", householdName).single();
                if (!household) {
                    const { data: newHousehold, error: householdError } = await supabase
                        .from("households").insert({ name: householdName }).select().single();
                    if (householdError) throw householdError;
                    household = newHousehold;
                }
                if (!household) throw new Error("Failed to resolve household");
                const { error: guestError } = await supabase.from("guests").insert({
                    first_name: firstName, last_name: lastName, suffix, nicknames, household_id: household.id,
                });
                if (guestError) throw guestError;
                successCount++;
            } catch (importError) {
                console.error(importError);
                errorCount++;
            }
        }
        setImportMessage(`Import complete. Added ${successCount} guests.${errorCount > 0 ? ` Failed parsing ${errorCount} rows.` : ""}`);
        setImportText("");
        setImporting(false);
        void fetchData();
    }

    async function togglePageVisibility(slug: string, hidden: boolean) {
        setPageVisibility((prev) =>
            prev.map((p) => (p.slug === slug ? { ...p, hidden } : p))
        );
        try {
            await fetch("/api/admin/page-visibility", {
                method: "POST",
                credentials: "same-origin",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, hidden }),
            });
        } catch {
            void fetchPageVisibility(); // revert on error
        }
    }

    function handleSort(field: SortField) {
        if (sortField === field) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    }

    function getSortedGuests(): Guest[] {
        const sorted = [...guests];
        sorted.sort((a, b) => {
            let aVal = "";
            let bVal = "";
            switch (sortField) {
                case "name":
                    aVal = `${a.last_name} ${a.first_name}`.toLowerCase();
                    bVal = `${b.last_name} ${b.first_name}`.toLowerCase();
                    break;
                case "household":
                    aVal = (a.households?.name || "").toLowerCase();
                    bVal = (b.households?.name || "").toLowerCase();
                    break;
                case "affiliation":
                    aVal = (a.affiliation || "").toLowerCase();
                    bVal = (b.affiliation || "").toLowerCase();
                    break;
                case "side":
                    aVal = (a.side || "").toLowerCase();
                    bVal = (b.side || "").toLowerCase();
                    break;
                case "likelihood":
                    aVal = (a.likelihood || "").toLowerCase();
                    bVal = (b.likelihood || "").toLowerCase();
                    break;
                case "rsvp":
                    aVal = a.attending === true ? "attending" : a.attending === false ? "declined" : "pending";
                    bVal = b.attending === true ? "attending" : b.attending === false ? "declined" : "pending";
                    break;
                case "plusone":
                    aVal = (a.plus_one_name || "").toLowerCase();
                    bVal = (b.plus_one_name || "").toLowerCase();
                    break;
            }
            const cmp = aVal.localeCompare(bVal);
            return sortDir === "asc" ? cmp : -cmp;
        });
        return sorted;
    }

    const totalInvited = guests.length;
    const totalAttending = guests.filter((g) => g.attending === true).length;
    const totalDeclined = guests.filter((g) => g.attending === false).length;
    const totalPending = guests.filter((g) => g.attending === null).length;
    const guestsWithExtras = guests.filter(
        (g) => g.food_allergies || g.dietary_restrictions || g.song_request || g.advice
    );

    function SortIcon({ field }: { field: SortField }) {
        if (sortField !== field) return <span className="ml-1 text-gray-300 text-[10px]">↕</span>;
        return <span className="ml-1 text-primary text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>;
    }

    function ThSortable({ field, children }: { field: SortField; children: React.ReactNode }) {
        return (
            <th
                className="px-6 py-4 font-normal cursor-pointer select-none hover:text-primary transition-colors whitespace-nowrap"
                onClick={() => handleSort(field)}
            >
                {children}
                <SortIcon field={field} />
            </th>
        );
    }

    if (status === "checking") return <div className="min-h-screen bg-base" />;
    if (status !== "authenticated") return <AdminLoginCard onLogin={login} />;

    const sortedGuests = getSortedGuests();
    const isGroupedByHousehold = sortField === "household";

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
                    {/* Stats */}
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

                    {/* Guest Table + Extras */}
                    <div className="overflow-hidden rounded-[1.8rem] border border-primary/10 bg-white shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <div className="flex items-center gap-6 border-b border-primary/8 bg-[#fbf8f3] px-6 py-5">
                            <button
                                onClick={() => setActiveTab("guests")}
                                className={`text-sm uppercase tracking-widest pb-1 border-b-2 transition-colors ${activeTab === "guests" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-primary"}`}
                            >
                                Guest List
                            </button>
                            <button
                                onClick={() => setActiveTab("extras")}
                                className={`text-sm uppercase tracking-widest pb-1 border-b-2 transition-colors ${activeTab === "extras" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-primary"}`}
                            >
                                Extras
                                {guestsWithExtras.length > 0 && (
                                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                        {guestsWithExtras.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={() => setActiveTab("pages")}
                                className={`text-sm uppercase tracking-widest pb-1 border-b-2 transition-colors ${activeTab === "pages" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-primary"}`}
                            >
                                Pages
                            </button>
                        </div>

                        {activeTab === "guests" ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-gray-200 bg-surface/80 text-xs uppercase tracking-widest text-text-secondary">
                                        <tr>
                                            <ThSortable field="name">Guest Name</ThSortable>
                                            <ThSortable field="household">Household</ThSortable>
                                            <ThSortable field="affiliation">Affiliation</ThSortable>
                                            <ThSortable field="side">Side</ThSortable>
                                            <ThSortable field="likelihood">Likelihood</ThSortable>
                                            <ThSortable field="plusone">Plus One</ThSortable>
                                            <ThSortable field="rsvp">RSVP</ThSortable>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {isGroupedByHousehold ? (
                                            Object.entries(
                                                sortedGuests.reduce((acc, guest) => {
                                                    const hhName = guest.households?.name || "Unknown Household";
                                                    if (!acc[hhName]) acc[hhName] = [];
                                                    acc[hhName].push(guest);
                                                    return acc;
                                                }, {} as Record<string, Guest[]>)
                                            )
                                                .sort(([a], [b]) => sortDir === "asc" ? a.localeCompare(b) : b.localeCompare(a))
                                                .map(([householdName, householdGuests]) => (
                                                    <React.Fragment key={householdName}>
                                                        <tr className="border-t-2 border-gray-100 bg-surface/30">
                                                            <td colSpan={7} className="px-6 py-3 font-heading font-bold text-primary">
                                                                {householdName}
                                                            </td>
                                                        </tr>
                                                        {householdGuests.map((guest) => (
                                                            <GuestRow key={guest.id} guest={guest} indented />
                                                        ))}
                                                    </React.Fragment>
                                                ))
                                        ) : (
                                            sortedGuests.map((guest) => (
                                                <GuestRow key={guest.id} guest={guest} indented={false} />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : activeTab === "extras" ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-gray-200 bg-surface/80 text-xs uppercase tracking-widest text-text-secondary">
                                        <tr>
                                            <th className="px-6 py-4 font-normal">Guest</th>
                                            <th className="px-6 py-4 font-normal">Dietary Restrictions</th>
                                            <th className="px-6 py-4 font-normal">Song Request</th>
                                            <th className="px-6 py-4 font-normal">Advice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {guestsWithExtras.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-10 text-center text-text-secondary">
                                                    No extras submitted yet.
                                                </td>
                                            </tr>
                                        ) : (
                                            guestsWithExtras.map((guest) => (
                                                <tr key={guest.id} className="align-top transition-colors hover:bg-surface/10">
                                                    <td className="px-6 py-4 font-medium">
                                                        {guest.first_name} {guest.last_name}
                                                        <span className="block text-xs font-normal text-text-secondary">
                                                            {guest.households?.name}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-text-secondary">
                                                        {guest.dietary_restrictions || guest.food_allergies || "—"}
                                                    </td>
                                                    <td className="px-6 py-4 italic text-text-secondary">
                                                        {guest.song_request || "—"}
                                                    </td>
                                                    <td className="px-6 py-4 leading-relaxed text-text-secondary">
                                                        {guest.advice || "—"}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 md:p-8">
                                <div className="mb-6">
                                    <h3 className="font-heading text-lg text-primary mb-1">Page Visibility</h3>
                                    <p className="text-sm text-text-secondary">
                                        Hidden pages show a 404 to visitors who are not logged into admin. You can still access them directly while logged in. Schedule and Details are hidden from visitors by default. Toggle a page ON to make it publicly accessible.
                                    </p>
                                </div>
                                {pagesLoading ? (
                                    <p className="text-sm text-text-secondary py-4">Loading...</p>
                                ) : pagesError ? (
                                    <p className="text-sm text-red-600 py-4">{pagesError}</p>
                                ) : (
                                    <div className="grid gap-3 sm:grid-cols-2">
                                        {pageVisibility.map((page) => (
                                            <div
                                                key={page.slug}
                                                className="flex items-center justify-between rounded-xl border border-primary/8 bg-surface/60 px-5 py-4"
                                            >
                                                <div>
                                                    <p className="text-sm font-medium text-primary">{page.label}</p>
                                                    <p className="text-xs text-text-secondary mt-0.5">/{page.slug}</p>
                                                </div>
                                                <button
                                                    onClick={() => void togglePageVisibility(page.slug, !page.hidden)}
                                                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${page.hidden ? "bg-gray-200" : "bg-primary"}`}
                                                    role="switch"
                                                    aria-checked={!page.hidden}
                                                >
                                                    <span
                                                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${page.hidden ? "translate-x-0" : "translate-x-5"}`}
                                                    />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <p className="mt-6 text-xs text-text-secondary">
                                    <span className="font-medium">On</span> = publicly visible · <span className="font-medium">Off</span> = hidden (404 for non-admins)
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Import */}
                    <div className="rounded-[1.8rem] border border-primary/10 bg-white p-8 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <h2 className="font-heading text-2xl text-primary">Import Guests</h2>
                        <p className="mt-3 text-sm text-text-secondary">
                            Paste data from Excel or Google Sheets in this order: household, first name, last name, suffix, nicknames.
                        </p>
                        {importMessage ? (
                            <div className={`mt-6 rounded-[1rem] border p-4 text-sm ${importMessage.includes("Failed") ? "border-yellow-200 bg-yellow-50 text-yellow-800" : "border-green-200 bg-green-50 text-green-800"}`}>
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
                                onClick={() => { void handleImport(); }}
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

function GuestRow({ guest, indented }: { guest: Guest; indented: boolean }) {
    return (
        <tr className="transition-colors hover:bg-surface/10">
            <td className={`px-6 py-3 font-medium text-text-secondary ${indented ? "pl-10" : ""}`}>
                {guest.first_name} {guest.last_name}
                {guest.suffix ? <span className="ml-1 text-gray-400">{guest.suffix}</span> : null}
            </td>
            <td className="px-6 py-3 text-text-secondary text-xs">
                {guest.households?.name || "—"}
            </td>
            <td className="px-6 py-3 text-text-secondary">
                {guest.affiliation ? (
                    <span className={`rounded px-2 py-1 text-xs ${
                        guest.affiliation === "Family" ? "bg-purple-50 text-purple-700" :
                        guest.affiliation === "Our Friends" ? "bg-blue-50 text-blue-700" :
                        "bg-teal-50 text-teal-700"
                    }`}>{guest.affiliation}</span>
                ) : "—"}
            </td>
            <td className="px-6 py-3 text-text-secondary">
                {guest.side ? (
                    <span className={`rounded px-2 py-1 text-xs ${
                        guest.side === "Jeff" ? "bg-primary/10 text-primary" :
                        guest.side === "Ash" ? "bg-secondary/10 text-secondary" :
                        "bg-gray-100 text-gray-600"
                    }`}>{guest.side}</span>
                ) : "—"}
            </td>
            <td className="px-6 py-3 text-text-secondary">
                {guest.likelihood ? (
                    <span className={`rounded px-2 py-1 text-xs ${
                        guest.likelihood === "Yes" ? "bg-green-50 text-green-700" :
                        guest.likelihood === "Maybe" ? "bg-yellow-50 text-yellow-600" :
                        "bg-red-50 text-red-600"
                    }`}>{guest.likelihood}</span>
                ) : "—"}
            </td>
            <td className="px-6 py-3 text-text-secondary text-xs">{guest.plus_one_name ?? "—"}</td>
            <td className="px-6 py-3">
                {guest.attending === true ? (
                    <span className="rounded bg-green-50 px-2 py-1 text-xs text-green-700">Attending</span>
                ) : guest.attending === false ? (
                    <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-700">Declined</span>
                ) : (
                    <span className="rounded bg-yellow-50 px-2 py-1 text-xs text-yellow-600">Pending</span>
                )}
            </td>
        </tr>
    );
}
