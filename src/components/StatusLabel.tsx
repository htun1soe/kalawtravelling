import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { BookingStatus } from '../types/kalaw';

export const StatusLabel: React.FC<{ status: BookingStatus }> = ({ status }) => {
  const { t } = useApp();

  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#243D32]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#52634A]" />
        <span>{t.bookingStatus.verified}</span>
      </span>
    );
  }
  if (status === 'declined') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B66F52]">
        <XCircle className="w-3.5 h-3.5 text-[#B66F52]" />
        <span>{t.bookingStatus.declined}</span>
      </span>
    );
  }
  if (status === 'cancelled') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#292B27]/60">
        <XCircle className="w-3.5 h-3.5 text-[#292B27]/50" />
        <span>{t.bookingStatus.cancelled}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B66F52]">
      <Clock className="w-3.5 h-3.5 text-[#B66F52]" />
      <span>{t.bookingStatus.pending_verification}</span>
    </span>
  );
};
