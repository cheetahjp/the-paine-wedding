import React from "react";
import Section from "@/components/ui/Section";
import Button from "@/components/ui/Button";
import { getWeddingData } from "@/lib/site-settings";

export default async function Home() {
  const { wedding, images, overlays, content } = await getWeddingData();

  return (
    <>
      {/* Hero Section — data-admin-key lets the AdminEditBar intercept clicks in edit mode */}
      <section
        className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden"
        data-admin-key="images.hero"
        data-admin-type="image"
        data-admin-current-url={images.hero.main}
        data-admin-label="Hero Photo"
      >
        <div
          className="absolute inset-0 bg-primary/20 bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url('${images.hero.main}'), url('${images.hero.fallback}')` }}
        />
        <div className="absolute inset-0 bg-text-primary/30 pointer-events-none" />
        {overlays.hero && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: overlays.hero.color,
              opacity: overlays.hero.opacity,
            }}
          />
        )}

        <div className="relative z-10 text-center text-white space-y-8 animate-fade-in-up px-6 pt-20">
          <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-medium tracking-tight drop-shadow-lg">
            {wedding.couple.names}
          </h1>
          <div className="space-y-2 uppercase tracking-[0.3em] text-sm md:text-base font-light text-white/90 drop-shadow-md">
            <p>{wedding.date.dayOfWeek}, {wedding.date.display}</p>
            <p>{wedding.venue.cityDisplay}</p>
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
        <p
          className="max-w-2xl mx-auto text-text-secondary leading-relaxed"
          data-admin-key="home.intro"
          data-admin-type="rich-text"
          data-admin-current-text={content.homeIntro}
          data-admin-label="Home Intro Text"
        >
          {content.homeIntro}
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
            <p
              className="font-heading text-2xl"
              data-admin-key="date.display"
              data-admin-type="text"
              data-admin-label="Wedding Date Display"
              data-admin-current-text={wedding.date.display}
            >
              {wedding.date.dayOfWeek}, {wedding.date.display}
            </p>
          </div>
          <div className="space-y-4 md:border-l md:border-r border-surface px-4">
            <h3 className="uppercase tracking-widest text-sm text-text-secondary">Where</h3>
            <p
              className="font-heading text-2xl"
              data-admin-key="venue.name"
              data-admin-type="text"
              data-admin-label="Venue Name"
            >
              {wedding.venue.name}
            </p>
            <p className="text-sm text-text-secondary">{wedding.venue.cityDisplay}</p>
          </div>
          <div className="space-y-4">
            <h3 className="uppercase tracking-widest text-sm text-text-secondary">Dress Code</h3>
            <p
              className="font-heading text-2xl"
              data-admin-key="dresscode.short"
              data-admin-type="text"
              data-admin-label="Dress Code (Short)"
            >
              {wedding.dresscode.short === "TBD" ? "Details Coming Soon" : wedding.dresscode.short}
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
