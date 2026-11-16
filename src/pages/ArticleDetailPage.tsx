import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { useApp } from '../context/AppContext';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { articles, t } = useApp();

  const article = articles.find((a) => a.slug === slug || a.id === slug);

  if (!article) {
    return (
      <div className="pt-32 pb-24 max-w-[1360px] mx-auto px-6 md:px-10 text-center space-y-4">
        <h1 className="font-serif text-3xl text-[#243D32]">Article Not Found</h1>
        <Link to="/journal" className="inline-block text-sm text-[#B66F52] underline">
          {t.nav.journal}
        </Link>
      </div>
    );
  }

  return (
    <article className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <Link
        to="/journal"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-[#52634A] hover:text-[#243D32] mb-8"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>{t.nav.journal}</span>
      </Link>

      <header className="max-w-4xl space-y-4 pb-10 border-b border-[#D9CCB8]">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
          {article.category} · {article.publishedAt} · {article.readTime}
        </p>
        <h1 className="font-serif text-4xl md:text-6xl text-[#243D32] leading-[1.06] headline-balance">
          {article.title}
        </h1>
        <p className="font-serif italic text-xl md:text-2xl text-[#52634A]">
          {article.subtitle}
        </p>
        <p className="text-xs text-[#292B27]/70 pt-2">By {article.author}</p>
      </header>

      <div className="py-10">
        <EditorialImage
          src={article.coverImage}
          alt={article.title}
          aspectClass="aspect-[16/9]"
        />
        <p className="mt-2.5 text-xs font-serif italic text-[#52634A]">
          Fig. 01 — {article.title}, photographed in Kalaw, Shan State.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-4">
        <div className="lg:col-span-8 space-y-6 max-w-prose">
          {article.paragraphs.map((para, index) => (
            <p
              key={index}
              className={`text-base md:text-lg text-[#292B27]/90 leading-[1.8] ${
                index === 0
                  ? 'first-letter:text-5xl first-letter:font-serif first-letter:font-semibold first-letter:text-[#243D32] first-letter:float-left first-letter:mr-3 first-letter:mt-1'
                  : ''
              }`}
            >
              {para}
            </p>
          ))}

          <blockquote className="my-10 py-6 border-t border-b border-[#D9CCB8] font-serif italic text-2xl md:text-3xl text-[#243D32] leading-snug">
            “{article.pullQuote}”
          </blockquote>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="border-t border-[#243D32] pt-4 space-y-2">
            <p className="text-xs uppercase tracking-widest text-[#B66F52]">Margin Field Note</p>
            <p className="text-sm text-[#292B27]/85 leading-relaxed">{article.marginNote}</p>
          </div>

          <div className="border-t border-[#D9CCB8] pt-4 space-y-3">
            <p className="text-xs uppercase tracking-widest text-[#52634A]">Further Reading</p>
            <div className="space-y-3">
              {articles
                .filter((a) => a.id !== article.id)
                .slice(0, 3)
                .map((other) => (
                  <Link
                    key={other.id}
                    to={`/journal/${other.slug}`}
                    className="block font-serif text-lg text-[#243D32] hover:text-[#B66F52]"
                  >
                    {other.title}
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
};
