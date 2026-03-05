import React from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Abstract Placeholder for Hero Image */}
        <div className="absolute inset-0 bg-primary/20 bg-[url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')] bg-cover bg-center z-[-1]" />
        <div className="absolute inset-0 bg-text-primary/30 z-0"></div>

        <div className="relative z-10 text-center text-white space-y-8 animate-fade-in-up px-6 pt-20">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight drop-shadow-lg">
            Jeff & Ashlyn
          </h1>
          <div className="space-y-2 uppercase tracking-[0.3em] text-sm md:text-base font-light text-white/90 drop-shadow-md">
            <p>September 2026</p>
            <p>Dallas, Texas</p>
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
          Your love and support mean the world to us, and we can’t wait to share this unforgettable day with you.
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
            <p className="font-heading text-2xl">Sept 2026</p>
          </div>
          <div className="space-y-4 md:border-l md:border-r border-surface px-4">
            <h3 className="uppercase tracking-widest text-sm text-text-secondary">Where</h3>
            <p className="font-heading text-2xl">Dallas, TX</p>
          </div>
          <div className="space-y-4">
            <h3 className="uppercase tracking-widest text-sm text-text-secondary">Dress Code</h3>
            <p className="font-heading text-2xl">Formal</p>
          </div>
        </div>
      </Section>
    </>
  );
}
