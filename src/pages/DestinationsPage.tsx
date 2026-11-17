import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Navigation, Search } from 'lucide-react';
import { CardMediaCarousel, resolveMediaList } from '../components/CardMediaCarousel';
import { FavoriteButton } from '../components/FavoriteButton';
import { PlaceReviewsSection } from '../components/PlaceReviewsSection';
import { PlacesNavigationMap } from '../components/PlacesNavigationMap';
import { useApp } from '../context/AppContext';
import type { DestinationCategory } from '../types/kalaw';

const CATEGORIES: Array<'All' | DestinationCategory> = [
  'All',
  'Nature & Mountains',
  'Viewpoints',
  'Cultural Attractions',
  'Pagodas & Religious Sites',
  'Hiking & Trekking',
  'Hidden Gems',
];

export const DestinationsPage: React.FC = () => {
  const { destinations, catalogLoading, openItemModal, t } = useApp();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<'All' | DestinationCategory>('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'name'>('featured');
  const [navTargetId, setNavTargetId] = useState<string>(
    () => searchParams.get('navigate') || 'dest-1'
  );

  useEffect(() => {
    const param = searchParams.get('navigate');
    if (param) {
      setNavTargetId(param);
    }
  }, [searchParams]);

  const handleNavigatePlace = (id: string) => {
    setNavTargetId(id);
    const el = document.getElementById('places-navigator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = destinations.filter((d) => {
      const catMatch = selectedCategory === 'All' || d.category === selectedCategory;
      const textMatch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q) ||
        d.shortDescription.toLowerCase().includes(q);
      return catMatch && textMatch;
    });

    if (sortBy === 'name') {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [destinations, selectedCategory, query, sortBy]);

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10 space-y-12">
      <div className="max-w-3xl space-y-4 pb-8 border-b border-[#A4834C]/30">
        <p className="text-xs uppercase tracking-[0.2em] text-[#A4834C] font-medium">
          {t.pages.destAtlas}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#1B3128] headline-balance">
          {t.pages.destTitle}
        </h1>
        <p className="text-base text-[#222420]/80 leading-relaxed">
          {t.pages.destDesc}
        </p>
      </div>

      {/* Interactive Plateau Navigation System */}
      <PlacesNavigationMap initialDestinationId={navTargetId} />

      {/* Filter & Search Bar */}
      <div className="py-6 border-t border-b border-[#A4834C]/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#1B3128] text-[#FAF7F0]'
                  : 'text-[#222420]/80 hover:bg-[#D9CCB8]/50'
              }`}
            >
              {t.categories[cat] || cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#4F6047] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${t.nav.searchBtn}...`}
              className="pl-9 pr-3 py-2 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'name')}
            aria-label="Sort destinations"
            className="px-3 py-2 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
          >
            <option value="featured">Curated Order</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {catalogLoading ? (
        <div className="py-20 text-center text-sm text-[#4F6047]">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <p className="font-serif text-2xl text-[#1B3128]">No destinations match your filter.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setQuery('');
            }}
            className="px-4 py-2 bg-[#1B3128] text-[#FAF7F0] text-xs font-medium rounded-sm cursor-pointer"
          >
            {t.actions.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filtered.map((dest) => (
            <article
              key={dest.id}
              className="group flex flex-col bg-[#FAF7F0] border border-[#A4834C]/25 p-4 transition-colors hover:border-[#A4834C]/60"
            >
              <CardMediaCarousel
                title={dest.name}
                subtitle={`${t.categories[dest.category] || dest.category} · ${dest.location}`}
                media={resolveMediaList(dest.media, [dest.image], dest.name)}
                aspectClass="aspect-[4/3]"
                onOpenInfo={() => openItemModal({ kind: 'destination', data: dest })}
                modalItem={{ kind: 'destination', data: dest }}
                topRightOverlay={<FavoriteButton itemId={dest.id} compact />}
              />
              <div className="pt-4 space-y-2 flex-1 flex flex-col">
                <p className="text-xs text-[#4F6047]">
                  {t.categories[dest.category] || dest.category} · {dest.location} ·{' '}
                  <span className="tabular-nums">{dest.elevation}</span>
                </p>
                <h2 className="font-serif text-2xl text-[#1B3128]">
                  <button
                    type="button"
                    onClick={() => openItemModal({ kind: 'destination', data: dest })}
                    className="text-left group-hover:text-[#A4834C] transition-colors cursor-pointer"
                  >
                    {dest.name}
                  </button>
                </h2>
                <p className="text-sm text-[#222420]/80 leading-relaxed flex-1">
                  {dest.shortDescription}
                </p>
                <div className="pt-3 border-t border-[#A4834C]/20 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openItemModal({ kind: 'destination', data: dest })}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#1B3128] hover:text-[#A4834C] cursor-pointer"
                  >
                    <span>{t.home.readGuide}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNavigatePlace(dest.id)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#A4834C]/45 text-[11px] font-medium text-[#1B3128] hover:bg-[#1B3128] hover:text-[#FAF7F0] transition-colors rounded-sm cursor-pointer whitespace-nowrap"
                  >
                    <Navigation className="w-3 h-3 text-[#A4834C]" />
                    <span>{t.actions.navigateHere}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Traveler Experiences & Goal Guidance */}
      <section className="pt-12 border-t border-[#A4834C]/30">
        <PlaceReviewsSection />
      </section>
    </div>
  );
};
