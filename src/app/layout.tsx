import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { WEDDING } from "@/lib/wedding-data";

const cormorant = Cormorant_Garamond({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
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
      <body className={`${cormorant.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col bg-base text-text-primary`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
