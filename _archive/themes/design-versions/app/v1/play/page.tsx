export const metadata = { title: "Play | Midnight Editorial" };

export default function V1PlayPage() {
  return (
    <div className="v1-theme">
      {/* ── Header ────────────────────────────────── */}
      <section
        className="px-8 pt-24 pb-20"
        style={{ background: "linear-gradient(180deg, #0d1e30 0%, #08111d 100%)" }}
      >
        <div className="max-w-4xl mx-auto">
          <p
            className="uppercase tracking-widest mb-4"
            style={{ fontSize: "11px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
          >
            Chapter IX
          </p>
          <h1
            className="font-bold italic leading-none"
            style={{
              fontFamily: "var(--font-playfair)",
              fontSize: "clamp(72px, 10vw, 120px)",
              color: "var(--v-cream)",
            }}
          >
            Play
          </h1>
          <div className="mt-6 w-16 h-px" style={{ backgroundColor: "var(--v-burgundy)" }} />
          <p
            className="mt-6 max-w-xl"
            style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--v-text-muted)", lineHeight: "1.7" }}
          >
            A little fun before the big day. Two games built just for the wedding —
            test your knowledge and compete with the other guests.
          </p>
        </div>
      </section>

      {/* ── Games ─────────────────────────────────── */}
      <section className="px-8 py-20" style={{ borderTop: "1px solid var(--v-border)" }}>
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Painedle */}
          <div
            className="p-10 border"
            style={{
              backgroundColor: "var(--v-surface)",
              borderColor: "var(--v-border)",
              borderTopColor: "var(--v-burgundy)",
              borderTopWidth: "2px",
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1">
                <p
                  className="uppercase tracking-widest mb-3"
                  style={{ fontSize: "9px", color: "var(--v-burgundy)", fontFamily: "var(--font-inter)" }}
                >
                  Daily Word Game
                </p>
                <h2
                  className="font-bold mb-4"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(36px, 4vw, 52px)", color: "var(--v-cream)" }}
                >
                  Painedle
                </h2>
                <p
                  style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--v-text-muted)", lineHeight: "1.7", maxWidth: "480px" }}
                >
                  A Wordle-style daily puzzle with words selected from the world of Ashlyn and Jeffrey.
                  New word every day. Six guesses. Can you solve it?
                </p>
                <div className="flex gap-6 mt-6">
                  {["5-letter words", "Daily reset", "Wedding themed"].map((tag) => (
                    <span key={tag} className="uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: "var(--v-text-muted)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <a href="/games" className="v1-btn-primary" style={{ fontSize: "11px", textAlign: "center" }}>
                  Play Today&apos;s Puzzle →
                </a>
              </div>
            </div>
          </div>

          {/* Trivia */}
          <div
            className="p-10 border"
            style={{
              backgroundColor: "var(--v-surface)",
              borderColor: "var(--v-border)",
              borderTopColor: "var(--v-tan)",
              borderTopWidth: "2px",
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="flex-1">
                <p
                  className="uppercase tracking-widest mb-3"
                  style={{ fontSize: "9px", color: "var(--v-tan)", fontFamily: "var(--font-inter)" }}
                >
                  Couples Quiz
                </p>
                <h2
                  className="font-bold mb-4"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(36px, 4vw, 52px)", color: "var(--v-cream)" }}
                >
                  How Well Do You Know Us?
                </h2>
                <p
                  style={{ fontFamily: "var(--font-inter)", fontSize: "15px", color: "var(--v-text-muted)", lineHeight: "1.7", maxWidth: "480px" }}
                >
                  Ten questions about Ashlyn and Jeffrey — their history, quirks, and favorite things.
                  How high can you score? Compete against other guests on the leaderboard.
                </p>
                <div className="flex gap-6 mt-6">
                  {["10 questions", "Leaderboard", "Replayable"].map((tag) => (
                    <span key={tag} className="uppercase tracking-wider"
                      style={{ fontFamily: "var(--font-inter)", fontSize: "9px", color: "var(--v-text-muted)" }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <a href="/games" className="v1-btn-outline" style={{ fontSize: "11px", textAlign: "center" }}>
                  Take the Quiz →
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Leaderboard Teaser ───────────────────── */}
      <section className="px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div
            className="p-8 border flex items-center gap-8"
            style={{
              backgroundColor: "var(--v-surface)",
              borderColor: "var(--v-border)",
              borderStyle: "dashed",
            }}
          >
            <div className="flex-1">
              <p
                className="uppercase tracking-widest mb-2"
                style={{ fontSize: "9px", color: "var(--v-text-muted)", fontFamily: "var(--font-inter)" }}
              >
                Leaderboard
              </p>
              <p
                className="font-bold italic"
                style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "var(--v-cream)" }}
              >
                Who knows us best?
              </p>
              <p
                style={{ fontFamily: "var(--font-inter)", fontSize: "13px", color: "var(--v-text-muted)" }}
              >
                Scores from both games are tracked. Play to claim the top spot.
              </p>
            </div>
            <a
              href="/games"
              className="flex-shrink-0 uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "10px",
                color: "var(--v-tan)",
                borderBottom: "1px solid var(--v-tan)",
                paddingBottom: "2px",
              }}
            >
              See Leaderboard
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
