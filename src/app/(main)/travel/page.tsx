import React from "react";
import Section from "@/components/ui/Section";
import { getWeddingData } from "@/lib/site-settings";
import { MapPin, Plane, Car, ExternalLink, Phone, Star } from "lucide-react";

export default async function Travel() {
    const { wedding } = await getWeddingData();

    const greenvilleHotels = wedding.hotels.filter((h) => h.hub === 'Greenville');
    const mckinneyHotels = wedding.hotels.filter((h) => h.hub === 'McKinney');
    const nearbyRentals = wedding.hotels.filter((h) => h.hub === 'Farmersville' || h.hub === 'Princeton');

    return (
        <div>
            {/* Hero */}
            <Section background="surface" className="text-center pb-14 pt-12 md:pb-16 md:pt-16">
                <h1 className="font-heading text-5xl md:text-6xl mb-6">Travel &amp; Stay</h1>
                <p className="max-w-xl mx-auto text-text-secondary tracking-wide leading-relaxed">
                    Everything you need to get here and settle in. The venue is located in the
                    northeast Texas countryside — about an hour from Dallas.
                </p>
            </Section>

            {/* Map + Venue Info */}
            <Section background="base" className="py-16">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="w-full aspect-square rounded-[1.7rem] bg-gray-200 shadow-[0_20px_44px_rgba(20,42,68,0.09)] relative overflow-hidden group border border-primary/10">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.3!2d-96.1374!3d33.3287!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c6d2b4d0a7b5d%3A0x0!2sDavis+%26+Grey+Farms!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                                className="absolute inset-0 w-full h-full grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                title="Davis &amp; Grey Farms location"
                            />
                        </div>
                        <p className="text-center text-xs text-text-secondary mt-3 tracking-wider uppercase">
                            Davis &amp; Grey Farms — {wedding.venue.fullAddress}
                        </p>
                        <div className="text-center mt-2">
                            <a
                                href="https://www.google.com/maps?q=2975+County+Road+1110+Celeste+TX+75423"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm underline underline-offset-4 text-primary/70 hover:text-primary transition-colors inline-flex items-center gap-1"
                            >
                                <MapPin size={14} />
                                Open in Google Maps
                            </a>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="font-heading text-3xl text-primary">Getting to the Venue</h2>
                        <div className="space-y-4 text-text-secondary leading-relaxed">
                            <p>
                                <span className="font-medium text-primary">Davis &amp; Grey Farms</span> is located at{" "}
                                <a
                                    href="https://www.google.com/maps?q=2975+County+Road+1110+Celeste+TX+75423"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-2 hover:text-primary transition-colors"
                                >
                                    2975 CR 1110, Celeste, TX 75423
                                </a>.
                            </p>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
                                <strong>Bus &amp; large vehicle note:</strong> Use FM 2194 for easier access to the venue.
                            </div>
                            <p className="text-sm">
                                The venue is a rural property — please follow GPS directions carefully.
                                There is on-site parking; please park in the designated lot and do not park on the grass.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-widest text-text-secondary">Drive Times from Major Airports</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Dallas Love Field (DAL)', time: '~1 hr 4 min · ~70 miles', href: 'https://www.google.com/maps/dir/Dallas+Love+Field/2975+CR+1110+Celeste+TX+75423' },
                                    { label: 'DFW International (DFW)', time: '~1 hr 20 min · ~72 miles', href: 'https://www.google.com/maps/dir/Dallas+Fort+Worth+International+Airport/2975+CR+1110+Celeste+TX+75423' },
                                ].map((item) => (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-primary/20 hover:bg-surface/40 transition-colors group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Plane size={15} className="text-primary/60 shrink-0" />
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </div>
                                        <span className="text-xs text-text-secondary group-hover:text-primary transition-colors">{item.time} →</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Airports */}
            <Section background="surface" className="py-16">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-heading text-3xl text-center text-primary mb-4">Nearest Airports</h2>
                    <p className="text-center text-text-secondary mb-10 max-w-lg mx-auto">
                        We recommend renting a car at the airport — the venue is rural and ride-share availability can be limited late at night.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {wedding.travel.airports.map((airport) => (
                            <div key={airport.code} className="surface-panel p-8">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="font-heading text-xl text-primary pr-4">{airport.name}</h3>
                                    <span className="text-sm font-bold tracking-widest text-accent uppercase shrink-0 bg-surface px-2 py-1 rounded">
                                        {airport.code}
                                    </span>
                                </div>
                                <p className="text-text-secondary leading-relaxed mb-4 text-sm">{airport.description}</p>
                                <a
                                    href={airport.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm underline underline-offset-4 text-primary/70 hover:text-primary transition-colors inline-flex items-center gap-1"
                                >
                                    <ExternalLink size={13} />
                                    Airport Website
                                </a>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 surface-panel p-6 text-center">
                        <p className="text-sm text-text-secondary">
                            <span className="font-medium text-primary">McKinney National Airport (TKI)</span> is also nearby and is undergoing a commercial expansion —
                            Avelo Airlines is the first committed carrier, with service expected in late 2026.
                        </p>
                    </div>
                </div>
            </Section>

            {/* Accommodations */}
            <Section background="base" className="py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-3xl text-primary mb-3">Where to Stay</h2>
                        <p className="text-text-secondary max-w-xl mx-auto">
                            Lodging near the venue is limited — we recommend booking early!
                            The two closest hotel clusters are Greenville (~13 mi) and McKinney (~38 mi).
                        </p>
                    </div>

                    {/* Greenville Hotels */}
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px flex-1 bg-gray-200" />
                            <div className="text-center">
                                <h3 className="font-heading text-xl text-primary">Greenville Area</h3>
                                <p className="text-xs text-text-secondary uppercase tracking-widest mt-0.5">~13 miles · ~19 min from venue</p>
                            </div>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {greenvilleHotels.map((hotel) => (
                                <HotelCard key={hotel.name} hotel={hotel} />
                            ))}
                        </div>
                    </div>

                    {/* McKinney Hotels */}
                    <div className="mb-14">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px flex-1 bg-gray-200" />
                            <div className="text-center">
                                <h3 className="font-heading text-xl text-primary">McKinney Area</h3>
                                <p className="text-xs text-text-secondary uppercase tracking-widest mt-0.5">~38 miles · ~51 min from venue</p>
                            </div>
                            <div className="h-px flex-1 bg-gray-200" />
                        </div>
                        <p className="text-sm text-text-secondary mb-6 text-center max-w-lg mx-auto">
                            A lovely destination stay with McKinney&apos;s walkable historic downtown, 120+ shops, and great dining. A longer drive from the venue but a memorable experience.
                        </p>
                        <div className="grid md:grid-cols-2 gap-6">
                            {mckinneyHotels.map((hotel) => (
                                <HotelCard key={hotel.name} hotel={hotel} />
                            ))}
                        </div>
                    </div>

                    {/* Nearby Rentals */}
                    {nearbyRentals.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px flex-1 bg-gray-200" />
                                <div className="text-center">
                                    <h3 className="font-heading text-xl text-primary">Short-Term Rentals</h3>
                                    <p className="text-xs text-text-secondary uppercase tracking-widest mt-0.5">Closest private options</p>
                                </div>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {nearbyRentals.map((hotel) => (
                                    <HotelCard key={hotel.name} hotel={hotel} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Section>

            {/* Things to Do */}
            <Section background="base" className="py-20">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-10">
                        <h2 className="font-heading text-3xl text-primary mb-3">Exploring Dallas &amp; DFW</h2>
                        <p className="text-text-secondary max-w-xl mx-auto">
                            You&apos;re in for a treat — DFW has something for everyone. Here are our favorite picks to help you make the most of your trip.
                        </p>
                    </div>

                    {/* State Fair callout */}
                    <div className="mb-10 rounded-2xl border border-amber-200 bg-amber-50 p-6 md:p-8 flex flex-col md:flex-row gap-5 items-start">
                        <div className="shrink-0 w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-700">
                            <Star size={22} strokeWidth={1.5} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">Happening This Weekend</p>
                            <h3 className="font-heading text-xl text-amber-900 mb-2">State Fair of Texas — at Fair Park</h3>
                            <p className="text-sm text-amber-800 leading-relaxed mb-3">
                                The 2026 State Fair runs <strong>September 25 – October 18</strong>, which means Big Tex is in town the same weekend as our wedding! If you&apos;re flying in early or staying a few extra days, this is a bucket-list Texas experience: fried food competitions, live music, carnival rides, and the iconic auto show.
                            </p>
                            <a
                                href="https://bigtex.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-800 underline underline-offset-4 hover:text-amber-900 transition-colors"
                            >
                                <ExternalLink size={13} />
                                bigtex.com — Plan Your Visit
                            </a>
                            <p className="text-xs text-amber-700 mt-2">Tip: Take the DART Green Line to Fair Park Station — parking gets wild on weekends.</p>
                        </div>
                    </div>

                    {/* Attraction clusters */}
                    <div className="grid md:grid-cols-2 gap-6 mb-6">

                        {/* Arts & Culture */}
                        <div className="surface-panel p-6">
                            <h3 className="font-heading text-lg text-primary mb-4">Arts &amp; Culture</h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Dallas Arts District', note: 'Free museums, sculpture garden, world-class performances — all within a few walkable blocks.', href: 'https://www.dallasartsdistrict.org/' },
                                    { name: 'Dallas Museum of Art', note: 'Free general admission. One of the largest art museums in the US.', href: 'https://www.dallasmuseumofart.org/' },
                                    { name: 'Nasher Sculpture Center', note: 'Stunning indoor/outdoor sculpture garden. Closed Mon–Tue.', href: 'https://www.nashersculpturecenter.org/visit/plan-a-visit' },
                                    { name: 'Perot Museum of Nature and Science', note: 'Hands-on science museum — great for families and the curious alike.', href: 'https://www.perotmuseum.org/visit/' },
                                    { name: 'The Sixth Floor Museum', note: 'The JFK museum at Dealey Plaza. Timed entry — book ahead.', href: 'https://www.jfk.org/plan-your-visit/' },
                                ].map((item) => (
                                    <li key={item.name} className="flex flex-col gap-0.5">
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
                                        >
                                            {item.name} <ExternalLink size={11} className="opacity-50" />
                                        </a>
                                        <p className="text-xs text-text-secondary leading-relaxed">{item.note}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Food & Neighborhoods */}
                        <div className="surface-panel p-6">
                            <h3 className="font-heading text-lg text-primary mb-4">Food &amp; Neighborhoods</h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Deep Ellum', note: 'Live music, murals, legendary BBQ. Hit Terry Black\'s or Pecan Lodge for brisket.', href: 'https://www.visitdallas.com/neighborhoods/deep-ellum/' },
                                    { name: 'Bishop Arts District', note: 'Oak Cliff\'s walkable boutique-and-brunch neighborhood. Great for a relaxed afternoon.', href: 'https://www.google.com/maps/search/?api=1&query=Bishop%20Arts%20District%20Dallas%20TX' },
                                    { name: 'Klyde Warren Park', note: 'The beloved deck park connecting Uptown to downtown. Food trucks + open lawn daily 6 AM–11 PM.', href: 'https://www.klydewarrenpark.org/' },
                                    { name: 'Legacy Hall', note: 'Massive food hall in Plano — dozens of choices, bars, and live programming. Great for groups.', href: 'https://legacyfoodhall.com/contact-us' },
                                    { name: 'Katy Trail Ice House', note: 'Enormous patio beer garden right off the Katy Trail in Uptown. Pet-friendly.', href: 'https://katyicehouse.com/' },
                                ].map((item) => (
                                    <li key={item.name} className="flex flex-col gap-0.5">
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
                                        >
                                            {item.name} <ExternalLink size={11} className="opacity-50" />
                                        </a>
                                        <p className="text-xs text-text-secondary leading-relaxed">{item.note}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Day Trips */}
                        <div className="surface-panel p-6">
                            <h3 className="font-heading text-lg text-primary mb-4">Day Trips Worth the Drive</h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Fort Worth Stockyards', note: 'Free twice-daily longhorn cattle drive at 11:30 AM & 4:00 PM. Pure Texas. Pair with Sundance Square for dinner.', href: 'https://www.fortworthstockyards.org/' },
                                    { name: 'Fort Worth Museum Triangle', note: 'Kimbell (free permanent collection) + Modern Art Museum + Amon Carter Museum — all walkable in the Cultural District.', href: 'https://kimbellart.org/visit' },
                                    { name: 'Meow Wolf Grapevine', note: 'Immersive walk-through art world — adults and kids both love it. Book tickets ahead for weekends.', href: 'https://tickets.meowwolf.com/grapevine/' },
                                    { name: 'Dallas Arboretum', note: 'Gorgeous botanical gardens on White Rock Lake. Pairs perfectly with a walk on the lake trail next door.', href: 'https://www.dallasarboretum.org/visitor-information/hours-and-admission/' },
                                ].map((item) => (
                                    <li key={item.name} className="flex flex-col gap-0.5">
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
                                        >
                                            {item.name} <ExternalLink size={11} className="opacity-50" />
                                        </a>
                                        <p className="text-xs text-text-secondary leading-relaxed">{item.note}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* McKinney Local Guide */}
                        <div className="surface-panel p-6">
                            <h3 className="font-heading text-lg text-primary mb-1">McKinney Local Guide</h3>
                            <p className="text-xs text-text-secondary mb-4 uppercase tracking-widest font-medium">~38 miles from the venue · Recommended hotel hub</p>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Historic Downtown McKinney', note: 'Charming walkable square with 120+ shops, restaurants, and a free trolley Thu–Sat.', href: 'https://www.visitmckinney.com/region-historic-downtown/' },
                                    { name: 'Adriatica Village', note: 'Croatian-inspired waterfront village with dining and scenic architecture. Great for dinner photos.', href: 'https://www.adriaticavillage.com/' },
                                    { name: 'Heard Natural Science Museum', note: '289-acre wildlife sanctuary and nature trails. Tue–Sat hours; free parking.', href: 'https://www.heardmuseum.org/' },
                                    { name: 'Chestnut Square Farmers Market', note: 'Saturday mornings (8–12 Apr–Dec). Regional producers and a lovely square setting.', href: 'https://www.chestnutsquare.org/farmers-market' },
                                ].map((item) => (
                                    <li key={item.name} className="flex flex-col gap-0.5">
                                        <a
                                            href={item.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-primary hover:underline underline-offset-2 inline-flex items-center gap-1"
                                        >
                                            {item.name} <ExternalLink size={11} className="opacity-50" />
                                        </a>
                                        <p className="text-xs text-text-secondary leading-relaxed">{item.note}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </div>

                    <p className="text-center text-xs text-text-secondary">
                        Visiting from out of town? The{" "}
                        <a href="https://www.visitdallas.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-colors">Visit Dallas</a>
                        {" "}and{" "}
                        <a href="https://www.visitmckinney.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-primary transition-colors">Visit McKinney</a>
                        {" "}tourism sites have full event calendars and more local tips.
                    </p>
                </div>
            </Section>

            {/* Transportation Tips */}
            <Section background="surface" className="py-16">
                <div className="max-w-3xl mx-auto">
                    <h2 className="font-heading text-3xl text-center text-primary mb-10">Getting Around</h2>
                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            {
                                icon: Car,
                                title: 'Rental Car',
                                description: 'Best option for flexibility. All major rental companies are available at both DFW and Love Field airports.',
                            },
                            {
                                icon: ({ size, className }: { size: number; className: string }) => (
                                    <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                ),
                                title: 'Shuttle / Charter',
                                description: 'Great for groups! If your hotel plans a shuttle, coordinate with your group. Minimizes impaired-driving risk after the reception.',
                            },
                            {
                                icon: ({ size, className }: { size: number; className: string }) => (
                                    <svg width={size} height={size} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                    </svg>
                                ),
                                title: 'Ride-Share',
                                description: 'Works in the Dallas metro but can be unreliable for late-night rural pickups. Have a backup plan if you rely on Uber/Lyft.',
                            },
                        ].map(({ icon: Icon, title, description }) => (
                            <div key={title} className="surface-panel p-6 text-center">
                                <div className="w-12 h-12 mx-auto mb-4 bg-primary/8 rounded-full flex items-center justify-center text-primary">
                                    <Icon size={22} className="text-primary" />
                                </div>
                                <h3 className="font-medium text-base mb-2">{title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>
        </div>
    );
}

function HotelCard({ hotel }: { hotel: { name: string; distance: string; description: string; address: string; phone: string; bookingUrl: string; hub: string; badge: string } }) {
    return (
        <div className="bg-white rounded-[1.5rem] border border-primary/8 p-6 shadow-[0_8px_24px_rgba(20,42,68,0.06)] flex flex-col hover:shadow-[0_12px_32px_rgba(20,42,68,0.1)] hover:-translate-y-0.5 transition-all duration-200">
            {hotel.badge ? (
                <span className="inline-block mb-3 text-[11px] font-semibold uppercase tracking-widest text-accent bg-accent/10 px-2.5 py-1 rounded-full self-start">
                    {hotel.badge}
                </span>
            ) : null}
            <h3 className="font-heading text-base text-primary mb-1 leading-snug">{hotel.name}</h3>
            <p className="text-xs font-medium text-accent uppercase tracking-wider mb-3">{hotel.distance}</p>
            <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-4">{hotel.description}</p>
            <div className="space-y-2 mb-4">
                <div className="flex items-start gap-1.5 text-xs text-text-secondary">
                    <MapPin size={12} className="shrink-0 mt-0.5 text-primary/50" />
                    <span>{hotel.address}</span>
                </div>
                {hotel.phone ? (
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                        <Phone size={12} className="shrink-0 text-primary/50" />
                        <a href={`tel:${hotel.phone.replace(/[^0-9+]/g, '')}`} className="hover:text-primary transition-colors">{hotel.phone}</a>
                    </div>
                ) : null}
            </div>
            <a
                href={hotel.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-medium uppercase tracking-widest border border-primary/25 text-primary px-4 py-2.5 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-200"
            >
                <ExternalLink size={12} />
                Book Now
            </a>
        </div>
    );
}
