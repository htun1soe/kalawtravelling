import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  buildFallbackMedia,
  INITIAL_ARTICLES,
  INITIAL_BOOKINGS,
  INITIAL_DESTINATIONS,
  INITIAL_EXPERIENCES,
  INITIAL_PROPERTIES,
  INITIAL_RENTALS,
  INITIAL_RESTAURANTS,
  INITIAL_STAYS,
  INITIAL_USERS,
} from './src/data/kalawData.ts';
import type {
  BookingRequest,
  Destination,
  Experience,
  JournalArticle,
  PropertyListing,
  Rental,
  Restaurant,
  Stay,
  UserAccount,
} from './src/types/kalaw.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '2mb' }));

// In-memory REST API store (mirrors Laravel Sanctum + MySQL resource shape)
const store: {
  destinations: Destination[];
  stays: Stay[];
  experiences: Experience[];
  restaurants: Restaurant[];
  rentals: Rental[];
  properties: PropertyListing[];
  articles: JournalArticle[];
  bookings: BookingRequest[];
  users: UserAccount[];
} = {
  destinations: [...INITIAL_DESTINATIONS],
  stays: [...INITIAL_STAYS],
  experiences: [...INITIAL_EXPERIENCES],
  restaurants: [...INITIAL_RESTAURANTS],
  rentals: [...INITIAL_RENTALS],
  properties: [...INITIAL_PROPERTIES],
  articles: [...INITIAL_ARTICLES],
  bookings: [...INITIAL_BOOKINGS],
  users: [...INITIAL_USERS],
};

function makeSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'kalaw-travel-api' });
});

// Unified catalog search & discovery
app.get('/api/catalog', (_req, res) => {
  res.json({
    destinations: store.destinations,
    stays: store.stays,
    experiences: store.experiences,
    restaurants: store.restaurants,
    rentals: store.rentals,
    properties: store.properties,
    articles: store.articles,
  });
});

// Destinations
app.get('/api/destinations', (_req, res) => res.json(store.destinations));
app.get('/api/destinations/:slug', (req, res) => {
  const item = store.destinations.find((d) => d.slug === req.params.slug || d.id === req.params.slug);
  if (!item) return res.status(404).json({ error: 'Destination not found' });
  res.json(item);
});
app.post('/api/destinations', (req, res) => {
  const payload = req.body as Partial<Destination>;
  if (!payload.name) return res.status(400).json({ error: 'Name is required' });
  const created: Destination = {
    id: `dest-${Date.now()}`,
    slug: payload.slug || makeSlug(payload.name),
    name: payload.name,
    category: payload.category || 'Nature & Mountains',
    location: payload.location || 'Kalaw Hills',
    elevation: payload.elevation || '1,350 m',
    bestTime: payload.bestTime || 'October – March',
    duration: payload.duration || '2 Hours',
    coordinates: payload.coordinates || '20.6311° N, 96.5612° E',
    shortDescription: payload.shortDescription || '',
    editorialOverview: payload.editorialOverview || payload.shortDescription || '',
    highlights: payload.highlights || ['Scenic highland viewpoint'],
    image: payload.image || store.destinations[0].image,
    media:
      payload.media && payload.media.length >= 3
        ? payload.media
        : buildFallbackMedia(payload.image || store.destinations[0].image, payload.name),
    featured: Boolean(payload.featured),
  };
  store.destinations.unshift(created);
  res.status(201).json(created);
});
app.delete('/api/destinations/:id', (req, res) => {
  store.destinations = store.destinations.filter((d) => d.id !== req.params.id);
  res.json({ deleted: true });
});

