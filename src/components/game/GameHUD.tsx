import React, { useState } from 'react';
import { 
  X, 
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
import { WorldLandmark, WORLD_LANDMARKS } from '../../data/worldLandmarks';

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
  playerCoords?: { x: number; z: number };
}

const GameHUDComponent: React.FC<GameHUDProps> = ({
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
  onClearWaypoint,
  playerCoords = { x: 0, z: 0 }
}) => {
  const [showEmotePicker, setShowEmotePicker] = useState(false);

  // Auto-dismiss unlocked item fact notification after 2.8s
  React.useEffect(() => {
    if (unlockedItem) {
      const timer = setTimeout(() => {
        onDismissUnlock();
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [unlockedItem, onDismissUnlock]);

  const emotes: TravelEmote[] = [
    'Hello! 👋',
    'Let\'s Go! 🚀',
    'Photo Spot! 📸',
    'Follow Me! 🗺️'
  ];

  // Radar mini-map coordinates projection:
  // Map bounds: x in [-70, 75] (range 145), z in [-95, 95] (range 190)
  const getRadarX = (x: number) => Math.max(6, Math.min(94, ((x - (-70)) / 145) * 100));
  const getRadarY = (z: number) => Math.max(6, Math.min(94, ((z - (-95)) / 190) * 100));

  const playerRadarX = getRadarX(playerCoords.x);
  const playerRadarY = getRadarY(playerCoords.z);

  return (
    <>
      {/* Top Left: Clean Consolidated Status Bar (Zero Clutter on Mobile) */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-30 flex items-center space-x-1 sm:space-x-1.5 pointer-events-auto">
        <div className="bg-white border-2 border-[#111827] px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl shadow-[2.5px_2.5px_0px_#111827] flex items-center space-x-1.5 sm:space-x-2">
          {/* Score */}
          <div className="flex items-center space-x-1" title="Adventure Points">
            <span className="text-xs">🪙</span>
            <span className="font-mono font-black text-xs text-[#111827]">{score}</span>
          </div>

          <div className="w-[1.5px] h-3 bg-gray-300" />

          {/* Pearls */}
          <div className="flex items-center space-x-1" title="Pearls Collected">
            <span className="text-xs">🦪</span>
            <span className="font-mono font-black text-xs text-[#1B3FFF]">
              {pearlsCollected}/{totalPearls}
            </span>
          </div>

          {/* Discovered Landmarks */}
          <div className="w-[1.5px] h-3 bg-gray-300" />
          <div className="flex items-center space-x-1" title="Landmarks Discovered">
            <span className="text-xs">📍</span>
            <span className="font-mono font-black text-xs text-[#10B981]">
              {discoveredLandmarksCount}/{WORLD_LANDMARKS.filter(l => l.category !== 'interactive').length}
            </span>
          </div>
        </div>

        {/* Emote Trigger Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmotePicker(!showEmotePicker)}
            title="Express Yourself"
            className="w-7 h-7 sm:w-8 sm:h-8 bg-white hover:bg-amber-100 border-2 border-[#111827] rounded-xl shadow-[2px_2px_0px_#111827] flex items-center justify-center text-xs active:translate-x-0.5 active:translate-y-0.5 transition-transform"
          >
            <Smile className="w-3.5 h-3.5 text-[#FF5722]" />
          </button>

          {/* Discrete Emote Popup */}
          {showEmotePicker && (
            <div className="absolute top-9 left-0 bg-white border-2 border-[#111827] p-1.5 rounded-xl shadow-[3px_3px_0px_#111827] flex flex-col gap-1 z-40 w-32 sm:w-36">
              {emotes.map((em) => (
                <button
                  key={em}
                  onClick={() => {
                    onSendEmote(em);
                    setShowEmotePicker(false);
                  }}
                  className="px-2 py-1 text-left bg-[#FDFBF7] hover:bg-[#FBBF24] rounded-lg text-[10px] sm:text-[11px] font-mono font-bold text-[#111827] transition-colors"
                >
                  {em}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Right: Places Search & Atmosphere Switcher */}
      <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 flex items-center space-x-1 sm:space-x-1.5 pointer-events-auto">
        {/* Search Places Button */}
        {onOpenPlaceSearch && (
          <button
            onClick={onOpenPlaceSearch}
            title="Search Places, Landmarks & GPS Teleports"
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#FF5722] hover:bg-[#E64A19] text-white border-2 border-[#111827] rounded-xl font-display font-black text-[11px] sm:text-xs uppercase shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1 transition-all"
          >
            <Search className="w-3 h-3 stroke-[2.5]" />
            <span className="hidden xs:inline">PLACES</span>
          </button>
        )}

        {/* Atmosphere Mode Switcher */}
        {onToggleTimeOfDay && (
          <button
            onClick={onToggleTimeOfDay}
            title="Toggle Day / Sunset / Night"
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-white hover:bg-amber-50 border-2 border-[#111827] rounded-xl font-mono font-black text-[10px] sm:text-[11px] shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1 transition-all"
          >
            {timeOfDay === 'day' && (
              <>
                <Sun className="w-3 h-3 text-amber-500 fill-amber-400" />
                <span className="text-gray-900 hidden sm:inline">DAY</span>
              </>
            )}
            {timeOfDay === 'sunset' && (
              <>
                <Sunset className="w-3 h-3 text-orange-500 fill-orange-400" />
                <span className="text-orange-950 hidden sm:inline">SUNSET</span>
              </>
            )}
            {timeOfDay === 'night' && (
              <>
                <Moon className="w-3 h-3 text-indigo-500 fill-indigo-400" />
                <span className="text-indigo-950 hidden sm:inline">NIGHT</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Top Right: Compact Radar Mini-Map (Scaled neatly for mobile & desktop) */}
      <div 
        onClick={onOpenPlaceSearch}
        title="Tactical Radar (Click to open Place Search)"
        className="absolute top-12 right-2.5 sm:top-14 sm:right-3 z-20 w-14 h-14 sm:w-[72px] sm:h-[72px] bg-[#FDFBF7]/95 border-2 border-[#111827] rounded-xl sm:rounded-2xl shadow-[2.5px_2.5px_0px_#111827] overflow-hidden backdrop-blur-sm cursor-pointer pointer-events-auto hover:scale-105 active:scale-95 transition-transform"
      >
        {/* North Indicator */}
        <div className="absolute top-0.5 left-1 text-[6px] sm:text-[7px] font-mono font-black text-[#111827]/70 select-none pointer-events-none">
          N▲
        </div>

        {/* Creek Waterway strip (confined to z: -35.5 to 40.5, leaving Downtown Promenade dry) */}
        <div 
          className="absolute bg-[#38BDF8]/40 border border-[#38BDF8]/60 rounded pointer-events-none"
          style={{
            left: `${getRadarX(8.5)}%`,
            width: `${getRadarX(43.5) - getRadarX(8.5)}%`,
            top: `${getRadarY(-35.5)}%`,
            height: `${getRadarY(40.5) - getRadarY(-35.5)}%`
          }}
        />

        {/* Al Qasba Waterfront Canal strip */}
        <div 
          className="absolute bg-[#06B6D4]/50 border border-[#0891B2]/70 rounded pointer-events-none"
          style={{
            left: `${getRadarX(-52)}%`,
            width: `${getRadarX(-8) - getRadarX(-52)}%`,
            top: `${getRadarY(59)}%`,
            height: `${getRadarY(71) - getRadarY(59)}%`
          }}
        />

        {/* Downtown Burj Khalifa Plaza indicator (Dry land) */}
        <div
          className="absolute bg-amber-400/20 border border-dashed border-amber-500/40 rounded pointer-events-none"
          style={{
            left: `${getRadarX(5)}%`,
            width: `${getRadarX(51) - getRadarX(5)}%`,
            top: `${getRadarY(-77)}%`,
            height: `${getRadarY(-36) - getRadarY(-77)}%`
          }}
        />

        {/* Grand Bridge indicator */}
        <div 
          className="absolute h-[2px] sm:h-[3px] bg-[#78350F] rounded-full pointer-events-none"
          style={{
            left: `${getRadarX(7.5)}%`,
            width: `${getRadarX(44.5) - getRadarX(7.5)}%`,
            top: `${getRadarY(0)}%`
          }}
        />

        {/* Landmarks dots */}
        {WORLD_LANDMARKS.filter(lm => lm.category !== 'interactive').map(lm => {
          const lx = getRadarX(lm.coords.x);
          const ly = getRadarY(lm.coords.z);
          return (
            <div 
              key={lm.id}
              className="absolute w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full border-[0.5px] border-[#111827] pointer-events-none"
              style={{
                left: `${lx}%`,
                top: `${ly}%`,
                backgroundColor: lm.color,
                transform: 'translate(-50%, -50%)'
              }}
            />
          );
        })}

        {/* Active Waypoint Target */}
        {activeWaypoint && (
          <div 
            className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#FBBF24] border border-[#111827] rotate-45 animate-ping pointer-events-none"
            style={{
              left: `${getRadarX(activeWaypoint.coords.x)}%`,
              top: `${getRadarY(activeWaypoint.coords.z)}%`,
              transform: 'translate(-50%, -50%) rotate(45deg)'
            }}
          />
        )}

        {/* Player Position Dot */}
        <div 
          className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#1B3FFF] rounded-full border border-white shadow-sm ring-1 sm:ring-2 ring-[#1B3FFF]/40 pointer-events-none"
          style={{
            left: `${playerRadarX}%`,
            top: `${playerRadarY}%`,
            transform: 'translate(-50%, -50%)'
          }}
        />
      </div>

      {/* DEDICATED NOTIFICATION DECK (Anchored with left-3 right-3 on mobile to PREVENT ANY CUTOFFS!) */}
      <div className="absolute top-12 sm:top-14 left-3 right-18 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:max-w-md pointer-events-none z-30 flex flex-col items-center gap-1.5 px-1">

        {/* 1. Active GPS Waypoint Banner */}
        {activeWaypoint && (
          <div className="px-3 py-1 bg-white border-2 border-[#111827] rounded-full shadow-[2.5px_2.5px_0px_#111827] font-mono font-black text-xs flex items-center space-x-1.5 text-[#111827] pointer-events-auto max-w-full">
            <Compass className="w-3 h-3 text-[#1B3FFF] animate-spin flex-shrink-0" />
            <span className="truncate max-w-[110px] sm:max-w-xs text-[10px] sm:text-[11px]">
              {activeWaypoint.emoji} {activeWaypoint.name.toUpperCase()}
            </span>
            <span className="bg-[#10B981] text-white text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full border border-[#111827] flex-shrink-0">
              {waypointDistance ?? 0}M
            </span>
            {onClearWaypoint && (
              <button
                onClick={onClearWaypoint}
                className="text-gray-400 hover:text-red-600 p-0.5 ml-0.5 flex-shrink-0"
                title="Clear GPS Waypoint"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* 2. Comic Discovery / Reward Badge (NO MORE CUTOFFS — wraps cleanly & scales to fit 375px!) */}
        {activeBadge && (
          <div className="px-3 py-1 bg-[#FF5722] text-white border-2 border-[#111827] rounded-2xl shadow-[3px_3px_0px_#111827] font-comic text-xs sm:text-sm flex items-center justify-center space-x-1.5 animate-bounce pointer-events-none max-w-full text-center">
            <span className="text-sm flex-shrink-0">{activeBadge.icon}</span>
            <span className="tracking-wide break-words line-clamp-1">{activeBadge.text}</span>
          </div>
        )}

        {/* 3. Non-intrusive Cultural Fact Card (Fits 100% within mobile viewport) */}
        {unlockedItem && (
          <div className="w-full max-w-sm bg-[#FEF3C7] border-2 border-[#111827] rounded-xl p-2 sm:p-2.5 shadow-[3px_3px_0px_#111827] flex items-center space-x-2 pointer-events-auto animate-bounce transition-all">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white border border-[#111827] flex items-center justify-center text-sm sm:text-base flex-shrink-0">
              {unlockedItem.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <span className="bg-[#10B981] text-white text-[9px] font-mono font-black px-1.5 py-0.2 rounded border border-[#111827]">
                  +{unlockedItem.points} PTS
                </span>
                <h4 className="font-display font-black text-xs text-[#111827] truncate">
                  {unlockedItem.name}
                </h4>
              </div>
              <p className="text-[10px] font-mono text-gray-800 line-clamp-1 mt-0.5">
                {unlockedItem.culturalFact}
              </p>
            </div>
            <button 
              type="button"
              onClick={onDismissUnlock}
              className="text-gray-500 hover:text-black p-1 flex-shrink-0"
              title="Dismiss fact"
            >
              <X className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* 4. Speed Boost Active Pill */}
        {speedBoostActive && (
          <div className="px-2.5 py-0.5 bg-[#FBBF24] text-[#111827] border-2 border-[#111827] rounded-full shadow-[2px_2px_0px_#111827] font-mono font-black text-[9px] sm:text-[10px] flex items-center space-x-1 animate-pulse pointer-events-none">
            <Zap className="w-3 h-3 text-[#1B3FFF] fill-[#1B3FFF]" />
            <span>TURBO SPRINT!</span>
          </div>
        )}

      </div>

      {/* Mobile Turbo Dash Button (Right Side, Above Jump) */}
      {onSprint && (
        <button
          type="button"
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSprint();
          }}
          title="Turbo Dash / Sprint (Shift)"
          className={`absolute bottom-24 right-4 sm:right-5 z-30 w-11 h-11 sm:w-12 sm:h-12 rounded-full border-[2.5px] border-[#111827] shadow-[2.5px_2.5px_0px_#111827] flex flex-col items-center justify-center font-display font-black text-[9px] uppercase transition-all pointer-events-auto select-none touch-none active:scale-95 ${
            speedBoostActive 
              ? 'bg-[#06B6D4] text-white animate-pulse' 
              : 'bg-white hover:bg-cyan-50 text-[#111827]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 fill-current" />
          <span className="text-[7.5px] -mt-0.5 font-mono font-black">DASH</span>
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
          title="Jump / Leap (Spacebar)"
          className="absolute bottom-6 right-4 sm:right-5 z-30 w-14 h-14 sm:w-16 sm:h-16 bg-[#FBBF24] hover:bg-amber-300 active:bg-amber-400 active:scale-95 text-[#111827] rounded-full border-[2.5px] border-[#111827] shadow-[3.5px_3.5px_0px_#111827] flex flex-col items-center justify-center font-display font-black text-xs uppercase transition-transform pointer-events-auto select-none touch-none"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
          <span className="text-[8px] sm:text-[9px] -mt-0.5 tracking-tight font-black">JUMP</span>
        </button>
      )}
    </>
  );
};

export const GameHUD = React.memo(GameHUDComponent);
