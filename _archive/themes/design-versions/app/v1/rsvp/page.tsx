"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  rsvp_status: string | null;
  meal_choice: string | null;
  dietary_restrictions: string | null;
  is_plus_one: boolean;
  plus_one_name: string | null;
  household_id: string;
};

type Household = {
  id: string;
  name: string;
  guests: Guest[];
};

type Step = "search" | "dashboard" | "respond" | "success";

export default function V1RsvpPage() {
  const [step, setStep] = useState<Step>("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Household[]>([]);
  const [selected, setSelected] = useState<Household | null>(null);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<Record<string, string>>({});

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    setResults([]);

    const parts = query.trim().split(/\s+/);
    const lastName = parts[parts.length - 1];

    const { data: guests, error: guestError } = await supabase
      .from("guests")
      .select("*")
      .ilike("last_name", `%${lastName}%`);

    if (guestError || !guests?.length) {
      setError("No guests found. Try your last name or a family member's name.");
      setSearching(false);
      return;
    }

    const householdIds = [...new Set(guests.map((g: Guest) => g.household_id))];
    const { data: households } = await supabase
      .from("households")
      .select("*")
      .in("id", householdIds);

    const enriched: Household[] = (households || []).map((hh: Omit<Household, "guests">) => ({
      ...hh,
      guests: guests.filter((g: Guest) => g.household_id === hh.id),
    }));

    setResults(enriched);
    setSearching(false);
  }

  function selectHousehold(hh: Household) {
    setSelected(hh);
    const initial: Record<string, string> = {};
    hh.guests.forEach((g) => {
      initial[`rsvp_${g.id}`] = g.rsvp_status || "";
      initial[`meal_${g.id}`] = g.meal_choice || "";
    });
    setForm(initial);
    setStep("dashboard");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setError("");

    for (const guest of selected.guests) {
      await supabase.from("guests").update({
        rsvp_status: form[`rsvp_${guest.id}`] || null,
        meal_choice: form[`meal_${guest.id}`] || null,
      }).eq("id", guest.id);
    }

    setSubmitting(false);
    setStep("success");
  }

  const statusColor = (status: string | null) => {
    if (status === "attending") return "var(--v-tan)";
    if (status === "not_attending") return "var(--v-text-muted)";
    return "var(--v-burgundy)";
  };

  const statusLabel = (status: string | null) => {
    if (status === "attending") return "Attending";
    if (status === "not_attending") return "Not Attending";
    return "Awaiting Response";
  };

  return (
    <div className="v1-theme min-h-screen">
      {/* ── Header ─────────────────────────────── */}
      <section
        className="px-8 pt-24 pb-16"
        style={{ background: "linear-gradient(180deg, #0d1e30 0%, #08111d 100%)" }}
      >
        <div className="max-w-2xl mx-auto">
          <p className="uppercase tracking-widest mb-4"
            style={{ fontSize: "11px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Chapter VII
          </p>
          <h1 className="font-bold italic leading-none"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(64px, 9vw, 110px)", color: "var(--v-cream)" }}>
            RSVP
          </h1>
          <div className="mt-6 w-16 h-px" style={{ backgroundColor: "var(--v-burgundy)" }} />
          <p className="mt-6" style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--v-text-muted)", lineHeight: "1.7" }}>
            Please respond by <strong style={{ color: "var(--v-cream)" }}>August 1, 2026</strong>.
            Search your name or last name to find your invitation.
          </p>
        </div>
      </section>

      <section className="px-8 py-16">
        <div className="max-w-2xl mx-auto">

          {/* ── STEP: SEARCH ─────────────────────── */}
          {step === "search" && (
            <>
              <form onSubmit={handleSearch} className="mb-10">
                <label className="block uppercase tracking-widest mb-4"
                  style={{ fontSize: "10px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  Find Your Invitation
                </label>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter your last name…"
                    className="v1-input flex-1"
                    style={{ fontSize: "16px", paddingBottom: "10px" }}
                  />
                  <button type="submit" className="v1-btn-primary" disabled={searching}
                    style={{ fontSize: "11px", minWidth: "100px" }}>
                    {searching ? "Searching…" : "Search"}
                  </button>
                </div>
                {error && (
                  <p className="mt-4" style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-burgundy)" }}>
                    {error}
                  </p>
                )}
              </form>

              {results.length > 0 && (
                <div className="space-y-3">
                  <p className="uppercase tracking-widest mb-4"
                    style={{ fontSize: "10px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                    Select Your Household
                  </p>
                  {results.map((hh) => (
                    <button key={hh.id} onClick={() => selectHousehold(hh)}
                      className="w-full text-left p-6 border transition-all"
                      style={{
                        backgroundColor: "var(--v-surface)",
                        borderColor: "var(--v-border)",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--v-burgundy)")}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--v-border)")}
                    >
                      <p className="font-bold mb-1"
                        style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "var(--v-cream)" }}>
                        {hh.name}
                      </p>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)" }}>
                        {hh.guests.map((g) => g.first_name).join(", ")} &mdash; {hh.guests.length} guest{hh.guests.length !== 1 ? "s" : ""}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── STEP: DASHBOARD ──────────────────── */}
          {step === "dashboard" && selected && (
            <div>
              {/* Dashboard Card */}
              <div className="p-8 border mb-8"
                style={{
                  backgroundColor: "var(--v-surface)",
                  borderColor: "var(--v-border)",
                  borderTopColor: "var(--v-burgundy)",
                  borderTopWidth: "2px",
                }}>
                <p className="uppercase tracking-widest mb-2"
                  style={{ fontSize: "9px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  Your Invitation
                </p>
                <h2 className="font-bold italic mb-1"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "32px", color: "var(--v-cream)" }}>
                  {selected.name}
                </h2>
                <p className="mb-6" style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)" }}>
                  {selected.guests.length} guest{selected.guests.length !== 1 ? "s" : ""} in your household
                </p>

                {/* Guests */}
                <div className="space-y-4 mb-8">
                  {selected.guests.map((g) => (
                    <div key={g.id} className="flex items-center justify-between py-3 border-b"
                      style={{ borderColor: "var(--v-border)" }}>
                      <div>
                        <p className="font-bold" style={{ fontFamily: "var(--font-playfair)", fontSize: "16px", color: "var(--v-cream)" }}>
                          {g.first_name} {g.last_name}
                        </p>
                        {g.meal_choice && (
                          <p style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "var(--v-text-muted)" }}>
                            Meal: {g.meal_choice}
                          </p>
                        )}
                      </div>
                      <span className="uppercase tracking-widest"
                        style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: statusColor(g.rsvp_status) }}>
                        {statusLabel(g.rsvp_status)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Event Details */}
                <div className="p-5 border mb-6" style={{ backgroundColor: "var(--v-bg)", borderColor: "var(--v-border)" }}>
                  <p className="uppercase tracking-widest mb-3"
                    style={{ fontSize: "9px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                    Event Details
                  </p>
                  {[
                    { label: "Date", value: "Saturday, September 26, 2026" },
                    { label: "Ceremony", value: "5:00 PM" },
                    { label: "Venue", value: "Davis & Grey Farms" },
                    { label: "Location", value: "Celeste, Texas" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between mb-2 last:mb-0">
                      <span className="uppercase tracking-wider"
                        style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: "var(--v-text-muted)" }}>
                        {label}
                      </span>
                      <span style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-cream)" }}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep("respond")} className="v1-btn-primary" style={{ fontSize: "11px" }}>
                    Update Response
                  </button>
                  <a href="https://maps.google.com/?q=Davis+%26+Grey+Farms+2975+CR+1110+Celeste+TX+75423"
                    target="_blank" rel="noopener noreferrer"
                    className="v1-btn-outline" style={{ fontSize: "11px" }}>
                    Get Directions
                  </a>
                </div>
              </div>

              <button onClick={() => { setStep("search"); setSelected(null); setResults([]); }}
                className="uppercase tracking-widest"
                style={{ fontFamily: "var(--font-inter)", fontSize: "10px", color: "var(--v-text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                ← Search Again
              </button>
            </div>
          )}

          {/* ── STEP: RESPOND ────────────────────── */}
          {step === "respond" && selected && (
            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-bold italic"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "28px", color: "var(--v-cream)" }}>
                  Your Response
                </h2>
                <button type="button" onClick={() => setStep("dashboard")}
                  className="uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-inter)", fontSize: "10px", color: "var(--v-text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                  ← Back
                </button>
              </div>

              <div className="space-y-8 mb-10">
                {selected.guests.map((g) => (
                  <div key={g.id} className="p-6 border"
                    style={{ backgroundColor: "var(--v-surface)", borderColor: "var(--v-border)" }}>
                    <p className="font-bold mb-4"
                      style={{ fontFamily: "var(--font-playfair)", fontSize: "20px", color: "var(--v-cream)" }}>
                      {g.first_name} {g.last_name}
                    </p>

                    <div className="mb-4">
                      <p className="uppercase tracking-widest mb-3"
                        style={{ fontSize: "9px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                        Will you be attending?
                      </p>
                      <div className="flex gap-3">
                        {[
                          { value: "attending", label: "Yes, I'll be there" },
                          { value: "not_attending", label: "Regretfully no" },
                        ].map(({ value, label }) => (
                          <label key={value}
                            className="flex-1 p-4 border text-center cursor-pointer transition-all"
                            style={{
                              backgroundColor: form[`rsvp_${g.id}`] === value ? "var(--v-burgundy)" : "var(--v-bg)",
                              borderColor: form[`rsvp_${g.id}`] === value ? "var(--v-burgundy)" : "var(--v-border)",
                              cursor: "pointer",
                            }}>
                            <input type="radio" name={`rsvp_${g.id}`} value={value} className="sr-only"
                              checked={form[`rsvp_${g.id}`] === value}
                              onChange={() => setForm((f) => ({ ...f, [`rsvp_${g.id}`]: value }))} />
                            <span style={{ fontFamily: "var(--font-inter)", fontSize: "12px", color: "var(--v-cream)", userSelect: "none" }}>
                              {label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <p className="mb-4" style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-burgundy)" }}>
                  {error}
                </p>
              )}

              <button type="submit" className="v1-btn-primary w-full" disabled={submitting}
                style={{ fontSize: "12px", padding: "16px" }}>
                {submitting ? "Saving…" : "Submit Response"}
              </button>
            </form>
          )}

          {/* ── STEP: SUCCESS ────────────────────── */}
          {step === "success" && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: "var(--v-burgundy)" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="var(--v-burgundy)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h2 className="font-bold italic mb-4"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "42px", color: "var(--v-cream)" }}>
                We&apos;ve Got You
              </h2>
              <p className="mb-10 max-w-md mx-auto"
                style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--v-text-muted)", lineHeight: "1.7" }}>
                Your response has been saved. We can&apos;t wait to celebrate with you on September 26th.
              </p>
              <button onClick={() => { setStep("search"); setQuery(""); setResults([]); setSelected(null); }}
                className="v1-btn-outline" style={{ fontSize: "11px" }}>
                Done
              </button>
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
