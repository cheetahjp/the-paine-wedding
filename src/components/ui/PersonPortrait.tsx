"use client";
import Image from "next/image";

/** Client wrapper for a party member portrait — keeps onError while parent is server component */
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

    return (
        <div className="group text-center">
            <div
                className="relative aspect-[3/4] w-full mb-6 overflow-hidden rounded-sm shadow-sm"
                data-admin-key={adminKey}
                data-admin-type="image"
                data-admin-current-url={src || fallback}
                data-admin-label={`${name} — Photo`}
            >
                <Image
                    src={src || fallback}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = fallback;
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
