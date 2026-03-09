import type { Metadata } from "next";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { WEDDING } from "@/lib/wedding-data";

const bodoni = Bodoni_Moda({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: WEDDING.meta.title,
  description: WEDDING.meta.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${bodoni.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col bg-base text-text-primary`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
