import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchCatalog,
  fetchReviews,
  loginAccount,
  markReviewHelpful,
  registerAccount,
  submitPlaceReview,
  toggleFavoriteRemote,
  updateUserProfile,
} from '../services/api';
import { INITIAL_REVIEWS, localizeReview } from '../data/kalawReviews';
import { TRANSLATIONS, type Language, type UIStrings } from '../i18n/translations';
import {
  localizeArticle,
  localizeDestination,
  localizeExperience,
  localizeModalItem,
  localizeProperty,
  localizeRental,
  localizeRestaurant,
  localizeStay,
} from '../i18n/catalogTranslations';
import type {
  Destination,
  Experience,
  JournalArticle,
  MediaItem,
  ModalItem,
  PlaceReview,
  PropertyListing,
  Rental,
  Restaurant,
  Stay,
  TravelGoalTag,
  TripPlanItem,
  UserAccount,
} from '../types/kalaw';

export interface GalleryState {
  title: string;
  subtitle?: string;
  media: MediaItem[];
  initialIndex: number;
  item?: ModalItem;
}

export type TravelModeKey = 'WALKING' | 'TWO_WHEELER' | 'DRIVING';

export interface ActiveTripNav {
  destinationId: string;
  originId: string;
  travelMode: TravelModeKey;
  distanceText: string;
  durationText: string;
  currentInstruction: string;
  stepIdx: number;
  totalSteps: number;
}

