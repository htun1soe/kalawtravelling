import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Compass, MapPin, Plus } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { FavoriteButton } from '../components/FavoriteButton';
import { useApp } from '../context/AppContext';

export const DestinationDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { destinations, stays, experiences, addToTripPlan, t } = useApp();
  const [addedToPlan, setAddedToPlan] = useState(false);

  const destination = destinations.find((d) => d.slug === slug || d.id === slug);

  if (!destination) {
    return (
      <div className="pt-32 pb-24 max-w-[1360px] mx-auto px-6 md:px-10 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#243D32]">Destination Not Found</h1>
        <Link to="/destinations" className="inline-block text-sm text-[#B66F52] underline">
          Return to Explore Destinations
        </Link>
      </div>
    );
  }

  const handleAddToTrip = () => {
    addToTripPlan({
      day: 1,
      type: 'destination',
      itemId: destination.id,
      title: destination.name,
      location: destination.location,
      timeSlot: destination.bestTime,
    });
    setAddedToPlan(true);
  };

  return (
    <div className="pt-24 pb-24">
      <div className="max-w-[1360px] mx-auto px-6 md:px-10">
        <Link
          to="/destinations"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52634A] hover:text-[#243D32] mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.nav.destinations}</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-6">
            <EditorialImage
              src={destination.image}
              alt={destination.name}
              aspectClass="aspect-[16/10]"
            />

            <div className="space-y-4 pt-2">
              <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
                {t.categories[destination.category] || destination.category}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
                {destination.name}
              </h1>
              <p className="text-lg text-[#292B27]/85 leading-relaxed font-serif italic">
                {destination.shortDescription}
              </p>
              <div className="border-t border-[#D9CCB8] pt-6 space-y-4 text-base text-[#292B27]/85 leading-relaxed max-w-prose">
                <p>{destination.editorialOverview}</p>
              </div>
            </div>

            <div className="border-t border-[#D9CCB8] pt-6 space-y-3">
              <h2 className="font-serif text-2xl text-[#243D32]">Field Highlights</h2>
              <ul className="space-y-2.5 text-sm text-[#292B27]/85">
                {destination.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <span className="text-[#B66F52] mt-0.5">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Field Dossier Sidebar */}
          <aside className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-[#EBE5D8]/70 border border-[#D9CCB8] p-6 md:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-[#D9CCB8] pb-4">
                <h2 className="font-serif text-2xl text-[#243D32]">Field Dossier</h2>
                <FavoriteButton itemId={destination.id} />
              </div>

              <dl className="divide-y divide-[#D9CCB8] text-sm">
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#52634A]">Location</dt>
                  <dd className="text-[#243D32] font-medium text-right">{destination.location}</dd>
                </div>
                <div className="py-3 flex justify-between gap-4 tabular-nums">
                  <dt className="text-[#52634A]">Elevation</dt>
                  <dd className="text-[#243D32] font-medium text-right">{destination.elevation}</dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#52634A]">Best Window</dt>
                  <dd className="text-[#243D32] font-medium text-right">{destination.bestTime}</dd>
                </div>
                <div className="py-3 flex justify-between gap-4">
                  <dt className="text-[#52634A]">Suggested Duration</dt>
                  <dd className="text-[#243D32] font-medium text-right">{destination.duration}</dd>
                </div>
                <div className="py-3 flex justify-between gap-4 tabular-nums">
                  <dt className="text-[#52634A]">Coordinates</dt>
                  <dd className="text-[#243D32] font-medium text-right">{destination.coordinates}</dd>
                </div>
              </dl>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToTrip}
                  className="w-full py-3 px-4 bg-[#243D32] text-[#F4F0E6] text-sm font-medium rounded-sm hover:bg-[#52634A] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedToPlan ? (
                    <>
                      <Compass className="w-4 h-4" />
                      <span>{t.actions.addedToPlan}</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>{t.actions.addToTripPlan}</span>
                    </>
                  )}
                </button>
                {addedToPlan && (
                  <Link
                    to="/plan-trip"
                    className="block text-center text-xs font-medium text-[#B66F52] hover:underline"
                  >
                    Open Interactive Trip Planner →
                  </Link>
                )}
              </div>
            </div>

            {/* Nearby Stay & Experience Suggestions */}
            <div className="border border-[#D9CCB8] p-6 space-y-4">
              <h3 className="font-serif text-xl text-[#243D32] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B66F52]" />
                <span>Pair With Nearby Stays &amp; Walks</span>
              </h3>
              <div className="space-y-3 divide-y divide-[#D9CCB8]">
                {stays.slice(0, 2).map((stay) => (
                  <div key={stay.id} className="pt-3 first:pt-0 flex items-center justify-between gap-3">
                    <div>
                      <Link
                        to={`/stays/${stay.slug}`}
                        className="text-sm font-medium text-[#243D32] hover:text-[#B66F52]"
                      >
                        {stay.name}
                      </Link>
                      <p className="text-xs text-[#52634A]">{stay.location}</p>
                    </div>
                    <span className="text-xs font-medium text-[#243D32] tabular-nums shrink-0">
                      ${stay.pricePerNight}/nt
                    </span>
                  </div>
                ))}
                {experiences.slice(0, 1).map((exp) => (
                  <div key={exp.id} className="pt-3 flex items-center justify-between gap-3">
                    <div>
                      <Link
                        to="/experiences"
                        className="text-sm font-medium text-[#243D32] hover:text-[#B66F52]"
                      >
                        {exp.title}
                      </Link>
                      <p className="text-xs text-[#52634A]">{exp.duration}</p>
                    </div>
                    <span className="text-xs font-medium text-[#243D32] tabular-nums shrink-0">
                      ${exp.pricePerGuest}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
