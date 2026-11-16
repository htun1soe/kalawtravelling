import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CardMediaCarousel, resolveMediaList } from '../components/CardMediaCarousel';
import { useApp } from '../context/AppContext';

export const JournalPage: React.FC = () => {
  const { articles, openItemModal, t } = useApp();
  const lead = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="max-w-3xl space-y-4 pb-10 border-b border-[#D9CCB8]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
          {t.pages.journalEyebrow}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
          {t.pages.journalTitle}
        </h1>
        <p className="text-base text-[#292B27]/80 leading-relaxed">
          {t.pages.journalDesc}
        </p>
      </div>

      {lead && (
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12 border-b border-[#D9CCB8] items-center group">
          <div className="lg:col-span-7">
            <CardMediaCarousel
              title={lead.title}
              subtitle={`${lead.category} · ${lead.publishedAt} · ${lead.readTime}`}
              media={resolveMediaList(lead.media, [lead.coverImage], lead.title)}
              aspectClass="aspect-[16/10]"
              onOpenInfo={() => openItemModal({ kind: 'article', data: lead })}
              modalItem={{ kind: 'article', data: lead }}
            />
          </div>
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs text-[#52634A]">
              {lead.category} · {lead.publishedAt} · {lead.readTime}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#243D32] headline-balance">
              <button
                type="button"
                onClick={() => openItemModal({ kind: 'article', data: lead })}
                className="text-left group-hover:text-[#B66F52] transition-colors cursor-pointer"
              >
                {lead.title}
              </button>
            </h2>
            <p className="text-base text-[#292B27]/85 leading-relaxed">{lead.excerpt}</p>
            <button
              type="button"
              onClick={() => openItemModal({ kind: 'article', data: lead })}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#243D32] pt-2 hover:text-[#B66F52] cursor-pointer"
            >
              <span>{t.home.readDispatches}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </article>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-12">
        {rest.map((art) => (
          <article key={art.id} className="group space-y-4 flex flex-col">
            <CardMediaCarousel
              title={art.title}
              subtitle={`${art.category} · ${art.publishedAt} · ${art.readTime}`}
              media={resolveMediaList(art.media, [art.coverImage], art.title)}
              aspectClass="aspect-[4/3]"
              onOpenInfo={() => openItemModal({ kind: 'article', data: art })}
              modalItem={{ kind: 'article', data: art }}
            />
            <p className="text-xs text-[#52634A]">
              {art.category} · {art.publishedAt} · {art.readTime}
            </p>
            <h3 className="font-serif text-2xl text-[#243D32]">
              <button
                type="button"
                onClick={() => openItemModal({ kind: 'article', data: art })}
                className="text-left group-hover:text-[#B66F52] transition-colors cursor-pointer"
              >
                {art.title}
              </button>
            </h3>
            <p className="text-sm text-[#292B27]/80 leading-relaxed flex-1">{art.excerpt}</p>
            <button
              type="button"
              onClick={() => openItemModal({ kind: 'article', data: art })}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#243D32] hover:text-[#B66F52] cursor-pointer self-start"
            >
              <span>{t.home.readDispatches}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </article>
        ))}
      </div>
    </div>
  );
};
