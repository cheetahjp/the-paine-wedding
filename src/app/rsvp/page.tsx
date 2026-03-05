"use client";

import React, { useState } from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

type Guest = {
    id: string;
    first_name: string;
    last_name: string;
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
    const [step, setStep] = useState<"search" | "respond" | "success">("search");
    const [household, setHousehold] = useState<Household | null>(null);
    const [responses, setResponses] = useState<{
        [guestId: string]: { attending: boolean; meal_choice: string };
    }>({});

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Fetch the guest by first and last name
        const { data: searchGuests, error: searchError } = await supabase
            .from("guests")
            .select("household_id")
            .ilike("first_name", `%${firstName}%`)
            .ilike("last_name", `%${lastName}%`);

        if (searchError || !searchGuests || searchGuests.length === 0) {
            setError("We couldn't find an invitation under that name. Please check your spelling and try again.");
            setLoading(false);
            return;
        }

        const householdId = searchGuests[0].household_id;

        // Fetch the household details
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

        // Fetch all guests belonging to that household
        const { data: allHouseholdGuests, error: allGuestError } = await supabase
            .from("guests")
            .select("*")
            .eq("household_id", householdId);

        if (allGuestError || !allHouseholdGuests) {
            setError("An error occurred loading the guests.");
            setLoading(false);
            return;
        }

        // Initialize the response state based on current guest data
        const initialResponses: any = {};
        allHouseholdGuests.forEach((g: Guest) => {
            initialResponses[g.id] = {
                attending: g.attending ?? null,
                meal_choice: g.meal_choice || "",
            };
        });

        setResponses(initialResponses);
        setHousehold({ ...householdData, guests: allHouseholdGuests });
        setStep("respond");
        setLoading(false);
    };

    const handleResponseChange = (guestId: string, field: string, value: any) => {
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
            // Setup payload array for upsert/update
            const updates = household.guests.map((g) => ({
                id: g.id,
                first_name: g.first_name,
                last_name: g.last_name,
                household_id: g.household_id,
                attending: responses[g.id].attending,
                meal_choice: responses[g.id].meal_choice === "" ? null : responses[g.id].meal_choice,
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

    return (
        <div className="pt-20 min-h-screen flex flex-col">
            <Section className="text-center pb-12 flex-grow flex flex-col justify-center">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">RSVP</h1>

                <div className="max-w-md mx-auto w-full mt-12 bg-white p-10 shadow-[0_20px_50px_rgba(20,42,68,0.05)] border border-surface rounded-sm">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-800 text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    {step === "search" && (
                        <form onSubmit={handleSearch} className="space-y-6 text-left">
                            <p className="text-text-secondary text-center mb-8">
                                Please enter your first and last name to find your invitation.
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

                    {step === "respond" && household && (
                        <form onSubmit={handleSubmitRSVP} className="space-y-8 text-left animate-fade-in-up">
                            <h2 className="font-heading text-2xl text-primary text-center pb-4 border-b border-surface">
                                {household.name}
                            </h2>

                            {household.guests.map((guest: Guest) => {
                                const isAttending = responses[guest.id]?.attending;
                                return (
                                    <div key={guest.id} className="space-y-4 pb-6 border-b border-surface last:border-0">
                                        <h3 className="font-medium text-lg border-l-2 border-primary pl-3">
                                            {guest.first_name} {guest.last_name}
                                        </h3>

                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`attending-${guest.id}`}
                                                    checked={isAttending === true}
                                                    onChange={() => handleResponseChange(guest.id, "attending", true)}
                                                    required
                                                    className="accent-primary"
                                                />
                                                <span className="text-sm">Joyfully Accepts</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name={`attending-${guest.id}`}
                                                    checked={isAttending === false}
                                                    onChange={() => handleResponseChange(guest.id, "attending", false)}
                                                    required
                                                    className="accent-primary"
                                                />
                                                <span className="text-sm">Regretfully Declines</span>
                                            </label>
                                        </div>

                                        {isAttending && (
                                            <div className="space-y-2 pt-2 animate-fade-in-up">
                                                <label className="block text-xs uppercase tracking-widest text-text-secondary">
                                                    Meal Preference
                                                </label>
                                                <select
                                                    value={responses[guest.id]?.meal_choice || ""}
                                                    onChange={(e) => handleResponseChange(guest.id, "meal_choice", e.target.value)}
                                                    required
                                                    className="w-full border border-gray-200 p-3 text-sm rounded-sm focus:outline-none focus:border-primary bg-white"
                                                >
                                                    <option value="">Select a meal</option>
                                                    <option value="beef">Filet Mignon</option>
                                                    <option value="fish">Seared Sea Bass</option>
                                                    <option value="veg">Vegetarian Risotto</option>
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            <div className="pt-4">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? "Submitting..." : "Send RSVP"}
                                </Button>
                            </div>
                        </form>
                    )}

                    {step === "success" && (
                        <div className="text-center space-y-6 animate-fade-in-up">
                            <div className="w-16 h-16 bg-primary/10 text-primary mx-auto rounded-full flex items-center justify-center mb-6">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="font-heading text-3xl text-primary">Thank You!</h2>
                            <p className="text-text-secondary leading-relaxed">
                                Your RSVP has been beautifully received. We are so excited to celebrate with you.
                            </p>
                            <div className="pt-6">
                                <Button href="/" variant="outline">Return Home</Button>
                            </div>
                        </div>
                    )}
                </div>
            </Section>
        </div>
    );
}
