import { Caveat } from "next/font/google";
import V2Nav from "@/components/v2/V2Nav";
import V2Footer from "@/components/v2/V2Footer";
import VersionSwitcher from "@/components/VersionSwitcher";
import "./v2.css";

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "Paper Atlas | The Paine Wedding",
  description:
    "A travel folio for the Paine Wedding — September 26, 2026, Celeste, Texas.",
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`v2-theme flex flex-col min-h-screen ${caveat.variable}`}>
      <V2Nav />
      <main className="flex-grow pt-16">{children}</main>
      <V2Footer />
      <VersionSwitcher current="v2" />
    </div>
  );
}
