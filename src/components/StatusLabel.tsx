import React from 'react';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { BookingStatus } from '../types/kalaw';

export const StatusLabel: React.FC<{ status: BookingStatus }> = ({ status }) => {
  if (status === 'verified') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#243D32]">
        <CheckCircle2 className="w-3.5 h-3.5 text-[#52634A]" />
        <span>Verified by Concierge</span>
      </span>
    );
  }
  if (status === 'declined') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B66F52]">
        <XCircle className="w-3.5 h-3.5 text-[#B66F52]" />
        <span>Unavailable / Declined</span>
      </span>
    );
  }
  if (status === 'cancelled') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#292B27]/60">
        <XCircle className="w-3.5 h-3.5 text-[#292B27]/50" />
        <span>Cancelled by Traveler</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B66F52]">
      <Clock className="w-3.5 h-3.5 text-[#B66F52]" />
      <span>Pending Host Verification</span>
    </span>
  );
};
