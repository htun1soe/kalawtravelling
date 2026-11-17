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
      className={`group flex flex-col w-full border transition-colors ${
        isDark
          ? 'border-[#C7AA74]/25 bg-[#1B3128]/55 text-[#FAF7F0]'
          : 'border-[#A4834C]/35 bg-[#FAF7F0] text-[#222420]'
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
            isDark ? 'text-[#C7AA74]' : 'text-[#A4834C]'
          }`}
        >
          <span>{t.categories[prop.category] || prop.category}</span>
          <span className={`font-medium ${isDark ? 'text-[#FAF7F0]' : 'text-[#1B3128]'}`}>
            {t.categories[prop.status] || prop.status}
          </span>
        </div>

        <h3
          className={`font-serif text-2xl leading-relaxed ${
            isDark ? 'text-[#FAF7F0]' : 'text-[#1B3128]'
          }`}
        >
          <button
            type="button"
            onClick={handleOpenModal}
            className={`text-left transition-colors cursor-pointer ${
              isDark ? 'hover:text-[#C7AA74]' : 'hover:text-[#A4834C]'
            }`}
          >
            {prop.title}
          </button>
        </h3>

        <p
          className={`text-sm leading-relaxed flex-1 ${
            isDark ? 'text-[#FAF7F0]/80' : 'text-[#222420]/85'
          }`}
        >
          {prop.shortDescription}
        </p>

        <dl
          className={`grid grid-cols-1 gap-2 py-3 border-t border-b text-xs ${
            isDark ? 'border-[#C7AA74]/20 text-[#D9CCB8]' : 'border-[#A4834C]/25 text-[#4F6047]'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <dt className="inline-flex items-center gap-1.5 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-[#A4834C]" />
              <span>{t.actions.locationLabel}</span>
            </dt>
            <dd className={`text-right font-medium ${isDark ? 'text-[#FAF7F0]' : 'text-[#1B3128]'}`}>
              {prop.location}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="shrink-0">{t.actions.landTypeLabel}</dt>
            <dd className={`text-right font-medium ${isDark ? 'text-[#FAF7F0]' : 'text-[#1B3128]'}`}>
              {t.categories[prop.category] || prop.category} · {prop.titleStatus}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3 tabular-nums">
            <dt className="inline-flex items-center gap-1.5 shrink-0">
              <Ruler className="w-3.5 h-3.5 text-[#A4834C]" />
              <span>{t.actions.areaLabel}</span>
            </dt>
            <dd className={`text-right font-medium ${isDark ? 'text-[#FAF7F0]' : 'text-[#1B3128]'}`}>
              {prop.areaSize}
              {prop.bedrooms ? ` · ${prop.bedrooms} ${t.modal.bedShort}` : ''}
            </dd>
          </div>
          <div className="flex items-start justify-between gap-3">
            <dt className="inline-flex items-center gap-1.5 shrink-0">
              <User className="w-3.5 h-3.5 text-[#A4834C]" />
              <span>{t.actions.contactLabel}</span>
            </dt>
            <dd className={`text-right font-medium ${isDark ? 'text-[#FAF7F0]' : 'text-[#1B3128]'}`}>
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
                isDark ? 'text-[#FAF7F0]' : 'text-[#1B3128]'
              }`}
            >
              ${prop.price.toLocaleString()}
            </span>
            {prop.priceUnit === 'per month' && (
              <span className={`text-xs ${isDark ? 'text-[#D9CCB8]' : 'text-[#4F6047]'}`}>
                {' '}
                {t.home.perMonth}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleOpenModal}
            className={`inline-flex items-center gap-1.5 text-xs font-medium cursor-pointer whitespace-nowrap rounded-sm transition-colors ${
              isDark
                ? 'px-3.5 py-2 bg-[#C7AA74] text-[#1B3128] hover:bg-[#FAF7F0]'
                : 'px-3.5 py-2 bg-[#1B3128] text-[#FAF7F0] hover:bg-[#A4834C]'
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
