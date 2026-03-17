import type { Metadata } from "next";
import { Bodoni_Moda, Montserrat } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://www.thepainewedding.com"),
  title: {
    default: "Ashlyn & Jeff Paine Wedding | September 26, 2026",
    template: "%s | The Paine Wedding",
  },
  description:
    "Join us as Ashlyn Bimmerle and Jeff Paine celebrate their wedding on September 26, 2026 at Davis & Grey Farms in Celeste, Texas. RSVP, explore venue details, and find travel info here.",
  keywords: [
    "Ashlyn Bimmerle",
    "Jeff Paine",
    "Paine Wedding",
    "wedding September 2026",
    "Davis Grey Farms wedding",
    "Celeste Texas wedding",
    "thepainewedding",
  ],
  openGraph: {
    type: "website",
    url: "https://www.thepainewedding.com",
    siteName: "The Paine Wedding",
    title: "Ashlyn & Jeff | September 26, 2026",
    description:
      "Celebrate with Ashlyn & Jeff at Davis & Grey Farms in Celeste, Texas on September 26, 2026.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ashlyn & Jeff | September 26, 2026",
    description:
      "Celebrate with Ashlyn & Jeff at Davis & Grey Farms in Celeste, Texas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${bodoni.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "Ashlyn & Jeff Paine Wedding",
              startDate: "2026-09-26T17:00:00-05:00",
              endDate: "2026-09-26T22:00:00-05:00",
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              location: {
                "@type": "Place",
                name: "Davis & Grey Farms",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "2975 CR 1110",
                  addressLocality: "Celeste",
                  addressRegion: "TX",
                  postalCode: "75423",
                  addressCountry: "US",
                },
              },
              organizer: {
                "@type": "Person",
                name: "Jeff Paine",
                url: "https://www.thepainewedding.com",
              },
              url: "https://www.thepainewedding.com",
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
