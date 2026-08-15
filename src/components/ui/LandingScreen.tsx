import React from 'react';
import { Headphones, Compass, Music, Volume2, Sparkles, Footprints } from 'lucide-react';
import { LOCATIONS } from '../../config/locations';
import { AvatarGender } from '../../types';

interface LandingScreenProps {
  onEnter: (selectedGender?: AvatarGender) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 backdrop-blur-xl p-4 md:p-6 overflow-y-auto">
      <div className="relative max-w-3xl w-full bg-stone-900/95 border border-amber-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-amber-500/10 text-center overflow-hidden my-auto">
        
        {/* Glow backdrop ornaments */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Traditional Indian Crest / Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive 3D Musical World</span>
        </div>

        {/* Title */}
        <h1 className="font-hindi text-3xl md:text-5xl font-bold tracking-tight text-amber-100 mb-1">
          धुन्मार्ग • DhunMarg
        </h1>
        <p className="font-display text-xs md:text-sm text-amber-300/80 tracking-widest uppercase mb-5">
          The Walkable Musical Streets of India
        </p>

        {/* 9 Environment Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-w-2xl mx-auto mb-6 text-left">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="p-2.5 rounded-xl bg-stone-800/60 border border-stone-700/50 hover:border-amber-500/40 transition-colors"
            >
              <div className="text-xs font-hindi text-amber-200 font-semibold truncate">{loc.hindiName}</div>
              <div className="text-[10px] text-stone-400 truncate">{loc.name}</div>
            </div>
          ))}
        </div>

        {/* Audio & Control Tips */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-stone-400 mb-8">
          <div className="flex items-center gap-1.5">
            <Headphones className="w-4 h-4 text-amber-400" />
            <span>3rd Person Gameplay (Press V for 1st)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Footprints className="w-4 h-4 text-amber-400" />
            <span>Arrow Keys / WASD to Walk • Drag to Look</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Auto Music on Proximity</span>
          </div>
        </div>

        {/* Primary CTA Button */}
        <button
          onClick={() => onEnter('man')}
          className="group relative inline-flex items-center justify-center gap-3 px-10 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-stone-950 font-bold text-base md:text-lg shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Compass className="w-5 h-5 group-hover:rotate-45 transition-transform" />
          <span>Enter DhunMarg City</span>
          <Music className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>

      </div>
    </div>
  );
};
