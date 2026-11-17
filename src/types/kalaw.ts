export type DestinationCategory =
  | 'Nature & Mountains'
  | 'Viewpoints'
  | 'Cultural Attractions'
  | 'Pagodas & Religious Sites'
  | 'Hiking & Trekking'
  | 'Hidden Gems';

export type StayCategory =
  | 'Hotels'
  | 'Guesthouses'
  | 'Resorts'
  | 'Homestays'
  | 'Private Houses';

export type ExperienceCategory =
  | 'Guided Trekking'
  | 'Cultural Immersion'
  | 'Photography Tours'
  | 'Nature Exploration'
  | 'Culinary Workshops';

export type RentalCategory =
  | 'Motorbike Rentals'
  | 'Car Rentals'
  | 'Private Drivers'
  | 'Local Transfers';

export type PropertyCategory =
  | 'Houses for Sale'
  | 'Houses for Rent'
  | 'Land for Sale'
  | 'Commercial Properties';

export type BookingStatus = 'pending_verification' | 'verified' | 'declined' | 'cancelled';

export interface MediaItem {
  type: 'image' | 'video';
  src: string;
  poster?: string;
  caption?: string;
}

export interface Destination {
  id: string;
  slug: string;
  name: string;
  category: DestinationCategory;
  location: string;
  elevation: string;
  bestTime: string;
  duration: string;
  coordinates: string;
  shortDescription: string;
  editorialOverview: string;
  highlights: string[];
  image: string;
  media?: MediaItem[];
  featured: boolean;
}

export interface Stay {
  id: string;
  slug: string;
  name: string;
  category: StayCategory;
  location: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  bedrooms: number;
  shortDescription: string;
  description: string;
  amenities: string[];
  availableFrom: string;
  availableTo: string;
  images: string[];
  media?: MediaItem[];
  featured: boolean;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  category: ExperienceCategory;
  location: string;
  duration: string;
  pricePerGuest: number;
  maxGroupSize: number;
  difficulty: 'Gentle' | 'Moderate' | 'Challenging';
  guideName: string;
  shortDescription: string;
  included: string[];
  image: string;
  media?: MediaItem[];
  featured: boolean;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  cuisine: string;
  location: string;
  priceRange: '$' | '$$' | '$$$';
  openingHours: string;
  signatureDishes: string[];
  shortDescription: string;
  description: string;
  image: string;
  media?: MediaItem[];
  featured: boolean;
}

export interface Rental {
  id: string;
  slug: string;
  name: string;
  category: RentalCategory;
  location: string;
  pricePerDay: number;
  transmissionOrService: string;
  capacity: string;
  includesDriver: boolean;
  shortDescription: string;
  terms: string[];
  image: string;
  media?: MediaItem[];
  available: boolean;
}

export interface PropertyListing {
  id: string;
  slug: string;
  title: string;
  category: PropertyCategory;
  location: string;
  price: number;
  priceUnit: 'total' | 'per month';
  areaSize: string;
  bedrooms?: number;
  bathrooms?: number;
  titleStatus: string;
  agentName: string;
  agentContact: string;
  shortDescription: string;
  description: string;
  features: string[];
  images: string[];
  media?: MediaItem[];
  featured: boolean;
  status: 'Active' | 'Under Review' | 'Reserved';
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  media?: MediaItem[];
  excerpt: string;
  paragraphs: string[];
  marginNote: string;
  pullQuote: string;
}

export type ModalItem =
  | { kind: 'destination'; data: Destination }
  | { kind: 'stay'; data: Stay }
  | { kind: 'experience'; data: Experience }
  | { kind: 'restaurant'; data: Restaurant }
  | { kind: 'rental'; data: Rental }
  | { kind: 'property'; data: PropertyListing }
  | { kind: 'article'; data: JournalArticle };

export interface BookingRequest {
  id: string;
  referenceCode: string;
  userId: string;
  userName: string;
  userEmail: string;
  itemType: 'stay' | 'experience' | 'rental' | 'restaurant' | 'property';
  itemId: string;
  itemTitle: string;
  checkIn: string;
  checkOut?: string;
  guests: number;
  totalEstimate: number;
  notes?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'traveler' | 'owner' | 'admin';
  location: string;
  bio: string;
  favorites: string[];
}

export interface TripPlanItem {
  id: string;
  day: number;
  type: 'destination' | 'stay' | 'experience' | 'restaurant' | 'rental';
  itemId: string;
  title: string;
  location: string;
  timeSlot: string;
}

export interface AuthResponse {
  user: UserAccount;
  token: string;
}

export type TravelGoalTag =
  | 'sunrise'
  | 'trekking'
  | 'heritage'
  | 'photography'
  | 'calmRest'
  | 'culinary';

export interface PlaceReview {
  id: string;
  placeId: string;
  placeKind: 'destination' | 'stay' | 'experience' | 'restaurant';
  placeName: string;
  goal: TravelGoalTag;
  authorName: string;
  authorOrigin: string;
  visitedSeason: string;
  rating: number;
  headline: string;
  story: string;
  goalTip: string;
  helpfulCount: number;
  createdAt: string;
}

