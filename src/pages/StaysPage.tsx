import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Star } from 'lucide-react';
import { CardMediaCarousel, resolveMediaList } from '../components/CardMediaCarousel';
import { FavoriteButton } from '../components/FavoriteButton';
import { useApp } from '../context/AppContext';
import type { StayCategory } from '../types/kalaw';

const STAY_CATEGORIES: Array<'All' | StayCategory> = [
  'All',
  'Hotels',
  'Guesthouses',
  'Resorts',
  'Homestays',
  'Private Houses',
];

export const StaysPage: React.FC = () => {
  const { stays, catalogLoading, openItemModal, t } = useApp();
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const initialGuests = Number(searchParams.get('guests') || '1');

  const [category, setCategory] = useState<'All' | StayCategory>('All');
  const [query, setQuery] = useState(initialQ);
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [minGuests, setMinGuests] = useState<number>(initialGuests);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = stays.filter((s) => {
      const catMatch = category === 'All' || s.category === category;
      const priceMatch = s.pricePerNight <= maxPrice;
      const guestMatch = s.maxGuests >= minGuests;
      const textMatch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q);
      return catMatch && priceMatch && guestMatch && textMatch;
    });

    if (sortBy === 'price-asc') return [...list].sort((a, b) => a.pricePerNight - b.pricePerNight);
    if (sortBy === 'price-desc') return [...list].sort((a, b) => b.pricePerNight - a.pricePerNight);
    return [...list].sort((a, b) => b.rating - a.rating);
  }, [stays, category, maxPrice, minGuests, query, sortBy]);

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="max-w-3xl space-y-4 pb-10 border-b border-[#D9CCB8]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
          {t.pages.staysEyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
          {t.pages.staysTitle}
        </h1>
        <p className="text-base text-[#292B27]/80 leading-relaxed">
          {t.pages.staysDesc}
        </p>
      </div>

      {/* Filters */}
      <div className="py-6 border-b border-[#D9CCB8] space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {STAY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                category === cat
                  ? 'bg-[#243D32] text-[#F4F0E6]'
                  : 'text-[#292B27]/80 hover:bg-[#D9CCB8]/50'
              }`}
            >
              {t.categories[cat] || cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#52634A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Location or lodge name..."
              className="w-full pl-9 pr-3 py-2 bg-white/70 border border-[#D9CCB8] text-xs text-[#292B27] focus:outline-none focus:border-[#243D32]"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-[#52634A]">
            <label className="whitespace-nowrap tabular-nums">Max ${maxPrice}/night</label>
            <input
              type="range"
              min={40}
              max={300}
              step={10}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#243D32]"
            />
          </div>

          <select
            value={minGuests}
            onChange={(e) => setMinGuests(Number(e.target.value))}
            aria-label="Minimum guests"
            className="px-3 py-2 bg-white/70 border border-[#D9CCB8] text-xs text-[#292B27] focus:outline-none focus:border-[#243D32]"
          >
            {[1, 2, 3, 4, 6].map((n) => (
              <option key={n} value={n}>
                {n}+ Guests
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'rating' | 'price-asc' | 'price-desc')}
            aria-label="Sort accommodations"
            className="px-3 py-2 bg-white/70 border border-[#D9CCB8] text-xs text-[#292B27] focus:outline-none focus:border-[#243D32]"
          >
            <option value="rating">Highest Rated</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {catalogLoading ? (
        <div className="py-20 text-center text-sm text-[#52634A]">Loading accommodations...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <p className="font-serif text-2xl text-[#243D32]">No stays match those criteria.</p>
          <button
            type="button"
            onClick={() => {
              setCategory('All');
              setQuery('');
              setMaxPrice(300);
              setMinGuests(1);
            }}
            className="px-4 py-2 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm cursor-pointer"
          >
            {t.actions.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-10">
          {filtered.map((stay) => (
            <article key={stay.id} className="group bg-[#F4F0E6] border border-[#D9CCB8] flex flex-col">
              <CardMediaCarousel
                title={stay.name}
                subtitle={`${t.categories[stay.category] || stay.category} · ${stay.location}`}
                media={resolveMediaList(stay.media, stay.images, stay.name)}
                aspectClass="aspect-[4/3]"
                onOpenInfo={() => openItemModal({ kind: 'stay', data: stay })}
                modalItem={{ kind: 'stay', data: stay }}
                topRightOverlay={<FavoriteButton itemId={stay.id} compact />}
              />
              <div className="p-6 flex-1 flex flex-col space-y-3">
                <div className="flex items-center justify-between text-xs text-[#52634A]">
                  <span>{t.categories[stay.category] || stay.category} · {stay.location}</span>
                  <span className="inline-flex items-center gap-1 text-[#243D32] font-medium tabular-nums">
                    <Star className="w-3.5 h-3.5 fill-[#B66F52] text-[#B66F52]" />
                    {stay.rating.toFixed(1)} ({stay.reviewCount})
                  </span>
                </div>
                <h2 className="font-serif text-2xl text-[#243D32]">
                  <button
                    type="button"
                    onClick={() => openItemModal({ kind: 'stay', data: stay })}
                    className="text-left hover:text-[#B66F52] transition-colors cursor-pointer"
                  >
                    {stay.name}
                  </button>
                </h2>
                <p className="text-sm text-[#292B27]/80 leading-relaxed flex-1">
                  {stay.shortDescription}
                </p>
                <p className="text-xs text-[#52634A] tabular-nums">
                  Up to {stay.maxGuests} guests · {stay.bedrooms} {stay.bedrooms === 1 ? 'bedroom' : 'bedrooms'} · {stay.availableFrom}
                </p>
                <div className="pt-4 border-t border-[#D9CCB8] flex items-center justify-between">
                  <div>
                    <span className="font-serif text-2xl text-[#243D32] tabular-nums">
                      ${stay.pricePerNight}
                    </span>
                    <span className="text-xs text-[#52634A]"> {t.home.perNight}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openItemModal({ kind: 'stay', data: stay })}
                    className="px-4 py-2 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] transition-colors cursor-pointer"
                  >
                    {t.home.viewDetails}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
