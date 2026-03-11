// ============================================================
// WEDDING CONTENT CONFIG
// All site content lives here. Update this file when details
// change — every page pulls from it automatically.
// ============================================================

export const WEDDING = {
  couple: {
    bride: { first: 'Ashlyn', last: 'Bimmerle', full: 'Ashlyn Bimmerle' },
    groom: { first: 'Jeffrey', last: 'Paine', full: 'Jeffrey Paine' },
    names: 'Ashlyn & Jeffrey',
    lastName: 'Paine',
  },

  date: {
    display: 'September 26, 2026',
    iso: '2026-09-26',
    dayOfWeek: 'Saturday',
    rsvpDeadline: 'August 1, 2026',
    rsvpDeadlineIso: '2026-08-01',
  },

  venue: {
    name: 'Davis & Grey Farms',
    address: '2975 CR 1110',
    city: 'Celeste, TX 75423',
    fullAddress: '2975 CR 1110, Celeste, TX 75423',
    cityDisplay: 'Celeste, Texas',
    mapsUrl: 'https://maps.google.com/?q=Davis+%26+Grey+Farms+2975+CR+1110+Celeste+TX+75423',
    // TODO: Replace with real Google Maps embed src from maps.google.com → Share → Embed a map
    mapsEmbedSrc:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3323.0!2d-96.1!3d33.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDE4JzAwLjAiTiA5NsKwMDYnMDAuMCJX!5e0!3m2!1sen!2sus!4v0000000000000!5m2!1sen!2sus',
    ceremonyTime: '5:00 PM',
    cocktailTime: '5:45 PM',
    receptionTime: '6:45 PM',
    sendOffTime: '10:00 PM',
    parking:
      'Please park in any of the parking spaces at the venue. Do not park on the grass.',
    shuttle: 'none',
  },

  schedule: [
    {
      time: '4:30 PM',
      title: 'Guest Arrival',
      description:
        'Doors open at 4:30 PM. Please arrive early to find your seat — the ceremony will begin promptly and late arrivals will not be seated after it starts.',
    },
    {
      time: '5:00 PM',
      title: 'Ceremony',
      description:
        'The main event! Join us in the chapel as Ashlyn and Jeffrey exchange vows and begin forever.',
    },
    {
      time: '5:45 PM',
      title: 'Cocktail Hour',
      description:
        'Enjoy drinks and light bites while we take photos. Mingle, celebrate, and get ready for a fun evening.',
    },
    {
      time: '7:00 PM',
      title: 'Dinner',
      description:
        'A seated dinner will be served. Enjoy a delicious meal with the people you love.',
    },
    {
      time: '7:30 PM',
      title: 'Toasts',
      description:
        'Words of love and laughter from our closest friends and family. Have your tissues — and your drinks — ready.',
    },
    {
      time: '8:00 PM',
      title: 'Dancing',
      description:
        'The dance floor opens! Come ready to celebrate and make some memories.',
    },
    {
      time: '8:30 PM',
      title: 'Cake Cutting',
      description:
        'Time for the sweet stuff. The cutting of the cake — a wedding tradition we are very excited about.',
    },
    {
      time: '10:00 PM',
      title: 'Send-Off',
      description:
        'The night ends with a send-off as Ashlyn and Jeffrey head into their happily ever after. Don\'t miss it!',
    },
  ] as Array<{ time: string; title: string; description: string }>,

  dresscode: {
    short: 'Semi-Formal',
    summary:
      'Both the ceremony and reception are indoors. Come dressed up and ready to celebrate — see the Attire page for full guidance.',
    ladies:
      'Think cocktail dresses, midi dresses, or a dressy jumpsuit — any color is welcome. The ceremony and reception are both indoors, but late September in Texas can still be warm, so lighter fabrics are a great choice. Please avoid casual or beachwear. Jeans are okay if they have no holes and you pair them with something polished!',
    gentlemen:
      'Dress pants with a button-down or blazer are perfect. A suit and tie is absolutely welcome but not required — just leave the shorts and casual wear at home. Come dressed up and ready to hit the dance floor!',
  },

  bridalParty: {
    bridesmaids: [
      {
        name: 'Paige Bimmerle',
        role: 'Maid of Honor',
        relationship: "Ashlyn's Sister",
        image: '/images/bridal-party/Bridesmaids/Paige.jpg',
      },
      {
        name: 'Shelby Gerner',
        role: 'Bridesmaid',
        relationship: "Ashlyn's Friend & Roommate",
        image: '/images/bridal-party/Bridesmaids/Shelvy.jpg',
      },
      {
        name: 'Izzy May',
        role: 'Bridesmaid',
        relationship: "Ashlyn's College Friend",
        image: '/images/bridal-party/Bridesmaids/Izzy.jpg',
      },
      {
        name: 'Alondra Santillan',
        role: 'Bridesmaid',
        relationship: "Ashlyn's High School & College Friend",
        image: '/images/bridal-party/Bridesmaids/Alondra.jpg',
      },
      {
        name: 'Megan Groezinger',
        role: 'Bridesmaid',
        relationship: "Ashlyn's Friend",
        image: '/images/bridal-party/Bridesmaids/Megan.jpg',
      },
      {
        name: 'Brynn Wilson',
        role: 'Bridesmaid',
        relationship: "Jeffrey's Cousin",
        image: '/images/bridal-party/Bridesmaids/Brynn.jpg',
      },
      {
        name: 'Emma Wilson',
        role: 'Bridesmaid',
        relationship: "Jeffrey's Cousin",
        image: '/images/bridal-party/Bridesmaids/Emma.jpg',
      },
    ],
    groomsmen: [
      {
        name: 'John Paine',
        role: 'Best Man',
        relationship: "Jeffrey's Brother",
        image: '/images/bridal-party/Groomsmen/John.jpg',
      },
      {
        name: 'Hudson Boyd',
        role: 'Groomsman',
        relationship: "Jeffrey's College Friend",
        image: '/images/bridal-party/Groomsmen/Hudson.jpg',
      },
      {
        name: 'Roman Richichi',
        role: 'Groomsman',
        relationship: "Jeffrey's High School Friend",
        image: '/images/bridal-party/Groomsmen/Roman.jpg',
      },
      {
        name: 'Justin Luurtsema',
        role: 'Groomsman',
        relationship: "Jeffrey's College Friend",
        image: '/images/bridal-party/Groomsmen/Justin.jpg',
      },
      {
        name: 'Duncan Marshall',
        role: 'Groomsman',
        relationship: "Jeffrey's High School Friend",
        image: '/images/bridal-party/Groomsmen/Duncan.jpg',
      },
      {
        name: 'Collin Groezinger',
        role: 'Groomsman',
        relationship: "Jeffrey's Childhood Friend",
        image: '/images/bridal-party/Groomsmen/Collin.jpg',
      },
      {
        name: 'Blake Bimmerle',
        role: 'Groomsman',
        relationship: "Ashlyn's Brother",
        image: '/images/bridal-party/Groomsmen/Blake.jpg',
      },
    ],
  } as {
    bridesmaids: Array<{ name: string; role: string; relationship: string; image: string }>;
    groomsmen: Array<{ name: string; role: string; relationship: string; image: string }>;
  },

  // Meal options for RSVP form. Empty array = meal section hidden until catering is confirmed.
  // Example entry: { value: 'beef', label: 'Beef Tenderloin' }
  mealOptions: [] as Array<{ value: string; label: string }>,

  // TODO: Replace with real hotels near Davis & Grey Farms / Celeste TX area
  hotels: [] as Array<{
    name: string;
    distance: string;
    description: string;
    bookingUrl: string;
  }>,

  registry: [
    {
      name: 'Amazon',
      description: 'Our full registry for the home.',
      url: 'TODO', // TODO: paste Amazon registry URL here
      icon: 'gift' as const,
    },
    {
      name: 'Honeymoon Fund',
      description: 'Contribute to our honeymoon adventure.',
      url: 'TODO', // TODO: paste honeymoon fund URL here
      icon: 'heart' as const,
    },
  ],

  faq: [
    {
      q: 'Are kids invited?',
      a: 'As much as we love kids, we are doing an adult-only wedding! We would love for you to enjoy a date night away from the kids.',
    },
    {
      q: 'Can I bring a plus one?',
      a: 'Plus ones are reserved for long-term significant others or spouses. If you have a plus one, they will be included on your RSVP.',
    },
    {
      q: 'What should I wear?',
      a: 'Semi-formal! We would like everyone to dress up, but you do not have to come in a suit and tie! Come dressed up and ready to dance!',
    },
    {
      q: 'What time should I arrive?',
      a: 'Please arrive at 4:30 PM to allow time to find a seat. The ceremony will start on time and you will not be allowed in the chapel after it has begun.',
    },
    {
      q: 'Where should I park?',
      a: 'There is a parking lot at the venue that will be easy to find when you arrive on the property. Please do not park on the grass.',
    },
    {
      q: 'Is there transportation provided?',
      a: 'No, you will need to arrange your own transportation to and from the venue. We recommend planning for a rideshare if you plan on enjoying the open bar!',
    },
    {
      q: 'Will alcohol be served?',
      a: 'We will have a beer and wine open bar! We ask that you not bring your own alcohol, per our venue\'s request.',
    },
    {
      q: 'When is the RSVP deadline?',
      a: 'Please RSVP by August 1st, 2026, so we can have an accurate headcount for our caterer.',
    },
    {
      q: 'What if I can\'t attend?',
      a: 'We will miss you on our big day, but we totally understand! Please RSVP "no" so we know you won\'t be there — it really helps with our planning.',
    },
  ],

  // Our Story timeline
  story: [
    {
      year: '2021',
      title: 'How We Met',
      description:
        'Ashlyn and Jeffrey met at an ice cream social at Texas A&M University – Commerce in 2021. Ashlyn had asked a mutual friend to introduce them — she had been hoping for a chance to talk to him. After the introduction, they started texting and finding random excuses to hang out. Their first official date was a trip to Sonic and a long drive around town where they talked for hours. They dated for about six months before going their separate ways — they both needed time to grow and mature in their walk with the Lord.',
      image: '/images/story/First round.jpg',
      imageFallback:
        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80',
    },
    {
      year: 'October 2024',
      title: 'Our Reunion',
      description:
        'Almost two years later, they both ended up at an A&M football game with 100,000 other people — and were sitting just five rows apart. They spotted each other and kept their distance, unsure if the other wanted to reconnect. Afterward, Jeffrey texted Ashlyn just to say he hoped she was doing well. That simple message sparked nearly a year of monthly check-ins that grew warmer over time. In August of 2024, Jeffrey asked Ashlyn to hang out. She said no at first — nervous and second-guessing herself — but then regretted it and reached back out. Jeffrey drove four and a half hours to Houston to take Ashlyn on a date at Galveston Bay Brewing, where they talked for hours and realized that no time had really passed — they were just better versions of themselves.',
      image: '/images/story/A&M Game(Reunion).jpg',
      imageFallback:
        'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80',
    },
    {
      year: 'October 2024',
      title: 'Lake and beach days',
      description:
        'On October 18th, 2024, they started dating again. What followed was a year and a half of long distance, visits every other week, long car rides, FaceTime calls, and really hard goodbyes. But they made the most of every weekend together, and cannot wait to finally be in the same place for the rest of their lives.',
      image: '/images/story/Lake.jpg',
      imageFallback:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80',
    },
    {
      year: '2024',
      title: 'Trip to NY',
      description: '',
      image: '/images/story/NYC.jpg',
      imageFallback:
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&q=80',
    },
    {
      year: '2025',
      title: 'Hammocking',
      description: '',
      image: '/images/story/Hammock.jpg',
      imageFallback:
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80',
    },
    {
      year: '2025',
      title: 'Starting up a photography business',
      description: '',
      image: '/images/story/Photographers.jpg',
      imageFallback:
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80',
    },
    {
      year: '2025',
      title: 'One-year trip to San Antonio',
      description: '',
      image: '/images/story/San Antonio.jpg',
      imageFallback:
        'https://images.unsplash.com/photo-1531218150217-5afc461afac8?auto=format&fit=crop&q=80',
    },
    {
      year: '2025',
      title: 'Fredericksburg',
      description: '',
      image: '/images/story/Fredricksburg.jpg',
      imageFallback:
        'https://images.unsplash.com/photo-1605371304245-2070f8ee9bae?auto=format&fit=crop&q=80',
    },
    {
      year: 'February 2026',
      title: 'The Proposal',
      description:
        'Jeffrey proposed to Ashlyn on February 21st, 2026. Ashlyn thought she had planned a fun day for her friends Megan and Izzy to finally meet — little did she know they were already in on the secret. After a full day together, they suggested a walk at Arbor Hills Nature Preserve and steered Ashlyn down a different path through the trees. That is when she saw Jeffrey waiting for her. He got down on one knee and asked her to spend forever with him. She said, "Yes, yes, yes, yes — I will!" The evening was full of even more surprises: a private dinner for two at 60 Vines, where they talked about all the planning that had gone into the engagement, followed by the biggest surprise of all — a party at Jeffrey\'s parents\' house with all of their closest friends and family. They celebrated with every person they love most and felt completely surrounded by joy.',
      image: '/images/story/Proposal.jpg',
      imageFallback:
        'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80',
    },
  ],

  // Travel info
  travel: {
    airports: [
      {
        name: 'Dallas Love Field (DAL)',
        code: 'DAL',
        description:
          'The closest major airport to the venue, located in Dallas. Approximately 1 hour from Davis & Grey Farms.',
        url: 'https://www.dallas-lovefield.com/',
      },
      {
        name: 'Dallas/Fort Worth International (DFW)',
        code: 'DFW',
        description:
          'The largest airport in the area with more flight options. Approximately 1 hour to 1.5 hours from the venue depending on traffic.',
        url: 'https://www.dfwairport.com/',
      },
    ],
  },

  meta: {
    title: "Ashlyn & Jeffrey | The Paine Wedding",
    description:
      'Join us to celebrate our wedding at Davis & Grey Farms on September 26, 2026.',
    ogImage: '/images/engagement/og-image.jpg',
  },
} satisfies WeddingConfig;

