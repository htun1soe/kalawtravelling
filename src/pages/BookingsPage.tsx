import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatusLabel } from '../components/StatusLabel';
import { useApp } from '../context/AppContext';
import { fetchBookings, updateBookingStatus } from '../services/api';
import type { BookingRequest } from '../types/kalaw';

export const BookingsPage: React.FC = () => {
  const { user, t } = useApp();
  const [bookings, setBookings] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBookings(user?.role === 'admin' ? undefined : user?.id);
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load booking requests.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleCancel = async (id: string) => {
    try {
      const updated = await updateBookingStatus(id, 'cancelled');
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update booking status.');
    }
  };

  return (
    <div className="pt-24 pb-24 max-w-[1360px] mx-auto px-6 md:px-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#D9CCB8]">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.2em] text-[#B66F52] font-medium">
            {t.pages.bookingsEyebrow}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-[#243D32]">
            {t.pages.bookingsTitle}
          </h1>
          <p className="text-sm text-[#52634A] max-w-2xl">
            {t.pages.bookingsDesc}
          </p>
        </div>
        <Link
          to="/stays"
          className="px-4 py-2.5 bg-[#243D32] text-[#F4F0E6] text-xs font-medium rounded-sm hover:bg-[#52634A] whitespace-nowrap self-start md:self-auto"
        >
          {t.home.browseAllStays}
        </Link>
      </div>

      {error && (
        <div role="alert" className="mt-6 p-4 border border-[#B66F52] bg-[#B66F52]/10 text-sm text-[#292B27]">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-sm text-[#52634A]">Loading booking requests...</div>
      ) : bookings.length === 0 ? (
        <div className="py-16 text-center space-y-4 border-b border-[#D9CCB8]">
          <p className="font-serif text-2xl text-[#243D32]">No booking requests yet.</p>
          <p className="text-sm text-[#52634A]">
            Explore boutique lodges, guided hikes, or vehicle rentals to submit your first request.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#D9CCB8] pt-4">
          {bookings.map((bk) => (
            <div
              key={bk.id}
              className="py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
            >
              <div className="lg:col-span-5 space-y-1">
                <p className="text-xs text-[#52634A] tabular-nums">
                  {bk.referenceCode} · {bk.itemType.toUpperCase()}
                </p>
                <h2 className="font-serif text-2xl text-[#243D32]">{bk.itemTitle}</h2>
                {bk.notes && <p className="text-xs text-[#52634A] italic">Note: “{bk.notes}”</p>}
              </div>

              <div className="lg:col-span-3 text-xs text-[#292B27] space-y-1 tabular-nums">
                <p>
                  Date: <span className="font-medium">{bk.checkIn}</span>
                  {bk.checkOut ? ` → ${bk.checkOut}` : ''}
                </p>
                <p>Party: {bk.guests} Guests</p>
                {bk.totalEstimate > 0 && (
                  <p className="font-medium text-[#243D32]">
                    Est. ${bk.totalEstimate.toLocaleString()}
                  </p>
                )}
              </div>

              <div className="lg:col-span-2">
                <StatusLabel status={bk.status} />
              </div>

              <div className="lg:col-span-2 flex lg:justify-end">
                {bk.status === 'pending_verification' && (
                  <button
                    type="button"
                    onClick={() => handleCancel(bk.id)}
                    className="px-3.5 py-2 border border-[#D9CCB8] text-xs font-medium text-[#292B27] hover:border-[#B66F52] hover:text-[#B66F52] rounded-sm cursor-pointer"
                  >
                    {t.actions.cancelRequest}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
