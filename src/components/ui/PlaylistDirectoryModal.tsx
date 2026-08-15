import React, { useState } from 'react';
import {
  X,
  Compass,
  ExternalLink,
  Music,
  MapPin,
  Sparkles,
  Radio,
  Play,
  Coffee,
  Scissors,
  Truck,
  Navigation,
  Bus,
  Building2
} from 'lucide-react';
import { LOCATIONS } from '../../config/locations';
import { LocationZone } from '../../types';

interface PlaylistDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: LocationZone) => void;
  activeLocationId: string;
}

export const PlaylistDirectoryModal: React.FC<PlaylistDirectoryModalProps> = ({
  isOpen,
  onClose,
  onSelectLocation,
  activeLocationId
}) => {
  const [filter, setFilter] = useState<string>('all');

  if (!isOpen) return null;

  const categories = ['all', 'Street Corner', 'Commercial Shop', 'Highway Heavy Vehicle', 'City Transport', 'Public Transport', 'Corporate Hub', 'Street Celebration', 'Live Music Arena', 'Heritage Courtyard'];

  const filteredLocations = filter === 'all'
    ? LOCATIONS
    : LOCATIONS.filter((l) => l.category === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/85 backdrop-blur-xl p-4 md:p-6 overflow-y-auto">
      <div className="relative max-w-4xl w-full max-h-[90vh] bg-stone-900/95 border border-amber-500/30 rounded-3xl p-5 md:p-8 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-800 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DhunMarg Directory</span>
            </div>
            <h2 className="font-hindi text-2xl md:text-3xl font-bold text-amber-100 mt-0.5">
              सभी 9 संगीत स्थल व प्लेलिस्ट
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 text-stone-400 hover:text-white hover:bg-stone-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar flex-shrink-0">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-500 text-stone-950 font-semibold shadow'
                : 'bg-stone-800/80 text-stone-400 hover:text-white'
            }`}
          >
            All Destinations (9)
          </button>
          {['Street Corner', 'Commercial Shop', 'Highway Heavy Vehicle', 'City Transport', 'Public Transport', 'Corporate Hub', 'Street Celebration', 'Live Music Arena', 'Heritage Courtyard'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                filter === cat
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow'
                  : 'bg-stone-800/80 text-stone-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-1 flex-1 py-2">
          {filteredLocations.map((loc) => {
            const isActive = activeLocationId === loc.id;

            return (
              <div
                key={loc.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-stone-800/90 border-amber-500/70 shadow-lg shadow-amber-500/10'
                    : 'bg-stone-800/40 border-stone-700/60 hover:border-amber-500/40 hover:bg-stone-800/70'
                }`}
              >
                <div>
                  {/* Category & Status Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${loc.accentColor}20`,
                        color: loc.accentColor,
                        border: `1px solid ${loc.accentColor}40`
                      }}
                    >
                      {loc.category}
                    </span>
                    {isActive && (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-400 animate-pulse">
                        <Radio className="w-3 h-3" />
                        <span>Active Here</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Hindi Name */}
                  <h3 className="font-hindi text-lg font-bold text-amber-100 mb-0.5">
                    {loc.hindiName}
                  </h3>
                  <div className="text-sm font-semibold text-stone-200 mb-1.5">
                    {loc.name}
                  </div>
                  <div className="text-xs text-amber-300/80 mb-2 font-medium">
                    ♫ {loc.tagline}
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed mb-3">
                    {loc.description}
                  </p>

                  {/* Sample Tracks */}
                  <div className="bg-stone-900/60 rounded-xl p-2.5 mb-3 border border-stone-800">
                    <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider mb-1.5">
                      Playlist Highlights:
                    </div>
                    <div className="space-y-1">
                      {loc.sampleTracks.slice(0, 3).map((track) => (
                        <div key={track.id} className="flex items-center justify-between text-xs">
                          <span className="text-stone-300 truncate">{track.title}</span>
                          <span className="text-[10px] text-amber-400/80 bg-amber-400/10 px-1.5 py-0.2 rounded flex-shrink-0 ml-2">
                            {track.mood}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Row */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-800">
                  <a
                    href={loc.playlistUrl || `https://music.youtube.com/search?q=${encodeURIComponent(loc.name + ' Hindi Songs')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-amber-300 transition"
                  >
                    <span>YouTube Playlist</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <button
                    onClick={() => {
                      onSelectLocation(loc);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Fast Travel Here</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