// ============================================================
// IMAGE PATHS
// Drop real photos into /public/images/* and they auto-load.
// Falls back to Unsplash until real images are added.
// ============================================================

export const IMAGES = {
  hero: {
    main: '/images/hero/JeffAshlyn-7977 2.jpg',
    fallback:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
  },
  engagement: {
    main: '/images/engagement/engagement-1.webp',
    og: '/images/engagement/og-image.jpg',
    fallback:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80',
  },
  attire: {
    ladies: [
      '/images/attire/ladies-1.webp',
      '/images/attire/ladies-2.webp',
      '/images/attire/ladies-3.webp',
    ],
    gents: [
      '/images/attire/gents-1.webp',
      '/images/attire/gents-2.webp',
      '/images/attire/gents-3.webp',
    ],
    ladiesFallbacks: [
      'https://images.unsplash.com/photo-1594892415170-071a93e3d622?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596704017254-9b121068fb29?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605655787612-409dd786d7cd?auto=format&fit=crop&q=80',
    ],
    gentsFallbacks: [
      'https://images.unsplash.com/photo-1563720235374-9b418d184ebc?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588665792942-d392376dc372?auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1564883401567-27e1fecde59b?auto=format&fit=crop&q=80',
    ],
  },
};

// ============================================================
// TYPES
// ============================================================

