import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, ShieldCheck } from 'lucide-react';
import { EditorialImage } from '../components/EditorialImage';
import { FavoriteButton } from '../components/FavoriteButton';
import { useApp } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const {
    user,
    signOut,
    updateProfile,
    destinations,
    stays,
    experiences,
    properties,
    localFavorites,
    t,
  } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const favIds = user ? user.favorites : localFavorites;

  const savedItems = useMemo(() => {
    const items: Array<{ id: string; title: string; subtitle: string; to: string; image: string }> = [];
    destinations.forEach((d) => {
      if (favIds.includes(d.id)) {
        items.push({ id: d.id, title: d.name, subtitle: `Destination · ${d.location}`, to: `/destinations/${d.slug}`, image: d.image });
      }
    });
    stays.forEach((s) => {
      if (favIds.includes(s.id)) {
        items.push({ id: s.id, title: s.name, subtitle: `Stay · $${s.pricePerNight}/night`, to: `/stays/${s.slug}`, image: s.images[0] });
      }
    });
    experiences.forEach((e) => {
      if (favIds.includes(e.id)) {
        items.push({ id: e.id, title: e.title, subtitle: `Experience · ${e.duration}`, to: '/experiences', image: e.image });
      }
    });
    properties.forEach((p) => {
      if (favIds.includes(p.id)) {
        items.push({ id: p.id, title: p.title, subtitle: `Real Estate · $${p.price.toLocaleString()}`, to: `/real-estate/${p.slug}`, image: p.images[0] });
      }
    });
    return items;
  }, [favIds, destinations, stays, experiences, properties]);

  if (!user) {
    return (
      <div className="pt-28 pb-24 max-w-[1360px] mx-auto px-6 md:px-10 space-y-12">
        <div className="border border-[#D9CCB8] p-8 md:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="font-serif text-3xl text-[#243D32]">Sign In to Your Profile</h1>
            <p className="text-sm text-[#52634A]">
              Manage your saved Kalaw favorites, booking history, and property inquiries.
            </p>
          </div>
          <Link
            to="/auth"
            className="px-5 py-3 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] whitespace-nowrap"
          >
            {t.nav.signIn}
          </Link>
        </div>

        {savedItems.length > 0 && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-[#243D32]">Saved Places (Guest Session)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedItems.map((item) => (
                <Link key={item.id} to={item.to} className="group border border-[#D9CCB8] p-4 space-y-3">
                  <EditorialImage src={item.image} alt={item.title} aspectClass="aspect-[4/3]" />
                  <p className="text-xs text-[#52634A]">{item.subtitle}</p>
                  <h3 className="font-serif text-xl text-[#243D32] group-hover:text-[#B66F52]">{item.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(false);
    try {
      await updateProfile({ name, location, bio });
      setSavedMsg(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10 space-y-14">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#D9CCB8]">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
            {user.role === 'admin' ? 'Administrator Account' : user.role === 'owner' ? 'Property Host Account' : 'Traveler Profile'}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#243D32]">{user.name}</h1>
          <p className="text-sm text-[#52634A]">{user.email} · {user.location}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/bookings"
            className="px-4 py-2.5 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A]"
          >
            {t.nav.bookings}
          </Link>
          {user.role === 'admin' && (
            <Link
              to="/admin"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#243D32] text-[#243D32] text-xs font-medium rounded-sm hover:bg-[#D9CCB8]/40"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Dashboard</span>
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              signOut();
              navigate('/');
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#D9CCB8] text-xs font-medium text-[#292B27] rounded-sm hover:border-[#B66F52] hover:text-[#B66F52] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <form onSubmit={handleSave} className="lg:col-span-5 border border-[#D9CCB8] p-6 md:p-8 space-y-4 h-fit">
          <h2 className="font-serif text-2xl text-[#243D32]">Account Details</h2>
          <div>
            <label className="block text-xs text-[#52634A] mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[#52634A] mb-1">Home Base / Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-[#52634A] mb-1">Travel Notes / Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
            {savedMsg && <span className="text-xs text-[#52634A]">Profile updated</span>}
          </div>
        </form>

        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-serif text-3xl text-[#243D32] border-b border-[#D9CCB8] pb-3">
            Saved Favorites ({savedItems.length})
          </h2>
          {savedItems.length === 0 ? (
            <p className="text-sm text-[#52634A]">
              You haven’t saved any destinations, stays, or properties yet. Click the heart icon on any listing to save it here.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {savedItems.map((item) => (
                <div key={item.id} className="border border-[#D9CCB8] bg-[#F4F0E6] flex flex-col">
                  <div className="relative">
                    <Link to={item.to}>
                      <EditorialImage src={item.image} alt={item.title} aspectClass="aspect-[4/3]" />
                    </Link>
                    <div className="absolute top-3 right-3">
                      <FavoriteButton itemId={item.id} compact />
                    </div>
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="text-xs text-[#52634A]">{item.subtitle}</p>
                    <h3 className="font-serif text-xl text-[#243D32]">
                      <Link to={item.to} className="hover:text-[#B66F52]">{item.title}</Link>
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
