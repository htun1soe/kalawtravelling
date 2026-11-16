import React, { useCallback, useEffect, useState } from 'react';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { StatusLabel } from '../components/StatusLabel';
import { useApp } from '../context/AppContext';
import {
  IMG_BOUTIQUE_VILLA,
  IMG_ESTATE_HOUSE,
  IMG_FOREST_RESERVE,
  IMG_PINE_TRAIL,
  IMG_SHAN_NOODLES,
  IMG_TRAIL_MOTORBIKE,
} from '../data/kalawData';
import {
  createArticle,
  createDestination,
  createExperience,
  createPropertyListing,
  createRental,
  createRestaurant,
  createStay,
  deleteCatalogItem,
  fetchBookings,
  fetchUsers,
  updateBookingStatus,
} from '../services/api';
import type { BookingRequest, UserAccount } from '../types/kalaw';

type AdminTab =
  | 'bookings'
  | 'destinations'
  | 'stays'
  | 'experiences'
  | 'restaurants'
  | 'rentals'
  | 'properties'
  | 'articles'
  | 'users';

export const AdminDashboardPage: React.FC = () => {
  const {
    destinations,
    stays,
    experiences,
    restaurants,
    rentals,
    properties,
    articles,
    refreshCatalog,
  } = useApp();

  const [tab, setTab] = useState<AdminTab>('bookings');
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Quick Add state
  const [newTitle, setNewTitle] = useState('');
  const [newLocation, setNewLocation] = useState('Kalaw Hills');
  const [newPrice, setNewPrice] = useState('120');
  const [newSummary, setNewSummary] = useState('');
  const [creating, setCreating] = useState(false);

  const loadAdminData = useCallback(async () => {
    try {
      const [bkList, userList] = await Promise.all([fetchBookings(), fetchUsers()]);
      setBookings(bkList);
      setUsers(userList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load admin records.');
    }
  }, []);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleBookingDecision = async (id: string, status: 'verified' | 'declined') => {
    try {
      const updated = await updateBookingStatus(id, status);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking.');
    }
  };

  const handleDelete = async (
    resource: 'destinations' | 'stays' | 'experiences' | 'restaurants' | 'rentals' | 'properties' | 'articles',
    id: string
  ) => {
    try {
      await deleteCatalogItem(resource, id);
      await refreshCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed.');
    }
  };

  const handleQuickCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setCreating(true);
    setError(null);
    try {
      if (tab === 'destinations') {
        await createDestination({
          name: newTitle,
          location: newLocation,
          shortDescription: newSummary || 'Highland destination in Kalaw.',
          image: IMG_PINE_TRAIL,
        });
      } else if (tab === 'stays') {
        await createStay({
          name: newTitle,
          location: newLocation,
          pricePerNight: Number(newPrice) || 95,
          shortDescription: newSummary || 'Boutique highland stay in Kalaw.',
          images: [IMG_BOUTIQUE_VILLA],
        });
      } else if (tab === 'experiences') {
        await createExperience({
          title: newTitle,
          location: newLocation,
          pricePerGuest: Number(newPrice) || 55,
          shortDescription: newSummary || 'Guided Kalaw local experience.',
          image: IMG_PINE_TRAIL,
        });
      } else if (tab === 'restaurants') {
        await createRestaurant({
          name: newTitle,
          location: newLocation,
          shortDescription: newSummary || 'Authentic Shan highland kitchen.',
          image: IMG_SHAN_NOODLES,
        });
      } else if (tab === 'rentals') {
        await createRental({
          name: newTitle,
          location: newLocation,
          pricePerDay: Number(newPrice) || 25,
          shortDescription: newSummary || 'Reliable mountain transport service.',
          image: IMG_TRAIL_MOTORBIKE,
        });
      } else if (tab === 'properties') {
        await createPropertyListing({
          title: newTitle,
          location: newLocation,
          price: Number(newPrice) || 220000,
          shortDescription: newSummary || 'Kalaw residential property listing.',
          images: [IMG_ESTATE_HOUSE],
        });
      } else if (tab === 'articles') {
        await createArticle({
          title: newTitle,
          subtitle: newSummary || 'Editorial dispatch from Kalaw, Shan State.',
          excerpt: newSummary || 'Field notes on highland living and slow travel.',
          coverImage: IMG_FOREST_RESERVE,
        });
      }
      setNewTitle('');
      setNewSummary('');
      await refreshCatalog();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create item.');
    } finally {
      setCreating(false);
    }
  };

  const pendingCount = bookings.filter((b) => b.status === 'pending_verification').length;

  const tabs: Array<{ id: AdminTab; label: string; count: number }> = [
    { id: 'bookings', label: 'Bookings', count: bookings.length },
    { id: 'destinations', label: 'Destinations', count: destinations.length },
    { id: 'stays', label: 'Stays', count: stays.length },
    { id: 'experiences', label: 'Experiences', count: experiences.length },
    { id: 'restaurants', label: 'Restaurants', count: restaurants.length },
    { id: 'rentals', label: 'Rentals', count: rentals.length },
    { id: 'properties', label: 'Properties', count: properties.length },
    { id: 'articles', label: 'Journal', count: articles.length },
    { id: 'users', label: 'Users', count: users.length },
  ];

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10 space-y-10">
      <div className="border-b border-[#D9CCB8] pb-8 space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
          Kalaw Operations Desk
        </p>
        <h1 className="font-serif text-4xl md:text-5xl text-[#243D32]">
          Admin &amp; Content Management
        </h1>
        <p className="text-sm text-[#52634A]">
          Verify incoming booking requests, curate destinations and stays, publish journal dispatches, and manage marketplace listings.
        </p>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 tabular-nums">
        <div className="border border-[#D9CCB8] p-5 bg-[#EBE5D8]/50">
          <p className="text-xs text-[#52634A]">Pending Verification</p>
          <p className="font-serif text-4xl text-[#B66F52] mt-1">{pendingCount}</p>
        </div>
        <div className="border border-[#D9CCB8] p-5 bg-[#EBE5D8]/50">
          <p className="text-xs text-[#52634A]">Stays &amp; Destinations</p>
          <p className="font-serif text-4xl text-[#243D32] mt-1">
            {stays.length + destinations.length}
          </p>
        </div>
        <div className="border border-[#D9CCB8] p-5 bg-[#EBE5D8]/50">
          <p className="text-xs text-[#52634A]">Real Estate Listings</p>
          <p className="font-serif text-4xl text-[#243D32] mt-1">{properties.length}</p>
        </div>
        <div className="border border-[#D9CCB8] p-5 bg-[#EBE5D8]/50">
          <p className="text-xs text-[#52634A]">Registered Users</p>
          <p className="font-serif text-4xl text-[#243D32] mt-1">{users.length}</p>
        </div>
      </div>

      {error && (
        <div role="alert" className="p-3 border border-[#B66F52] bg-[#B66F52]/10 text-xs text-[#292B27]">
          {error}
        </div>
      )}

      {/* Tab Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#D9CCB8] pb-4">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-3.5 py-2 text-xs font-medium rounded-sm transition-colors cursor-pointer tabular-nums whitespace-nowrap ${
              tab === t.id
                ? 'bg-[#243D32] text-[#F4F0E6]'
                : 'text-[#292B27]/80 hover:bg-[#D9CCB8]/50'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* Quick Create Bar for Catalog Tabs */}
      {tab !== 'bookings' && tab !== 'users' && (
        <form
          onSubmit={handleQuickCreate}
          className="border border-[#D9CCB8] bg-[#EBE5D8]/40 p-5 grid grid-cols-1 md:grid-cols-12 gap-3 items-end"
        >
          <div className="md:col-span-3">
            <label className="block text-xs text-[#52634A] mb-1">
              New {tab.slice(0, -1)} Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Enter title..."
              className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-xs"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-[#52634A] mb-1">Location</label>
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-xs"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-[#52634A] mb-1">Rate / Price ($)</label>
            <input
              type="number"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-xs tabular-nums"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs text-[#52634A] mb-1">Short Summary</label>
            <input
              type="text"
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              placeholder="Editorial summary..."
              className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-xs"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="w-full py-2 px-3 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{creating ? 'Adding...' : 'Publish'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Tab Content */}
      {tab === 'bookings' && (
        <div className="overflow-x-auto border border-[#D9CCB8]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EBE5D8]/70 border-b border-[#D9CCB8] text-[#52634A] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Guest</th>
                <th className="py-3 px-4">Listing</th>
                <th className="py-3 px-4">Dates / Party</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9CCB8] tabular-nums">
              {bookings.map((bk) => (
                <tr key={bk.id} className="hover:bg-[#EBE5D8]/30">
                  <td className="py-3.5 px-4 font-medium text-[#243D32]">{bk.referenceCode}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-[#292B27]">{bk.userName}</div>
                    <div className="text-[#52634A]">{bk.userEmail}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-[#243D32] font-medium">{bk.itemTitle}</div>
                    <div className="text-[#52634A] uppercase">{bk.itemType}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {bk.checkIn}
                    {bk.checkOut ? ` → ${bk.checkOut}` : ''} · {bk.guests} guests
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusLabel status={bk.status} />
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {bk.status === 'pending_verification' && (
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleBookingDecision(bk.id, 'verified')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#243D32] text-[#F4F0E6] rounded-sm hover:bg-[#52634A] cursor-pointer"
                        >
                          <Check className="w-3 h-3" />
                          <span>Verify</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleBookingDecision(bk.id, 'declined')}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 border border-[#B66F52] text-[#B66F52] rounded-sm hover:bg-[#B66F52]/10 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'destinations' && (
        <ManagementTable
          rows={destinations.map((d) => ({ id: d.id, title: d.name, meta: `${d.category} · ${d.location}`, right: d.elevation }))}
          onDelete={(id) => handleDelete('destinations', id)}
        />
      )}
      {tab === 'stays' && (
        <ManagementTable
          rows={stays.map((s) => ({ id: s.id, title: s.name, meta: `${s.category} · ${s.location}`, right: `$${s.pricePerNight}/nt` }))}
          onDelete={(id) => handleDelete('stays', id)}
        />
      )}
      {tab === 'experiences' && (
        <ManagementTable
          rows={experiences.map((e) => ({ id: e.id, title: e.title, meta: `${e.category} · ${e.duration}`, right: `$${e.pricePerGuest}` }))}
          onDelete={(id) => handleDelete('experiences', id)}
        />
      )}
      {tab === 'restaurants' && (
        <ManagementTable
          rows={restaurants.map((r) => ({ id: r.id, title: r.name, meta: `${r.cuisine} · ${r.openingHours}`, right: r.priceRange }))}
          onDelete={(id) => handleDelete('restaurants', id)}
        />
      )}
      {tab === 'rentals' && (
        <ManagementTable
          rows={rentals.map((r) => ({ id: r.id, title: r.name, meta: `${r.category} · ${r.capacity}`, right: `$${r.pricePerDay}/day` }))}
          onDelete={(id) => handleDelete('rentals', id)}
        />
      )}
      {tab === 'properties' && (
        <ManagementTable
          rows={properties.map((p) => ({ id: p.id, title: p.title, meta: `${p.category} · ${p.location}`, right: `$${p.price.toLocaleString()}` }))}
          onDelete={(id) => handleDelete('properties', id)}
        />
      )}
      {tab === 'articles' && (
        <ManagementTable
          rows={articles.map((a) => ({ id: a.id, title: a.title, meta: `${a.category} · ${a.author}`, right: a.publishedAt }))}
          onDelete={(id) => handleDelete('articles', id)}
        />
      )}

      {tab === 'users' && (
        <div className="overflow-x-auto border border-[#D9CCB8]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#EBE5D8]/70 border-b border-[#D9CCB8] text-[#52634A] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9CCB8]">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="py-3 px-4 font-medium text-[#243D32]">{u.name}</td>
                  <td className="py-3 px-4 text-[#52634A]">{u.email}</td>
                  <td className="py-3 px-4 uppercase">{u.role}</td>
                  <td className="py-3 px-4">{u.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const ManagementTable: React.FC<{
  rows: Array<{ id: string; title: string; meta: string; right: string }>;
  onDelete: (id: string) => void;
}> = ({ rows, onDelete }) => (
  <div className="divide-y divide-[#D9CCB8] border border-[#D9CCB8]">
    {rows.map((row) => (
      <div key={row.id} className="p-4 flex items-center justify-between gap-4 hover:bg-[#EBE5D8]/30">
        <div>
          <p className="font-serif text-lg text-[#243D32]">{row.title}</p>
          <p className="text-xs text-[#52634A]">{row.meta}</p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-xs font-medium text-[#243D32] tabular-nums">{row.right}</span>
          <button
            type="button"
            onClick={() => onDelete(row.id)}
            aria-label={`Delete ${row.title}`}
            className="p-1.5 text-[#52634A] hover:text-[#B66F52] cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    ))}
  </div>
);
