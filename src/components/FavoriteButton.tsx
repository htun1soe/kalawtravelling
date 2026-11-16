import React from 'react';
import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface FavoriteButtonProps {
  itemId: string;
  label?: string;
  compact?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  label = 'Save',
  compact = false,
}) => {
  const { isFavorite, toggleFavorite } = useApp();
  const saved = isFavorite(itemId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(itemId);
      }}
      aria-pressed={saved}
      aria-label={saved ? 'Remove from saved places' : 'Save to favorites'}
      className={`inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
        compact
          ? `p-2 bg-[#F4F0E6]/90 hover:bg-[#F4F0E6] text-[#243D32]`
          : `px-3.5 py-2 border text-xs font-medium rounded-sm ${
              saved
                ? 'border-[#B66F52] bg-[#B66F52]/10 text-[#B66F52]'
                : 'border-[#D9CCB8] text-[#243D32] hover:border-[#243D32]'
            }`
      }`}
    >
      <Heart
        className={`w-3.5 h-3.5 ${saved ? 'fill-[#B66F52] text-[#B66F52]' : 'text-[#243D32]'}`}
      />
      {!compact && <span>{saved ? 'Saved' : label}</span>}
    </button>
  );
};
