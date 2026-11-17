export type Language = 'en' | 'my';

export interface UIStrings {
  nav: {
    explore: string;
    destinations: string;
    stays: string;
    experiences: string;
    dining: string;
    rentals: string;
    realEstate: string;
    journal: string;
    planTrip: string;
    bookings: string;
    signIn: string;
    searchPlaceholder: string;
    searchBtn: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subtitle: string;
    exploreCta: string;
    planCta: string;
    destLabel: string;
    destPlaceholder: string;
    checkIn: string;
    checkOut: string;
    guests: string;
    searchStays: string;
    spotlights: {
      ridges: { label: string; title: string; caption: string; meta: string };
      heritage: { label: string; title: string; caption: string; meta: string };
      lodges: { label: string; title: string; caption: string; meta: string };
      table: { label: string; title: string; caption: string; meta: string };
    };
  };
  home: {
    discoverEyebrow: string;
    discoverTitle: string;
    discoverBody: string;
    discoverQuote: string;
    statElevation: string;
    statMarket: string;
    statTemp: string;
    fig1: string;
    fig2: string;
    placesEyebrow: string;
    placesTitle: string;
    viewAllDest: string;
    readGuide: string;
    staysEyebrow: string;
    staysTitle: string;
    browseAllStays: string;
    perNight: string;
    viewDetails: string;
    expEyebrow: string;
    expTitle: string;
    allExp: string;
    perGuest: string;
    requestExp: string;
    diningEyebrow: string;
    diningTitle: string;
    allDining: string;
    viewMenuNotes: string;
    rentalsEyebrow: string;
    rentalsTitle: string;
    exploreVehicles: string;
    perDay: string;
    realEstateEyebrow: string;
    realEstateTitle: string;
    listProperty: string;
    viewMarketplace: string;
    perMonth: string;
    journalEyebrow: string;
    journalTitle: string;
    readDispatches: string;
  };
  categories: Record<string, string>;
  pages: {
    destAtlas: string;
    destTitle: string;
    destDesc: string;
    staysEyebrow: string;
    staysTitle: string;
    staysDesc: string;
    expEyebrow: string;
    expTitle: string;
    expDesc: string;
    diningEyebrow: string;
    diningTitle: string;
    diningDesc: string;
    rentalsEyebrow: string;
    rentalsTitle: string;
    rentalsDesc: string;
    reEyebrow: string;
    reTitle: string;
    reDesc: string;
    journalEyebrow: string;
    journalTitle: string;
    journalDesc: string;
    exploreEyebrow: string;
    exploreTitle: string;
    tripEyebrow: string;
    tripTitle: string;
    tripDesc: string;
    bookingsEyebrow: string;
    bookingsTitle: string;
    bookingsDesc: string;
  };
  actions: {
    save: string;
    saved: string;
    requestDate: string;
    requestTable: string;
    requestVehicle: string;
    inspectDossier: string;
    addToTripPlan: string;
    addedToPlan: string;
    resetFilters: string;
    cancelRequest: string;
    submitBooking: string;
    submitting: string;
    noChargeNote: string;
    viewInGallery: string;
    previousPhoto: string;
    nextPhoto: string;
    videoClip: string;
    landTypeLabel: string;
    areaLabel: string;
    priceLabel: string;
    contactLabel: string;
    locationLabel: string;
    descriptionLabel: string;
    closeModal: string;
    navigateHere: string;
  };
  modal: {
    fieldHighlights: string;
    fieldInfo: string;
    elevation: string;
    bestWindow: string;
    duration: string;
    coordinates: string;
    amenitiesInclusions: string;
    whatIsIncluded: string;
    signatureDishes: string;
    termsNotes: string;
    keyFeatures: string;
    marginFieldNote: string;
    byAuthor: string;
    reviews: string;
    upToGuests: string;
    bedrooms: string;
    bathrooms: string;
    bedShort: string;
    bathShort: string;
    difficulty: string;
    maxGuests: string;
    guide: string;
    driverIncluded: string;
    selfDrive: string;
    privateViewing: string;
    requestViewing: string;
    overnightStay: string;
    dossierAndBooking: string;
    directionsAndRoute: string;
    openFullNavigator: string;
  };
  booking: {
    requestVerify: string;
    checkIn: string;
    preferredDate: string;
    checkOut: string;
    partySize: string;
    guestSingular: string;
    guestPlural: string;
    fullName: string;
    fullNamePlaceholder: string;
    emailAddress: string;
    notesLabel: string;
    notesPlaceholder: string;
    estPrefix: string;
    nightSingular: string;
    nightPlural: string;
    daySingular: string;
    requestedDate: string;
    estimatedTotal: string;
    recordedMessagePrefix: string;
    recordedMessageMid: string;
    recordedMessageSuffix: string;
    manageRequests: string;
    submitAnother: string;
    missingContactError: string;
    dateOrderError: string;
    serverError: string;
  };
  navigationMap: {
    eyebrow: string;
    title: string;
    subtitle: string;
    goalLabel: string;
    goals: {
      all: string;
      sunrise: string;
      trekking: string;
      heritage: string;
      staysDining: string;
    };
    originLabel: string;
    destinationLabel: string;
    useCurrentLocation: string;
    locatingGps: string;
    gpsOriginLabel: string;
    gpsError: string;
    travelModeLabel: string;
    modes: {
      WALKING: string;
      TWO_WHEELER: string;
      DRIVING: string;
    };
    distanceLabel: string;
    durationLabel: string;
    calculatingRoute: string;
    routeError: string;
    twoWheelerFallbackNote: string;
    turnByTurnTitle: string;
    noStepsYet: string;
    openDossier: string;
    addStopToPlan: string;
    addedStop: string;
    startingHubsGroup: string;
    placesGroup: string;
    staysDiningGroup: string;
    missingKeyNotice: string;
    quotaBannerTitle: string;
    quotaBannerLinkText: string;
    selectedStop: string;
  };
  reviews: {
    eyebrow: string;
    title: string;
    subtitle: string;
    tabLabel: string;
    allGoals: string;
    filterByGoal: string;
    filterByPlace: string;
    allPlaces: string;
    goals: {
      sunrise: string;
      trekking: string;
      heritage: string;
      photography: string;
      calmRest: string;
      culinary: string;
    };
    goalTipLabel: string;
    helpfulLabel: string;
    helpfulMarked: string;
    explorePlace: string;
    directionsToPlace: string;
    shareButton: string;
    cancelShare: string;
    noReviewsMatch: string;
    resetGoalFilter: string;
    matchingPlacesNote: string;
    form: {
      title: string;
      placeLabel: string;
      goalLabel: string;
      ratingLabel: string;
      authorName: string;
      authorNamePlaceholder: string;
      authorOrigin: string;
      authorOriginPlaceholder: string;
      visitedSeason: string;
      visitedSeasonPlaceholder: string;
      headline: string;
      headlinePlaceholder: string;
      story: string;
      storyPlaceholder: string;
      goalTip: string;
      goalTipPlaceholder: string;
      submitBtn: string;
      submittingBtn: string;
      missingFieldsError: string;
      serverError: string;
      successMessage: string;
    };
  };
  bookingStatus: {
    pending_verification: string;
    verified: string;
    declined: string;
    cancelled: string;
  };
  footer: {
    about: string;
    explore: string;
    services: string;
    realEstate: string;
    contact: string;
    copyright: string;
    terms: string;
    privacy: string;
    admin: string;
  };
}

