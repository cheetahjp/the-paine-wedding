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
  dietary_restrictions?: string | null;
};

type Household = {
  id: string;
  name: string;
  guests: Guest[];
};

type Step = "search" | "dashboard" | "respond" | "success";

export default function V2RsvpPage() {
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
      .select("id, first_name, last_name, rsvp_status, meal_choice, dietary_restrictions, household_id")
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

  const statusLabel = (status: string) => {
    if (status === "attending") return "Attending ✓";
    if (status === "not_attending") return "Not Attending";
    return "Awaiting Response";
  };

  const statusColor = (status: string) => {
    if (status === "attending") return "var(--v-navy)";
    if (status === "not_attending") return "var(--v-burgundy)";
    return "var(--v-tan)";
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-20 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Chapter Seven · Your Journey
          </p>
          <h1 className="text-5xl md:text-7xl mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)", lineHeight: 1.1 }}>
            {step === "success" ? "All Set!" : "Confirm Your Journey"}
          </h1>
          {step === "search" && (
            <p className="text-base" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
              Look up your name to access your boarding pass.
            </p>
          )}
          <p className="mt-3 text-xl" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            {step === "success" ? "we'll see you there ✈" : "RSVP by August 1, 2026"}
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">

        {/* STEP 1: Search */}
        {step === "search" && (
          <div>
            <form onSubmit={handleSearch} className="mb-8">
              <label
                htmlFor="lastname"
                className="block text-xs tracking-widest uppercase mb-3"
                style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
              >
                Enter Your Last Name
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
                    backgroundColor: "var(--v-surface)",
                    color: "var(--v-text)",
                    fontFamily: "var(--font-inter)",
                  }}
                />
                <button
                  type="submit"
                  disabled={searching}
                  className="px-6 py-3 text-xs tracking-widest uppercase transition-opacity"
                  style={{
                    backgroundColor: "var(--v-navy)",
                    color: "#fbf8f4",
                    fontFamily: "var(--font-inter)",
                    opacity: searching ? 0.7 : 1,
                  }}
                >
                  {searching ? "..." : "Search"}
                </button>
              </div>
              {searchError && (
                <p className="mt-3 text-sm" style={{ color: "var(--v-burgundy)", fontFamily: "var(--font-inter)" }}>
                  {searchError}
                </p>
              )}
            </form>

            {households.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  Select Your Party
                </p>
                {households.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => selectHousehold(h)}
                    className="w-full text-left p-4 transition-all"
                    style={{
                      border: "1px solid var(--v-border)",
                      backgroundColor: "var(--v-surface)",
                    }}
                  >
                    <p className="font-medium mb-1" style={{ color: "var(--v-text)", fontFamily: "var(--font-playfair)" }}>
                      {h.name}
                    </p>
                    <p className="text-xs" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                      {h.guests.map((g) => `${g.first_name} ${g.last_name}`).join(", ")}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Dashboard — boarding pass style */}
        {step === "dashboard" && selectedHousehold && (
          <div>
            {/* Boarding pass card */}
            <div
              style={{
                border: "1px solid var(--v-border)",
                backgroundColor: "var(--v-surface)",
                overflow: "hidden",
              }}
            >
              {/* Pass header */}
              <div
                className="px-6 py-4 flex items-center justify-between"
                style={{ backgroundColor: "var(--v-navy)", color: "#fbf8f4" }}
              >
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "var(--font-inter)", opacity: 0.7 }}>
                    Boarding Pass
                  </p>
                  <h2 className="text-xl" style={{ fontFamily: "var(--font-playfair)" }}>
                    {selectedHousehold.name}
                  </h2>
                </div>
                <div className="text-right">
                  <p className="text-xs tracking-widest uppercase mb-1" style={{ fontFamily: "var(--font-inter)", opacity: 0.7 }}>
                    Passengers
                  </p>
                  <p className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)" }}>
                    {selectedHousehold.guests.length}
                  </p>
                </div>
              </div>

              {/* Perforated divider */}
              <div
                className="px-4 py-2 flex items-center gap-2"
                style={{ borderBottom: "2px dashed var(--v-border)", backgroundColor: "var(--v-bg)" }}
              >
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "var(--v-tan)" }} />
                <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: "var(--v-border)" }} />
                <p className="text-xs tracking-widest uppercase" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                  Tear here
                </p>
                <div className="flex-1 border-t-2 border-dashed" style={{ borderColor: "var(--v-border)" }} />
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: "var(--v-tan)" }} />
              </div>

              {/* Pass body */}
              <div className="p-6">
                {/* Destination info */}
                <div className="grid grid-cols-2 gap-6 mb-6 pb-6" style={{ borderBottom: "1px dashed var(--v-border)" }}>
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                      Destination
                    </p>
                    <p className="text-lg" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                      Celeste, TX
                    </p>
                    <p className="text-xs" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                      Davis & Grey Farms
                    </p>
                  </div>
                  <div>
                    <p className="text-xs tracking-widest uppercase mb-1" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                      Departure Date
                    </p>
                    <p className="text-lg" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                      Sept 26, 2026
                    </p>
                    <p className="text-xs" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                      Ceremony at 5:00 PM
                    </p>
                  </div>
                </div>

                {/* Guest list */}
                <div className="space-y-3 mb-6">
                  <p className="text-xs tracking-widest uppercase mb-3" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                    Passenger Manifest
                  </p>
                  {selectedHousehold.guests.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between py-2"
                      style={{ borderBottom: "1px dashed var(--v-border)" }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--v-text)", fontFamily: "var(--font-inter)" }}>
                          {g.first_name} {g.last_name}
                        </p>
                        {g.meal_choice && (
                          <p className="text-xs" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                            Meal: {g.meal_choice}
                          </p>
                        )}
                      </div>
                      <span
                        className="text-xs tracking-widest uppercase px-2 py-1"
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

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("respond")}
                    className="flex-1 py-3 text-xs tracking-widest uppercase"
                    style={{ backgroundColor: "var(--v-navy)", color: "#fbf8f4", fontFamily: "var(--font-inter)" }}
                  >
                    Update Response
                  </button>
                  <a
                    href="https://maps.google.com/?q=Davis+%26+Grey+Farms+2975+CR+1110+Celeste+TX+75423"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 text-xs tracking-widest uppercase text-center"
                    style={{ border: "1px solid var(--v-navy)", color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={() => { setStep("search"); setSelectedHousehold(null); }}
              className="mt-4 text-xs tracking-widest uppercase"
              style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
            >
              ← Search Again
            </button>
          </div>
        )}

        {/* STEP 3: Response form */}
        {step === "respond" && selectedHousehold && (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <button
                type="button"
                onClick={() => setStep("dashboard")}
                className="text-xs tracking-widest uppercase mb-6 block"
                style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
              >
                ← Back to Boarding Pass
              </button>
              <h2 className="text-2xl mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                {selectedHousehold.name}
              </h2>
              <p className="text-sm" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                Confirm your attendance for each passenger:
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {selectedHousehold.guests.map((g) => (
                <div
                  key={g.id}
                  className="p-5"
                  style={{ border: "1px solid var(--v-border)", backgroundColor: "var(--v-surface)" }}
                >
                  <p className="font-medium mb-3" style={{ color: "var(--v-text)", fontFamily: "var(--font-playfair)" }}>
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
                          color: responses[g.id] === status ? "#fbf8f4" : "var(--v-text-muted)",
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
                        {status === "attending" ? "✓ Attending" : "✗ Can't Make It"}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={submitting || Object.keys(responses).length === 0}
              className="w-full py-4 text-xs tracking-widest uppercase transition-opacity"
              style={{
                backgroundColor: "var(--v-navy)",
                color: "#fbf8f4",
                fontFamily: "var(--font-inter)",
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Submitting..." : "Confirm Responses →"}
            </button>
          </form>
        )}

        {/* STEP 4: Success */}
        {step === "success" && (
          <div className="text-center py-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: "var(--v-navy)", color: "#fbf8f4" }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Boarding pass success */}
            <div
              className="inline-block px-10 py-8 text-center mb-8"
              style={{ border: "2px dashed var(--v-navy)", backgroundColor: "var(--v-surface)", maxWidth: "360px" }}
            >
              <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                Confirmed
              </p>
              <h2 className="text-3xl mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-navy)" }}>
                Bon Voyage!
              </h2>
              <p className="text-sm" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                Your RSVP has been received. We'll see you in Celeste, Texas on September 26, 2026.
              </p>
              <div className="mt-4 pt-4" style={{ borderTop: "1px dashed var(--v-border)" }}>
                <p className="text-xl" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
                  Can't wait to celebrate with you! ✈
                </p>
              </div>
            </div>

            <div>
              <button
                onClick={() => { setStep("search"); setSelectedHousehold(null); setSearchName(""); }}
                className="text-xs tracking-widest uppercase"
                style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
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
