"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type EditableType = "image" | "text" | "rich-text" | "image-indexed";

type ImageOverlay = {
    color: string;
    opacity: number;
};

type ImageSettingValue = {
    main?: string;
    src?: string;
    overlay?: ImageOverlay | null;
};

type ImagePanelState = {
    mode: "image";
    key: string;
    currentUrl: string;
    currentOverlay: ImageOverlay | null;
    label: string;
};

type TextPanelState = {
    mode: "text";
    key: string;
    currentText: string;
    richText: boolean;
    label: string;
};

type PanelState = { mode: "closed" } | ImagePanelState | TextPanelState;

// ─── Key → human label map ───────────────────────────────────────────────────

const KEY_LABELS: Record<string, string> = {
    "images.hero": "Hero Photo",
    "home.intro": "Home Intro Text",
    "story.subtitle": "Story Page Subtitle",
    "couple.names": "Couple Names",
    "venue.name": "Venue Name",
    "venue.ceremonyTime": "Ceremony Time",
    "venue.cocktailTime": "Cocktail Hour Time",
    "venue.receptionTime": "Reception Time",
    "venue.sendOffTime": "Send-Off Time",
    "venue.parking": "Parking Info",
    "venue.shuttle": "Shuttle Info",
    "venue.mapsUrl": "Google Maps URL",
    "venue.mapsEmbedSrc": "Map Embed URL",
    "dresscode.short": "Dress Code (Short)",
    "dresscode.summary": "Dress Code Summary",
    "dresscode.ladies": "Attire — Ladies",
    "dresscode.gentlemen": "Attire — Gentlemen",
    "meta.title": "Page Title (SEO)",
    "meta.description": "Meta Description (SEO)",
};

function labelForKey(key: string): string {
    if (KEY_LABELS[key]) return KEY_LABELS[key];
    // Pattern-based labels
    const storyItem = key.match(/^story\.item\.(\d+)\.(title|description|year)$/);
    if (storyItem) return `Story #${Number(storyItem[1]) + 1} — ${storyItem[2]}`;
    const storyImg = key.match(/^story\.item\.(\d+)\.image$/);
    if (storyImg) return `Story #${Number(storyImg[1]) + 1} — Photo`;
    const faq = key.match(/^faq\.(\d+)\.(q|a)$/);
    if (faq) return `FAQ #${Number(faq[1]) + 1} — ${faq[2] === "q" ? "Question" : "Answer"}`;
    const sched = key.match(/^schedule\.(\d+)\.(time|title|description)$/);
    if (sched) return `Schedule #${Number(sched[1]) + 1} — ${sched[2]}`;
    const bridesmaid = key.match(/^bridal-party\.bridesmaids\.(\d+)\.image$/);
    if (bridesmaid) return `Bridesmaid #${Number(bridesmaid[1]) + 1} — Photo`;
    const groomsman = key.match(/^bridal-party\.groomsmen\.(\d+)\.image$/);
    if (groomsman) return `Groomsman #${Number(groomsman[1]) + 1} — Photo`;
    const attireL = key.match(/^images\.attire\.ladies\.(\d+)$/);
    if (attireL) return `Ladies Attire Photo #${Number(attireL[1]) + 1}`;
    const attireG = key.match(/^images\.attire\.gents\.(\d+)$/);
    if (attireG) return `Gents Attire Photo #${Number(attireG[1]) + 1}`;
    const reg = key.match(/^registry\.(\d+)\.(url|description|name)$/);
    if (reg) return `Registry #${Number(reg[1]) + 1} — ${reg[2]}`;
    const airport = key.match(/^travel\.airport\.(\d+)\.(name|description|url)$/);
    if (airport) return `Airport #${Number(airport[1]) + 1} — ${airport[2]}`;
    return key;
}

// ─── Site pages for edit-mode nav ─────────────────────────────────────────────

