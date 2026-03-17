import Section from "@/components/ui/Section";
import GamesHubClient from "@/components/games/GamesHubClient";

export default function GamesPage() {
    return (
        <div className="bg-[linear-gradient(180deg,#fbf7f1_0%,#f4f1eb_30%,#ffffff_100%)]">
            <Section background="surface" className="text-center pb-14 pt-12 md:pb-16 md:pt-16">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Games</h1>
                <p className="max-w-2xl mx-auto text-text-secondary tracking-wide leading-relaxed">
                    A little fun before the big day — test your knowledge, solve the puzzle, and see how well you know the happy couple.
                </p>
            </Section>
            <Section className="pb-16 pt-8 md:pt-10">
                <GamesHubClient />
            </Section>
        </div>
    );
}
