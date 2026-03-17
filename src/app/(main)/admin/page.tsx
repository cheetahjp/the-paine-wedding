"use client";

import React, { useEffect, useRef, useState } from "react";
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
    plus_one_allowed: boolean;
    affiliation: string | null;
    side: string | null;
    likelihood: string | null;
    viewed_rsvp: boolean;
    is_plus_one: boolean;
    plus_one_for_id: string | null;
    plus_one_claimed: boolean;
    households: { id: string; name: string };
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
    guests: { first_name: string; last_name: string; households: { name: string } | null } | null;
};

type RsvpPopover = {
    anchorRect: DOMRect;
    guestId?: string;
    householdId?: string;
    current: boolean | null;
    isPlusOne?: boolean;
    plusOneClaimed?: boolean;
};

type TextEdit = {
    anchorRect: DOMRect;
    guestId: string;
    field: string;
    value: string;
    multiline: boolean;
    label: string;
    householdId?: string;
};

function TruncatedText({ text, cellKey, expandedTexts, setExpandedTexts }: {
    text: string | null;
    cellKey: string;
    expandedTexts: Record<string, boolean>;
    setExpandedTexts: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
    if (!text) return <span className="text-text-secondary/40">—</span>;
    const isExpanded = expandedTexts[cellKey];
    // Estimate if text is long enough to overflow 2 lines (~80 chars)
    const needsTruncation = text.length > 80;
    if (!needsTruncation) return <>{text}</>;
    return (
        <div className="relative">
            <div className={isExpanded ? undefined : "line-clamp-2"}>
                {text}
            </div>
            <button
                onClick={(e) => { e.stopPropagation(); setExpandedTexts(prev => ({ ...prev, [cellKey]: !isExpanded })); }}
                className="mt-0.5 flex items-center gap-0.5 text-[10px] text-primary/50 hover:text-primary transition-colors"
            >
                <svg className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                {isExpanded ? "collapse" : "expand"}
            </button>
        </div>
    );
}

function getHouseholdRsvpScore(guests: Guest[]): number {
    if (guests.some((g) => g.attending === true)) return 2;
    if (guests.every((g) => g.attending === false)) return 0;
    return 1;
}

function aggregateAttending(guests: Guest[]): boolean | null {
    if (guests.some((g) => g.attending === true)) return true;
    if (guests.every((g) => g.attending === false)) return false;
    return null;
}

function RsvpBadge({
    attending,
    viewedRsvp,
    isPlusOne,
    plusOneClaimed,
    editable,
    onClick,
}: {
    attending: boolean | null;
    viewedRsvp?: boolean;
    isPlusOne?: boolean;
    plusOneClaimed?: boolean;
    editable?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
    const ring = editable ? "ring-2 ring-offset-1 ring-primary/20 cursor-pointer hover:ring-primary/50" : "";
    const base = `rounded px-2 py-1 text-xs transition-colors ${ring}`;

    if (isPlusOne && !plusOneClaimed && attending === null)
        return <button onClick={onClick} className={`${base} bg-gray-50 text-gray-500 border border-dashed border-gray-300`}>Not Added</button>;
    if (attending === true)
        return <button onClick={onClick} className={`${base} bg-green-50 text-green-700`}>Attending</button>;
    if (attending === false)
        return <button onClick={onClick} className={`${base} bg-red-50 text-red-700`}>Declined</button>;
    if (viewedRsvp)
        return <button onClick={onClick} className={`${base} bg-blue-50 text-blue-600`}>Viewed</button>;
    return <button onClick={onClick} className={`${base} bg-yellow-50 text-yellow-600`}>Pending</button>;
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
    const [activeTab, setActiveTab] = useState<"guests" | "history">("guests");
    const [rsvpHistory, setRsvpHistory] = useState<RSVPHistoryEntry[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [sortField, setSortField] = useState<SortField>("household");
    const [sortDir, setSortDir] = useState<SortDir>("asc");
    const [secondarySort, setSecondarySort] = useState(true);
    const [pageVisibility, setPageVisibility] = useState<Array<{ slug: string; label: string; hidden: boolean }>>([]);
    const [pagesLoading, setPagesLoading] = useState(false);
    const [pagesError, setPagesError] = useState<string | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [guestSearch, setGuestSearch] = useState("");

    // Inline editing state
    const [rsvpPopover, setRsvpPopover] = useState<RsvpPopover | null>(null);
    const [textEdit, setTextEdit] = useState<TextEdit | null>(null);
    const [expandedTexts, setExpandedTexts] = useState<Record<string, boolean>>({});
    const [textEditValue, setTextEditValue] = useState("");
    const [textEditSaving, setTextEditSaving] = useState(false);
    const textInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (status !== "authenticated") return;
        const timer = window.setTimeout(() => {
            void fetchData();
            void fetchPageVisibility();
            void fetchHistory();
        }, 0);
        return () => window.clearTimeout(timer);
    }, [status]);

    // Focus input when text edit opens
    useEffect(() => {
        if (textEdit) {
            setTextEditValue(textEdit.value);
            setTimeout(() => {
                if (textInputRef.current) {
                    textInputRef.current.focus();
                    textInputRef.current.select();
                }
            }, 10);
        }
    }, [textEdit]);

    // Close popovers on Escape
    useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") {
                setRsvpPopover(null);
                setTextEdit(null);
            }
        }
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

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
        } catch { /* non-critical */ }
        setHistoryLoading(false);
    }

    async function fetchData() {
        setLoading(true);
        const isMissingEnv =
            process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") ||
            !process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (isMissingEnv) { setEnvError(true); setLoading(false); return; }
        const { data, error: guestError } = await supabase.from("guests").select("*, households(id, name)");
        if (guestError) { setError(guestError.message); }
        else { setGuests(data as unknown as Guest[]); setError(null); }
        setLoading(false);
    }

    async function handleImport() {
        setImporting(true);
        setImportMessage("");
        const allRows = importText.split("\n").filter((row) => row.trim());
        const firstCell = (allRows[0] || "").split("\t")[0] || (allRows[0] || "").split(",")[0];
        const rows = firstCell.toLowerCase().includes("household") ? allRows.slice(1) : allRows;
        if (rows.length === 0) { setImportMessage("No data found."); setImporting(false); return; }
        let successCount = 0; let errorCount = 0;
        for (const row of rows) {
            const cols = row.split("\t").map((v) => v.trim());
            const finalCols = cols.length >= 3 ? cols : row.split(",").map((v) => v.trim());
            if (finalCols.length < 3) { errorCount++; continue; }
            const [householdName, firstName, lastName] = finalCols;
            const rawSuffix = (finalCols[3] || "").trim();
            const suffix = rawSuffix === "" || rawSuffix === "#N/A" ? null : rawSuffix;
            const rawNicknames = (finalCols[4] || "").trim();
            const nicknames = rawNicknames === "" || rawNicknames === "#N/A" ? null : rawNicknames;
            try {
                let { data: household } = await supabase.from("households").select("id").eq("name", householdName).single();
                if (!household) {
                    const { data: nh, error: he } = await supabase.from("households").insert({ name: householdName }).select().single();
                    if (he) throw he;
                    household = nh;
                }
                if (!household) throw new Error("Failed to resolve household");
                const { error: ge } = await supabase.from("guests").insert({ first_name: firstName, last_name: lastName, suffix, nicknames, household_id: household.id });
                if (ge) throw ge;
                successCount++;
            } catch (err) { console.error(err); errorCount++; }
        }
        setImportMessage(`Import complete. Added ${successCount} guests.${errorCount > 0 ? ` Failed: ${errorCount} rows.` : ""}`);
        setImportText("");
        setImporting(false);
        void fetchData();
    }

    async function togglePageVisibility(slug: string, hidden: boolean) {
        setPageVisibility((prev) => prev.map((p) => (p.slug === slug ? { ...p, hidden } : p)));
        try {
            await fetch("/api/admin/page-visibility", {
                method: "POST", credentials: "same-origin",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, hidden }),
            });
        } catch { void fetchPageVisibility(); }
    }

    function handleSort(field: SortField) {
        if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        else { setSortField(field); setSortDir("asc"); }
    }

    // ── Inline edit helpers ──────────────────────────────────────────────────

    function openRsvp(e: React.MouseEvent, guest: Guest, householdId?: string) {
        if (!editMode) return;
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setRsvpPopover({
            anchorRect: rect,
            current: guest.attending,
            guestId: guest.id,
            isPlusOne: guest.is_plus_one,
            plusOneClaimed: guest.plus_one_claimed,
        });
    }

    function openHouseholdRsvp(e: React.MouseEvent, current: boolean | null, householdId: string) {
        if (!editMode) return;
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setRsvpPopover({ anchorRect: rect, current, householdId });
    }

    function openTextEdit(
        e: React.MouseEvent<HTMLElement>,
        guestId: string,
        field: string,
        value: string | null,
        label: string,
        multiline: boolean,
        householdId?: string
    ) {
        if (!editMode) return;
        e.stopPropagation();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setTextEdit({ anchorRect: rect, guestId, field, value: value ?? "", multiline, label, householdId });
    }

    async function saveRsvp(attending: boolean | null) {
        if (!rsvpPopover) return;
        try {
            if (rsvpPopover.guestId) {
                await fetch("/api/admin/guests", {
                    method: "PATCH", credentials: "same-origin",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: rsvpPopover.guestId, updates: { attending } }),
                });
                setGuests((prev) => prev.map((g) => g.id === rsvpPopover.guestId ? { ...g, attending } : g));
            } else if (rsvpPopover.householdId) {
                await fetch("/api/admin/guests", {
                    method: "PATCH", credentials: "same-origin",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ household_id: rsvpPopover.householdId, household_attending: attending }),
                });
                setGuests((prev) => prev.map((g) => g.households.id === rsvpPopover.householdId ? { ...g, attending } : g));
            }
        } catch (err) { console.error(err); }
        setRsvpPopover(null);
    }

    async function saveText() {
        if (!textEdit) return;
        setTextEditSaving(true);
        const value = textEditValue.trim() || null;
        try {
            if (textEdit.householdId) {
                await fetch("/api/admin/guests", {
                    method: "PATCH", credentials: "same-origin",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ household_id: textEdit.householdId, household_field: textEdit.field, household_value: value }),
                });
                setGuests((prev) => prev.map((g) => g.households.id === textEdit.householdId ? { ...g, [textEdit.field]: value } : g));
            } else {
                const updates: Record<string, string | null> = { [textEdit.field]: value };
                if (textEdit.field === "food_allergies" || textEdit.field === "dietary_restrictions") {
                    updates.food_allergies = value;
                    updates.dietary_restrictions = value;
                }
                await fetch("/api/admin/guests", {
                    method: "PATCH", credentials: "same-origin",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: textEdit.guestId, updates }),
                });
                setGuests((prev) => prev.map((g) => g.id === textEdit.guestId ? { ...g, ...updates } : g));
            }
        } catch (err) { console.error(err); }
        setTextEditSaving(false);
        setTextEdit(null);
    }

    // ── Positioning helpers ──────────────────────────────────────────────────

    function rsvpPopoverStyle(rect: DOMRect): React.CSSProperties {
        const w = 170; const h = 130;
        let left = rect.left;
        let top = rect.bottom + 6;
        if (left + w > window.innerWidth - 8) left = Math.max(8, window.innerWidth - w - 8);
        if (top + h > window.innerHeight - 8) top = rect.top - h - 6;
        return { position: "fixed", top, left, zIndex: 50, minWidth: w };
    }

    function textEditStyle(rect: DOMRect, multiline: boolean): React.CSSProperties {
        const w = Math.max(280, Math.min(rect.width, 420));
        const h = multiline ? 230 : 160;
        let left = rect.left;
        let top = rect.top;
        if (left + w > window.innerWidth - 8) left = Math.max(8, window.innerWidth - w - 8);
        if (top + h > window.innerHeight - 8) top = Math.max(8, window.innerHeight - h - 8);
        return { position: "fixed", top, left, zIndex: 50, width: w };
    }

    // ── Sort / group ─────────────────────────────────────────────────────────

    function getGroupedHouseholds() {
        const map: Record<string, Guest[]> = {};
        for (const g of guests) {
            const n = g.households?.name || "Unknown";
            if (!map[n]) map[n] = [];
            map[n].push(g);
        }
        let entries = Object.entries(map).map(([householdName, householdGuests]) => ({ householdName, householdGuests }));
        if (sortField === "rsvp") {
            entries.sort((a, b) => {
                const sa = getHouseholdRsvpScore(a.householdGuests);
                const sb2 = getHouseholdRsvpScore(b.householdGuests);
                if (sa !== sb2) return sortDir === "asc" ? sb2 - sa : sa - sb2;
                return a.householdName.localeCompare(b.householdName);
            });
        } else if (sortField === "name") {
            for (const e of entries) e.householdGuests.sort((a, b) => `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`));
            entries.sort((a, b) => {
                const af = a.householdGuests[0]; const bf = b.householdGuests[0];
                const av = af ? `${af.last_name} ${af.first_name}` : "";
                const bv = bf ? `${bf.last_name} ${bf.first_name}` : "";
                return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
            });
        } else {
            entries.sort((a, b) => sortDir === "asc" ? a.householdName.localeCompare(b.householdName) : b.householdName.localeCompare(a.householdName));
        }
        return entries;
    }

    function getSortedGuests() {
        return [...guests].sort((a, b) => {
            if (sortField === "rsvp") {
                const order = (g: Guest) => g.attending === true ? 0 : g.attending === null ? 1 : 2;
                return sortDir === "asc" ? order(a) - order(b) : order(b) - order(a);
            }
            const vals: Record<SortField, string> = {
                name: `${a.last_name} ${a.first_name}`.toLowerCase(),
                household: (a.households?.name || "").toLowerCase(),
                plusone: (a.plus_one_name || "").toLowerCase(),
                rsvp: "",
            };
            const valsB: Record<SortField, string> = {
                name: `${b.last_name} ${b.first_name}`.toLowerCase(),
                household: (b.households?.name || "").toLowerCase(),
                plusone: (b.plus_one_name || "").toLowerCase(),
                rsvp: "",
            };
            const cmp = vals[sortField].localeCompare(valsB[sortField]);
            return sortDir === "asc" ? cmp : -cmp;
        });
    }

    const totalInvited = guests.length;
    const totalAttending = guests.filter((g) => g.attending === true).length;
    const totalDeclined = guests.filter((g) => g.attending === false).length;
    const totalPending = guests.filter((g) => g.attending === null).length;
    const groupByHousehold = secondarySort;

    function SortIcon({ field }: { field: SortField }) {
        if (sortField !== field) return <span className="ml-1 text-gray-300 text-[10px]">↕</span>;
        return <span className="ml-1 text-primary text-[10px]">{sortDir === "asc" ? "↑" : "↓"}</span>;
    }
    function Th({ field, children }: { field: SortField; children: React.ReactNode }) {
        return (
            <th className="px-6 py-4 font-normal cursor-pointer select-none hover:text-primary transition-colors whitespace-nowrap" onClick={() => handleSort(field)}>
                {children}<SortIcon field={field} />
            </th>
        );
    }

    const editCellCls = editMode ? "cursor-text hover:bg-primary/5 rounded transition-colors" : "";
    const editCellTitle = editMode ? "Click to edit" : undefined;

    if (status === "checking") return <div className="min-h-screen bg-base" />;
    if (status !== "authenticated") return <AdminLoginCard onLogin={login} />;

    return (
        <AdminFrame section="rsvp" role={role} title="Admin Dashboard" onLogout={logout}>

            {/* ── RSVP dropdown popover ── */}
            {rsvpPopover && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setRsvpPopover(null)} />
                    <div className="overflow-hidden rounded-xl border border-primary/12 bg-white shadow-2xl" style={rsvpPopoverStyle(rsvpPopover.anchorRect)}>
                        {/* Not Added option — only for plus ones */}
                        {rsvpPopover.isPlusOne && (
                            <button
                                onClick={() => {
                                    if (rsvpPopover.guestId) {
                                        void fetch("/api/admin/guests", {
                                            method: "PATCH", credentials: "same-origin",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ id: rsvpPopover.guestId, updates: { attending: null, plus_one_claimed: false } }),
                                        }).then(() => {
                                            setGuests((prev) => prev.map((g) => g.id === rsvpPopover.guestId ? { ...g, attending: null, plus_one_claimed: false } : g));
                                            setRsvpPopover(null);
                                        });
                                    }
                                }}
                                className={`flex w-full items-center gap-2.5 px-5 py-3 text-left text-sm transition-colors text-gray-500 hover:bg-gray-50`}
                            >
                                <span className={`text-[8px] ${!rsvpPopover.current && !rsvpPopover.plusOneClaimed ? "opacity-100" : "opacity-0"}`}>●</span>
                                Not Added
                            </button>
                        )}
                        {([
                            { label: "Attending", value: true as boolean | null, cls: "text-green-700 hover:bg-green-50" },
                            { label: "Declined", value: false as boolean | null, cls: "text-red-700 hover:bg-red-50" },
                            { label: "Pending", value: null as boolean | null, cls: "text-yellow-600 hover:bg-yellow-50" },
                            { label: "Viewed", value: "viewed" as unknown as boolean | null, cls: "text-blue-600 hover:bg-blue-50" },
                        ] as const).map(({ label, value, cls }) => (
                            <button
                                key={label}
                                onClick={() => {
                                    if (label === "Viewed") {
                                        if (rsvpPopover.guestId) {
                                            void fetch("/api/admin/guests", {
                                                method: "PATCH", credentials: "same-origin",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ id: rsvpPopover.guestId, updates: { attending: null, viewed_rsvp: true } }),
                                            }).then(() => {
                                                setGuests((prev) => prev.map((g) => g.id === rsvpPopover.guestId ? { ...g, attending: null, viewed_rsvp: true } : g));
                                                setRsvpPopover(null);
                                            });
                                        }
                                    } else {
                                        void saveRsvp(value);
                                    }
                                }}
                                className={`flex w-full items-center gap-2.5 px-5 py-3 text-left text-sm transition-colors ${cls}`}
                            >
                                <span className={`text-[8px] ${rsvpPopover.current === value ? "opacity-100" : "opacity-0"}`}>●</span>
                                {label}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* ── Text / multiline edit popover ── */}
            {textEdit && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setTextEdit(null)} />
                    <div className="rounded-xl border border-primary/20 bg-white p-3 shadow-2xl" style={textEditStyle(textEdit.anchorRect, textEdit.multiline)}>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-text-secondary">{textEdit.label}</p>
                        {textEdit.multiline ? (
                            <textarea
                                ref={(el) => { textInputRef.current = el; }}
                                rows={4}
                                className="w-full resize-none rounded-lg border border-primary/12 bg-surface/60 px-3 py-2 text-sm text-text-primary focus:border-primary/40 focus:outline-none"
                                value={textEditValue}
                                onChange={(e) => setTextEditValue(e.target.value)}
                            />
                        ) : (
                            <input
                                ref={(el) => { textInputRef.current = el; }}
                                type="text"
                                className="w-full rounded-lg border border-primary/12 bg-surface/60 px-3 py-2 text-sm text-text-primary focus:border-primary/40 focus:outline-none"
                                value={textEditValue}
                                onChange={(e) => setTextEditValue(e.target.value)}
                                onKeyDown={(e) => { if (e.key === "Enter") void saveText(); }}
                            />
                        )}
                        <div className="mt-2 flex justify-end gap-1.5">
                            <button onClick={() => setTextEdit(null)} className="rounded-lg px-3 py-1.5 text-sm text-text-secondary hover:bg-surface/80 transition-colors" title="Cancel">✕</button>
                            <button onClick={() => void saveText()} disabled={textEditSaving} className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 transition-colors" title="Save">
                                {textEditSaving ? "…" : "✓"}
                            </button>
                        </div>
                    </div>
                </>
            )}

            {envError && <div className="rounded-[1.5rem] border border-red-200 bg-red-50 p-6 text-red-900">Add valid Supabase keys to `.env.local`.</div>}
            {error && <div className="mb-8 rounded-[1.5rem] border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div>}

            {loading ? (
                <div className="py-16 text-center text-text-secondary">Loading guest data...</div>
            ) : (
                <div className="space-y-10">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                        {[
                            { label: "Total Invited", value: totalInvited, color: "text-primary" },
                            { label: "Attending", value: totalAttending, color: "text-green-700" },
                            { label: "Declined", value: totalDeclined, color: "text-red-700" },
                            { label: "Pending", value: totalPending, color: "text-yellow-600" },
                        ].map(({ label, value, color }) => (
                            <div key={label} className="rounded-[1.5rem] border border-primary/8 bg-[#fbf8f3] px-4 py-4 md:p-6 text-center">
                                <h3 className="text-[10px] md:text-xs uppercase tracking-widest text-text-secondary">{label}</h3>
                                <p className={`mt-2 text-2xl md:text-4xl font-heading ${color}`}>{value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Table card */}
                    <div className="overflow-hidden rounded-[1.8rem] border border-primary/10 bg-white shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        {/* Tab bar */}
                        <div className="flex items-center gap-6 border-b border-primary/8 bg-[#fbf8f3] px-6 py-5">
                            {(["guests", "history"] as const).map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`text-sm uppercase tracking-widest pb-1 border-b-2 transition-colors capitalize ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-primary"}`}>
                                    {tab}
                                    {tab === "history" && rsvpHistory.length > 0 && (
                                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{rsvpHistory.length}</span>
                                    )}
                                </button>
                            ))}

                            {activeTab === "guests" && (
                                <div className="ml-auto flex items-center gap-2">
                                    <button
                                        onClick={() => setSecondarySort((v) => !v)}
                                        className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${groupByHousehold ? "bg-primary text-white" : "border border-primary/20 text-primary hover:bg-primary/5"}`}
                                    >
                                        Group by Household
                                    </button>
                                    <button
                                        onClick={() => { setEditMode((v) => !v); setRsvpPopover(null); setTextEdit(null); }}
                                        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs uppercase tracking-widest transition-colors ${editMode ? "bg-accent text-white" : "border border-primary/20 text-primary hover:bg-primary/5"}`}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden>
                                            <path d="M9.5 1.5l3 3L4 13H1v-3L9.5 1.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                                        </svg>
                                        {editMode ? "Done" : "Edit"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {activeTab === "guests" ? (
                            <>
                                {editMode && (
                                    <div className="border-b border-primary/8 bg-accent/5 px-6 py-2 text-xs text-primary/60">
                                        Click any <span className="font-semibold text-primary">RSVP badge</span> to change status · Click any <span className="font-semibold text-primary">text cell</span> to edit it
                                    </div>
                                )}
                                <div className="border-b border-primary/8 px-4 py-2">
                                    <input
                                        type="text"
                                        value={guestSearch}
                                        onChange={(e) => setGuestSearch(e.target.value)}
                                        placeholder="Search guests..."
                                        className="w-full rounded-lg border border-primary/12 bg-surface/60 px-3 py-1.5 text-sm text-text-primary placeholder:text-text-secondary/50 focus:border-primary/40 focus:outline-none"
                                    />
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="border-b border-gray-200 bg-surface/80 text-xs uppercase tracking-widest text-text-secondary">
                                            <tr>
                                                <Th field="name">Guest Name</Th>
                                                <Th field="rsvp">RSVP</Th>
                                                <th className="px-6 py-4 font-normal whitespace-nowrap">Allergies</th>
                                                <th className="px-6 py-4 font-normal whitespace-nowrap">Song Request</th>
                                                <th className="px-6 py-4 font-normal whitespace-nowrap">Advice</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {groupByHousehold ? (
                                                getGroupedHouseholds().filter(({ householdName, householdGuests }) => {
                                                    if (!guestSearch.trim()) return true;
                                                    const q = guestSearch.toLowerCase();
                                                    return householdName.toLowerCase().includes(q) || householdGuests.some((g) => `${g.first_name} ${g.last_name}`.toLowerCase().includes(q));
                                                }).map(({ householdName, householdGuests }) => {
                                                    const aggAttending = aggregateAttending(householdGuests);
                                                    const hhId = householdGuests[0]?.households.id;
                                                    const repGuestId = householdGuests[0]?.id ?? "";
                                                    const householdSong = householdGuests.find((g) => g.song_request)?.song_request ?? null;
                                                    const householdAdvice = householdGuests.find((g) => g.advice)?.advice ?? null;
                                                    return (
                                                        <React.Fragment key={householdName}>
                                                            {/* Household header */}
                                                            <tr className="border-t-2 border-gray-100 bg-surface/40">
                                                                <td colSpan={1} className="px-6 py-3 font-heading font-bold text-primary">{householdName}</td>
                                                                <td className="px-6 py-3">
                                                                    <RsvpBadge
                                                                        attending={aggAttending}
                                                                        editable={editMode}
                                                                        onClick={(e) => hhId && openHouseholdRsvp(e, aggAttending, hhId)}
                                                                    />
                                                                </td>
                                                                <td className="px-6 py-3 text-text-secondary/40 text-xs">—</td>
                                                                <td
                                                                    className={`px-6 py-3 italic text-text-secondary text-xs ${editCellCls}`}
                                                                    title={editCellTitle}
                                                                    onClick={(e) => openTextEdit(e, repGuestId, "song_request", householdSong, "Song Request", false, hhId)}
                                                                >
                                                                    <TruncatedText text={householdSong} cellKey={`${hhId}:song`} expandedTexts={expandedTexts} setExpandedTexts={setExpandedTexts} />
                                                                </td>
                                                                <td
                                                                    className={`px-6 py-3 text-text-secondary text-xs leading-relaxed ${editCellCls}`}
                                                                    title={editCellTitle}
                                                                    onClick={(e) => openTextEdit(e, repGuestId, "advice", householdAdvice, "Advice", true, hhId)}
                                                                >
                                                                    <TruncatedText text={householdAdvice} cellKey={`${hhId}:advice`} expandedTexts={expandedTexts} setExpandedTexts={setExpandedTexts} />
                                                                </td>
                                                            </tr>
                                                            {/* Guest sub-rows */}
                                                            {householdGuests.map((guest) => (
                                                                <tr key={guest.id} className={`hover:bg-surface/10 transition-colors ${guest.is_plus_one ? "border-l-[3px] border-l-amber-400 bg-amber-50/20" : ""}`}>
                                                                    <td className="px-6 py-3 pl-10 font-medium text-text-secondary">
                                                                        {guest.first_name} {guest.last_name}
                                                                        {guest.suffix ? <span className="ml-1 text-gray-400">{guest.suffix}</span> : null}
                                                                        {guest.is_plus_one && <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 border border-amber-300">+1</span>}
                                                                    </td>
                                                                    <td className="px-6 py-3">
                                                                        <RsvpBadge
                                                                            attending={guest.attending}
                                                                            viewedRsvp={guest.viewed_rsvp}
                                                                            isPlusOne={guest.is_plus_one}
                                                                            plusOneClaimed={guest.plus_one_claimed}
                                                                            editable={editMode}
                                                                            onClick={(e) => openRsvp(e, guest)}
                                                                        />
                                                                    </td>
                                                                    <td
                                                                        className={`px-6 py-3 text-text-secondary text-xs ${editCellCls}`}
                                                                        title={editCellTitle}
                                                                        onClick={(e) => openTextEdit(e, guest.id, "dietary_restrictions", guest.dietary_restrictions ?? guest.food_allergies, "Dietary restrictions / allergies", false)}
                                                                    >
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
                                                getSortedGuests().filter((g) => {
                                                    if (!guestSearch.trim()) return true;
                                                    const q = guestSearch.toLowerCase();
                                                    return `${g.first_name} ${g.last_name}`.toLowerCase().includes(q) || (g.households?.name ?? "").toLowerCase().includes(q);
                                                }).map((guest) => (
                                                    <tr key={guest.id} className={`hover:bg-surface/10 transition-colors ${guest.is_plus_one ? "border-l-[3px] border-l-amber-400 bg-amber-50/20" : ""}`}>
                                                        <td className="px-6 py-3 font-medium text-text-secondary">
                                                            {guest.first_name} {guest.last_name}
                                                            {guest.suffix ? <span className="ml-1 text-gray-400">{guest.suffix}</span> : null}
                                                            {guest.is_plus_one && <span className="ml-2 rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-700 border border-amber-300">+1</span>}
                                                        </td>
                                                        <td className="px-6 py-3">
                                                            <RsvpBadge
                                                                attending={guest.attending}
                                                                viewedRsvp={guest.viewed_rsvp}
                                                                isPlusOne={guest.is_plus_one}
                                                                plusOneClaimed={guest.plus_one_claimed}
                                                                editable={editMode}
                                                                onClick={(e) => openRsvp(e, guest)}
                                                            />
                                                        </td>
                                                        <td
                                                            className={`px-6 py-3 text-text-secondary text-xs ${editCellCls}`}
                                                            title={editCellTitle}
                                                            onClick={(e) => openTextEdit(e, guest.id, "dietary_restrictions", guest.dietary_restrictions ?? guest.food_allergies, "Dietary restrictions / allergies", false)}
                                                        >
                                                            {guest.food_allergies || guest.dietary_restrictions || <span className="text-text-secondary/40">—</span>}
                                                        </td>
                                                        <td
                                                            className={`px-6 py-3 italic text-text-secondary text-xs ${editCellCls}`}
                                                            title={editCellTitle}
                                                            onClick={(e) => openTextEdit(e, guest.id, "song_request", guest.song_request, "Song Request", false)}
                                                        >
                                                            <TruncatedText text={guest.song_request} cellKey={`${guest.id}:song`} expandedTexts={expandedTexts} setExpandedTexts={setExpandedTexts} />
                                                        </td>
                                                        <td
                                                            className={`px-6 py-3 text-text-secondary text-xs leading-relaxed ${editCellCls}`}
                                                            title={editCellTitle}
                                                            onClick={(e) => openTextEdit(e, guest.id, "advice", guest.advice, "Advice", true)}
                                                        >
                                                            <TruncatedText text={guest.advice} cellKey={`${guest.id}:advice`} expandedTexts={expandedTexts} setExpandedTexts={setExpandedTexts} />
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </>
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
                                                <tr key={entry.id} className="align-top hover:bg-surface/10 transition-colors">
                                                    <td className="px-6 py-3 text-text-secondary text-xs whitespace-nowrap">
                                                        {new Date(entry.recorded_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                        <span className="block text-text-secondary/50">{new Date(entry.recorded_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</span>
                                                    </td>
                                                    <td className="px-6 py-3 font-medium text-text-primary">{entry.guests ? `${entry.guests.first_name} ${entry.guests.last_name}` : "Unknown"}</td>
                                                    <td className="px-6 py-3 text-text-secondary text-xs">{entry.guests?.households?.name ?? "—"}</td>
                                                    <td className="px-6 py-3">
                                                        {entry.attending === true ? <span className="rounded bg-green-50 px-2 py-1 text-xs text-green-700">Attending</span> :
                                                            entry.attending === false ? <span className="rounded bg-red-50 px-2 py-1 text-xs text-red-700">Declined</span> :
                                                                <span className="text-text-secondary/40 text-xs">—</span>}
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
                                    <p className="text-sm text-text-secondary">Hidden pages show a 404 to visitors who are not logged into admin. Toggle ON to make publicly accessible.</p>
                                </div>
                                {pagesLoading ? <p className="text-sm text-text-secondary py-4">Loading...</p> :
                                    pagesError ? <p className="text-sm text-red-600 py-4">{pagesError}</p> : (
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {pageVisibility.map((page) => (
                                                <div key={page.slug} className="flex items-center justify-between rounded-xl border border-primary/8 bg-surface/60 px-5 py-4">
                                                    <div>
                                                        <p className="text-sm font-medium text-primary">{page.label}</p>
                                                        <p className="text-xs text-text-secondary mt-0.5">/{page.slug}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => void togglePageVisibility(page.slug, !page.hidden)}
                                                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${page.hidden ? "bg-gray-200" : "bg-primary"}`}
                                                        role="switch" aria-checked={!page.hidden}
                                                    >
                                                        <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${page.hidden ? "translate-x-0" : "translate-x-5"}`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                <p className="mt-6 text-xs text-text-secondary"><span className="font-medium">On</span> = visible · <span className="font-medium">Off</span> = hidden</p>
                            </div>
                        )}
                    </div>

                    {/* Import */}
                    <div className="rounded-[1.8rem] border border-primary/10 bg-white p-8 shadow-[0_12px_34px_rgba(20,42,68,0.05)]">
                        <h2 className="font-heading text-2xl text-primary">Import Guests</h2>
                        <p className="mt-3 text-sm text-text-secondary">Paste from Excel or Google Sheets: household, first name, last name, suffix, nicknames.</p>
                        {importMessage && (
                            <div className={`mt-6 rounded-[1rem] border p-4 text-sm ${importMessage.includes("Failed") ? "border-yellow-200 bg-yellow-50 text-yellow-800" : "border-green-200 bg-green-50 text-green-800"}`}>
                                {importMessage}
                            </div>
                        )}
                        <div className="mt-6 space-y-4">
                            <textarea
                                className="min-h-[150px] w-full resize-none rounded-[1rem] border border-gray-200 bg-surface p-4 font-mono text-sm focus:border-primary focus:outline-none"
                                placeholder={`The Paine Family\tAshlyn\tBimmerle\t\t\nThe Paine Family\tJeffrey\tPaine\t\t`}
                                value={importText}
                                onChange={(e) => setImportText(e.target.value)}
                            />
                            <button onClick={() => { void handleImport(); }} disabled={importing || !importText.trim()}
                                className="rounded-full bg-primary px-6 py-3 text-white hover:bg-primary/90 disabled:opacity-50 transition-colors">
                                {importing ? "Importing..." : "Run Import"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminFrame>
    );
}