// Stays
app.get('/api/stays', (_req, res) => res.json(store.stays));
app.get('/api/stays/:slug', (req, res) => {
  const item = store.stays.find((s) => s.slug === req.params.slug || s.id === req.params.slug);
  if (!item) return res.status(404).json({ error: 'Stay not found' });
  res.json(item);
});
app.post('/api/stays', (req, res) => {
  const payload = req.body as Partial<Stay>;
  if (!payload.name) return res.status(400).json({ error: 'Stay name is required' });
  const created: Stay = {
    id: `stay-${Date.now()}`,
    slug: payload.slug || makeSlug(payload.name),
    name: payload.name,
    category: payload.category || 'Hotels',
    location: payload.location || 'Kalaw',
    pricePerNight: Number(payload.pricePerNight) || 95,
    rating: Number(payload.rating) || 4.8,
    reviewCount: Number(payload.reviewCount) || 1,
    maxGuests: Number(payload.maxGuests) || 2,
    bedrooms: Number(payload.bedrooms) || 1,
    shortDescription: payload.shortDescription || '',
    description: payload.description || payload.shortDescription || '',
    amenities: payload.amenities || ['Shan breakfast', 'Wi-Fi'],
    availableFrom: payload.availableFrom || '2026-11-18',
    availableTo: payload.availableTo || '2027-05-01',
    images: payload.images && payload.images.length ? payload.images : [store.stays[0].images[0]],
    media:
      payload.media && payload.media.length >= 3
        ? payload.media
        : buildFallbackMedia(
            (payload.images && payload.images[0]) || store.stays[0].images[0],
            payload.name
          ),
    featured: Boolean(payload.featured),
  };
  store.stays.unshift(created);
  res.status(201).json(created);
});
app.delete('/api/stays/:id', (req, res) => {
  store.stays = store.stays.filter((s) => s.id !== req.params.id);
  res.json({ deleted: true });
});

// Experiences
app.get('/api/experiences', (_req, res) => res.json(store.experiences));
app.post('/api/experiences', (req, res) => {
  const payload = req.body as Partial<Experience>;
  if (!payload.title) return res.status(400).json({ error: 'Title is required' });
  const created: Experience = {
    id: `exp-${Date.now()}`,
    slug: makeSlug(payload.title),
    title: payload.title,
    category: payload.category || 'Guided Trekking',
    location: payload.location || 'Kalaw Hills',
    duration: payload.duration || 'Half Day',
    pricePerGuest: Number(payload.pricePerGuest) || 45,
    maxGroupSize: Number(payload.maxGroupSize) || 6,
    difficulty: payload.difficulty || 'Moderate',
    guideName: payload.guideName || 'Local Kalaw Guide',
    shortDescription: payload.shortDescription || '',
    included: payload.included || ['Local guide', 'Tea break'],
    image: payload.image || store.experiences[0].image,
    media:
      payload.media && payload.media.length >= 3
        ? payload.media
        : buildFallbackMedia(payload.image || store.experiences[0].image, payload.title),
    featured: Boolean(payload.featured),
  };
  store.experiences.unshift(created);
  res.status(201).json(created);
});
app.delete('/api/experiences/:id', (req, res) => {
  store.experiences = store.experiences.filter((e) => e.id !== req.params.id);
  res.json({ deleted: true });
});

// Restaurants
app.get('/api/restaurants', (_req, res) => res.json(store.restaurants));
app.post('/api/restaurants', (req, res) => {
  const payload = req.body as Partial<Restaurant>;
  if (!payload.name) return res.status(400).json({ error: 'Restaurant name is required' });
  const created: Restaurant = {
    id: `rest-${Date.now()}`,
    slug: makeSlug(payload.name),
    name: payload.name,
    cuisine: payload.cuisine || 'Shan Highland',
    location: payload.location || 'Central Kalaw',
    priceRange: payload.priceRange || '$$',
    openingHours: payload.openingHours || '08:00 – 21:00',
    signatureDishes: payload.signatureDishes || ['Shan Noodles'],
    shortDescription: payload.shortDescription || '',
    description: payload.description || payload.shortDescription || '',
    image: payload.image || store.restaurants[0].image,
    media:
      payload.media && payload.media.length >= 3
        ? payload.media
        : buildFallbackMedia(payload.image || store.restaurants[0].image, payload.name),
    featured: Boolean(payload.featured),
  };
  store.restaurants.unshift(created);
  res.status(201).json(created);
});
app.delete('/api/restaurants/:id', (req, res) => {
  store.restaurants = store.restaurants.filter((r) => r.id !== req.params.id);
  res.json({ deleted: true });
});

