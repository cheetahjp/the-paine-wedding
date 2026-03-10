"use client";

import React, { useState } from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { WEDDING } from "@/lib/wedding-data";

/** Strip trailing number from household names for guest-facing display.
 *  "The Paine Family 1" → "The Paine Family"
 *  "The Paine Family"   → "The Paine Family"  (unchanged)
 */
function getDisplayHouseholdName(name: string): string {
    return name.replace(/\s+\d+\s*$/, "").trim();
}

type Guest = {
    id: string;
    first_name: string;
    last_name: string;
    suffix: string | null;
    nicknames: string | null;
    attending: boolean | null;
    meal_choice: string | null;
    household_id: string;
};

type Household = {
    id: string;
    name: string;
    guests: Guest[];
};

export default function RSVP() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [envError, setEnvError] = useState(false);
    const [step, setStep] = useState<"search" | "respond" | "success">("search");
    const [household, setHousehold] = useState<Household | null>(null);
    const [responses, setResponses] = useState<{
        [guestId: string]: { attending: boolean; meal_choice: string };
    }>({});

    // Household-level extra fields
    const [hasFoodAllergy, setHasFoodAllergy] = useState(false);
    const [foodAllergyDetails, setFoodAllergyDetails] = useState("");
    const [songRequest, setSongRequest] = useState("");
    const [advice, setAdvice] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const isMissingEnv =
            process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") ||
            !process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (isMissingEnv) {
            setEnvError(true);
            setLoading(false);
            return;
        }

        const cleanFirstName = firstName.trim();
        const cleanLastName = lastName.trim();

        if (!cleanFirstName || !cleanLastName) {
            setError("Please enter both your first and last name.");
            setLoading(false);
            return;
        }

        const { data: searchGuests, error: searchError } = await supabase
            .from("guests")
            .select("household_id, first_name, last_name, nicknames")
            .ilike("last_name", `%${cleanLastName}%`);

        if (searchError) {
            setError("There was an error communicating with the database. Please try again.");
            setLoading(false);
            return;
        }

        if (!searchGuests || searchGuests.length === 0) {
            setError("We couldn't find an invitation under that last name. Please check your spelling.");
            setLoading(false);
            return;
        }

        const exactMatch = searchGuests.find((g) => {
            const first = g.first_name.toLowerCase();
            const nicks = (g.nicknames || "").toLowerCase();
            const input = cleanFirstName.toLowerCase();
            return first.includes(input) || input.includes(first) || nicks.includes(input);
        });

        if (!exactMatch) {
            const uniqueSuggestions = Array.from(
                new Set(searchGuests.map((g) => `${g.first_name} ${g.last_name}`))
            );
            const suggestions = uniqueSuggestions.slice(0, 3).join(", or ");
            setError(`We couldn't find "${cleanFirstName} ${cleanLastName}". Did you mean ${suggestions}?`);
            setLoading(false);
            return;
        }

        const householdId = exactMatch.household_id;

        const { data: householdData, error: hhError } = await supabase
            .from("households")
            .select("*")
            .eq("id", householdId)
            .single();

        if (hhError || !householdData) {
            setError("We found your name, but couldn't load your household details.");
            setLoading(false);
            return;
        }

        const { data: allHouseholdGuests, error: allGuestError } = await supabase
            .from("guests")
            .select("*")
            .eq("household_id", householdId);

        if (allGuestError || !allHouseholdGuests) {
            setError("An error occurred loading the guests.");
            setLoading(false);
            return;
        }

        const initialResponses: Record<string, { attending: boolean; meal_choice: string }> = {};
        allHouseholdGuests.forEach((g: Guest) => {
            initialResponses[g.id] = {
                attending: g.attending ?? true,
                meal_choice: g.meal_choice || "",
            };
        });

        setResponses(initialResponses);
        setHousehold({ ...householdData, guests: allHouseholdGuests });
        setStep("respond");
        setLoading(false);
    };

    const handleResponseChange = (guestId: string, field: string, value: string | boolean) => {
        setResponses((prev) => ({
            ...prev,
            [guestId]: {
                ...prev[guestId],
                [field]: value,
            },
        }));
    };

    const handleSubmitRSVP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!household) return;

        try {
            const foodAllergiesValue = hasFoodAllergy ? foodAllergyDetails || "Yes" : null;

            const updates = household.guests.map((g) => ({
                id: g.id,
                first_name: g.first_name,
                last_name: g.last_name,
                household_id: g.household_id,
                attending: responses[g.id].attending,
                meal_choice:
                    responses[g.id].meal_choice === "" ? null : responses[g.id].meal_choice,
                food_allergies: foodAllergiesValue,
                song_request: songRequest.trim() || null,
                advice: advice.trim() || null,
            }));

            const { error: updateError } = await supabase.from("guests").upsert(updates);

            if (updateError) throw updateError;

            setStep("success");
        } catch (err) {
            console.error(err);
            setError("Something went wrong while saving your RSVP. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const anyAttending = household
        ? household.guests.some((g) => responses[g.id]?.attending)
        : false;

    return (
        <div className="min-h-screen flex flex-col">
            <Section className="text-center pb-12 flex-grow flex flex-col justify-center">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">RSVP</h1>

                <div className="max-w-md mx-auto w-full mt-12 bg-white p-10 shadow-[0_20px_50px_rgba(20,42,68,0.05)] border border-surface rounded-sm">
                    {envError && (
                        <div className="mb-8 p-6 bg-red-50 text-red-900 border border-red-200 shadow-sm rounded-sm text-left">
                            <h3 className="font-heading text-xl mb-2 text-red-800">
                                Database Connection Error
                            </h3>
                            <p className="mb-4 text-sm">
                                It looks like this code is running locally but is missing the connection
                                to your Supabase database. Add your keys to an{" "}
                                <code>.env.local</code> file in this folder to test the site locally!
                                Or, test it on your live Vercel <code>.com</code> domain instead.
                            </p>
                        </div>
                    )}

                    {error && !envError && (
                        <div className="mb-6 p-4 bg-red-50 text-red-800 text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    {/* Step 1: Search */}
                    {step === "search" && !envError && (
                        <form onSubmit={handleSearch} className="space-y-6 text-left">
                            <p className="text-text-secondary text-center mb-8">
                                Please RSVP by <strong>{WEDDING.date.rsvpDeadline}</strong>. Enter
                                your first and last name to find your invitation.
                            </p>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="space-y-2 flex-1">
                                    <label className="block text-xs uppercase tracking-widest text-text-secondary">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary transition-colors bg-transparent"
                                        placeholder="Enter your first name"
                                    />
                                </div>

                                <div className="space-y-2 flex-1">
                                    <label className="block text-xs uppercase tracking-widest text-text-secondary">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary transition-colors bg-transparent"
                                        placeholder="Enter your last name"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Locating..." : "Find Invitation"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Step 2: Respond */}
                    {step === "respond" && household && (
                        <form onSubmit={handleSubmitRSVP} className="space-y-8 text-left animate-fade-in-up">
                            <h2 className="font-heading text-2xl text-primary text-center pb-4 border-b border-surface">
                                {getDisplayHouseholdName(household.name)}
                            </h2>

                            {/* Per-guest attendance + meal */}
                            {household.guests.map((guest: Guest) => {
                                const isAttending = responses[guest.id]?.attending;
                                return (
                                    <div
                                        key={guest.id}
                                        className="space-y-4 pb-6 border-b border-surface last:border-0"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <h3 className="font-medium text-lg border-l-2 border-primary pl-3">
                                                {guest.first_name} {guest.last_name}{" "}
                                                {guest.suffix && (
                                                    <span className="text-text-secondary">
                                                        {guest.suffix}
                                                    </span>
                                                )}
                                            </h3>

                                            {/* Explicit Yes / No toggle — no ambiguous checkbox */}
                                            <div className="flex gap-2 flex-shrink-0 pl-5 sm:pl-0">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleResponseChange(guest.id, "attending", true)
                                                    }
                                                    className={`px-5 py-2 text-sm font-medium rounded-sm border transition-colors ${
                                                        isAttending
                                                            ? "bg-primary text-white border-primary"
                                                            : "bg-white text-text-secondary border-gray-200 hover:border-primary hover:text-primary"
                                                    }`}
                                                >
                                                    Attending
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleResponseChange(guest.id, "attending", false)
                                                    }
                                                    className={`px-5 py-2 text-sm font-medium rounded-sm border transition-colors ${
                                                        !isAttending
                                                            ? "bg-secondary text-white border-secondary"
                                                            : "bg-white text-text-secondary border-gray-200 hover:border-secondary hover:text-secondary"
                                                    }`}
                                                >
                                                    Declined
                                                </button>
                                            </div>
                                        </div>

                                        {isAttending && WEDDING.mealOptions.length > 0 && (
                                            <div className="space-y-2 pt-2 animate-fade-in-up">
                                                <label className="block text-xs uppercase tracking-widest text-text-secondary">
                                                    Meal Preference
                                                </label>
                                                <select
                                                    value={responses[guest.id]?.meal_choice || ""}
                                                    onChange={(e) =>
                                                        handleResponseChange(
                                                            guest.id,
                                                            "meal_choice",
                                                            e.target.value
                                                        )
                                                    }
                                                    required
                                                    className="w-full border border-gray-200 p-3 text-sm rounded-sm focus:outline-none focus:border-primary bg-white"
                                                >
                                                    <option value="">Select a meal</option>
                                                    {WEDDING.mealOptions.map((opt) => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {opt.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {/* Household-level extras — only show if at least one person is attending */}
                            {anyAttending && (
                                <div className="space-y-6 pt-2 border-t border-surface">
                                    <p className="text-xs uppercase tracking-widest text-text-secondary pt-2">
                                        A Few More Things
                                    </p>

                                    {/* Food Allergies */}
                                    <div className="space-y-3">
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={hasFoodAllergy}
                                                onChange={(e) => {
                                                    setHasFoodAllergy(e.target.checked);
                                                    if (!e.target.checked) setFoodAllergyDetails("");
                                                }}
                                                className="mt-0.5 w-4 h-4 accent-primary border-gray-300 rounded cursor-pointer flex-shrink-0"
                                            />
                                            <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors leading-snug">
                                                I have a food allergy or dietary restriction
                                            </span>
                                        </label>

                                        {hasFoodAllergy && (
                                            <input
                                                type="text"
                                                value={foodAllergyDetails}
                                                onChange={(e) => setFoodAllergyDetails(e.target.value)}
                                                placeholder="Please describe your allergy or restriction"
                                                className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-primary transition-colors bg-transparent placeholder:text-gray-400 animate-fade-in-up"
                                            />
                                        )}
                                    </div>

                                    {/* Song Request */}
                                    <div className="space-y-2">
                                        <label className="block text-xs uppercase tracking-widest text-text-secondary">
                                            Song Request
                                        </label>
                                        <input
                                            type="text"
                                            value={songRequest}
                                            onChange={(e) => setSongRequest(e.target.value)}
                                            placeholder="e.g. Shout — Tears For Fears"
                                            className="w-full border-b border-gray-300 py-2 text-sm focus:outline-none focus:border-primary transition-colors bg-transparent placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* Advice */}
                                    <div className="space-y-2">
                                        <label className="block text-xs uppercase tracking-widest text-text-secondary">
                                            Advice for the Couple
                                        </label>
                                        <textarea
                                            value={advice}
                                            onChange={(e) => setAdvice(e.target.value)}
                                            placeholder="Share a piece of marriage advice..."
                                            rows={3}
                                            className="w-full border border-gray-200 p-3 text-sm rounded-sm focus:outline-none focus:border-primary bg-white resize-none placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="pt-4">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Submitting..." : "Send RSVP"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Success */}
                    {step === "success" && (
                        <div className="text-center space-y-6 animate-fade-in-up">
                            <div className="w-16 h-16 bg-primary/10 text-primary mx-auto rounded-full flex items-center justify-center mb-6">
                                <svg
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="font-heading text-3xl text-primary">Thank You!</h2>
                            <p className="text-text-secondary leading-relaxed">
                                Your RSVP has been received. We are so excited to celebrate with you
                                on {WEDDING.date.dayOfWeek}, {WEDDING.date.display}.
                            </p>
                            <div className="pt-6">
                                <Button href="/" variant="outline">
                                    Return Home
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
