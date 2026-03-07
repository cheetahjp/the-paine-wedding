import React from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { WEDDING, IMAGES } from "@/lib/wedding-data";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-primary/20 bg-cover bg-center z-[-1]"
          style={{ backgroundImage: `url('${IMAGES.hero.main}'), url('${IMAGES.hero.fallback}')` }}
        />
        <div className="absolute inset-0 bg-text-primary/30 z-0"></div>

        <div className="relative z-10 text-center text-white space-y-8 animate-fade-in-up px-6 pt-20">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight drop-shadow-lg">
            {WEDDING.couple.names}
          </h1>
          <div className="space-y-2 uppercase tracking-[0.3em] text-sm md:text-base font-light text-white/90 drop-shadow-md">
            <p>{WEDDING.date.dayOfWeek}, {WEDDING.date.display}</p>
            <p>{WEDDING.venue.cityDisplay}</p>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/rsvp" variant="primary">
              RSVP
            </Button>
            <Button
              href="/wedding-details"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary"
            >
              Wedding Details
            </Button>
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <Section background="surface" className="text-center">
        <h2 className="font-heading text-4xl mb-6">Join Us in Celebration</h2>
        <p className="max-w-2xl mx-auto text-text-secondary leading-relaxed">
          We are so excited to celebrate this special moment in our lives with our closest family and friends.
          Your love and support mean the world to us, and we can&apos;t wait to share this unforgettable day with you.
        </p>
        <div className="mt-12">
          <Button href="/our-story" variant="secondary">
            Read Our Story
          </Button>
        </div>
      </Section>

      {/* Quick Details Grid */}
      <Section background="base">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          <div className="space-y-4">
            <h3 className="uppercase tracking-widest text-sm text-text-secondary">When</h3>
            <p className="font-heading text-2xl">{WEDDING.date.dayOfWeek}, {WEDDING.date.display}</p>
          </div>
          <div className="space-y-4 md:border-l md:border-r border-surface px-4">
            <h3 className="uppercase tracking-widest text-sm text-text-secondary">Where</h3>
            <p className="font-heading text-2xl">{WEDDING.venue.name}</p>
            <p className="text-sm text-text-secondary">{WEDDING.venue.cityDisplay}</p>
          </div>
          <div className="space-y-4">
            <h3 className="uppercase tracking-widest text-sm text-text-secondary">Dress Code</h3>
            <p className="font-heading text-2xl">
              {WEDDING.dresscode.short === "TBD" ? "Details Coming Soon" : WEDDING.dresscode.short}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
