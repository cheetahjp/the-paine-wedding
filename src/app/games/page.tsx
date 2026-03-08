import Section from "@/components/ui/Section";
import GamesHubClient from "@/components/games/GamesHubClient";
import { TRIVIA_UNLOCK_LABEL } from "@/lib/games/schedule";

export default function GamesPage() {
    return (
        <div className="pt-20 bg-[linear-gradient(180deg,#fbf7f1_0%,#f2f0ed_42%,#ffffff_100%)]">
            <Section className="pb-12 pt-12 md:pt-16">
                <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/10 bg-[linear-gradient(135deg,#10253c_0%,#173756_44%,#5d1822_100%)] px-8 py-12 text-white shadow-[0_30px_90px_rgba(20,42,68,0.18)] md:px-12 md:py-16">
                    <div className="pointer-events-none absolute -right-16 top-0 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
                    <div className="pointer-events-none absolute -left-12 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

                    <div className="relative grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
                        <div>
                            <p className="text-sm uppercase tracking-[0.34em] text-white/70">Wedding Games</p>
                            <h1 className="mt-5 max-w-3xl font-heading text-5xl leading-none md:text-7xl">
                                A better home for the table games.
                            </h1>
                            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                                Painedle is live now for anyone who wants the daily puzzle. Couple Trivia stays locked
                                until wedding day so it still feels like a live reception game.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                {
                                    label: "Live Now",
                                    value: "Painedle",
                                    copy: "Daily five-letter puzzle with saved progress.",
                                },
                                {
                                    label: "Unlocks",
                                    value: TRIVIA_UNLOCK_LABEL,
                                    copy: "Trivia opens on the wedding date for the event leaderboard.",
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-[1.6rem] border border-white/15 bg-white/8 p-5 backdrop-blur-sm"
                                >
                                    <p className="text-xs uppercase tracking-[0.28em] text-white/60">{item.label}</p>
                                    <p className="mt-3 font-heading text-3xl text-white">{item.value}</p>
                                    <p className="mt-3 text-sm leading-relaxed text-white/75">{item.copy}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            <Section className="py-12 md:py-16">
                <div className="mb-10 grid gap-4 md:grid-cols-3">
                    {[
                        {
                            label: "Findable",
                            copy: "Games are now in the main site navigation, not hidden behind QR cards only.",
                        },
                        {
                            label: "Live Leaderboards",
                            copy: "Guest usernames and email-backed scores feed the leaderboard as soon as Supabase tables are present.",
                        },
                        {
                            label: "Wedding-Day Lock",
                            copy: "Trivia stays closed until the day of and shows a clear countdown instead of a dead end.",
                        },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="rounded-[1.75rem] border border-primary/10 bg-white/80 p-6 shadow-[0_18px_50px_rgba(20,42,68,0.07)] backdrop-blur"
                        >
                            <p className="text-xs uppercase tracking-[0.28em] text-text-secondary">{item.label}</p>
                            <p className="mt-4 text-base leading-relaxed text-primary">{item.copy}</p>
                        </div>
                    ))}
                </div>

                <GamesHubClient />
            </Section>
        </div>
    );
}
