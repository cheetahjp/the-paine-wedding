import Link from "next/link";

export const metadata = {
  title: "Field Notes & Games | Paper Atlas",
  description: "Games and puzzles for the Paine Wedding guests.",
};

export default function V2PlayPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--v-bg)" }}>
      {/* Header */}
      <div className="pt-20 pb-12 px-6 text-center" style={{ borderBottom: "1px solid var(--v-border)" }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Chapter Nine · Field Notes
          </p>
          <h1 className="text-5xl md:text-7xl mb-4" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)", lineHeight: 1.1 }}>
            Games &amp; Puzzles
          </h1>
          <p className="text-base" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Pass the time before the big day with a little friendly competition.
          </p>
          <p className="mt-3 text-xl" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            for the curious traveler ↓
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">

        {/* Painedle */}
        <div
          className="p-7"
          style={{
            border: "1px solid var(--v-border)",
            backgroundColor: "var(--v-surface)",
            borderTop: "3px solid var(--v-navy)",
          }}
        >
          <div className="flex items-start gap-5">
            {/* Stamp icon */}
            <div
              className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl"
              style={{ border: "2px dashed var(--v-navy)", backgroundColor: "var(--v-bg)" }}
            >
              🔤
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                  Painedle
                </h2>
                <span
                  className="text-xs tracking-widest uppercase px-2 py-0.5"
                  style={{ border: "1px dashed var(--v-navy)", color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
                >
                  Daily
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                A daily word puzzle crafted just for the Paine Wedding. Guess the five-letter word in six tries — each day brings a new word tied to Ashlyn and Jeffrey's story.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/games"
                  className="text-xs tracking-widest uppercase py-2.5 px-5"
                  style={{ backgroundColor: "var(--v-navy)", color: "#fbf8f4", fontFamily: "var(--font-inter)" }}
                >
                  Play Today's Puzzle →
                </Link>
                <p className="text-sm" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
                  new word every day!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Couple Trivia */}
        <div
          className="p-7"
          style={{
            border: "1px solid var(--v-border)",
            backgroundColor: "var(--v-surface)",
            borderTop: "3px solid var(--v-burgundy)",
          }}
        >
          <div className="flex items-start gap-5">
            {/* Stamp icon */}
            <div
              className="shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl"
              style={{ border: "2px dashed var(--v-burgundy)", backgroundColor: "var(--v-bg)" }}
            >
              ❓
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
                  Couple Trivia
                </h2>
                <span
                  className="text-xs tracking-widest uppercase px-2 py-0.5"
                  style={{ border: "1px dashed var(--v-burgundy)", color: "var(--v-burgundy)", fontFamily: "var(--font-inter)" }}
                >
                  10 Questions
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
                How well do you know Ashlyn &amp; Jeffrey? Take our trivia quiz and find out — 10 questions about the couple, their story, and their big day. See if you can beat your fellow travelers on the leaderboard.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/games"
                  className="text-xs tracking-widest uppercase py-2.5 px-5"
                  style={{ backgroundColor: "var(--v-burgundy)", color: "#fbf8f4", fontFamily: "var(--font-inter)" }}
                >
                  Take the Quiz →
                </Link>
                <p className="text-sm" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
                  leaderboard bragging rights await
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard teaser */}
        <div
          className="p-6 text-center"
          style={{
            border: "2px dashed var(--v-border)",
            backgroundColor: "var(--v-bg)",
          }}
        >
          <p className="text-xs tracking-widest uppercase mb-2" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Leaderboard
          </p>
          <p className="text-lg mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--v-text)" }}>
            Who Knows Us Best?
          </p>
          <p className="text-sm mb-4" style={{ color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}>
            Play both games to climb the combined leaderboard and earn bragging rights at the reception.
          </p>
          <p className="text-base" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            may the best guest win ✦
          </p>
          <Link
            href="/games"
            className="inline-block mt-4 text-xs tracking-widest uppercase"
            style={{ color: "var(--v-navy)", fontFamily: "var(--font-inter)" }}
          >
            View Full Leaderboard →
          </Link>
        </div>

        {/* Route annotation */}
        <div className="text-center py-4">
          <p className="text-xl" style={{ color: "var(--v-tan)", fontFamily: "var(--font-caveat)" }}>
            a little something for the journey ✈
          </p>
        </div>
      </div>
    </div>
  );
}
