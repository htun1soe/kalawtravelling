import React, { useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Calendar, Compass, MapPin, Search, Star, Users } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { EditorialImage } from '../components/EditorialImage';
import { FavoriteButton } from '../components/FavoriteButton';
import { ScrollReveal, ScrollStaggerItem } from '../components/ScrollReveal';
import { useApp } from '../context/AppContext';
import {
  IMG_BOUTIQUE_VILLA,
  IMG_CEDAR_CABINS,
  IMG_HERITAGE_STATION,
  IMG_HERO_MOUNTAINS,
  IMG_PAGODA_VIEWPOINT,
  IMG_PINE_TRAIL,
  IMG_SHAN_NOODLES,
  IMG_TEA_TERRACES,
} from '../data/kalawData';
import type { DestinationCategory, StayCategory } from '../types/kalaw';

interface HeroHighlight {
  id: string;
  index: string;
  label: string;
  title: string;
  caption: string;
  meta: string;
  backdrop: string;
  featureImage: string;
  to: string;
}

const HERO_HIGHLIGHTS: HeroHighlight[] = [
  {
    id: 'ridges',
    index: '01',
    label: 'Pine Ridges',
    title: 'Dawn Mist & Burmese Pine Trails',
    caption: 'Walk red-earth footpaths from Thein Taung ridge toward quiet Danu and Pa-O mountain hamlets.',
    meta: '1,385 m Elevation · Viewpoints & Trekking',
    backdrop: IMG_HERO_MOUNTAINS,
    featureImage: IMG_PAGODA_VIEWPOINT,
    to: '/destinations',
  },
  {
    id: 'heritage',
    index: '02',
    label: '1914 Heritage',
    title: 'Railway Quarter & Five-Day Market',
    caption: 'Explore century-old stone masonry, eucalyptus lanes, and vibrant morning hill-tribe produce.',
    meta: 'Est. 1914 · Central Station Road',
    backdrop: IMG_HERITAGE_STATION,
    featureImage: IMG_HERITAGE_STATION,
    to: '/destinations/kalaw-heritage-railway-quarter',
  },
  {
    id: 'lodges',
    index: '03',
    label: 'Teak Lodges',
    title: 'Colonial Verandas & Cedar Cabins',
    caption: 'Rest beside wood-burning hearths in restored 1920s timber lodges and secluded ridge sanctuaries.',
    meta: 'From $42 – $210 / night · Curated Stays',
    backdrop: IMG_CEDAR_CABINS,
    featureImage: IMG_BOUTIQUE_VILLA,
    to: '/stays',
  },
  {
    id: 'table',
    index: '04',
    label: 'Shan Table',
    title: 'Shan Noodles & Wild Tea Terraces',
    caption: 'Savor turmeric-broth Shan khao swe at dawn and pan-fired mountain green tea along western ridges.',
    meta: 'Highland Cuisine · Cafes & Workshops',
    backdrop: IMG_TEA_TERRACES,
    featureImage: IMG_SHAN_NOODLES,
    to: '/dining',
  },
];

const DEST_CATEGORIES: Array<'All' | DestinationCategory> = [
  'All',
  'Nature & Mountains',
  'Viewpoints',
  'Cultural Attractions',
  'Pagodas & Religious Sites',
  'Hiking & Trekking',
  'Hidden Gems',
];

