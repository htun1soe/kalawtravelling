import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { BookingRequestPanel } from '../components/BookingRequestPanel';
import { EditorialImage } from '../components/EditorialImage';
import { FavoriteButton } from '../components/FavoriteButton';
import { useApp } from '../context/AppContext';

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { properties, t } = useApp();

  const property = properties.find((p) => p.slug === slug || p.id === slug);

  if (!property) {
    return (
      <div className="pt-32 pb-24 max-w-[1360px] mx-auto px-6 md:px-10 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#243D32]">Property Not Found</h1>
        <Link to="/real-estate" className="inline-block text-sm text-[#B66F52] underline">
          Return to Real Estate Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <Link
        to="/real-estate"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52634A] hover:text-[#243D32] mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{t.nav.realEstate}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-8">
          <EditorialImage
            src={property.images[0]}
            alt={property.title}
            aspectClass="aspect-[16/10]"
          />

          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
                {t.categories[property.category] || property.category} · {property.location}
              </p>
              <FavoriteButton itemId={property.id} />
            </div>

            <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
              {property.title}
            </h1>

            <div className="flex flex-wrap items-baseline gap-4 border-b border-[#D9CCB8] pb-5">
              <span className="font-serif text-4xl text-[#243D32] tabular-nums">
                ${property.price.toLocaleString()}
              </span>
              {property.priceUnit === 'per month' && (
                <span className="text-sm text-[#52634A]">{t.home.perMonth}</span>
              )}
              <span className="text-xs text-[#52634A] tabular-nums">
                · {property.areaSize}
                {property.bedrooms ? ` · ${property.bedrooms} Bed / ${property.bathrooms || 2} Bath` : ''}
              </span>
            </div>

            <p className="text-base text-[#292B27]/85 leading-relaxed max-w-prose">
              {property.description}
            </p>
          </div>

          <div className="border-t border-[#D9CCB8] pt-6 space-y-4">
            <h2 className="font-serif text-2xl text-[#243D32]">Property Specifications</h2>
            <dl className="divide-y divide-[#D9CCB8] text-sm">
              <div className="py-3 flex justify-between">
                <dt className="text-[#52634A]">Title / Tenure</dt>
                <dd className="text-[#243D32] font-medium">{property.titleStatus}</dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-[#52634A]">Representative</dt>
                <dd className="text-[#243D32] font-medium">{property.agentName}</dd>
              </div>
              <div className="py-3 flex justify-between">
                <dt className="text-[#52634A]">Listing Status</dt>
                <dd className="text-[#243D32] font-medium">{property.status}</dd>
              </div>
            </dl>
          </div>

          <div className="border-t border-[#D9CCB8] pt-6 space-y-3">
            <h3 className="font-serif text-2xl text-[#243D32]">Key Features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#292B27]/85">
              {property.features.map((feat) => (
                <li key={feat} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#52634A] shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="lg:col-span-5 lg:sticky lg:top-24">
          <BookingRequestPanel
            itemType="property"
            itemId={property.id}
            itemTitle={property.title}
            unitPrice={0}
            priceLabel="Private Viewing & Dossier Inquiry"
            maxGuests={4}
            ctaLabel="Request Property Viewing"
          />
        </aside>
      </div>
    </div>
  );
};
