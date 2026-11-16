import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { BookingRequestPanel } from '../components/BookingRequestPanel';
import { EditorialImage } from '../components/EditorialImage';
import { useApp } from '../context/AppContext';
import type { Rental, RentalCategory } from '../types/kalaw';

const CATEGORIES: Array<'All' | RentalCategory> = [
  'All',
  'Motorbike Rentals',
  'Car Rentals',
  'Private Drivers',
  'Local Transfers',
];

export const RentalsPage: React.FC = () => {
  const { rentals, t } = useApp();
  const [cat, setCat] = useState<'All' | RentalCategory>('All');
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);

  const filtered = useMemo(
    () => (cat === 'All' ? rentals : rentals.filter((r) => r.category === cat)),
    [rentals, cat]
  );

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="max-w-3xl space-y-4 pb-10 border-b border-[#D9CCB8]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
          {t.pages.rentalsEyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
          {t.pages.rentalsTitle}
        </h1>
        <p className="text-base text-[#292B27]/80 leading-relaxed">
          {t.pages.rentalsDesc}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 py-6 border-b border-[#D9CCB8]">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
              cat === c
                ? 'bg-[#243D32] text-[#F4F0E6]'
                : 'text-[#292B27]/80 hover:bg-[#D9CCB8]/50'
            }`}
          >
            {t.categories[c] || c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
        {filtered.map((rental) => (
          <article key={rental.id} className="border border-[#D9CCB8] bg-[#F4F0E6] flex flex-col">
            <EditorialImage src={rental.image} alt={rental.name} aspectClass="aspect-[16/10]" />
            <div className="p-6 md:p-8 flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between text-xs text-[#52634A]">
                <span>{t.categories[rental.category] || rental.category} · {rental.location}</span>
                <span>{rental.includesDriver ? 'Driver Included' : 'Self-Drive'}</span>
              </div>
              <h2 className="font-serif text-3xl text-[#243D32]">{rental.name}</h2>
              <p className="text-sm text-[#292B27]/85 leading-relaxed">{rental.shortDescription}</p>
              <p className="text-xs text-[#52634A]">
                {rental.transmissionOrService} · {rental.capacity}
              </p>
              <ul className="space-y-1 text-xs text-[#292B27]/80 border-t border-[#D9CCB8] pt-3">
                {rental.terms.map((term) => (
                  <li key={term}>— {term}</li>
                ))}
              </ul>
              <div className="pt-4 mt-auto border-t border-[#D9CCB8] flex items-center justify-between">
                <div>
                  <span className="font-serif text-2xl text-[#243D32] tabular-nums">
                    ${rental.pricePerDay}
                  </span>
                  <span className="text-xs text-[#52634A]"> {t.home.perDay}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedRental(rental)}
                  className="px-4 py-2.5 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] transition-colors cursor-pointer"
                >
                  {t.actions.requestVehicle}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedRental && (
        <div
          className="fixed inset-0 z-50 bg-[#292B27]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#F4F0E6] border border-[#D9CCB8] max-w-lg w-full p-6 md:p-8 relative space-y-4 my-8">
            <button
              type="button"
              onClick={() => setSelectedRental(null)}
              aria-label="Close vehicle request dialog"
              className="absolute top-4 right-4 p-2 text-[#52634A] hover:text-[#243D32] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B66F52]">
                {t.categories[selectedRental.category] || selectedRental.category}
              </p>
              <h2 className="font-serif text-2xl text-[#243D32] mt-1">{selectedRental.name}</h2>
            </div>
            <BookingRequestPanel
              itemType="rental"
              itemId={selectedRental.id}
              itemTitle={selectedRental.name}
              unitPrice={selectedRental.pricePerDay}
              priceLabel={t.home.perDay}
              requireCheckOut={!selectedRental.includesDriver}
              maxGuests={6}
              ctaLabel={t.actions.requestVehicle}
            />
          </div>
        </div>
      )}
    </div>
  );
};
