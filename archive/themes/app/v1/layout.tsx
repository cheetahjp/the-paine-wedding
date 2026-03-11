import type { Metadata } from "next";
import "./v1.css";
import V1Nav from "@/components/v1/V1Nav";
import V1Footer from "@/components/v1/V1Footer";
import VersionSwitcher from "@/components/VersionSwitcher";

export const metadata: Metadata = {
  title: "Ashlyn & Jeffrey — Midnight Editorial",
  description: "The Paine Wedding — September 26, 2026 — Design Direction A",
};

export default function V1Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="v1-theme flex flex-col min-h-screen">
      <V1Nav />
      <main className="flex-grow pt-16">{children}</main>
      <V1Footer />
      <VersionSwitcher current="v1" />
    </div>
  );
}
