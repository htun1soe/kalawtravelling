import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { useApp } from '../context/AppContext';

type ExploreTab = 'all' | 'destinations' | 'stays' | 'experiences' | 'dining' | 'rentals' | 'properties';

export const ExplorePage: React.FC = () => {
  const { destinations, stays, experiences, restaurants, rentals, properties } = useApp();
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
        matchText([p.title, p.location, p.category, p.shortDescription])
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
    { id: 'all', label: 'All', count: totalCount },
    { id: 'destinations', label: 'Destinations', count: results.destinations.length },
    { id: 'stays', label: 'Stays', count: results.stays.length },
    { id: 'experiences', label: 'Experiences', count: results.experiences.length },
    { id: 'dining', label: 'Dining', count: results.restaurants.length },
    { id: 'rentals', label: 'Rentals', count: results.rentals.length },
    { id: 'properties', label: 'Real Estate', count: results.properties.length },
  ];

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="max-w-3xl space-y-4 pb-8 border-b border-[#D9CCB8]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
          Unified Discovery
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
          Explore Everything in Kalaw
        </h1>
        <div className="relative pt-2">
          <Search className="w-4 h-4 text-[#52634A] absolute left-4 top-[calc(50%+4px)] -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pine trails, lodges, Shan noodles, motorbikes, or ridge land..."
            className="w-full pl-11 pr-4 py-3 bg-white/80 border border-[#D9CCB8] text-sm text-[#292B27] focus:outline-none focus:border-[#243D32]"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 py-6 border-b border-[#D9CCB8]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
              tab === t.id
                ? 'bg-[#243D32] text-[#F4F0E6]'
                : 'text-[#292B27]/80 hover:bg-[#D9CCB8]/50'
            }`}
          >
            {t.label} ({t.count})
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
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-14 pt-10">
          {(tab === 'all' || tab === 'destinations') && results.destinations.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                Destinations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {results.destinations.map((d) => (
                  <Link key={d.id} to={`/destinations/${d.slug}`} className="group space-y-3">
                    <EditorialImage src={d.image} alt={d.name} aspectClass="aspect-[4/3]" />
                    <p className="text-xs text-[#52634A]">{d.category} · {d.location}</p>
                    <h3 className="font-serif text-xl text-[#243D32] group-hover:text-[#B66F52]">{d.name}</h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(tab === 'all' || tab === 'stays') && results.stays.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                Stays &amp; Lodges
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {results.stays.map((s) => (
                  <Link key={s.id} to={`/stays/${s.slug}`} className="group space-y-3">
                    <EditorialImage src={s.images[0]} alt={s.name} aspectClass="aspect-[4/3]" />
                    <p className="text-xs text-[#52634A] tabular-nums">{s.category} · ${s.pricePerNight}/night</p>
                    <h3 className="font-serif text-xl text-[#243D32] group-hover:text-[#B66F52]">{s.name}</h3>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(tab === 'all' || tab === 'experiences') && results.experiences.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                Experiences
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.experiences.map((e) => (
                  <Link
                    key={e.id}
                    to="/experiences"
                    className="p-5 border border-[#D9CCB8] hover:border-[#243D32] transition-colors flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs text-[#52634A]">{e.category} · {e.duration}</p>
                      <h3 className="font-serif text-xl text-[#243D32] mt-1">{e.title}</h3>
                    </div>
                    <span className="text-sm font-medium text-[#243D32] tabular-nums shrink-0">${e.pricePerGuest}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(tab === 'all' || tab === 'dining') && results.restaurants.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                Food &amp; Restaurants
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.restaurants.map((r) => (
                  <Link
                    key={r.id}
                    to="/dining"
                    className="p-5 border border-[#D9CCB8] hover:border-[#243D32] transition-colors flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs text-[#52634A]">{r.cuisine} · {r.openingHours}</p>
                      <h3 className="font-serif text-xl text-[#243D32] mt-1">{r.name}</h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#52634A] shrink-0" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(tab === 'all' || tab === 'rentals') && results.rentals.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                Rentals &amp; Drivers
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {results.rentals.map((r) => (
                  <Link
                    key={r.id}
                    to="/rentals"
                    className="p-5 border border-[#D9CCB8] hover:border-[#243D32] transition-colors flex items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-xs text-[#52634A]">{r.category} · {r.capacity}</p>
                      <h3 className="font-serif text-xl text-[#243D32] mt-1">{r.name}</h3>
                    </div>
                    <span className="text-sm font-medium text-[#243D32] tabular-nums shrink-0">${r.pricePerDay}/day</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(tab === 'all' || tab === 'properties') && results.properties.length > 0 && (
            <section className="space-y-6">
              <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                Real Estate
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {results.properties.map((p) => (
                  <Link key={p.id} to={`/real-estate/${p.slug}`} className="group space-y-3">
                    <EditorialImage src={p.images[0]} alt={p.title} aspectClass="aspect-[4/3]" />
                    <p className="text-xs text-[#52634A] tabular-nums">
                      {p.category} · ${p.price.toLocaleString()}
                    </p>
                    <h3 className="font-serif text-xl text-[#243D32] group-hover:text-[#B66F52]">{p.title}</h3>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};
