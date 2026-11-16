import React from 'react';
import { ArrowRight, Mail, MapPin, Ruler, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { PropertyListing } from '../types/kalaw';
import { CardMediaCarousel, resolveMediaList } from './CardMediaCarousel';
import { FavoriteButton } from './FavoriteButton';

interface PropertyCardProps {
  prop: PropertyListing;
  variant?: 'light' | 'dark';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ prop, variant = 'light' }) => {
  const { openItemModal, t } = useApp();
  const isDark = variant === 'dark';

  const media = resolveMediaList(prop.media, prop.images, prop.title);
  const handleOpenModal = () => openItemModal({ kind: 'property', data: prop });

  return (
    <article
      className={`group flex flex-col w-full border ${
        isDark
          ? 'border-[#F4F0E6]/15 bg-[#243D32]/35 text-[#F4F0E6]'
          : 'border-[#D9CCB8] bg-[#F4F0E6] text-[#292B27]'
      }`}
    >
      <CardMediaCarousel
        title={prop.title}
        subtitle={`${t.categories[prop.category] || prop.category} · ${prop.location}`}
        media={media}
        aspectClass={isDark ? 'aspect-[4/3]' : 'aspect-[16/10]'}
        onOpenInfo={handleOpenModal}
        modalItem={{ kind: 'property', data: prop }}
        topRightOverlay={<FavoriteButton itemId={prop.id} compact />}
      />

      <div className="p-6 flex-1 flex flex-col space-y-3.5">
        <div
          className={`flex items-center justify-between gap-2 text-xs ${
            isDark ? 'text-[#D9CCB8]' : 'text-[#52634A]'
          }`}
        >
          <span>{t.categories[prop.category] || prop.category}</span>
          <span className={`font-medium ${isDark ? 'text-[#F4F0E6]' : 'text-[#243D32]'}`}>
            {prop.status}
          </span>
        </div>

        <h3
          className={`font-serif text-2xl leading-snug ${
            isDark ? 'text-[#F4F0E6]' : 'text-[#243D32]'
          }`}
        >
          <button
            type="button"
            onClick={handleOpenModal}
            className={`text-left transition-colors cursor-pointer ${
              isDark ? 'hover:text-[#D9CCB8]' : 'hover:text-[#B66F52]'
            }`}
          >
            {prop.title}
          </button>
        </h3>

        <p
          className={`text-sm leading-relaxed flex-1 ${
            isDark ? 'text-[#F4F0E6]/80' : 'text-[#292B27]/85'
          }`}
        >
          {prop.shortDescription}
        </p>

        {/* Required Real Estate Specifications: Location, Land/Property Type, Area, Contact */}
        <dl
          className={`grid grid-cols-1 gap-2 py-3 border-t border-b text-xs ${
            isDark ? 'border-[#F4F0E6]/15 text-[#D9CCB8]' : 'border-[#D9CCB8] text-[#52634A]'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <dt className="inline-flex items-center gap-1.5 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#B66F52]" />
              <span>{t.actions.locationLabel}</span>
            </dt>
            <dd className={`text-right font-medium ${isDark ? 'text-[#F4F0E6]' : 'text-[#243D32]'}`}>
              {prop.location}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="shrink-0">{t.actions.landTypeLabel}</dt>
            <dd className={`text-right font-medium ${isDark ? 'text-[#F4F0E6]' : 'text-[#243D32]'}`}>
              {t.categories[prop.category] || prop.category} · {prop.titleStatus}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3 tabular-nums">
            <dt className="inline-flex items-center gap-1.5 shrink-0">
              <Ruler className="w-3.5 h-3.5 text-[#B66F52]" />
              <span>{t.actions.areaLabel}</span>
            </dt>
            <dd className={`text-right font-medium ${isDark ? 'text-[#F4F0E6]' : 'text-[#243D32]'}`}>
              {prop.areaSize}
              {prop.bedrooms ? ` · ${prop.bedrooms} Bed` : ''}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="inline-flex items-center gap-1.5 shrink-0">
              <User className="w-3.5 h-3.5 text-[#B66F52]" />
              <span>{t.actions.contactLabel}</span>
            </dt>
            <dd className={`text-right font-medium ${isDark ? 'text-[#F4F0E6]' : 'text-[#243D32]'}`}>
              <span>{prop.agentName}</span>
              <span className="block text-[11px] opacity-80 inline-flex items-center justify-end gap-1 ml-1">
                <Mail className="w-3 h-3 inline" /> {prop.agentContact}
              </span>
            </dd>
          </div>
        </dl>

        <div className="pt-1 flex items-center justify-between gap-3">
          <div>
            <span
              className={`font-serif text-2xl tabular-nums ${
                isDark ? 'text-[#F4F0E6]' : 'text-[#243D32]'
              }`}
            >
              ${prop.price.toLocaleString()}
            </span>
            {prop.priceUnit === 'per month' && (
              <span className={`text-xs ${isDark ? 'text-[#D9CCB8]' : 'text-[#52634A]'}`}>
                {' '}
                {t.home.perMonth}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className={`inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer whitespace-nowrap ${
              isDark
                ? 'px-3.5 py-2 bg-[#F4F0E6] text-[#243D32] hover:bg-[#D9CCB8] rounded-sm'
                : 'px-3.5 py-2 bg-[#243D32] text-[#F4F0E6] hover:bg-[#52634A] rounded-sm'
            }`}
          >
            <span>{t.actions.inspectDossier}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