const STAY_CATEGORIES: Array<'All' | StayCategory> = [
  'All',
  'Hotels',
  'Guesthouses',
  'Resorts',
  'Homestays',
  'Private Houses',
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { destinations, stays, experiences, restaurants, rentals, properties, articles } = useApp();

  // Hero search & spotlight state
  const [activeSpotlight, setActiveSpotlight] = useState<string>('ridges');
  const [searchLocation, setSearchLocation] = useState('');
  const [checkIn, setCheckIn] = useState('2026-12-10');
  const [checkOut, setCheckOut] = useState('2026-12-13');
  const [guests, setGuests] = useState(2);

  const currentHighlight =
    HERO_HIGHLIGHTS.find((h) => h.id === activeSpotlight) || HERO_HIGHLIGHTS[0];

  // Interactive section filters
  const [destFilter, setDestFilter] = useState<'All' | DestinationCategory>('All');
  const [stayFilter, setStayFilter] = useState<'All' | StayCategory>('All');

  const filteredDestinations = useMemo(() => {
    const list =
      destFilter === 'All'
        ? destinations
        : destinations.filter((d) => d.category === destFilter);
    return list.slice(0, 6);
  }, [destinations, destFilter]);

  const filteredStays = useMemo(() => {
    const list =
      stayFilter === 'All' ? stays : stays.filter((s) => s.category === stayFilter);
    return list.slice(0, 3);
  }, [stays, stayFilter]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation.trim()) params.set('q', searchLocation.trim());
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);
    if (guests) params.set('guests', String(guests));
    navigate(`/stays?${params.toString()}`);
  };

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroParallaxY = useTransform(heroScroll, [0, 1], ['0%', '14%']);
  const heroParallaxScale = useTransform(heroScroll, [0, 1], [1, 1.08]);

  const leadArticle = articles[0];
  const secondaryArticles = articles.slice(1, 4);

  return (
    <div className="bg-[#F4F0E6] text-[#292B27]">
      {/* B. IMMERSIVE HERO SECTION WITH FEATURED KALAW GALLERY */}
      <section
        ref={heroRef}
        className="relative min-h-[820px] flex flex-col justify-end overflow-hidden bg-[#243D32]"
      >
        <motion.img
          key={currentHighlight.backdrop}
          src={currentHighlight.backdrop}
          alt={currentHighlight.title}
          referrerPolicy="no-referrer"
          style={{ y: heroParallaxY, scale: heroParallaxScale }}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#292B27]/92 via-[#292B27]/68 to-[#292B27]/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#292B27]/90 via-transparent to-[#292B27]/40" />

        <div className="relative z-10 max-w-[1360px] w-full mx-auto px-6 md:px-10 pt-28 pb-10 md:pb-12 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-end">
            {/* Left Column: Editorial Headline, CTAs & Signature Highlights Selector */}
            <div className="lg:col-span-7 space-y-6">
              <p className="text-xs uppercase tracking-[0.22em] text-[#D9CCB8] font-medium">
                Kalaw · Shan State · 1,320m Highland Plateau
              </p>
              <h1 className="font-serif text-[clamp(2.85rem,5.2vw,4.75rem)] leading-[1.02] font-medium text-[#F4F0E6] headline-balance max-w-2xl">
                Find Your Way to Kalaw.
              </h1>
              <p className="text-base md:text-lg text-[#F4F0E6]/88 leading-relaxed max-w-xl">
                Where morning clouds drift through Burmese pines, century-old teak lodges open onto wildflower verandas, and quiet footpaths connect tea terraces to Shan kitchens.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <Link
                  to="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#F4F0E6] text-[#243D32] text-sm font-medium rounded-sm hover:bg-[#D9CCB8] transition-colors whitespace-nowrap"
                >
                  <span>Explore Kalaw</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/plan-trip"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-[#F4F0E6]/60 text-[#F4F0E6] text-sm font-medium rounded-sm hover:bg-[#F4F0E6]/10 transition-colors whitespace-nowrap"
                >
                  <Compass className="w-4 h-4" />
                  <span>Plan Your Trip</span>
                </Link>
              </div>

              {/* Interactive Signature Highlights Switcher */}
              <div className="pt-4 border-t border-[#F4F0E6]/20 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {HERO_HIGHLIGHTS.map((item) => {
                  const active = item.id === currentHighlight.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSpotlight(item.id)}
                      className={`text-left py-2.5 px-3 border transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#F4F0E6]/15 border-[#D9CCB8] text-[#F4F0E6]'
                          : 'bg-transparent border-[#F4F0E6]/15 text-[#F4F0E6]/70 hover:text-[#F4F0E6] hover:border-[#F4F0E6]/40'
                      }`}
                    >
                      <span className="block text-[11px] tabular-nums text-[#D9CCB8]">
                        {item.index}.
                      </span>
                      <span className="block text-xs font-medium mt-0.5 whitespace-nowrap truncate">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Curated Featured Visual Folio */}
            <div className="lg:col-span-5 space-y-3">
              <Link
                to={currentHighlight.to}
                className="group block bg-[#292B27]/80 border border-[#F4F0E6]/25 overflow-hidden"
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#243D32]">
                  <img
                    src={currentHighlight.featureImage}
                    alt={currentHighlight.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-4 flex items-end justify-between gap-4">
                  <div className="space-y-1 min-w-0">
                    <p className="text-[11px] uppercase tracking-wider text-[#D9CCB8]">
                      {currentHighlight.index} · {currentHighlight.meta}
                    </p>
                    <h2 className="font-serif text-xl md:text-2xl text-[#F4F0E6] group-hover:text-[#D9CCB8] transition-colors truncate">
                      {currentHighlight.title}
                    </h2>
                    <p className="text-xs text-[#F4F0E6]/75 line-clamp-2">
                      {currentHighlight.caption}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#D9CCB8] shrink-0 mb-1" />
                </div>
              </Link>

              {/* 4-Plate Featured Gallery Strip */}
              <div className="grid grid-cols-4 gap-2.5">
                {HERO_HIGHLIGHTS.map((item) => {
                  const active = item.id === currentHighlight.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSpotlight(item.id)}
                      aria-label={`Spotlight ${item.title}`}
                      className={`group text-left overflow-hidden border transition-all cursor-pointer ${
                        active
                          ? 'border-[#F4F0E6] opacity-100'
                          : 'border-[#F4F0E6]/25 opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div className="aspect-[4/3] overflow-hidden bg-[#243D32]">
                        <img
                          src={item.featureImage}
                          alt={item.label}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Full-Width Travel Search Interface */}
          <form
            onSubmit={handleHeroSearch}
            className="bg-[#F4F0E6] text-[#292B27] border border-[#D9CCB8] p-3 md:p-4 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
          >
            <div className="md:col-span-4 px-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#52634A] mb-1">
                Destination or Area
              </label>
              <div className="flex items-center gap-2 border-b border-[#D9CCB8] pb-1.5">
                <MapPin className="w-4 h-4 text-[#B66F52] shrink-0" />
                <input
                  type="text"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  placeholder="Pine Ridge, Station Road, Ywa Pu..."
                  className="w-full bg-transparent text-sm text-[#292B27] placeholder-[#52634A]/65 focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-3 px-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#52634A] mb-1">
                Check-in
              </label>
              <div className="flex items-center gap-2 border-b border-[#D9CCB8] pb-1.5">
                <Calendar className="w-4 h-4 text-[#52634A] shrink-0" />
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#292B27] tabular-nums focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-2 px-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#52634A] mb-1">
                Check-out
              </label>
              <div className="flex items-center gap-2 border-b border-[#D9CCB8] pb-1.5">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent text-sm text-[#292B27] tabular-nums focus:outline-none"
                />
              </div>
            </div>

            <div className="md:col-span-1 px-2">
              <label className="block text-[11px] uppercase tracking-wider text-[#52634A] mb-1">
                Guests
              </label>
              <div className="flex items-center gap-1.5 border-b border-[#D9CCB8] pb-1.5">
                <Users className="w-4 h-4 text-[#52634A] shrink-0" />
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  aria-label="Number of guests"
                  className="w-full bg-transparent text-sm text-[#292B27] tabular-nums focus:outline-none"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#243D32] text-[#F4F0E6] text-sm font-medium rounded-sm hover:bg-[#B66F52] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <Search className="w-4 h-4" />
                <span>Search Stays</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* C. DISCOVER KALAW — ASYMMETRICAL EDITORIAL SHOWCASE */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10 py-20 md:py-28 border-b border-[#D9CCB8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <ScrollReveal className="lg:col-span-5 space-y-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
              01. Discover Kalaw
            </p>
            <h2 className="font-serif text-4xl md:text-5xl leading-[1.08] text-[#243D32] headline-balance">
              Where pine forests meet quiet highland villages.
            </h2>
            <p className="text-base text-[#292B27]/85 leading-relaxed">
              Once a sleepy railway hill station, Kalaw unfolds across rolling Shan ridges carpeted in Khasi pines, red-earth trekking paths, and family tea terraces. Mornings arrive crisp and veiled in valley fog; afternoons glow warm against century-old brick verandas.
            </p>
            <blockquote className="py-5 border-t border-b border-[#D9CCB8] font-serif italic text-2xl text-[#243D32] leading-snug">
              “A place measured not in monuments, but in cedar air, slow footpaths, and morning bowls of warm Shan noodles.”
            </blockquote>
            <div className="grid grid-cols-3 gap-6 pt-2 tabular-nums">
              <div>
                <p className="font-serif text-3xl text-[#243D32]">1,320 m</p>
                <p className="text-xs text-[#52634A] mt-1">Average Elevation</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[#243D32]">5-Day</p>
                <p className="text-xs text-[#52634A] mt-1">Rotating Hill Market</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-[#243D32]">18–22°C</p>
                <p className="text-xs text-[#52634A] mt-1">Cool Season Days</p>
              </div>
            </div>
          </ScrollReveal>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            <ScrollReveal delay={0.1} className="sm:col-span-7">
              <figure className="group">
                <EditorialImage
                  src={IMG_PINE_TRAIL}
                  alt="Red-earth hiking path winding through Burmese pine forest in Kalaw"
                  aspectClass="aspect-[4/3]"
                />
                <figcaption className="mt-2.5 text-xs font-serif italic text-[#52634A]">
                  Fig. 01 — Red-earth footpath descending through the Myin Ma Hti pine corridor.
                </figcaption>
              </figure>
            </ScrollReveal>
            <ScrollReveal delay={0.22} className="sm:col-span-5 sm:mt-14">
              <figure className="group">
                <EditorialImage
                  src={IMG_PAGODA_VIEWPOINT}
                  alt="Ancient hillside stupas framed by pine branches and morning fog in Kalaw"
                  aspectClass="aspect-[3/4]"
                />
                <figcaption className="mt-2.5 text-xs font-serif italic text-[#52634A]">
                  Fig. 02 — Dawn mist rising behind Thein Taung’s brick stupas.
                </figcaption>
              </figure>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* D. EXPLORE PLACES */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10 py-20 md:py-24 border-b border-[#D9CCB8]">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
              02. Explore Places
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#243D32]">
              Viewpoints, Ridges &amp; Cultural Landmarks
            </h2>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#243D32] hover:text-[#B66F52] transition-colors whitespace-nowrap shrink-0"
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>

        {/* Category filter tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-[#D9CCB8] pb-4">
          {DEST_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setDestFilter(category)}
              className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                destFilter === category
                  ? 'bg-[#243D32] text-[#F4F0E6]'
                  : 'text-[#292B27]/80 hover:bg-[#D9CCB8]/50'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredDestinations.map((dest, idx) => (
            <ScrollStaggerItem key={dest.id} index={idx} className="flex flex-col">
              <article className="group flex flex-col flex-1">
                <div className="relative">
                  <Link to={`/destinations/${dest.slug}`}>
                    <EditorialImage src={dest.image} alt={dest.name} aspectClass="aspect-[4/3]" />
                  </Link>
                  <div className="absolute top-3 right-3">
                    <FavoriteButton itemId={dest.id} compact />
                  </div>
                </div>
                <div className="pt-4 space-y-2 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-[#52634A]">
                    <span>{dest.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{dest.location}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{dest.elevation}</span>
                  </div>
                  <h3 className="font-serif text-2xl text-[#243D32] group-hover:text-[#B66F52] transition-colors">
                    <Link to={`/destinations/${dest.slug}`}>{dest.name}</Link>
                  </h3>
                  <p className="text-sm text-[#292B27]/80 leading-relaxed flex-1">
                    {dest.shortDescription}
                  </p>
                  <Link
                    to={`/destinations/${dest.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#243D32] pt-2 hover:text-[#B66F52] transition-colors"
                  >
                    <span>Read Destination Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            </ScrollStaggerItem>
          ))}
        </div>
      </section>

      {/* E. FIND YOUR STAY */}
      <section className="bg-[#EBE5D8]/60 border-b border-[#D9CCB8]">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-20 md:py-24">
          <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="space-y-2 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
                03. Find Your Stay
              </p>
              <h2 className="font-serif text-3xl md:text-4xl text-[#243D32]">
                Heritage Lodges, Hill Cabins &amp; Homestays
              </h2>
            </div>
            <Link
              to="/stays"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[#243D32] hover:text-[#B66F52] transition-colors whitespace-nowrap shrink-0"
            >
              <span>Browse All Stays</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>

          <div className="flex flex-wrap items-center gap-2 mb-10 border-b border-[#D9CCB8] pb-4">
            {STAY_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setStayFilter(category)}
                className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  stayFilter === category
                    ? 'bg-[#243D32] text-[#F4F0E6]'
                    : 'text-[#292B27]/80 hover:bg-[#D9CCB8]/60'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredStays.map((stay, idx) => (
              <ScrollStaggerItem key={stay.id} index={idx} className="flex flex-col">
                <article className="group bg-[#F4F0E6] border border-[#D9CCB8] flex flex-col flex-1">
                  <div className="relative">
                    <Link to={`/stays/${stay.slug}`}>
                      <EditorialImage src={stay.images[0]} alt={stay.name} aspectClass="aspect-[4/3]" />
                    </Link>
                    <div className="absolute top-3 right-3">
                      <FavoriteButton itemId={stay.id} compact />
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#52634A]">
                      <span>{stay.category} · {stay.location}</span>
                      <span className="inline-flex items-center gap-1 text-[#243D32] font-medium tabular-nums">
                        <Star className="w-3.5 h-3.5 fill-[#B66F52] text-[#B66F52]" />
                        {stay.rating.toFixed(1)}
                      </span>
                    </div>
                    <h3 className="font-serif text-2xl text-[#243D32]">
                      <Link to={`/stays/${stay.slug}`} className="hover:text-[#B66F52] transition-colors">
                        {stay.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-[#292B27]/80 leading-relaxed flex-1">
                      {stay.shortDescription}
                    </p>
                    <div className="pt-4 border-t border-[#D9CCB8] flex items-center justify-between">
                      <div>
                        <span className="font-serif text-2xl text-[#243D32] tabular-nums">
                          ${stay.pricePerNight}
                        </span>
                        <span className="text-xs text-[#52634A]"> / night</span>
                      </div>
                      <Link
                        to={`/stays/${stay.slug}`}
                        className="px-4 py-2 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </article>
              </ScrollStaggerItem>
            ))}
          </div>
        </div>
      </section>

      {/* F & G. LOCAL EXPERIENCES + FOOD & RESTAURANTS */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10 py-20 md:py-24 border-b border-[#D9CCB8]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-14">
          {/* Left: Local Experiences */}
          <ScrollReveal className="lg:col-span-6 space-y-8">
            <div className="flex items-end justify-between border-b border-[#D9CCB8] pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
                  04. Local Experiences
                </p>
                <h2 className="font-serif text-3xl text-[#243D32] mt-1">
                  Guided Treks &amp; Cultural Walks
                </h2>
              </div>
              <Link
                to="/experiences"
                className="text-xs font-medium text-[#243D32] hover:text-[#B66F52] whitespace-nowrap"
              >
                All Experiences →
              </Link>
            </div>

            <div className="space-y-6">
              {experiences.slice(0, 3).map((exp) => (
                <article
                  key={exp.id}
                  className="group grid grid-cols-1 sm:grid-cols-12 gap-5 pb-6 border-b border-[#D9CCB8] last:border-b-0"
                >
                  <Link to="/experiences" className="sm:col-span-4">
                    <EditorialImage src={exp.image} alt={exp.title} aspectClass="aspect-[4/3]" />
                  </Link>
                  <div className="sm:col-span-8 flex flex-col justify-between space-y-2">
                    <div className="space-y-1.5">
                      <p className="text-xs text-[#52634A]">
                        {exp.category} · {exp.duration} · {exp.difficulty}
                      </p>
                      <h3 className="font-serif text-xl text-[#243D32] group-hover:text-[#B66F52] transition-colors">
                        <Link to="/experiences">{exp.title}</Link>
                      </h3>
                      <p className="text-sm text-[#292B27]/80 leading-relaxed">
                        {exp.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-sm font-medium text-[#243D32] tabular-nums">
                        ${exp.pricePerGuest} / guest
                      </span>
                      <Link
                        to="/experiences"
                        className="text-xs font-medium text-[#B66F52] hover:underline"
                      >
                        Request Experience →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ScrollReveal>

          {/* Right: Food & Restaurants */}
          <ScrollReveal delay={0.12} className="lg:col-span-6 space-y-8">
            <div className="flex items-end justify-between border-b border-[#D9CCB8] pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
                  05. Food &amp; Dining
                </p>
                <h2 className="font-serif text-3xl text-[#243D32] mt-1">
                  Shan Kitchens &amp; Mountain Roasteries
                </h2>
              </div>
              <Link
                to="/dining"
                className="text-xs font-medium text-[#243D32] hover:text-[#B66F52] whitespace-nowrap"
              >
                All Dining →
              </Link>
            </div>

            <div className="space-y-6">
              {restaurants.slice(0, 3).map((rest) => (
                <article
                  key={rest.id}
                  className="group grid grid-cols-1 sm:grid-cols-12 gap-5 pb-6 border-b border-[#D9CCB8] last:border-b-0"
                >
                  <Link to="/dining" className="sm:col-span-4">
                    <EditorialImage src={rest.image} alt={rest.name} aspectClass="aspect-[4/3]" />
                  </Link>
                  <div className="sm:col-span-8 flex flex-col justify-between space-y-2">
                    <div className="space-y-1.5">
                      <p className="text-xs text-[#52634A]">
                        {rest.cuisine} · {rest.priceRange} · {rest.openingHours}
                      </p>
                      <h3 className="font-serif text-xl text-[#243D32] group-hover:text-[#B66F52] transition-colors">
                        <Link to="/dining">{rest.name}</Link>
                      </h3>
                      <p className="text-sm text-[#292B27]/80 leading-relaxed">
                        {rest.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center justify-between pt-1 text-xs text-[#52634A]">
                      <span>{rest.location}</span>
                      <Link
                        to="/dining"
                        className="font-medium text-[#243D32] hover:text-[#B66F52]"
                      >
                        View Menu Notes →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* H. TRANSPORTATION & RENTALS + I. REAL ESTATE MARKETPLACE */}
      <section className="bg-[#292B27] text-[#F4F0E6]">
        <div className="max-w-[1360px] mx-auto px-6 md:px-10 py-20 md:py-24 space-y-20">
          {/* Transportation & Rentals Strip */}
          <div className="space-y-8">
            <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F4F0E6]/15 pb-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#D9CCB8] font-medium">
                  06. Transportation &amp; Rentals
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-[#F4F0E6] mt-1">
                  Move Across the Plateau at Your Own Pace
                </h2>
              </div>
              <Link
                to="/rentals"
                className="text-sm text-[#D9CCB8] hover:text-[#F4F0E6] inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>Explore Vehicles &amp; Drivers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </ScrollReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rentals.slice(0, 4).map((rental, idx) => (
                <ScrollStaggerItem key={rental.id} index={idx} className="flex">
                  <Link
                    to="/rentals"
                    className="group border border-[#F4F0E6]/15 p-5 hover:border-[#D9CCB8]/50 transition-colors flex flex-col justify-between space-y-4 w-full"
                  >
                    <div className="space-y-2">
                      <p className="text-xs text-[#D9CCB8]/75">{rental.category}</p>
                      <h3 className="font-serif text-xl text-[#F4F0E6] group-hover:text-[#D9CCB8] transition-colors">
                        {rental.name}
                      </h3>
                      <p className="text-xs text-[#F4F0E6]/70 leading-relaxed">
                        {rental.shortDescription}
                      </p>
                    </div>
                    <div className="pt-3 border-t border-[#F4F0E6]/10 flex items-center justify-between text-xs tabular-nums">
                      <span className="text-[#D9CCB8] font-medium">
                        ${rental.pricePerDay} / day
                      </span>
                      <span className="text-[#F4F0E6]/70">{rental.capacity}</span>
                    </div>
                  </Link>
                </ScrollStaggerItem>
              ))}
            </div>
          </div>

          {/* Real Estate Marketplace */}
          <div className="space-y-10">
            <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#F4F0E6]/15 pb-6">
              <div className="space-y-2 max-w-2xl">
                <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
                  07. Highland Real Estate Marketplace
                </p>
                <h2 className="font-serif text-3xl md:text-4xl text-[#F4F0E6]">
                  Houses, Ridge Land &amp; Heritage Residences
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <Link
                  to="/real-estate?submit=1"
                  className="px-4 py-2 border border-[#D9CCB8]/40 text-xs font-medium text-[#F4F0E6] rounded-sm hover:bg-[#F4F0E6]/10 transition-colors whitespace-nowrap"
                >
                  List a Property
                </Link>
                <Link
                  to="/real-estate"
                  className="text-sm text-[#D9CCB8] hover:text-[#F4F0E6] inline-flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span>View Marketplace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.slice(0, 3).map((prop, idx) => (
                <ScrollStaggerItem key={prop.id} index={idx} className="flex">
                  <article className="group border border-[#F4F0E6]/15 bg-[#243D32]/35 flex flex-col w-full">
                    <Link to={`/real-estate/${prop.slug}`}>
                      <EditorialImage src={prop.images[0]} alt={prop.title} aspectClass="aspect-[4/3]" />
                    </Link>
                    <div className="p-6 flex-1 flex flex-col space-y-3">
                      <p className="text-xs text-[#D9CCB8]/80">
                        {prop.category} · {prop.location}
                      </p>
                      <h3 className="font-serif text-2xl text-[#F4F0E6] group-hover:text-[#D9CCB8] transition-colors">
                        <Link to={`/real-estate/${prop.slug}`}>{prop.title}</Link>
                      </h3>
                      <p className="text-sm text-[#F4F0E6]/75 leading-relaxed flex-1">
                        {prop.shortDescription}
                      </p>
                      <div className="pt-4 border-t border-[#F4F0E6]/15 flex items-center justify-between">
                        <span className="font-serif text-2xl text-[#F4F0E6] tabular-nums">
                          ${prop.price.toLocaleString()}
                          {prop.priceUnit === 'per month' ? ' / mo' : ''}
                        </span>
                        <span className="text-xs text-[#D9CCB8] tabular-nums">{prop.areaSize}</span>
                      </div>
                    </div>
                  </article>
                </ScrollStaggerItem>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* J. TRAVEL INSPIRATION / JOURNAL */}
      <section className="max-w-[1360px] mx-auto px-6 md:px-10 py-20 md:py-28">
        <ScrollReveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-[#D9CCB8] pb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
              08. The Kalaw Journal
            </p>
            <h2 className="font-serif text-3xl md:text-4xl text-[#243D32] mt-1">
              Field Notes, Seasonal Guides &amp; Culinary Stories
            </h2>
          </div>
          <Link
            to="/journal"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#243D32] hover:text-[#B66F52] transition-colors whitespace-nowrap"
          >
            <span>Read All Dispatches</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {leadArticle && (
            <ScrollReveal className="lg:col-span-7">
              <article className="group">
                <Link to={`/journal/${leadArticle.slug}`}>
                  <EditorialImage
                    src={leadArticle.coverImage}
                    alt={leadArticle.title}
                    aspectClass="aspect-[16/10]"
                  />
                </Link>
                <div className="pt-5 space-y-3">
                  <p className="text-xs text-[#52634A]">
                    {leadArticle.category} · {leadArticle.publishedAt} · {leadArticle.readTime}
                  </p>
                  <h3 className="font-serif text-3xl md:text-4xl text-[#243D32] group-hover:text-[#B66F52] transition-colors headline-balance">
                    <Link to={`/journal/${leadArticle.slug}`}>{leadArticle.title}</Link>
                  </h3>
                  <p className="text-base text-[#292B27]/80 leading-relaxed max-w-2xl">
                    {leadArticle.excerpt}
                  </p>
                </div>
              </article>
            </ScrollReveal>
          )}

          <div className="lg:col-span-5 divide-y divide-[#D9CCB8] border-t border-b border-[#D9CCB8] lg:border-t-0">
            {secondaryArticles.map((article, idx) => (
              <ScrollStaggerItem key={article.id} index={idx}>
                <article className="py-6 first:pt-0 group flex gap-5">
                  <Link to={`/journal/${article.slug}`} className="w-28 shrink-0">
                    <EditorialImage src={article.coverImage} alt={article.title} aspectClass="aspect-square" />
                  </Link>
                  <div className="space-y-1.5">
                    <p className="text-xs text-[#52634A]">
                      {article.category} · {article.readTime}
                    </p>
                    <h3 className="font-serif text-xl text-[#243D32] group-hover:text-[#B66F52] transition-colors">
                      <Link to={`/journal/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <p className="text-xs text-[#292B27]/75 leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </article>
              </ScrollStaggerItem>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
