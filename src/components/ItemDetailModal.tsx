import React, { useEffect, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Film,
  Images,
  Mail,
  MapPin,
  Maximize2,
  Plus,
  Star,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BookingRequestPanel } from './BookingRequestPanel';
import { resolveMediaList } from './CardMediaCarousel';
import { FavoriteButton } from './FavoriteButton';
import type { MediaItem, ModalItem } from '../types/kalaw';

export const ItemDetailModal: React.FC = () => {
  const { activeModal, closeItemModal, openGallery, addToTripPlan, t } = useApp();
  const [mediaIdx, setMediaIdx] = useState(0);
  const [addedToPlan, setAddedToPlan] = useState(false);

  useEffect(() => {
    setMediaIdx(0);
    setAddedToPlan(false);
  }, [activeModal]);

  useEffect(() => {
    if (!activeModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeItemModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal, closeItemModal]);

  if (!activeModal) return null;

  const getMediaAndHeader = (
    item: ModalItem
  ): { title: string; eyebrow: string; media: MediaItem[]; favId?: string } => {
    switch (item.kind) {
      case 'destination':
        return {
          title: item.data.name,
          eyebrow: `${t.categories[item.data.category] || item.data.category} · ${item.data.location}`,
          media: resolveMediaList(item.data.media, [item.data.image], item.data.name),
          favId: item.data.id,
        };
      case 'stay':
        return {
          title: item.data.name,
          eyebrow: `${t.categories[item.data.category] || item.data.category} · ${item.data.location}`,
          media: resolveMediaList(item.data.media, item.data.images, item.data.name),
          favId: item.data.id,
        };
      case 'experience':
        return {
          title: item.data.title,
          eyebrow: `${t.categories[item.data.category] || item.data.category} · ${item.data.location}`,
          media: resolveMediaList(item.data.media, [item.data.image], item.data.title),
          favId: item.data.id,
        };
      case 'restaurant':
        return {
          title: item.data.name,
          eyebrow: `${item.data.cuisine} · ${item.data.location}`,
          media: resolveMediaList(item.data.media, [item.data.image], item.data.name),
        };
      case 'rental':
        return {
          title: item.data.name,
          eyebrow: `${t.categories[item.data.category] || item.data.category} · ${item.data.location}`,
          media: resolveMediaList(item.data.media, [item.data.image], item.data.name),
        };
      case 'property':
        return {
          title: item.data.title,
          eyebrow: `${t.categories[item.data.category] || item.data.category} · ${item.data.location}`,
          media: resolveMediaList(item.data.media, item.data.images, item.data.title),
          favId: item.data.id,
        };
      case 'article':
        return {
          title: item.data.title,
          eyebrow: `${item.data.category} · ${item.data.publishedAt} · ${item.data.readTime}`,
          media: resolveMediaList(item.data.media, [item.data.coverImage], item.data.title),
        };
    }
  };

  const { title, eyebrow, media, favId } = getMediaAndHeader(activeModal);
  const safeMediaIdx = mediaIdx >= media.length ? 0 : mediaIdx;
  const activeMedia = media[safeMediaIdx];

  return (
    <div
      className="fixed inset-0 z-50 bg-[#292B27]/75 backdrop-blur-xs overflow-y-auto p-3 sm:p-6 md:p-10 flex items-start justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={closeItemModal}
    >
      <div
        className="bg-[#F4F0E6] border border-[#D9CCB8] max-w-5xl w-full my-auto shadow-2xl overflow-hidden text-[#292B27]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 md:px-8 py-5 border-b border-[#D9CCB8] flex items-start justify-between gap-4 bg-[#EBE5D8]/60">
          <div className="min-w-0 space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-[#B66F52] font-medium">
              {eyebrow}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#243D32] leading-snug">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {favId && <FavoriteButton itemId={favId} compact />}
            <button
              type="button"
              onClick={closeItemModal}
              aria-label={t.actions.closeModal}
              className="p-2 border border-[#D9CCB8] text-[#243D32] hover:bg-[#243D32] hover:text-[#F4F0E6] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Gallery Showcase Inside Modal */}
        <div className="bg-[#292B27] p-4 md:p-6 space-y-3 border-b border-[#D9CCB8]">
          <div className="relative aspect-[16/9] max-h-[420px] w-full overflow-hidden bg-[#1D201C] flex items-center justify-center">
            {activeMedia.type === 'video' ? (
              <video
                key={activeMedia.src}
                src={activeMedia.src}
                poster={activeMedia.poster}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                key={activeMedia.src}
                src={activeMedia.src}
                alt={activeMedia.caption || title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            )}

            {media.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => setMediaIdx((prev) => (prev - 1 + media.length) % media.length)}
                  aria-label={t.actions.previousPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#F4F0E6]/90 text-[#243D32] hover:bg-[#F4F0E6] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMediaIdx((prev) => (prev + 1) % media.length)}
                  aria-label={t.actions.nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#F4F0E6]/90 text-[#243D32] hover:bg-[#F4F0E6] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => openGallery(title, media, safeMediaIdx, eyebrow, activeModal)}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#292B27]/85 hover:bg-[#243D32] text-[#F4F0E6] text-xs font-medium border border-[#F4F0E6]/25 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{t.actions.viewInGallery}</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {media.map((m, i) => {
                const thumb = m.type === 'video' ? m.poster || m.src : m.src;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setMediaIdx(i)}
                    className={`relative w-16 h-12 shrink-0 overflow-hidden border transition-all cursor-pointer ${
                      i === safeMediaIdx
                        ? 'border-[#F4F0E6] opacity-100'
                        : 'border-[#F4F0E6]/25 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={m.caption || `${title} ${i + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {m.type === 'video' && (
                      <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Film className="w-3.5 h-3.5 text-[#F4F0E6]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {activeMedia.caption && (
              <p className="text-xs text-[#D9CCB8] italic sm:text-right">
                {activeMedia.caption} ({safeMediaIdx + 1}/{media.length})
              </p>
            )}
          </div>
        </div>

        {/* Body Content by Item Type */}
        <div className="p-6 md:p-8">
          {activeModal.kind === 'destination' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <p className="font-serif italic text-lg text-[#243D32]">
                  {activeModal.data.shortDescription}
                </p>
                <p className="text-sm md:text-base text-[#292B27]/85 leading-relaxed">
                  {activeModal.data.editorialOverview}
                </p>
                <div className="border-t border-[#D9CCB8] pt-4 space-y-2.5">
                  <h3 className="font-serif text-xl text-[#243D32]">Field Highlights</h3>
                  <ul className="space-y-2 text-sm text-[#292B27]/85">
                    {activeModal.data.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2">
                        <span className="text-[#B66F52]">—</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-5 bg-[#EBE5D8]/60 border border-[#D9CCB8] p-5 space-y-4">
                <h3 className="font-serif text-xl text-[#243D32] border-b border-[#D9CCB8] pb-2">
                  Field Information
                </h3>
                <dl className="divide-y divide-[#D9CCB8] text-xs">
                  <div className="py-2.5 flex justify-between gap-3">
                    <dt className="text-[#52634A]">{t.actions.locationLabel}</dt>
                    <dd className="font-medium text-[#243D32] text-right">{activeModal.data.location}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-3 tabular-nums">
                    <dt className="text-[#52634A]">Elevation</dt>
                    <dd className="font-medium text-[#243D32] text-right">{activeModal.data.elevation}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-3">
                    <dt className="text-[#52634A]">Best Window</dt>
                    <dd className="font-medium text-[#243D32] text-right">{activeModal.data.bestTime}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-3">
                    <dt className="text-[#52634A]">Duration</dt>
                    <dd className="font-medium text-[#243D32] text-right">{activeModal.data.duration}</dd>
                  </div>
                  <div className="py-2.5 flex justify-between gap-3 tabular-nums">
                    <dt className="text-[#52634A]">Coordinates</dt>
                    <dd className="font-medium text-[#243D32] text-right">{activeModal.data.coordinates}</dd>
                  </div>
                </dl>

                <button
                  type="button"
                  onClick={() => {
                    addToTripPlan({
                      day: 1,
                      type: 'destination',
                      itemId: activeModal.data.id,
                      title: activeModal.data.name,
                      location: activeModal.data.location,
                      timeSlot: activeModal.data.bestTime,
                    });
                    setAddedToPlan(true);
                  }}
                  className="w-full py-3 px-4 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedToPlan ? <Compass className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  <span>{addedToPlan ? t.actions.addedToPlan : t.actions.addToTripPlan}</span>
                </button>
              </div>
            </div>
          )}

          {activeModal.kind === 'stay' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#52634A] border-b border-[#D9CCB8] pb-3 tabular-nums">
                  <span className="inline-flex items-center gap-1 font-medium text-[#243D32]">
                    <Star className="w-3.5 h-3.5 fill-[#B66F52] text-[#B66F52]" />
                    {activeModal.data.rating.toFixed(2)} ({activeModal.data.reviewCount} reviews)
                  </span>
                  <span>Up to {activeModal.data.maxGuests} Guests</span>
                  <span>{activeModal.data.bedrooms} Bedrooms</span>
                  <span>
                    {activeModal.data.availableFrom} → {activeModal.data.availableTo}
                  </span>
                </div>

                <p className="text-sm md:text-base text-[#292B27]/85 leading-relaxed">
                  {activeModal.data.description}
                </p>

                <div className="border-t border-[#D9CCB8] pt-4 space-y-3">
                  <h3 className="font-serif text-xl text-[#243D32]">Amenities &amp; Inclusions</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#292B27]/85">
                    {activeModal.data.amenities.map((a) => (
                      <li key={a} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#52634A] shrink-0" />
                        <span>{a}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    addToTripPlan({
                      day: 1,
                      type: 'stay',
                      itemId: activeModal.data.id,
                      title: activeModal.data.name,
                      location: activeModal.data.location,
                      timeSlot: 'Overnight Stay',
                    });
                    setAddedToPlan(true);
                  }}
                  className="px-4 py-2 border border-[#243D32] text-xs font-medium text-[#243D32] hover:bg-[#243D32] hover:text-[#F4F0E6] transition-colors cursor-pointer"
                >
                  {addedToPlan ? t.actions.addedToPlan : `+ ${t.actions.addToTripPlan}`}
                </button>
              </div>

              <div className="lg:col-span-5">
                <BookingRequestPanel
                  itemType="stay"
                  itemId={activeModal.data.id}
                  itemTitle={activeModal.data.name}
                  unitPrice={activeModal.data.pricePerNight}
                  priceLabel={t.home.perNight}
                  requireCheckOut={true}
                  maxGuests={activeModal.data.maxGuests}
                  ctaLabel={t.actions.submitBooking}
                />
              </div>
            </div>
          )}

          {activeModal.kind === 'experience' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#52634A] border-b border-[#D9CCB8] pb-3 tabular-nums">
                  <span>{activeModal.data.duration}</span>
                  <span>Difficulty: {activeModal.data.difficulty}</span>
                  <span>Max {activeModal.data.maxGroupSize} Guests</span>
                </div>
                <p className="text-sm md:text-base text-[#292B27]/85 leading-relaxed">
                  {activeModal.data.shortDescription}
                </p>
                <p className="text-sm text-[#243D32]">
                  Guide: <span className="font-medium">{activeModal.data.guideName}</span>
                </p>
                <div className="border-t border-[#D9CCB8] pt-4 space-y-2.5">
                  <h3 className="font-serif text-xl text-[#243D32]">What Is Included</h3>
                  <ul className="space-y-2 text-sm text-[#292B27]/85">
                    {activeModal.data.included.map((inc) => (
                      <li key={inc} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#52634A] shrink-0" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-5">
                <BookingRequestPanel
                  itemType="experience"
                  itemId={activeModal.data.id}
                  itemTitle={activeModal.data.title}
                  unitPrice={activeModal.data.pricePerGuest}
                  priceLabel={t.home.perGuest}
                  maxGuests={activeModal.data.maxGroupSize}
                  ctaLabel={t.actions.requestDate}
                />
              </div>
            </div>
          )}

          {activeModal.kind === 'restaurant' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#52634A] border-b border-[#D9CCB8] pb-3">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B66F52]" />
                    {activeModal.data.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#52634A]" />
                    {activeModal.data.openingHours}
                  </span>
                  <span className="font-medium text-[#243D32]">{activeModal.data.priceRange}</span>
                </div>
                <p className="text-sm md:text-base text-[#292B27]/85 leading-relaxed">
                  {activeModal.data.description || activeModal.data.shortDescription}
                </p>
                <div className="border-t border-[#D9CCB8] pt-4 space-y-2.5">
                  <h3 className="font-serif text-xl text-[#243D32]">Signature Dishes</h3>
                  <ul className="space-y-2 text-sm text-[#292B27]/85">
                    {activeModal.data.signatureDishes.map((dish) => (
                      <li key={dish} className="flex items-center gap-2">
                        <span className="text-[#B66F52]">—</span>
                        <span>{dish}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-5">
                <BookingRequestPanel
                  itemType="restaurant"
                  itemId={activeModal.data.id}
                  itemTitle={activeModal.data.name}
                  unitPrice={0}
                  priceLabel={activeModal.data.openingHours}
                  maxGuests={10}
                  ctaLabel={t.actions.requestTable}
                />
              </div>
            </div>
          )}

          {activeModal.kind === 'rental' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-5">
                <div className="flex flex-wrap items-center gap-4 text-xs text-[#52634A] border-b border-[#D9CCB8] pb-3">
                  <span>{activeModal.data.transmissionOrService}</span>
                  <span>{activeModal.data.capacity}</span>
                  <span className="font-medium text-[#243D32]">
                    {activeModal.data.includesDriver ? 'Driver Included' : 'Self-Drive'}
                  </span>
                </div>
                <p className="text-sm md:text-base text-[#292B27]/85 leading-relaxed">
                  {activeModal.data.shortDescription}
                </p>
                <div className="border-t border-[#D9CCB8] pt-4 space-y-2.5">
                  <h3 className="font-serif text-xl text-[#243D32]">Terms &amp; Service Notes</h3>
                  <ul className="space-y-2 text-sm text-[#292B27]/85">
                    {activeModal.data.terms.map((term) => (
                      <li key={term} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#52634A] shrink-0" />
                        <span>{term}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-5">
                <BookingRequestPanel
                  itemType="rental"
                  itemId={activeModal.data.id}
                  itemTitle={activeModal.data.name}
                  unitPrice={activeModal.data.pricePerDay}
                  priceLabel={t.home.perDay}
                  requireCheckOut={!activeModal.data.includesDriver}
                  maxGuests={6}
                  ctaLabel={t.actions.requestVehicle}
                />
              </div>
            </div>
          )}

          {activeModal.kind === 'property' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 space-y-6">
                {/* Explicit Real Estate Summary Grid: Title, Location, Land/Property Type, Area, Price, Contact, Description */}
                <div className="bg-[#EBE5D8]/60 border border-[#D9CCB8] p-5 space-y-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#D9CCB8] pb-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-[#52634A]">
                        {t.actions.priceLabel}
                      </p>
                      <p className="font-serif text-3xl text-[#243D32] tabular-nums">
                        ${activeModal.data.price.toLocaleString()}
                        {activeModal.data.priceUnit === 'per month' && (
                          <span className="text-sm text-[#52634A] font-sans"> {t.home.perMonth}</span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#243D32]">{activeModal.data.status}</span>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                    <div>
                      <dt className="text-[#52634A]">{t.actions.locationLabel}</dt>
                      <dd className="font-medium text-[#243D32] mt-0.5">{activeModal.data.location}</dd>
                    </div>
                    <div>
                      <dt className="text-[#52634A]">{t.actions.landTypeLabel}</dt>
                      <dd className="font-medium text-[#243D32] mt-0.5">
                        {t.categories[activeModal.data.category] || activeModal.data.category} ·{' '}
                        {activeModal.data.titleStatus}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#52634A]">{t.actions.areaLabel}</dt>
                      <dd className="font-medium text-[#243D32] mt-0.5 tabular-nums">
                        {activeModal.data.areaSize}
                        {activeModal.data.bedrooms
                          ? ` · ${activeModal.data.bedrooms} Bed / ${activeModal.data.bathrooms || 2} Bath`
                          : ''}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[#52634A]">{t.actions.contactLabel}</dt>
                      <dd className="font-medium text-[#243D32] mt-0.5 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#B66F52]" />
                          <span>{activeModal.data.agentName}</span>
                        </div>
                        <a
                          href={`mailto:${activeModal.data.agentContact}`}
                          className="inline-flex items-center gap-1.5 text-[#B66F52] hover:underline"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>{activeModal.data.agentContact}</span>
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-[#243D32]">{t.actions.descriptionLabel}</h3>
                  <p className="text-sm md:text-base text-[#292B27]/85 leading-relaxed">
                    {activeModal.data.description || activeModal.data.shortDescription}
                  </p>
                </div>

                {activeModal.data.features && activeModal.data.features.length > 0 && (
                  <div className="border-t border-[#D9CCB8] pt-4 space-y-3">
                    <h3 className="font-serif text-xl text-[#243D32]">Key Features</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#292B27]/85">
                      {activeModal.data.features.map((feat) => (
                        <li key={feat} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-[#52634A] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="lg:col-span-5">
                <BookingRequestPanel
                  itemType="property"
                  itemId={activeModal.data.id}
                  itemTitle={activeModal.data.title}
                  unitPrice={0}
                  priceLabel="Private Viewing & Inquiry"
                  maxGuests={4}
                  ctaLabel="Request Property Viewing"
                />
              </div>
            </div>
          )}

          {activeModal.kind === 'article' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8 space-y-5">
                <p className="font-serif italic text-xl text-[#52634A]">
                  {activeModal.data.subtitle}
                </p>
                <p className="text-xs text-[#292B27]/70">By {activeModal.data.author}</p>
                <div className="space-y-4 border-t border-[#D9CCB8] pt-5">
                  {activeModal.data.paragraphs.map((para, idx) => (
                    <p key={idx} className="text-sm md:text-base text-[#292B27]/90 leading-[1.8]">
                      {para}
                    </p>
                  ))}
                </div>
                <blockquote className="py-4 border-t border-b border-[#D9CCB8] font-serif italic text-xl md:text-2xl text-[#243D32] leading-snug">
                  “{activeModal.data.pullQuote}”
                </blockquote>
              </div>

              <aside className="lg:col-span-4 space-y-4">
                <div className="bg-[#EBE5D8]/60 border border-[#D9CCB8] p-5 space-y-2">
                  <p className="text-xs uppercase tracking-widest text-[#B66F52]">Margin Field Note</p>
                  <p className="text-sm text-[#292B27]/85 leading-relaxed">
                    {activeModal.data.marginNote}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openGallery(title, media, safeMediaIdx, eyebrow, activeModal)}
                  className="w-full py-2.5 px-4 border border-[#243D32] text-xs font-medium text-[#243D32] hover:bg-[#243D32] hover:text-[#F4F0E6] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Images className="w-3.5 h-3.5" />
                  <span>{t.actions.viewInGallery}</span>
                </button>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
