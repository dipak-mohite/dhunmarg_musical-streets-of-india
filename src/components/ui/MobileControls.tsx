import React, { useRef, useState } from 'react';
import { Footprints, Zap, Sparkles, Navigation } from 'lucide-react';

interface MobileControlsProps {
  onMoveChange: (vector: { x: number; y: number }) => void;
  onLookChange: (vector: { x: number; y: number }) => void;
  isSprint: boolean;
  onToggleSprint: () => void;
  onActionTrigger: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMoveChange,
  onLookChange,
  isSprint,
  onToggleSprint,
  onActionTrigger
}) => {
  const [joystickActive, setJoystickActive] = useState(false);
  const [joystickPos, setJoystickPos] = useState({ x: 0, y: 0 });
  const stickRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Joystick touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch || !stickRef.current) return;
    const rect = stickRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    touchStartRef.current = { x: centerX, y: centerY };
    setJoystickActive(true);
    updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!joystickActive) return;
    const touch = e.touches[0];
    if (touch) updateJoystick(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    setJoystickActive(false);
    setJoystickPos({ x: 0, y: 0 });
    onMoveChange({ x: 0, y: 0 });
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    const maxRadius = 45;
    const dx = clientX - touchStartRef.current.x;
    const dy = clientY - touchStartRef.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const clampedDist = Math.min(dist, maxRadius);
    const angle = Math.atan2(dy, dx);

    const stickX = Math.cos(angle) * clampedDist;
    const stickY = Math.sin(angle) * clampedDist;

    setJoystickPos({ x: stickX, y: stickY });
    onMoveChange({ x: stickX / maxRadius, y: stickY / maxRadius });
  };

  // Right touch pad look swipe handlers
  const lastLookTouchRef = useRef<{ x: number; y: number } | null>(null);

  const handleLookTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      lastLookTouchRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleLookTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch && lastLookTouchRef.current) {
      const dx = touch.clientX - lastLookTouchRef.current.x;
      const dy = touch.clientY - lastLookTouchRef.current.y;
      onLookChange({ x: dx * 0.05, y: dy * 0.05 });
      lastLookTouchRef.current = { x: touch.clientX, y: touch.clientY };
    }
  };

  const handleLookTouchEnd = () => {
    lastLookTouchRef.current = null;
    onLookChange({ x: 0, y: 0 });
  };

  return (
    <div className="md:hidden fixed inset-0 pointer-events-none z-30 flex flex-col justify-end p-4 pb-28">
      <div className="flex items-end justify-between w-full">
        
        {/* Left Joystick Area */}
        <div
          ref={stickRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="pointer-events-auto relative w-32 h-32 rounded-full bg-stone-900/60 backdrop-blur-md border-2 border-amber-500/30 flex items-center justify-center touch-none shadow-xl"
        >
          {/* Base Cross Markings */}
          <div className="absolute w-full h-0.5 bg-stone-700/50" />
          <div className="absolute h-full w-0.5 bg-stone-700/50" />

          {/* Stick Knob */}
          <div
            style={{
              transform: `translate(${joystickPos.x}px, ${joystickPos.y}px)`,
            }}
            className="w-12 h-12 rounded-full bg-amber-500/80 border-2 border-amber-300 shadow-lg flex items-center justify-center transition-transform duration-75"
          >
            <Footprints className="w-5 h-5 text-stone-950" />
          </div>
        </div>

        {/* Right Touch Look Area & Action Buttons */}
        <div className="flex flex-col items-end gap-3 pointer-events-auto">
          
          {/* Action / Sit Button */}
          <button
            onClick={onActionTrigger}
            className="w-14 h-14 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center shadow-lg shadow-amber-500/30 active:scale-95 transition cursor-pointer"
            title="Interact / Sit"
          >
            <Sparkles className="w-6 h-6" />
          </button>

          {/* Sprint Toggle Button */}
          <button
            onClick={onToggleSprint}
            className={`w-12 h-12 rounded-full flex items-center justify-center border shadow-lg active:scale-95 transition cursor-pointer ${
              isSprint
                ? 'bg-orange-500 text-stone-950 border-orange-300'
                : 'bg-stone-900/80 text-stone-300 border-stone-700'
            }`}
            title="Sprint"
          >
            <Zap className="w-5 h-5" />
          </button>

          {/* Touch Look Pan Pad */}
          <div
            onTouchStart={handleLookTouchStart}
            onTouchMove={handleLookTouchMove}
            onTouchEnd={handleLookTouchEnd}
            className="w-32 h-24 rounded-2xl bg-stone-900/40 border border-stone-700/40 flex items-center justify-center text-[10px] text-stone-400 touch-none uppercase tracking-wider"
          >
            Drag to Look
          </div>

        </div>

      </div>
    </div>
  );
};
