"use client";
import Image from "next/image";

const DEFAULT_FALLBACK =
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";

/** Client component for bridal party portraits with onError fallback and admin-key */
export function PersonPortrait({
    src,
    fallback,
    name,
    role,
    relationship,
    adminKey,
}: {
    src: string;
    fallback: string;
    name: string;
    role: string;
    relationship: string;
    adminKey: string;
}) {
    const nameParts = name.trim().split(/\s+/);
    const firstName = nameParts[0] ?? "";
    const lastName = nameParts.slice(1).join(" ");

    // If src isn't an absolute https URL it's likely a local placeholder that 404s on prod.
    // Skip trying to load it — go straight to fallback to prevent the 1-frame alt-text flash.
    const safeSrc = src && /^https?:\/\//.test(src) ? src : (fallback || DEFAULT_FALLBACK);

    return (
        <div className="group text-center">
            <div
                className="relative aspect-[3/4] w-full mb-6 overflow-hidden rounded-sm shadow-sm"
                data-admin-key={adminKey}
                data-admin-type="image"
                data-admin-current-url={safeSrc}
                data-admin-label={`${name} — Photo`}
            >
                <Image
                    src={safeSrc}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = fallback || DEFAULT_FALLBACK;
                    }}
                />
            </div>
            <h3 className="font-heading text-xl text-primary leading-tight">
                <span className="block">{firstName}</span>
                {lastName && <span className="block">{lastName}</span>}
            </h3>
            <p className="uppercase tracking-[0.2em] text-xs text-text-secondary mt-2">{role}</p>
            {relationship && (
                <p className="text-xs text-text-secondary/60 mt-1 italic">{relationship}</p>
            )}
        </div>
    );
}
