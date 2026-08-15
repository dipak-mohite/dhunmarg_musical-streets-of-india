import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Maximize2,
  Minimize2,
  Navigation,
  Sparkles
} from 'lucide-react';
import { LOCATIONS } from '../../config/locations';
import { LocationZone, PlayerState } from '../../types';

interface MiniMapProps {
  playerState: PlayerState;
  onFastTravel: (zone: LocationZone) => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({ playerState, onFastTravel }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredZone, setHoveredZone] = useState<LocationZone | null>(null);

  // Map world scale (-60 to 60 units mapped to 0% to 100%)
  const worldToMapPercent = (coord: number) => {
    const min = -60;
    const max = 60;
    return Math.max(5, Math.min(95, ((coord - min) / (max - min)) * 100));
  };

  const playerXPercent = worldToMapPercent(playerState.position.x);
  const playerZPercent = worldToMapPercent(playerState.position.z);
  const yawDegrees = (playerState.rotation.yaw * 180) / Math.PI;

  return (
    <div
      className={`fixed top-4 right-4 z-40 transition-all duration-300 ${
        isExpanded
          ? 'w-80 sm:w-96 h-80 sm:h-96'
          : 'w-44 sm:w-52 h-44 sm:h-52'
      }`}
    >
      <div className="relative w-full h-full glass-panel-gold rounded-2xl p-2.5 shadow-2xl border border-amber-500/30 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-1 mb-1.5 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-display tracking-wider">GPS RADAR</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800/60 transition cursor-pointer"
            title={isExpanded ? 'Collapse Map' : 'Expand Map'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Map Grid Container */}
        <div className="relative flex-1 rounded-xl bg-stone-950/80 border border-stone-800 overflow-hidden">
          
          {/* Street Road Grid Lines */}
          {/* East-West Road (Z=0) */}
          <div className="absolute top-[50%] left-0 right-0 h-3 bg-stone-800/80 -translate-y-1/2" />
          {/* North-South Road (X=0) */}
          <div className="absolute left-[50%] top-0 bottom-0 w-3 bg-stone-800/80 -translate-x-1/2" />

          {/* Compass Rose */}
          <div className="absolute top-1 left-2 text-[10px] font-bold text-amber-500/60">N</div>
          <div className="absolute bottom-1 right-2 text-[10px] font-bold text-amber-500/60">S</div>

          {/* Location Markers */}
          {LOCATIONS.map((loc) => {
            const lx = worldToMapPercent(loc.position.x);
            const lz = worldToMapPercent(loc.position.z);
            const isActive = playerState.currentZone?.id === loc.id;

            return (
              <button
                key={loc.id}
                onClick={() => onFastTravel(loc)}
                onMouseEnter={() => setHoveredZone(loc)}
                onMouseLeave={() => setHoveredZone(null)}
                style={{
                  left: `${lx}%`,
                  top: `${lz}%`,
                }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group p-1 rounded-full transition-transform hover:scale-125 z-10 cursor-pointer ${
                  isActive ? 'scale-125 ring-2 ring-amber-400 ring-offset-1 ring-offset-stone-900' : ''
                }`}
                title={`${loc.name} (Click to fast-travel)`}
              >
                <div
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-stone-950 shadow-md"
                  style={{ backgroundColor: loc.accentColor }}
                >
                  ★
                </div>
              </button>
            );
          })}

          {/* Player Marker (Cone of Vision & Arrow) */}
          <div
            style={{
              left: `${playerXPercent}%`,
              top: `${playerZPercent}%`,
              transform: `translate(-50%, -50%) rotate(${yawDegrees}deg)`,
            }}
            className="absolute z-20 pointer-events-none transition-transform duration-75"
          >
            {/* Field of View Cone */}
            <div className="absolute -top-6 -left-3 w-6 h-6 bg-gradient-to-t from-amber-400/40 to-transparent clip-path-triangle pointer-events-none" />
            {/* Player Arrow Dot */}
            <div className="w-3.5 h-3.5 rounded-full bg-amber-400 border-2 border-stone-950 shadow-lg shadow-amber-400/80 flex items-center justify-center">
              <Navigation className="w-2 h-2 text-stone-950 fill-stone-950 -rotate-45" />
            </div>
          </div>

          {/* Hover / Active Zone Tooltip */}
          {hoveredZone && (
            <div className="absolute bottom-1 left-1 right-1 bg-stone-900/90 border border-amber-500/40 rounded-lg p-1.5 text-center text-[10px] text-amber-200 z-30 pointer-events-none">
              <div className="font-bold truncate">{hoveredZone.name}</div>
              <div className="text-[9px] text-stone-400 truncate">Click to Fast Travel</div>
            </div>
          )}

        </div>

        {/* Footer Info: Distance to nearest */}
        <div className="flex items-center justify-between text-[10px] text-stone-400 px-1 mt-1 flex-shrink-0">
          <div className="truncate">
            {playerState.nearbyZone ? (
              <span>Nearest: <strong className="text-amber-300">{playerState.nearbyZone.name.split(' ')[0]}</strong> ({Math.round(playerState.distanceToNearest)}m)</span>
            ) : (
              <span>Exploring streets...</span>
            )}
          </div>
          <div className="text-amber-400 text-[9px]">Click map to TP</div>
        </div>

      </div>
    </div>
  );
};
