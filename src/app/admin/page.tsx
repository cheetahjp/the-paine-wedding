"use client";

import React, { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import { supabase } from "@/lib/supabase";

type Guest = {
    id: string;
    first_name: string;
    last_name: string;
    attending: boolean | null;
    meal_choice: string | null;
    households: {
        name: string;
    };
};

export default function AdminDashboard() {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("guests")
            .select("*, households(name)")
            .order("last_name", { ascending: true });

        if (error) {
            setError(error.message);
        } else {
            setGuests(data as unknown as Guest[]);
        }
        setLoading(false);
    };

    // Analytics Calculations
    const totalInvited = guests.length;
    const totalAttending = guests.filter((g) => g.attending === true).length;
    const totalDeclined = guests.filter((g) => g.attending === false).length;
    const totalPending = guests.filter((g) => g.attending === null).length;

    const meals = {
        beef: guests.filter((g) => g.meal_choice === "beef").length,
        fish: guests.filter((g) => g.meal_choice === "fish").length,
        veg: guests.filter((g) => g.meal_choice === "veg").length,
    };

    return (
        <div className="pt-24 min-h-screen bg-surface">
            <Section className="pb-12">
                <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="font-heading text-4xl mb-2 text-primary">RSVP Dashboard</h1>
                        <p className="text-text-secondary">Real-time attendance and meal analytics.</p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="text-sm bg-primary text-white px-4 py-2 hover:bg-primary-light transition-colors"
                    >
                        Refresh Data
                    </button>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-50 text-red-800 text-sm border border-red-200">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-20 text-text-secondary">Loading analytics...</div>
                ) : (
                    <div className="space-y-10">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white p-6 border border-gray-100 shadow-sm text-center">
                                <h3 className="text-xs uppercase tracking-widest text-text-secondary mb-2">Total Invited</h3>
                                <p className="text-4xl font-heading text-primary">{totalInvited}</p>
                            </div>
                            <div className="bg-white p-6 border border-gray-100 shadow-sm text-center">
                                <h3 className="text-xs uppercase tracking-widest text-text-secondary mb-2">Attending</h3>
                                <p className="text-4xl font-heading text-green-700">{totalAttending}</p>
                            </div>
                            <div className="bg-white p-6 border border-gray-100 shadow-sm text-center">
                                <h3 className="text-xs uppercase tracking-widest text-text-secondary mb-2">Declined</h3>
                                <p className="text-4xl font-heading text-red-700">{totalDeclined}</p>
                            </div>
                            <div className="bg-white p-6 border border-gray-100 shadow-sm text-center">
                                <h3 className="text-xs uppercase tracking-widest text-text-secondary mb-2">Pending</h3>
                                <p className="text-4xl font-heading text-yellow-600">{totalPending}</p>
                            </div>
                        </div>

                        {/* Meals Grid */}
                        <div className="bg-white p-8 border border-gray-100 shadow-sm">
                            <h2 className="font-heading text-2xl text-primary mb-6">Meal Selections</h2>
                            <div className="grid grid-cols-3 gap-8 text-center">
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider text-text-secondary mb-1">Filet Mignon</h4>
                                    <p className="text-3xl font-heading text-primary">{meals.beef}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider text-text-secondary mb-1">Sea Bass</h4>
                                    <p className="text-3xl font-heading text-primary">{meals.fish}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm uppercase tracking-wider text-text-secondary mb-1">Vegetarian</h4>
                                    <p className="text-3xl font-heading text-primary">{meals.veg}</p>
                                </div>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-surface/50 text-text-secondary uppercase tracking-widest text-xs border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 font-normal">Guest Name</th>
                                            <th className="px-6 py-4 font-normal">Household</th>
                                            <th className="px-6 py-4 font-normal">Status</th>
                                            <th className="px-6 py-4 font-normal">Meal Choice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {guests.map((g) => (
                                            <tr key={g.id} className="hover:bg-surface/30 transition-colors">
                                                <td className="px-6 py-4 font-medium text-primary">
                                                    {g.first_name} {g.last_name}
                                                </td>
                                                <td className="px-6 py-4 text-text-secondary">
                                                    {g.households?.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {g.attending === true && <span className="text-green-700 bg-green-50 px-2 py-1 rounded text-xs">Attending</span>}
                                                    {g.attending === false && <span className="text-red-700 bg-red-50 px-2 py-1 rounded text-xs">Declined</span>}
                                                    {g.attending === null && <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs">Pending</span>}
                                                </td>
                                                <td className="px-6 py-4 text-text-secondary capitalize">
                                                    {g.meal_choice || "—"}
                                                </td>
                                            </tr>
                                        ))}
                                        {guests.length === 0 && (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-8 text-center text-text-secondary">
                                                    No guests found. Have you imported the data?
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </Section>
        </div>
    );
}
