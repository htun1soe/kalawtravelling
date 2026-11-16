import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { useApp } from '../context/AppContext';

export const JournalPage: React.FC = () => {
  const { articles } = useApp();
  const lead = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="max-w-3xl space-y-4 pb-10 border-b border-[#D9CCB8]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
          The Kalaw Journal
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
          Travel Guides, Essays &amp; Seasonal Field Notes
        </h1>
        <p className="text-base text-[#292B27]/80 leading-relaxed">
          Long-form dispatches written from Kalaw’s market lanes, pine ridges, and mountain kitchens.
        </p>
      </div>

      {lead && (
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-10 py-12 border-b border-[#D9CCB8] items-center group">
          <Link to={`/journal/${lead.slug}`} className="lg:col-span-7">
            <EditorialImage src={lead.coverImage} alt={lead.title} aspectClass="aspect-[16/10]" />
          </Link>
          <div className="lg:col-span-5 space-y-4">
            <p className="text-xs text-[#52634A]">
              Lead Dispatch · {lead.category} · {lead.publishedAt} · {lead.readTime}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#243D32] group-hover:text-[#B66F52] transition-colors headline-balance">
              <Link to={`/journal/${lead.slug}`}>{lead.title}</Link>
            </h2>
            <p className="text-base text-[#292B27]/85 leading-relaxed">{lead.excerpt}</p>
            <Link
              to={`/journal/${lead.slug}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#243D32] pt-2 hover:text-[#B66F52]"
            >
              <span>Read Essay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </article>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-12">
        {rest.map((art) => (
          <article key={art.id} className="group space-y-4">
            <Link to={`/journal/${art.slug}`}>
              <EditorialImage src={art.coverImage} alt={art.title} aspectClass="aspect-[4/3]" />
            </Link>
            <p className="text-xs text-[#52634A]">
              {art.category} · {art.publishedAt} · {art.readTime}
            </p>
            <h3 className="font-serif text-2xl text-[#243D32] group-hover:text-[#B66F52] transition-colors">
              <Link to={`/journal/${art.slug}`}>{art.title}</Link>
            </h3>
            <p className="text-sm text-[#292B27]/80 leading-relaxed">{art.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
};
