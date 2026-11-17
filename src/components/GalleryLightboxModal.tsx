import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Film, Info, Mountain, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GalleryLightboxModal: React.FC = () => {
  const { galleryState, closeGallery, openItemModal, t } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedMap, setFailedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (galleryState) {
      setActiveIndex(galleryState.initialIndex || 0);
      setFailedMap({});
    }
  }, [galleryState]);

  useEffect(() => {
    if (!galleryState) return;
    const total = galleryState.media.length;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeGallery();
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % total);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + total) % total);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [galleryState, closeGallery]);

  if (!galleryState) return null;

  const items = galleryState.media;
  const safeIdx = activeIndex >= items.length ? 0 : activeIndex;
  const current = items[safeIdx];
  const isFailed = failedMap[safeIdx];

  return (
    <div
      className="fixed inset-0 z-[70] bg-[#141714]/95 backdrop-blur-sm text-[#FAF7F0] flex flex-col justify-between p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${galleryState.title} Gallery`}
      onClick={closeGallery}
    >
      {/* Top Bar */}
      <div
        className="max-w-[1360px] w-full mx-auto flex items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#C7AA74]/25"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="min-w-0 space-y-0.5">
          {galleryState.subtitle && (
            <p className="text-xs uppercase tracking-[0.18em] text-[#C7AA74]">
              {galleryState.subtitle}
            </p>
          )}
          <h2 className="font-serif text-xl md:text-2xl text-[#FAF7F0] leading-relaxed">
            {galleryState.title}
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-[#D9CCB8] tabular-nums">
            {safeIdx + 1} / {items.length}
          </span>
          {galleryState.item && (
            <button
              type="button"
              onClick={() => openItemModal(galleryState.item!)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-[#C7AA74]/45 text-xs font-medium text-[#FAF7F0] hover:bg-[#FAF7F0]/10 transition-colors cursor-pointer whitespace-nowrap"
            >
              <Info className="w-3.5 h-3.5 text-[#C7AA74]" />
              <span>{t.actions.inspectDossier}</span>
            </button>
          )}
          <button
            type="button"
            onClick={closeGallery}
            aria-label={t.actions.closeModal}
            className="p-2.5 border border-[#FAF7F0]/25 text-[#FAF7F0] hover:bg-[#FAF7F0] hover:text-[#1B3128] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Stage */}
      <div
        className="flex-1 max-w-[1200px] w-full mx-auto flex items-center justify-center relative py-4 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev - 1 + items.length) % items.length)}
            aria-label={t.actions.previousPhoto}
            className="absolute left-0 md:left-2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#222420]/85 hover:bg-[#FAF7F0] text-[#FAF7F0] hover:text-[#1B3128] border border-[#C7AA74]/35 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="w-full h-full max-h-[68vh] flex flex-col items-center justify-center px-12 md:px-16">
          {current.type === 'video' && !isFailed ? (
            <video
              key={current.src}
              src={current.src}
              poster={current.poster}
              controls
              autoPlay
              muted
              loop
              playsInline
              onError={() => setFailedMap((prev) => ({ ...prev, [safeIdx]: true }))}
              className="max-h-[62vh] max-w-full w-auto object-contain border border-[#C7AA74]/25 bg-black"
            />
          ) : isFailed || !current.src ? (
            <div className="w-full max-w-2xl aspect-[16/10] bg-[#1B3128]/50 border border-[#C7AA74]/25 flex flex-col items-center justify-center p-8 text-center">
              <Mountain className="w-9 h-9 text-[#C7AA74] mb-3" />
              <p className="font-serif text-xl text-[#FAF7F0]">{galleryState.title}</p>
            </div>
          ) : (
            <img
              key={current.src}
              src={current.src}
              alt={current.caption || galleryState.title}
              referrerPolicy="no-referrer"
              onError={() => setFailedMap((prev) => ({ ...prev, [safeIdx]: true }))}
              className="max-h-[62vh] max-w-full w-auto object-contain border border-[#C7AA74]/25"
            />
          )}

          {current.caption && (
            <p className="mt-3 text-xs md:text-sm text-[#D9CCB8] text-center max-w-2xl">
              {current.caption}
            </p>
          )}
        </div>

        {items.length > 1 && (
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev + 1) % items.length)}
            aria-label={t.actions.nextPhoto}
            className="absolute right-0 md:right-2 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#222420]/85 hover:bg-[#FAF7F0] text-[#FAF7F0] hover:text-[#1B3128] border border-[#C7AA74]/35 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      <div
        className="max-w-[900px] w-full mx-auto pt-3 border-t border-[#C7AA74]/20 flex items-center justify-center gap-2.5 overflow-x-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {items.map((item, idx) => {
          const thumbSrc = item.type === 'video' ? item.poster || item.src : item.src;
          const isActive = idx === safeIdx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-14 shrink-0 overflow-hidden border transition-all cursor-pointer ${
                isActive ? 'border-[#C7AA74] opacity-100 scale-105' : 'border-[#FAF7F0]/25 opacity-55 hover:opacity-90'
              }`}
            >
              <img
                src={thumbSrc}
                alt={item.caption || `${galleryState.title} ${idx + 1}`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {item.type === 'video' && (
                <span className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Film className="w-4 h-4 text-[#FAF7F0]" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
