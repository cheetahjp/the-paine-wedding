"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { WEDDING, IMAGES } from "@/lib/wedding-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type SettingsMap = Record<string, unknown>;
type SaveStatus = "idle" | "saving" | "saved" | "error";

type ScheduleItem = { time: string; title: string; description: string };
type FaqItem = { q: string; a: string };
type RegistryItem = { name: string; description: string; url: string; icon: "gift" | "heart" };
type ImageOverlay = { color: string; opacity: number };
type ImageSettings = { main: string; overlay: ImageOverlay | null };
type AttireImageSettings = { src: string; overlay: ImageOverlay | null };

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchSettings(): Promise<SettingsMap> {
    const res = await fetch("/api/admin/site-settings");
    if (!res.ok) throw new Error("Failed to load settings");
    const data = await res.json() as { settings: SettingsMap };
    return data.settings;
}

async function saveSetting(key: string, value: unknown): Promise<void> {
    const res = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
    });
    if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Save failed");
    }
}

async function deleteSetting(key: string): Promise<void> {
    const res = await fetch("/api/admin/site-settings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
    });
    if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Delete failed");
    }
}

async function uploadImage(file: File, path: string): Promise<string> {
    const form = new FormData();
    form.append("file", file);
    form.append("path", path);
    const res = await fetch("/api/admin/upload-image", { method: "POST", body: form });
    if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? "Upload failed");
    }
    const data = await res.json() as { url: string };
    return data.url;
}

// ─── Small reusable UI pieces ─────────────────────────────────────────────────

function SectionHeader({
    label,
    open,
    onToggle,
}: {
    label: string;
    open: boolean;
    onToggle: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-center justify-between py-4 text-left"
        >
            <span className="text-xs font-semibold uppercase tracking-[0.28em] text-text-secondary">
                {label}
            </span>
            <span className="text-primary/40 text-lg select-none">{open ? "▲" : "▼"}</span>
        </button>
    );
}

function SaveBar({
    status,
    onSave,
    onReset,
}: {
    status: SaveStatus;
    onSave: () => void;
    onReset: () => void;
}) {
    return (
        <div className="flex items-center gap-3 pt-4 border-t border-primary/8">
            <button
                type="button"
                onClick={onSave}
                disabled={status === "saving"}
                className="rounded-full bg-primary px-5 py-2 text-xs uppercase tracking-[0.22em] text-white transition-colors hover:bg-primary/80 disabled:opacity-50"
            >
                {status === "saving" ? "Saving…" : "Save"}
            </button>
            <button
                type="button"
                onClick={onReset}
                disabled={status === "saving"}
                className="rounded-full border border-primary/12 px-5 py-2 text-xs uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary/5 disabled:opacity-50"
            >
                Reset to Default
            </button>
            {status === "saved" && (
                <span className="text-xs text-green-600 font-medium">✓ Saved</span>
            )}
            {status === "error" && (
                <span className="text-xs text-red-600 font-medium">⚠ Save failed</span>
            )}
        </div>
    );
}

