import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { CardMediaCarousel, resolveMediaList } from '../components/CardMediaCarousel';
import { FavoriteButton } from '../components/FavoriteButton';
import { PropertyCard } from '../components/PropertyCard';
import { useApp } from '../context/AppContext';

type ExploreTab = 'all' | 'destinations' | 'stays' | 'experiences' | 'dining' | 'rentals' | 'properties';

export const ExplorePage: React.FC = () => {
  const { destinations, stays, experiences, restaurants, rentals, properties, openItemModal, t } = useApp();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [tab, setTab] = useState<ExploreTab>('all');

  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    const matchText = (fields: string[]) =>
      !q || fields.some((f) => f.toLowerCase().includes(q));

    return {
      destinations: destinations.filter((d) =>
        matchText([d.name, d.location, d.category, d.shortDescription])
      ),
      stays: stays.filter((s) =>
        matchText([s.name, s.location, s.category, s.shortDescription])
      ),
      experiences: experiences.filter((e) =>
        matchText([e.title, e.location, e.category, e.shortDescription])
      ),
      restaurants: restaurants.filter((r) =>
        matchText([r.name, r.location, r.cuisine, r.shortDescription])
      ),
      rentals: rentals.filter((r) =>
        matchText([r.name, r.location, r.category, r.shortDescription])
      ),
      properties: properties.filter((p) =>
        matchText([p.title, p.location, p.category, p.shortDescription, p.areaSize, p.agentName])
      ),
    };
  }, [destinations, stays, experiences, restaurants, rentals, properties, q]);

  const totalCount =
    results.destinations.length +
    results.stays.length +
    results.experiences.length +
    results.restaurants.length +
    results.rentals.length +
    results.properties.length;

  const tabs: Array<{ id: ExploreTab; label: string; count: number }> = [
    { id: 'all', label: t.categories.All, count: totalCount },
    { id: 'destinations', label: t.nav.destinations, count: results.destinations.length },
    { id: 'stays', label: t.nav.stays, count: results.stays.length },
    { id: 'experiences', label: t.nav.experiences, count: results.experiences.length },
    { id: 'dining', label: t.nav.dining, count: results.restaurants.length },
    { id: 'rentals', label: t.nav.rentals, count: results.rentals.length },
    { id: 'properties', label: t.nav.realEstate, count: results.properties.length },
  ];

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="max-w-3xl space-y-4 pb-8 border-b border-[#D9CCB8]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
          {t.pages.exploreEyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
          {t.pages.exploreTitle}
        </h1>
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-[#52634A] absolute left-4 top-[calc(50%+4px)] -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.nav.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 bg-white/80 border border-[#D9CCB8] text-sm text-[#292B27] focus:outline-none focus:border-[#243D32]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 py-6 border-b border-[#D9CCB8]">
        {tabs.map((tabItem) => (
          <button
            key={tabItem.id}
            type="button"
            onClick={() => setTab(tabItem.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
              tab === tabItem.id
                ? 'bg-[#243D32] text-[#F4F0E6]'
                : 'text-[#292B27]/80 hover:bg-[#D9CCB8]/50'
            }`}
          >
            {tabItem.label} ({tabItem.count})
          </button>
        ))}
      </div>

      {totalCount === 0 ? (
        <div className="py-20 text-center space-y-3">
          <p className="font-serif text-2xl text-[#243D32]">No listings match “{query}”.</p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="px-4 py-2 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm cursor-pointer"
          >
            {t.actions.resetFilters}
          </button>
        </div>
      ) : (
        <div className="space-y-14 pt-10">
          {(tab === 'all' || tab === 'destinations') && results.destinations.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                {t.nav.destinations}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {results.destinations.map((d) => (
                  <article key={d.id} className="group space-y-3 flex flex-col">
                    <CardMediaCarousel
                      title={d.name}
                      subtitle={`${t.categories[d.category] || d.category} · ${d.location}`}
                      media={resolveMediaList(d.media, [d.image], d.name)}
                      aspectClass="aspect-[4/3]"
                      onOpenInfo={() => openItemModal({ kind: 'destination', data: d })}
                      modalItem={{ kind: 'destination', data: d }}
                      topRightOverlay={<FavoriteButton itemId={d.id} compact />}
                    />
                    <p className="text-xs text-[#52634A]">
                      {t.categories[d.category] || d.category} · {d.location}
                    </p>
                    <h3 className="font-serif text-xl text-[#243D32]">
                      <button
                        type="button"
                        onClick={() => openItemModal({ kind: 'destination', data: d })}
                        className="text-left group-hover:text-[#B66F52] transition-colors cursor-pointer"
                      >
                        {d.name}
                      </button>
                    </h3>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(tab === 'all' || tab === 'stays') && results.stays.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                {t.nav.stays}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {results.stays.map((s) => (
                  <article key={s.id} className="group space-y-3 flex flex-col">
                    <CardMediaCarousel
                      title={s.name}
                      subtitle={`${t.categories[s.category] || s.category} · ${s.location}`}
                      media={resolveMediaList(s.media, s.images, s.name)}
                      aspectClass="aspect-[4/3]"
                      onOpenInfo={() => openItemModal({ kind: 'stay', data: s })}
                      modalItem={{ kind: 'stay', data: s }}
                      topRightOverlay={<FavoriteButton itemId={s.id} compact />}
                    />
                    <p className="text-xs text-[#52634A] tabular-nums">
                      {t.categories[s.category] || s.category} · ${s.pricePerNight} {t.home.perNight}
                    </p>
                    <h3 className="font-serif text-xl text-[#243D32]">
                      <button
                        type="button"
                        onClick={() => openItemModal({ kind: 'stay', data: s })}
                        className="text-left group-hover:text-[#B66F52] transition-colors cursor-pointer"
                      >
                        {s.name}
                      </button>
                    </h3>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(tab === 'all' || tab === 'experiences') && results.experiences.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                {t.nav.experiences}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {results.experiences.map((e) => (
                  <article key={e.id} className="group space-y-3 flex flex-col border border-[#D9CCB8] bg-[#F4F0E6]">
                    <CardMediaCarousel
                      title={e.title}
                      subtitle={`${t.categories[e.category] || e.category} · ${e.duration}`}
                      media={resolveMediaList(e.media, [e.image], e.title)}
                      aspectClass="aspect-[4/3]"
                      onOpenInfo={() => openItemModal({ kind: 'experience', data: e })}
                      modalItem={{ kind: 'experience', data: e }}
                      topRightOverlay={<FavoriteButton itemId={e.id} compact />}
                    />
                    <div className="px-5 pb-5 space-y-2 flex-1 flex flex-col">
                      <p className="text-xs text-[#52634A]">
                        {t.categories[e.category] || e.category} · {e.duration}
                      </p>
                      <h3 className="font-serif text-xl text-[#243D32]">
                        <button
                          type="button"
                          onClick={() => openItemModal({ kind: 'experience', data: e })}
                          className="text-left group-hover:text-[#B66F52] transition-colors cursor-pointer"
                        >
                          {e.title}
                        </button>
                      </h3>
                      <div className="pt-2 mt-auto flex items-center justify-between text-xs text-[#243D32] font-medium tabular-nums">
                        <span>${e.pricePerGuest} {t.home.perGuest}</span>
                        <button
                          type="button"
                          onClick={() => openItemModal({ kind: 'experience', data: e })}
                          className="inline-flex items-center gap-1 hover:text-[#B66F52] cursor-pointer"
                        >
                          <span>{t.home.viewDetails}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(tab === 'all' || tab === 'dining') && results.restaurants.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                {t.nav.dining}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {results.restaurants.map((r) => (
                  <article key={r.id} className="group space-y-3 flex flex-col border border-[#D9CCB8] bg-[#F4F0E6]">
                    <CardMediaCarousel
                      title={r.name}
                      subtitle={`${r.cuisine} · ${r.location}`}
                      media={resolveMediaList(r.media, [r.image], r.name)}
                      aspectClass="aspect-[4/3]"
                      onOpenInfo={() => openItemModal({ kind: 'restaurant', data: r })}
                      modalItem={{ kind: 'restaurant', data: r }}
                    />
                    <div className="px-5 pb-5 space-y-2 flex-1 flex flex-col">
                      <p className="text-xs text-[#52634A]">
                        {r.cuisine} · {r.openingHours}
                      </p>
                      <h3 className="font-serif text-xl text-[#243D32]">
                        <button
                          type="button"
                          onClick={() => openItemModal({ kind: 'restaurant', data: r })}
                          className="text-left group-hover:text-[#B66F52] transition-colors cursor-pointer"
                        >
                          {r.name}
                        </button>
                      </h3>
                      <button
                        type="button"
                        onClick={() => openItemModal({ kind: 'restaurant', data: r })}
                        className="mt-auto pt-2 inline-flex items-center gap-1 text-xs font-medium text-[#243D32] hover:text-[#B66F52] cursor-pointer self-start"
                      >
                        <span>{t.home.viewDetails}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(tab === 'all' || tab === 'rentals') && results.rentals.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                {t.nav.rentals}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {results.rentals.map((r) => (
                  <article key={r.id} className="group space-y-3 flex flex-col border border-[#D9CCB8] bg-[#F4F0E6]">
                    <CardMediaCarousel
                      title={r.name}
                      subtitle={`${t.categories[r.category] || r.category} · ${r.capacity}`}
                      media={resolveMediaList(r.media, [r.image], r.name)}
                      aspectClass="aspect-[4/3]"
                      onOpenInfo={() => openItemModal({ kind: 'rental', data: r })}
                      modalItem={{ kind: 'rental', data: r }}
                    />
                    <div className="px-5 pb-5 space-y-2 flex-1 flex flex-col">
                      <p className="text-xs text-[#52634A]">
                        {t.categories[r.category] || r.category} · {r.capacity}
                      </p>
                      <h3 className="font-serif text-xl text-[#243D32]">
                        <button
                          type="button"
                          onClick={() => openItemModal({ kind: 'rental', data: r })}
                          className="text-left group-hover:text-[#B66F52] transition-colors cursor-pointer"
                        >
                          {r.name}
                        </button>
                      </h3>
                      <div className="pt-2 mt-auto flex items-center justify-between text-xs text-[#243D32] font-medium tabular-nums">
                        <span>${r.pricePerDay} {t.home.perDay}</span>
                        <button
                          type="button"
                          onClick={() => openItemModal({ kind: 'rental', data: r })}
                          className="inline-flex items-center gap-1 hover:text-[#B66F52] cursor-pointer"
                        >
                          <span>{t.home.viewDetails}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {(tab === 'all' || tab === 'properties') && results.properties.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                {t.nav.realEstate}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {results.properties.map((p) => (
                  <PropertyCard key={p.id} prop={p} variant="light" />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
