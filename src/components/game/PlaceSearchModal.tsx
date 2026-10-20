import React, { useState, useMemo } from 'react';
import { Search, MapPin, Navigation, Compass, X, Zap, Check, ArrowRight } from 'lucide-react';
import { WORLD_LANDMARKS, WorldLandmark } from '../../data/worldLandmarks';

interface PlaceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerCoords: { x: number; y: number; z: number };
  activeWaypoint: WorldLandmark | null;
  onSelectWaypoint: (landmark: WorldLandmark | null) => void;
  onTeleportTo: (landmark: WorldLandmark) => void;
}

const PlaceSearchModalComponent: React.FC<PlaceSearchModalProps> = ({
  isOpen,
  onClose,
  playerCoords,
  activeWaypoint,
  onSelectWaypoint,
  onTeleportTo
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLandmarks = useMemo(() => {
    return WORLD_LANDMARKS.map(landmark => {
      const distance = Math.round(
        Math.hypot(playerCoords.x - landmark.coords.x, playerCoords.z - landmark.coords.z)
      );
      return { ...landmark, distance };
    })
      .filter(l => {
        const matchesCategory = selectedCategory === 'all' || l.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        if (!q) return matchesCategory;

        const matchesQuery = 
          l.name.toLowerCase().includes(q) ||
          l.district.toLowerCase().includes(q) ||
          l.description.toLowerCase().includes(q) ||
          l.tags.some(t => t.toLowerCase().includes(q));

        return matchesCategory && matchesQuery;
      })
      .sort((a, b) => a.distance - b.distance);
  }, [searchQuery, selectedCategory, playerCoords]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-[#FFFFFF] border-[2.5px] border-[#111827] rounded-3xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-[8px_8px_0px_#111827] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#1B3FFF] text-white flex items-center justify-between border-b-[2.5px] border-[#111827]">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FBBF24] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center text-xl text-[#111827]">
              🧭
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display font-black text-lg sm:text-xl tracking-tight text-white uppercase">
                  WORLD PLACES & GPS RADAR
                </h2>
                <span className="bg-white text-[#1B3FFF] font-mono font-black text-[9px] px-2 py-0.5 rounded border border-[#111827]">
                  {WORLD_LANDMARKS.length} SITES
                </span>
              </div>
              <p className="text-[11px] font-mono text-blue-100">
                Search open-world landmarks, set GPS compass navigation, or teleport instantly
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white hover:bg-gray-100 text-[#111827] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center font-black active:translate-x-0.5 active:translate-y-0.5 transition-all"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Search Bar & Filters */}
        <div className="p-3 sm:p-4 bg-[#FDFBF7] border-b-2 border-[#111827] space-y-2.5">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by landmark name, souk, bridge, oasis, tower, or district..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#111827] rounded-xl font-mono text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1B3FFF] shadow-inner"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#111827]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'ALL PLACES' },
              { id: 'iconic', label: '🏙️ ICONIC TOWERS' },
              { id: 'heritage', label: '🏺 HERITAGE SOUKS' },
              { id: 'nature', label: '🌴 OASIS & DESERT' },
              { id: 'interactive', label: '⚡ STUNTS & SPEED' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl border-2 border-[#111827] text-[10px] font-mono font-black uppercase whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#111827] text-white shadow-[2px_2px_0px_#FBBF24] -translate-y-0.5'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-[1px_1px_0px_#111827]'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {activeWaypoint && (
              <button
                onClick={() => onSelectWaypoint(null)}
                className="ml-auto px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-900 border border-[#111827] rounded-lg text-[9px] font-mono font-black flex items-center space-x-1 whitespace-nowrap"
              >
                <X className="w-3 h-3" />
                <span>CLEAR WAYPOINT</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Landmark Cards List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2.5 max-h-[55vh]">
          {filteredLandmarks.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <span className="text-4xl">🔍</span>
              <h3 className="font-display font-black text-lg text-[#111827]">
                No places match "{searchQuery}"
              </h3>
              <p className="text-xs font-mono text-gray-500">
                Try searching for "burj", "frame", "souk", "bridge", "camp", or "oasis".
              </p>
            </div>
          ) : (
            filteredLandmarks.map((landmark) => {
              const isTargeted = activeWaypoint?.id === landmark.id;

              return (
                <div
                  key={landmark.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border-2 border-[#111827] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isTargeted 
                      ? 'bg-[#FEF3C7] shadow-[4px_4px_0px_#111827] -translate-y-0.5 ring-2 ring-[#F59E0B]' 
                      : 'bg-white hover:bg-gray-50 shadow-[3px_3px_0px_#111827]'
                  }`}
                >
                  {/* Left: Landmark Details */}
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-[#FDFBF7] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] flex items-center justify-center text-2xl flex-shrink-0">
                      {landmark.emoji}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5 flex-wrap">
                        <span className="font-display font-black text-sm text-[#111827]">
                          {landmark.name}
                        </span>
                        <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded border border-[#111827] bg-[#EFF6FF] text-[#1B3FFF]">
                          {landmark.badge}
                        </span>
                        {isTargeted && (
                          <span className="text-[9px] font-mono font-black uppercase px-1.5 py-0.2 rounded border border-[#111827] bg-[#10B981] text-white animate-pulse">
                            ACTIVE GPS PIN
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-[10px] font-mono text-gray-500">
                        <span className="font-bold text-[#FF5722]">{landmark.district}</span>
                        <span>•</span>
                        <span className="font-black text-[#111827] flex items-center space-x-0.5">
                          <MapPin className="w-3 h-3 text-[#1B3FFF]" />
                          <span>{landmark.distance}m away</span>
                        </span>
                      </div>

                      <p className="text-[11px] font-mono text-gray-600 line-clamp-2 mt-0.5">
                        {landmark.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Actions: Teleport & GPS Pin */}
                  <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectWaypoint(isTargeted ? null : landmark);
                      }}
                      className={`px-3 py-2 rounded-xl border-2 border-[#111827] font-mono font-black text-xs uppercase flex items-center space-x-1 shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[38px] ${
                        isTargeted
                          ? 'bg-[#10B981] text-white hover:bg-emerald-600'
                          : 'bg-[#FDFBF7] text-[#111827] hover:bg-amber-100'
                      }`}
                      title="Set GPS navigation beam"
                    >
                      <Navigation className={`w-3.5 h-3.5 ${isTargeted ? 'fill-white' : ''}`} />
                      <span>{isTargeted ? 'PINNED' : 'PIN GPS'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onTeleportTo(landmark);
                        onClose();
                      }}
                      className="px-3.5 py-2 bg-[#FF5722] hover:bg-[#E64A19] text-white border-2 border-[#111827] rounded-xl font-display font-black text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 min-h-[38px]"
                    >
                      <span>🚀</span>
                      <span>TELEPORT</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-[#FDFBF7] border-t-2 border-[#111827] flex items-center justify-between text-[10px] font-mono text-gray-600">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Interactive Realtime Coordinates: (X: {Math.round(playerCoords.x)}, Z: {Math.round(playerCoords.z)})</span>
          </div>
          <span className="font-bold">Teleportation re-centers camera and facing angle</span>
        </div>

      </div>
    </div>
  );
};

export const PlaceSearchModal = React.memo(PlaceSearchModalComponent);
