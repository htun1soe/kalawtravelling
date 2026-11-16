import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { FavoriteButton } from '../components/FavoriteButton';
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
  const { destinations, catalogLoading, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'All' | DestinationCategory>('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'name'>('featured');

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
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="max-w-3xl space-y-4 pb-10 border-b border-[#D9CCB8]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
          {t.pages.destAtlas}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
          {t.pages.destTitle}
        </h1>
        <p className="text-base text-[#292B27]/80 leading-relaxed">
          {t.pages.destDesc}
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="py-6 border-b border-[#D9CCB8] flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#243D32] text-[#F4F0E6]'
                  : 'text-[#292B27]/80 hover:bg-[#D9CCB8]/50'
              }`}
            >
              {t.categories[cat] || cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#52634A] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${t.nav.searchBtn}...`}
              className="pl-9 pr-3 py-2 bg-white/70 border border-[#D9CCB8] text-xs text-[#292B27] focus:outline-none focus:border-[#243D32]"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'featured' | 'name')}
            aria-label="Sort destinations"
            className="px-3 py-2 bg-white/70 border border-[#D9CCB8] text-xs text-[#292B27] focus:outline-none focus:border-[#243D32]"
          >
            <option value="featured">Curated Order</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {catalogLoading ? (
        <div className="py-20 text-center text-sm text-[#52634A]">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <p className="font-serif text-2xl text-[#243D32]">No destinations match your filter.</p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('All');
              setQuery('');
            }}
            className="px-4 py-2 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm cursor-pointer"
          >
            {t.actions.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 pt-10">
          {filtered.map((dest) => (
            <article key={dest.id} className="group flex flex-col">
              <div className="relative">
                <Link to={`/destinations/${dest.slug}`}>
                  <EditorialImage src={dest.image} alt={dest.name} aspectClass="aspect-[4/3]" />
                </Link>
                <div className="absolute top-3 right-3">
                  <FavoriteButton itemId={dest.id} compact />
                </div>
              </div>
              <div className="pt-4 space-y-2 flex-1 flex flex-col">
                <p className="text-xs text-[#52634A]">
                  {t.categories[dest.category] || dest.category} · {dest.location} · <span className="tabular-nums">{dest.elevation}</span>
                </p>
                <h2 className="font-serif text-2xl text-[#243D32] group-hover:text-[#B66F52] transition-colors">
                  <Link to={`/destinations/${dest.slug}`}>{dest.name}</Link>
                </h2>
                <p className="text-sm text-[#292B27]/80 leading-relaxed flex-1">
                  {dest.shortDescription}
                </p>
                <Link
                  to={`/destinations/${dest.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#243D32] pt-2 hover:text-[#B66F52]"
                >
                  <span>{t.home.readGuide}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