// Rentals
app.get('/api/rentals', (_req, res) => res.json(store.rentals));
app.post('/api/rentals', (req, res) => {
  const payload = req.body as Partial<Rental>;
  if (!payload.name) return res.status(400).json({ error: 'Rental name is required' });
  const created: Rental = {
    id: `rent-${Date.now()}`,
    slug: makeSlug(payload.name),
    name: payload.name,
    category: payload.category || 'Motorbike Rentals',
    location: payload.location || 'Central Kalaw',
    pricePerDay: Number(payload.pricePerDay) || 20,
    transmissionOrService: payload.transmissionOrService || 'Automatic',
    capacity: payload.capacity || '2 Guests',
    includesDriver: Boolean(payload.includesDriver),
    shortDescription: payload.shortDescription || '',
    terms: payload.terms || ['Helmet & basic insurance included'],
    image: payload.image || store.rentals[0].image,
    media:
      payload.media && payload.media.length >= 3
        ? payload.media
        : buildFallbackMedia(payload.image || store.rentals[0].image, payload.name),
    available: payload.available !== false,
  };
  store.rentals.unshift(created);
  res.status(201).json(created);
});
app.delete('/api/rentals/:id', (req, res) => {
  store.rentals = store.rentals.filter((r) => r.id !== req.params.id);
  res.json({ deleted: true });
});

// Real Estate Properties
app.get('/api/properties', (_req, res) => res.json(store.properties));
app.get('/api/properties/:slug', (req, res) => {
  const item = store.properties.find((p) => p.slug === req.params.slug || p.id === req.params.slug);
  if (!item) return res.status(404).json({ error: 'Property not found' });
  res.json(item);
});
app.post('/api/properties', (req, res) => {
  const payload = req.body as Partial<PropertyListing>;
  if (!payload.title) return res.status(400).json({ error: 'Property title is required' });
  const created: PropertyListing = {
    id: `prop-${Date.now()}`,
    slug: makeSlug(payload.title) + '-' + String(Date.now()).slice(-4),
    title: payload.title,
    category: payload.category || 'Houses for Sale',
    location: payload.location || 'Kalaw Hills',
    price: Number(payload.price) || 180000,
    priceUnit: payload.priceUnit || (payload.category === 'Houses for Rent' ? 'per month' : 'total'),
    areaSize: payload.areaSize || '0.25 Acres',
    bedrooms: payload.bedrooms ? Number(payload.bedrooms) : undefined,
    bathrooms: payload.bathrooms ? Number(payload.bathrooms) : undefined,
    titleStatus: payload.titleStatus || 'Verified Highland Title',
    agentName: payload.agentName || 'Property Owner Submission',
    agentContact: payload.agentContact || 'inquiries@kalawtravel.com',
    shortDescription: payload.shortDescription || '',
    description: payload.description || payload.shortDescription || '',
    features: payload.features && payload.features.length ? payload.features : ['Mountain view', 'Road access'],
    images: payload.images && payload.images.length ? payload.images : [store.properties[0].images[0]],
    media:
      payload.media && payload.media.length >= 3
        ? payload.media
        : buildFallbackMedia(
            (payload.images && payload.images[0]) || store.properties[0].images[0],
            payload.title
          ),
    featured: Boolean(payload.featured),
    status: payload.status || 'Active',
  };
  store.properties.unshift(created);
  res.status(201).json(created);
});
app.patch('/api/properties/:id', (req, res) => {
  const idx = store.properties.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Property not found' });
  store.properties[idx] = { ...store.properties[idx], ...req.body };
  res.json(store.properties[idx]);
});
app.delete('/api/properties/:id', (req, res) => {
  store.properties = store.properties.filter((p) => p.id !== req.params.id);
  res.json({ deleted: true });
});

// Journal Articles
app.get('/api/articles', (_req, res) => res.json(store.articles));
app.get('/api/articles/:slug', (req, res) => {
  const item = store.articles.find((a) => a.slug === req.params.slug || a.id === req.params.slug);
  if (!item) return res.status(404).json({ error: 'Article not found' });
  res.json(item);
});
app.post('/api/articles', (req, res) => {
  const payload = req.body as Partial<JournalArticle>;
  if (!payload.title) return res.status(400).json({ error: 'Article title is required' });
  const created: JournalArticle = {
    id: `art-${Date.now()}`,
    slug: makeSlug(payload.title),
    title: payload.title,
    subtitle: payload.subtitle || '',
    category: payload.category || 'Field Guide',
    author: payload.author || 'Kalaw Editorial Desk',
    publishedAt: payload.publishedAt || 'November 2026',
    readTime: payload.readTime || '4 min read',
    coverImage: payload.coverImage || store.articles[0].coverImage,
    media:
      payload.media && payload.media.length >= 3
        ? payload.media
        : buildFallbackMedia(payload.coverImage || store.articles[0].coverImage, payload.title),
    excerpt: payload.excerpt || payload.subtitle || '',
    paragraphs: payload.paragraphs && payload.paragraphs.length ? payload.paragraphs : [payload.excerpt || ''],
    marginNote: payload.marginNote || 'Recorded in Kalaw, Shan State.',
    pullQuote: payload.pullQuote || 'Slow travel begins where the mountain pine line meets the clouds.',
  };
  store.articles.unshift(created);
  res.status(201).json(created);
});
app.delete('/api/articles/:id', (req, res) => {
  store.articles = store.articles.filter((a) => a.id !== req.params.id);
  res.json({ deleted: true });
});

