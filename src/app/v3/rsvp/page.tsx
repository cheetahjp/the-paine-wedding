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
  rsvp_status: "attending" | "not_attending" | "pending";
  meal_choice?: string | null;
};

type Household = {
  id: string;
  name: string;
  guests: Guest[];
};

type Step = "search" | "dashboard" | "respond" | "success";

const statusLabel = (s: string) =>
  s === "attending" ? "Attending" : s === "not_attending" ? "Not Attending" : "Awaiting Response";

const statusColor = (s: string) =>
  s === "attending" ? "var(--v-navy)" : s === "not_attending" ? "var(--v-burgundy)" : "var(--v-tan)";

export default function V3RsvpPage() {
  const [step, setStep] = useState<Step>("search");
  const [searchName, setSearchName] = useState("");
  const [searching, setSearching] = useState(false);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [searchError, setSearchError] = useState("");
  const [responses, setResponses] = useState<Record<string, "attending" | "not_attending">>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchName.trim()) return;
    setSearching(true);
    setSearchError("");
    setHouseholds([]);

    const { data: guests, error } = await supabase
      .from("guests")
      .select("id, first_name, last_name, rsvp_status, meal_choice, household_id")
      .ilike("last_name", `%${searchName.trim()}%`);

    if (error || !guests?.length) {
      setSearchError("No guests found with that name. Try a different spelling, or contact us for help.");
      setSearching(false);
      return;
    }

    const householdMap: Record<string, Household> = {};
    for (const g of guests) {
      if (!householdMap[g.household_id]) {
        const { data: hData } = await supabase
          .from("households")
          .select("id, name")
          .eq("id", g.household_id)
          .single();
        householdMap[g.household_id] = { id: g.household_id, name: hData?.name ?? "Your Party", guests: [] };
      }
      householdMap[g.household_id].guests.push(g);
    }
    setHouseholds(Object.values(householdMap));
    setSearching(false);
  }

  function selectHousehold(h: Household) {
    setSelectedHousehold(h);
    const initial: Record<string, "attending" | "not_attending"> = {};
    h.guests.forEach((g) => {
      if (g.rsvp_status === "attending" || g.rsvp_status === "not_attending") {
        initial[g.id] = g.rsvp_status;
      }
    });
    setResponses(initial);
    setStep("dashboard");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedHousehold) return;
    setSubmitting(true);
    for (const guest of selectedHousehold.guests) {
      const status = responses[guest.id];
      if (status) {
        await supabase.from("guests").update({ rsvp_status: status }).eq("id", guest.id);
      }
    }
    setSubmitting(false);
    setStep("success");
  }

  return (
    <div style={{ backgroundColor: "var(--v-bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="pt-24 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <p className="v3-label mb-4">Reservation Desk</p>
        <h1
          style={{
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(2.5rem, 6vw, 5rem)",
            color: "var(--v-text)",
            lineHeight: 1.1,
          }}
        >
          {step === "success" ? "Reservation Confirmed" : "Reserve Your Place"}
        </h1>
        {step === "search" && (
          <p className="mt-4 v3-label">Enter your name to access your reservation</p>
        )}
      </div>

      <div className="max-w-xl mx-auto px-6 py-16">

        {/* STEP 1: Search */}
        {step === "search" && (
          <div>
            <form onSubmit={handleSearch} className="mb-8">
              <label
                htmlFor="lastname"
                className="v3-label block mb-3"
              >
                Last Name
              </label>
              <div className="flex gap-0">
                <input
                  id="lastname"
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g. Paine"
                  className="flex-1 px-4 py-3 text-base outline-none"
                  style={{
                    border: "1px solid var(--v-border)",
                    borderRight: "none",
                    backgroundColor: "var(--v-cream)",
                    color: "var(--v-text)",
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.9rem",
                  }}
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-6 py-3 text-xs tracking-widest uppercase"
                  style={{
                    backgroundColor: "var(--v-navy)",
                    color: "var(--v-cream)",
                    fontFamily: "var(--font-inter)",
                    opacity: searching ? 0.7 : 1,
                  }}
                >
                  {searching ? "..." : "Search"}
                </button>
              </div>
              {searchError && (
                <p className="mt-3" style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-burgundy)" }}>
                  {searchError}
                </p>
              )}
            </form>

            {households.length > 0 && (
              <div className="space-y-3">
                <p className="v3-label mb-4">Select Your Party</p>
                {households.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => selectHousehold(h)}
                    className="w-full text-left p-4 transition-all"
                    style={{ border: "1px solid var(--v-border)", backgroundColor: "var(--v-cream)" }}
                  >
                    <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.1rem", color: "var(--v-text)", marginBottom: "4px" }}>
                      {h.name}
                    </p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem", color: "var(--v-text-muted)" }}>
                      {h.guests.map((g) => `${g.first_name} ${g.last_name}`).join(", ")}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Dashboard — "Your Reservation" framed card */}
        {step === "dashboard" && selectedHousehold && (
          <div>
            <p className="v3-label mb-6">Your Reservation</p>

            {/* Framed reservation card */}
            <div
              style={{
                border: "2px solid var(--v-tan)",
                padding: "16px",
                backgroundColor: "var(--v-cream)",
              }}
            >
              {/* Header row */}
              <div
                className="flex items-center justify-between pb-5 mb-5"
                style={{ borderBottom: "1px solid var(--v-border)" }}
              >
                <div>
                  <p className="v3-label mb-1">Guest of Honor Party</p>
                  <h2
                    style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: "1.4rem",
                      color: "var(--v-text)",
                    }}
                  >
                    {selectedHousehold.name}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="v3-label mb-1">Party Size</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", color: "var(--v-navy)" }}>
                    {selectedHousehold.guests.length}
                  </p>
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-3 mb-5">
                <p className="v3-label">Reservation Status</p>
                {selectedHousehold.guests.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between py-2"
                    style={{ borderBottom: "1px solid var(--v-border)" }}
                  >
                    <div>
                      <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.85rem", color: "var(--v-text)" }}>
                        {g.first_name} {g.last_name}
                      </p>
                      {g.meal_choice && (
                        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.7rem", color: "var(--v-text-muted)" }}>
                          Meal: {g.meal_choice}
                        </p>
                      )}
                    </div>
                    <span
                      className="text-xs tracking-widest uppercase px-2 py-0.5"
                      style={{
                        border: `1px solid ${statusColor(g.rsvp_status)}`,
                        color: statusColor(g.rsvp_status),
                        fontFamily: "var(--font-inter)",
                      }}
                    >
                      {statusLabel(g.rsvp_status)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Event details */}
              <div
                className="grid grid-cols-2 gap-4 pt-4 mb-5"
                style={{ borderTop: "1px solid var(--v-border)" }}
              >
                {[
                  { label: "Date", value: "September 26, 2026" },
                  { label: "Ceremony", value: "5:00 PM" },
                  { label: "Venue", value: "Davis & Grey Farms" },
                  { label: "Location", value: "Celeste, Texas" },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="v3-label mb-0.5">{f.label}</p>
                    <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text)" }}>
                      {f.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setStep("respond")}
                  className="flex-1 py-3 text-xs tracking-widest uppercase"
                  style={{ backgroundColor: "var(--v-navy)", color: "var(--v-cream)", fontFamily: "var(--font-inter)" }}
                >
                  Update Reservation
                </button>
                <a
                  href="https://maps.google.com/?q=Davis+%26+Grey+Farms+2975+CR+1110+Celeste+TX+75423"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 text-xs tracking-widest uppercase text-center"
                  style={{ border: "1px solid var(--v-navy)", color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
                >
                  Directions
                </a>
              </div>
            </div>

            {/* Plaque below the frame */}
            <div style={{ borderTop: "2px solid var(--v-navy)", paddingTop: "8px", marginTop: "6px" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "0.85rem", color: "var(--v-text)" }}>
                Your Reservation
              </p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--v-text-muted)" }}>
                The Paine Wedding · September 26, 2026
              </p>
            </div>

            <button
              onClick={() => { setStep("search"); setSelectedHousehold(null); }}
              className="mt-6 v3-label block"
              style={{ color: "var(--v-text-muted)", background: "none", border: "none", cursor: "pointer" }}
            >
              ← Search Again
            </button>
          </div>
        )}

        {/* STEP 3: Response form */}
        {step === "respond" && selectedHousehold && (
          <form onSubmit={handleSubmit}>
            <button
              type="button"
              onClick={() => setStep("dashboard")}
              className="v3-label block mb-6"
              style={{ color: "var(--v-text-muted)", background: "none", border: "none", cursor: "pointer" }}
            >
              ← Back to Reservation
            </button>

            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.5rem", color: "var(--v-text)", marginBottom: "4px" }}>
              {selectedHousehold.name}
            </h2>
            <p className="v3-label mb-8">Confirm attendance for each guest</p>

            <div className="space-y-4 mb-8">
              {selectedHousehold.guests.map((g) => (
                <div
                  key={g.id}
                  className="p-5"
                  style={{ border: "1px solid var(--v-border)", backgroundColor: "var(--v-cream)" }}
                >
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: "1rem", color: "var(--v-text)", marginBottom: "12px" }}>
                    {g.first_name} {g.last_name}
                  </p>
                  <div className="flex gap-3">
                    {(["attending", "not_attending"] as const).map((status) => (
                      <label
                        key={status}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 cursor-pointer text-xs tracking-widest uppercase transition-all"
                        style={{
                          border: `1px solid ${responses[g.id] === status ? "var(--v-navy)" : "var(--v-border)"}`,
                          backgroundColor: responses[g.id] === status ? "var(--v-navy)" : "transparent",
                          color: responses[g.id] === status ? "var(--v-cream)" : "var(--v-text-muted)",
                          fontFamily: "var(--font-inter)",
                        }}
                      >
                        <input
                          type="radio"
                          name={`rsvp-${g.id}`}
                          value={status}
                          checked={responses[g.id] === status}
                          onChange={() => setResponses((r) => ({ ...r, [g.id]: status }))}
                          className="sr-only"
                        />
                        {status === "attending" ? "Attending" : "Unable to Attend"}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting || Object.keys(responses).length === 0}
              className="w-full py-4 text-xs tracking-widest uppercase"
              style={{
                backgroundColor: "var(--v-navy)",
                color: "var(--v-cream)",
                fontFamily: "var(--font-inter)",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Confirming..." : "Confirm Reservation →"}
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === "success" && (
          <div className="text-center py-8">
            {/* Framed confirmation */}
            <div
              className="inline-block"
              style={{ border: "2px solid var(--v-tan)", padding: "16px", backgroundColor: "var(--v-cream)", maxWidth: "360px" }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: "var(--v-navy)" }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p className="v3-label mb-3">Reservation Confirmed</p>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "1.8rem", color: "var(--v-text)", marginBottom: "12px" }}>
                We'll See You There
              </h2>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.8rem", color: "var(--v-text-muted)", lineHeight: 1.7 }}>
                Your RSVP has been received. We look forward to celebrating with you on September 26, 2026 at Davis &amp; Grey Farms, Celeste, Texas.
              </p>
            </div>

            {/* Plaque */}
            <div style={{ borderTop: "2px solid var(--v-navy)", paddingTop: "8px", marginTop: "6px", display: "inline-block", minWidth: "360px" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: "0.85rem", color: "var(--v-text)" }}>
                Reservation Record
              </p>
              <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--v-text-muted)" }}>
                The Paine Wedding · 2026
              </p>
            </div>

            <div className="mt-8">
              <button
                onClick={() => { setStep("search"); setSelectedHousehold(null); setSearchName(""); }}
                className="v3-label"
                style={{ color: "var(--v-text-muted)", background: "none", border: "none", cursor: "pointer" }}
              >
                ← Look Up Another Guest
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
