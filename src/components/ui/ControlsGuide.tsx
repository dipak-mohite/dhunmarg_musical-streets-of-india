import React, { useState } from 'react';
import { HelpCircle, Eye, EyeOff, ChevronDown, ChevronUp, User, Video } from 'lucide-react';
import { CameraMode } from '../../types';

interface ControlsGuideProps {
  cameraMode: CameraMode;
  onToggleCameraMode: () => void;
  onToggleDirectory: () => void;
  onToggleHideHud: () => void;
}

export const ControlsGuide: React.FC<ControlsGuideProps> = ({
  cameraMode,
  onToggleCameraMode,
  onToggleDirectory,
  onToggleHideHud
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="fixed top-4 left-4 z-40 max-w-xs transition-all">
      <div className="glass-panel rounded-2xl p-3 shadow-xl border border-stone-700/50">
        
        {/* Title Header */}
        <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-stone-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-display tracking-wider">CONTROLS</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleHideHud}
              title="Hide UI / Zen Mode (Press H)"
              className="p-1 rounded text-stone-400 hover:text-amber-300 transition cursor-pointer"
            >
              <EyeOff className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 rounded text-stone-400 hover:text-white transition cursor-pointer"
            >
              {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <div className="mt-2 space-y-1.5 text-[11px] text-stone-300">
            <div className="flex items-center justify-between">
              <span className="text-stone-400">Walk / Move</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded font-mono text-amber-200 border border-stone-700">
                W A S D / Arrows
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-400">Sprint / Run</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded font-mono text-amber-200 border border-stone-700">
                Shift
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-400">Look Around</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded font-mono text-amber-200 border border-stone-700">
                Ctrl + Mouse / Drag
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-400">Camera View</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded font-mono text-amber-200 border border-stone-700">
                V ({cameraMode === 'third-person' ? '3rd Person' : '1st Person'})
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-400">Sit / Interact</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded font-mono text-amber-200 border border-stone-700">
                E
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-400">Toggle Look Lock</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded font-mono text-amber-200 border border-stone-700">
                C
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-stone-400">Hide / Show UI</span>
              <span className="bg-stone-800 px-2 py-0.5 rounded font-mono text-amber-200 border border-stone-700">
                H
              </span>
            </div>

            <div className="pt-1.5 border-t border-stone-800/80 flex flex-col gap-1.5">
              <button
                onClick={onToggleCameraMode}
                className="w-full py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-center font-medium transition border border-amber-500/40 cursor-pointer flex items-center justify-center gap-1.5 text-[11px]"
              >
                {cameraMode === 'third-person' ? (
                  <>
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>3rd Person View (Switch: V)</span>
                  </>
                ) : (
                  <>
                    <Video className="w-3.5 h-3.5 text-amber-400" />
                    <span>1st Person View (Switch: V)</span>
                  </>
                )}
              </button>
              <button
                onClick={onToggleDirectory}
                className="w-full py-1 rounded-lg bg-stone-800/90 hover:bg-stone-700 text-stone-200 text-center font-medium transition border border-stone-700 cursor-pointer"
              >
                Open Venues Directory
              </button>
              <button
                onClick={onToggleHideHud}
                className="w-full py-1 rounded-lg bg-stone-800/60 hover:bg-stone-700 text-stone-400 hover:text-white text-center text-[10px] font-medium transition border border-stone-700/60 cursor-pointer flex items-center justify-center gap-1"
              >
                <EyeOff className="w-3 h-3 text-amber-400" />
                <span>Hide All UI (Zen Mode)</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
