import React, { useEffect, useState } from 'react';
import { Radio, X, Sparkles, ChevronRight } from 'lucide-react';
import { LocationZone } from '../../types';

interface LocationBannerProps {
  zone: LocationZone | null;
  onInteract: () => void;
}

export const LocationBanner: React.FC<LocationBannerProps> = ({ zone, onInteract }) => {
  const [currentZone, setCurrentZone] = useState<LocationZone | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (zone) {
      setCurrentZone(zone);
      setIsDismissed(false);
    }
  }, [zone]);

  if (!zone || !currentZone || isDismissed) return null;

  const accent = currentZone.accentColor || '#F59E0B';

  return (
    <div
      id="location-catchment-banner"
      className="fixed top-56 right-4 z-40 w-72 sm:w-80 pointer-events-none transition-all duration-300 ease-out"
    >
      <div
        className="rounded-2xl p-3 shadow-2xl backdrop-blur-xl border pointer-events-auto transition-all animate-in fade-in slide-in-from-right-4 duration-300"
        style={{
          backgroundColor: 'rgba(23, 19, 31, 0.90)',
          borderColor: `${accent}60`,
          boxShadow: `0 12px 28px -10px ${accent}35, 0 0 15px ${accent}20`
        }}
      >
        {/* Top Header: Category Tag + Close Button */}
        <div className="flex items-center justify-between gap-1.5 mb-1.5 pb-1 border-b border-stone-800/80">
          <div
            className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase"
            style={{
              backgroundColor: `${accent}20`,
              color: '#fef08a',
              border: `1px solid ${accent}40`
            }}
          >
            <span className="flex items-center gap-0.5 h-2.5">
              <span className="w-0.5 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }} />
              <span className="w-0.5 h-3 rounded-full animate-pulse delay-75" style={{ backgroundColor: accent }} />
              <span className="w-0.5 h-1.5 rounded-full animate-pulse delay-150" style={{ backgroundColor: accent }} />
            </span>
            <Radio className="w-3 h-3" style={{ color: accent }} />
            <span className="truncate max-w-[150px]">{currentZone.category}</span>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-md text-stone-400 hover:text-stone-200 hover:bg-stone-800/60 transition cursor-pointer"
            title="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Location Name (Hindi + English) */}
        <div className="mb-2">
          <h3 className="font-hindi text-base font-extrabold text-amber-100 leading-tight">
            {currentZone.hindiName}
          </h3>
          <p className="text-xs font-semibold tracking-wide truncate" style={{ color: accent }}>
            {currentZone.name}
          </p>
        </div>

        {/* Action Button */}
        <button
          id="zone-interact-button"
          onClick={onInteract}
          className="w-full inline-flex items-center justify-between px-3 py-1.5 rounded-xl text-stone-950 font-bold text-xs shadow-md transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer"
          style={{
            backgroundColor: accent,
            boxShadow: `0 0 12px ${accent}40`
          }}
        >
          <div className="flex items-center gap-1.5 truncate">
            <span className="bg-stone-950/25 text-stone-950 px-1.5 py-0.5 rounded text-[10px] font-black border border-stone-950/30">
              E
            </span>
            <span className="truncate text-[11px]">{currentZone.actionPrompt}</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        </button>
      </div>
    </div>
  );
};
