import {
  INITIAL_ARTICLES,
  INITIAL_DESTINATIONS,
  INITIAL_EXPERIENCES,
  INITIAL_PROPERTIES,
  INITIAL_RENTALS,
  INITIAL_RESTAURANTS,
  INITIAL_STAYS,
} from '../data/kalawData';
import type {
  AuthResponse,
  BookingRequest,
  BookingStatus,
  Destination,
  Experience,
  JournalArticle,
  PropertyListing,
  Rental,
  Restaurant,
  Stay,
  UserAccount,
} from '../types/kalaw';

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || '/api';

async function requestJson<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('kalaw_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try {
      const errBody = (await response.json()) as { error?: string; message?: string };
      message = errBody.error || errBody.message || message;
    } catch {
      // ignore json parse error
    }
    throw new Error(message);
  }

  return (await response.json()) as T;
}

export interface CatalogData {
  destinations: Destination[];
  stays: Stay[];
  experiences: Experience[];
  restaurants: Restaurant[];
  rentals: Rental[];
  properties: PropertyListing[];
  articles: JournalArticle[];
  isOfflineFallback?: boolean;
}

export async function fetchCatalog(): Promise<CatalogData> {
  try {
    const data = await requestJson<CatalogData>('/catalog');
    return { ...data, isOfflineFallback: false };
  } catch {
    return {
      destinations: INITIAL_DESTINATIONS,
      stays: INITIAL_STAYS,
      experiences: INITIAL_EXPERIENCES,
      restaurants: INITIAL_RESTAURANTS,
      rentals: INITIAL_RENTALS,
      properties: INITIAL_PROPERTIES,
      articles: INITIAL_ARTICLES,
      isOfflineFallback: true,
    };
  }
}

export async function fetchDestinations(): Promise<Destination[]> {
  try {
    return await requestJson<Destination[]>('/destinations');
  } catch {
    return INITIAL_DESTINATIONS;
  }
}

export async function fetchStays(): Promise<Stay[]> {
  try {
    return await requestJson<Stay[]>('/stays');
  } catch {
    return INITIAL_STAYS;
  }
}

export async function fetchExperiences(): Promise<Experience[]> {
  try {
    return await requestJson<Experience[]>('/experiences');
  } catch {
    return INITIAL_EXPERIENCES;
  }
}

export async function fetchRestaurants(): Promise<Restaurant[]> {
  try {
    return await requestJson<Restaurant[]>('/restaurants');
  } catch {
    return INITIAL_RESTAURANTS;
  }
}

export async function fetchRentals(): Promise<Rental[]> {
  try {
    return await requestJson<Rental[]>('/rentals');
  } catch {
    return INITIAL_RENTALS;
  }
}

export async function fetchProperties(): Promise<PropertyListing[]> {
  try {
    return await requestJson<PropertyListing[]>('/properties');
  } catch {
    return INITIAL_PROPERTIES;
  }
}

export async function fetchArticles(): Promise<JournalArticle[]> {
  try {
    return await requestJson<JournalArticle[]>('/articles');
  } catch {
    return INITIAL_ARTICLES;
  }
}

// Write operations (never fabricate success on network failure)
export async function submitBookingRequest(payload: {
  userId: string;
  userName: string;
  userEmail: string;
  itemType: BookingRequest['itemType'];
  itemId: string;
  itemTitle: string;
  checkIn: string;
  checkOut?: string;
  guests: number;
  totalEstimate: number;
  notes?: string;
}): Promise<BookingRequest> {
  return requestJson<BookingRequest>('/bookings', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function fetchBookings(userId?: string): Promise<BookingRequest[]> {
  const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  return requestJson<BookingRequest[]>(`/bookings${qs}`);
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<BookingRequest> {
  return requestJson<BookingRequest>(`/bookings/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function loginAccount(email: string): Promise<AuthResponse> {
  return requestJson<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function registerAccount(payload: {
  name: string;
  email: string;
  role: 'traveler' | 'owner';
}): Promise<AuthResponse> {
  return requestJson<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function toggleFavoriteRemote(userId: string, itemId: string): Promise<UserAccount> {
  return requestJson<UserAccount>(`/users/${userId}/favorites`, {
    method: 'POST',
    body: JSON.stringify({ itemId }),
  });
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserAccount, 'name' | 'location' | 'bio'>>
): Promise<UserAccount> {
  return requestJson<UserAccount>(`/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

export async function createPropertyListing(payload: Partial<PropertyListing>): Promise<PropertyListing> {
  return requestJson<PropertyListing>('/properties', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createDestination(payload: Partial<Destination>): Promise<Destination> {
  return requestJson<Destination>('/destinations', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createStay(payload: Partial<Stay>): Promise<Stay> {
  return requestJson<Stay>('/stays', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createExperience(payload: Partial<Experience>): Promise<Experience> {
  return requestJson<Experience>('/experiences', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createRestaurant(payload: Partial<Restaurant>): Promise<Restaurant> {
  return requestJson<Restaurant>('/restaurants', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createRental(payload: Partial<Rental>): Promise<Rental> {
  return requestJson<Rental>('/rentals', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createArticle(payload: Partial<JournalArticle>): Promise<JournalArticle> {
  return requestJson<JournalArticle>('/articles', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function deleteCatalogItem(
  resource: 'destinations' | 'stays' | 'experiences' | 'restaurants' | 'rentals' | 'properties' | 'articles',
  id: string
): Promise<void> {
  await requestJson<{ deleted: boolean }>(`/${resource}/${id}`, { method: 'DELETE' });
}

export async function fetchUsers(): Promise<UserAccount[]> {
  return requestJson<UserAccount[]>('/users');
}