const SITE_PAGES = [
    { label: "Home", href: "/" },
    { label: "Our Story", href: "/our-story" },
    { label: "Details", href: "/wedding-details" },
    { label: "Schedule", href: "/schedule" },
    { label: "Bridal Party", href: "/bridal-party" },
    { label: "Attire", href: "/attire" },
    { label: "Registry", href: "/registry" },
    { label: "Travel", href: "/travel" },
    { label: "FAQ", href: "/faq" },
];

// ─── CSS injected when edit mode is active ────────────────────────────────────

const STYLE_ID = "admin-edit-bar-css";

const EDIT_CSS = `
  html.admin-edit-active [data-admin-key] {
    outline: 2px dashed rgba(251, 191, 36, 0.7) !important;
    outline-offset: 3px !important;
    cursor: crosshair !important;
    transition: outline-color 0.1s;
    position: relative;
  }
  html.admin-edit-active [data-admin-key]:hover {
    outline: 2px solid rgba(251, 191, 36, 1) !important;
    outline-offset: 3px !important;
  }
  html.admin-edit-active [data-admin-key]:hover::after {
    content: attr(data-admin-label);
    position: absolute;
    top: 4px;
    left: 4px;
    background: rgba(251, 191, 36, 0.95);
    color: #111;
    font-size: 10px;
    font-weight: 700;
    font-family: system-ui, sans-serif;
    padding: 2px 6px;
    border-radius: 4px;
    pointer-events: none;
    z-index: 9990;
    white-space: nowrap;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

// ─── API helpers ──────────────────────────────────────────────────────────────

async function apiGetSettings(): Promise<Record<string, unknown>> {
    try {
        const r = await fetch("/api/admin/site-settings");
        if (!r.ok) return {};
        const { settings } = (await r.json()) as { settings: Record<string, unknown> };
        return settings ?? {};
    } catch {
        return {};
    }
}

async function apiSaveSetting(key: string, value: unknown): Promise<void> {
    const r = await fetch("/api/admin/site-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value }),
    });
    if (!r.ok) {
        const data = (await r.json()) as { error?: string };
        throw new Error(data.error ?? "Save failed");
    }
}

async function apiDeleteSetting(key: string): Promise<void> {
    const r = await fetch("/api/admin/site-settings", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key }),
    });
    if (!r.ok) {
        const data = (await r.json()) as { error?: string };
        throw new Error(data.error ?? "Delete failed");
    }
}

async function apiUploadImage(file: File | Blob, filename?: string): Promise<string> {
    const fd = new FormData();
    fd.append("file", file, filename ?? "upload.jpg");
    const r = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
    if (!r.ok) {
        const data = (await r.json()) as { error?: string };
        throw new Error(data.error ?? "Upload failed");
    }
    const { url } = (await r.json()) as { url: string };
    return url;
}

// ─── Canvas-based crop helper ────────────────────────────────────────────────

async function cropImageBlob(
    sourceUrl: string,
    cropPct: { x: number; y: number; w: number; h: number }
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const sx = Math.round(img.naturalWidth * cropPct.x);
            const sy = Math.round(img.naturalHeight * cropPct.y);
            const sw = Math.round(img.naturalWidth * cropPct.w);
            const sh = Math.round(img.naturalHeight * cropPct.h);
            const canvas = document.createElement("canvas");
            canvas.width = sw;
            canvas.height = sh;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error("Canvas toBlob failed"));
            }, "image/jpeg", 0.92);
        };
        img.onerror = () => reject(new Error("Image load failed — try a direct URL or upload the image first"));
        img.src = sourceUrl;
    });
}

// ─── CropTool ─────────────────────────────────────────────────────────────────

type CropRect = { x: number; y: number; w: number; h: number };

function CropTool({
    imageUrl,
    onCrop,
    onCancel,
}: {
    imageUrl: string;
    onCrop: (rect: CropRect) => void;
    onCancel: () => void;
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [rect, setRect] = useState<CropRect>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
    const dragging = useRef<{ handle: string; startX: number; startY: number; startRect: CropRect } | null>(null);

    const getRelPos = (e: MouseEvent | React.MouseEvent) => {
        const el = containerRef.current;
        if (!el) return { px: 0, py: 0 };
        const bounds = el.getBoundingClientRect();
        return {
            px: Math.max(0, Math.min(1, (e.clientX - bounds.left) / bounds.width)),
            py: Math.max(0, Math.min(1, (e.clientY - bounds.top) / bounds.height)),
        };
    };

    const onMouseDown = (handle: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        const { px, py } = getRelPos(e);
        dragging.current = { handle, startX: px, startY: py, startRect: { ...rect } };
    };

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!dragging.current) return;
            const { handle, startX, startY, startRect } = dragging.current;
            const { px, py } = getRelPos(e);
            const dx = px - startX;
            const dy = py - startY;
            setRect((prev) => {
                let { x, y, w, h } = startRect;
                const minSize = 0.05;
                if (handle === "move") {
                    x = Math.max(0, Math.min(1 - w, x + dx));
                    y = Math.max(0, Math.min(1 - h, y + dy));
                } else {
                    if (handle.includes("e")) { w = Math.max(minSize, Math.min(1 - x, w + dx)); }
                    if (handle.includes("s")) { h = Math.max(minSize, Math.min(1 - y, h + dy)); }
                    if (handle.includes("w")) { const dw = Math.min(dx, w - minSize); x = x + dw; w = w - dw; }
                    if (handle.includes("n")) { const dh = Math.min(dy, h - minSize); y = y + dh; h = h - dh; }
                }
                void prev;
                return { x, y, w, h };
            });
        };
        const onUp = () => { dragging.current = null; };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    }, []);

    const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
    const handles: Array<{ id: string; style: React.CSSProperties; cursor: string }> = [
        { id: "nw", style: { top: 0, left: 0, transform: "translate(-50%,-50%)" }, cursor: "nw-resize" },
        { id: "ne", style: { top: 0, right: 0, transform: "translate(50%,-50%)" }, cursor: "ne-resize" },
        { id: "sw", style: { bottom: 0, left: 0, transform: "translate(-50%,50%)" }, cursor: "sw-resize" },
        { id: "se", style: { bottom: 0, right: 0, transform: "translate(50%,50%)" }, cursor: "se-resize" },
        { id: "n", style: { top: 0, left: "50%", transform: "translate(-50%,-50%)" }, cursor: "n-resize" },
        { id: "s", style: { bottom: 0, left: "50%", transform: "translate(-50%,50%)" }, cursor: "s-resize" },
        { id: "e", style: { top: "50%", right: 0, transform: "translate(50%,-50%)" }, cursor: "e-resize" },
        { id: "w", style: { top: "50%", left: 0, transform: "translate(-50%,-50%)" }, cursor: "w-resize" },
    ];

    return (
        <div className="space-y-3">
            <p className="text-xs text-gray-500 leading-relaxed">
                Drag the yellow box handles to select the crop area. The image will be cropped and re-uploaded.
            </p>
            <div
                ref={containerRef}
                className="relative select-none overflow-hidden rounded-lg bg-black"
                style={{ aspectRatio: "16/9" }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt="Crop preview" className="w-full h-full object-contain opacity-50" />
                {/* Dark overlay outside crop */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-black/50" />
                    {/* Cut-out (crop area) */}
                    <div
                        className="absolute bg-transparent"
                        style={{
                            left: pct(rect.x),
                            top: pct(rect.y),
                            width: pct(rect.w),
                            height: pct(rect.h),
                            boxShadow: "0 0 0 9999px rgba(0,0,0,0.55)",
                        }}
                    />
                </div>
                {/* Crop rect move handle */}
                <div
                    className="absolute border-2 border-amber-400"
                    style={{
                        left: pct(rect.x),
                        top: pct(rect.y),
                        width: pct(rect.w),
                        height: pct(rect.h),
                        cursor: "move",
                    }}
                    onMouseDown={onMouseDown("move")}
                >
                    {/* Resize handles */}
                    {handles.map((h) => (
                        <div
                            key={h.id}
                            className="absolute w-3 h-3 bg-amber-400 rounded-sm"
                            style={{ ...h.style, cursor: h.cursor }}
                            onMouseDown={(e) => { e.stopPropagation(); onMouseDown(h.id)(e); }}
                        />
                    ))}
                    {/* Inside guide lines */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="border-[0.5px] border-amber-300/30" />
                        ))}
                    </div>
                </div>
            </div>
            <p className="text-xs text-gray-400 font-mono">
                x:{pct(rect.x)} y:{pct(rect.y)} w:{pct(rect.w)} h:{pct(rect.h)}
            </p>
            <div className="flex gap-2">
                <button
                    onClick={onCancel}
                    className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
                >
                    ← Back
                </button>
                <button
                    onClick={() => onCrop(rect)}
                    className="flex-1 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-gray-900 text-sm font-semibold transition-colors"
                >
                    Apply Crop
                </button>
            </div>
        </div>
    );
}

// ─── RichTextToolbar ──────────────────────────────────────────────────────────

function RichTextToolbar({ editorRef }: { editorRef: React.RefObject<HTMLDivElement | null> }) {
    const exec = (cmd: string, value?: string) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, value);
    };
    return (
        <div className="flex flex-wrap gap-1 p-1.5 bg-gray-50 border border-gray-200 rounded-lg">
            {[
                { label: "B", title: "Bold", cmd: "bold", style: "font-bold" },
                { label: "I", title: "Italic", cmd: "italic", style: "italic" },
                { label: "U", title: "Underline", cmd: "underline", style: "underline" },
            ].map(({ label, title, cmd, style }) => (
                <button
                    key={cmd}
                    title={title}
                    onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
                    className={`px-2.5 py-1 rounded text-xs ${style} bg-white hover:bg-gray-100 border border-gray-200 transition-colors`}
                >
                    {label}
                </button>
            ))}
            <div className="w-px bg-gray-200 mx-0.5" />
            <button
                title="Bulleted List"
                onMouseDown={(e) => { e.preventDefault(); exec("insertUnorderedList"); }}
                className="px-2.5 py-1 rounded text-xs bg-white hover:bg-gray-100 border border-gray-200 transition-colors"
            >
                ≡
            </button>
            <button
                title="Link"
                onMouseDown={(e) => {
                    e.preventDefault();
                    const url = window.prompt("Enter URL:", "https://");
                    if (url) exec("createLink", url);
                }}
                className="px-2.5 py-1 rounded text-xs bg-white hover:bg-gray-100 border border-gray-200 transition-colors"
            >
                🔗
            </button>
            <button
                title="Clear Formatting"
                onMouseDown={(e) => { e.preventDefault(); exec("removeFormat"); }}
                className="px-2.5 py-1 rounded text-xs bg-white hover:bg-gray-100 border border-gray-200 transition-colors"
            >
                ✕
            </button>
        </div>
    );
}

// ─── ImageEditPanel ───────────────────────────────────────────────────────────

function ImageEditPanel({
    state,
    settings,
    onClose,
}: {
    state: ImagePanelState;
    settings: Record<string, unknown>;
    onClose: () => void;
}) {
    const [url, setUrl] = useState(state.currentUrl);
    const [hasOverlay, setHasOverlay] = useState(!!state.currentOverlay);
    const [overlay, setOverlay] = useState<ImageOverlay>(
        state.currentOverlay ?? { color: "#0f2439", opacity: 0.2 }
    );
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showCrop, setShowCrop] = useState(false);
    const [croppingUrl, setCroppingUrl] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        setUploading(true);
        setError(null);
        try {
            const newUrl = await apiUploadImage(file);
            setUrl(newUrl);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setUploading(false);
        }
    };

    const handleCrop = async (rect: { x: number; y: number; w: number; h: number }) => {
        if (!croppingUrl) return;
        setUploading(true);
        setError(null);
        setShowCrop(false);
        try {
            const blob = await cropImageBlob(croppingUrl, rect);
            const newUrl = await apiUploadImage(blob, `cropped-${Date.now()}.jpg`);
            setUrl(newUrl);
            setCroppingUrl(null);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const key = state.key;
            if (key === "images.hero") {
                const current = (settings[key] as ImageSettingValue) ?? {};
                await apiSaveSetting(key, {
                    ...current,
                    main: url,
                    overlay: hasOverlay ? overlay : null,
                });
            } else if (key.startsWith("images.attire.")) {
                // indexed attire image key
                await apiSaveSetting(key, { src: url, overlay: hasOverlay ? overlay : null });
            } else if (key.startsWith("story.item.") && key.endsWith(".image")) {
                const current = (settings[key] as ImageSettingValue) ?? {};
                await apiSaveSetting(key, { ...current, main: url, overlay: hasOverlay ? overlay : null });
            } else if (key.startsWith("bridal-party.")) {
                await apiSaveSetting(key, url);
            } else {
                await apiSaveSetting(key, { url, overlay: hasOverlay ? overlay : null });
            }
            window.location.reload();
        } catch (e) {
            setError((e as Error).message);
            setSaving(false);
        }
    };

    const handleRestore = async () => {
        if (!confirm("Restore the original image for this section? Your uploaded version will be removed.")) return;
        setSaving(true);
        setError(null);
        try {
            await apiDeleteSetting(state.key);
            window.location.reload();
        } catch (e) {
            setError((e as Error).message);
            setSaving(false);
        }
    };

    if (showCrop && croppingUrl) {
        return <CropTool imageUrl={croppingUrl} onCrop={handleCrop} onCancel={() => setShowCrop(false)} />;
    }

    return (
        <div className="space-y-5">
            {/* Preview */}
            <div className="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
                {url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        No image
                    </div>
                )}
                {hasOverlay && overlay.opacity > 0 && (
                    <div
                        className="absolute inset-0 pointer-events-none rounded-lg"
                        style={{ backgroundColor: overlay.color, opacity: overlay.opacity }}
                    />
                )}
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="py-2.5 px-3 bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-gray-900 rounded-lg text-xs font-semibold transition-colors"
                >
                    {uploading ? "Uploading…" : "↑ Upload Photo"}
                </button>
                <button
                    onClick={() => { setCroppingUrl(url); setShowCrop(true); }}
                    disabled={!url || uploading}
                    className="py-2.5 px-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-40 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                    ✂ Crop Image
                </button>
            </div>
            <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void handleFile(f);
                }}
            />

            {/* URL override */}
            <div>
                <label className="block text-xs text-gray-500 mb-1">Or paste an image URL</label>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                    placeholder="https://..."
                />
            </div>

            {/* Overlay controls */}
            <div className="space-y-3 border-t border-gray-100 pt-4">
                <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-gray-700">
                    <input
                        type="checkbox"
                        checked={hasOverlay}
                        onChange={(e) => setHasOverlay(e.target.checked)}
                        className="w-4 h-4 rounded accent-amber-400"
                    />
                    Color Overlay
                </label>
                {hasOverlay && (
                    <div className="pl-6 space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-14">Color</span>
                            <input
                                type="color"
                                value={overlay.color}
                                onChange={(e) =>
                                    setOverlay((o) => ({ ...o, color: e.target.value }))
                                }
                                className="h-8 w-12 rounded cursor-pointer border border-gray-200"
                            />
                            <span className="text-xs font-mono text-gray-400">{overlay.color}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 w-14">Opacity</span>
                            <input
                                type="range"
                                min={0}
                                max={1}
                                step={0.05}
                                value={overlay.opacity}
                                onChange={(e) =>
                                    setOverlay((o) => ({ ...o, opacity: +e.target.value }))
                                }
                                className="flex-1 accent-amber-400"
                            />
                            <span className="text-xs text-gray-400 w-8 text-right">
                                {Math.round(overlay.opacity * 100)}%
                            </span>
                        </div>
                        {/* Live preview swatch */}
                        <div className="flex items-center gap-2">
                            <div
                                className="h-6 flex-1 rounded"
                                style={{ background: overlay.color, opacity: overlay.opacity }}
                            />
                            <span className="text-xs text-gray-400">Preview tint</span>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">{error}</p>
            )}

            <div className="flex gap-2 pt-1 flex-wrap">
                <button
                    onClick={onClose}
                    className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => void handleSave()}
                    disabled={saving || uploading}
                    className="flex-1 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                >
                    {saving ? "Saving…" : "Save Changes"}
                </button>
            </div>
            <button
                onClick={() => void handleRestore()}
                disabled={saving}
                className="w-full py-1.5 rounded-lg text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
                ↺ Restore original
            </button>
        </div>
    );
}

// ─── TextEditPanel ────────────────────────────────────────────────────────────

function TextEditPanel({
    state,
    onClose,
}: {
    state: TextPanelState;
    onClose: () => void;
}) {
    const [richMode, setRichMode] = useState(state.richText);
    const [text, setText] = useState(state.currentText);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const editorRef = useRef<HTMLDivElement | null>(null);

    // Sync plain text ↔ rich content
    const getRichContent = () => editorRef.current?.innerHTML ?? text;

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const value = richMode ? getRichContent() : text;
            await apiSaveSetting(state.key, value);
            window.location.reload();
        } catch (e) {
            setError((e as Error).message);
            setSaving(false);
        }
    };

    const handleRestore = async () => {
        if (!confirm("Restore the original text for this field?")) return;
        setSaving(true);
        try {
            await apiDeleteSetting(state.key);
            window.location.reload();
        } catch (e) {
            setError((e as Error).message);
            setSaving(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 leading-relaxed">
                    Edit the text below and save.
                </p>
                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-500">
                    <input
                        type="checkbox"
                        checked={richMode}
                        onChange={(e) => {
                            if (e.target.checked && editorRef.current) {
                                editorRef.current.innerHTML = text;
                            } else if (!e.target.checked && editorRef.current) {
                                setText(editorRef.current.innerText);
                            }
                            setRichMode(e.target.checked);
                        }}
                        className="w-3.5 h-3.5 accent-amber-400"
                    />
                    Rich text
                </label>
            </div>

            {richMode ? (
                <div className="space-y-1">
                    <RichTextToolbar editorRef={editorRef} />
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        // eslint-disable-next-line jsx-a11y/no-autofocus
                        autoFocus
                        dangerouslySetInnerHTML={{ __html: state.currentText }}
                        className="w-full min-h-[140px] border border-gray-200 rounded-lg p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent overflow-y-auto"
                        style={{ maxHeight: 260 }}
                    />
                </div>
            ) : (
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={8}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                />
            )}

            {error && (
                <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">{error}</p>
            )}
            <div className="flex gap-2">
                <button
                    onClick={onClose}
                    className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => void handleSave()}
                    disabled={saving}
                    className="flex-1 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                >
                    {saving ? "Saving…" : "Save Changes"}
                </button>
            </div>
            <button
                onClick={() => void handleRestore()}
                disabled={saving}
                className="w-full py-1.5 rounded-lg text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
                ↺ Restore original
            </button>
        </div>
    );
}

// ─── EditDrawer (right-side slide panel) ─────────────────────────────────────

function EditDrawer({
    panel,
    settings,
    onClose,
}: {
    panel: Exclude<PanelState, { mode: "closed" }>;
    settings: Record<string, unknown>;
    onClose: () => void;
}) {
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [onClose]);

    const title = panel.mode === "image" ? "Edit Image" : "Edit Text";
    const label = (panel as ImagePanelState | TextPanelState).label ?? panel.key;

    return (
        <>
            {/* Scrim */}
            <div
                className="fixed inset-0 bg-black/20 z-[9998]"
                onClick={onClose}
            />
            {/* Drawer */}
            <div className="fixed right-0 top-0 bottom-0 w-[340px] bg-white shadow-2xl z-[9999] flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between p-5 border-b border-gray-100 shrink-0">
                    <div className="min-w-0">
                        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
                        <p className="text-xs text-amber-600 font-medium mt-0.5 truncate">{label}</p>
                        <p className="text-[10px] font-mono text-gray-300 mt-0.5 truncate">{panel.key}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-3 shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 text-lg leading-none transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-5">
                    {panel.mode === "image" && (
                        <ImageEditPanel state={panel} settings={settings} onClose={onClose} />
                    )}
                    {panel.mode === "text" && (
                        <TextEditPanel state={panel} onClose={onClose} />
                    )}
                </div>
            </div>
        </>
    );
}

// ─── Edit-mode site nav ───────────────────────────────────────────────────────

function EditModeNav({ currentPath }: { currentPath: string }) {
    return (
        <div
            className="fixed top-0 left-0 right-0 z-[9996] flex items-center gap-1 px-4 py-2 overflow-x-auto"
            style={{
                background: "rgba(10,10,15,0.92)",
                backdropFilter: "blur(12px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                fontFamily: "system-ui,-apple-system,sans-serif",
            }}
        >
            <span
                style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    color: "#fbbf24",
                    marginRight: 8,
                    flexShrink: 0,
                }}
            >
                ✎ BROWSING:
            </span>
            {SITE_PAGES.map((page) => {
                const active = currentPath === page.href;
                return (
                    <Link
                        key={page.href}
                        href={page.href}
                        style={{
                            padding: "3px 10px",
                            borderRadius: "20px",
                            fontSize: "11px",
                            fontWeight: active ? 700 : 500,
                            color: active ? "#111827" : "#d1d5db",
                            background: active ? "#fbbf24" : "rgba(255,255,255,0.06)",
                            border: "1px solid",
                            borderColor: active ? "#fbbf24" : "rgba(255,255,255,0.1)",
                            textDecoration: "none",
                            whiteSpace: "nowrap",
                            transition: "background 0.15s",
                            flexShrink: 0,
                        }}
                    >
                        {page.label}
                    </Link>
                );
            })}
        </div>
    );
}

// ─── AdminEditBar (main component, rendered in layout) ────────────────────────

export default function AdminEditBar() {
    const [role, setRole] = useState<string | null>(null);
    const [sessionLoading, setSessionLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [panel, setPanel] = useState<PanelState>({ mode: "closed" });
    const [settings, setSettings] = useState<Record<string, unknown>>({});
    const [currentPath, setCurrentPath] = useState("/");

    // 1. Check admin session on mount + track path
    useEffect(() => {
        const checkSession = async () => {
            try {
                const r = await fetch("/api/admin/session");
                if (r.ok) {
                    const data = (await r.json()) as { role?: string };
                    setRole(data.role ?? null);
                }
            } catch {
                // not authenticated — stay null
            } finally {
                setSessionLoading(false);
            }
        };
        void checkSession();
        setCurrentPath(window.location.pathname);
    }, []);

    // Update path on navigation
    useEffect(() => {
        const onPop = () => setCurrentPath(window.location.pathname);
        window.addEventListener("popstate", onPop);
        // MutationObserver for Next.js client nav
        const observer = new MutationObserver(() => {
            setCurrentPath(window.location.pathname);
        });
        observer.observe(document, { subtree: true, childList: true });
        return () => { window.removeEventListener("popstate", onPop); observer.disconnect(); };
    }, []);

    // 2. Inject edit-mode CSS once
    useEffect(() => {
        let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
        if (!el) {
            el = document.createElement("style");
            el.id = STYLE_ID;
            document.head.appendChild(el);
        }
        el.textContent = EDIT_CSS;
    }, []);

    // 3. Toggle html class + prefetch settings when edit mode turns on
    useEffect(() => {
        if (editMode) {
            document.documentElement.classList.add("admin-edit-active");
            void apiGetSettings().then(setSettings);
        } else {
            document.documentElement.classList.remove("admin-edit-active");
            setPanel({ mode: "closed" });
        }
        return () => {
            document.documentElement.classList.remove("admin-edit-active");
        };
    }, [editMode]);

    // 4. Push body down when edit nav is showing
    useEffect(() => {
        if (editMode) {
            document.body.style.paddingTop = "40px";
        } else {
            document.body.style.paddingTop = "";
        }
        return () => { document.body.style.paddingTop = ""; };
    }, [editMode]);

    // 5. Capture-phase click handler — intercepts clicks on [data-admin-key] elements
    const handleClick = useCallback((e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const editable = target.closest("[data-admin-key]") as HTMLElement | null;
        if (!editable) return;

        e.preventDefault();
        e.stopPropagation();

        const key = editable.dataset.adminKey!;
        const type = (editable.dataset.adminType as EditableType) ?? "text";
        const label = labelForKey(key);

        if (type === "image" || type === "image-indexed") {
            const currentUrl =
                editable.dataset.adminCurrentUrl ??
                (editable.querySelector("img") as HTMLImageElement | null)?.src ??
                "";
            const settingVal = settings[key] as ImageSettingValue | null;
            const currentOverlay = settingVal?.overlay ?? null;
            setPanel({ mode: "image", key, currentUrl, currentOverlay, label });
        } else {
            const richText = type === "rich-text";
            const currentText = (editable.dataset.adminCurrentText ?? editable.innerHTML ?? editable.innerText ?? "").trim();
            setPanel({ mode: "text", key, currentText, richText, label });
        }
    }, [settings]);

    useEffect(() => {
        if (!editMode) return;
        document.addEventListener("click", handleClick, true);
        return () => document.removeEventListener("click", handleClick, true);
    }, [editMode, handleClick]);

    // Don't render anything until session confirmed, and only for Master role
    if (sessionLoading || role !== "Master") return null;

    return (
        <>
            {/* Edit-mode page nav */}
            {editMode && <EditModeNav currentPath={currentPath} />}

            {/* ── Floating admin toolbar ── */}
            <div
                className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[9997] flex items-center gap-3 rounded-full px-5 py-2.5 shadow-2xl select-none pointer-events-auto"
                style={{
                    background: "rgba(10,10,15,0.92)",
                    backdropFilter: "blur(12px)",
                    fontFamily: "system-ui,-apple-system,sans-serif",
                    fontSize: "13px",
                    color: "white",
                    border: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                {/* Status dot */}
                <span
                    className="h-2 w-2 rounded-full shrink-0 transition-colors duration-300"
                    style={{ backgroundColor: editMode ? "#fbbf24" : "#4b5563" }}
                />

                {/* Label */}
                <span style={{ color: "#9ca3af", fontSize: "11px", fontWeight: 600, letterSpacing: "0.05em" }}>
                    ADMIN
                </span>

                {/* Divider */}
                <span style={{ width: 1, height: 16, background: "#374151", display: "inline-block" }} />

                {/* Edit mode toggle */}
                <button
                    onClick={() => setEditMode((v) => !v)}
                    style={{
                        padding: "4px 14px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "none",
                        cursor: "pointer",
                        transition: "background 0.15s, color 0.15s",
                        background: editMode ? "#fbbf24" : "#374151",
                        color: editMode ? "#111827" : "#d1d5db",
                    }}
                >
                    {editMode ? "✎ Editing ON" : "✎ Edit Mode"}
                </button>

                {/* Hint + admin links when not editing */}
                {editMode ? (
                    <span style={{ fontSize: "11px", color: "#fcd34d" }}>
                        Click any outlined element
                    </span>
                ) : (
                    <>
                        <span style={{ width: 1, height: 16, background: "#374151", display: "inline-block" }} />
                        <a
                            href="/admin"
                            style={{ fontSize: "11px", color: "#9ca3af", textDecoration: "none" }}
                        >
                            Dashboard
                        </a>
                    </>
                )}
            </div>

            {/* ── Edit drawer ── */}
            {panel.mode !== "closed" && (
                <EditDrawer
                    panel={panel}
                    settings={settings}
                    onClose={() => setPanel({ mode: "closed" })}
                />
            )}
        </>
    );
}
