import Section from "@/components/ui/Section";
import GamesHubClient from "@/components/games/GamesHubClient";

export default function GamesPage() {
    return (
        <div className="pt-20">
            <Section className="pb-12 text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-text-secondary">Wedding Games</p>
                <h1 className="mt-4 font-heading text-5xl md:text-6xl text-primary">Choose a Game</h1>
                <p className="mx-auto mt-6 max-w-2xl text-text-secondary leading-relaxed">
                    A quick hub for table cards and QR codes. Pick trivia if you want to test your couple knowledge,
                    or try the daily Painedle puzzle.
                </p>
            </Section>

            <Section background="surface" className="py-20">
                <GamesHubClient />
            </Section>
        </div>
    );
}
