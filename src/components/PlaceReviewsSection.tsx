import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Check,
  Compass,
  Footprints,
  Landmark,
  Leaf,
  MapPin,
  Navigation,
  PenLine,
  Star,
  Sunrise,
  ThumbsUp,
  Utensils,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getWaypointById } from '../data/kalawCoordinates';
import type { ModalItem, PlaceReview, TravelGoalTag } from '../types/kalaw';

interface PlaceReviewsSectionProps {
  scopedPlaceId?: string;
  compact?: boolean;
  defaultOpenForm?: boolean;
}

const GOAL_ORDER: TravelGoalTag[] = [
  'sunrise',
  'trekking',
  'heritage',
  'photography',
  'calmRest',
  'culinary',
];

function getGoalIcon(goal: TravelGoalTag | 'all') {
  switch (goal) {
    case 'sunrise':
      return Sunrise;
    case 'trekking':
      return Footprints;
    case 'heritage':
      return Landmark;
    case 'photography':
      return Camera;
    case 'calmRest':
      return Leaf;
    case 'culinary':
      return Utensils;
    default:
      return Compass;
  }
}

export const PlaceReviewsSection: React.FC<PlaceReviewsSectionProps> = ({
  scopedPlaceId,
  compact = false,
  defaultOpenForm = false,
}) => {
  const {
    reviews,
    destinations,
    stays,
    experiences,
    restaurants,
    openItemModal,
    closeItemModal,
    addPlaceReview,
    markHelpfulReview,
    startVisitNavigation,
    user,
    t,
  } = useApp();

  const [selectedGoal, setSelectedGoal] = useState<'all' | TravelGoalTag>('all');
  const [selectedPlaceFilter, setSelectedPlaceFilter] = useState<string>(scopedPlaceId || 'all');
  const [helpfulVoted, setHelpfulVoted] = useState<Record<string, boolean>>({});
  const [showForm, setShowForm] = useState(defaultOpenForm);

  // Submission form state
  const placeCatalogOptions = useMemo(() => {
    const list: Array<{ id: string; kind: PlaceReview['placeKind']; name: string; group: string }> = [
      ...destinations.map((d) => ({
        id: d.id,
        kind: 'destination' as const,
        name: d.name,
        group: t.navigationMap.placesGroup,
      })),
      ...stays.map((s) => ({
        id: s.id,
        kind: 'stay' as const,
        name: s.name,
        group: t.nav.stays,
      })),
      ...experiences.map((e) => ({
        id: e.id,
        kind: 'experience' as const,
        name: e.title,
        group: t.nav.experiences,
      })),
      ...restaurants.map((r) => ({
        id: r.id,
        kind: 'restaurant' as const,
        name: r.name,
        group: t.nav.dining,
      })),
    ];
    return list;
  }, [destinations, stays, experiences, restaurants, t]);

  const defaultPlaceId = scopedPlaceId || destinations[0]?.id || placeCatalogOptions[0]?.id || 'dest-1';
  const [formPlaceId, setFormPlaceId] = useState<string>(defaultPlaceId);
  const [formGoal, setFormGoal] = useState<TravelGoalTag>('sunrise');
  const [formRating, setFormRating] = useState<number>(5);
  const [formAuthorName, setFormAuthorName] = useState<string>(user?.name || '');
  const [formAuthorOrigin, setFormAuthorOrigin] = useState<string>(user?.location || '');
  const [formVisitedSeason, setFormVisitedSeason] = useState<string>('November 2026');
  const [formHeadline, setFormHeadline] = useState<string>('');
  const [formStory, setFormStory] = useState<string>('');
  const [formGoalTip, setFormGoalTip] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState(false);

  const effectivePlaceId = scopedPlaceId || selectedPlaceFilter;

  const filteredReviews = useMemo(() => {
    return reviews.filter((rev) => {
      const matchesPlace = effectivePlaceId === 'all' || rev.placeId === effectivePlaceId;
      const matchesGoal = selectedGoal === 'all' || rev.goal === selectedGoal;
      return matchesPlace && matchesGoal;
    });
  }, [reviews, effectivePlaceId, selectedGoal]);

  const resolveModalTarget = (rev: PlaceReview): ModalItem | null => {
    if (rev.placeKind === 'destination') {
      const found = destinations.find((d) => d.id === rev.placeId);
      return found ? { kind: 'destination', data: found } : null;
    }
    if (rev.placeKind === 'stay') {
      const found = stays.find((s) => s.id === rev.placeId);
      return found ? { kind: 'stay', data: found } : null;
    }
    if (rev.placeKind === 'experience') {
      const found = experiences.find((e) => e.id === rev.placeId);
      return found ? { kind: 'experience', data: found } : null;
    }
    if (rev.placeKind === 'restaurant') {
      const found = restaurants.find((r) => r.id === rev.placeId);
      return found ? { kind: 'restaurant', data: found } : null;
    }
    return null;
  };

  const handleHelpful = async (reviewId: string) => {
    if (helpfulVoted[reviewId]) return;
    setHelpfulVoted((prev) => ({ ...prev, [reviewId]: true }));
    try {
      await markHelpfulReview(reviewId);
    } catch {
      setHelpfulVoted((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);

    if (
      !formAuthorName.trim() ||
      !formHeadline.trim() ||
      !formStory.trim() ||
      !formGoalTip.trim()
    ) {
      setFormError(t.reviews.form.missingFieldsError);
      return;
    }

    const chosenOption =
      placeCatalogOptions.find((opt) => opt.id === (scopedPlaceId || formPlaceId)) ||
      placeCatalogOptions[0];

    setSubmitting(true);
    try {
      await addPlaceReview({
        placeId: chosenOption?.id || formPlaceId,
        placeKind: chosenOption?.kind || 'destination',
        placeName: chosenOption?.name || 'Kalaw',
        goal: formGoal,
        authorName: formAuthorName.trim(),
        authorOrigin: formAuthorOrigin.trim() || 'Kalaw Visitor',
        visitedSeason: formVisitedSeason.trim() || 'November 2026',
        rating: formRating,
        headline: formHeadline.trim(),
        story: formStory.trim(),
        goalTip: formGoalTip.trim(),
      });
      setFormHeadline('');
      setFormStory('');
      setFormGoalTip('');
      setFormSuccess(true);
      setShowForm(false);
    } catch {
      setFormError(t.reviews.form.serverError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={compact ? 'space-y-6' : 'space-y-10'}>
      {/* Section Header */}
      {!compact ? (
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#A4834C]/30 pb-6">
          <div className="space-y-2 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#A4834C] font-medium">
              {t.reviews.eyebrow}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#1B3128] headline-balance">
              {t.reviews.title}
            </h2>
            <p className="text-sm md:text-base text-[#222420]/80 leading-relaxed">
              {t.reviews.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForm((prev) => !prev);
              setFormSuccess(false);
              setFormError(null);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1B3128] text-[#FAF7F0] text-xs font-medium rounded-sm hover:bg-[#4F6047] transition-colors shrink-0 cursor-pointer whitespace-nowrap"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5 text-[#C7AA74]" />}
            <span>{showForm ? t.reviews.cancelShare : t.reviews.shareButton}</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#A4834C]/25 pb-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#A4834C] font-medium">
              {t.reviews.eyebrow}
            </p>
            <p className="text-xs text-[#4F6047] mt-0.5">
              {filteredReviews.length} {t.reviews.matchingPlacesNote}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setShowForm((prev) => !prev);
              setFormSuccess(false);
              setFormError(null);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1B3128] text-[#FAF7F0] text-xs font-medium rounded-sm hover:bg-[#4F6047] transition-colors cursor-pointer whitespace-nowrap"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <PenLine className="w-3.5 h-3.5 text-[#C7AA74]" />}
            <span>{showForm ? t.reviews.cancelShare : t.reviews.shareButton}</span>
          </button>
        </div>
      )}

      {/* Confirmation Notice after publishing */}
      {formSuccess && (
        <div className="bg-[#F2ECE0] border border-[#A4834C] px-5 py-3.5 flex items-center justify-between gap-3 text-xs text-[#1B3128]">
          <div className="flex items-center gap-2.5">
            <Check className="w-4 h-4 text-[#4F6047] shrink-0" />
            <span>{t.reviews.form.successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFormSuccess(false)}
            className="text-[#4F6047] hover:text-[#1B3128] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Interactive Experience & Goal Tip Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#F2ECE0] luxury-frame p-6 md:p-8 space-y-6"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#A4834C]/25 pb-4">
            <div>
              <h3 className="font-serif text-2xl text-[#1B3128]">{t.reviews.form.title}</h3>
              <p className="text-xs text-[#4F6047] mt-1">{t.reviews.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {!scopedPlaceId && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#1B3128]">
                  {t.reviews.form.placeLabel}
                </label>
                <select
                  value={formPlaceId}
                  onChange={(e) => setFormPlaceId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#1B3128] focus:outline-none focus:border-[#1B3128]"
                >
                  {placeCatalogOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name} ({opt.group})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#1B3128]">
                {t.reviews.form.goalLabel}
              </label>
              <select
                value={formGoal}
                onChange={(e) => setFormGoal(e.target.value as TravelGoalTag)}
                className="w-full px-3 py-2.5 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#1B3128] focus:outline-none focus:border-[#1B3128]"
              >
                {GOAL_ORDER.map((goalKey) => (
                  <option key={goalKey} value={goalKey}>
                    {t.reviews.goals[goalKey]}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#1B3128]">
                {t.reviews.form.ratingLabel}
              </label>
              <div className="flex items-center gap-1.5 py-2">
                {[1, 2, 3, 4, 5].map((starVal) => (
                  <button
                    key={starVal}
                    type="button"
                    onClick={() => setFormRating(starVal)}
                    aria-label={`${starVal} stars`}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        starVal <= formRating
                          ? 'fill-[#A4834C] text-[#A4834C]'
                          : 'text-[#D9CCB8]'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-medium text-[#1B3128] tabular-nums">
                  {formRating}.0 / 5
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#1B3128]">
                {t.reviews.form.authorName} *
              </label>
              <input
                type="text"
                value={formAuthorName}
                onChange={(e) => setFormAuthorName(e.target.value)}
                placeholder={t.reviews.form.authorNamePlaceholder}
                className="w-full px-3 py-2.5 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#1B3128]">
                {t.reviews.form.authorOrigin}
              </label>
              <input
                type="text"
                value={formAuthorOrigin}
                onChange={(e) => setFormAuthorOrigin(e.target.value)}
                placeholder={t.reviews.form.authorOriginPlaceholder}
                className="w-full px-3 py-2.5 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#1B3128]">
                {t.reviews.form.visitedSeason}
              </label>
              <input
                type="text"
                value={formVisitedSeason}
                onChange={(e) => setFormVisitedSeason(e.target.value)}
                placeholder={t.reviews.form.visitedSeasonPlaceholder}
                className="w-full px-3 py-2.5 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#1B3128]">
              {t.reviews.form.headline} *
            </label>
            <input
              type="text"
              value={formHeadline}
              onChange={(e) => setFormHeadline(e.target.value)}
              placeholder={t.reviews.form.headlinePlaceholder}
              className="w-full px-3 py-2.5 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#1B3128]">
                {t.reviews.form.story} *
              </label>
              <textarea
                rows={3}
                value={formStory}
                onChange={(e) => setFormStory(e.target.value)}
                placeholder={t.reviews.form.storyPlaceholder}
                className="w-full px-3 py-2.5 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-[#1B3128]">
                {t.reviews.form.goalTip} *
              </label>
              <textarea
                rows={3}
                value={formGoalTip}
                onChange={(e) => setFormGoalTip(e.target.value)}
                placeholder={t.reviews.form.goalTipPlaceholder}
                className="w-full px-3 py-2.5 bg-[#FAF7F0] border border-[#A4834C]/60 text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
              />
            </div>
          </div>

          {formError && (
            <p className="text-xs text-[#B66F52] font-medium">{formError}</p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2.5 border border-[#D9CCB8] text-xs font-medium text-[#4F6047] hover:text-[#1B3128] cursor-pointer"
            >
              {t.reviews.cancelShare}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-[#1B3128] text-[#FAF7F0] text-xs font-medium rounded-sm hover:bg-[#4F6047] disabled:opacity-60 transition-colors cursor-pointer"
            >
              {submitting ? t.reviews.form.submittingBtn : t.reviews.form.submitBtn}
            </button>
          </div>
        </form>
      )}

      {/* Goal & Place Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#A4834C]/25 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedGoal('all')}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
              selectedGoal === 'all'
                ? 'bg-[#1B3128] text-[#FAF7F0]'
                : 'text-[#222420]/80 hover:bg-[#D9CCB8]/50'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#A4834C]" />
            <span>{t.reviews.allGoals}</span>
          </button>

          {GOAL_ORDER.map((goalKey) => {
            const Icon = getGoalIcon(goalKey);
            const isActive = selectedGoal === goalKey;
            return (
              <button
                key={goalKey}
                type="button"
                onClick={() => setSelectedGoal(goalKey)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1B3128] text-[#FAF7F0]'
                    : 'text-[#222420]/80 hover:bg-[#D9CCB8]/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C7AA74]' : 'text-[#A4834C]'}`} />
                <span>{t.reviews.goals[goalKey]}</span>
              </button>
            );
          })}
        </div>

        {!scopedPlaceId && (
          <div className="flex items-center gap-2.5 shrink-0">
            <label htmlFor="review-place-filter" className="text-xs text-[#4F6047] whitespace-nowrap">
              {t.reviews.filterByPlace}:
            </label>
            <select
              id="review-place-filter"
              value={selectedPlaceFilter}
              onChange={(e) => setSelectedPlaceFilter(e.target.value)}
              className="px-3 py-2 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#1B3128] focus:outline-none focus:border-[#1B3128]"
            >
              <option value="all">{t.reviews.allPlaces}</option>
              {placeCatalogOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Review Cards Grid */}
      {filteredReviews.length === 0 ? (
        <div className="py-12 text-center space-y-3 bg-[#F2ECE0]/60 border border-[#A4834C]/25 p-6">
          <p className="font-serif text-xl text-[#1B3128]">{t.reviews.noReviewsMatch}</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setSelectedGoal('all');
                if (!scopedPlaceId) setSelectedPlaceFilter('all');
              }}
              className="px-4 py-2 border border-[#1B3128] text-xs font-medium text-[#1B3128] hover:bg-[#1B3128] hover:text-[#FAF7F0] transition-colors cursor-pointer"
            >
              {t.reviews.resetGoalFilter}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-[#1B3128] text-[#FAF7F0] text-xs font-medium cursor-pointer"
            >
              {t.reviews.shareButton}
            </button>
          </div>
        </div>
      ) : (
        <div
          className={
            compact
              ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
              : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'
          }
        >
          {filteredReviews.map((rev) => {
            const GoalIcon = getGoalIcon(rev.goal);
            const modalTarget = resolveModalTarget(rev);
            const hasVoted = Boolean(helpfulVoted[rev.id]);

            return (
              <article
                key={rev.id}
                className="flex flex-col bg-[#FAF7F0] border border-[#A4834C]/30 p-6 space-y-4 transition-colors hover:border-[#A4834C]/70"
              >
                {/* Top Meta: Goal & Star Rating */}
                <div className="flex items-start justify-between gap-3 border-b border-[#D9CCB8] pb-3">
                  <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-[#A4834C] font-medium">
                    <GoalIcon className="w-3.5 h-3.5 shrink-0" />
                    <span>{t.reviews.goals[rev.goal]}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-[#1B3128] tabular-nums shrink-0">
                    <Star className="w-3.5 h-3.5 fill-[#A4834C] text-[#A4834C]" />
                    <span>{rev.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Place Name & Story Headline */}
                <div className="space-y-1.5">
                  {!scopedPlaceId && (
                    <div className="flex items-center gap-1.5 text-xs text-[#4F6047]">
                      <MapPin className="w-3.5 h-3.5 text-[#A4834C] shrink-0" />
                      {modalTarget ? (
                        <button
                          type="button"
                          onClick={() => openItemModal(modalTarget)}
                          className="font-medium text-[#1B3128] hover:text-[#A4834C] transition-colors text-left cursor-pointer"
                        >
                          {rev.placeName}
                        </button>
                      ) : (
                        <span className="font-medium text-[#1B3128]">{rev.placeName}</span>
                      )}
                    </div>
                  )}
                  <h3 className="font-serif text-xl text-[#1B3128] leading-snug">
                    “{rev.headline}”
                  </h3>
                </div>

                {/* Firsthand Experience Story */}
                <p className="text-sm text-[#222420]/85 leading-relaxed flex-1">
                  {rev.story}
                </p>

                {/* Actionable Goal Guidance Callout */}
                <div className="bg-[#F2ECE0] border border-[#A4834C]/30 p-3.5 space-y-1">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#4F6047] font-medium">
                    {t.reviews.goalTipLabel}
                  </p>
                  <p className="text-xs text-[#1B3128] leading-relaxed">
                    {rev.goalTip}
                  </p>
                </div>

                {/* Author Attribution & Actions */}
                <div className="pt-2 border-t border-[#D9CCB8] space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <div>
                      <p className="font-medium text-[#1B3128]">{rev.authorName}</p>
                      <p className="text-[#4F6047] text-[11px]">
                        {rev.authorOrigin} · {rev.visitedSeason}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleHelpful(rev.id)}
                      disabled={hasVoted}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-[11px] font-medium rounded-sm transition-colors cursor-pointer tabular-nums ${
                        hasVoted
                          ? 'bg-[#1B3128] text-[#FAF7F0] border-[#1B3128]'
                          : 'border-[#D9CCB8] text-[#4F6047] hover:border-[#A4834C] hover:text-[#1B3128]'
                      }`}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>
                        {t.reviews.helpfulLabel} ({rev.helpfulCount})
                      </span>
                    </button>
                  </div>

                  {!scopedPlaceId && (
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                      {modalTarget ? (
                        <button
                          type="button"
                          onClick={() => openItemModal(modalTarget)}
                          className="font-medium text-[#1B3128] hover:text-[#A4834C] transition-colors cursor-pointer"
                        >
                          {t.reviews.explorePlace} →
                        </button>
                      ) : (
                        <span />
                      )}
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/destinations?navigate=${rev.placeId}#places-navigator`}
                          onClick={closeItemModal}
                          className="inline-flex items-center gap-1 font-medium text-[#4F6047] hover:text-[#1B3128] transition-colors"
                        >
                          <span>{t.reviews.directionsToPlace}</span>
                        </Link>
                        {getWaypointById(rev.placeId) && (
                          <button
                            type="button"
                            onClick={() => startVisitNavigation(rev.placeId)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-[#1B3128] text-[#FAF7F0] hover:bg-[#A4834C] rounded-sm font-medium transition-colors cursor-pointer"
                          >
                            <Navigation className="w-3 h-3 text-[#C7AA74]" />
                            <span>{t.actions.visitPlace}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