function FieldRow({
    label,
    value,
    onChange,
    placeholder,
    mono,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    mono?: boolean;
}) {
    return (
        <div className="grid grid-cols-[160px_1fr] items-start gap-3 py-2">
            <label className="pt-2 text-xs text-text-secondary leading-tight">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full rounded-lg border border-primary/12 bg-white px-3 py-2 text-sm text-primary outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 ${mono ? "font-mono text-xs" : ""}`}
            />
        </div>
    );
}

function TextareaRow({
    label,
    value,
    onChange,
    rows,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    rows?: number;
}) {
    return (
        <div className="grid grid-cols-[160px_1fr] items-start gap-3 py-2">
            <label className="pt-2 text-xs text-text-secondary leading-tight">{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                rows={rows ?? 3}
                className="w-full rounded-lg border border-primary/12 bg-white px-3 py-2 text-sm text-primary outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 resize-y"
            />
        </div>
    );
}

// ─── Image Field with upload + overlay ────────────────────────────────────────

function ImageField({
    label,
    settings,
    onChange,
    storagePath,
}: {
    label: string;
    settings: ImageSettings;
    onChange: (s: ImageSettings) => void;
    storagePath: string;
}) {
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const hasOverlay = settings.overlay !== null;
    const overlay = settings.overlay ?? { color: "#0f2439", opacity: 0.3 };

    async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        setUploadError(null);
        try {
            const url = await uploadImage(file, storagePath);
            onChange({ ...settings, main: url });
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    }

    return (
        <div className="rounded-xl border border-primary/10 bg-primary/2 p-4 space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.22em] text-text-secondary">
                {label}
            </p>

            {/* Preview */}
            <div className="relative w-full h-36 rounded-lg overflow-hidden bg-primary/8">
                {settings.main && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={settings.main}
                        alt={label}
                        className="w-full h-full object-cover"
                    />
                )}
                {hasOverlay && settings.overlay && (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: settings.overlay.color,
                            opacity: settings.overlay.opacity,
                        }}
                    />
                )}
                {!settings.main && (
                    <div className="absolute inset-0 flex items-center justify-center text-text-secondary text-xs">
                        No image
                    </div>
                )}
            </div>

            {/* Current path */}
            <p className="text-xs font-mono text-text-secondary truncate">{settings.main || "—"}</p>

            {/* Upload */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="rounded-full border border-primary/20 bg-white px-4 py-1.5 text-xs uppercase tracking-[0.22em] text-primary hover:bg-primary/5 disabled:opacity-50"
                >
                    {uploading ? "Uploading…" : "Replace Image"}
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => void handleFile(e)}
                />
                {uploadError && (
                    <span className="text-xs text-red-600">{uploadError}</span>
                )}
            </div>

            {/* Overlay controls */}
            <div className="pt-2 border-t border-primary/8 space-y-2">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id={`overlay-${storagePath}`}
                        checked={hasOverlay}
                        onChange={(e) =>
                            onChange({
                                ...settings,
                                overlay: e.target.checked
                                    ? { color: "#0f2439", opacity: 0.3 }
                                    : null,
                            })
                        }
                        className="rounded"
                    />
                    <label
                        htmlFor={`overlay-${storagePath}`}
                        className="text-xs text-text-secondary"
                    >
                        Color overlay
                    </label>
                </div>

                {hasOverlay && (
                    <div className="flex items-center gap-4 pl-6">
                        <div className="flex items-center gap-2">
                            <label className="text-xs text-text-secondary">Color</label>
                            <input
                                type="color"
                                value={overlay.color}
                                onChange={(e) =>
                                    onChange({
                                        ...settings,
                                        overlay: { ...overlay, color: e.target.value },
                                    })
                                }
                                className="w-8 h-8 rounded cursor-pointer border border-primary/20"
                            />
                            <span className="text-xs font-mono text-text-secondary">
                                {overlay.color}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                            <label className="text-xs text-text-secondary whitespace-nowrap">
                                Opacity {Math.round(overlay.opacity * 100)}%
                            </label>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={Math.round(overlay.opacity * 100)}
                                onChange={(e) =>
                                    onChange({
                                        ...settings,
                                        overlay: {
                                            ...overlay,
                                            opacity: parseInt(e.target.value) / 100,
                                        },
                                    })
                                }
                                className="flex-1"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── Array editors ────────────────────────────────────────────────────────────

function ScheduleEditor({
    items,
    onChange,
}: {
    items: ScheduleItem[];
    onChange: (items: ScheduleItem[]) => void;
}) {
    function update(i: number, field: keyof ScheduleItem, value: string) {
        const next = items.map((item, idx) =>
            idx === i ? { ...item, [field]: value } : item
        );
        onChange(next);
    }

    function remove(i: number) {
        onChange(items.filter((_, idx) => idx !== i));
    }

    function add() {
        onChange([...items, { time: "", title: "", description: "" }]);
    }

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="rounded-xl border border-primary/10 bg-white p-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-secondary">#{i + 1}</span>
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="text-xs text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                    <FieldRow label="Time" value={item.time} onChange={(v) => update(i, "time", v)} placeholder="5:00 PM" />
                    <FieldRow label="Title" value={item.title} onChange={(v) => update(i, "title", v)} placeholder="Ceremony" />
                    <TextareaRow label="Description" value={item.description} onChange={(v) => update(i, "description", v)} rows={2} />
                </div>
            ))}
            <button
                type="button"
                onClick={add}
                className="rounded-full border border-primary/20 px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary hover:bg-primary/5"
            >
                + Add Event
            </button>
        </div>
    );
}

function FaqEditor({
    items,
    onChange,
}: {
    items: FaqItem[];
    onChange: (items: FaqItem[]) => void;
}) {
    function update(i: number, field: "q" | "a", value: string) {
        onChange(items.map((item, idx) => (idx === i ? { ...item, [field]: value } : item)));
    }

    function remove(i: number) {
        onChange(items.filter((_, idx) => idx !== i));
    }

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="rounded-xl border border-primary/10 bg-white p-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-secondary">Q{i + 1}</span>
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="text-xs text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                    <FieldRow label="Question" value={item.q} onChange={(v) => update(i, "q", v)} />
                    <TextareaRow label="Answer" value={item.a} onChange={(v) => update(i, "a", v)} rows={2} />
                </div>
            ))}
            <button
                type="button"
                onClick={() => onChange([...items, { q: "", a: "" }])}
                className="rounded-full border border-primary/20 px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary hover:bg-primary/5"
            >
                + Add FAQ
            </button>
        </div>
    );
}

function RegistryEditor({
    items,
    onChange,
}: {
    items: RegistryItem[];
    onChange: (items: RegistryItem[]) => void;
}) {
    function update(i: number, field: keyof RegistryItem, value: string) {
        onChange(
            items.map((item, idx) =>
                idx === i ? { ...item, [field]: value } : item
            )
        );
    }

    function remove(i: number) {
        onChange(items.filter((_, idx) => idx !== i));
    }

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="rounded-xl border border-primary/10 bg-white p-4 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-text-secondary">{item.name || `Item ${i + 1}`}</span>
                        <button
                            type="button"
                            onClick={() => remove(i)}
                            className="text-xs text-red-500 hover:text-red-700"
                        >
                            Remove
                        </button>
                    </div>
                    <FieldRow label="Name" value={item.name} onChange={(v) => update(i, "name", v)} placeholder="Amazon" />
                    <FieldRow label="Description" value={item.description} onChange={(v) => update(i, "description", v)} />
                    <FieldRow label="URL" value={item.url} onChange={(v) => update(i, "url", v)} mono placeholder="https://..." />
                    <div className="grid grid-cols-[160px_1fr] items-start gap-3 py-2">
                        <label className="pt-2 text-xs text-text-secondary">Icon</label>
                        <select
                            value={item.icon}
                            onChange={(e) => update(i, "icon", e.target.value)}
                            className="w-full rounded-lg border border-primary/12 bg-white px-3 py-2 text-sm text-primary outline-none focus:border-primary/40"
                        >
                            <option value="gift">Gift</option>
                            <option value="heart">Heart</option>
                        </select>
                    </div>
                </div>
            ))}
            <button
                type="button"
                onClick={() =>
                    onChange([...items, { name: "", description: "", url: "", icon: "gift" }])
                }
                className="rounded-full border border-primary/20 px-4 py-2 text-xs uppercase tracking-[0.22em] text-primary hover:bg-primary/5"
            >
                + Add Registry
            </button>
        </div>
    );
}

// ─── Section wrapper (collapsible) ────────────────────────────────────────────

function ContentSection({
    label,
    defaultOpen,
    children,
}: {
    label: string;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen ?? false);
    return (
        <div className="border-b border-primary/10 last:border-0">
            <SectionHeader label={label} open={open} onToggle={() => setOpen((o) => !o)} />
            {open && <div className="pb-6">{children}</div>}
        </div>
    );
}

// ─── Hooks for per-section save state ─────────────────────────────────────────

function useSaveStatus() {
    const [status, setStatus] = useState<SaveStatus>("idle");
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const trigger = useCallback(async (fn: () => Promise<void>) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setStatus("saving");
        try {
            await fn();
            setStatus("saved");
            timerRef.current = setTimeout(() => setStatus("idle"), 2500);
        } catch {
            setStatus("error");
            timerRef.current = setTimeout(() => setStatus("idle"), 4000);
        }
    }, []);

    return { status, trigger };
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function ContentAdminPanel() {
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // ── Event / Couple ──
    const [coupleNames, setCoupleNames] = useState(WEDDING.couple.names);
    const [dateDisplay, setDateDisplay] = useState(WEDDING.date.display);
    const [dateDayOfWeek, setDateDayOfWeek] = useState(WEDDING.date.dayOfWeek);
    const [rsvpDeadline, setRsvpDeadline] = useState(WEDDING.date.rsvpDeadline);
    const [rsvpDeadlineIso, setRsvpDeadlineIso] = useState(WEDDING.date.rsvpDeadlineIso);
    const eventSave = useSaveStatus();

    // ── Venue ──
    const [venueName, setVenueName] = useState(WEDDING.venue.name);
    const [venueAddress, setVenueAddress] = useState(WEDDING.venue.address);
    const [venueCity, setVenueCity] = useState(WEDDING.venue.city);
    const [venueCityDisplay, setVenueCityDisplay] = useState(WEDDING.venue.cityDisplay);
    const [venueFullAddress, setVenueFullAddress] = useState(WEDDING.venue.fullAddress);
    const [venueMapsUrl, setVenueMapsUrl] = useState(WEDDING.venue.mapsUrl);
    const [venueMapsEmbed, setVenueMapsEmbed] = useState(WEDDING.venue.mapsEmbedSrc);
    const [ceremonyTime, setCeremonyTime] = useState(WEDDING.venue.ceremonyTime);
    const [cocktailTime, setCocktailTime] = useState(WEDDING.venue.cocktailTime);
    const [receptionTime, setReceptionTime] = useState(WEDDING.venue.receptionTime);
    const [sendOffTime, setSendOffTime] = useState(WEDDING.venue.sendOffTime);
    const [parking, setParking] = useState(WEDDING.venue.parking);
    const venueSave = useSaveStatus();

    // ── Dress Code ──
    const [dcShort, setDcShort] = useState(WEDDING.dresscode.short);
    const [dcSummary, setDcSummary] = useState(WEDDING.dresscode.summary);
    const [dcLadies, setDcLadies] = useState(WEDDING.dresscode.ladies);
    const [dcGents, setDcGents] = useState(WEDDING.dresscode.gentlemen);
    const dresscodeSave = useSaveStatus();

    // ── Schedule ──
    const [schedule, setSchedule] = useState<ScheduleItem[]>(WEDDING.schedule);
    const scheduleSave = useSaveStatus();

    // ── FAQ ──
    const [faq, setFaq] = useState<FaqItem[]>(WEDDING.faq);
    const faqSave = useSaveStatus();

    // ── Registry ──
    const [registry, setRegistry] = useState<RegistryItem[]>(WEDDING.registry as RegistryItem[]);
    const registrySave = useSaveStatus();

    // ── Hero image ──
    const [heroSettings, setHeroSettings] = useState<ImageSettings>({
        main: IMAGES.hero.main,
        overlay: null,
    });
    const heroSave = useSaveStatus();

    // ── Meta ──
    const [metaTitle, setMetaTitle] = useState(WEDDING.meta.title);
    const [metaDescription, setMetaDescription] = useState(WEDDING.meta.description);
    const metaSave = useSaveStatus();

    // ── Load saved settings ──────────────────────────────────────────────────

    useEffect(() => {
        void (async () => {
            try {
                const settings = await fetchSettings();

                // Event
                if (typeof settings["couple.names"] === "string") setCoupleNames(settings["couple.names"]);
                if (typeof settings["date.display"] === "string") setDateDisplay(settings["date.display"]);
                if (typeof settings["date.dayOfWeek"] === "string") setDateDayOfWeek(settings["date.dayOfWeek"]);
                if (typeof settings["date.rsvpDeadline"] === "string") setRsvpDeadline(settings["date.rsvpDeadline"]);
                if (typeof settings["date.rsvpDeadlineIso"] === "string") setRsvpDeadlineIso(settings["date.rsvpDeadlineIso"]);

                // Venue
                if (typeof settings["venue.name"] === "string") setVenueName(settings["venue.name"]);
                if (typeof settings["venue.address"] === "string") setVenueAddress(settings["venue.address"]);
                if (typeof settings["venue.city"] === "string") setVenueCity(settings["venue.city"]);
                if (typeof settings["venue.cityDisplay"] === "string") setVenueCityDisplay(settings["venue.cityDisplay"]);
                if (typeof settings["venue.fullAddress"] === "string") setVenueFullAddress(settings["venue.fullAddress"]);
                if (typeof settings["venue.mapsUrl"] === "string") setVenueMapsUrl(settings["venue.mapsUrl"]);
                if (typeof settings["venue.mapsEmbedSrc"] === "string") setVenueMapsEmbed(settings["venue.mapsEmbedSrc"]);
                if (typeof settings["venue.ceremonyTime"] === "string") setCeremonyTime(settings["venue.ceremonyTime"]);
                if (typeof settings["venue.cocktailTime"] === "string") setCocktailTime(settings["venue.cocktailTime"]);
                if (typeof settings["venue.receptionTime"] === "string") setReceptionTime(settings["venue.receptionTime"]);
                if (typeof settings["venue.sendOffTime"] === "string") setSendOffTime(settings["venue.sendOffTime"]);
                if (typeof settings["venue.parking"] === "string") setParking(settings["venue.parking"]);

                // Dress code
                if (typeof settings["dresscode.short"] === "string") setDcShort(settings["dresscode.short"]);
                if (typeof settings["dresscode.summary"] === "string") setDcSummary(settings["dresscode.summary"]);
                if (typeof settings["dresscode.ladies"] === "string") setDcLadies(settings["dresscode.ladies"]);
                if (typeof settings["dresscode.gentlemen"] === "string") setDcGents(settings["dresscode.gentlemen"]);

                // Arrays
                if (Array.isArray(settings["schedule"])) setSchedule(settings["schedule"] as ScheduleItem[]);
                if (Array.isArray(settings["faq"])) setFaq(settings["faq"] as FaqItem[]);
                if (Array.isArray(settings["registry"])) setRegistry(settings["registry"] as RegistryItem[]);

                // Images
                const heroRaw = settings["images.hero"];
                if (heroRaw && typeof heroRaw === "object" && !Array.isArray(heroRaw)) {
                    const h = heroRaw as Partial<ImageSettings>;
                    setHeroSettings({
                        main: typeof h.main === "string" ? h.main : IMAGES.hero.main,
                        overlay: h.overlay ?? null,
                    });
                }

                // Meta
                if (typeof settings["meta.title"] === "string") setMetaTitle(settings["meta.title"]);
                if (typeof settings["meta.description"] === "string") setMetaDescription(settings["meta.description"]);
            } catch (err) {
                setLoadError(err instanceof Error ? err.message : "Failed to load settings");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // ── Save handlers ────────────────────────────────────────────────────────

    async function saveEvent() {
        await eventSave.trigger(async () => {
            await Promise.all([
                saveSetting("couple.names", coupleNames),
                saveSetting("date.display", dateDisplay),
                saveSetting("date.dayOfWeek", dateDayOfWeek),
                saveSetting("date.rsvpDeadline", rsvpDeadline),
                saveSetting("date.rsvpDeadlineIso", rsvpDeadlineIso),
            ]);
        });
    }

    async function resetEvent() {
        await eventSave.trigger(async () => {
            await Promise.all([
                deleteSetting("couple.names"),
                deleteSetting("date.display"),
                deleteSetting("date.dayOfWeek"),
                deleteSetting("date.rsvpDeadline"),
                deleteSetting("date.rsvpDeadlineIso"),
            ]);
        });
        setCoupleNames(WEDDING.couple.names);
        setDateDisplay(WEDDING.date.display);
        setDateDayOfWeek(WEDDING.date.dayOfWeek);
        setRsvpDeadline(WEDDING.date.rsvpDeadline);
        setRsvpDeadlineIso(WEDDING.date.rsvpDeadlineIso);
    }

    async function saveVenue() {
        await venueSave.trigger(async () => {
            await Promise.all([
                saveSetting("venue.name", venueName),
                saveSetting("venue.address", venueAddress),
                saveSetting("venue.city", venueCity),
                saveSetting("venue.cityDisplay", venueCityDisplay),
                saveSetting("venue.fullAddress", venueFullAddress),
                saveSetting("venue.mapsUrl", venueMapsUrl),
                saveSetting("venue.mapsEmbedSrc", venueMapsEmbed),
                saveSetting("venue.ceremonyTime", ceremonyTime),
                saveSetting("venue.cocktailTime", cocktailTime),
                saveSetting("venue.receptionTime", receptionTime),
                saveSetting("venue.sendOffTime", sendOffTime),
                saveSetting("venue.parking", parking),
            ]);
        });
    }

    async function resetVenue() {
        const keys = ["venue.name","venue.address","venue.city","venue.cityDisplay","venue.fullAddress","venue.mapsUrl","venue.mapsEmbedSrc","venue.ceremonyTime","venue.cocktailTime","venue.receptionTime","venue.sendOffTime","venue.parking"];
        await venueSave.trigger(async () => {
            await Promise.all(keys.map(deleteSetting));
        });
        setVenueName(WEDDING.venue.name);
        setVenueAddress(WEDDING.venue.address);
        setVenueCity(WEDDING.venue.city);
        setVenueCityDisplay(WEDDING.venue.cityDisplay);
        setVenueFullAddress(WEDDING.venue.fullAddress);
        setVenueMapsUrl(WEDDING.venue.mapsUrl);
        setVenueMapsEmbed(WEDDING.venue.mapsEmbedSrc);
        setCeremonyTime(WEDDING.venue.ceremonyTime);
        setCocktailTime(WEDDING.venue.cocktailTime);
        setReceptionTime(WEDDING.venue.receptionTime);
        setSendOffTime(WEDDING.venue.sendOffTime);
        setParking(WEDDING.venue.parking);
    }

    async function saveDresscode() {
        await dresscodeSave.trigger(async () => {
            await Promise.all([
                saveSetting("dresscode.short", dcShort),
                saveSetting("dresscode.summary", dcSummary),
                saveSetting("dresscode.ladies", dcLadies),
                saveSetting("dresscode.gentlemen", dcGents),
            ]);
        });
    }

    async function resetDresscode() {
        await dresscodeSave.trigger(async () => {
            await Promise.all([
                deleteSetting("dresscode.short"),
                deleteSetting("dresscode.summary"),
                deleteSetting("dresscode.ladies"),
                deleteSetting("dresscode.gentlemen"),
            ]);
        });
        setDcShort(WEDDING.dresscode.short);
        setDcSummary(WEDDING.dresscode.summary);
        setDcLadies(WEDDING.dresscode.ladies);
        setDcGents(WEDDING.dresscode.gentlemen);
    }

    async function saveHero() {
        await heroSave.trigger(async () => {
            await saveSetting("images.hero", heroSettings);
        });
    }

    async function resetHero() {
        await heroSave.trigger(async () => {
            await deleteSetting("images.hero");
        });
        setHeroSettings({ main: IMAGES.hero.main, overlay: null });
    }

    async function saveMeta() {
        await metaSave.trigger(async () => {
            await Promise.all([
                saveSetting("meta.title", metaTitle),
                saveSetting("meta.description", metaDescription),
            ]);
        });
    }

    async function resetMeta() {
        await metaSave.trigger(async () => {
            await Promise.all([deleteSetting("meta.title"), deleteSetting("meta.description")]);
        });
        setMetaTitle(WEDDING.meta.title);
        setMetaDescription(WEDDING.meta.description);
    }

    // ── Render ───────────────────────────────────────────────────────────────

    if (loading) {
        return (
            <div className="py-16 text-center text-text-secondary text-sm">
                Loading content settings…
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="py-16 text-center text-red-600 text-sm">
                ⚠ {loadError}
            </div>
        );
    }

    return (
        <div className="space-y-0 divide-y divide-primary/8">
            {/* ── Event Details ─────────────────────────────────────────── */}
            <ContentSection label="Event Details" defaultOpen>
                <div className="space-y-1">
                    <FieldRow label="Couple names" value={coupleNames} onChange={setCoupleNames} placeholder="Ashlyn & Jeffrey" />
                    <FieldRow label="Date display" value={dateDisplay} onChange={setDateDisplay} placeholder="September 26, 2026" />
                    <FieldRow label="Day of week" value={dateDayOfWeek} onChange={setDateDayOfWeek} placeholder="Saturday" />
                    <FieldRow label="RSVP deadline" value={rsvpDeadline} onChange={setRsvpDeadline} placeholder="August 1, 2026" />
                    <FieldRow label="RSVP deadline (ISO)" value={rsvpDeadlineIso} onChange={setRsvpDeadlineIso} placeholder="2026-08-01" mono />
                </div>
                <SaveBar status={eventSave.status} onSave={() => void saveEvent()} onReset={() => void resetEvent()} />
            </ContentSection>

            {/* ── Venue ─────────────────────────────────────────────────── */}
            <ContentSection label="Venue">
                <div className="space-y-1">
                    <FieldRow label="Venue name" value={venueName} onChange={setVenueName} />
                    <FieldRow label="Address" value={venueAddress} onChange={setVenueAddress} />
                    <FieldRow label="City" value={venueCity} onChange={setVenueCity} />
                    <FieldRow label="City (display)" value={venueCityDisplay} onChange={setVenueCityDisplay} />
                    <FieldRow label="Full address" value={venueFullAddress} onChange={setVenueFullAddress} />
                    <FieldRow label="Google Maps URL" value={venueMapsUrl} onChange={setVenueMapsUrl} mono />
                    <TextareaRow label="Maps embed src" value={venueMapsEmbed} onChange={setVenueMapsEmbed} rows={2} />
                    <div className="pt-2 pb-1">
                        <p className="text-xs uppercase tracking-[0.2em] text-text-secondary mb-2">Event Times</p>
                    </div>
                    <FieldRow label="Ceremony" value={ceremonyTime} onChange={setCeremonyTime} placeholder="5:00 PM" />
                    <FieldRow label="Cocktail hour" value={cocktailTime} onChange={setCocktailTime} placeholder="5:45 PM" />
                    <FieldRow label="Reception" value={receptionTime} onChange={setReceptionTime} placeholder="6:45 PM" />
                    <FieldRow label="Send-off" value={sendOffTime} onChange={setSendOffTime} placeholder="10:00 PM" />
                    <TextareaRow label="Parking note" value={parking} onChange={setParking} rows={2} />
                </div>
                <SaveBar status={venueSave.status} onSave={() => void saveVenue()} onReset={() => void resetVenue()} />
            </ContentSection>

            {/* ── Dress Code ───────────────────────────────────────────── */}
            <ContentSection label="Dress Code">
                <div className="space-y-1">
                    <FieldRow label="Short label" value={dcShort} onChange={setDcShort} placeholder="Semi-Formal" />
                    <TextareaRow label="Summary" value={dcSummary} onChange={setDcSummary} rows={2} />
                    <TextareaRow label="Ladies guidance" value={dcLadies} onChange={setDcLadies} rows={4} />
                    <TextareaRow label="Gentlemen guidance" value={dcGents} onChange={setDcGents} rows={4} />
                </div>
                <SaveBar status={dresscodeSave.status} onSave={() => void saveDresscode()} onReset={() => void resetDresscode()} />
            </ContentSection>

            {/* ── Schedule ──────────────────────────────────────────────── */}
            <ContentSection label="Schedule of Events">
                <ScheduleEditor items={schedule} onChange={setSchedule} />
                <div className="mt-4">
                    <SaveBar
                        status={scheduleSave.status}
                        onSave={() =>
                            void scheduleSave.trigger(() => saveSetting("schedule", schedule))
                        }
                        onReset={() =>
                            void scheduleSave.trigger(async () => {
                                await deleteSetting("schedule");
                                setSchedule(WEDDING.schedule);
                            })
                        }
                    />
                </div>
            </ContentSection>

            {/* ── FAQ ───────────────────────────────────────────────────── */}
            <ContentSection label="FAQ">
                <FaqEditor items={faq} onChange={setFaq} />
                <div className="mt-4">
                    <SaveBar
                        status={faqSave.status}
                        onSave={() =>
                            void faqSave.trigger(() => saveSetting("faq", faq))
                        }
                        onReset={() =>
                            void faqSave.trigger(async () => {
                                await deleteSetting("faq");
                                setFaq(WEDDING.faq);
                            })
                        }
                    />
                </div>
            </ContentSection>

            {/* ── Registry ──────────────────────────────────────────────── */}
            <ContentSection label="Registry">
                <RegistryEditor items={registry} onChange={setRegistry} />
                <div className="mt-4">
                    <SaveBar
                        status={registrySave.status}
                        onSave={() =>
                            void registrySave.trigger(() => saveSetting("registry", registry))
                        }
                        onReset={() =>
                            void registrySave.trigger(async () => {
                                await deleteSetting("registry");
                                setRegistry(WEDDING.registry as RegistryItem[]);
                            })
                        }
                    />
                </div>
            </ContentSection>

            {/* ── Images ────────────────────────────────────────────────── */}
            <ContentSection label="Images">
                <div className="space-y-6">
                    <div>
                        <p className="text-xs text-text-secondary mb-3">
                            Upload a replacement image. The overlay adds a translucent color wash over the photo —
                            useful for matching brand colors or improving text legibility.
                        </p>
                        <ImageField
                            label="Hero Photo"
                            settings={heroSettings}
                            onChange={setHeroSettings}
                            storagePath="hero/hero-main.jpg"
                        />
                    </div>
                </div>
                <SaveBar status={heroSave.status} onSave={() => void saveHero()} onReset={() => void resetHero()} />
            </ContentSection>

            {/* ── Meta / SEO ────────────────────────────────────────────── */}
            <ContentSection label="SEO / Meta">
                <div className="space-y-1">
                    <FieldRow label="Page title" value={metaTitle} onChange={setMetaTitle} />
                    <TextareaRow label="Description" value={metaDescription} onChange={setMetaDescription} rows={2} />
                </div>
                <SaveBar status={metaSave.status} onSave={() => void saveMeta()} onReset={() => void resetMeta()} />
            </ContentSection>
        </div>
    );
}
