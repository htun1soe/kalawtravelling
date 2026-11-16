import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { useApp } from '../context/AppContext';
import {
  IMG_BOUTIQUE_VILLA,
  IMG_ESTATE_HOUSE,
  IMG_HOSPITALITY_CORNER,
  IMG_RIDGE_LAND,
} from '../data/kalawData';
import { createPropertyListing } from '../services/api';
import type { PropertyCategory } from '../types/kalaw';

const CATEGORIES: Array<'All' | PropertyCategory> = [
  'All',
  'Houses for Sale',
  'Houses for Rent',
  'Land for Sale',
  'Commercial Properties',
];

export const RealEstatePage: React.FC = () => {
  const { properties, refreshCatalog, t } = useApp();
  const [searchParams] = useSearchParams();
  const initialCat = (searchParams.get('cat') as PropertyCategory | null) || 'All';
  const [selectedCat, setSelectedCat] = useState<'All' | PropertyCategory>(
    CATEGORIES.includes(initialCat) ? initialCat : 'All'
  );
  const [showSubmitModal, setShowSubmitModal] = useState(searchParams.get('submit') === '1');

  // New Property Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('Houses for Sale');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('240000');
  const [areaSize, setAreaSize] = useState('0.35 Acres');
  const [bedrooms, setBedrooms] = useState('3');
  const [agentName, setAgentName] = useState('');
  const [agentContact, setAgentContact] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [imageChoice, setImageChoice] = useState(IMG_ESTATE_HOUSE);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const filtered = useMemo(
    () =>
      selectedCat === 'All'
        ? properties
        : properties.filter((p) => p.category === selectedCat),
    [properties, selectedCat]
  );

  const handleSubmitProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);
    try {
      await createPropertyListing({
        title,
        category,
        location,
        price: Number(price),
        priceUnit: category === 'Houses for Rent' ? 'per month' : 'total',
        areaSize,
        bedrooms: category === 'Land for Sale' ? undefined : Number(bedrooms),
        agentName: agentName || 'Owner Listing',
        agentContact: agentContact || 'realty@kalawtravel.com',
        shortDescription,
        description: shortDescription,
        images: [imageChoice],
        status: 'Active',
      });
      await refreshCatalog();
      setSubmitSuccess(true);
      setTitle('');
      setLocation('');
      setShortDescription('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Unable to submit listing.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-[#D9CCB8]">
        <div className="max-w-3xl space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
            {t.pages.reEyebrow}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#243D32] headline-balance">
            {t.pages.reTitle}
          </h1>
          <p className="text-base text-[#292B27]/80 leading-relaxed">
            {t.pages.reDesc}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setSubmitSuccess(false);
            setShowSubmitModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.home.listProperty}</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 py-6 border-b border-[#D9CCB8]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCat(cat)}
            className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer whitespace-nowrap ${
              selectedCat === cat
                ? 'bg-[#243D32] text-[#F4F0E6]'
                : 'text-[#292B27]/80 hover:bg-[#D9CCB8]/50'
            }`}
          >
            {t.categories[cat] || cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-10">
        {filtered.map((prop) => (
          <PropertyCard key={prop.id} prop={prop} variant="light" />
        ))}
      </div>

      {/* Submit Property Listing Modal */}
      {showSubmitModal && (
        <div
          className="fixed inset-0 z-50 bg-[#292B27]/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="List a Property on Kalaw Travel"
        >
          <div className="bg-[#F4F0E6] border border-[#D9CCB8] max-w-xl w-full p-6 md:p-8 relative space-y-5 my-8">
            <button
              type="button"
              onClick={() => setShowSubmitModal(false)}
              aria-label="Close property form"
              className="absolute top-4 right-4 p-2 text-[#52634A] hover:text-[#243D32] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <p className="text-xs uppercase tracking-widest text-[#B66F52]">Owner &amp; Agent Portal</p>
              <h2 className="font-serif text-3xl text-[#243D32] mt-1">List a Kalaw Property</h2>
            </div>

            {submitSuccess ? (
              <div className="space-y-4 py-4">
                <p className="text-sm text-[#243D32]">
                  Your property listing has been published to the Kalaw Real Estate marketplace.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-5 py-2.5 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm cursor-pointer"
                >
                  Return to Listings
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitProperty} className="space-y-4">
                <div>
                  <label className="block text-xs text-[#52634A] mb-1">Property Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Cedar Valley Stone Residence"
                    className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#52634A] mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                      className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
                    >
                      <option value="Houses for Sale">Houses for Sale</option>
                      <option value="Houses for Rent">Houses for Rent</option>
                      <option value="Land for Sale">Land for Sale</option>
                      <option value="Commercial Properties">Commercial Properties</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#52634A] mb-1">Location / Quarter</label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Upper Pine Ridge"
                      className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#52634A] mb-1">
                      Price (USD {category === 'Houses for Rent' ? '/mo' : ''})
                    </label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#52634A] mb-1">Land / Floor Size</label>
                    <input
                      type="text"
                      required
                      value={areaSize}
                      onChange={(e) => setAreaSize(e.target.value)}
                      className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#52634A] mb-1">Bedrooms</label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm tabular-nums"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#52634A] mb-1">Owner / Agent Name</label>
                    <input
                      type="text"
                      required
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      placeholder="U Kyaw Zin"
                      className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#52634A] mb-1">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={agentContact}
                      onChange={(e) => setAgentContact(e.target.value)}
                      placeholder="agent@kalawtravel.com"
                      className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#52634A] mb-1">Cover Photograph Preset</label>
                  <select
                    value={imageChoice}
                    onChange={(e) => setImageChoice(e.target.value)}
                    className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
                  >
                    <option value={IMG_ESTATE_HOUSE}>Hillside Timber &amp; Stone Residence</option>
                    <option value={IMG_BOUTIQUE_VILLA}>Heritage Veranda Bungalow</option>
                    <option value={IMG_RIDGE_LAND}>Elevated Pine Ridge Acreage</option>
                    <option value={IMG_HOSPITALITY_CORNER}>Heritage Brick Corner Inn</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#52634A] mb-1">Description</label>
                  <textarea
                    rows={3}
                    required
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Describe views, title status, water/power access, and architectural highlights..."
                    className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
                  />
                </div>

                {submitError && (
                  <p className="text-xs text-[#B66F52] border border-[#B66F52] p-2.5">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 bg-[#243D32] text-[#F4F0E6] text-sm font-medium rounded-sm hover:bg-[#52634A] cursor-pointer"
                >
                  {submitting ? 'Publishing Listing...' : 'Publish Property Listing'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
