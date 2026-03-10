"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

// ─── Client-side image compression ───────────────────────────────────────────

/**
 * Compress an image File/Blob via Canvas so it's always < 3 MB before upload.
 * Vercel Serverless Functions cap the request body at ~4.5 MB; this ensures
 * even large phone photos (10+ MB) are safely resized first.
 */
async function compressImageFile(file: File | Blob, maxPx = 2400, quality = 0.88): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            URL.revokeObjectURL(url);
            let { naturalWidth: w, naturalHeight: h } = img;
            if (w > maxPx || h > maxPx) {
                if (w > h) { h = Math.round((h * maxPx) / w); w = maxPx; }
                else { w = Math.round((w * maxPx) / h); h = maxPx; }
            }
            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
            canvas.toBlob(
                (blob) => { if (blob) resolve(blob); else reject(new Error("Compression failed")); },
                "image/jpeg",
                quality
            );
        };
        img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
        img.src = url;
    });
}

async function apiUploadImage(file: File | Blob, filename?: string): Promise<string> {
    // Compress if it's a big File (e.g. from the file picker). Blobs from the
    // crop tool are already sized, so we skip re-compression for those.
    const toUpload = file instanceof File && file.size > 1_500_000
        ? await compressImageFile(file)
        : file;
    const fd = new FormData();
    fd.append("file", toUpload, filename ?? "upload.jpg");
    const r = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
    if (!r.ok) {
        // Guard against non-JSON responses (e.g. Vercel 413 "Request Entity Too Large")
        const text = await r.text();
        let msg = "Upload failed";
        try { msg = (JSON.parse(text) as { error?: string }).error ?? msg; } catch { msg = text.slice(0, 120); }
        throw new Error(msg);
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

// ─── SmartCropTool ─────────────────────────────────────────────────────────────

/** Returns [w, h] ratio matching the destination frame on the site for a given admin key */
function getFrameAspect(key: string): [number, number] {
    if (key.startsWith("bridal-party.")) return [3, 4];
    if (key.startsWith("story.item.")) return [4, 5];
    if (key === "images.hero") return [16, 7];
    if (key.startsWith("images.attire.")) return [3, 4];
    if (key.startsWith("images.")) return [16, 9];
    return [4, 3];
}

const FRAME_DISPLAY_W = 290; // px — matches drawer width

function SmartCropTool({
    imageUrl,
    adminKey,
    onCrop,
    onCancel,
}: {
    imageUrl: string;
    adminKey: string;
    onCrop: (blob: Blob) => void;
    onCancel: () => void;
}) {
    const [ratioW, ratioH] = getFrameAspect(adminKey);
    const frameH = Math.round(FRAME_DISPLAY_W * ratioH / ratioW);

    const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [applying, setApplying] = useState(false);
    const [loadError, setLoadError] = useState(false);
    const [cropError, setCropError] = useState<string | null>(null);

    const imgRef = useRef<HTMLImageElement>(null);
    const drag = useRef<{ sx: number; sy: number; px: number; py: number } | null>(null);

    // "Cover" scale — makes the image exactly fill the frame at zoom=1
    const coverScale = naturalSize
        ? Math.max(FRAME_DISPLAY_W / naturalSize.w, frameH / naturalSize.h)
        : 1;

    // Max pan so the image never exposes blank space inside the frame
    const maxPanX = naturalSize ? Math.max(0, (coverScale * zoom * naturalSize.w - FRAME_DISPLAY_W) / 2) : 0;
    const maxPanY = naturalSize ? Math.max(0, (coverScale * zoom * naturalSize.h - frameH) / 2) : 0;
    const clampPan = (p: typeof pan) => ({
        x: Math.max(-maxPanX, Math.min(maxPanX, p.x)),
        y: Math.max(-maxPanY, Math.min(maxPanY, p.y)),
    });
    const cp = clampPan(pan);

    // Image display size
    const dispW = naturalSize ? naturalSize.w * coverScale * zoom : FRAME_DISPLAY_W;
    const dispH = naturalSize ? naturalSize.h * coverScale * zoom : frameH;

    // Mouse drag to pan
    const onMouseDown = (e: React.MouseEvent) => {
        if (!naturalSize) return;
        e.preventDefault();
        drag.current = { sx: e.clientX, sy: e.clientY, px: cp.x, py: cp.y };
    };

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!drag.current) return;
            const dx = e.clientX - drag.current.sx;
            const dy = e.clientY - drag.current.sy;
            setPan(clampPan({ x: drag.current.px + dx, y: drag.current.py + dy }));
        };
        const onUp = () => { drag.current = null; };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maxPanX, maxPanY]);

    const handleApply = async () => {
        if (!naturalSize || !imgRef.current) { setCropError("Image not loaded yet — wait a moment."); return; }
        setApplying(true);
        setCropError(null);
        try {
            const outW = 1200;
            const outH = Math.round(outW * ratioH / ratioW);
            const canvas = document.createElement("canvas");
            canvas.width = outW;
            canvas.height = outH;
            const ctx = canvas.getContext("2d")!;

            // Compute which slice of the natural image is visible in the frame
            const es = coverScale * zoom;
            const imgLeft = FRAME_DISPLAY_W / 2 + cp.x - dispW / 2;
            const imgTop = frameH / 2 + cp.y - dispH / 2;
            const srcX = Math.max(0, -imgLeft / es);
            const srcY = Math.max(0, -imgTop / es);
            const srcW = Math.min(naturalSize.w - srcX, FRAME_DISPLAY_W / es);
            const srcH = Math.min(naturalSize.h - srcY, frameH / es);

            ctx.drawImage(imgRef.current, srcX, srcY, srcW, srcH, 0, 0, outW, outH);
            canvas.toBlob(
                (blob) => {
                    if (blob) { onCrop(blob); }
                    else { setCropError("Export failed — try again."); setApplying(false); }
                },
                "image/jpeg", 0.92
            );
        } catch (e) {
            setCropError((e as Error).message);
            setApplying(false);
        }
    };

    const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

    return (
        <div className="space-y-3">
            <p className="text-xs text-gray-500 leading-relaxed">
                <strong>Drag</strong> the image to reposition · <strong>Zoom slider</strong> to fill the frame. The amber border is the exact crop.
            </p>

            {/* Frame preview */}
            <div
                className="mx-auto overflow-hidden relative select-none rounded-sm border-2 border-amber-400"
                style={{ width: FRAME_DISPLAY_W, height: frameH, cursor: naturalSize ? (drag.current ? "grabbing" : "grab") : "default" }}
                onMouseDown={onMouseDown}
            >
                {/* Checkerboard bg */}
                <div className="absolute inset-0" style={{
                    background: "repeating-conic-gradient(#d1d5db 0% 25%, #e5e7eb 0% 50%) 0 0 / 12px 12px",
                }} />
                {/* The image, positioned manually via transform */}
                {!loadError && imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        ref={imgRef}
                        src={imageUrl}
                        alt=""
                        crossOrigin="anonymous"
                        draggable={false}
                        onLoad={(e) => {
                            const t = e.currentTarget;
                            setNaturalSize({ w: t.naturalWidth, h: t.naturalHeight });
                        }}
                        onError={() => setLoadError(true)}
                        style={{
                            position: "absolute",
                            width: dispW,
                            height: dispH,
                            left: "50%",
                            top: "50%",
                            transform: `translate(calc(-50% + ${cp.x}px), calc(-50% + ${cp.y}px))`,
                            maxWidth: "none",
                            pointerEvents: "none",
                            userSelect: "none",
                        }}
                    />
                )}
                {loadError && (
                    <div className="absolute inset-0 flex items-center justify-center text-center text-xs text-gray-400 p-4">
                        Couldn&apos;t load image for cropping.
                        <br />Upload via &ldquo;↑ Upload Photo&rdquo; first.
                    </div>
                )}
                {!naturalSize && !loadError && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                        Loading…
                    </div>
                )}
            </div>

            {/* Ratio label */}
            <p className="text-center text-xs text-gray-400">
                {ratioW}:{ratioH} — matches the frame on the page
            </p>

            {/* Zoom slider */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 shrink-0">Zoom</span>
                <input
                    type="range" min={1} max={3} step={0.05}
                    value={zoom}
                    onChange={(e) => { setZoom(+e.target.value); setPan(p => clampPan(p)); }}
                    className="flex-1 accent-amber-400"
                    disabled={!naturalSize}
                />
                <span className="text-xs text-gray-400 w-8 text-right">{zoom.toFixed(1)}×</span>
                <button onClick={resetView} className="text-xs text-gray-400 hover:text-gray-700 transition-colors ml-1" title="Reset view">↺</button>
            </div>

            {cropError && <p className="text-xs text-red-600 bg-red-50 rounded p-2">{cropError}</p>}

            <div className="flex gap-2">
                <button onClick={onCancel} className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium transition-colors">
                    ← Back
                </button>
                <button
                    onClick={() => void handleApply()}
                    disabled={!naturalSize || applying || loadError}
                    className="flex-1 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 disabled:opacity-50 text-gray-900 text-sm font-semibold transition-colors"
                >
                    {applying ? "Exporting…" : "Apply Crop"}
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

    const handleCrop = async (blob: Blob) => {
        setUploading(true);
        setError(null);
        setShowCrop(false);
        try {
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
        return <SmartCropTool imageUrl={croppingUrl} adminKey={state.key} onCrop={handleCrop} onCancel={() => setShowCrop(false)} />;
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

    const pathname = usePathname();

    // Re-check session whenever the route changes.
    // usePathname() from next/navigation updates correctly on every soft navigation
    // without MutationObserver hacks or stale closures.
    useEffect(() => {
        let cancelled = false;
        setSessionLoading(true);

        fetch("/api/admin/session", { cache: "no-store" })
            .then(async (r) => {
                if (cancelled) return;
                if (r.ok) {
                    const data = (await r.json()) as { role?: string };
                    if (!cancelled) { setRole(data.role ?? null); }
                } else {
                    if (!cancelled) { setRole(null); setEditMode(false); }
                }
            })
            .catch(() => { if (!cancelled) { setRole(null); setEditMode(false); } })
            .finally(() => { if (!cancelled) setSessionLoading(false); });

        return () => { cancelled = true; };
    }, [pathname]);


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
            {editMode && <EditModeNav currentPath={pathname} />}

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
