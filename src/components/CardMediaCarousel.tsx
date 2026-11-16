import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Film, Images, Mountain, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { buildFallbackMedia } from '../data/kalawData';
import type { MediaItem, ModalItem } from '../types/kalaw';

export function resolveMediaList(
  media: MediaItem[] | undefined,
  fallbackImages: string[],
  title: string
): MediaItem[] {
  if (media && media.length >= 3) return media;
  const baseImages = fallbackImages.filter(Boolean);
  if (baseImages.length >= 3) {
    return baseImages.map((src, i) => ({
      type: 'image' as const,
      src,
      caption: `${title} — View ${i + 1}`,
    }));
  }
  return buildFallbackMedia(baseImages[0] || '', title);
}

interface CardMediaCarouselProps {
  title: string;
  subtitle?: string;
  media: MediaItem[];
  aspectClass?: string;
  className?: string;
  onOpenInfo: () => void;
  modalItem?: ModalItem;
  topRightOverlay?: React.ReactNode;
  compactControls?: boolean;
}

export const CardMediaCarousel: React.FC<CardMediaCarouselProps> = ({
  title,
  subtitle,
  media,
  aspectClass = 'aspect-[4/3]',
  className = '',
  onOpenInfo,
  modalItem,
  topRightOverlay,
  compactControls = false,
}) => {
  const { openGallery, t } = useApp();
  const [index, setIndex] = useState(0);
  const [failedSlides, setFailedSlides] = useState<Record<number, boolean>>({});

  const items = media.length > 0 ? media : buildFallbackMedia('', title);
  const safeIndex = index >= items.length ? 0 : index;
  const active = items[safeIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % items.length);
  };

  const handleOpenGallery = (e: React.MouseEvent) => {
    e.stopPropagation();
    openGallery(title, items, safeIndex, subtitle, modalItem);
  };

  const isFailed = failedSlides[safeIndex];

  return (
    <div
      className={`group/media relative overflow-hidden bg-[#292B27]/10 select-none ${aspectClass} ${className}`}
    >
      {/* Active Photo or Video */}
      {active.type === 'video' && !isFailed ? (
        <div
          onClick={onOpenInfo}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenInfo();
            }
          }}
          aria-label={`${title} — ${t.actions.videoClip}`}
          className="w-full h-full relative cursor-pointer bg-[#1F241F]"
        >
          <video
            key={active.src}
            src={active.src}
            poster={active.poster}
            autoPlay
            muted
            loop
            playsInline
            onError={() => setFailedSlides((prev) => ({ ...prev, [safeIndex]: true }))}
            className="w-full h-full object-cover"
          />
          <div className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#292B27]/75 text-[#F4F0E6] text-[11px] font-medium backdrop-blur-xs">
            <Play className="w-3 h-3 fill-current" />
            <span>{t.actions.videoClip}</span>
          </div>
        </div>
      ) : isFailed || !active.src ? (
        <button
          type="button"
          onClick={onOpenInfo}
          className="w-full h-full bg-[#D9CCB8]/50 border border-[#243D32]/15 flex flex-col items-center justify-center p-6 text-center cursor-pointer"
        >
          <Mountain className="w-7 h-7 text-[#243D32]/60 mb-2" strokeWidth={1.5} />
          <p className="font-serif text-base text-[#243D32]">{title}</p>
          <span className="text-xs text-[#52634A] mt-1">Kalaw Highland Archive</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpenInfo}
          aria-label={title}
          className="w-full h-full block cursor-pointer focus-visible:outline-2 focus-visible:outline-[#243D32]"
        >
          <img
            key={active.src}
            src={active.src}
            alt={active.caption || title}
            referrerPolicy="no-referrer"
            onError={() => setFailedSlides((prev) => ({ ...prev, [safeIndex]: true }))}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </button>
      )}

      {/* Subtle Bottom Contrast Scrim for Carousel Controls */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1E221D]/75 via-[#1E221D]/25 to-transparent" />

      {/* Top Right Overlay (e.g. Favorite button) */}
      {topRightOverlay && (
        <div
          className="absolute top-3 right-3 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {topRightOverlay}
        </div>
      )}

      {/* Left / Right Toggle Buttons */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            aria-label={t.actions.previousPhoto}
            className={`absolute left-2.5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center bg-[#F4F0E6]/90 text-[#243D32] hover:bg-[#F4F0E6] border border-[#243D32]/15 transition-all cursor-pointer shadow-xs ${
              compactControls ? 'w-7 h-7' : 'w-9 h-9'
            }`}
          >
            <ChevronLeft className={compactControls ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label={t.actions.nextPhoto}
            className={`absolute right-2.5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center bg-[#F4F0E6]/90 text-[#243D32] hover:bg-[#F4F0E6] border border-[#243D32]/15 transition-all cursor-pointer shadow-xs ${
              compactControls ? 'w-7 h-7' : 'w-9 h-9'
            }`}
          >
            <ChevronRight className={compactControls ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </button>
        </>
      )}

      {/* Bottom Controls Row: Indicators + Counter & View in Gallery Button */}
      <div className="absolute inset-x-3 bottom-2.5 z-20 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {!compactControls && (
            <div className="flex items-center gap-1 mr-1">
              {items.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIndex(idx);
                  }}
                  aria-label={`Slide ${idx + 1}${m.type === 'video' ? ' (Video)' : ''}`}
                  className={`h-1.5 transition-all cursor-pointer ${
                    idx === safeIndex
                      ? 'w-5 bg-[#F4F0E6]'
                      : 'w-2 bg-[#F4F0E6]/45 hover:bg-[#F4F0E6]/80'
                  }`}
                />
              ))}
            </div>
          )}
          <span className="text-[11px] font-medium text-[#F4F0E6]/95 tabular-nums inline-flex items-center gap-1">
            {items.some((m) => m.type === 'video') && !compactControls && (
              <Film className="w-3 h-3 text-[#D9CCB8]" />
            )}
            <span>
              {safeIndex + 1}/{items.length}
            </span>
          </span>
        </div>

        <button
          type="button"
          onClick={handleOpenGallery}
          className={`inline-flex items-center gap-1.5 bg-[#292B27]/85 hover:bg-[#243D32] text-[#F4F0E6] border border-[#F4F0E6]/25 backdrop-blur-xs transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
            compactControls ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1.5 text-[11px] font-medium'
          }`}
        >
          <Images className="w-3 h-3 shrink-0" />
          <span>{t.actions.viewInGallery}</span>
        </button>
      </div>
    </div>
  );
};
