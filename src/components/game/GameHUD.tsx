import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Check, 
  BookOpen, 
  Sun, 
  Sunset, 
  Moon, 
  Zap, 
  ArrowUp, 
  Search, 
  Compass, 
  Smile
} from 'lucide-react';
import { CollectibleItem, TravelEmote } from '../../types/game';
import { WorldLandmark } from '../../data/worldLandmarks';

interface GameHUDProps {
  score: number;
  pearlsCollected: number;
  totalPearls: number;
  discoveredLandmarksCount?: number;
  onSendEmote: (emote: TravelEmote) => void;
  unlockedItem: CollectibleItem | null;
  onDismissUnlock: () => void;
  timeOfDay?: 'day' | 'sunset' | 'night';
  onToggleTimeOfDay?: () => void;
  speedBoostActive?: boolean;
  onJump?: () => void;
  onSprint?: () => void;
  activeBadge?: { text: string; icon: string } | null;
  onOpenPlaceSearch?: () => void;
  activeWaypoint?: WorldLandmark | null;
  waypointDistance?: number;
  onClearWaypoint?: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  pearlsCollected,
  totalPearls,
  discoveredLandmarksCount = 0,
  onSendEmote,
  unlockedItem,
  onDismissUnlock,
  timeOfDay = 'day',
  onToggleTimeOfDay,
  speedBoostActive = false,
  onJump,
  onSprint,
  activeBadge,
  onOpenPlaceSearch,
  activeWaypoint,
  waypointDistance,
  onClearWaypoint
}) => {
  const [showEmotePicker, setShowEmotePicker] = useState(false);

  const emotes: TravelEmote[] = [
    'Hello! 👋',
    'Let\'s Go! 🚀',
    'Photo Spot! 📸',
    'Follow Me! 🗺️'
  ];

  return (
    <>
      {/* Top Left: Clean Consolidated Status Bar (Zero Clutter) */}
      <div className="absolute top-3 left-3 z-30 flex items-center space-x-1.5 pointer-events-auto">
        <div className="bg-white border-2 border-[#111827] px-2.5 sm:px-3 py-1.5 rounded-xl shadow-[3px_3px_0px_#111827] flex items-center space-x-2">
          {/* Score */}
          <div className="flex items-center space-x-1">
            <span className="text-xs sm:text-sm">🪙</span>
            <span className="font-mono font-black text-xs text-[#111827]">{score}</span>
          </div>

          <div className="w-[1.5px] h-3.5 bg-gray-300" />

          {/* Pearls */}
          <div className="flex items-center space-x-1">
            <span className="text-xs sm:text-sm">🦪</span>
            <span className="font-mono font-black text-xs text-[#1B3FFF]">
              {pearlsCollected}/{totalPearls}
            </span>
          </div>

          {/* Discovered Landmarks */}
          <div className="w-[1.5px] h-3.5 bg-gray-300" />
          <div className="flex items-center space-x-1">
            <span className="text-xs sm:text-sm">📍</span>
            <span className="font-mono font-black text-xs text-[#10B981]">
              {discoveredLandmarksCount}/9
            </span>
          </div>
        </div>

        {/* Emote Trigger Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmotePicker(!showEmotePicker)}
            title="Express Yourself"
            className="w-8 h-8 bg-white hover:bg-amber-100 border-2 border-[#111827] rounded-xl shadow-[2px_2px_0px_#111827] flex items-center justify-center text-xs active:translate-x-0.5 active:translate-y-0.5 transition-transform"
          >
            <Smile className="w-4 h-4 text-[#FF5722]" />
          </button>

          {/* Discrete Emote Popup */}
          {showEmotePicker && (
            <div className="absolute top-10 left-0 bg-white border-2 border-[#111827] p-1.5 rounded-xl shadow-[4px_4px_0px_#111827] flex flex-col gap-1 z-40 w-36">
              {emotes.map((em) => (
                <button
                  key={em}
                  onClick={() => {
                    onSendEmote(em);
                    setShowEmotePicker(false);
                  }}
                  className="px-2 py-1 text-left bg-[#FDFBF7] hover:bg-[#FBBF24] rounded-lg text-[11px] font-mono font-bold text-[#111827] transition-colors"
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Right: Places Search & Atmosphere Switcher */}
      <div className="absolute top-3 right-3 z-30 flex items-center space-x-1.5 pointer-events-auto">
        {/* Search Places Button */}
        {onOpenPlaceSearch && (
          <button
            onClick={onOpenPlaceSearch}
            title="Search Places, Landmarks & GPS Teleports"
            className="px-2.5 sm:px-3 py-1.5 bg-[#FF5722] hover:bg-[#E64A19] text-white border-2 border-[#111827] rounded-xl font-display font-black text-xs uppercase shadow-[2.5px_2.5px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1 transition-all"
          >
            <Search className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden xs:inline">PLACES</span>
          </button>
        )}

        {/* Atmosphere Mode Switcher */}
        {onToggleTimeOfDay && (
          <button
            onClick={onToggleTimeOfDay}
            title="Toggle Day / Sunset / Night"
            className="px-2.5 py-1.5 bg-white hover:bg-amber-50 border-2 border-[#111827] rounded-xl font-mono font-black text-[11px] shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1 transition-all"
          >
            {timeOfDay === 'day' && (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span className="text-gray-900 hidden sm:inline">DAY</span>
              </>
            )}
            {timeOfDay === 'sunset' && (
              <>
                <Sunset className="w-3.5 h-3.5 text-orange-500 fill-orange-400" />
                <span className="text-orange-950 hidden sm:inline">SUNSET</span>
              </>
            )}
            {timeOfDay === 'night' && (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-500 fill-indigo-400" />
                <span className="text-indigo-950 hidden sm:inline">NIGHT</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Active GPS Waypoint Banner */}
      {activeWaypoint && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 bg-white border-2 border-[#111827] rounded-full shadow-[3px_3px_0px_#111827] font-mono font-black text-xs flex items-center space-x-2 text-[#111827] pointer-events-auto">
          <Compass className="w-3.5 h-3.5 text-[#1B3FFF] animate-spin flex-shrink-0" />
          <span className="truncate max-w-[140px] sm:max-w-xs text-[11px]">
            {activeWaypoint.emoji} {activeWaypoint.name.toUpperCase()}
          </span>
          <span className="bg-[#10B981] text-white text-[10px] px-1.5 py-0.2 rounded-full border border-[#111827]">
            {waypointDistance ?? 0}M
          </span>
          {onClearWaypoint && (
            <button
              onClick={onClearWaypoint}
              className="text-gray-400 hover:text-red-600 p-0.5 ml-0.5"
              title="Clear GPS Waypoint"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Active Boost / Event Alert Banner */}
      {speedBoostActive && (
        <div className="absolute top-22 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 bg-[#FBBF24] text-[#111827] border-2 border-[#111827] rounded-full shadow-[3px_3px_0px_#111827] font-mono font-black text-xs flex items-center space-x-1.5 animate-pulse pointer-events-none">
          <Zap className="w-3.5 h-3.5 text-[#1B3FFF] fill-[#1B3FFF]" />
          <span>⚡ TURBO SPRINT ACTIVATED!</span>
        </div>
      )}

      {/* Comic Badge Popups (e.g. "DISCOVERED: BURJ KHALIFA (+150 PTS)!") */}
      {activeBadge && (
        <div className="absolute top-26 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1 bg-[#FF5722] text-white border-2 border-[#111827] rounded-2xl shadow-[4px_4px_0px_#111827] font-comic text-base flex items-center space-x-2 animate-bounce pointer-events-none whitespace-nowrap">
          <span>{activeBadge.icon}</span>
          <span className="tracking-wide">{activeBadge.text}</span>
        </div>
      )}

      {/* Mobile Turbo Dash Button (Right Side, Above Jump) */}
      {onSprint && (
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSprint();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSprint();
          }}
          title="Turbo Dash / Sprint (Shift)"
          className={`absolute bottom-24 right-5 z-30 w-12 h-12 rounded-full border-[2.5px] border-[#111827] shadow-[3px_3px_0px_#111827] flex flex-col items-center justify-center font-display font-black text-[9px] uppercase transition-all pointer-events-auto select-none touch-none active:scale-95 ${
            speedBoostActive 
              ? 'bg-[#06B6D4] text-white animate-pulse' 
              : 'bg-white hover:bg-cyan-50 text-[#111827]'
          }`}
        >
          <Zap className="w-4 h-4 fill-current" />
          <span className="text-[8px] -mt-0.5 font-mono font-black">DASH</span>
        </button>
      )}

      {/* Mobile Jump Button (Bottom Right) */}
      {onJump && (
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onJump();
          }}
          onTouchStart={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onJump();
          }}
          title="Jump / Leap (Spacebar)"
          className="absolute bottom-6 right-5 z-30 w-16 h-16 bg-[#FBBF24] hover:bg-amber-300 active:bg-amber-400 active:scale-95 text-[#111827] rounded-full border-[2.5px] border-[#111827] shadow-[4px_4px_0px_#111827] flex flex-col items-center justify-center font-display font-black text-xs uppercase transition-transform pointer-events-auto select-none touch-none"
        >
          <ArrowUp className="w-6 h-6 stroke-[3]" />
          <span className="text-[9px] -mt-0.5 tracking-tight font-black">JUMP</span>
        </button>
      )}

      {/* Cultural Fact Unlock Modal (Triggered on Collectible Hit) */}
      {unlockedItem && (
        <div className="absolute inset-0 z-40 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 pointer-events-auto">
          <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-4 sm:p-5 max-w-sm w-full shadow-[6px_6px_0px_#111827] space-y-3 animate-scaleUp">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="bg-[#10B981] text-white text-[10px] font-mono font-black px-2 py-0.5 rounded border border-[#111827]">
                +{unlockedItem.points} POINTS UNLOCKED!
              </span>
              <button 
                onClick={onDismissUnlock}
                className="text-gray-500 hover:text-black font-bold p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Glyph & Item Name */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center text-2xl">
                {unlockedItem.emoji}
              </div>
              <div>
                <h3 className="font-display font-black text-base text-[#111827]">
                  {unlockedItem.name}
                </h3>
                <span className="text-[11px] font-mono text-gray-500 font-bold">
                  Heritage Cultural Lore Card
                </span>
              </div>
            </div>

            {/* Cultural Fact Card */}
            <div className="p-3 bg-[#FDFBF7] border-2 border-[#111827] rounded-xl text-xs font-mono text-[#111827] leading-relaxed shadow-inner">
              <p className="font-bold text-[#FF5722] mb-1 flex items-center space-x-1">
                <BookOpen className="w-3.5 h-3.5 mr-1" />
                <span>CULTURAL TRIVIA:</span>
              </p>
              <p>{unlockedItem.culturalFact}</p>
            </div>

            {/* Stamp into Passport CTA */}
            <button
              onClick={onDismissUnlock}
              className="w-full py-2.5 bg-[#1B3FFF] hover:bg-[#1532CC] text-white border-2 border-[#111827] rounded-xl font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#111827] flex items-center justify-center space-x-1.5 active:translate-x-0.5 active:translate-y-0.5"
            >
              <Check className="w-4 h-4" />
              <span>COLLECT FACT & KEEP EXPLORING</span>
            </button>

          </div>
        </div>
      )}
    </>
  );
};
