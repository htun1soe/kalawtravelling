import React, { useMemo, useState } from 'react';
import { Clock, MapPin } from 'lucide-react';
import { CardMediaCarousel, resolveMediaList } from '../components/CardMediaCarousel';
import { useApp } from '../context/AppContext';

export const DiningPage: React.FC = () => {
  const { restaurants, openItemModal, t } = useApp();
  const [priceFilter, setPriceFilter] = useState<'All' | '$' | '$$' | '$$$'>('All');

  const filtered = useMemo(
    () =>
      priceFilter === 'All'
        ? restaurants
        : restaurants.filter((r) => r.priceRange === priceFilter),
    [restaurants, priceFilter]
  );

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="max-w-3xl space-y-4 pb-10 border-b border-[#D9CCB8]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
          {t.pages.diningEyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
          {t.pages.diningTitle}
        </h1>
        <p className="text-base text-[#292B27]/80 leading-relaxed">
          {t.pages.diningDesc}
        </p>
      </div>

      <div className="flex items-center gap-2 py-6 border-b border-[#D9CCB8]">
        {(['All', '$', '$$', '$$$'] as const).map((tier) => (
          <button
            key={tier}
            type="button"
            onClick={() => setPriceFilter(tier)}
            className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
              priceFilter === tier
                ? 'bg-[#243D32] text-[#F4F0E6]'
                : 'text-[#292B27]/80 hover:bg-[#D9CCB8]/50'
            }`}
          >
            {tier === 'All' ? t.categories.All : `${tier} ${t.nav.dining}`}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
        {filtered.map((rest) => (
          <article key={rest.id} className="group border border-[#D9CCB8] bg-[#F4F0E6] flex flex-col">
            <CardMediaCarousel
              title={rest.name}
              subtitle={`${rest.cuisine} · ${rest.location}`}
              media={resolveMediaList(rest.media, [rest.image], rest.name)}
              aspectClass="aspect-[16/10]"
              onOpenInfo={() => openItemModal({ kind: 'restaurant', data: rest })}
              modalItem={{ kind: 'restaurant', data: rest }}
            />
            <div className="p-6 md:p-8 flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between text-xs text-[#52634A]">
                <span>{rest.cuisine}</span>
                <span className="font-medium text-[#243D32]">{rest.priceRange}</span>
              </div>
              <h2 className="font-serif text-3xl text-[#243D32]">
                <button
                  type="button"
                  onClick={() => openItemModal({ kind: 'restaurant', data: rest })}
                  className="text-left hover:text-[#B66F52] transition-colors cursor-pointer"
                >
                  {rest.name}
                </button>
              </h2>
              <p className="text-sm text-[#292B27]/85 leading-relaxed">{rest.shortDescription}</p>
              <div className="space-y-1.5 text-xs text-[#52634A] pt-1">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B66F52]" />
                  <span>{rest.location}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#52634A]" />
                  <span>{rest.openingHours}</span>
                </p>
              </div>
              <div className="border-t border-[#D9CCB8] pt-4">
                <p className="text-xs uppercase tracking-wider text-[#52634A] mb-2">
                  Signature Dishes
                </p>
                <p className="text-sm text-[#243D32]">
                  {rest.signatureDishes.join(' · ')}
                </p>
              </div>
              <div className="pt-2 mt-auto flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => openItemModal({ kind: 'restaurant', data: rest })}
                  className="px-4 py-2.5 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {t.actions.requestTable}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
