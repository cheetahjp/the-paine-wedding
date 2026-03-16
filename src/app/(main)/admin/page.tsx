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

type SortField = "name" | "household" | "rsvp" | "plusone";
type SortDir = "asc" | "desc";

type RSVPHistoryEntry = {
    id: string;
    recorded_at: string;
    attending: boolean | null;
    food_allergies: string | null;
    song_request: string | null;
    advice: string | null;
    guest_id: string;
    household_id: string;
    guests: {
        first_name: string;
        last_name: string;
        households: { name: string } | null;
    } | null;
};

function getHouseholdRsvpScore(guests: Guest[]): number {
    if (guests.some((g) => g.attending === true)) return 2;
    if (guests.every((g) => g.attending === false)) return 0;
    return 1;
}

function RsvpBadge({ attending }: { attending: boolean | null }) {
    if (attending === true)
        return <span className="rounded bg-green-50 px-2 py-1 text-xs text-green-700">Attending</span>;
    if (attending === false)
        return <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-700">Declined</span>;
    return <span className="rounded bg-yellow-50 px-2 py-1 text-xs text-yellow-600">Pending</span>;
}

function aggregateAttending(guests: Guest[]): boolean | null {
    if (guests.some((g) => g.attending === true)) return true;
    if (guests.every((g) => g.attending === false)) return false;
    return null;
}

