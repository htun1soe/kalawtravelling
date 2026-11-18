import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  FileText,
  Film,
  Images,
  Mail,
  MapPin,
  Maximize2,
  MessageSquareText,
  Navigation,
  Plus,
  Star,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWaypointById } from '../data/kalawCoordinates';
import { BookingRequestPanel } from './BookingRequestPanel';
import { resolveMediaList } from './CardMediaCarousel';
import { FavoriteButton } from './FavoriteButton';
import { PlaceReviewsSection } from './PlaceReviewsSection';
import { PlacesNavigationMap } from './PlacesNavigationMap';
import type { MediaItem, ModalItem } from '../types/kalaw';

export const ItemDetailModal: React.FC = () => {
  const { activeModal, closeItemModal, openGallery, addToTripPlan, startVisitNavigation, t } = useApp();
  const [mediaIdx, setMediaIdx] = useState(0);
  const [addedToPlan, setAddedToPlan] = useState(false);
  const [modalTab, setModalTab] = useState<'dossier' | 'directions' | 'reviews'>('dossier');

  useEffect(() => {
    setMediaIdx(0);
    setAddedToPlan(false);
    setModalTab('dossier');
  }, [activeModal?.kind, activeModal?.data.id]);

  useEffect(() => {
    if (!activeModal) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeItemModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeModal, closeItemModal]);

  if (!activeModal) return null;

  const hasWaypoint = Boolean(getWaypointById(activeModal.data.id));
  const supportsReviews =
    activeModal.kind === 'destination' ||
    activeModal.kind === 'stay' ||
    activeModal.kind === 'experience' ||
    activeModal.kind === 'restaurant';

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
      className="fixed inset-0 z-50 bg-[#1B211D]/80 backdrop-blur-xs overflow-y-auto p-3 sm:p-6 md:p-10 flex items-start justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={closeItemModal}
    >
      <div
        className="bg-[#FAF7F0] border border-[#A4834C]/45 max-w-5xl w-full my-auto shadow-2xl overflow-hidden text-[#222420]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 md:px-8 py-5 border-b border-[#A4834C]/30 flex items-start justify-between gap-4 bg-[#F2ECE0]">
          <div className="min-w-0 space-y-1">
            <p className="text-xs uppercase tracking-[0.18em] text-[#A4834C] font-medium">
              {eyebrow}
            </p>
            <h2 className="font-serif text-2xl md:text-3xl text-[#1B3128] leading-relaxed">
              {title}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {favId && <FavoriteButton itemId={favId} compact />}
            <button
              type="button"
              onClick={closeItemModal}
              aria-label={t.actions.closeModal}
              className="p-2 border border-[#A4834C]/40 text-[#1B3128] hover:bg-[#1B3128] hover:text-[#FAF7F0] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Media Gallery Showcase Inside Modal */}
        <div className="bg-[#1B201C] p-4 md:p-6 space-y-3 border-b border-[#A4834C]/30">
          <div className="relative aspect-[16/9] max-h-[420px] w-full overflow-hidden bg-[#141714] flex items-center justify-center">
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#FAF7F0]/90 text-[#1B3128] hover:bg-[#FAF7F0] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setMediaIdx((prev) => (prev + 1) % media.length)}
                  aria-label={t.actions.nextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-[#FAF7F0]/90 text-[#1B3128] hover:bg-[#FAF7F0] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => openGallery(title, media, safeMediaIdx, eyebrow, activeModal)}
              className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B201C]/85 hover:bg-[#1B3128] text-[#FAF7F0] text-xs font-medium border border-[#C7AA74]/40 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5 text-[#C7AA74]" />
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
                        ? 'border-[#C7AA74] opacity-100'
                        : 'border-[#FAF7F0]/25 opacity-60 hover:opacity-90'
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
                        <Film className="w-3.5 h-3.5 text-[#FAF7F0]" />
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

        {/* Dossier / Route / Reviews Switcher */}
        {(hasWaypoint || supportsReviews) && (
          <div className="px-6 md:px-8 pt-4 bg-[#FAF7F0] border-b border-[#A4834C]/25 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setModalTab('dossier')}
                className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  modalTab === 'dossier'
                    ? 'border-[#1B3128] text-[#1B3128]'
                    : 'border-transparent text-[#4F6047] hover:text-[#1B3128]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{t.modal.dossierAndBooking}</span>
              </button>
              {hasWaypoint && (
                <button
                  type="button"
                  onClick={() => setModalTab('directions')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                    modalTab === 'directions'
                      ? 'border-[#A4834C] text-[#1B3128]'
                      : 'border-transparent text-[#4F6047] hover:text-[#1B3128]'
                  }`}
                >
                  <Navigation className="w-3.5 h-3.5 text-[#A4834C]" />
                  <span>{t.modal.directionsAndRoute}</span>
                </button>
              )}
              {supportsReviews && (
                <button
                  type="button"
                  onClick={() => setModalTab('reviews')}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                    modalTab === 'reviews'
                      ? 'border-[#A4834C] text-[#1B3128]'
                      : 'border-transparent text-[#4F6047] hover:text-[#1B3128]'
                  }`}
                >
                  <MessageSquareText className="w-3.5 h-3.5 text-[#A4834C]" />
                  <span>{t.reviews.tabLabel}</span>
                </button>
              )}
            </div>

            {hasWaypoint && (
              <div className="flex items-center gap-3 pb-2">
                <button
                  type="button"
                  onClick={() => startVisitNavigation(activeModal.data.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#A4834C] hover:bg-[#1B3128] text-[#FAF7F0] text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>{t.navigationMap.visitAction}</span>
                </button>
                <Link
                  to={`/destinations?navigate=${activeModal.data.id}#places-navigator`}
                  onClick={closeItemModal}
                  className="text-xs font-medium text-[#A4834C] hover:text-[#1B3128] transition-colors whitespace-nowrap"
                >
                  {t.modal.openFullNavigator} →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 md:p-8">
          {supportsReviews && modalTab === 'reviews' ? (
            <PlaceReviewsSection scopedPlaceId={activeModal.data.id} compact />
          ) : hasWaypoint && modalTab === 'directions' ? (
            <PlacesNavigationMap
              initialDestinationId={activeModal.data.id}
              compact
              hideGoalFilters
            />
          ) : (
            <>
              {activeModal.kind === 'destination' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-5">
                    <p className="font-serif italic text-lg text-[#1B3128]">
                      {activeModal.data.shortDescription}
                    </p>
                    <p className="text-sm md:text-base text-[#222420]/85 leading-relaxed">
                      {activeModal.data.editorialOverview}
                    </p>
                    <div className="border-t border-[#A4834C]/25 pt-4 space-y-2.5">
                      <h3 className="font-serif text-xl text-[#1B3128]">
                        {t.modal.fieldHighlights}
                      </h3>
                      <ul className="space-y-2 text-sm text-[#222420]/85">
                        {activeModal.data.highlights.map((h) => (
                          <li key={h} className="flex items-start gap-2">
                            <span className="text-[#A4834C]">—</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-[#F2ECE0] luxury-frame p-5 space-y-4">
                    <h3 className="font-serif text-xl text-[#1B3128] border-b border-[#A4834C]/25 pb-2">
                      {t.modal.fieldInfo}
                    </h3>
                    <dl className="divide-y divide-[#D9CCB8] text-xs">
                      <div className="py-2.5 flex justify-between gap-3">
                        <dt className="text-[#4F6047]">{t.actions.locationLabel}</dt>
                        <dd className="font-medium text-[#1B3128] text-right">
                          {activeModal.data.location}
                        </dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-3 tabular-nums">
                        <dt className="text-[#4F6047]">{t.modal.elevation}</dt>
                        <dd className="font-medium text-[#1B3128] text-right">
                          {activeModal.data.elevation}
                        </dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-3">
                        <dt className="text-[#4F6047]">{t.modal.bestWindow}</dt>
                        <dd className="font-medium text-[#1B3128] text-right">
                          {activeModal.data.bestTime}
                        </dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-3">
                        <dt className="text-[#4F6047]">{t.modal.duration}</dt>
                        <dd className="font-medium text-[#1B3128] text-right">
                          {activeModal.data.duration}
                        </dd>
                      </div>
                      <div className="py-2.5 flex justify-between gap-3 tabular-nums">
                        <dt className="text-[#4F6047]">{t.modal.coordinates}</dt>
                        <dd className="font-medium text-[#1B3128] text-right">
                          {activeModal.data.coordinates}
                        </dd>
                      </div>
                    </dl>

                    <div className="space-y-2.5">
                      <button
                        type="button"
                        onClick={() => setModalTab('directions')}
                        className="w-full py-2.5 px-4 border border-[#A4834C] text-[#1B3128] text-xs font-medium rounded-sm hover:bg-[#A4834C]/15 inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Navigation className="w-4 h-4 text-[#A4834C]" />
                        <span>{t.modal.directionsAndRoute}</span>
                      </button>

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
                        className="w-full py-3 px-4 bg-[#1B3128] text-[#FAF7F0] text-xs font-medium rounded-sm hover:bg-[#4F6047] inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {addedToPlan ? <Compass className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        <span>{addedToPlan ? t.actions.addedToPlan : t.actions.addToTripPlan}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeModal.kind === 'stay' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-7 space-y-5">
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#4F6047] border-b border-[#A4834C]/25 pb-3 tabular-nums">
                      <span className="inline-flex items-center gap-1 font-medium text-[#1B3128]">
                        <Star className="w-3.5 h-3.5 fill-[#A4834C] text-[#A4834C]" />
                        {activeModal.data.rating.toFixed(2)} ({activeModal.data.reviewCount}{' '}
                        {t.modal.reviews})
                      </span>
                      <span>
                        {t.modal.upToGuests} {activeModal.data.maxGuests} {t.booking.guestPlural}
                      </span>
                      <span>
                        {activeModal.data.bedrooms} {t.modal.bedrooms}
                      </span>
                      <span>
                        {activeModal.data.availableFrom} → {activeModal.data.availableTo}
                      </span>
                    </div>

                    <p className="text-sm md:text-base text-[#222420]/85 leading-relaxed">
                      {activeModal.data.description}
                    </p>

                    <div className="border-t border-[#A4834C]/25 pt-4 space-y-3">
                      <h3 className="font-serif text-xl text-[#1B3128]">
                        {t.modal.amenitiesInclusions}
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-[#222420]/85">
                        {activeModal.data.amenities.map((a) => (
                          <li key={a} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#4F6047] shrink-0" />
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
                          timeSlot: t.modal.overnightStay,
                        });
                        setAddedToPlan(true);
                      }}
                      className="px-4 py-2 border border-[#1B3128] text-xs font-medium text-[#1B3128] hover:bg-[#1B3128] hover:text-[#FAF7F0] transition-colors cursor-pointer"
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
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#4F6047] border-b border-[#A4834C]/25 pb-3 tabular-nums">
                      <span>{activeModal.data.duration}</span>
                      <span>
                        {t.modal.difficulty}:{' '}
                        {t.categories[activeModal.data.difficulty] || activeModal.data.difficulty}
                      </span>
                      <span>
                        {t.modal.maxGuests} {activeModal.data.maxGroupSize} {t.booking.guestPlural}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-[#222420]/85 leading-relaxed">
                      {activeModal.data.shortDescription}
                    </p>
                    <p className="text-sm text-[#1B3128]">
                      {t.modal.guide}:{' '}
                      <span className="font-medium">{activeModal.data.guideName}</span>
                    </p>
                    <div className="border-t border-[#A4834C]/25 pt-4 space-y-2.5">
                      <h3 className="font-serif text-xl text-[#1B3128]">
                        {t.modal.whatIsIncluded}
                      </h3>
                      <ul className="space-y-2 text-sm text-[#222420]/85">
                        {activeModal.data.included.map((inc) => (
                          <li key={inc} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#4F6047] shrink-0" />
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
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#4F6047] border-b border-[#A4834C]/25 pb-3">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#A4834C]" />
                        {activeModal.data.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#4F6047]" />
                        {activeModal.data.openingHours}
                      </span>
                      <span className="font-medium text-[#1B3128]">
                        {activeModal.data.priceRange}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-[#222420]/85 leading-relaxed">
                      {activeModal.data.description || activeModal.data.shortDescription}
                    </p>
                    <div className="border-t border-[#A4834C]/25 pt-4 space-y-2.5">
                      <h3 className="font-serif text-xl text-[#1B3128]">
                        {t.modal.signatureDishes}
                      </h3>
                      <ul className="space-y-2 text-sm text-[#222420]/85">
                        {activeModal.data.signatureDishes.map((dish) => (
                          <li key={dish} className="flex items-center gap-2">
                            <span className="text-[#A4834C]">—</span>
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
                    <div className="flex flex-wrap items-center gap-4 text-xs text-[#4F6047] border-b border-[#A4834C]/25 pb-3">
                      <span>{activeModal.data.transmissionOrService}</span>
                      <span>{activeModal.data.capacity}</span>
                      <span className="font-medium text-[#1B3128]">
                        {activeModal.data.includesDriver
                          ? t.modal.driverIncluded
                          : t.modal.selfDrive}
                      </span>
                    </div>
                    <p className="text-sm md:text-base text-[#222420]/85 leading-relaxed">
                      {activeModal.data.shortDescription}
                    </p>
                    <div className="border-t border-[#A4834C]/25 pt-4 space-y-2.5">
                      <h3 className="font-serif text-xl text-[#1B3128]">{t.modal.termsNotes}</h3>
                      <ul className="space-y-2 text-sm text-[#222420]/85">
                        {activeModal.data.terms.map((term) => (
                          <li key={term} className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-[#4F6047] shrink-0" />
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
                    <div className="bg-[#F2ECE0] luxury-frame p-5 space-y-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-[#A4834C]/25 pb-3">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-[#4F6047]">
                            {t.actions.priceLabel}
                          </p>
                          <p className="font-serif text-3xl text-[#1B3128] tabular-nums">
                            ${activeModal.data.price.toLocaleString()}
                            {activeModal.data.priceUnit === 'per month' && (
                              <span className="text-sm text-[#4F6047] font-sans">
                                {' '}
                                {t.home.perMonth}
                              </span>
                            )}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-[#1B3128]">
                          {t.categories[activeModal.data.status] || activeModal.data.status}
                        </span>
                      </div>

                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-xs">
                        <div>
                          <dt className="text-[#4F6047]">{t.actions.locationLabel}</dt>
                          <dd className="font-medium text-[#1B3128] mt-0.5">
                            {activeModal.data.location}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#4F6047]">{t.actions.landTypeLabel}</dt>
                          <dd className="font-medium text-[#1B3128] mt-0.5">
                            {t.categories[activeModal.data.category] || activeModal.data.category}{' '}
                            · {activeModal.data.titleStatus}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#4F6047]">{t.actions.areaLabel}</dt>
                          <dd className="font-medium text-[#1B3128] mt-0.5 tabular-nums">
                            {activeModal.data.areaSize}
                            {activeModal.data.bedrooms
                              ? ` · ${activeModal.data.bedrooms} ${t.modal.bedShort} / ${
                                  activeModal.data.bathrooms || 2
                                } ${t.modal.bathShort}`
                              : ''}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[#4F6047]">{t.actions.contactLabel}</dt>
                          <dd className="font-medium text-[#1B3128] mt-0.5 space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-[#A4834C]" />
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
                      <h3 className="font-serif text-xl text-[#1B3128]">
                        {t.actions.descriptionLabel}
                      </h3>
                      <p className="text-sm md:text-base text-[#222420]/85 leading-relaxed">
                        {activeModal.data.description || activeModal.data.shortDescription}
                      </p>
                    </div>

                    {activeModal.data.features && activeModal.data.features.length > 0 && (
                      <div className="border-t border-[#A4834C]/25 pt-4 space-y-3">
                        <h3 className="font-serif text-xl text-[#1B3128]">
                          {t.modal.keyFeatures}
                        </h3>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#222420]/85">
                          {activeModal.data.features.map((feat) => (
                            <li key={feat} className="flex items-center gap-2">
                              <Check className="w-4 h-4 text-[#4F6047] shrink-0" />
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
                      priceLabel={t.modal.privateViewing}
                      maxGuests={4}
                      ctaLabel={t.modal.requestViewing}
                    />
                  </div>
                </div>
              )}

              {activeModal.kind === 'article' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  <div className="lg:col-span-8 space-y-5">
                    <p className="font-serif italic text-xl text-[#4F6047]">
                      {activeModal.data.subtitle}
                    </p>
                    <p className="text-xs text-[#222420]/70">
                      {t.modal.byAuthor} {activeModal.data.author}
                    </p>
                    <div className="space-y-4 border-t border-[#A4834C]/25 pt-5">
                      {activeModal.data.paragraphs.map((para, idx) => (
                        <p key={idx} className="text-sm md:text-base text-[#222420]/90 leading-[1.85]">
                          {para}
                        </p>
                      ))}
                    </div>
                    <blockquote className="py-4 border-t border-b border-[#A4834C]/30 font-serif italic text-xl md:text-2xl text-[#1B3128] leading-relaxed">
                      “{activeModal.data.pullQuote}”
                    </blockquote>
                  </div>

                  <aside className="lg:col-span-4 space-y-4">
                    <div className="bg-[#F2ECE0] luxury-frame p-5 space-y-2">
                      <p className="text-xs uppercase tracking-widest text-[#A4834C] font-medium">
                        {t.modal.marginFieldNote}
                      </p>
                      <p className="text-sm text-[#222420]/85 leading-relaxed">
                        {activeModal.data.marginNote}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openGallery(title, media, safeMediaIdx, eyebrow, activeModal)}
                      className="w-full py-2.5 px-4 border border-[#1B3128] text-xs font-medium text-[#1B3128] hover:bg-[#1B3128] hover:text-[#FAF7F0] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Images className="w-3.5 h-3.5" />
                      <span>{t.actions.viewInGallery}</span>
                    </button>
                  </aside>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