// Bookings (Booking Request workflow — always starts as pending_verification)
app.get('/api/bookings', (req, res) => {
  const userId = req.query.userId as string | undefined;
  if (userId) {
    return res.json(store.bookings.filter((b) => b.userId === userId));
  }
  res.json(store.bookings);
});

app.post('/api/bookings', (req, res) => {
  const payload = req.body as Partial<BookingRequest>;
  if (!payload.itemId || !payload.itemTitle || !payload.checkIn || !payload.userEmail) {
    return res.status(400).json({ error: 'Missing required booking request details (listing, date, email).' });
  }
  const created: BookingRequest = {
    id: `bk-${Date.now()}`,
    referenceCode: `KLT-REQ-${Math.floor(1000 + Math.random() * 9000)}`,
    userId: payload.userId || 'guest',
    userName: payload.userName || 'Guest Traveler',
    userEmail: payload.userEmail,
    itemType: payload.itemType || 'stay',
    itemId: payload.itemId,
    itemTitle: payload.itemTitle,
    checkIn: payload.checkIn,
    checkOut: payload.checkOut,
    guests: Number(payload.guests) || 1,
    totalEstimate: Number(payload.totalEstimate) || 0,
    notes: payload.notes || '',
    status: 'pending_verification',
    createdAt: new Date().toISOString(),
  };
  store.bookings.unshift(created);
  res.status(201).json(created);
});

app.patch('/api/bookings/:id', (req, res) => {
  const idx = store.bookings.findIndex((b) => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Booking request not found' });
  const { status } = req.body as { status?: BookingRequest['status'] };
  if (status) {
    store.bookings[idx] = { ...store.bookings[idx], status };
  }
  res.json(store.bookings[idx]);
});

// Authentication & Users
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const found = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!found) {
    return res.status(401).json({ error: 'No account matches that email. Try registering or using the demo traveler/admin email.' });
  }
  res.json({ user: found, token: `sanctum-mock-${found.id}-${Date.now()}` });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, role } = req.body as { name?: string; email?: string; role?: UserAccount['role'] };
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
  const existing = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }
  const newUser: UserAccount = {
    id: `user-${Date.now()}`,
    name,
    email,
    role: role === 'owner' ? 'owner' : 'traveler',
    location: 'Kalaw Visitor',
    bio: 'Exploring highland stays, local cuisine, and pine trails in Kalaw.',
    favorites: [],
  };
  store.users.push(newUser);
  res.status(201).json({ user: newUser, token: `sanctum-mock-${newUser.id}-${Date.now()}` });
});

app.get('/api/users', (_req, res) => res.json(store.users));

app.patch('/api/users/:id', (req, res) => {
  const idx = store.users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  store.users[idx] = { ...store.users[idx], ...req.body };
  res.json(store.users[idx]);
});

app.post('/api/users/:id/favorites', (req, res) => {
  const idx = store.users.findIndex((u) => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'User not found' });
  const { itemId } = req.body as { itemId?: string };
  if (!itemId) return res.status(400).json({ error: 'itemId is required' });
  const favs = new Set(store.users[idx].favorites);
  if (favs.has(itemId)) {
    favs.delete(itemId);
  } else {
    favs.add(itemId);
  }
  store.users[idx].favorites = Array.from(favs);
  res.json(store.users[idx]);
});

// Admin summary stats
app.get('/api/admin/stats', (_req, res) => {
  res.json({
    destinations: store.destinations.length,
    stays: store.stays.length,
    experiences: store.experiences.length,
    restaurants: store.restaurants.length,
    rentals: store.rentals.length,
    properties: store.properties.length,
    articles: store.articles.length,
    users: store.users.length,
    totalBookings: store.bookings.length,
    pendingBookings: store.bookings.filter((b) => b.status === 'pending_verification').length,
  });
});

async function startServer() {
  const PORT = 3000;
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Kalaw Travel server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
