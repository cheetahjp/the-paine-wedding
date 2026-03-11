import V3Nav from "@/components/v3/V3Nav";
import V3Footer from "@/components/v3/V3Footer";
import VersionSwitcher from "@/components/VersionSwitcher";
import "./v3.css";

export const metadata = {
  title: "Velvet Gallery | The Paine Wedding",
  description:
    "A gallery exhibition celebrating the Paine Wedding — September 26, 2026, Celeste, Texas.",
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="v3-theme flex flex-col min-h-screen">
      <V3Nav />
      <main className="flex-grow pt-16">{children}</main>
      <V3Footer />
      <VersionSwitcher current="v3" />
    </div>
  );
}
