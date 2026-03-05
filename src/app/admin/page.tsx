"use client";

import React, { useState } from "react";
import Section from "@/components/ui/Section";
import { supabase } from "@/lib/supabase";

type Guest = {
    id: string;
    first_name: string;
    last_name: string;
    suffix: string | null;
    nicknames: string | null;
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
    const [importText, setImportText] = useState("");
    const [importing, setImporting] = useState(false);
    const [importMessage, setImportMessage] = useState("");
    const [envError, setEnvError] = useState(false);

    // Auth & Tracking State
    const [passwordInput, setPasswordInput] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState("");
    const [adminLogs, setAdminLogs] = useState<{ id: string, password_used: string, created_at: string }[]>([]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const pw = passwordInput.trim();
        let role = "";

        if (pw === "JeffreyAndAshlyn!") role = "Master";
        else if (pw === "JeffreyAndAshlyn1!") role = "User 1";
        else if (pw === "JeffreyAndAshlyn2!") role = "User 2";
        else if (pw === "JeffreyAndAshlyn3!") role = "User 3";
        else if (pw === "JeffreyAndAshlyn4!") role = "User 4";
        else if (pw === "JeffreyAndAshlyn5!") role = "User 5";
        else {
            setError("Invalid password.");
            return;
        }

        setUserRole(role);
        setIsAuthenticated(true);
        fetchData();

        // Log the login attempt asynchronously
        supabase.from("admin_logs").insert({ password_used: role }).then(({ error }) => {
            if (error) console.error("Could not log login attempt. Ensure admin_logs table is created.");
        });

        if (role === "Master") {
            const { data } = await supabase.from("admin_logs").select("*").order("created_at", { ascending: false });
            if (data) setAdminLogs(data);
        }
    };

    const fetchData = async () => {
        setLoading(true);

        const isMissingEnv = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") || !process.env.NEXT_PUBLIC_SUPABASE_URL;
        if (isMissingEnv) {
            setEnvError(true);
            setLoading(false);
            return;
        }

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

    const handleImport = async () => {
        setImporting(true);
        setImportMessage("");

        const rows = importText.split('\n').filter(r => r.trim());
        if (rows.length === 0) {
            setImportMessage("No data found to import.");
            setImporting(false);
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        for (const row of rows) {
            // First try tab separated (copy/paste from Excel/Sheets), fallback to comma
            const cols = row.split('\t').map(c => c.trim());
            const finalCols = cols.length >= 3 ? cols : row.split(',').map(c => c.trim());

            if (finalCols.length < 3) {
                errorCount++;
                continue;
            }

            const householdName = finalCols[0];
            const firstName = finalCols[1];
            const lastName = finalCols[2];
            const suffix = finalCols[3] || null;
            const nicknames = finalCols[4] || null;

            try {
                // Find or create household
                let { data: hh } = await supabase.from("households").select("id").eq("name", householdName).single();

                if (!hh) {
                    const { data: newHh, error: hhErr } = await supabase.from("households").insert({ name: householdName }).select().single();
                    if (hhErr) throw hhErr;
                    hh = newHh;
                }

                if (!hh) throw new Error("Failed to resolve household");

                // Insert Guest
                const { error: gErr } = await supabase.from("guests").insert({
                    first_name: firstName,
                    last_name: lastName,
                    suffix: suffix,
                    nicknames: nicknames,
                    household_id: hh.id
                });

                if (gErr) throw gErr;
                successCount++;
            } catch (err) {
                console.error(err);
                errorCount++;
            }
        }

        setImportMessage(`Import complete! Successfully added ${successCount} guests. ${errorCount > 0 ? `Failed parsing ${errorCount} rows.` : ""}`);
        setImportText("");
        setImporting(false);
        fetchData();
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

    if (!isAuthenticated) {
        return (
            <div className="pt-32 min-h-screen flex flex-col bg-surface">
                <Section className="text-center pb-12 flex-grow flex flex-col justify-start">
                    <div className="max-w-md mx-auto w-full bg-white p-10 shadow-sm border border-gray-100 mt-10">
                        <h1 className="font-heading text-3xl mb-6 text-primary">Admin Access</h1>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 text-red-800 text-sm border border-red-200 text-left">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="space-y-2 text-left">
                                <label className="block text-xs uppercase tracking-widest text-text-secondary">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-primary transition-colors bg-transparent"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-primary text-white px-6 py-3 hover:bg-primary-light transition-colors"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </Section>
            </div>
        );
    }

    return (
        <div className="pt-24 min-h-screen bg-surface">
            <Section className="pb-12">
                <div className="flex justify-between items-end mb-10 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="font-heading text-4xl mb-2 text-primary">RSVP Dashboard</h1>
                        <p className="text-text-secondary">Logged in as: <strong className="text-primary">{userRole}</strong></p>
                    </div>
                    <button
                        onClick={fetchData}
                        className="text-sm bg-primary text-white px-4 py-2 hover:bg-primary-light transition-colors"
                    >
                        Refresh Data
                    </button>
                </div>

                {envError && (
                    <div className="mb-8 p-6 bg-red-50 text-red-900 border border-red-200 shadow-sm rounded-sm">
                        <h3 className="font-heading text-xl mb-2 text-red-800">Database Connection Error</h3>
                        <p className="mb-4">It looks like this code is running locally but is missing the connection to your Supabase database. Add your keys to an <code>.env.local</code> file in this folder to test the site locally! Or, test it on your live Vercel `.com` domain instead.</p>
                        <p className="text-sm"><code>NEXT_PUBLIC_SUPABASE_URL=your_url</code><br /><code>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key</code></p>
                    </div>
                )}

                {error && !envError && (
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
                        <div className="bg-white border border-gray-100 shadow-sm overflow-hidden mb-12">
                            <div className="p-6 border-b border-gray-100 bg-surface/50">
                                <h2 className="font-heading text-xl text-primary">Guest List by Household</h2>
                                <p className="text-sm text-text-secondary mt-1">This shows exactly how guests are grouped into RSVP families.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-surface/80 text-text-secondary uppercase tracking-widest text-xs border-b border-gray-200">
                                        <tr>
                                            <th className="px-6 py-4 font-normal">Household / Guest Name</th>
                                            <th className="px-6 py-4 font-normal">Status</th>
                                            <th className="px-6 py-4 font-normal">Meal Choice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {Object.entries(
                                            guests.reduce((acc, guest) => {
                                                const householdName = guest.households?.name || "Unknown Household";
                                                if (!acc[householdName]) acc[householdName] = [];
                                                acc[householdName].push(guest);
                                                return acc;
                                            }, {} as Record<string, Guest[]>)
                                        )
                                            .sort(([a], [b]) => a.localeCompare(b))
                                            .map(([householdName, householdGuests]) => (
                                                <React.Fragment key={householdName}>
                                                    {/* Household Divider Row */}
                                                    <tr className="bg-surface/30 border-t-2 border-gray-100">
                                                        <td colSpan={3} className="px-6 py-3 font-heading text-primary font-bold">
                                                            {householdName}
                                                        </td>
                                                    </tr>
                                                    {/* Guest Rows for Household */}
                                                    {householdGuests.map((g) => (
                                                        <tr key={g.id} className="hover:bg-surface/10 transition-colors">
                                                            <td className="px-6 py-3 pl-10 font-medium text-text-secondary">
                                                                {g.first_name} {g.last_name} {g.suffix && <span className="text-gray-400 ml-1">{g.suffix}</span>}
                                                            </td>
                                                            <td className="px-6 py-3">
                                                                {g.attending === true && <span className="text-green-700 bg-green-50 px-2 py-1 rounded text-xs">Attending</span>}
                                                                {g.attending === false && <span className="text-red-700 bg-red-50 px-2 py-1 rounded text-xs">Declined</span>}
                                                                {g.attending === null && <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs">Pending</span>}
                                                            </td>
                                                            <td className="px-6 py-3 capitalize text-text-secondary">
                                                                {g.meal_choice || "—"}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </React.Fragment>
                                            ))}
                                        {guests.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-6 py-8 text-center text-text-secondary">
                                                    No guests found. Have you imported the data?
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Bulk Importer */}
                        <div className="bg-white p-8 border border-gray-100 shadow-sm">
                            <h2 className="font-heading text-2xl text-primary mb-2">Import Guests</h2>
                            <p className="text-sm text-text-secondary mb-6">
                                Paste data directly from Excel or Google Sheets. The data must have 5 columns in this exact order: <br /><strong>Household Name, First Name, Last Name, Suffix (Optional), Nicknames (Optional)</strong>.
                            </p>

                            {importMessage && (
                                <div className={`mb-6 p-4 text-sm border ${importMessage.includes("Failed") ? "bg-yellow-50 text-yellow-800 border-yellow-200" : "bg-green-50 text-green-800 border-green-200"}`}>
                                    {importMessage}
                                </div>
                            )}

                            <div className="space-y-4">
                                <textarea
                                    className="w-full border border-gray-200 p-4 min-h-[150px] text-sm focus:outline-none focus:border-primary font-mono bg-surface"
                                    placeholder={`The Paine Family\tJeffrey\tPaine\t\tJeff\nThe Paine Family\tAshlyn\tBimmerle\t\tAsh\nThe Paine Family\tJohn\tPaine\tIII\t`}
                                    value={importText}
                                    onChange={(e) => setImportText(e.target.value)}
                                ></textarea>

                                <button
                                    onClick={handleImport}
                                    disabled={importing || !importText.trim()}
                                    className="bg-primary text-white px-6 py-3 hover:bg-primary-light transition-colors disabled:opacity-50"
                                >
                                    {importing ? "Importing Data..." : "Run Import"}
                                </button>
                            </div>
                        </div>

                        {/* Master Admin Tracking Logs */}
                        {userRole === "Master" && (
                            <div className="bg-white border border-gray-100 shadow-sm overflow-hidden mb-12 animate-fade-in-up">
                                <div className="p-6 border-b border-gray-100 bg-primary/5 flex justify-between items-center">
                                    <h2 className="font-heading text-2xl text-primary">Security & Login Tracking</h2>
                                    <span className="text-xs uppercase tracking-widest text-primary font-bold">Master View</span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-surface/50 text-text-secondary uppercase tracking-widest text-xs border-b border-gray-100">
                                            <tr>
                                                <th className="px-6 py-4 font-normal">Account Used</th>
                                                <th className="px-6 py-4 font-normal">Time (UTC)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {adminLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-surface/30 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-primary">
                                                        {log.password_used}
                                                    </td>
                                                    <td className="px-6 py-4 text-text-secondary">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                            {adminLogs.length === 0 && (
                                                <tr>
                                                    <td colSpan={2} className="px-6 py-8 text-center text-text-secondary">
                                                        No login history available.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Section>
        </div>
    );
}