type WeddingConfig = {
  couple: {
    bride: { first: string; last: string; full: string };
    groom: { first: string; last: string; full: string };
    names: string;
    lastName: string;
  };
  date: {
    display: string;
    iso: string;
    dayOfWeek: string;
    rsvpDeadline: string;
    rsvpDeadlineIso: string;
  };
  venue: {
    name: string;
    address: string;
    city: string;
    fullAddress: string;
    cityDisplay: string;
    mapsUrl: string;
    mapsEmbedSrc: string;
    ceremonyTime: string;
    cocktailTime: string;
    receptionTime: string;
    sendOffTime: string;
    parking: string;
    shuttle: string;
  };
  schedule: Array<{ time: string; title: string; description: string }>;
  dresscode: { short: string; summary: string; ladies: string; gentlemen: string };
  bridalParty: {
    bridesmaids: Array<{ name: string; role: string; relationship: string; image: string }>;
    groomsmen: Array<{ name: string; role: string; relationship: string; image: string }>;
  };
  mealOptions: Array<{ value: string; label: string }>;
  hotels: Array<{ name: string; distance: string; description: string; bookingUrl: string }>;
  registry: Array<{ name: string; description: string; url: string; icon: 'gift' | 'heart' }>;
  faq: Array<{ q: string; a: string }>;
  story: Array<{
    year: string;
    title: string;
    description: string;
    image: string;
    imageFallback: string;
  }>;
  travel: {
    airports: Array<{
      name: string;
      code: string;
      description: string;
      url: string;
    }>;
  };
  meta: { title: string; description: string; ogImage: string };
};