export const TRANSLATIONS: Record<Language, UIStrings> = {
  en: {
    nav: {
      explore: 'Explore',
      destinations: 'Destinations',
      stays: 'Stays',
      experiences: 'Experiences',
      dining: 'Dining',
      rentals: 'Rentals',
      realEstate: 'Real Estate',
      journal: 'Journal',
      planTrip: 'Trip Planner',
      bookings: 'Bookings',
      signIn: 'Sign In',
      searchPlaceholder: 'Search pine trails, heritage lodges, Shan noodles, motorbikes, or hillside land...',
      searchBtn: 'Search',
    },
    hero: {
      eyebrow: 'Kalaw · Shan State · 1,320m Highland Plateau',
      headline: 'Find Your Way to Kalaw.',
      subtitle:
        'Where morning clouds drift through Burmese pines, century-old teak lodges open onto wildflower verandas, and quiet footpaths connect tea terraces to Shan kitchens.',
      exploreCta: 'Explore Kalaw',
      planCta: 'Plan Your Trip',
      destLabel: 'Destination or Area',
      destPlaceholder: 'Pine Ridge, Station Road, Ywa Pu...',
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      guests: 'Guests',
      searchStays: 'Search Stays',
      spotlights: {
        ridges: {
          label: 'Pine Ridges',
          title: 'Dawn Mist & Burmese Pine Trails',
          caption: 'Walk red-earth footpaths from Thein Taung ridge toward quiet Danu and Pa-O mountain hamlets.',
          meta: '1,385 m Elevation · Viewpoints & Trekking',
        },
        heritage: {
          label: '1914 Heritage',
          title: 'Railway Quarter & Five-Day Market',
          caption: 'Explore century-old stone masonry, eucalyptus lanes, and vibrant morning hill-tribe produce.',
          meta: 'Est. 1914 · Central Station Road',
        },
        lodges: {
          label: 'Teak Lodges',
          title: 'Colonial Verandas & Cedar Cabins',
          caption: 'Rest beside wood-burning hearths in restored 1920s timber lodges and secluded ridge sanctuaries.',
          meta: 'From $42 – $210 / night · Curated Stays',
        },
        table: {
          label: 'Shan Table',
          title: 'Shan Noodles & Wild Tea Terraces',
          caption: 'Savor turmeric-broth Shan khao swe at dawn and pan-fired mountain green tea along western ridges.',
          meta: 'Highland Cuisine · Cafes & Workshops',
        },
      },
    },
    home: {
      discoverEyebrow: '01. Discover Kalaw',
      discoverTitle: 'Where pine forests meet quiet highland villages.',
      discoverBody:
        'Once a sleepy railway hill station, Kalaw unfolds across rolling Shan ridges carpeted in Khasi pines, red-earth trekking paths, and family tea terraces. Mornings arrive crisp and veiled in valley fog; afternoons glow warm against century-old brick verandas.',
      discoverQuote:
        '“A place measured not in monuments, but in cedar air, slow footpaths, and morning bowls of warm Shan noodles.”',
      statElevation: 'Average Elevation',
      statMarket: 'Rotating Hill Market',
      statTemp: 'Cool Season Days',
      fig1: 'Fig. 01 — Red-earth footpath descending through the Myin Ma Hti pine corridor.',
      fig2: 'Fig. 02 — Dawn mist rising behind Thein Taung’s brick stupas.',
      placesEyebrow: '02. Explore Places',
      placesTitle: 'Viewpoints, Ridges & Cultural Landmarks',
      viewAllDest: 'View All Destinations',
      readGuide: 'Read Destination Guide',
      staysEyebrow: '03. Find Your Stay',
      staysTitle: 'Heritage Lodges, Hill Cabins & Homestays',
      browseAllStays: 'Browse All Stays',
      perNight: '/ night',
      viewDetails: 'View Details',
      expEyebrow: '04. Local Experiences',
      expTitle: 'Guided Treks & Cultural Walks',
      allExp: 'All Experiences',
      perGuest: '/ guest',
      requestExp: 'Request Experience',
      diningEyebrow: '05. Food & Dining',
      diningTitle: 'Shan Kitchens & Mountain Roasteries',
      allDining: 'All Dining',
      viewMenuNotes: 'View Menu Notes',
      rentalsEyebrow: '06. Transportation & Rentals',
      rentalsTitle: 'Move Across the Plateau at Your Own Pace',
      exploreVehicles: 'Explore Vehicles & Drivers',
      perDay: '/ day',
      realEstateEyebrow: '07. Highland Real Estate Marketplace',
      realEstateTitle: 'Houses, Ridge Land & Heritage Residences',
      listProperty: 'List a Property',
      viewMarketplace: 'View Marketplace',
      perMonth: '/ mo',
      journalEyebrow: '08. The Kalaw Journal',
      journalTitle: 'Field Notes, Seasonal Guides & Culinary Stories',
      readDispatches: 'Read All Dispatches',
    },
    categories: {
      All: 'All',
      'Nature & Mountains': 'Nature & Mountains',
      Viewpoints: 'Viewpoints',
      'Cultural Attractions': 'Cultural Attractions',
      'Pagodas & Religious Sites': 'Pagodas & Religious Sites',
      'Hiking & Trekking': 'Hiking & Trekking',
      'Hidden Gems': 'Hidden Gems',
      Hotels: 'Hotels',
      Guesthouses: 'Guesthouses',
      Resorts: 'Resorts',
      Homestays: 'Homestays',
      'Private Houses': 'Private Houses',
      'Guided Trekking': 'Guided Trekking',
      'Cultural Immersion': 'Cultural Immersion',
      'Photography Tours': 'Photography Tours',
      'Nature Exploration': 'Nature Exploration',
      'Culinary Workshops': 'Culinary Workshops',
      'Motorbike Rentals': 'Motorbike Rentals',
      'Car Rentals': 'Car Rentals',
      'Private Drivers': 'Private Drivers',
      'Local Transfers': 'Local Transfers',
      'Houses for Sale': 'Houses for Sale',
      'Houses for Rent': 'Houses for Rent',
      'Land for Sale': 'Land for Sale',
      'Commercial Properties': 'Commercial Properties',
      Gentle: 'Gentle',
      Moderate: 'Moderate',
      Challenging: 'Challenging',
      Active: 'Active',
      Reserved: 'Reserved',
      'Under Review': 'Under Review',
    },
    pages: {
      destAtlas: 'Kalaw Atlas',
      destTitle: 'Explore Destinations & Interactive Plateau Navigation',
      destDesc:
        'From sunrise monastery ridges and century-old railway quarters to pine forest trails—plan your exact route across Kalaw.',
      staysEyebrow: 'Kalaw Hospitality',
      staysTitle: 'Find Your Stay in the Pines',
      staysDesc:
        'Restored colonial lodges, stone ridge pavilions, welcoming town guesthouses, and village homestays across Kalaw.',
      expEyebrow: 'Curated Local Services',
      expTitle: 'Experiences, Guided Treks & Workshops',
      expDesc:
        'Small-group highland walks, dawn photography outings, tea harvest immersions, and market-to-table Shan cooking led by licensed local guides.',
      diningEyebrow: 'Kalaw Table',
      diningTitle: 'Food, Restaurants & Mountain Teahouses',
      diningDesc:
        'From steaming dawn bowls of Shan khao swe and Gurkha clay-pot thalis to single-origin Ywangan coffee roasteries.',
      rentalsEyebrow: 'Plateau Mobility',
      rentalsTitle: 'Transportation, Motorbikes & Private Drivers',
      rentalsDesc:
        'Explore Pindaya limestone caves, ridge viewpoints, or arrange punctual transfers between Kalaw, Heho Airport, and Inle Lake.',
      reEyebrow: 'Highland Property Marketplace',
      reTitle: 'Kalaw Houses, Land & Heritage Estates',
      reDesc:
        'Curated residential homes, long-term seasonal leases, pine-ridge acreage, and hospitality corners verified with local agents.',
      journalEyebrow: 'The Kalaw Journal',
      journalTitle: 'Travel Guides, Essays & Seasonal Field Notes',
      journalDesc:
        'Long-form dispatches written from Kalaw’s market lanes, pine ridges, and mountain kitchens.',
      exploreEyebrow: 'Unified Discovery',
      exploreTitle: 'Explore Everything in Kalaw',
      tripEyebrow: 'Itinerary Composer',
      tripTitle: 'Plan Your Kalaw Journey',
      tripDesc:
        'Assemble your viewpoints, morning teahouses, boutique lodges, and ridge treks day by day.',
      bookingsEyebrow: 'Reservation Concierge',
      bookingsTitle: 'Your Booking Requests',
      bookingsDesc:
        'All requests are verified directly with local Kalaw lodges, trekking guides, and vehicle owners before confirmation.',
    },
    actions: {
      save: 'Save',
      saved: 'Saved',
      requestDate: 'Request Date',
      requestTable: 'Request Table Reservation',
      requestVehicle: 'Request Vehicle',
      inspectDossier: 'View Details',
      addToTripPlan: 'Add to Trip Planner',
      addedToPlan: 'Added to Plan',
      resetFilters: 'Reset Filters',
      cancelRequest: 'Cancel Request',
      submitBooking: 'Submit Booking Request',
      submitting: 'Submitting Request...',
      noChargeNote: 'No charge yet. Requests are verified directly by Kalaw hosts.',
      viewInGallery: 'View in Gallery',
      previousPhoto: 'Previous photo or video',
      nextPhoto: 'Next photo or video',
      videoClip: 'Video Tour',
      landTypeLabel: 'Land / Property Type',
      areaLabel: 'Area',
      priceLabel: 'Price',
      contactLabel: 'Contact',
      locationLabel: 'Location',
      descriptionLabel: 'Description',
      closeModal: 'Close',
      navigateHere: 'Navigate Here',
    },
    modal: {
      fieldHighlights: 'Field Highlights',
      fieldInfo: 'Field Information',
      elevation: 'Elevation',
      bestWindow: 'Best Window',
      duration: 'Duration',
      coordinates: 'Coordinates',
      amenitiesInclusions: 'Amenities & Inclusions',
      whatIsIncluded: 'What Is Included',
      signatureDishes: 'Signature Dishes',
      termsNotes: 'Terms & Service Notes',
      keyFeatures: 'Key Features',
      marginFieldNote: 'Margin Field Note',
      byAuthor: 'By',
      reviews: 'reviews',
      upToGuests: 'Up to',
      bedrooms: 'Bedrooms',
      bathrooms: 'Bathrooms',
      bedShort: 'Bed',
      bathShort: 'Bath',
      difficulty: 'Difficulty',
      maxGuests: 'Max',
      guide: 'Guide',
      driverIncluded: 'Driver Included',
      selfDrive: 'Self-Drive',
      privateViewing: 'Private Viewing & Inquiry',
      requestViewing: 'Request Property Viewing',
      overnightStay: 'Overnight Stay',
      dossierAndBooking: 'Overview & Reservation',
      directionsAndRoute: 'Route & Interactive Map',
      openFullNavigator: 'Open Full Plateau Navigator',
    },
    booking: {
      requestVerify: 'Request & Verify',
      checkIn: 'Check-in',
      preferredDate: 'Preferred Date',
      checkOut: 'Check-out',
      partySize: 'Guests / Party Size',
      guestSingular: 'Guest',
      guestPlural: 'Guests',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Your full name',
      emailAddress: 'Email Address',
      notesLabel: 'Notes for Local Host (Optional)',
      notesPlaceholder: 'Dietary preferences, pickup timing, or viewing questions...',
      estPrefix: 'Est.',
      nightSingular: 'night',
      nightPlural: 'nights',
      daySingular: 'day',
      requestedDate: 'Requested Date',
      estimatedTotal: 'Estimated Total',
      recordedMessagePrefix: 'Your request for',
      recordedMessageMid: 'has been recorded as',
      recordedMessageSuffix: 'Availability is not confirmed until verified by our Kalaw host team.',
      manageRequests: 'Manage Requests',
      submitAnother: 'Submit Another',
      missingContactError: 'Please enter your name and email so our local concierge can verify availability.',
      dateOrderError: 'Check-out date must be after check-in date.',
      serverError: 'Unable to reach the booking server. Your request has not been saved.',
    },
    navigationMap: {
      eyebrow: 'Interactive Plateau Navigator',
      title: 'Navigate Kalaw by Goal & Route',
      subtitle:
        'Select your travel goal, starting point or current GPS position, and travel mode to preview live distances, mountain routes, and turn-by-turn directions.',
      goalLabel: 'Filter by Goal',
      goals: {
        all: 'All Landmarks',
        sunrise: 'Sunrise & Viewpoints',
        trekking: 'Trekking & Nature',
        heritage: 'Heritage & Culture',
        staysDining: 'Stays & Dining',
      },
      originLabel: 'Starting Point',
      destinationLabel: 'Destination',
      useCurrentLocation: 'Use My GPS',
      locatingGps: 'Locating...',
      gpsOriginLabel: 'My Current Location (GPS)',
      gpsError: 'Location permission denied or unavailable. Select a Kalaw landmark origin instead.',
      travelModeLabel: 'Travel Mode',
      modes: {
        WALKING: 'Walking Trail',
        TWO_WHEELER: 'Motorbike',
        DRIVING: '4x4 / Car',
      },
      distanceLabel: 'Distance',
      durationLabel: 'Estimated Time',
      calculatingRoute: 'Computing plateau route...',
      routeError: 'Unable to compute a road or path route between these two points right now.',
      twoWheelerFallbackNote: 'Two-wheeler routing unavailable here; displaying car route instead.',
      turnByTurnTitle: 'Turn-by-Turn Directions',
      noStepsYet: 'Select an origin and destination to load route steps.',
      openDossier: 'Inspect Details',
      addStopToPlan: 'Add Stop to Planner',
      addedStop: 'Added to Plan',
      startingHubsGroup: 'Kalaw Hubs',
      placesGroup: 'Destinations & Trails',
      staysDiningGroup: 'Stays & Dining',
      missingKeyNotice: 'Interactive Google Map awaits a Google Maps API key configuration.',
      quotaBannerTitle: 'Google Maps Platform demo quota reached — map display and route calculation may be temporarily limited.',
      quotaBannerLinkText: 'View Quota & Upgrade Guide',
      selectedStop: 'Selected Stop',
    },
    reviews: {
      eyebrow: 'Traveler Field Notes & Goal Guide',
      title: 'Shared Experiences & How to Reach Your Goal',
      subtitle:
        'Filter firsthand stories by what you hope to experience in Kalaw—dawn mist, heritage walks, forest trekking, or local cuisine—and read practical advice from fellow travelers.',
      tabLabel: 'Traveler Reviews',
      allGoals: 'All Goals',
      filterByGoal: 'Find Places by Your Goal',
      filterByPlace: 'Place',
      allPlaces: 'All Kalaw Places',
      goals: {
        sunrise: 'Sunrise & Viewpoints',
        trekking: 'Trekking & Nature',
        heritage: 'Heritage & Culture',
        photography: 'Photography',
        calmRest: 'Quiet & Slow Rest',
        culinary: 'Local Culinary',
      },
      goalTipLabel: 'Traveler Tip to Achieve This Goal',
      helpfulLabel: 'Helpful',
      helpfulMarked: 'Helpful',
      explorePlace: 'Inspect Place',
      directionsToPlace: 'Navigate Here',
      shareButton: 'Share Your Experience',
      cancelShare: 'Close Form',
      noReviewsMatch: 'No traveler stories match this place and goal filter yet.',
      resetGoalFilter: 'Show All Stories',
      matchingPlacesNote: 'stories',
      form: {
        title: 'Add Your Kalaw Experience & Goal Guidance',
        placeLabel: 'Place Visited',
        goalLabel: 'Primary Goal Achieved',
        ratingLabel: 'Experience Rating',
        authorName: 'Your Name',
        authorNamePlaceholder: 'e.g. Thura Aung',
        authorOrigin: 'City & Travel Style',
        authorOriginPlaceholder: 'e.g. Yangon · Solo Trekker',
        visitedSeason: 'Month & Year Visited',
        visitedSeasonPlaceholder: 'e.g. November 2026',
        headline: 'Story Headline',
        headlinePlaceholder: 'Summarize what stood out most...',
        story: 'Your Experience',
        storyPlaceholder: 'Describe what you saw, felt, and how the place unfolded during your visit...',
        goalTip: 'Advice to Help Others Reach This Goal',
        goalTipPlaceholder: 'Best arrival time, trail fork, viewpoint spot, or what to bring...',
        submitBtn: 'Publish Experience',
        submittingBtn: 'Publishing...',
        missingFieldsError: 'Please fill in your name, headline, experience story, and goal tip.',
        serverError: 'Unable to reach the review server right now. Please try again.',
        successMessage: 'Thank you—your experience and goal guidance are now live for future visitors.',
      },
    },
    bookingStatus: {
      pending_verification: 'Pending Host Verification',
      verified: 'Verified by Concierge',
      declined: 'Unavailable / Declined',
      cancelled: 'Cancelled by Traveler',
    },
    footer: {
      about:
        'An editorial travel publication, local hospitality curator, and highland real-estate marketplace rooted in Kalaw, Shan State, Myanmar.',
      explore: 'Explore',
      services: 'Services',
      realEstate: 'Real Estate',
      contact: 'Contact',
      copyright: 'Kalaw Travel. Curated in the Shan Highlands.',
      terms: 'Terms of Service',
      privacy: 'Privacy Notice',
      admin: 'Operations & Admin',
    },
  },
  my: {
    nav: {
      explore: 'ရှာဖွေရန်',
      destinations: 'နေရာများ',
      stays: 'တည်းခိုရန်',
      experiences: 'ခရီးစဉ်များ',
      dining: 'စားသောက်ဆိုင်',
      rentals: 'ယာဉ်ငှား',
      realEstate: 'အိမ်ခြံမြေ',
      journal: 'ဂျာနယ်',
      planTrip: 'ခရီးစဉ်ဆွဲရန်',
      bookings: 'ဘွတ်ကင်',
      signIn: 'အကောင့်ဝင်',
      searchPlaceholder: 'နေရာ၊ တည်းခိုခန်း၊ ရှမ်းခေါက်ဆွဲ၊ ဆိုင်ကယ် သို့မဟုတ် မြေကွက် ရှာပါ...',
      searchBtn: 'ရှာမည်',
    },
    hero: {
      eyebrow: 'ကလော · ရှမ်းပြည်နယ် · ၁,၃၂၀ မီတာ',
      headline: 'ကလောသို့ ခရီးနှင်ပါ။',
      subtitle:
        'ထင်းရှူးတောများ၊ ရှေးဟောင်းတည်းခိုအိမ်များနှင့် တောင်ပေါ်ရှမ်းစားဖွယ်ရာများကို တစ်နေရာတည်းတွင် ရှာဖွေလိုက်ပါ။',
      exploreCta: 'စူးစမ်းမည်',
      planCta: 'ခရီးစဉ်ဆွဲမည်',
      destLabel: 'နေရာ / ရပ်ကွက်',
      destPlaceholder: 'ထင်းရှူးတောင်၊ ဘူတာလမ်း...',
      checkIn: 'ဝင်ရောက်ရက်',
      checkOut: 'ထွက်ခွာရက်',
      guests: 'ဧည့်သည်',
      searchStays: 'ရှာဖွေမည်',
      spotlights: {
        ridges: {
          label: 'ထင်းရှူးတောင်',
          title: 'နံနက်မြူနှင်းနှင့် ထင်းရှူးလမ်း',
          caption: 'သိမ်တောင်မှ တောင်ပေါ်ရွာများဆီသို့ မြေနီခြေလျင်လမ်းအတိုင်း လျှောက်လှမ်းပါ။',
          meta: '၁,၃၈၅ မီတာ · ရှုခင်းသာနှင့် တောင်တက်',
        },
        heritage: {
          label: '၁၉၁၄ ဘူတာ',
          title: 'ဘူတာရပ်ကွက်နှင့် ငါးရက်တစ်ဈေး',
          caption: 'ရာစုနှစ်ကျော် ကျောက်တုံးဗိသုကာနှင့် နံနက်ခင်း တောင်ပေါ်ဈေးနေ့။',
          meta: '၁၉၁၄ တည် · ဘူတာလမ်း',
        },
        lodges: {
          label: 'ကျွန်းသစ်အိမ်',
          title: 'ရှေးဟောင်းတည်းခိုအိမ်နှင့် အိမ်ငယ်များ',
          caption: 'မီးလင်းဖိုနွေးနွေးနှင့် ထင်းရှူးတောကြား ကိုလိုနီအိမ်များတွင် အနားယူပါ။',
          meta: '$42 – $210 / ည · တည်းခိုရန်',
        },
        table: {
          label: 'ရှမ်းစားပွဲ',
          title: 'ရှမ်းခေါက်ဆွဲနှင့် လက်ဖက်တောင်ကုန်း',
          caption: 'နံနက်ခင်း ရှမ်းခေါက်ဆွဲပူပူနှင့် တောင်ပေါ်လက်ဖက်စိမ်းရနံ့ကို ခံစားပါ။',
          meta: 'တောင်ပေါ်အစားအစာ · ကော်ဖီဆိုင်',
        },
      },
    },
    home: {
      discoverEyebrow: '၀၁ · ကလောမြို့အကြောင်း',
      discoverTitle: 'ထင်းရှူးတောများနှင့် တောင်ပေါ်ရွာလေးများ ဆုံစည်းရာ။',
      discoverBody:
        'တစ်ချိန်က အေးချမ်းသော မီးရထားတောင်ပေါ်စခန်းမြို့ဖြစ်ခဲ့သည့် ကလောသည် ထင်းရှူးတောများ၊ မြေနီလမ်းသွယ်များနှင့် လက်ဖက်စိုက်ခင်းများဖြင့် ဝန်းရံထားပါသည်။',
      discoverQuote:
        '“ထင်းရှူးလေနုအေး၊ ခြေလျင်လမ်းသွယ်များနှင့် ရှမ်းခေါက်ဆွဲပူပူတစ်ပွဲဖြင့် တန်ဖိုးထားရသော မြို့လေး။”',
      statElevation: 'ပျမ်းမျှအမြင့်',
      statMarket: 'တောင်ပေါ်ဈေး',
      statTemp: 'ရာသီဥတု',
      fig1: 'ပုံ (၁) — မြင်းမထိ ထင်းရှူးတောလမ်း။',
      fig2: 'ပုံ (၂) — သိမ်တောင် နံနက်ခင်းမြူနှင်း။',
      placesEyebrow: '၀၂ · လည်ပတ်စရာနေရာများ',
      placesTitle: 'ရှုခင်းသာများနှင့် ယဉ်ကျေးမှုနေရာများ',
      viewAllDest: 'နေရာအားလုံး',
      readGuide: 'လမ်းညွှန်ဖတ်ရန်',
      staysEyebrow: '၀၃ · တည်းခိုရန်',
      staysTitle: 'တည်းခိုအိမ်များနှင့် Homestays',
      browseAllStays: 'အားလုံးကြည့်ရန်',
      perNight: '/ ည',
      viewDetails: 'အသေးစိတ်',
      expEyebrow: '၀၄ · အတွေ့အကြုံများ',
      expTitle: 'တောင်တက်ခရီးနှင့် လေ့လာရေး',
      allExp: 'ခရီးစဉ်အားလုံး',
      perGuest: '/ ဦး',
      requestExp: 'ရက်စွဲတောင်းရန်',
      diningEyebrow: '၀၅ · အစားအစာ',
      diningTitle: 'ရှမ်းထမင်းဆိုင်နှင့် ကော်ဖီဆိုင်များ',
      allDining: 'ဆိုင်အားလုံး',
      viewMenuNotes: 'အသေးစိတ်',
      rentalsEyebrow: '၀၆ · ယာဉ်ငှားရမ်းခြင်း',
      rentalsTitle: 'ကလောတစ်ဝိုက် စိတ်ကြိုက်သွားလာပါ',
      exploreVehicles: 'ယာဉ်အားလုံး',
      perDay: '/ ရက်',
      realEstateEyebrow: '၀၇ · အိမ်ခြံမြေဈေးကွက်',
      realEstateTitle: 'အိမ်များနှင့် တောင်ကြောမြေကွက်များ',
      listProperty: 'အိမ်ခြံမြေ တင်ရန်',
      viewMarketplace: 'အားလုံးကြည့်ရန်',
      perMonth: '/ လ',
      journalEyebrow: '၀၈ · ကလော ဂျာနယ်',
      journalTitle: 'ခရီးသွားမှတ်တမ်းနှင့် လမ်းညွှန်များ',
      readDispatches: 'ဆောင်းပါးအားလုံး',
    },
    categories: {
      All: 'အားလုံး',
      'Nature & Mountains': 'သဘာဝတောင်တန်း',
      Viewpoints: 'ရှုခင်းသာ',
      'Cultural Attractions': 'ယဉ်ကျေးမှု',
      'Pagodas & Religious Sites': 'ဘုရားစေတီ',
      'Hiking & Trekking': 'တောင်တက်ခရီး',
      'Hidden Gems': 'နေရာကောင်း',
      Hotels: 'ဟိုတယ်',
      Guesthouses: 'တည်းခိုခန်း',
      Resorts: 'အပန်းဖြေစခန်း',
      Homestays: 'Homestay',
      'Private Houses': 'သီးသန့်အိမ်',
      'Guided Trekking': 'တောင်တက်လမ်းညွှန်',
      'Cultural Immersion': 'ယဉ်ကျေးမှု',
      'Photography Tours': 'ဓာတ်ပုံခရီး',
      'Nature Exploration': 'သဘာဝလေ့လာရေး',
      'Culinary Workshops': 'ချက်ပြုတ်သင်တန်း',
      'Motorbike Rentals': 'ဆိုင်ကယ်ငှား',
      'Car Rentals': 'ကားငှား',
      'Private Drivers': 'ဒရိုင်ဘာပါ',
      'Local Transfers': 'အကြိုအပို့',
      'Houses for Sale': 'ရောင်းရန်အိမ်',
      'Houses for Rent': 'ငှားရန်အိမ်',
      'Land for Sale': 'ရောင်းရန်မြေ',
      'Commercial Properties': 'စီးပွားရေးမြေ',
      Gentle: 'လွယ်ကူ',
      Moderate: 'အလယ်အလတ်',
      Challenging: 'ခက်ခဲ',
      Active: 'ရရှိနိုင်သည်',
      Reserved: 'ကြိုတင်ထားပြီး',
      'Under Review': 'စိစစ်နေဆဲ',
    },
    pages: {
      destAtlas: 'ကလော မြေပုံ',
      destTitle: 'လည်ပတ်စရာ နေရာများနှင့် လမ်းကြောင်းညွှန်',
      destDesc:
        'နံနက်ခင်း ရှုခင်းသာတောင်ကုန်းများ၊ ဘူတာရပ်ကွက်မှ ထင်းရှူးတောလမ်းများအထိ မြေပုံဖြင့် လမ်းကြောင်းရှာဖွေပါ။',
      staysEyebrow: 'ကလော တည်းခိုခန်း',
      staysTitle: 'ထင်းရှူးတောကြား တည်းခိုရန်',
      staysDesc:
        'ရှေးဟောင်းကိုလိုနီအိမ်များ၊ တောင်ကြောအိမ်ငယ်များနှင့် ကျေးရွာ Homestay များ။',
      expEyebrow: 'ဒေသခံ ဝန်ဆောင်မှု',
      expTitle: 'တောင်တက်ခရီးနှင့် သင်တန်းများ',
      expDesc:
        'ဒေသခံလမ်းညွှန်များနှင့် တောင်တက်ခရီး၊ ဓာတ်ပုံခရီးနှင့် ရှမ်းဟင်းချက်သင်တန်းများ။',
      diningEyebrow: 'ကလော စားသောက်ဖွယ်ရာ',
      diningTitle: 'စားသောက်ဆိုင်နှင့် ကော်ဖီဆိုင်များ',
      diningDesc:
        'ရှမ်းခေါက်ဆွဲပူပူ၊ ဂေါ်ရခါးဟင်းလျာနှင့် ရွာငံတောင်ပေါ်ကော်ဖီဆိုင်များ။',
      rentalsEyebrow: 'သယ်ယူပို့ဆောင်ရေး',
      rentalsTitle: 'ဆိုင်ကယ်၊ ကားနှင့် ဒရိုင်ဘာများ',
      rentalsDesc:
        'ပင်းတယ၊ အင်းလေးနှင့် ဟဲဟိုးလေဆိပ် အကြိုအပို့အတွက် စိတ်ကြိုက်ငှားရမ်းပါ။',
      reEyebrow: 'အိမ်ခြံမြေ ဈေးကွက်',
      reTitle: 'ကလော အိမ်နှင့် မြေကွက်များ',
      reDesc:
        'ဒေသခံအကျိုးဆောင်များနှင့် စိစစ်ထားသော အိမ်များ၊ အငှားအိမ်နှင့် မြေကွက်များ။',
      journalEyebrow: 'ကလော ဂျာနယ်',
      journalTitle: 'ခရီးသွားလမ်းညွှန်နှင့် ဆောင်းပါးများ',
      journalDesc:
        'ကလောဈေးလမ်းများနှင့် ထင်းရှူးတောင်ကြောများမှ ခရီးသွားမှတ်တမ်းများ။',
      exploreEyebrow: 'စုစည်းရှာဖွေရန်',
      exploreTitle: 'ကလောတစ်ခွင် ရှာဖွေပါ',
      tripEyebrow: 'ခရီးစဉ် စီစဉ်သူ',
      tripTitle: 'ကလော ခရီးစဉ် ရေးဆွဲပါ',
      tripDesc:
        'နေရာများ၊ တည်းခိုခန်းနှင့် တောင်တက်ခရီးစဉ်များကို နေ့ရက်အလိုက် စုစည်းပါ။',
      bookingsEyebrow: 'ဘွတ်ကင် ဝန်ဆောင်မှု',
      bookingsTitle: 'သင်၏ ဘွတ်ကင်များ',
      bookingsDesc:
        'တောင်းဆိုမှုများကို ဒေသခံအိမ်ရှင်နှင့် လမ်းညွှန်များထံ စိစစ်အတည်ပြုပေးပါသည်။',
    },
    actions: {
      save: 'သိမ်းမည်',
      saved: 'သိမ်းပြီး',
      requestDate: 'ရက်စွဲတောင်းရန်',
      requestTable: 'စားပွဲကြိုမှာရန်',
      requestVehicle: 'ယာဉ်ငှားမည်',
      inspectDossier: 'အသေးစိတ်ကြည့်ရန်',
      addToTripPlan: 'ခရီးစဉ်ထဲထည့်',
      addedToPlan: 'ထည့်ပြီး',
      resetFilters: 'ပြန်စမည်',
      cancelRequest: 'ပယ်ဖျက်မည်',
      submitBooking: 'ဘွတ်ကင်တင်မည်',
      submitting: 'ပေးပို့နေသည်...',
      noChargeNote: 'ငွေကြိုပေးရန် မလိုသေးပါ။ အိမ်ရှင်မှ စိစစ်အတည်ပြုပေးပါမည်။',
      viewInGallery: 'ပြခန်းတွင်ကြည့်ရန်',
      previousPhoto: 'ရှေ့ပုံ',
      nextPhoto: 'နောက်ပုံ',
      videoClip: 'ဗီဒီယို',
      landTypeLabel: 'မြေ/အိမ် အမျိုးအစား',
      areaLabel: 'အကျယ်အဝန်း',
      priceLabel: 'ဈေးနှုန်း',
      contactLabel: 'ဆက်သွယ်ရန်',
      locationLabel: 'တည်နေရာ',
      descriptionLabel: 'အသေးစိတ်ဖော်ပြချက်',
      closeModal: 'ပိတ်မည်',
      navigateHere: 'လမ်းကြောင်းရှာမည်',
    },
    modal: {
      fieldHighlights: 'အဓိက ထူးခြားချက်များ',
      fieldInfo: 'နေရာဆိုင်ရာ အချက်အလက်',
      elevation: 'ပင်လယ်ရေမျက်နှာပြင်အမြင့်',
      bestWindow: 'အကောင်းဆုံးအချိန်',
      duration: 'ကြာမြင့်ချိန်',
      coordinates: 'တည်နေရာ ကိုသြဒီနိတ်',
      amenitiesInclusions: 'ပါဝင်သော ဝန်ဆောင်မှုများ',
      whatIsIncluded: 'ခရီးစဉ်တွင် ပါဝင်သည်များ',
      signatureDishes: 'နာမည်ကြီး ဟင်းလျာများ',
      termsNotes: 'စည်းကမ်းနှင့် ဝန်ဆောင်မှုမှတ်စု',
      keyFeatures: 'အဓိက အချက်အလက်များ',
      marginFieldNote: 'အယ်ဒီတာ မှတ်စု',
      byAuthor: 'ရေးသားသူ —',
      reviews: 'သုံးသပ်ချက်',
      upToGuests: 'အများဆုံး',
      bedrooms: 'အိပ်ခန်း',
      bathrooms: 'ရေချိုးခန်း',
      bedShort: 'အိပ်ခန်း',
      bathShort: 'ရေချိုးခန်း',
      difficulty: 'ခက်ခဲမှုအဆင့်',
      maxGuests: 'အများဆုံး',
      guide: 'လမ်းညွှန်',
      driverIncluded: 'ဒရိုင်ဘာ ပါဝင်သည်',
      selfDrive: 'ကိုယ်တိုင်မောင်းနှင်',
      privateViewing: 'အိမ်ခြံမြေ ကြည့်ရှုမေးမြန်းရန်',
      requestViewing: 'ကြည့်ရှုရန် ရက်ချိန်းတောင်းမည်',
      overnightStay: 'ညအိပ်တည်းခိုရန်',
      dossierAndBooking: 'အသေးစိတ်နှင့် ဘွတ်ကင်',
      directionsAndRoute: 'လမ်းညွှန်နှင့် မြေပုံ',
      openFullNavigator: 'မြေပုံအပြည့်ဖြင့် ကြည့်ရန်',
    },
    booking: {
      requestVerify: 'တောင်းဆိုပြီး စိစစ်မည်',
      checkIn: 'ဝင်ရောက်မည့်ရက်',
      preferredDate: 'နှစ်သက်ရာ ရက်စွဲ',
      checkOut: 'ထွက်ခွာမည့်ရက်',
      partySize: 'ဧည့်သည် / လူဦးရေ',
      guestSingular: 'ဦး',
      guestPlural: 'ဦး',
      fullName: 'အမည်အပြည့်အစုံ',
      fullNamePlaceholder: 'သင့်အမည် ထည့်ပါ',
      emailAddress: 'အီးမေးလ်လိပ်စာ',
      notesLabel: 'ဒေသခံအိမ်ရှင်ထံ မှတ်ချက် (မထည့်လည်းရ)',
      notesPlaceholder: 'အစားအသောက်၊ လာကြိုရမည့်အချိန် သို့မဟုတ် မေးမြန်းလိုသည်များ...',
      estPrefix: 'ခန့်မှန်း',
      nightSingular: 'ည',
      nightPlural: 'ည',
      daySingular: 'ရက်',
      requestedDate: 'တောင်းဆိုထားသည့်ရက်',
      estimatedTotal: 'ခန့်မှန်းကုန်ကျစရိတ်',
      recordedMessagePrefix: '',
      recordedMessageMid: 'အတွက် တောင်းဆိုမှုကို အမှတ်စဉ်',
      recordedMessageSuffix: 'ဖြင့် မှတ်တမ်းတင်ပြီးပါပြီ။ ကလောအိမ်ရှင်အဖွဲ့မှ စိစစ်အတည်ပြုပေးပါမည်။',
      manageRequests: 'ဘွတ်ကင်များ ကြည့်ရန်',
      submitAnother: 'နောက်တစ်ခု တင်မည်',
      missingContactError: 'ရရှိနိုင်မှု စိစစ်နိုင်ရန် အမည်နှင့် အီးမေးလ် ဖြည့်သွင်းပေးပါ။',
      dateOrderError: 'ထွက်ခွာမည့်ရက်သည် ဝင်ရောက်မည့်ရက်ထက် နောက်ကျရပါမည်။',
      serverError: 'ဘွတ်ကင်ဆာဗာနှင့် ချိတ်ဆက်မရပါ။ တောင်းဆိုမှု မသိမ်းဆည်းရသေးပါ။',
    },
    navigationMap: {
      eyebrow: 'ကလော လမ်းညွှန်မြေပုံ',
      title: 'ရည်မှန်းချက်အလိုက် ကလောတစ်ခွင် လမ်းကြောင်းရှာပါ',
      subtitle:
        'သင်သွားလိုသည့် ပန်းတိုင်အမျိုးအစား၊ စတင်ထွက်ခွာမည့်နေရာ (သို့) GPS တည်နေရာနှင့် သွားလာမှုပုံစံကို ရွေးချယ်၍ အကွာအဝေးနှင့် လမ်းညွှန်အဆင့်ဆင့်ကို ကြည့်ရှုပါ။',
      goalLabel: 'ခရီးစဉ်ရည်မှန်းချက်',
      goals: {
        all: 'နေရာအားလုံး',
        sunrise: 'နေထွက်နှင့် ရှုခင်းသာ',
        trekking: 'တောင်တက်နှင့် သဘာဝ',
        heritage: 'ယဉ်ကျေးမှုနှင့် ဘုရားစေတီ',
        staysDining: 'တည်းခိုခန်းနှင့် စားသောက်ဆိုင်',
      },
      originLabel: 'စတင်ထွက်ခွာမည့်နေရာ',
      destinationLabel: 'သွားရောက်မည့်နေရာ',
      useCurrentLocation: 'GPS တည်နေရာသုံးမည်',
      locatingGps: 'တည်နေရာ ရှာနေသည်...',
      gpsOriginLabel: 'လက်ရှိ GPS တည်နေရာ',
      gpsError: 'GPS ခွင့်ပြုချက် မရရှိပါ။ ကလောအထင်ကရနေရာတစ်ခုကို စမှတ်အဖြစ် ရွေးချယ်ပါ။',
      travelModeLabel: 'သွားလာမှုပုံစံ',
      modes: {
        WALKING: 'ခြေလျင်လမ်း',
        TWO_WHEELER: 'ဆိုင်ကယ်',
        DRIVING: '4x4 / ကား',
      },
      distanceLabel: 'အကွာအဝေး',
      durationLabel: 'ခန့်မှန်းကြာချိန်',
      calculatingRoute: 'လမ်းကြောင်း တွက်ချက်နေသည်...',
      routeError: 'ဤနေရာနှစ်ခုကြား လမ်းကြောင်း တွက်ချက်၍ မရသေးပါ။',
      twoWheelerFallbackNote: 'ဆိုင်ကယ်လမ်းကြောင်း မရနိုင်သဖြင့် ကားလမ်းကြောင်းအတိုင်း ပြသထားပါသည်။',
      turnByTurnTitle: 'အဆင့်ဆင့် လမ်းညွှန်ချက်များ',
      noStepsYet: 'လမ်းညွှန်ချက်များ ကြည့်ရှုရန် စမှတ်နှင့် ပန်းတိုင်ကို ရွေးချယ်ပါ။',
      openDossier: 'အသေးစိတ် ကြည့်ရန်',
      addStopToPlan: 'ခရီးစဉ်ထဲ ထည့်မည်',
      addedStop: 'ထည့်ပြီး',
      startingHubsGroup: 'ကလော မြို့လယ်အချက်အချာ',
      placesGroup: 'လည်ပတ်စရာနေရာများ',
      staysDiningGroup: 'တည်းခိုခန်းနှင့် စားသောက်ဆိုင်',
      missingKeyNotice: 'Google Maps API key ချိတ်ဆက်ပြီးပါက မြေပုံပေါ်လာပါမည်။',
      quotaBannerTitle: 'Google Maps Platform demo quota ပြည့်သွားပါသဖြင့် မြေပုံနှင့် လမ်းကြောင်းတွက်ချက်မှု ယာယီကန့်သတ်ထားပါသည်။',
      quotaBannerLinkText: 'Quota လမ်းညွှန် ကြည့်ရန်',
      selectedStop: 'ရွေးချယ်ထားသည့်နေရာ',
    },
    reviews: {
      eyebrow: 'ခရီးသွားအတွေ့အကြုံနှင့် ရည်မှန်းချက်လမ်းညွှန်',
      title: 'ခရီးသွားများ၏ အတွေ့အကြုံနှင့် လက်တွေ့အကြံပြုချက်များ',
      subtitle:
        'နံနက်ခင်းနေထွက်မြင်ကွင်း၊ တောင်တက်လမ်းလျှောက်ခြင်း၊ ရှေးဟောင်းယဉ်ကျေးမှု သို့မဟုတ် ဒေသအစားအစာ စသည့် သင်မျှော်မှန်းထားသည့် ရည်မှန်းချက်အလိုက် ရွေးချယ်ဖတ်ရှုပြီး သင့်တော်သောနေရာများကို ရှာဖွေပါ။',
      tabLabel: 'ခရီးသွားသုံးသပ်ချက်',
      allGoals: 'ရည်မှန်းချက်အားလုံး',
      filterByGoal: 'ရည်မှန်းချက်အလိုက် နေရာရှာရန်',
      filterByPlace: 'နေရာ',
      allPlaces: 'ကလော နေရာအားလုံး',
      goals: {
        sunrise: 'နေထွက်နှင့် ရှုခင်းသာ',
        trekking: 'တောင်တက်နှင့် သဘာဝ',
        heritage: 'ယဉ်ကျေးမှုနှင့် ရှေးဟောင်း',
        photography: 'ဓာတ်ပုံရိုက်ကူးရေး',
        calmRest: 'တိတ်ဆိတ်အေးချမ်းအနားယူ',
        culinary: 'ဒေသအစားအစာ',
      },
      goalTipLabel: 'ဤရည်မှန်းချက် အောင်မြင်စေရန် အကြံပြုချက်',
      helpfulLabel: 'အသုံးဝင်သည်',
      helpfulMarked: 'အသုံးဝင်သည်',
      explorePlace: 'အသေးစိတ်ကြည့်ရန်',
      directionsToPlace: 'လမ်းကြောင်းရှာရန်',
      shareButton: 'သင့်အတွေ့အကြုံ မျှဝေရန်',
      cancelShare: 'ဖောင်ပိတ်မည်',
      noReviewsMatch: 'ဤနေရာနှင့် ရည်မှန်းချက်အတွက် ခရီးသွားသုံးသပ်ချက် မရှိသေးပါ။',
      resetGoalFilter: 'အားလုံးပြန်ကြည့်ရန်',
      matchingPlacesNote: 'ပုဒ်',
      form: {
        title: 'သင့်ကလောအတွေ့အကြုံနှင့် ရည်မှန်းချက်အကြံပြုချက် ရေးသားပါ',
        placeLabel: 'သွားရောက်ခဲ့သည့်နေရာ',
        goalLabel: 'အဓိက အောင်မြင်ခဲ့သည့် ရည်မှန်းချက်',
        ratingLabel: 'အမှတ်ပေးမှု',
        authorName: 'သင့်အမည်',
        authorNamePlaceholder: 'ဥပမာ - သူရအောင်',
        authorOrigin: 'မြို့နှင့် ခရီးသွားပုံစံ',
        authorOriginPlaceholder: 'ဥပမာ - ရန်ကုန် · တောင်တက်ဝါသနာရှင်',
        visitedSeason: 'သွားရောက်ခဲ့သည့် လ/နှစ်',
        visitedSeasonPlaceholder: 'ဥပမာ - နိုဝင်ဘာ ၂၀၂၆',
        headline: 'ခေါင်းစဉ်',
        headlinePlaceholder: 'အမှတ်ရဆုံးအချက်ကို အကျဉ်းချုပ်ရေးပါ...',
        story: 'သင့်အတွေ့အကြုံ',
        storyPlaceholder: 'မြင်တွေ့ခဲ့ရသည့် ရှုခင်း၊ ခံစားချက်နှင့် ခရီးစဉ်အတွေ့အကြုံကို မျှဝေပေးပါ...',
        goalTip: 'နောက်လာမည့်ခရီးသွားများ ရည်မှန်းချက်အောင်မြင်စေရန် အကြံပြုချက်',
        goalTipPlaceholder: 'သွားသင့်သည့်အချိန်၊ လမ်းခွဲ၊ ရှုခင်းအကောင်းဆုံးနေရာ သို့မဟုတ် ယူဆောင်သွားသင့်သည်များ...',
        submitBtn: 'အတွေ့အကြုံ တင်မည်',
        submittingBtn: 'သိမ်းဆည်းနေသည်...',
        missingFieldsError: 'အမည်၊ ခေါင်းစဉ်၊ အတွေ့အကြုံနှင့် အကြံပြုချက်တို့ကို ဖြည့်သွင်းပေးပါ။',
        serverError: 'ဆာဗာနှင့် ချိတ်ဆက်မရပါ။ ခဏနေမှ ထပ်မံကြိုးစားပါ။',
        successMessage: 'ကျေးဇူးတင်ပါသည် — သင့်အတွေ့အကြုံနှင့် အကြံပြုချက်ကို မျှဝေပြီးပါပြီ။',
      },
    },
    bookingStatus: {
      pending_verification: 'စိစစ်နေဆဲ',
      verified: 'အတည်ပြုပြီး',
      declined: 'မရရှိနိုင်ပါ',
      cancelled: 'ပယ်ဖျက်ပြီး',
    },
    footer: {
      about:
        'ကလောမြို့အတွက် ခရီးသွားလမ်းညွှန်၊ ဒေသခံဝန်ဆောင်မှုနှင့် အိမ်ခြံမြေ ပလက်ဖောင်း။',
      explore: 'စူးစမ်းရန်',
      services: 'ဝန်ဆောင်မှု',
      realEstate: 'အိမ်ခြံမြေ',
      contact: 'ဆက်သွယ်ရန်',
      copyright: 'Kalaw Travel · ရှမ်းကုန်းပြင်မြင့်',
      terms: 'စည်းကမ်းချက်',
      privacy: 'ကိုယ်ရေးလုံခြုံမှု',
      admin: 'စီမံခန့်ခွဲမှု',
    },
  },
};
