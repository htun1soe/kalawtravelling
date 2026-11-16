import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { TripPlanItem } from '../types/kalaw';

export const TripPlannerPage: React.FC = () => {
  const {
    destinations,
    stays,
    experiences,
    restaurants,
    rentals,
    tripPlan,
    addToTripPlan,
    removeFromTripPlan,
    clearTripPlan,
    t,
  } = useApp();

  const [day, setDay] = useState(1);
  const [itemType, setItemType] = useState<TripPlanItem['type']>('destination');
  const [selectedId, setSelectedId] = useState('');
  const [timeSlot, setTimeSlot] = useState('Morning');

  const options = useMemo(() => {
    if (itemType === 'destination') {
      return destinations.map((d) => ({ id: d.id, title: d.name, location: d.location }));
    }
    if (itemType === 'stay') {
      return stays.map((s) => ({ id: s.id, title: s.name, location: s.location }));
    }
    if (itemType === 'experience') {
      return experiences.map((e) => ({ id: e.id, title: e.title, location: e.location }));
    }
    if (itemType === 'restaurant') {
      return restaurants.map((r) => ({ id: r.id, title: r.name, location: r.location }));
    }
    return rentals.map((r) => ({ id: r.id, title: r.name, location: r.location }));
  }, [itemType, destinations, stays, experiences, restaurants, rentals]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const chosen = options.find((o) => o.id === selectedId) || options[0];
    if (!chosen) return;
    addToTripPlan({
      day,
      type: itemType,
      itemId: chosen.id,
      title: chosen.title,
      location: chosen.location,
      timeSlot,
    });
  };

  const days = [1, 2, 3, 4];

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#D9CCB8]">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
            {t.pages.tripEyebrow}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
            {t.pages.tripTitle}
          </h1>
          <p className="text-base text-[#292B27]/80 leading-relaxed">
            {t.pages.tripDesc}
          </p>
        </div>
        {tripPlan.length > 0 && (
          <button
            type="button"
            onClick={clearTripPlan}
            className="px-4 py-2 border border-[#B66F52]/50 text-xs font-medium text-[#B66F52] rounded-sm hover:bg-[#B66F52]/10 cursor-pointer self-start md:self-auto"
          >
            Clear Itinerary
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-10">
        {/* Add Step Form */}
        <aside className="lg:col-span-4">
          <form
            onSubmit={handleAdd}
            className="bg-[#EBE5D8]/70 border border-[#D9CCB8] p-6 space-y-4 sticky top-24"
          >
            <h2 className="font-serif text-2xl text-[#243D32]">Add Stop to Plan</h2>

            <div>
              <label className="block text-xs text-[#52634A] mb-1">Trip Day</label>
              <select
                value={day}
                onChange={(e) => setDay(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    Day {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#52634A] mb-1">Category</label>
              <select
                value={itemType}
                onChange={(e) => {
                  setItemType(e.target.value as TripPlanItem['type']);
                  setSelectedId('');
                }}
                className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
              >
                <option value="destination">{t.nav.destinations}</option>
                <option value="stay">{t.nav.stays}</option>
                <option value="experience">{t.nav.experiences}</option>
                <option value="restaurant">{t.nav.dining}</option>
                <option value="rental">{t.nav.rentals}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#52634A] mb-1">Select Place or Service</label>
              <select
                value={selectedId || options[0]?.id || ''}
                onChange={(e) => setSelectedId(e.target.value)}
                className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
              >
                {options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#52634A] mb-1">Time Window</label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="e.g. 06:30 Sunrise"
                className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Day {day}</span>
            </button>
          </form>
        </aside>

        {/* Day-by-Day Timeline */}
        <div className="lg:col-span-8 space-y-10">
          {tripPlan.length === 0 ? (
            <div className="border border-[#D9CCB8] p-12 text-center space-y-3">
              <Calendar className="w-6 h-6 text-[#52634A] mx-auto" />
              <p className="font-serif text-2xl text-[#243D32]">Your itinerary is empty.</p>
              <p className="text-sm text-[#52634A]">
                Add viewpoints, stays, or mountain restaurants using the form to start shaping your trip.
              </p>
            </div>
          ) : (
            days.map((d) => {
              const items = tripPlan.filter((i) => i.day === d);
              if (items.length === 0) return null;
              return (
                <section key={d} className="space-y-4">
                  <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-2 tabular-nums">
                    Day 0{d}
                  </h2>
                  <div className="divide-y divide-[#D9CCB8]">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="py-4 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <p className="text-xs text-[#B66F52] uppercase tracking-wider">
                            {item.timeSlot} · {item.type}
                          </p>
                          <h3 className="font-serif text-xl text-[#243D32]">{item.title}</h3>
                          <p className="text-xs text-[#52634A]">{item.location}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromTripPlan(item.id)}
                          aria-label={`Remove ${item.title}`}
                          className="p-2 text-[#52634A] hover:text-[#B66F52] cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })
          )}

          <div className="border-t border-[#D9CCB8] pt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-[#52634A]">
              Ready to request availability for your stays or guides?
            </p>
            <div className="flex items-center gap-3">
              <Link
                to="/stays"
                className="px-4 py-2 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A]"
              >
                {t.home.browseAllStays}
              </Link>
              <Link
                to="/bookings"
                className="px-4 py-2 border border-[#243D32] text-[#243D32] text-xs font-medium rounded-sm hover:bg-[#D9CCB8]/40"
              >
                {t.nav.bookings}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
