import Section from "@/components/ui/Section";
import GamesHubClient from "@/components/games/GamesHubClient";

export default function GamesPage() {
    return (
        <div className="bg-[linear-gradient(180deg,#fbf7f1_0%,#f4f1eb_30%,#ffffff_100%)]">
            <Section className="pb-16 pt-8 md:pt-10">
                <GamesHubClient />
            </Section>
        </div>
    );
}
