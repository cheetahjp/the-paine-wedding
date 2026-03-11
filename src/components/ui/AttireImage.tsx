"use client";
import Image from "next/image";

/** Simple client wrapper so the onError handler works in a server-rendered page */
export function AttireImage({
    src,
    fallback,
    alt,
    adminKey,
    overlayColor,
    overlayOpacity,
}: {
    src: string;
    fallback: string;
    alt: string;
    adminKey: string;
    overlayColor?: string;
    overlayOpacity?: number;
}) {
    // Allow local paths (starting with /) as well as absolute https URLs.
    // Fall back to Unsplash only if src is empty or an unrecognised format.
    const safeSrc =
        src && (src.startsWith("/") || /^https?:\/\//.test(src)) ? src : fallback;

    return (
        <div
            className="break-inside-avoid relative hover:opacity-90 transition-opacity"
            data-admin-key={adminKey}
            data-admin-type="image-indexed"
            data-admin-current-url={safeSrc}
            data-admin-label={alt}
        >
            <Image
                src={safeSrc}
                alt={alt}
                width={600}
                height={800}
                className="w-full rounded-sm shadow-sm"
                onError={(e) => {
                    (e.target as HTMLImageElement).src = fallback;
                }}
            />
            {overlayColor && overlayOpacity && overlayOpacity > 0 && (
                <div
                    className="absolute inset-0 rounded-sm pointer-events-none"
                    style={{ backgroundColor: overlayColor, opacity: overlayOpacity }}
                />
            )}
        </div>
    );
}

