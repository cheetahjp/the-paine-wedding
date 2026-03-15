"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { WEDDING } from "@/lib/wedding-data";

// ── Fuzzy name matching helpers ───────────────────────────────────────────────
function levenshtein(a: string, b: string): number {
    const m = a.length, n = b.length;
    const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
        Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
    );
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            dp[i][j] = a[i - 1] === b[j - 1]
                ? dp[i - 1][j - 1]
                : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
    }
    return dp[m][n];
}

function nameSimilarity(input: string, candidate: string): number {
    const a = input.toLowerCase().trim();
    const b = candidate.toLowerCase().trim();
    if (a === b) return 1.0;
    if (b.includes(a) || a.includes(b)) return 0.9;
    const dist = levenshtein(a, b);
    const maxLen = Math.max(a.length, b.length);
    return maxLen === 0 ? 1.0 : 1 - dist / maxLen;
}

// ── Gallery images ────────────────────────────────────────────────────────────
const RSVP_GALLERY_IMAGES = [
    "/images/rsvp/JeffAshlyn-7611.jpg",
    "/images/rsvp/JeffAshlyn-7615.jpg",
    "/images/rsvp/JeffAshlyn-7617.jpg",
    "/images/rsvp/JeffAshlyn-7620.jpg",
    "/images/rsvp/JeffAshlyn-7625.jpg",
    "/images/rsvp/JeffAshlyn-7626.jpg",
    "/images/rsvp/JeffAshlyn-7631.jpg",
    "/images/rsvp/JeffAshlyn-7636.jpg",
    "/images/rsvp/JeffAshlyn-7640.jpg",
    "/images/rsvp/JeffAshlyn-7644.jpg",
    "/images/rsvp/JeffAshlyn-7650.jpg",
    "/images/rsvp/JeffAshlyn-7653.jpg",
    "/images/rsvp/JeffAshlyn-7654.jpg",
    "/images/rsvp/JeffAshlyn-7658.jpg",
    "/images/rsvp/JeffAshlyn-7663.jpg",
    "/images/rsvp/JeffAshlyn-7682.jpg",
    "/images/rsvp/JeffAshlyn-7697.jpg",
    "/images/rsvp/JeffAshlyn-7704.jpg",
    "/images/rsvp/JeffAshlyn-7708.jpg",
    "/images/rsvp/JeffAshlyn-7711.jpg",
    "/images/rsvp/JeffAshlyn-7714.jpg",
    "/images/rsvp/JeffAshlyn-7716.jpg",
    "/images/rsvp/JeffAshlyn-7718.jpg",
    "/images/rsvp/JeffAshlyn-7720.jpg",
    "/images/rsvp/JeffAshlyn-7723.jpg",
    "/images/rsvp/JeffAshlyn-7726.jpg",
    "/images/rsvp/JeffAshlyn-7733.jpg",
    "/images/rsvp/JeffAshlyn-7754.jpg",
    "/images/rsvp/JeffAshlyn-7757.jpg",
    "/images/rsvp/JeffAshlyn-7759.jpg",
    "/images/rsvp/JeffAshlyn-7764.jpg",
    "/images/rsvp/JeffAshlyn-7768.jpg",
    "/images/rsvp/JeffAshlyn-7775.jpg",
    "/images/rsvp/JeffAshlyn-7777.jpg",
    "/images/rsvp/JeffAshlyn-7791.jpg",
    "/images/rsvp/JeffAshlyn-7795.jpg",
    "/images/rsvp/JeffAshlyn-7796.jpg",
    "/images/rsvp/JeffAshlyn-7802.jpg",
    "/images/rsvp/JeffAshlyn-7808.jpg",
    "/images/rsvp/JeffAshlyn-7814.jpg",
    "/images/rsvp/JeffAshlyn-7818.jpg",
    "/images/rsvp/JeffAshlyn-7820.jpg",
    "/images/rsvp/JeffAshlyn-7840.jpg",
    "/images/rsvp/JeffAshlyn-7844.jpg",
    "/images/rsvp/JeffAshlyn-7847.jpg",
    "/images/rsvp/JeffAshlyn-7860.jpg",
    "/images/rsvp/JeffAshlyn-7863.jpg",
    "/images/rsvp/JeffAshlyn-7864.jpg",
    "/images/rsvp/JeffAshlyn-7869.jpg",
    "/images/rsvp/JeffAshlyn-7882.jpg",
    "/images/rsvp/JeffAshlyn-7887.jpg",
    "/images/rsvp/JeffAshlyn-7889.jpg",
    "/images/rsvp/JeffAshlyn-7892.jpg",
    "/images/rsvp/JeffAshlyn-7925.jpg",
    "/images/rsvp/JeffAshlyn-7942.jpg",
    "/images/rsvp/JeffAshlyn-7961.jpg",
    "/images/rsvp/JeffAshlyn-7964.jpg",
    "/images/rsvp/JeffAshlyn-7966.jpg",
    "/images/rsvp/JeffAshlyn-7967.jpg",
    "/images/rsvp/JeffAshlyn-7970.jpg",
    "/images/rsvp/JeffAshlyn-7975.jpg",
    "/images/rsvp/JeffAshlyn-7977.jpg",
    "/images/rsvp/JeffAshlyn-7979.jpg",
    "/images/rsvp/JeffAshlyn-7991.jpg",
    "/images/rsvp/JeffAshlyn-7994.jpg",
    "/images/rsvp/JeffAshlyn-7995.jpg",
    "/images/rsvp/JeffAshlyn-8001.jpg",
    "/images/rsvp/JeffAshlyn-8008.jpg",
    "/images/rsvp/JeffAshlyn-8016.jpg",
    "/images/rsvp/JeffAshlyn-8028.jpg",
    "/images/rsvp/JeffAshlyn-8032.jpg",
    "/images/rsvp/JeffAshlyn-8033.jpg",
    "/images/rsvp/JeffAshlyn-8046.jpg",
    "/images/rsvp/JeffAshlyn-8069.jpg",
    "/images/rsvp/JeffAshlyn-8080.jpg",
    "/images/rsvp/JeffAshlyn-8087.jpg",
    "/images/rsvp/JeffAshlyn-8093.jpg",
    "/images/rsvp/JeffAshlyn-8095.jpg",
    "/images/rsvp/JeffAshlyn-8100.jpg",
    "/images/rsvp/JeffAshlyn-8104.jpg",
    "/images/rsvp/JeffAshlyn-8106.jpg",
    "/images/rsvp/JeffAshlyn-8113.jpg",
    "/images/rsvp/JeffAshlyn-8117.jpg",
    "/images/rsvp/JeffAshlyn-8120.jpg",
    "/images/rsvp/JeffAshlyn-8129.jpg",
    "/images/rsvp/JeffAshlyn-8147.jpg",
    "/images/rsvp/JeffAshlyn-8152.jpg",
    "/images/rsvp/JeffAshlyn-8156.jpg",
    "/images/rsvp/JeffAshlyn-8157.jpg",
    "/images/rsvp/JeffAshlyn-8160.jpg",
    "/images/rsvp/JeffAshlyn-8166.jpg",
    "/images/rsvp/JeffAshlyn-8173.jpg",
    "/images/rsvp/JeffAshlyn-8174.jpg",
    "/images/rsvp/JeffAshlyn-8175.jpg",
    "/images/rsvp/JeffAshlyn-8176.jpg",
] as const;

