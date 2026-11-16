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
    },
    pages: {
      destAtlas: 'Kalaw Atlas',
      destTitle: 'Explore Destinations & Hidden Places',
      destDesc:
        'From sunrise monastery ridges and century-old railway quarters to pine forest trails and quiet tea escarpments across Kalaw.',
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
      inspectDossier: 'Inspect Dossier',
      addToTripPlan: 'Add to Trip Planner',
      addedToPlan: 'Added to Plan',
      resetFilters: 'Reset Filters',
      cancelRequest: 'Cancel Request',
      submitBooking: 'Submit Booking Request',
      submitting: 'Submitting Request...',
      noChargeNote: 'No charge yet. Requests are verified directly by Kalaw hosts.',
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
      explore: 'စူးစမ်းရန်',
      destinations: 'နေရာများ',
      stays: 'တည်းခိုရန်',
      experiences: 'ခရီးစဉ်များ',
      dining: 'စားသောက်ဆိုင်',
      rentals: 'ယာဉ်ငှားရမ်း',
      realEstate: 'အိမ်ခြံမြေ',
      journal: 'ခရီးသွားဂျာနယ်',
      planTrip: 'ခရီးစဉ်ဆွဲရန်',
      bookings: 'ဘွတ်ကင်များ',
      signIn: 'အကောင့်ဝင်ရန်',
      searchPlaceholder: 'ထင်းရှူးတောလမ်း၊ တည်းခိုခန်း၊ ရှမ်းခေါက်ဆွဲ၊ ဆိုင်ကယ် သို့မဟုတ် မြေကွက် ရှာဖွေပါ...',
      searchBtn: 'ရှာဖွေမည်',
    },
    hero: {
      eyebrow: 'ကလောမြို့ · ရှမ်းပြည်နယ် · ပင်လယ်ရေမျက်နှာပြင်အထက် ၁,၃၂၀ မီတာ',
      headline: 'ကလောမြို့ဆီသို့ ခရီးစတင်လိုက်ပါ။',
      subtitle:
        'နံနက်ခင်းမြူနှင်းများကြားမှ ထင်းရှူးတောင်တန်းများ၊ ရှေးဟောင်းကျွန်းသစ်အိမ် တည်းခိုခန်းများ၊ ဒေသခံရှမ်းစားဖွယ်ရာများနှင့် တောင်ပေါ်အိမ်ခြံမြေများကို တစ်နေရာတည်းတွင် ရှာဖွေလိုက်ပါ။',
      exploreCta: 'ကလောကို စူးစမ်းမည်',
      planCta: 'ခရီးစဉ် ရေးဆွဲမည်',
      destLabel: 'နေရာ သို့မဟုတ် ရပ်ကွက်',
      destPlaceholder: 'ထင်းရှူးတောင်တန်း၊ ဘူတာလမ်း၊ ရွာပု...',
      checkIn: 'ဝင်ရောက်မည့်ရက်',
      checkOut: 'ထွက်ခွာမည့်ရက်',
      guests: 'ဧည့်သည်',
      searchStays: 'တည်းခိုခန်း ရှာမည်',
      spotlights: {
        ridges: {
          label: 'ထင်းရှူးတောင်တန်း',
          title: 'နံနက်မြူနှင်းနှင့် ထင်းရှူးတောလမ်းများ',
          caption: 'သိမ်တောင်ကုန်းမှတစ်ဆင့် ဓနုနှင့် ပအိုဝ်းတောင်ပေါ်ရွာများဆီသို့ မြေနီခြေလျင်လမ်းအတိုင်း လျှောက်လှမ်းပါ။',
          meta: 'အမြင့် ၁,၃၈၅ မီတာ · ရှုခင်းသာနှင့် တောင်တက်ခရီး',
        },
        heritage: {
          label: '၁၉၁၄ ရှေးဟောင်းမြို့',
          title: 'ဘူတာရပ်ကွက်နှင့် ငါးရက်တစ်ဈေး',
          caption: 'ရာစုနှစ်ကျော် ကျောက်တုံးနှင့် ကျွန်းသစ်ဗိသုကာလက်ရာများ၊ နံနက်ခင်း တောင်ပေါ်ဈေးနေ့ကို လေ့လာပါ။',
          meta: '၁၉၁၄ ခုနှစ်တည် · ဘူတာလမ်းမကြီး',
        },
        lodges: {
          label: 'ကျွန်းသစ်တည်းခိုအိမ်',
          title: 'ကိုလိုနီခေတ် ဝရန်တာနှင့် ဆီဒါအိမ်လေးများ',
          caption: 'မီးလင်းဖိုနွေးနွေးနှင့် ၁၉၂၀ ခုနှစ်များက ကျွန်းသစ်တည်းခိုခန်းများတွင် အေးချမ်းစွာ အနားယူပါ။',
          meta: 'တစ်ညလျှင် $42 – $210 · အထူးရွေးချယ်ထားသော နေရာများ',
        },
        table: {
          label: 'ရှမ်းစားပွဲဝိုင်း',
          title: 'ရှမ်းခေါက်ဆွဲနှင့် တောင်ပေါ်လက်ဖက်ခင်း',
          caption: 'နံနက်ခင်း နနွင်းဆီချက် ရှမ်းခေါက်ဆွဲပူပူနှင့် အနောက်ဘက်တောင်ကြောမှ လက်ဖက်စိမ်းရနံ့ကို ခံစားပါ။',
          meta: 'တောင်ပေါ်အစားအစာ · ကော်ဖီဆိုင်နှင့် ချက်ပြုတ်မှုအတွေ့အကြုံ',
        },
      },
    },
    home: {
      discoverEyebrow: '၀၁. ကလောမြို့ကို လေ့လာရန်',
      discoverTitle: 'ထင်းရှူးတောများနှင့် တိတ်ဆိတ်သော တောင်ပေါ်ရွာလေးများ ဆုံစည်းရာ။',
      discoverBody:
        'တစ်ချိန်က အေးချမ်းသော မီးရထားတောင်ပေါ်စခန်းမြို့ဖြစ်ခဲ့သည့် ကလောသည် ထင်းရှူးပင်များ၊ မြေနီခြေလျင်လမ်းများနှင့် မိသားစုလက်ဖက်စိုက်ခင်းများဖြင့် လှပနေပါသည်။ နံနက်ခင်းတွင် တောင်ကြားမြူနှင်းများဖုံးလွှမ်းပြီး နေ့ခင်းတွင် ရှေးဟောင်းအုတ်အိမ်ဝရန်တာများပေါ်သို့ နေရောင်နွေးနွေး ကျရောက်နေတတ်ပါသည်။',
      discoverQuote:
        '“အထိမ်းအမှတ် အဆောက်အအုံများဖြင့် မတိုင်းတာဘဲ ထင်းရှူးလေနုအေး၊ ခြေလျင်လမ်းသွယ်လေးများနှင့် နံနက်ခင်း ရှမ်းခေါက်ဆွဲပူပူတစ်ပွဲဖြင့် တန်ဖိုးထားရသော မြို့လေး။”',
      statElevation: 'ပျမ်းမျှအမြင့်',
      statMarket: 'တောင်ပေါ်ဈေးနေ့',
      statTemp: 'ဆောင်းရာသီ အပူချိန်',
      fig1: 'ပုံ (၁) — မြင်းမထိ ထင်းရှူးတောလမ်းအတိုင်း ဆင်းသက်နေသော မြေနီလမ်းသွယ်။',
      fig2: 'ပုံ (၂) — သိမ်တောင်စေတီတော်များ နောက်ခံမှ နံနက်ခင်းမြူနှင်းများ။',
      placesEyebrow: '၀၂. လည်ပတ်စရာနေရာများ',
      placesTitle: 'ရှုခင်းသာများ၊ တောင်ကြောများနှင့် ယဉ်ကျေးမှုနေရာများ',
      viewAllDest: 'နေရာအားလုံး ကြည့်ရန်',
      readGuide: 'လမ်းညွှန်ဖတ်ရှုရန်',
      staysEyebrow: '၀၃. တည်းခိုရန်နေရာရှာဖွေပါ',
      staysTitle: 'ရှေးဟောင်းတည်းခိုအိမ်များ၊ တောင်ပေါ်အိမ်ငယ်များနှင့် Homestays',
      browseAllStays: 'တည်းခိုခန်းအားလုံး ကြည့်ရန်',
      perNight: '/ တစ်ည',
      viewDetails: 'အသေးစိတ်ကြည့်ရန်',
      expEyebrow: '၀၄. ဒေသခံအတွေ့အကြုံများ',
      expTitle: 'လမ်းညွှန်ပါ တောင်တက်ခရီးစဉ်နှင့် ယဉ်ကျေးမှုလေ့လာရေး',
      allExp: 'ခရီးစဉ်အားလုံး',
      perGuest: '/ တစ်ဦး',
      requestExp: 'ရက်စွဲတောင်းဆိုရန်',
      diningEyebrow: '၀၅. အစားအစာနှင့် စားသောက်ဆိုင်များ',
      diningTitle: 'ရှမ်းထမင်းဆိုင်များနှင့် တောင်ပေါ်ကော်ဖီဆိုင်များ',
      allDining: 'ဆိုင်အားလုံးကြည့်ရန်',
      viewMenuNotes: 'မီနူးမှတ်စုကြည့်ရန်',
      rentalsEyebrow: '၀၆. သယ်ယူပို့ဆောင်ရေးနှင့် ယာဉ်ငှားရမ်းခြင်း',
      rentalsTitle: 'ရှမ်းကုန်းပြင်မြင့်တစ်လျှောက် စိတ်ကြိုက်သွားလာပါ',
      exploreVehicles: 'ယာဉ်နှင့် ဒရိုင်ဘာများ ကြည့်ရန်',
      perDay: '/ တစ်ရက်',
      realEstateEyebrow: '၀၇. ကလော အိမ်ခြံမြေဈေးကွက်',
      realEstateTitle: 'အိမ်များ၊ တောင်ကြောမြေကွက်များနှင့် ရှေးဟောင်းနေအိမ်များ',
      listProperty: 'အိမ်ခြံမြေ တင်ရန်',
      viewMarketplace: 'ဈေးကွက်ကြည့်ရန်',
      perMonth: '/ တစ်လ',
      journalEyebrow: '၀၈. ကလော ခရီးသွားဂျာနယ်',
      journalTitle: 'ခရီးသွားမှတ်တမ်းများ၊ ရာသီအလိုက်လမ်းညွှန်နှင့် အစားအသောက်ဆောင်းပါးများ',
      readDispatches: 'ဆောင်းပါးအားလုံး ဖတ်ရန်',
    },
    categories: {
      All: 'အားလုံး',
      'Nature & Mountains': 'သဘာဝနှင့် တောင်တန်း',
      Viewpoints: 'ရှုခင်းသာများ',
      'Cultural Attractions': 'ယဉ်ကျေးမှုနေရာများ',
      'Pagodas & Religious Sites': 'ဘုရားစေတီနှင့် ကျောင်းတော်',
      'Hiking & Trekking': 'တောင်တက်ခြေလျင်',
      'Hidden Gems': 'လူသိနည်းသော နေရာကောင်း',
      Hotels: 'ဟိုတယ်များ',
      Guesthouses: 'တည်းခိုခန်းများ',
      Resorts: 'အပန်းဖြေစခန်း',
      Homestays: 'ဒေသခံအိမ်တည်းခို',
      'Private Houses': 'သီးသန့်အိမ်လုံးချင်း',
      'Guided Trekking': 'လမ်းညွှန်တောင်တက်',
      'Cultural Immersion': 'ယဉ်ကျေးမှု ထိတွေ့မှု',
      'Photography Tours': 'ဓာတ်ပုံခရီးစဉ်',
      'Nature Exploration': 'သဘာဝစူးစမ်းရေး',
      'Culinary Workshops': 'ချက်ပြုတ်သင်တန်း',
      'Motorbike Rentals': 'ဆိုင်ကယ်ငှားရမ်း',
      'Car Rentals': 'ကားငှားရမ်း',
      'Private Drivers': 'သီးသန့်ဒရိုင်ဘာ',
      'Local Transfers': 'လေဆိပ်/ခရီးတို ပို့ဆောင်',
      'Houses for Sale': 'ရောင်းရန်အိမ်များ',
      'Houses for Rent': 'ငှားရန်အိမ်များ',
      'Land for Sale': 'ရောင်းရန်မြေကွက်',
      'Commercial Properties': 'စီးပွားရေးလုပ်ငန်းသုံး',
    },
    pages: {
      destAtlas: 'ကလော မြေပုံစာအုပ်',
      destTitle: 'လည်ပတ်စရာနေရာများနှင့် လျှို့ဝှက်အလှတရားများ',
      destDesc:
        'နံနက်ခင်း ဘုန်းကြီးကျောင်းတောင်ကုန်းများ၊ ရာစုနှစ်ကျော် ဘူတာရပ်ကွက်မှသည် ထင်းရှူးတောလမ်းနှင့် လက်ဖက်တောင်ကုန်းများအထိ စူးစမ်းလေ့လာပါ။',
      staysEyebrow: 'ကလော တည်းခိုခန်းများ',
      staysTitle: 'ထင်းရှူးတောကြားမှ တည်းခိုရန်နေရာများ',
      staysDesc:
        'ပြန်လည်ပြုပြင်ထားသော ကိုလိုနီအိမ်ကြီးများ၊ တောင်ကြောကျောက်အိမ်များ၊ မြို့တွင်းတည်းခိုခန်းများနှင့် ကျေးရွာအိမ်တည်းခိုမှုများ။',
      expEyebrow: 'ဒေသခံဝန်ဆောင်မှုများ',
      expTitle: 'တောင်တက်ခရီးစဉ်များနှင့် ဒေသခံအတွေ့အကြုံများ',
      expDesc:
        'လိုင်စင်ရ ဒေသခံလမ်းညွှန်များနှင့်အတူ တောင်ပေါ်ခြေလျင်ခရီး، နံနက်ခင်းဓာတ်ပုံလမ်းလျှောက်ခြင်းနှင့် ရှမ်းအစားအစာချက်ပြုတ်ခြင်းများ။',
      diningEyebrow: 'ကလော စားသောက်ဖွယ်ရာ',
      diningTitle: 'စားသောက်ဆိုင်များ၊ ကော်ဖီဆိုင်နှင့် လက်ဖက်ရည်ဆိုင်များ',
      diningDesc:
        'နံနက်ခင်း ရှမ်းခေါက်ဆွဲပူပူ၊ ဂေါ်ရခါးဟင်းပွဲများမှသည် ရွာငံတောင်ပေါ်ကော်ဖီဆိုင်များအထိ။',
      rentalsEyebrow: 'သွားလာရေး ဝန်ဆောင်မှု',
      rentalsTitle: 'ယာဉ်ငှားရမ်းခြင်း၊ ဆိုင်ကယ်နှင့် သီးသန့်ဒရိုင်ဘာများ',
      rentalsDesc:
        'ပင်းတယလိုဏ်ဂူ၊ ရှုခင်းသာတောင်ကြောများသို့ သွားလာရန်နှင့် ဟဲဟိုးလေဆိပ်/အင်းလေးကန် အကြိုအပို့များ စီစဉ်နိုင်ပါသည်။',
      reEyebrow: 'တောင်ပေါ် အိမ်ခြံမြေဈေးကွက်',
      reTitle: 'ကလောမြို့ အိမ်များ၊ မြေကွက်များနှင့် ခြံဝင်းကျယ်များ',
      reDesc:
        'ဒေသခံအကျိုးဆောင်များနှင့် စိစစ်ထားသော လူနေအိမ်များ၊ ရေရှည်အငှားအိမ်များ၊ ထင်းရှူးတောင်ကြောမြေကွက်များနှင့် ဟိုတယ်နေရာများ။',
      journalEyebrow: 'ကလော ခရီးသွားဂျာနယ်',
      journalTitle: 'ခရီးသွားလမ်းညွှန်များ၊ ဆောင်းပါးများနှင့် မှတ်စုများ',
      journalDesc:
        'ကလောဈေးလမ်းများ၊ ထင်းရှူးတောင်ကြောများနှင့် တောင်ပေါ်မီးဖိုချောင်များမှ ရေးသားထားသော ခရီးသွားမှတ်တမ်းများ။',
      exploreEyebrow: 'စုစည်းရှာဖွေရန်',
      exploreTitle: 'ကလောရှိ အရာအားလုံးကို ရှာဖွေပါ',
      tripEyebrow: 'ခရီးစဉ် စီစဉ်သူ',
      tripTitle: 'သင်၏ ကလောခရီးစဉ်ကို ရေးဆွဲပါ',
      tripDesc:
        'ရှုခင်းသာများ၊ နံနက်ခင်းလက်ဖက်ရည်ဆိုင်များ၊ တည်းခိုခန်းနှင့် တောင်တက်ခရီးစဉ်များကို နေ့ရက်အလိုက် စုစည်းပါ။',
      bookingsEyebrow: 'ဘွတ်ကင်ဝန်ဆောင်မှု',
      bookingsTitle: 'သင်၏ ဘွတ်ကင်တောင်းဆိုမှုများ',
      bookingsDesc:
        'တောင်းဆိုမှုအားလုံးကို အတည်မပြုမီ ကလောဒေသခံ တည်းခိုခန်းပိုင်ရှင်များနှင့် လမ်းညွှန်များထံ တိုက်ရိုက်စိစစ်အတည်ပြုပေးပါသည်။',
    },
    actions: {
      save: 'သိမ်းဆည်းမည်',
      saved: 'သိမ်းဆည်းပြီး',
      requestDate: 'ရက်စွဲတောင်းဆိုရန်',
      requestTable: 'စားပွဲကြိုတင်မှာယူရန်',
      requestVehicle: 'ယာဉ်ငှားရမ်းရန်',
      inspectDossier: 'အသေးစိတ်ဖတ်ရန်',
      addToTripPlan: 'ခရီးစဉ်ထဲ ထည့်မည်',
      addedToPlan: 'ခရီးစဉ်ထဲ ထည့်ပြီး',
      resetFilters: 'စစ်ထုတ်မှု ပြန်စမည်',
      cancelRequest: 'တောင်းဆိုမှု ပယ်ဖျက်မည်',
      submitBooking: 'ဘွတ်ကင်တောင်းဆိုမှု ပေးပို့မည်',
      submitting: 'ပေးပို့နေသည်...',
      noChargeNote: 'ငွေကြိုတင်ပေးချေရန် မလိုသေးပါ။ ဒေသခံအိမ်ရှင်မှ ရရှိနိုင်မှုကို စိစစ်အတည်ပြုပေးပါမည်။',
    },
    bookingStatus: {
      pending_verification: 'အိမ်ရှင် စိစစ်အတည်ပြုနေဆဲ',
      verified: 'အတည်ပြုပြီး',
      declined: 'မရရှိနိုင်ပါ / ငြင်းပယ်ပြီး',
      cancelled: 'ခရီးသွားမှ ပယ်ဖျက်ပြီး',
    },
    footer: {
      about:
        'မြန်မာနိုင်ငံ၊ ရှမ်းပြည်နယ်၊ ကလောမြို့ကို အခြေပြု၍ ခရီးသွားလမ်းညွှန်، ဒေသခံဝန်ဆောင်မှုနှင့် အိမ်ခြံမြေဈေးကွက်ကို ပေါင်းစည်းပေးထားသော ပလက်ဖောင်း။',
      explore: 'စူးစမ်းရန်',
      services: 'ဝန်ဆောင်မှုများ',
      realEstate: 'အိမ်ခြံမြေ',
      contact: 'ဆက်သွယ်ရန်',
      copyright: 'Kalaw Travel — ရှမ်းကုန်းပြင်မြင့်မှ ဖန်တီးတင်ဆက်သည်။',
      terms: 'စည်းကမ်းချက်များ',
      privacy: 'ကိုယ်ရေးလုံခြုံမှု',
      admin: 'စီမံခန့်ခွဲမှုစနစ်',
    },
  },
};
