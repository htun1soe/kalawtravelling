import React, { useMemo, useState } from 'react';
import { Clock, MapPin, X } from 'lucide-react';
import { BookingRequestPanel } from '../components/BookingRequestPanel';
import { EditorialImage } from '../components/EditorialImage';
import { useApp } from '../context/AppContext';
import type { Restaurant } from '../types/kalaw';

export const DiningPage: React.FC = () => {
  const { restaurants, t } = useApp();
  const [priceFilter, setPriceFilter] = useState<'All' | '$' | '$$' | '$$$'>('All');
  const [selectedTable, setSelectedTable] = useState<Restaurant | null>(null);

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
            className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer ${
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
          <article key={rest.id} className="border border-[#D9CCB8] bg-[#F4F0E6] flex flex-col">
            <EditorialImage src={rest.image} alt={rest.name} aspectClass="aspect-[16/10]" />
            <div className="p-6 md:p-8 flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between text-xs text-[#52634A]">
                <span>{rest.cuisine}</span>
                <span className="font-medium text-[#243D32]">{rest.priceRange}</span>
              </div>
              <h2 className="font-serif text-3xl text-[#243D32]">{rest.name}</h2>
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
              <div className="pt-2 mt-auto">
                <button
                  type="button"
                  onClick={() => setSelectedTable(rest)}
                  className="px-4 py-2.5 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] transition-colors cursor-pointer"
                >
                  {t.actions.requestTable}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedTable && (
        <div
          className="fixed inset-0 z-50 bg-[#292B27]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#F4F0E6] border border-[#D9CCB8] max-w-lg w-full p-6 md:p-8 relative space-y-4 my-8">
            <button
              type="button"
              onClick={() => setSelectedTable(null)}
              aria-label="Close table reservation dialog"
              className="absolute top-4 right-4 p-2 text-[#52634A] hover:text-[#243D32] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B66F52]">{selectedTable.cuisine}</p>
              <h2 className="font-serif text-2xl text-[#243D32] mt-1">{selectedTable.name}</h2>
            </div>
            <BookingRequestPanel
              itemType="restaurant"
              itemId={selectedTable.id}
              itemTitle={selectedTable.name}
              unitPrice={0}
              priceLabel={selectedTable.openingHours}
              maxGuests={10}
              ctaLabel={t.actions.requestTable}
            />
          </div>
        </div>
      )}
    </div>
  );
};