const RSVP_MASONRY_COLUMNS = 5;
const RSVP_TILE_ASPECTS = [
    "aspect-[3/4]", "aspect-square", "aspect-[4/5]", "aspect-[5/4]", "aspect-[2/3]",
] as const;

function RSVPBackdrop() {
    const columns = Array.from({ length: RSVP_MASONRY_COLUMNS }, (_, ci) =>
        RSVP_GALLERY_IMAGES.filter((_, ii) => ii % RSVP_MASONRY_COLUMNS === ci)
    );
    return (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[#f6f2ea]" />
            <div className="absolute inset-0 flex scale-110 gap-3 px-3 py-6 md:gap-4 md:px-6 md:py-8">
                {columns.map((images, ci) => (
                    <div key={`col-${ci}`} className={`min-w-0 flex-1 overflow-hidden ${ci > 2 ? "hidden lg:block" : ""}`}>
                        <div
                            className={`flex flex-col gap-3 md:gap-4 will-change-transform ${ci % 2 === 0 ? "animate-rsvp-scroll-up" : "animate-rsvp-scroll-down"}`}
                            style={{ animationDuration: `${264 + ci * 42}s` }}
                        >
                            {[...images, ...images].map((src, ii) => (
                                <div
                                    key={`${src}-${ii}`}
                                    className={`overflow-hidden rounded-[1.4rem] border border-white/35 bg-white/25 shadow-[0_10px_28px_rgba(15,23,32,0.14)] ${RSVP_TILE_ASPECTS[(ii + ci) % RSVP_TILE_ASPECTS.length]}`}
                                >
                                    <Image src={src} alt="" width={600} height={800}
                                        sizes="(max-width: 1024px) 33vw, 20vw"
                                        className="h-full w-full object-cover opacity-95" />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="absolute inset-0 bg-[rgba(9,18,30,0.58)]" />
        </div>
    );
}

function getDisplayHouseholdName(name: string): string {
    return name.replace(/\s+\d+\s*$/, "").trim();
}

// ── Types ─────────────────────────────────────────────────────────────────────

// Steps: 1 = Find Invitation, 2 = Who's Coming, 3 = A Few More Things, 4 = All Set
type RSVPStep = 1 | 2 | 3 | 4;
const STEP_LABELS = ["Find Invitation", "Who's Coming", "A Few More Things", "All Set!"];

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
    household_id: string;
};

type Household = { id: string; name: string; guests: Guest[] };

type GuestResponse = {
    attending: boolean | null;
    food_allergies: string;
    showAllergies: boolean;
};

// Stored in localStorage after a successful submit
type StoredRSVP = {
    householdId: string;
    householdName: string;
    anyAttending: boolean;
};

// ── Progress bar ──────────────────────────────────────────────────────────────

function RSVPProgressBar({ currentStep, onStepClick }: {
    currentStep: RSVPStep;
    onStepClick: (step: RSVPStep) => void;
}) {
    const total = STEP_LABELS.length;
    return (
        <div className="mb-8 md:mb-10 px-1">
            <div className="relative flex items-start justify-between">
                <div className="absolute top-4 left-4 right-4 h-px bg-primary/15 z-0" />
                <div
                    className="absolute top-4 left-4 h-px bg-primary/50 z-0 transition-all duration-500 ease-in-out"
                    style={{ width: `calc((${currentStep - 1} / ${total - 1}) * (100% - 2rem))` }}
                />
                {STEP_LABELS.map((label, i) => {
                    const stepNum = (i + 1) as RSVPStep;
                    const isCompleted = stepNum < currentStep;
                    const isCurrent = stepNum === currentStep;
                    const isClickable = isCompleted;
                    return (
                        <div key={label} className="relative z-10 flex flex-col items-center" style={{ width: `${100 / total}%` }}>
                            <button
                                type="button"
                                onClick={() => isClickable && onStepClick(stepNum)}
                                disabled={!isClickable}
                                aria-label={isClickable ? `Go back to step ${stepNum}: ${label}` : label}
                                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold transition-all duration-300 ${
                                    isCompleted
                                        ? "bg-primary border-primary text-white cursor-pointer hover:bg-primary/80 hover:scale-110"
                                        : isCurrent
                                        ? "bg-white border-primary text-primary shadow-[0_0_0_3px_rgba(26,63,111,0.12)] cursor-default"
                                        : "bg-white border-primary/20 text-text-secondary/40 cursor-default"
                                }`}
                            >
                                {isCompleted ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : stepNum}
                            </button>
                            <span
                                className={`mt-2 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium text-center leading-tight transition-colors duration-300 ${
                                    isCurrent ? "text-primary" : isCompleted ? "text-primary/50" : "text-text-secondary/35"
                                }`}
                                style={{ maxWidth: "4.5rem" }}
                            >
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ── Shared back/outline button style ─────────────────────────────────────────
const outlineBtn = "px-6 py-3 text-sm font-medium border border-gray-200 rounded-sm text-text-secondary hover:border-primary hover:text-primary transition-colors";

// ── Main component ────────────────────────────────────────────────────────────

export default function RSVP() {
    // ── Core form state
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [envError, setEnvError] = useState(false);
    const [step, setStep] = useState<RSVPStep>(1);

    // Step 1 sub-state: confirmation card shown before advancing
    const [confirming, setConfirming] = useState<{
        matchedName: string;
        household: Household;
        responses: Record<string, GuestResponse>;
    } | null>(null);

    // Step 2+ state
    const [household, setHousehold] = useState<Household | null>(null);
    const [responses, setResponses] = useState<Record<string, GuestResponse>>({});
    const [songRequest, setSongRequest] = useState("");
    const [advice, setAdvice] = useState("");

    // Returning visitor state (read from localStorage on mount)
    const [storedRSVP, setStoredRSVP] = useState<StoredRSVP | null>(null);
    const [loadingReturn, setLoadingReturn] = useState(false);

    // ── On mount: check localStorage for a previous submission ───────────────
    useEffect(() => {
        try {
            const raw = localStorage.getItem("rsvp_submitted");
            if (raw) {
                const parsed: StoredRSVP = JSON.parse(raw);
                if (parsed.householdId && parsed.householdName) {
                    setStoredRSVP(parsed);
                    setStep(4);
                }
            }
        } catch {
            // Corrupted storage — ignore and start fresh
        }
    }, []);

    // ── Leave/refresh guard ───────────────────────────────────────────────────
    // Active once the user has started filling out the form but hasn't submitted
    const guardActive = (step > 1 || !!confirming) && step !== 4;
    const pushedHistoryEntry = useRef(false);

    useEffect(() => {
        if (guardActive && !pushedHistoryEntry.current) {
            pushedHistoryEntry.current = true;
            window.history.pushState({ rsvpGuard: true }, "");
        }
    }, [guardActive]);

    useEffect(() => {
        if (!guardActive) return;
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };
        const handlePopState = () => {
            const leave = window.confirm("Leave site?\n\nChanges you made may not be saved.");
            if (leave) {
                window.removeEventListener("beforeunload", handleBeforeUnload);
                window.removeEventListener("popstate", handlePopState);
                window.history.back();
            } else {
                window.history.pushState({ rsvpGuard: true }, "");
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [guardActive]);

    // ── Derived ───────────────────────────────────────────────────────────────
    const anyAttending = household
        ? household.guests.some((g) => responses[g.id]?.attending === true)
        : false;

    // For step 4: did user come from localStorage only (no fresh submit this session)?
    const isReturningOnly = !!storedRSVP && !household;
    const step4Attending = household ? anyAttending : (storedRSVP?.anyAttending ?? false);
    const step4Name = storedRSVP?.householdName ?? (household ? getDisplayHouseholdName(household.name) : "");

    // ── Navigation ────────────────────────────────────────────────────────────

    const handleStepClick = (targetStep: RSVPStep) => {
        if (targetStep < step) {
            setError(null);
            setStep(targetStep);
            if (targetStep === 1) setConfirming(null);
        }
    };

    const goBack = () => {
        setError(null);
        if (step === 4) {
            // After submit: go back to the last content step
            setStep(anyAttending ? 3 : 2);
        } else if (step === 2) {
            setStep(1);
            setConfirming(null);
        } else if (step > 1) {
            setStep((prev) => (prev - 1) as RSVPStep);
        }
    };

    // ── Step 1: Search ────────────────────────────────────────────────────────

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setConfirming(null);

        const isMissingEnv =
            !process.env.NEXT_PUBLIC_SUPABASE_URL ||
            process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder");
        if (isMissingEnv) { setEnvError(true); setLoading(false); return; }

        const cleanFirst = firstName.trim();
        const cleanLast = lastName.trim();
        if (!cleanFirst || !cleanLast) {
            setError("Please enter both your first and last name.");
            setLoading(false);
            return;
        }

        const { data: allGuests, error: searchError } = await supabase
            .from("guests")
            .select("household_id, first_name, last_name, nicknames");

        if (searchError || !allGuests?.length) {
            setError("There was an error communicating with the database. Please try again.");
            setLoading(false);
            return;
        }

        const scored = allGuests.map((g) => {
            const nickScores = (g.nicknames || "")
                .split(/[,;\/]/)
                .map((n: string) => nameSimilarity(cleanFirst, n.trim()));
            const firstScore = Math.max(nameSimilarity(cleanFirst, g.first_name), ...nickScores);
            const lastScore = nameSimilarity(cleanLast, g.last_name);
            return { guest: g, combinedScore: firstScore * lastScore };
        });
        scored.sort((a, b) => b.combinedScore - a.combinedScore);

        const THRESHOLD = 0.35;
        const EXACT_THRESHOLD = 0.72;
        const topMatch = scored[0];

        if (!topMatch || topMatch.combinedScore < THRESHOLD) {
            setError(`We couldn't find "${cleanFirst} ${cleanLast}" on the guest list. Double-check your spelling.`);
            setLoading(false);
            return;
        }

        if (topMatch.combinedScore < EXACT_THRESHOLD) {
            const suggestions = scored
                .filter((s) => s.combinedScore >= THRESHOLD)
                .slice(0, 3)
                .map((s) => `${s.guest.first_name} ${s.guest.last_name}`)
                .join(", or ");
            setError(`We couldn't find "${cleanFirst} ${cleanLast}". Did you mean: ${suggestions}?`);
            setLoading(false);
            return;
        }

        const { data: householdData, error: hhError } = await supabase
            .from("households").select("*").eq("id", topMatch.guest.household_id).single();
        if (hhError || !householdData) {
            setError("We found your name, but couldn't load your household. Please try again.");
            setLoading(false);
            return;
        }

        const { data: hhGuests, error: guestError } = await supabase
            .from("guests").select("*").eq("household_id", topMatch.guest.household_id);
        if (guestError || !hhGuests) {
            setError("An error occurred loading household guests. Please try again.");
            setLoading(false);
            return;
        }

        const initialResponses: Record<string, GuestResponse> = {};
        hhGuests.forEach((g: Guest) => {
            initialResponses[g.id] = {
                attending: g.attending ?? null,
                food_allergies: g.food_allergies || "",
                showAllergies: !!(g.food_allergies),
            };
        });

        setConfirming({
            matchedName: `${topMatch.guest.first_name} ${topMatch.guest.last_name}`,
            household: { ...householdData, guests: hhGuests },
            responses: initialResponses,
        });
        setLoading(false);
    };

    const handleConfirm = () => {
        if (!confirming) return;
        setHousehold(confirming.household);
        setResponses(confirming.responses);
        setConfirming(null);
        setStep(2);
    };

    const handleNotMe = () => { setConfirming(null); setError(null); };

    // ── Step 2: response helpers ──────────────────────────────────────────────

    // Toggle: clicking the currently-selected option deselects it (→ null)
    const handleAttendingToggle = (guestId: string, value: boolean) => {
        const current = responses[guestId]?.attending;
        setResponses((prev) => ({
            ...prev,
            [guestId]: { ...prev[guestId], attending: current === value ? null : value },
        }));
    };

    const handleAllergyChange = (guestId: string, value: string) => {
        setResponses((prev) => ({
            ...prev,
            [guestId]: { ...prev[guestId], food_allergies: value },
        }));
    };

    // Show the allergy field for a guest (expand)
    const showAllergyField = (guestId: string) => {
        setResponses((prev) => ({
            ...prev,
            [guestId]: { ...prev[guestId], showAllergies: true },
        }));
    };

    // Hide the allergy field AND clear the value
    const hideAllergyField = (guestId: string) => {
        setResponses((prev) => ({
            ...prev,
            [guestId]: { ...prev[guestId], showAllergies: false, food_allergies: "" },
        }));
    };

    const handleAttendanceNext = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!household) return;
        const unselected = household.guests.find((g) => responses[g.id]?.attending === null);
        if (unselected) {
            setError(`Please select Attending or Declined for ${unselected.first_name}.`);
            return;
        }
        // If nobody is attending, skip step 3 and submit directly
        if (anyAttending) {
            setStep(3);
        } else {
            void handleSubmitRSVP();
        }
    };

    // ── Submit ────────────────────────────────────────────────────────────────

    const handleSubmitRSVP = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError(null);
        if (!household) return;
        setLoading(true);
        try {
            const updates = household.guests.map((g) => ({
                id: g.id,
                first_name: g.first_name,
                last_name: g.last_name,
                household_id: g.household_id,
                attending: responses[g.id]?.attending ?? null,
                meal_choice: null as string | null,
                food_allergies: responses[g.id]?.food_allergies?.trim() || null,
                song_request: songRequest.trim() || null,
                advice: advice.trim() || null,
            }));

            const { error: updateError } = await supabase.from("guests").upsert(updates);
            if (updateError) throw updateError;

            // Persist to localStorage so returning visitors see step 4
            const toStore: StoredRSVP = {
                householdId: household.id,
                householdName: getDisplayHouseholdName(household.name),
                anyAttending,
            };
            try { localStorage.setItem("rsvp_submitted", JSON.stringify(toStore)); } catch { /* ignore */ }
            setStoredRSVP(toStore);

            // Fire-and-forget history insert (doesn't block the user)
            const historyRows = household.guests.map((g) => ({
                guest_id: g.id,
                household_id: g.household_id,
                attending: responses[g.id]?.attending ?? null,
                food_allergies: responses[g.id]?.food_allergies?.trim() || null,
                song_request: songRequest.trim() || null,
                advice: advice.trim() || null,
            }));
            supabase.from("rsvp_history").insert(historyRows).then(({ error: histErr }) => {
                if (histErr) console.warn("RSVP history insert failed (non-blocking):", histErr);
            });

            setStep(4);
        } catch (err) {
            console.error("RSVP upsert error:", err);
            setError("Something went wrong while saving your RSVP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // ── Returning visitor: load their data from DB ────────────────────────────

    const handleMakeChanges = async () => {
        const id = storedRSVP?.householdId;
        if (!id) return;
        setLoadingReturn(true);
        setError(null);
        try {
            const { data: hhData, error: hhErr } = await supabase
                .from("households").select("*").eq("id", id).single();
            const { data: guests, error: gErr } = await supabase
                .from("guests").select("*").eq("household_id", id);
            if (hhErr || gErr || !hhData || !guests) throw new Error("Not found");

            const initialResponses: Record<string, GuestResponse> = {};
            guests.forEach((g: Guest) => {
                initialResponses[g.id] = {
                    attending: g.attending ?? null,
                    food_allergies: g.food_allergies || "",
                    showAllergies: !!(g.food_allergies),
                };
            });
            setHousehold({ ...hhData, guests });
            setResponses(initialResponses);

            // Restore song/advice from what's already in the DB
            const gWithData = guests.find((g: Guest) => g.song_request || g.advice);
            if (gWithData?.song_request) setSongRequest(gWithData.song_request);
            if (gWithData?.advice) setAdvice(gWithData.advice);

            setStep(2);
        } catch {
            setError("Could not load your RSVP data. Please refresh and try again.");
        } finally {
            setLoadingReturn(false);
        }
    };

    // ── Step headings ─────────────────────────────────────────────────────────

    const stepHeadings: Record<RSVPStep, { title: string; subtitle: string }> = {
        1: {
            title: "RSVP",
            subtitle: confirming ? "" : `Please respond by ${WEDDING.date.rsvpDeadline}. Enter your name to find your invitation.`,
        },
        2: {
            title: household ? getDisplayHouseholdName(household.name) : "Who's Coming?",
            subtitle: "Let us know who from your household will be joining us.",
        },
        3: { title: "Last Things", subtitle: "Two quick questions, then you're done." },
        4: {
            title: isReturningOnly ? `Welcome back!` : "You're All Set!",
            subtitle: "",
        },
    };

    const heading = stepHeadings[step];

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="relative min-h-screen overflow-hidden">
            <RSVPBackdrop />

            <Section className="relative z-10 flex min-h-screen flex-col justify-center bg-transparent py-20 text-center md:py-28">
                {/* Card — min-height prevents jarring jumps between steps */}
                <div
                    className="surface-panel mx-auto w-full max-w-[min(92vw,52rem)] p-6 shadow-[0_32px_90px_rgba(8,16,28,0.24)] sm:p-8 lg:p-12"
                    style={{ minHeight: "520px" }}
                >
                    {/* Progress bar (hidden on step 4) */}
                    {step !== 4 && (
                        <RSVPProgressBar currentStep={step} onStepClick={handleStepClick} />
                    )}

                    {/* Heading */}
                    <div className="mb-8 text-center md:mb-10">
                        <h1 className="font-heading text-4xl md:text-5xl">{heading.title}</h1>
                        {heading.subtitle && (
                            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-primary/72 md:text-lg">
                                {heading.subtitle}
                            </p>
                        )}
                    </div>

                    {/* Error banners */}
                    {envError && (
                        <div className="mb-8 p-6 bg-red-50 text-red-900 border border-red-200 rounded-sm text-left">
                            <h3 className="font-heading text-xl mb-2 text-red-800">Database Connection Error</h3>
                            <p className="text-sm">Running locally without a Supabase connection. Add keys to <code>.env.local</code> or test on the live domain.</p>
                        </div>
                    )}
                    {error && !envError && (
                        <div className="mb-6 p-4 bg-red-50 text-red-800 text-sm border border-red-200 rounded-sm">
                            {error}
                        </div>
                    )}

                    {/* ── Step 1: Search ──────────────────────────────────────────────── */}
                    {step === 1 && !envError && !confirming && (
                        <form onSubmit={handleSearch} className="space-y-6 text-left animate-fade-in-up">
                            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                                <div className="space-y-2 min-w-0">
                                    <label className="block text-xs uppercase tracking-widest text-text-secondary">First Name</label>
                                    <input
                                        type="text" required value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full min-w-0 border-b border-primary/18 py-3 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:border-primary transition-colors bg-transparent"
                                        placeholder="Enter your first name"
                                    />
                                </div>
                                <div className="space-y-2 min-w-0">
                                    <label className="block text-xs uppercase tracking-widest text-text-secondary">Last Name</label>
                                    <input
                                        type="text" required value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full min-w-0 border-b border-primary/18 py-3 text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:border-primary transition-colors bg-transparent"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>
                            <div className="pt-6">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Searching..." : "Find My Invitation"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* ── Step 1: Confirmation card ────────────────────────────────────── */}
                    {step === 1 && !envError && confirming && (
                        <div className="animate-fade-in-up space-y-6 text-center">
                            <div className="rounded-xl border border-primary/12 bg-surface/60 p-6 text-left">
                                <p className="text-xs uppercase tracking-widest text-text-secondary mb-3 font-medium">We found a match</p>
                                <p className="font-heading text-2xl text-primary mb-1">{confirming.matchedName}</p>
                                <p className="text-sm text-text-secondary">
                                    Household: <span className="font-medium text-primary/80">{getDisplayHouseholdName(confirming.household.name)}</span>
                                    {confirming.household.guests.length > 1 && (
                                        <span className="text-text-secondary/70"> · {confirming.household.guests.length} guests</span>
                                    )}
                                </p>
                            </div>
                            <p className="text-base text-text-secondary">Is this you?</p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button className="flex-1" onClick={handleConfirm}>Yes, that&apos;s me →</Button>
                                <button type="button" onClick={handleNotMe} className={`flex-1 ${outlineBtn}`}>
                                    Not me — search again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Step 2: Attendance ───────────────────────────────────────────── */}
                    {step === 2 && household && (
                        <form onSubmit={handleAttendanceNext} className="space-y-6 text-left animate-fade-in-up">
                            {household.guests.map((guest: Guest) => {
                                const resp = responses[guest.id];
                                const isAttending = resp?.attending;
                                return (
                                    <div key={guest.id} className="space-y-3 pb-6 border-b border-surface last:border-0">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <h3 className="font-medium text-lg border-l-2 border-primary pl-3 text-text-primary">
                                                {guest.first_name} {guest.last_name}
                                                {guest.suffix && <span className="text-text-secondary text-base ml-1">{guest.suffix}</span>}
                                            </h3>
                                            <div className="flex gap-2 flex-shrink-0 pl-5 sm:pl-0">
                                                {/* Click same button again to deselect */}
                                                <button type="button"
                                                    onClick={() => handleAttendingToggle(guest.id, true)}
                                                    className={`px-5 py-2 text-sm font-medium rounded-sm border transition-colors ${
                                                        isAttending === true
                                                            ? "bg-primary text-white border-primary"
                                                            : "bg-white text-text-secondary border-gray-200 hover:border-primary hover:text-primary"
                                                    }`}
                                                >Attending</button>
                                                <button type="button"
                                                    onClick={() => handleAttendingToggle(guest.id, false)}
                                                    className={`px-5 py-2 text-sm font-medium rounded-sm border transition-colors ${
                                                        isAttending === false
                                                            ? "bg-secondary text-white border-secondary"
                                                            : "bg-white text-text-secondary border-gray-200 hover:border-secondary hover:text-secondary"
                                                    }`}
                                                >Declined</button>
                                            </div>
                                        </div>

                                        {/* Dietary — hidden behind a small link; clear × to remove */}
                                        {isAttending === true && (
                                            <div className="pl-5 animate-fade-in-up">
                                                {!resp?.showAllergies ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => showAllergyField(guest.id)}
                                                        className="text-xs text-text-secondary/55 hover:text-primary underline underline-offset-2 transition-colors"
                                                    >
                                                        + Add dietary restriction or allergy
                                                    </button>
                                                ) : (
                                                    <div className="space-y-1.5 animate-fade-in-up">
                                                        <div className="flex items-center justify-between">
                                                            <label className="block text-xs uppercase tracking-widest text-text-secondary">
                                                                Dietary Restriction / Allergy
                                                            </label>
                                                            <button
                                                                type="button"
                                                                onClick={() => hideAllergyField(guest.id)}
                                                                className="text-xs text-text-secondary/40 hover:text-red-400 transition-colors leading-none"
                                                                aria-label="Remove dietary restriction"
                                                            >
                                                                ✕ Remove
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            autoFocus
                                                            value={resp?.food_allergies || ""}
                                                            onChange={(e) => handleAllergyChange(guest.id, e.target.value)}
                                                            placeholder="e.g. gluten-free, nut allergy"
                                                            className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-primary transition-colors bg-transparent placeholder:text-gray-400"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button type="button" onClick={goBack} className={`sm:w-auto ${outlineBtn}`}>← Back</button>
                                <Button type="submit" className="flex-1" disabled={loading}>
                                    {loading ? "Saving..." : anyAttending ? "Next →" : "Submit RSVP"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* ── Step 3: Extras ───────────────────────────────────────────────── */}
                    {step === 3 && household && (
                        <form onSubmit={handleSubmitRSVP} className="space-y-8 text-left animate-fade-in-up">
                            <div className="space-y-2">
                                <label className="block text-xs uppercase tracking-widest text-text-secondary">Song Request</label>
                                <p className="text-xs text-text-secondary/55">What song will get you on the dance floor?</p>
                                <input
                                    type="text" value={songRequest}
                                    onChange={(e) => setSongRequest(e.target.value)}
                                    placeholder="e.g. Mr. Brightside, Shout, anything Pitbull..."
                                    className="w-full border-b border-gray-300 py-3 text-sm focus:outline-none focus:border-primary transition-colors bg-transparent placeholder:text-gray-400"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs uppercase tracking-widest text-text-secondary">Advice for the Couple</label>
                                <p className="text-xs text-text-secondary/55">Words of wisdom? Terrible advice? We&apos;ll take it.</p>
                                <textarea
                                    value={advice}
                                    onChange={(e) => setAdvice(e.target.value)}
                                    placeholder="Share a thought..."
                                    rows={4}
                                    className="w-full border border-gray-200 p-3 text-sm rounded-sm focus:outline-none focus:border-primary bg-white resize-none placeholder:text-gray-400"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button type="button" onClick={goBack} className={`sm:w-auto ${outlineBtn}`}>← Back</button>
                                <Button type="submit" className="flex-1" disabled={loading}>
                                    {loading ? "Sending..." : "Send RSVP"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* ── Step 4: Confirmation / Returning visitor ─────────────────────── */}
                    {step === 4 && (
                        <div className="text-center space-y-6 animate-fade-in-up">
                            {/* Navy circle + beige checkmark */}
                            <div className="w-20 h-20 bg-primary mx-auto rounded-full flex items-center justify-center">
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24"
                                    stroke="#f6f2ea" strokeWidth={2.2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div className="space-y-3">
                                <p className="text-xs uppercase tracking-[0.2em] text-primary/60 font-medium">
                                    {isReturningOnly ? "Already Submitted" : "Response Received"}
                                </p>
                                {isReturningOnly && (
                                    <p className="font-heading text-2xl text-primary/70">{step4Name}</p>
                                )}
                                <p className="font-heading text-3xl md:text-4xl text-primary">
                                    {isReturningOnly ? "You're all set!" : "We've got you!"}
                                </p>
                                <p className="text-text-secondary leading-relaxed max-w-md mx-auto">
                                    {isReturningOnly
                                        ? "Your RSVP is already on file. Want to make any changes?"
                                        : step4Attending
                                        ? `Your RSVP is confirmed. We can't wait to celebrate with you on ${WEDDING.date.dayOfWeek}, ${WEDDING.date.display}.`
                                        : "We're sorry you can't make it, but we appreciate you letting us know."}
                                </p>
                            </div>

                            {/* Action buttons */}
                            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                                {isReturningOnly ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => void handleMakeChanges()}
                                            disabled={loadingReturn}
                                            className={outlineBtn}
                                        >
                                            {loadingReturn ? "Loading..." : "Make changes to my RSVP"}
                                        </button>
                                        <Button href="/">Return Home</Button>
                                    </>
                                ) : (
                                    <>
                                        <button type="button" onClick={goBack} className={outlineBtn}>← Back</button>
                                        <Button href="/">Return Home</Button>
                                    </>
                                )}
                            </div>

                            {/* Subtle trip planning link */}
                            {step4Attending && (
                                <p className="text-sm text-text-secondary/60 pt-1">
                                    Live outside DFW?{" "}
                                    <Link href="/travel" className="text-primary/70 underline underline-offset-2 hover:text-primary transition-colors">
                                        Plan your trip →
                                    </Link>
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
