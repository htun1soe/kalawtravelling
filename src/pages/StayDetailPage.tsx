import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { BookingRequestPanel } from '../components/BookingRequestPanel';
import { EditorialImage } from '../components/EditorialImage';
import { FavoriteButton } from '../components/FavoriteButton';
import { useApp } from '../context/AppContext';

export const StayDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { stays, addToTripPlan } = useApp();
  const [added, setAdded] = React.useState(false);

  const stay = stays.find((s) => s.slug === slug || s.id === slug);

  if (!stay) {
    return (
      <div className="pt-32 pb-24 max-w-[1360px] mx-auto px-6 md:px-10 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#243D32]">Accommodation Not Found</h1>
        <Link to="/stays" className="inline-block text-sm text-[#B66F52] underline">
          Return to Stays
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <Link
        to="/stays"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52634A] hover:text-[#243D32] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>All Stays</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Editorial Stay Story & Gallery */}
        <div className="lg:col-span-7 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={stay.images.length === 1 ? 'sm:col-span-2' : 'sm:col-span-2'}>
              <EditorialImage src={stay.images[0]} alt={stay.name} aspectClass="aspect-[16/10]" />
            </div>
            {stay.images.slice(1).map((img, i) => (
              <EditorialImage
                key={i}
                src={img}
                alt={`${stay.name} view ${i + 2}`}
                aspectClass="aspect-[4/3]"
              />
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
                {stay.category} · {stay.location}
              </p>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-xs font-medium text-[#243D32] tabular-nums">
                  <Star className="w-3.5 h-3.5 fill-[#B66F52] text-[#B66F52]" />
                  {stay.rating.toFixed(2)} ({stay.reviewCount} reviews)
                </span>
                <FavoriteButton itemId={stay.id} />
              </div>
            </div>

            <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
              {stay.name}
            </h1>

            <p className="text-sm text-[#52634A] tabular-nums">
              Up to {stay.maxGuests} guests · {stay.bedrooms} {stay.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'} · Open {stay.availableFrom} to {stay.availableTo}
            </p>

            <p className="text-base text-[#292B27]/85 leading-relaxed pt-2 max-w-prose">
              {stay.description}
            </p>
          </div>

          <div className="border-t border-[#D9CCB8] pt-6 space-y-4">
            <h2 className="font-serif text-2xl text-[#243D32]">Included &amp; Amenities</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#292B27]/85">
              {stay.amenities.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#52634A] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-[#D9CCB8] pt-6 flex items-center justify-between">
            <p className="text-sm text-[#52634A]">Want to include this lodge in your itinerary?</p>
            <button
              type="button"
              onClick={() => {
                addToTripPlan({
                  day: 1,
                  type: 'stay',
                  itemId: stay.id,
                  title: stay.name,
                  location: stay.location,
                  timeSlot: 'Overnight Stay',
                });
                setAdded(true);
              }}
              className="px-4 py-2 border border-[#243D32] text-xs font-medium text-[#243D32] rounded-sm hover:bg-[#243D32] hover:text-[#F4F0E6] transition-colors cursor-pointer"
            >
              {added ? 'Added to Trip Plan' : 'Add to Trip Planner'}
            </button>
          </div>
        </div>

        {/* Right: Contiguous Booking Request Module */}
        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <BookingRequestPanel
            itemType="stay"
            itemId={stay.id}
            itemTitle={stay.name}
            unitPrice={stay.pricePerNight}
            priceLabel="per night"
            requireCheckOut={true}
            maxGuests={stay.maxGuests}
            ctaLabel="Request Stay Availability"
          />
        </aside>
      </div>
    </div>
  );
};