export default function AdminDashboard() {
    const { status, role, login, logout } = useAdminSession();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [importText, setImportText] = useState("");
    const [importing, setImporting] = useState(false);
    const [importMessage, setImportMessage] = useState("");
    const [envError, setEnvError] = useState(false);
    const [activeTab, setActiveTab] = useState<"guests" | "pages" | "history">("guests");
    const [rsvpHistory, setRsvpHistory] = useState<RSVPHistoryEntry[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [sortField, setSortField] = useState<SortField>("household");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [secondarySort, setSecondarySort] = useState(true); // group by household toggle
    const [pageVisibility, setPageVisibility] = useState<Array<{ slug: string; label: string; hidden: boolean }>>([]);
    const [pagesLoading, setPagesLoading] = useState(false);
    const [pagesError, setPagesError] = useState<string | null>(null);

    useEffect(() => {
        if (status !== "authenticated") return;
        const timer = window.setTimeout(() => {
            void fetchData();
            void fetchPageVisibility();
            void fetchHistory();
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

    async function fetchHistory() {
        setHistoryLoading(true);
        try {
            const { data, error: histErr } = await supabase
                .from("rsvp_history")
                .select("*, guests(first_name, last_name, households(name))")
                .order("recorded_at", { ascending: false })
                .limit(200);
            if (!histErr && data) setRsvpHistory(data as RSVPHistoryEntry[]);
        } catch {
            // Non-critical — table may not exist yet if migration hasn't run
        }
        setHistoryLoading(false);
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

    // Returns households grouped and sorted appropriately
    function getGroupedHouseholds(): Array<{ householdName: string; householdGuests: Guest[] }> {
        // Build a map: household name → guests
        const map: Record<string, Guest[]> = {};
        for (const guest of guests) {
            const hhName = guest.households?.name || "Unknown Household";
            if (!map[hhName]) map[hhName] = [];
            map[hhName].push(guest);
        }

        let entries = Object.entries(map).map(([householdName, householdGuests]) => ({
            householdName,
            householdGuests,
        }));

        if (sortField === "rsvp") {
            // Sort households by aggregate RSVP score descending (attending first), then by name
            entries.sort((a, b) => {
                const scoreA = getHouseholdRsvpScore(a.householdGuests);
                const scoreB = getHouseholdRsvpScore(b.householdGuests);
                if (scoreA !== scoreB) {
                    // attending (2) first, then pending (1), then declined (0)
                    return sortDir === "asc" ? scoreB - scoreA : scoreA - scoreB;
                }
                return a.householdName.localeCompare(b.householdName);
            });
        } else if (sortField === "name") {
            // Sort guests within each household by name, sort households by first guest name
            for (const entry of entries) {
                entry.householdGuests.sort((a, b) => {
                    const aVal = `${a.last_name} ${a.first_name}`.toLowerCase();
                    const bVal = `${b.last_name} ${b.first_name}`.toLowerCase();
                    return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
                });
            }
            entries.sort((a, b) => {
                const aFirst = a.householdGuests[0];
                const bFirst = b.householdGuests[0];
                const aVal = aFirst ? `${aFirst.last_name} ${aFirst.first_name}`.toLowerCase() : "";
                const bVal = bFirst ? `${bFirst.last_name} ${bFirst.first_name}`.toLowerCase() : "";
                return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            });
        } else {
            // Default: sort by household name
            entries = entries.sort((a, b) =>
                sortDir === "asc"
                    ? a.householdName.localeCompare(b.householdName)
                    : b.householdName.localeCompare(a.householdName)
            );
        }

        return entries;
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
                case "rsvp": {
                    const rsvpOrder = (g: Guest) =>
                        g.attending === true ? 0 : g.attending === null ? 1 : 2;
                    const cmpRsvp = rsvpOrder(a) - rsvpOrder(b);
                    return sortDir === "asc" ? cmpRsvp : -cmpRsvp;
                }
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

    const groupByHousehold = secondarySort;

    return (
        <AdminFrame
            section="rsvp"
            role={role}
            title="RSVP Dashboard"
            description="Guest management, RSVP analytics, and importer live here. Games and security now have their own admin sections."
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

                    {/* Guest Table */}
                    <div className="overflow-hidden rounded-[1.8rem] border border-primary/10 bg-white shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        {/* Tab bar */}
                        <div className="flex items-center gap-6 border-b border-primary/8 bg-[#fbf8f3] px-6 py-5">
                            <button
                                onClick={() => setActiveTab("guests")}
                                className={`text-sm uppercase tracking-widest pb-1 border-b-2 transition-colors ${activeTab === "guests" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-primary"}`}
                            >
                                Guest List
                            </button>
                            <button
                                onClick={() => setActiveTab("pages")}
                                className={`text-sm uppercase tracking-widest pb-1 border-b-2 transition-colors ${activeTab === "pages" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-primary"}`}
                            >
                                Pages
                            </button>
                            <button
                                onClick={() => setActiveTab("history")}
                                className={`text-sm uppercase tracking-widest pb-1 border-b-2 transition-colors ${activeTab === "history" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-primary"}`}
                            >
                                History
                                {rsvpHistory.length > 0 && (
                                    <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                                        {rsvpHistory.length}
                                    </span>
                                )}
                            </button>

                            {/* Group by Household toggle — only visible on Guest List tab */}
                            {activeTab === "guests" && (
                                <button
                                    onClick={() => setSecondarySort((v) => !v)}
                                    className={`ml-auto rounded-full px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${
                                        groupByHousehold
                                            ? "bg-primary text-white"
                                            : "border border-primary/20 bg-transparent text-primary hover:bg-primary/5"
                                    }`}
                                >
                                    Group by Household
                                </button>
                            )}
                        </div>

                        {activeTab === "guests" ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="border-b border-gray-200 bg-surface/80 text-xs uppercase tracking-widest text-text-secondary">
                                        <tr>
                                            <ThSortable field="name">Guest Name</ThSortable>
                                            <ThSortable field="plusone">Plus One</ThSortable>
                                            <ThSortable field="rsvp">RSVP</ThSortable>
                                            <th className="px-6 py-4 font-normal whitespace-nowrap">Allergies</th>
                                            <th className="px-6 py-4 font-normal whitespace-nowrap">Song Request</th>
                                            <th className="px-6 py-4 font-normal whitespace-nowrap">Advice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {groupByHousehold ? (
                                            getGroupedHouseholds().map(({ householdName, householdGuests }) => {
                                                const aggAttending = aggregateAttending(householdGuests);
                                                // Find first guest with a song request / advice for the household
                                                const householdSong = householdGuests.find((g) => g.song_request)?.song_request ?? null;
                                                const householdAdvice = householdGuests.find((g) => g.advice)?.advice ?? null;
                                                return (
                                                    <React.Fragment key={householdName}>
                                                        {/* Household header row */}
                                                        <tr className="border-t-2 border-gray-100 bg-surface/40">
                                                            <td colSpan={2} className="px-6 py-3 font-heading font-bold text-primary">
                                                                {householdName}
                                                            </td>
                                                            <td className="px-6 py-3">
                                                                <RsvpBadge attending={aggAttending} />
                                                            </td>
                                                            <td className="px-6 py-3 text-text-secondary/40 text-xs">—</td>
                                                            <td className="px-6 py-3 italic text-text-secondary text-xs">
                                                                {householdSong || <span className="not-italic text-text-secondary/40">—</span>}
                                                            </td>
                                                            <td className="px-6 py-3 text-text-secondary text-xs leading-relaxed">
                                                                {householdAdvice || <span className="text-text-secondary/40">—</span>}
                                                            </td>
                                                        </tr>
                                                        {/* Guest sub-rows */}
                                                        {householdGuests.map((guest) => (
                                                            <tr key={guest.id} className="transition-colors hover:bg-surface/10">
                                                                <td className="px-6 py-3 pl-10 font-medium text-text-secondary">
                                                                    {guest.first_name} {guest.last_name}
                                                                    {guest.suffix ? <span className="ml-1 text-gray-400">{guest.suffix}</span> : null}
                                                                </td>
                                                                <td className="px-6 py-3 text-text-secondary text-xs">{guest.plus_one_name ?? "—"}</td>
                                                                <td className="px-6 py-3">
                                                                    <RsvpBadge attending={guest.attending} />
                                                                </td>
                                                                <td className="px-6 py-3 text-text-secondary text-xs">
                                                                    {guest.food_allergies || guest.dietary_restrictions || <span className="text-text-secondary/40">—</span>}
                                                                </td>
                                                                <td className="px-6 py-3 text-text-secondary/40 text-xs">—</td>
                                                                <td className="px-6 py-3 text-text-secondary/40 text-xs">—</td>
                                                            </tr>
                                                        ))}
                                                    </React.Fragment>
                                                );
                                            })
                                        ) : (
                                            getSortedGuests().map((guest) => (
                                                <GuestRow key={guest.id} guest={guest} />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        ) : activeTab === "history" ? (
                            <div className="overflow-x-auto">
                                {historyLoading ? (
                                    <div className="py-10 text-center text-text-secondary text-sm">Loading history...</div>
                                ) : rsvpHistory.length === 0 ? (
                                    <div className="py-10 text-center text-text-secondary text-sm">No RSVP changes recorded yet.</div>
                                ) : (
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-gray-200 bg-surface/80 text-xs uppercase tracking-widest text-text-secondary">
                                            <tr>
                                                <th className="px-6 py-4 font-normal">When</th>
                                                <th className="px-6 py-4 font-normal">Guest</th>
                                                <th className="px-6 py-4 font-normal">Household</th>
                                                <th className="px-6 py-4 font-normal">Attending</th>
                                                <th className="px-6 py-4 font-normal">Dietary</th>
                                                <th className="px-6 py-4 font-normal">Song</th>
                                                <th className="px-6 py-4 font-normal">Advice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {rsvpHistory.map((entry) => (
                                                <tr key={entry.id} className="align-top transition-colors hover:bg-surface/10">
                                                    <td className="px-6 py-3 text-text-secondary text-xs whitespace-nowrap">
                                                        {new Date(entry.recorded_at).toLocaleDateString("en-US", {
                                                            month: "short", day: "numeric", year: "numeric",
                                                        })}
                                                        <span className="block text-text-secondary/50">
                                                            {new Date(entry.recorded_at).toLocaleTimeString("en-US", {
                                                                hour: "numeric", minute: "2-digit",
                                                            })}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3 font-medium text-text-primary">
                                                        {entry.guests ? `${entry.guests.first_name} ${entry.guests.last_name}` : "Unknown"}
                                                    </td>
                                                    <td className="px-6 py-3 text-text-secondary text-xs">
                                                        {entry.guests?.households?.name ?? "—"}
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {entry.attending === true ? (
                                                            <span className="rounded bg-green-50 px-2 py-1 text-xs text-green-700">Attending</span>
                                                        ) : entry.attending === false ? (
                                                            <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-700">Declined</span>
                                                        ) : (
                                                            <span className="text-text-secondary/40 text-xs">—</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-3 text-text-secondary text-xs">{entry.food_allergies || "—"}</td>
                                                    <td className="px-6 py-3 italic text-text-secondary text-xs">{entry.song_request || "—"}</td>
                                                    <td className="px-6 py-3 text-text-secondary text-xs">{entry.advice || "—"}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
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

function GuestRow({ guest }: { guest: Guest }) {
    return (
        <tr className="transition-colors hover:bg-surface/10">
            <td className="px-6 py-3 font-medium text-text-secondary">
                {guest.first_name} {guest.last_name}
                {guest.suffix ? <span className="ml-1 text-gray-400">{guest.suffix}</span> : null}
            </td>
            <td className="px-6 py-3 text-text-secondary text-xs">{guest.plus_one_name ?? "—"}</td>
            <td className="px-6 py-3">
                <RsvpBadge attending={guest.attending} />
            </td>
            <td className="px-6 py-3 text-text-secondary text-xs">
                {guest.food_allergies || guest.dietary_restrictions || <span className="text-text-secondary/40">—</span>}
            </td>
            <td className="px-6 py-3 italic text-text-secondary text-xs">
                {guest.song_request || <span className="not-italic text-text-secondary/40">—</span>}
            </td>
            <td className="px-6 py-3 text-text-secondary text-xs leading-relaxed">
                {guest.advice || <span className="text-text-secondary/40">—</span>}
            </td>
        </tr>
    );
}