interface AppContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: UIStrings;
  user: UserAccount | null;
  destinations: Destination[];
  stays: Stay[];
  experiences: Experience[];
  restaurants: Restaurant[];
  rentals: Rental[];
  properties: PropertyListing[];
  articles: JournalArticle[];
  reviews: PlaceReview[];
  catalogLoading: boolean;
  isOfflineFallback: boolean;
  tripPlan: TripPlanItem[];
  localFavorites: string[];
  refreshCatalog: () => Promise<void>;
  addPlaceReview: (payload: {
    placeId: string;
    placeKind: PlaceReview['placeKind'];
    placeName: string;
    goal: TravelGoalTag;
    authorName: string;
    authorOrigin: string;
    visitedSeason: string;
    rating: number;
    headline: string;
    story: string;
    goalTip: string;
  }) => Promise<PlaceReview>;
  markHelpfulReview: (reviewId: string) => Promise<void>;
  signIn: (email: string) => Promise<UserAccount>;
  register: (name: string, email: string, role: 'traveler' | 'owner') => Promise<UserAccount>;
  signOut: () => void;
  updateProfile: (updates: Partial<Pick<UserAccount, 'name' | 'location' | 'bio'>>) => Promise<void>;
  toggleFavorite: (itemId: string) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  addToTripPlan: (item: Omit<TripPlanItem, 'id'>) => void;
  removeFromTripPlan: (id: string) => void;
  clearTripPlan: () => void;
  activeModal: ModalItem | null;
  openItemModal: (item: ModalItem) => void;
  closeItemModal: () => void;
  galleryState: GalleryState | null;
  openGallery: (
    title: string,
    media: MediaItem[],
    initialIndex?: number,
    subtitle?: string,
    item?: ModalItem
  ) => void;
  closeGallery: () => void;
  activeTripNav: ActiveTripNav | null;
  isLiveNavOpen: boolean;
  startVisitNavigation: (
    destinationId: string,
    options?: { originId?: string; travelMode?: TravelModeKey }
  ) => void;
  updateActiveTripNav: (patch: Partial<ActiveTripNav>) => void;
  openLiveNav: () => void;
  minimizeLiveNav: () => void;
  stopVisitNavigation: () => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const DEFAULT_TRIP_PLAN: TripPlanItem[] = [
  {
    id: 'tp-1',
    day: 1,
    type: 'destination',
    itemId: 'dest-1',
    title: 'Thein Taung Monastery Ridge',
    location: 'North Ridge, Kalaw',
    timeSlot: '06:00 Dawn',
  },
  {
    id: 'tp-2',
    day: 1,
    type: 'restaurant',
    itemId: 'rest-1',
    title: 'Shan Hearth & Morning Teahouse',
    location: 'Union Highway',
    timeSlot: '08:30 Breakfast',
  },
  {
    id: 'tp-3',
    day: 2,
    type: 'experience',
    itemId: 'exp-1',
    title: 'Three-Day Kalaw to Inle Ridge Trek',
    location: 'Kalaw to Inle Watershed',
    timeSlot: '07:30 Departure',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('kalaw_lang');
      return saved === 'my' ? 'my' : 'en';
    } catch {
      return 'en';
    }
  });

  const setLang = useCallback((nextLang: Language) => {
    setLangState(nextLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'en' ? 'my' : 'en'));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('kalaw_lang', lang);
    } catch {
      // ignore storage failure
    }
    document.documentElement.lang = lang;
  }, [lang]);

  const t = TRANSLATIONS[lang];

  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('kalaw_user');
      return saved ? (JSON.parse(saved) as UserAccount) : null;
    } catch {
      return null;
    }
  });

  const [localFavorites, setLocalFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kalaw_local_favorites');
      return saved ? (JSON.parse(saved) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [tripPlan, setTripPlan] = useState<TripPlanItem[]>(() => {
    try {
      const saved = localStorage.getItem('kalaw_trip_plan');
      return saved ? (JSON.parse(saved) as TripPlanItem[]) : DEFAULT_TRIP_PLAN;
    } catch {
      return DEFAULT_TRIP_PLAN;
    }
  });

  const [rawDestinations, setRawDestinations] = useState<Destination[]>([]);
  const [rawStays, setRawStays] = useState<Stay[]>([]);
  const [rawExperiences, setRawExperiences] = useState<Experience[]>([]);
  const [rawRestaurants, setRawRestaurants] = useState<Restaurant[]>([]);
  const [rawRentals, setRawRentals] = useState<Rental[]>([]);
  const [rawProperties, setRawProperties] = useState<PropertyListing[]>([]);
  const [rawArticles, setRawArticles] = useState<JournalArticle[]>([]);
  const [rawReviews, setRawReviews] = useState<PlaceReview[]>(INITIAL_REVIEWS);
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  const refreshCatalog = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const [data, fetchedReviews] = await Promise.all([fetchCatalog(), fetchReviews()]);
      setRawDestinations(data.destinations);
      setRawStays(data.stays);
      setRawExperiences(data.experiences);
      setRawRestaurants(data.restaurants);
      setRawRentals(data.rentals);
      setRawProperties(data.properties);
      setRawArticles(data.articles);
      setRawReviews(fetchedReviews);
      setIsOfflineFallback(Boolean(data.isOfflineFallback));
    } finally {
      setCatalogLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCatalog();
  }, [refreshCatalog]);

  const destinations = useMemo(
    () => rawDestinations.map((item) => localizeDestination(item, lang)),
    [rawDestinations, lang]
  );
  const stays = useMemo(
    () => rawStays.map((item) => localizeStay(item, lang)),
    [rawStays, lang]
  );
  const experiences = useMemo(
    () => rawExperiences.map((item) => localizeExperience(item, lang)),
    [rawExperiences, lang]
  );
  const restaurants = useMemo(
    () => rawRestaurants.map((item) => localizeRestaurant(item, lang)),
    [rawRestaurants, lang]
  );
  const rentals = useMemo(
    () => rawRentals.map((item) => localizeRental(item, lang)),
    [rawRentals, lang]
  );
  const properties = useMemo(
    () => rawProperties.map((item) => localizeProperty(item, lang)),
    [rawProperties, lang]
  );
  const articles = useMemo(
    () => rawArticles.map((item) => localizeArticle(item, lang)),
    [rawArticles, lang]
  );
  const reviews = useMemo(
    () => rawReviews.map((rev) => localizeReview(rev, lang)),
    [rawReviews, lang]
  );

  const addPlaceReview = useCallback(
    async (payload: {
      placeId: string;
      placeKind: PlaceReview['placeKind'];
      placeName: string;
      goal: TravelGoalTag;
      authorName: string;
      authorOrigin: string;
      visitedSeason: string;
      rating: number;
      headline: string;
      story: string;
      goalTip: string;
    }) => {
      const created = await submitPlaceReview(payload);
      setRawReviews((prev) => [created, ...prev]);
      return created;
    },
    []
  );

  const markHelpfulReview = useCallback(async (reviewId: string) => {
    const updated = await markReviewHelpful(reviewId);
    setRawReviews((prev) => prev.map((r) => (r.id === reviewId ? updated : r)));
  }, []);

  useEffect(() => {
    localStorage.setItem('kalaw_trip_plan', JSON.stringify(tripPlan));
  }, [tripPlan]);

  useEffect(() => {
    localStorage.setItem('kalaw_local_favorites', JSON.stringify(localFavorites));
  }, [localFavorites]);

  const signIn = async (email: string) => {
    const res = await loginAccount(email);
    setUser(res.user);
    localStorage.setItem('kalaw_user', JSON.stringify(res.user));
    localStorage.setItem('kalaw_token', res.token);
    return res.user;
  };

  const register = async (name: string, email: string, role: 'traveler' | 'owner') => {
    const res = await registerAccount({ name, email, role });
    setUser(res.user);
    localStorage.setItem('kalaw_user', JSON.stringify(res.user));
    localStorage.setItem('kalaw_token', res.token);
    return res.user;
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('kalaw_user');
    localStorage.removeItem('kalaw_token');
  };

  const updateProfile = async (updates: Partial<Pick<UserAccount, 'name' | 'location' | 'bio'>>) => {
    if (!user) return;
    const updated = await updateUserProfile(user.id, updates);
    setUser(updated);
    localStorage.setItem('kalaw_user', JSON.stringify(updated));
  };

  const toggleFavorite = async (itemId: string) => {
    if (user) {
      try {
        const updated = await toggleFavoriteRemote(user.id, itemId);
        setUser(updated);
        localStorage.setItem('kalaw_user', JSON.stringify(updated));
        return;
      } catch {
        const nextFavs = user.favorites.includes(itemId)
          ? user.favorites.filter((id) => id !== itemId)
          : [...user.favorites, itemId];
        const nextUser = { ...user, favorites: nextFavs };
        setUser(nextUser);
        localStorage.setItem('kalaw_user', JSON.stringify(nextUser));
        return;
      }
    }
    setLocalFavorites((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    );
  };

  const isFavorite = (itemId: string) => {
    if (user) return user.favorites.includes(itemId);
    return localFavorites.includes(itemId);
  };

  const addToTripPlan = (item: Omit<TripPlanItem, 'id'>) => {
    setTripPlan((prev) => [...prev, { ...item, id: `tp-${Date.now()}` }]);
  };

  const removeFromTripPlan = (id: string) => {
    setTripPlan((prev) => prev.filter((item) => item.id !== id));
  };

  const clearTripPlan = () => {
    setTripPlan([]);
  };

  const [rawActiveModal, setRawActiveModal] = useState<ModalItem | null>(null);
  const [rawGalleryState, setRawGalleryState] = useState<GalleryState | null>(null);
  const [activeTripNav, setActiveTripNav] = useState<ActiveTripNav | null>(null);
  const [isLiveNavOpen, setIsLiveNavOpen] = useState(false);

  const startVisitNavigation = useCallback(
    (destinationId: string, options?: { originId?: string; travelMode?: TravelModeKey }) => {
      setRawActiveModal(null);
      setRawGalleryState(null);
      setActiveTripNav((prev) => ({
        destinationId,
        originId: options?.originId || prev?.originId || 'hub-clock-tower',
        travelMode: options?.travelMode || prev?.travelMode || 'DRIVING',
        distanceText: '...',
        durationText: '...',
        currentInstruction: '',
        stepIdx: 0,
        totalSteps: 0,
      }));
      setIsLiveNavOpen(true);
    },
    []
  );

  const updateActiveTripNav = useCallback((patch: Partial<ActiveTripNav>) => {
    setActiveTripNav((prev) => (prev ? { ...prev, ...patch } : prev));
  }, []);

  const openLiveNav = useCallback(() => {
    setIsLiveNavOpen(true);
  }, []);

  const minimizeLiveNav = useCallback(() => {
    setIsLiveNavOpen(false);
  }, []);

  const stopVisitNavigation = useCallback(() => {
    setIsLiveNavOpen(false);
    setActiveTripNav(null);
  }, []);

  const activeModal = useMemo<ModalItem | null>(() => {
    if (!rawActiveModal) return null;
    switch (rawActiveModal.kind) {
      case 'destination': {
        const found = destinations.find((d) => d.id === rawActiveModal.data.id);
        return found ? { kind: 'destination', data: found } : localizeModalItem(rawActiveModal, lang);
      }
      case 'stay': {
        const found = stays.find((s) => s.id === rawActiveModal.data.id);
        return found ? { kind: 'stay', data: found } : localizeModalItem(rawActiveModal, lang);
      }
      case 'experience': {
        const found = experiences.find((e) => e.id === rawActiveModal.data.id);
        return found ? { kind: 'experience', data: found } : localizeModalItem(rawActiveModal, lang);
      }
      case 'restaurant': {
        const found = restaurants.find((r) => r.id === rawActiveModal.data.id);
        return found ? { kind: 'restaurant', data: found } : localizeModalItem(rawActiveModal, lang);
      }
      case 'rental': {
        const found = rentals.find((r) => r.id === rawActiveModal.data.id);
        return found ? { kind: 'rental', data: found } : localizeModalItem(rawActiveModal, lang);
      }
      case 'property': {
        const found = properties.find((p) => p.id === rawActiveModal.data.id);
        return found ? { kind: 'property', data: found } : localizeModalItem(rawActiveModal, lang);
      }
      case 'article': {
        const found = articles.find((a) => a.id === rawActiveModal.data.id);
        return found ? { kind: 'article', data: found } : localizeModalItem(rawActiveModal, lang);
      }
    }
  }, [rawActiveModal, destinations, stays, experiences, restaurants, rentals, properties, articles, lang]);

  const openItemModal = useCallback((item: ModalItem) => {
    setRawGalleryState(null);
    setRawActiveModal(item);
  }, []);

  const closeItemModal = useCallback(() => {
    setRawActiveModal(null);
  }, []);

  const galleryState = useMemo<GalleryState | null>(() => {
    if (!rawGalleryState) return null;
    if (!rawGalleryState.item) return rawGalleryState;
    const item = rawGalleryState.item;
    let localizedTitle = rawGalleryState.title;
    let localizedMedia = rawGalleryState.media;
    if (item.kind === 'destination') {
      const found = destinations.find((d) => d.id === item.data.id);
      if (found) {
        localizedTitle = found.name;
        localizedMedia = found.media || localizedMedia;
      }
    } else if (item.kind === 'stay') {
      const found = stays.find((s) => s.id === item.data.id);
      if (found) {
        localizedTitle = found.name;
        localizedMedia = found.media || localizedMedia;
      }
    } else if (item.kind === 'experience') {
      const found = experiences.find((e) => e.id === item.data.id);
      if (found) {
        localizedTitle = found.title;
        localizedMedia = found.media || localizedMedia;
      }
    } else if (item.kind === 'restaurant') {
      const found = restaurants.find((r) => r.id === item.data.id);
      if (found) {
        localizedTitle = found.name;
        localizedMedia = found.media || localizedMedia;
      }
    } else if (item.kind === 'rental') {
      const found = rentals.find((r) => r.id === item.data.id);
      if (found) {
        localizedTitle = found.name;
        localizedMedia = found.media || localizedMedia;
      }
    } else if (item.kind === 'property') {
      const found = properties.find((p) => p.id === item.data.id);
      if (found) {
        localizedTitle = found.title;
        localizedMedia = found.media || localizedMedia;
      }
    } else if (item.kind === 'article') {
      const found = articles.find((a) => a.id === item.data.id);
      if (found) {
        localizedTitle = found.title;
        localizedMedia = found.media || localizedMedia;
      }
    }
    return {
      ...rawGalleryState,
      title: localizedTitle,
      media: localizedMedia,
      item: localizeModalItem(item, lang),
    };
  }, [rawGalleryState, destinations, stays, experiences, restaurants, rentals, properties, articles, lang]);

  const openGallery = useCallback(
    (
      title: string,
      media: MediaItem[],
      initialIndex = 0,
      subtitle?: string,
      item?: ModalItem
    ) => {
      setRawGalleryState({ title, media, initialIndex, subtitle, item });
    },
    []
  );

  const closeGallery = useCallback(() => {
    setRawGalleryState(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        t,
        user,
        destinations,
        stays,
        experiences,
        restaurants,
        rentals,
        properties,
        articles,
        reviews,
        catalogLoading,
        isOfflineFallback,
        tripPlan,
        localFavorites,
        refreshCatalog,
        addPlaceReview,
        markHelpfulReview,
        signIn,
        register,
        signOut,
        updateProfile,
        toggleFavorite,
        isFavorite,
        addToTripPlan,
        removeFromTripPlan,
        clearTripPlan,
        activeModal,
        openItemModal,
        closeItemModal,
        galleryState,
        openGallery,
        closeGallery,
        activeTripNav,
        isLiveNavOpen,
        startVisitNavigation,
        updateActiveTripNav,
        openLiveNav,
        minimizeLiveNav,
        stopVisitNavigation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
