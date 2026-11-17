import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle2, Clock, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { submitBookingRequest } from '../services/api';
import type { BookingRequest } from '../types/kalaw';

interface BookingRequestPanelProps {
  itemType: BookingRequest['itemType'];
  itemId: string;
  itemTitle: string;
  unitPrice: number;
  priceLabel: string;
  requireCheckOut?: boolean;
  maxGuests?: number;
  ctaLabel?: string;
}

export const BookingRequestPanel: React.FC<BookingRequestPanelProps> = ({
  itemType,
  itemId,
  itemTitle,
  unitPrice,
  priceLabel,
  requireCheckOut = false,
  maxGuests = 8,
  ctaLabel,
}) => {
  const { user, t } = useApp();
  const [checkIn, setCheckIn] = useState('2026-12-10');
  const [checkOut, setCheckOut] = useState('2026-12-13');
  const [guests, setGuests] = useState(2);
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<BookingRequest | null>(null);

  const nightsOrUnits = useMemo(() => {
    if (!requireCheckOut) return itemType === 'experience' ? guests : 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [checkIn, checkOut, guests, itemType, requireCheckOut]);

  const totalEstimate = unitPrice > 0 ? unitPrice * nightsOrUnits : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!guestName.trim() || !guestEmail.trim()) {
      setError(t.booking.missingContactError);
      return;
    }
    if (requireCheckOut && new Date(checkOut) <= new Date(checkIn)) {
      setError(t.booking.dateOrderError);
      return;
    }

    setSubmitting(true);
    try {
      const created = await submitBookingRequest({
        userId: user?.id || 'guest',
        userName: guestName.trim(),
        userEmail: guestEmail.trim(),
        itemType,
        itemId,
        itemTitle,
        checkIn,
        checkOut: requireCheckOut ? checkOut : undefined,
        guests,
        totalEstimate,
        notes,
      });
      setSubmitted(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.booking.serverError);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-[#FAF7F0] luxury-frame p-6 md:p-8 space-y-5">
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#A4834C] shrink-0 mt-0.5" />
          <div>
            <p className="text-xs uppercase tracking-widest text-[#A4834C] font-medium">
              {t.bookingStatus.pending_verification}
            </p>
            <h3 className="font-serif text-2xl text-[#1B3128] mt-1">
              {t.bookingStatus.pending_verification}
            </h3>
          </div>
        </div>
        <p className="text-sm text-[#222420]/85 leading-relaxed">
          {t.booking.recordedMessagePrefix}{' '}
          <span className="font-medium text-[#1B3128]">{submitted.itemTitle}</span>{' '}
          {t.booking.recordedMessageMid}{' '}
          <span className="font-medium text-[#1B3128] tabular-nums">{submitted.referenceCode}</span>{' '}
          {t.booking.recordedMessageSuffix}
        </p>
        <div className="border-t border-b border-[#A4834C]/25 py-3 space-y-1.5 text-xs text-[#4F6047] tabular-nums">
          <div className="flex justify-between">
            <span>{t.booking.requestedDate}</span>
            <span className="text-[#222420]">
              {submitted.checkIn}
              {submitted.checkOut ? ` → ${submitted.checkOut}` : ''}
            </span>
          </div>
          <div className="flex justify-between">
            <span>{t.booking.partySize}</span>
            <span className="text-[#222420]">
              {submitted.guests}{' '}
              {submitted.guests === 1 ? t.booking.guestSingular : t.booking.guestPlural}
            </span>
          </div>
          {submitted.totalEstimate > 0 && (
            <div className="flex justify-between font-medium text-[#1B3128]">
              <span>{t.booking.estimatedTotal}</span>
              <span>${submitted.totalEstimate.toLocaleString()}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/bookings"
            className="px-4 py-2.5 bg-[#1B3128] text-[#FAF7F0] text-xs font-medium rounded-sm hover:bg-[#4F6047] transition-colors"
          >
            {t.booking.manageRequests}
          </Link>
          <button
            type="button"
            onClick={() => setSubmitted(null)}
            className="px-4 py-2.5 border border-[#A4834C]/45 text-[#1B3128] text-xs font-medium rounded-sm hover:bg-[#D9CCB8]/40 transition-colors cursor-pointer"
          >
            {t.booking.submitAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#FAF7F0] luxury-frame p-6 md:p-8 space-y-5">
      <div className="flex items-baseline justify-between border-b border-[#A4834C]/25 pb-4">
        <div>
          {unitPrice > 0 ? (
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-3xl text-[#1B3128] tabular-nums">
                ${unitPrice.toLocaleString()}
              </span>
              <span className="text-xs text-[#4F6047]">{priceLabel}</span>
            </div>
          ) : (
            <span className="font-serif text-2xl text-[#1B3128]">{priceLabel}</span>
          )}
        </div>
        <span className="text-xs text-[#A4834C] font-medium">{t.booking.requestVerify}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#4F6047] mb-1.5">
            {requireCheckOut ? t.booking.checkIn : t.booking.preferredDate}
          </label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 text-[#4F6047] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              required
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/80 border border-[#D9CCB8] text-sm text-[#222420] tabular-nums focus:outline-none focus:border-[#1B3128]"
            />
          </div>
        </div>

        {requireCheckOut && (
          <div>
            <label className="block text-xs text-[#4F6047] mb-1.5">{t.booking.checkOut}</label>
            <div className="relative">
              <Calendar className="w-3.5 h-3.5 text-[#4F6047] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="date"
                required
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-white/80 border border-[#D9CCB8] text-sm text-[#222420] tabular-nums focus:outline-none focus:border-[#1B3128]"
              />
            </div>
          </div>
        )}

        <div className={requireCheckOut ? 'sm:col-span-2' : ''}>
          <label className="block text-xs text-[#4F6047] mb-1.5">{t.booking.partySize}</label>
          <div className="relative">
            <Users className="w-3.5 h-3.5 text-[#4F6047] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full pl-9 pr-3 py-2.5 bg-white/80 border border-[#D9CCB8] text-sm text-[#222420] tabular-nums focus:outline-none focus:border-[#1B3128]"
            >
              {Array.from({ length: maxGuests }, (_, idx) => idx + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? t.booking.guestSingular : t.booking.guestPlural}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-[#4F6047] mb-1.5">{t.booking.fullName}</label>
          <input
            type="text"
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder={t.booking.fullNamePlaceholder}
            className="w-full px-3 py-2.5 bg-white/80 border border-[#D9CCB8] text-sm text-[#222420] focus:outline-none focus:border-[#1B3128]"
          />
        </div>
        <div>
          <label className="block text-xs text-[#4F6047] mb-1.5">{t.booking.emailAddress}</label>
          <input
            type="email"
            required
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2.5 bg-white/80 border border-[#D9CCB8] text-sm text-[#222420] focus:outline-none focus:border-[#1B3128]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#4F6047] mb-1.5">{t.booking.notesLabel}</label>
        <textarea
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t.booking.notesPlaceholder}
          className="w-full px-3 py-2 bg-white/80 border border-[#D9CCB8] text-sm text-[#222420] focus:outline-none focus:border-[#1B3128]"
        />
      </div>

      {totalEstimate > 0 && (
        <div className="pt-2 border-t border-[#A4834C]/25 flex items-center justify-between text-sm">
          <span className="text-[#4F6047] tabular-nums">
            ${unitPrice} × {nightsOrUnits}{' '}
            {requireCheckOut
              ? nightsOrUnits === 1
                ? t.booking.nightSingular
                : t.booking.nightPlural
              : itemType === 'experience'
                ? nightsOrUnits === 1
                  ? t.booking.guestSingular
                  : t.booking.guestPlural
                : t.booking.daySingular}
          </span>
          <span className="font-semibold text-[#1B3128] tabular-nums">
            {t.booking.estPrefix} ${totalEstimate.toLocaleString()}
          </span>
        </div>
      )}

      {error && (
        <div role="alert" className="p-3 bg-[#B66F52]/10 border border-[#B66F52] text-xs text-[#222420]">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 px-4 bg-[#1B3128] text-[#FAF7F0] text-sm font-medium rounded-sm hover:bg-[#A4834C] disabled:opacity-60 transition-colors cursor-pointer"
      >
        {submitting ? t.actions.submitting : ctaLabel || t.actions.submitBooking}
      </button>

      <p className="flex items-center gap-1.5 text-xs text-[#4F6047]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#A4834C] shrink-0" />
        <span>{t.actions.noChargeNote}</span>
      </p>
    </form>
  );
};
