import React, { useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { BookingRequestPanel } from '../components/BookingRequestPanel';
import { EditorialImage } from '../components/EditorialImage';
import { FavoriteButton } from '../components/FavoriteButton';
import { useApp } from '../context/AppContext';
import type { Experience, ExperienceCategory } from '../types/kalaw';

const CATEGORIES: Array<'All' | ExperienceCategory> = [
  'All',
  'Guided Trekking',
  'Cultural Immersion',
  'Photography Tours',
  'Nature Exploration',
  'Culinary Workshops',
];

export const ExperiencesPage: React.FC = () => {
  const { experiences, addToTripPlan, t } = useApp();
  const [selectedCat, setSelectedCat] = useState<'All' | ExperienceCategory>('All');
  const [bookingExp, setBookingExp] = useState<Experience | null>(null);
  const [plannedId, setPlannedId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      selectedCat === 'All'
        ? experiences
        : experiences.filter((e) => e.category === selectedCat),
    [experiences, selectedCat]
  );

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="max-w-3xl space-y-4 pb-10 border-b border-[#D9CCB8]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
          {t.pages.expEyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
          {t.pages.expTitle}
        </h1>
        <p className="text-base text-[#292B27]/80 leading-relaxed">
          {t.pages.expDesc}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 py-6 border-b border-[#D9CCB8]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
              selectedCat === cat
                ? 'bg-[#243D32] text-[#F4F0E6]'
                : 'text-[#292B27]/80 hover:bg-[#D9CCB8]/50'
            }`}
          >
            {t.categories[cat] || cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
        {filtered.map((exp) => (
          <article
            key={exp.id}
            className="group border border-[#D9CCB8] bg-[#F4F0E6] flex flex-col"
          >
            <div className="relative">
              <EditorialImage src={exp.image} alt={exp.title} aspectClass="aspect-[16/10]" />
              <div className="absolute top-3 right-3">
                <FavoriteButton itemId={exp.id} compact />
              </div>
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between text-xs text-[#52634A]">
                <span>{t.categories[exp.category] || exp.category} · {exp.duration}</span>
                <span>{exp.difficulty}</span>
              </div>
              <h2 className="font-serif text-3xl text-[#243D32]">{exp.title}</h2>
              <p className="text-sm text-[#292B27]/85 leading-relaxed">{exp.shortDescription}</p>
              <div className="text-xs text-[#52634A] space-y-1">
                <p>Guide: <span className="text-[#292B27] font-medium">{exp.guideName}</span></p>
                <p>{exp.included.join(' · ')}</p>
              </div>
              <div className="pt-4 mt-auto border-t border-[#D9CCB8] flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-serif text-2xl text-[#243D32] tabular-nums">
                    ${exp.pricePerGuest}
                  </span>
                  <span className="text-xs text-[#52634A]"> {t.home.perGuest} (max {exp.maxGroupSize})</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addToTripPlan({
                        day: 2,
                        type: 'experience',
                        itemId: exp.id,
                        title: exp.title,
                        location: exp.location,
                        timeSlot: exp.duration,
                      });
                      setPlannedId(exp.id);
                    }}
                    className="px-3.5 py-2 border border-[#243D32]/30 text-xs font-medium text-[#243D32] rounded-sm hover:border-[#243D32] cursor-pointer"
                  >
                    {plannedId === exp.id ? t.actions.addedToPlan : `+ ${t.actions.addToTripPlan}`}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingExp(exp)}
                    className="px-4 py-2 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] transition-colors cursor-pointer"
                  >
                    {t.actions.requestDate}
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Booking Drawer Modal */}
      {bookingExp && (
        <div
          className="fixed inset-0 z-50 bg-[#292B27]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={`Request ${bookingExp.title}`}
        >
          <div className="bg-[#F4F0E6] border border-[#D9CCB8] max-w-lg w-full p-6 md:p-8 relative space-y-4 my-8">
            <button
              type="button"
              onClick={() => setBookingExp(null)}
              aria-label="Close booking dialog"
              className="absolute top-4 right-4 p-2 text-[#52634A] hover:text-[#243D32] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#B66F52]">
                {t.categories[bookingExp.category] || bookingExp.category}
              </p>
              <h2 className="font-serif text-2xl text-[#243D32] mt-1">{bookingExp.title}</h2>
            </div>
            <BookingRequestPanel
              itemType="experience"
              itemId={bookingExp.id}
              itemTitle={bookingExp.title}
              unitPrice={bookingExp.pricePerGuest}
              priceLabel={t.home.perGuest}
              maxGuests={bookingExp.maxGroupSize}
              ctaLabel={t.actions.requestDate}
            />
          </div>
        </div>
      )}
    </div>
  );
};
