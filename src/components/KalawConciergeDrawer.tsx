import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Flame,
  MessageCircle,
  Plus,
  RotateCcw,
  Send,
  SlidersHorizontal,
  TrendingUp,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  KALAW_SEASONAL_EVENTS_EN,
  KALAW_SEASONAL_EVENTS_MY,
  KALAW_TRENDS_EN,
  KALAW_TRENDS_MY,
} from '../data/kalawSeasonal';
import { fetchSeasonalPulse, sendAssistantChatMessage } from '../services/api';
import type {
  AssistantItineraryStop,
  AssistantMessage,
  AssistantPreferences,
  AssistantRecommendation,
  ModalItem,
  TravelGoalTag,
} from '../types/kalaw';

const GOAL_INTERESTS: TravelGoalTag[] = [
  'sunrise',
  'trekking',
  'heritage',
  'photography',
  'calmRest',
  'culinary',
];

export const KalawConciergeDrawer: React.FC = () => {
  const {
    lang,
    t,
    destinations,
    stays,
    experiences,
    restaurants,
    rentals,
    properties,
    tripPlan,
    addToTripPlan,
    openItemModal,
    activeModal,
    galleryState,
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'seasons'>('chat');
  const [showPrefs, setShowPrefs] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addedKeys, setAddedKeys] = useState<Record<string, boolean>>({});
  const [addedBatchIds, setAddedBatchIds] = useState<Record<string, boolean>>({});

  const [prefs, setPrefs] = useState<AssistantPreferences>({
    days: 2,
    pace: 'balanced',
    budget: 'moderate',
    companion: 'couple',
    season: t.assistant.seasons[0],
    interests: ['sunrise', 'heritage'],
  });

  // Sync default season label cleanly when language toggles if untouched
  useEffect(() => {
    setPrefs((prev) => ({
      ...prev,
      season: t.assistant.seasons.includes(prev.season) ? prev.season : t.assistant.seasons[0],
    }));
  }, [t.assistant.seasons]);

  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: t.assistant.welcomeMessage,
      createdAt: new Date().toISOString(),
    },
  ]);

  // Keep welcome message synchronized with language if user hasn't started chatting yet
  useEffect(() => {
    setMessages((prev) =>
      prev.length === 1 && prev[0].id === 'welcome'
        ? [{ ...prev[0], text: t.assistant.welcomeMessage }]
        : prev
    );
  }, [t.assistant.welcomeMessage]);

  const [seasonalPulse, setSeasonalPulse] = useState(() => ({
    events: lang === 'my' ? KALAW_SEASONAL_EVENTS_MY : KALAW_SEASONAL_EVENTS_EN,
    trends: lang === 'my' ? KALAW_TRENDS_MY : KALAW_TRENDS_EN,
  }));

  useEffect(() => {
    let active = true;
    fetchSeasonalPulse(lang)
      .then((data) => {
        if (active && data?.events && data?.trends) {
          setSeasonalPulse(data);
        }
      })
      .catch(() => {
        if (active) {
          setSeasonalPulse({
            events: lang === 'my' ? KALAW_SEASONAL_EVENTS_MY : KALAW_SEASONAL_EVENTS_EN,
            trends: lang === 'my' ? KALAW_TRENDS_MY : KALAW_TRENDS_EN,
          });
        }
      });
    return () => {
      active = false;
    };
  }, [lang]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && activeTab === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen, activeTab]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const modalLookupMap = useMemo(() => {
    const map = new Map<string, ModalItem>();
    destinations.forEach((d) => map.set(d.id, { kind: 'destination', data: d }));
    stays.forEach((s) => map.set(s.id, { kind: 'stay', data: s }));
    experiences.forEach((e) => map.set(e.id, { kind: 'experience', data: e }));
    restaurants.forEach((r) => map.set(r.id, { kind: 'restaurant', data: r }));
    rentals.forEach((r) => map.set(r.id, { kind: 'rental', data: r }));
    properties.forEach((p) => map.set(p.id, { kind: 'property', data: p }));
    return map;
  }, [destinations, stays, experiences, restaurants, rentals, properties]);

  const toggleInterest = (goal: TravelGoalTag) => {
    setPrefs((prev) => {
      const exists = prev.interests.includes(goal);
      if (exists && prev.interests.length === 1) return prev;
      return {
        ...prev,
        interests: exists
          ? prev.interests.filter((g) => g !== goal)
          : [...prev.interests, goal],
      };
    });
  };

  const sendMessage = async (
    textToSend: string,
    customPrefs?: AssistantPreferences,
    isRetry = false
  ) => {
    const trimmed = textToSend.trim();
    if (!trimmed || loading) return;

    const nextMessages = isRetry
      ? messages
      : [
          ...messages,
          {
            id: `user-${Date.now()}`,
            role: 'user' as const,
            text: trimmed,
            createdAt: new Date().toISOString(),
          },
        ];

    if (!isRetry) {
      setMessages(nextMessages);
      setInput('');
    }
    setErrorMsg(null);
    setLoading(true);
    setActiveTab('chat');

    const historyForApi = nextMessages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, text: m.text }));

    try {
      const result = await sendAssistantChatMessage({
        messages: historyForApi,
        lang,
        preferences: customPrefs || prefs,
        currentTripPlan: tripPlan.map((tp) => ({
          day: tp.day,
          title: tp.title,
          timeSlot: tp.timeSlot,
        })),
      });

      const assistantMsg: AssistantMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: result.reply,
        structured: result,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to reach Kalaw Guide right now. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCustomPlan = () => {
    const interestLabels = prefs.interests.map((g) => t.reviews.goals[g]).join(', ');
    const prompt =
      lang === 'my'
        ? `${prefs.days} ရက်ကြာ ကလောခရီးစဉ်ကို ${t.assistant.companions[prefs.companion]} အတွက် (${t.assistant.paces[prefs.pace]}နှုန်း၊ ${t.assistant.budgets[prefs.budget]}အဆင့်၊ ${prefs.season}၊ စိတ်ဝင်စားမှု - ${interestLabels}) အတိုင်း နေ့အလိုက် စီစဉ်ပေးပါ။`
        : `Please create a personalized ${prefs.days}-day Kalaw itinerary for ${t.assistant.companions[prefs.companion]} travelers with a ${t.assistant.paces[prefs.pace].toLowerCase()} pace, ${t.assistant.budgets[prefs.budget].toLowerCase()} budget style, visiting during ${prefs.season}, focused on ${interestLabels}.`;
    setShowPrefs(false);
    sendMessage(prompt, prefs);
  };

  const handleAddStop = (stop: AssistantItineraryStop, key: string) => {
    const validTypes = ['destination', 'stay', 'experience', 'restaurant', 'rental'] as const;
    const stopType = validTypes.includes(stop.type as (typeof validTypes)[number])
      ? stop.type
      : 'destination';
    addToTripPlan({
      day: Number(stop.day) || 1,
      type: stopType,
      itemId: stop.itemId || `custom-${Date.now()}`,
      title: stop.title,
      location: stop.location || 'Kalaw',
      timeSlot: stop.timeSlot || 'Morning',
    });
    setAddedKeys((prev) => ({ ...prev, [key]: true }));
  };

  const handleAddAllStops = (msgId: string, stops: AssistantItineraryStop[]) => {
    stops.forEach((stop, idx) => {
      handleAddStop(stop, `${msgId}-stop-${idx}`);
    });
    setAddedBatchIds((prev) => ({ ...prev, [msgId]: true }));
  };

  const handleInspectRecommendation = (rec: AssistantRecommendation) => {
    const target = modalLookupMap.get(rec.itemId);
    if (target) {
      openItemModal(target);
      setIsOpen(false);
    }
  };

  const handleInspectId = (itemId?: string) => {
    if (!itemId) return;
    const target = modalLookupMap.get(itemId);
    if (target) {
      openItemModal(target);
      setIsOpen(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'model',
        text: t.assistant.welcomeMessage,
        createdAt: new Date().toISOString(),
      },
    ]);
    setErrorMsg(null);
  };

  // Hide launch toggle automatically when full-screen modals or galleries are open
  if (activeModal || galleryState) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={t.assistant.launchLabel}
          className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-[#1B3128] text-[#FAF7F0] border border-[#C7AA74]/60 shadow-lg hover:bg-[#243D32] transition-colors rounded-sm cursor-pointer whitespace-nowrap"
        >
          <MessageCircle className="w-4 h-4 text-[#C7AA74]" />
          <span className="text-xs font-medium tracking-wide">{t.assistant.launchLabel}</span>
        </button>
      ) : (
        <aside
          aria-label={t.assistant.drawerTitle}
          className="w-[calc(100vw-2rem)] sm:w-[430px] h-[min(82vh,640px)] bg-[#FAF7F0] border border-[#A4834C]/60 shadow-2xl flex flex-col overflow-hidden text-[#222420]"
        >
          {/* Concierge Header */}
          <div className="bg-[#1B3128] text-[#FAF7F0] px-4 py-3.5 border-b border-[#C7AA74]/35 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-serif text-lg leading-tight text-[#FAF7F0] truncate">
                {t.assistant.drawerTitle}
              </p>
              <p className="text-[11px] text-[#D9CCB8] truncate mt-0.5">
                {t.assistant.drawerSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {messages.length > 1 && (
                <button
                  type="button"
                  onClick={handleResetChat}
                  title={t.assistant.resetChat}
                  aria-label={t.assistant.resetChat}
                  className="p-1.5 text-[#D9CCB8] hover:text-[#FAF7F0] hover:bg-white/10 rounded-sm transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={t.assistant.closeLabel}
                className="p-1.5 text-[#FAF7F0] hover:bg-white/10 rounded-sm transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Drawer Tabs: Ask & Plan | Seasons & Trends */}
          <div className="bg-[#F2ECE0] border-b border-[#A4834C]/30 px-3 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('chat')}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'chat'
                    ? 'border-[#1B3128] text-[#1B3128]'
                    : 'border-transparent text-[#4F6047] hover:text-[#1B3128]'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-[#A4834C]" />
                <span>{t.assistant.tabChat}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seasons')}
                className={`inline-flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === 'seasons'
                    ? 'border-[#1B3128] text-[#1B3128]'
                    : 'border-transparent text-[#4F6047] hover:text-[#1B3128]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#A4834C]" />
                <span>{t.assistant.tabSeasons}</span>
              </button>
            </div>

            {activeTab === 'chat' && (
              <button
                type="button"
                onClick={() => setShowPrefs((p) => !p)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap ${
                  showPrefs
                    ? 'bg-[#1B3128] text-[#FAF7F0] border-[#1B3128]'
                    : 'border-[#A4834C]/45 text-[#1B3128] hover:bg-[#FAF7F0]'
                }`}
              >
                <SlidersHorizontal className="w-3 h-3" />
                <span>{t.assistant.togglePrefs}</span>
                {showPrefs ? (
                  <ChevronUp className="w-3 h-3" />
                ) : (
                  <ChevronDown className="w-3 h-3" />
                )}
              </button>
            )}
          </div>

          {activeTab === 'chat' ? (
            <>
              {/* Collapsible Personalization Factors Panel */}
              {showPrefs && (
                <div className="bg-[#F2ECE0] border-b border-[#A4834C]/35 p-4 space-y-3 text-xs overflow-y-auto max-h-[55%] shrink-0">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="space-y-1">
                      <span className="text-[11px] text-[#4F6047] block">
                        {t.assistant.daysLabel}
                      </span>
                      <select
                        value={prefs.days}
                        onChange={(e) =>
                          setPrefs((p) => ({ ...p, days: Number(e.target.value) }))
                        }
                        className="w-full px-2.5 py-1.5 bg-[#FAF7F0] border border-[#D9CCB8] text-[#1B3128] text-xs"
                      >
                        {[1, 2, 3, 4, 5].map((d) => (
                          <option key={d} value={d}>
                            {d} {d === 1 ? t.booking.daySingular : lang === 'my' ? 'ရက်' : 'days'}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1">
                      <span className="text-[11px] text-[#4F6047] block">
                        {t.assistant.companionLabel}
                      </span>
                      <select
                        value={prefs.companion}
                        onChange={(e) =>
                          setPrefs((p) => ({
                            ...p,
                            companion: e.target.value as AssistantPreferences['companion'],
                          }))
                        }
                        className="w-full px-2.5 py-1.5 bg-[#FAF7F0] border border-[#D9CCB8] text-[#1B3128] text-xs"
                      >
                        {(['solo', 'couple', 'family', 'friends'] as const).map((c) => (
                          <option key={c} value={c}>
                            {t.assistant.companions[c]}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1">
                      <span className="text-[11px] text-[#4F6047] block">
                        {t.assistant.paceLabel}
                      </span>
                      <select
                        value={prefs.pace}
                        onChange={(e) =>
                          setPrefs((p) => ({
                            ...p,
                            pace: e.target.value as AssistantPreferences['pace'],
                          }))
                        }
                        className="w-full px-2.5 py-1.5 bg-[#FAF7F0] border border-[#D9CCB8] text-[#1B3128] text-xs"
                      >
                        {(['relaxed', 'balanced', 'active'] as const).map((paceKey) => (
                          <option key={paceKey} value={paceKey}>
                            {t.assistant.paces[paceKey]}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1">
                      <span className="text-[11px] text-[#4F6047] block">
                        {t.assistant.budgetLabel}
                      </span>
                      <select
                        value={prefs.budget}
                        onChange={(e) =>
                          setPrefs((p) => ({
                            ...p,
                            budget: e.target.value as AssistantPreferences['budget'],
                          }))
                        }
                        className="w-full px-2.5 py-1.5 bg-[#FAF7F0] border border-[#D9CCB8] text-[#1B3128] text-xs"
                      >
                        {(['budget', 'moderate', 'luxury'] as const).map((bKey) => (
                          <option key={bKey} value={bKey}>
                            {t.assistant.budgets[bKey]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="space-y-1 block">
                    <span className="text-[11px] text-[#4F6047] block">
                      {t.assistant.seasonLabel}
                    </span>
                    <select
                      value={prefs.season}
                      onChange={(e) => setPrefs((p) => ({ ...p, season: e.target.value }))}
                      className="w-full px-2.5 py-1.5 bg-[#FAF7F0] border border-[#D9CCB8] text-[#1B3128] text-xs"
                    >
                      {t.assistant.seasons.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="space-y-1.5">
                    <span className="text-[11px] text-[#4F6047] block">
                      {t.assistant.interestsLabel}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {GOAL_INTERESTS.map((goalKey) => {
                        const selected = prefs.interests.includes(goalKey);
                        return (
                          <button
                            key={goalKey}
                            type="button"
                            onClick={() => toggleInterest(goalKey)}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-sm border transition-colors cursor-pointer whitespace-nowrap ${
                              selected
                                ? 'bg-[#1B3128] text-[#FAF7F0] border-[#1B3128]'
                                : 'bg-[#FAF7F0] text-[#4F6047] border-[#D9CCB8] hover:border-[#A4834C]'
                            }`}
                          >
                            {t.reviews.goals[goalKey]}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGenerateCustomPlan}
                    disabled={loading}
                    className="w-full py-2.5 bg-[#1B3128] text-[#FAF7F0] text-xs font-medium rounded-sm hover:bg-[#4F6047] disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {t.assistant.buildPlanBtn}
                  </button>
                </div>
              )}

              {/* Messages Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((m) => {
                  const isUser = m.role === 'user';
                  const stops = m.structured?.suggestedItinerary || [];
                  const recs = m.structured?.recommendedItems || [];
                  const seasonalNotes = m.structured?.seasonalHighlights || [];
                  const allAdded = Boolean(addedBatchIds[m.id]);

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
                    >
                      <div
                        className={`max-w-[92%] px-3.5 py-2.5 text-xs md:text-[13px] leading-relaxed whitespace-pre-line ${
                          isUser
                            ? 'bg-[#1B3128] text-[#FAF7F0]'
                            : 'bg-[#F2ECE0] border border-[#A4834C]/30 text-[#222420]'
                        }`}
                      >
                        {m.text}
                      </div>

                      {/* Structured Itinerary Output */}
                      {!isUser && stops.length > 0 && (
                        <div className="w-full bg-[#FAF7F0] border border-[#A4834C]/40 p-3 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D9CCB8] pb-2">
                            <p className="text-[11px] uppercase tracking-wider font-medium text-[#A4834C]">
                              {t.assistant.suggestedPlanHeading}
                            </p>
                            <button
                              type="button"
                              onClick={() => handleAddAllStops(m.id, stops)}
                              disabled={allAdded}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
                                allAdded
                                  ? 'bg-[#4F6047] text-[#FAF7F0]'
                                  : 'bg-[#1B3128] text-[#FAF7F0] hover:bg-[#4F6047]'
                              }`}
                            >
                              {allAdded ? (
                                <Check className="w-3 h-3" />
                              ) : (
                                <CalendarPlus className="w-3 h-3 text-[#C7AA74]" />
                              )}
                              <span>
                                {allAdded ? t.assistant.addedAllToPlan : t.assistant.addAllToPlan}
                              </span>
                            </button>
                          </div>

                          <div className="divide-y divide-[#D9CCB8]">
                            {stops.map((stop, idx) => {
                              const key = `${m.id}-stop-${idx}`;
                              const isAdded = Boolean(addedKeys[key]);
                              return (
                                <div
                                  key={key}
                                  className="py-2 first:pt-0 last:pb-0 flex items-start justify-between gap-2"
                                >
                                  <div className="space-y-0.5 min-w-0">
                                    <p className="text-[11px] text-[#4F6047] font-medium tabular-nums">
                                      {t.assistant.dayPrefix} {stop.day} · {stop.timeSlot}
                                    </p>
                                    <p className="text-xs font-medium text-[#1B3128]">
                                      {stop.title}
                                    </p>
                                    {stop.reason && (
                                      <p className="text-[11px] text-[#222420]/75 leading-snug">
                                        {stop.reason}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleAddStop(stop, key)}
                                    disabled={isAdded}
                                    className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 border text-[10px] font-medium rounded-sm cursor-pointer whitespace-nowrap ${
                                      isAdded
                                        ? 'border-[#4F6047] bg-[#4F6047] text-[#FAF7F0]'
                                        : 'border-[#A4834C]/50 text-[#1B3128] hover:bg-[#F2ECE0]'
                                    }`}
                                  >
                                    {isAdded ? (
                                      <Check className="w-2.5 h-2.5" />
                                    ) : (
                                      <Plus className="w-2.5 h-2.5" />
                                    )}
                                    <span>
                                      {isAdded ? t.assistant.addedStop : t.assistant.addSingleStop}
                                    </span>
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Structured Seasonal / Trend Highlights inside reply */}
                      {!isUser && seasonalNotes.length > 0 && (
                        <div className="w-full bg-[#F2ECE0]/70 border border-[#D9CCB8] p-3 space-y-2">
                          <p className="text-[11px] uppercase tracking-wider font-medium text-[#4F6047]">
                            {t.assistant.seasonalNoteHeading}
                          </p>
                          <div className="space-y-1.5">
                            {seasonalNotes.map((sn, i) => (
                              <div key={i} className="text-xs">
                                <span className="font-medium text-[#1B3128]">{sn.title}</span>
                                {sn.timing && (
                                  <span className="text-[11px] text-[#A4834C]"> · {sn.timing}</span>
                                )}
                                <p className="text-[11px] text-[#222420]/80 mt-0.5">{sn.note}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Direct Inspect Links to Catalog Listings */}
                      {!isUser && recs.length > 0 && (
                        <div className="w-full space-y-1.5">
                          <p className="text-[10px] uppercase tracking-wider text-[#4F6047] font-medium">
                            {t.assistant.recommendedPlacesHeading}
                          </p>
                          <div className="space-y-1.5">
                            {recs.map((rec, i) => {
                              const canInspect = modalLookupMap.has(rec.itemId);
                              return (
                                <div
                                  key={`${rec.itemId}-${i}`}
                                  className="flex items-center justify-between gap-2 bg-[#FAF7F0] border border-[#D9CCB8] px-3 py-2"
                                >
                                  <div className="min-w-0">
                                    <p className="text-xs font-medium text-[#1B3128] truncate">
                                      {rec.title}
                                    </p>
                                    {rec.note && (
                                      <p className="text-[11px] text-[#4F6047] truncate">
                                        {rec.note}
                                      </p>
                                    )}
                                  </div>
                                  {canInspect && (
                                    <button
                                      type="button"
                                      onClick={() => handleInspectRecommendation(rec)}
                                      className="shrink-0 px-2.5 py-1 border border-[#A4834C] text-[11px] font-medium text-[#1B3128] hover:bg-[#1B3128] hover:text-[#FAF7F0] transition-colors rounded-sm cursor-pointer whitespace-nowrap"
                                    >
                                      {t.assistant.inspectPlace}
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Starter Quick Prompts when conversation is fresh */}
                {messages.length === 1 && !loading && (
                  <div className="space-y-1.5 pt-1">
                    {t.assistant.quickPrompts.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => {
                          if (q === t.assistant.quickPrompts[0]) {
                            setShowPrefs(true);
                          } else {
                            sendMessage(q);
                          }
                        }}
                        className="w-full text-left px-3 py-2 bg-[#FAF7F0] border border-[#D9CCB8] hover:border-[#A4834C] text-xs text-[#1B3128] transition-colors cursor-pointer"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                {loading && (
                  <div className="bg-[#F2ECE0] border border-[#A4834C]/30 px-3.5 py-2.5 text-xs text-[#4F6047] italic max-w-[85%]">
                    {t.assistant.thinkingLabel}
                  </div>
                )}

                {errorMsg && (
                  <div className="bg-[#FAF7F0] border border-[#B66F52] px-3.5 py-2.5 text-xs text-[#B66F52] flex items-center justify-between gap-2">
                    <span>{errorMsg}</span>
                    {messages.some((m) => m.role === 'user') && (
                      <button
                        type="button"
                        onClick={() => {
                          const lastUser = [...messages].reverse().find((m) => m.role === 'user');
                          if (lastUser) sendMessage(lastUser.text, prefs, true);
                        }}
                        className="shrink-0 px-2 py-1 border border-[#B66F52] text-[11px] font-medium hover:bg-[#B66F52] hover:text-[#FAF7F0] transition-colors cursor-pointer"
                      >
                        Retry
                      </button>
                    )}
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Footer */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="p-3 border-t border-[#A4834C]/30 bg-[#F2ECE0] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.assistant.inputPlaceholder}
                  disabled={loading}
                  className="flex-1 px-3 py-2 bg-[#FAF7F0] border border-[#D9CCB8] text-xs text-[#222420] focus:outline-none focus:border-[#1B3128]"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label={t.assistant.sendLabel}
                  className="px-3.5 py-2 bg-[#1B3128] text-[#FAF7F0] text-xs font-medium rounded-sm hover:bg-[#4F6047] disabled:opacity-50 transition-colors cursor-pointer inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.assistant.sendLabel}</span>
                </button>
              </form>
            </>
          ) : (
            /* Seasonal Events Calendar & Famous Trends Tab */
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[#A4834C]/25 pb-2">
                  <Calendar className="w-4 h-4 text-[#A4834C]" />
                  <h3 className="font-serif text-lg text-[#1B3128]">{t.assistant.eventsTitle}</h3>
                </div>

                <div className="space-y-3">
                  {seasonalPulse.events.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-[#F2ECE0]/80 border border-[#A4834C]/30 p-3.5 space-y-1.5"
                    >
                      <p className="text-[11px] uppercase tracking-wider text-[#A4834C] font-medium">
                        {ev.seasonWindow}
                      </p>
                      <h4 className="font-serif text-base text-[#1B3128]">{ev.title}</h4>
                      <p className="text-xs text-[#222420]/85 leading-relaxed">{ev.highlight}</p>
                      <p className="text-[11px] text-[#4F6047] pt-1 border-t border-[#D9CCB8]">
                        {ev.insiderTip}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          sendMessage(
                            lang === 'my'
                              ? `${ev.title} (${ev.seasonWindow}) အတွက် ခရီးစဉ်နှင့် အသေးစိတ်အကြံပြုချက် ပြောပြပေးပါ။`
                              : `Tell me more about visiting Kalaw during ${ev.title} (${ev.seasonWindow}) and how to plan around it.`
                          )
                        }
                        className="pt-1 text-[11px] font-medium text-[#1B3128] hover:text-[#A4834C] transition-colors cursor-pointer"
                      >
                        {t.assistant.askAboutThis} →
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-[#A4834C]/25 pb-2">
                  <Flame className="w-4 h-4 text-[#A4834C]" />
                  <h3 className="font-serif text-lg text-[#1B3128]">{t.assistant.trendsTitle}</h3>
                </div>

                <div className="space-y-3">
                  {seasonalPulse.trends.map((tr) => (
                    <div
                      key={tr.id}
                      className="bg-[#FAF7F0] border border-[#D9CCB8] p-3.5 space-y-1.5"
                    >
                      <p className="text-[11px] uppercase tracking-wider text-[#4F6047] font-medium">
                        {tr.tag}
                      </p>
                      <h4 className="font-serif text-base text-[#1B3128]">{tr.title}</h4>
                      <p className="text-xs text-[#222420]/85 leading-relaxed">{tr.summary}</p>
                      <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2 border-t border-[#D9CCB8]/70">
                        <button
                          type="button"
                          onClick={() =>
                            sendMessage(
                              lang === 'my'
                                ? `${tr.title} အကြောင်းနှင့် သွားရောက်ရန် အကောင်းဆုံးအစီအစဉ်ကို ပြောပြပေးပါ။`
                                : `How can I include "${tr.title}" in my Kalaw trip plan?`
                            )
                          }
                          className="text-[11px] font-medium text-[#1B3128] hover:text-[#A4834C] transition-colors cursor-pointer"
                        >
                          {t.assistant.askAboutThis} →
                        </button>
                        {tr.suggestedPlaceId && modalLookupMap.has(tr.suggestedPlaceId) && (
                          <button
                            type="button"
                            onClick={() => handleInspectId(tr.suggestedPlaceId)}
                            className="text-[11px] font-medium text-[#A4834C] hover:text-[#1B3128] transition-colors cursor-pointer"
                          >
                            {t.assistant.inspectPlace}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  );
};
