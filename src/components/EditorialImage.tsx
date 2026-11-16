import React, { useState } from 'react';
import { Mountain } from 'lucide-react';

interface EditorialImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClass?: string;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  src,
  alt,
  className = '',
  aspectClass = 'aspect-[4/3]',
}) => {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`${aspectClass} ${className} bg-[#D9CCB8]/50 border border-[#243D32]/15 flex flex-col items-center justify-center p-6 text-center`}
      >
        <Mountain className="w-7 h-7 text-[#243D32]/60 mb-2" strokeWidth={1.5} />
        <p className="font-serif text-base text-[#243D32]">{alt}</p>
        <span className="text-xs text-[#52634A] mt-1">Kalaw Highland Archive</span>
      </div>
    );
  }

  return (
    <div className={`${aspectClass} overflow-hidden bg-[#D9CCB8]/30 ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
      />
    </div>
  );
};
