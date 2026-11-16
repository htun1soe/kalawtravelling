import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  fetchCatalog,
  loginAccount,
  registerAccount,
  toggleFavoriteRemote,
  updateUserProfile,
} from '../services/api';
import { TRANSLATIONS, type Language, type UIStrings } from '../i18n/translations';
import {
  localizeArticle,
  localizeDestination,
  localizeExperience,
  localizeProperty,
  localizeRental,
  localizeRestaurant,
  localizeStay,
} from '../i18n/catalogTranslations';
import type {
  Destination,
  Experience,
  JournalArticle,
  PropertyListing,
  Rental,
  Restaurant,
  Stay,
  TripPlanItem,
  UserAccount,
} from '../types/kalaw';

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
  catalogLoading: boolean;
  isOfflineFallback: boolean;
  tripPlan: TripPlanItem[];
  localFavorites: string[];
  refreshCatalog: () => Promise<void>;
  signIn: (email: string) => Promise<UserAccount>;
  register: (name: string, email: string, role: 'traveler' | 'owner') => Promise<UserAccount>;
  signOut: () => void;
  updateProfile: (updates: Partial<Pick<UserAccount, 'name' | 'location' | 'bio'>>) => Promise<void>;
  toggleFavorite: (itemId: string) => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  addToTripPlan: (item: Omit<TripPlanItem, 'id'>) => void;
  removeFromTripPlan: (id: string) => void;
  clearTripPlan: () => void;
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
  const [catalogLoading, setCatalogLoading] = useState(true);
  const [isOfflineFallback, setIsOfflineFallback] = useState(false);

  const refreshCatalog = useCallback(async () => {
    setCatalogLoading(true);
    try {
      const data = await fetchCatalog();
      setRawDestinations(data.destinations);
      setRawStays(data.stays);
      setRawExperiences(data.experiences);
      setRawRestaurants(data.restaurants);
      setRawRentals(data.rentals);
      setRawProperties(data.properties);
      setRawArticles(data.articles);
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
        // Fallback to updating local user object if session expired
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
        catalogLoading,
        isOfflineFallback,
        tripPlan,
        localFavorites,
        refreshCatalog,
        signIn,
        register,
        signOut,
        updateProfile,
        toggleFavorite,
        isFavorite,
        addToTripPlan,
        removeFromTripPlan,
        clearTripPlan,
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
