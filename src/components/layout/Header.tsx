import React from 'react';
import { Wifi, WifiOff, MapPin, Smartphone, Key } from 'lucide-react';

interface HeaderProps {
  isOffline: boolean;
  onOpenInstallGuide?: () => void;
  onOpenApiKeyModal?: () => void;
  activeCity?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isOffline = false,
  onOpenInstallGuide,
  onOpenApiKeyModal,
  activeCity = 'Worldwide'
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7] border-b-[2.5px] border-[#111827] px-3 sm:px-4 py-2 sm:py-2.5 shadow-[0_2.5px_0px_#111827]">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
        
        {/* Brand & City (Clickable to trigger supersonic easter egg) */}
        <button 
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('poyalo:airplane-shake'));
            }
          }}
          title="Click here for Supersonic Easter Egg! ✈️"
          className="flex items-center space-x-2 text-left group active:translate-x-0.5 active:translate-y-0.5 transition-transform flex-shrink-0 min-w-0"
        >
          <div className="bg-[#1B3FFF] group-hover:bg-[#1532CC] text-white px-2 sm:px-2.5 py-1 rounded-lg border-2 border-[#111827] shadow-[2px_2px_0px_#111827] font-display font-black text-base sm:text-lg tracking-tight flex items-center space-x-1 flex-shrink-0">
            <span>POYALO</span>
            <span className="text-xs sm:text-sm">✈️</span>
          </div>

          <div className="flex items-center space-x-1.5 min-w-0">
            <span className="font-display font-black text-[11px] sm:text-xs text-[#111827] tracking-wider uppercase group-hover:text-[#FF5722] transition-colors hidden xs:inline">
              പോയാലോ?
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FBBF24] border border-[#111827] text-[#111827] truncate max-w-[100px] sm:max-w-none">
              <MapPin className="w-2.5 h-2.5 mr-0.5 flex-shrink-0" />
              <span className="truncate">{activeCity}</span>
            </span>
          </div>
        </button>

        {/* Right Action Icons: Uncluttered on Mobile (Icons only on phone, expanded pills on tablet/desktop) */}
        <div className="flex items-center space-x-1 sm:space-x-1.5 flex-shrink-0">
          
          {/* AI Key Settings */}
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              title="Configure AI Engine / Gemini API Key"
              className="bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#111827] w-8 h-8 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 rounded-full border-2 border-[#111827] text-[11px] font-mono font-bold shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center sm:space-x-1 transition-transform"
            >
              <Key className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span className="hidden sm:inline">AI KEY</span>
            </button>
          )}

          {/* Install PWA Guide */}
          {onOpenInstallGuide && (
            <button
              onClick={onOpenInstallGuide}
              title="Add POYALO to your home screen"
              className="bg-[#FBBF24] hover:bg-amber-300 text-[#111827] w-8 h-8 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 rounded-full border-2 border-[#111827] text-[11px] font-mono font-black shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center sm:space-x-1 transition-transform"
            >
              <Smartphone className="w-3.5 h-3.5 text-[#111827]" />
              <span className="hidden sm:inline">INSTALL</span>
            </button>
          )}

          {/* Offline / Online Status */}
          <div 
            title={isOffline ? 'Running 100% Offline (Cached)' : 'Online • Ready for Realtime Sync'}
            className={`w-8 h-8 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 rounded-full border-2 border-[#111827] text-[11px] font-mono font-bold shadow-[2px_2px_0px_#111827] flex items-center justify-center sm:space-x-1 transition-transform ${
              isOffline ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-700" /> : <Wifi className="w-3.5 h-3.5 text-emerald-700" />}
            <span className="hidden sm:inline">{isOffline ? 'OFFLINE' : 'SYNCED'}</span>
          </div>

        </div>

      </div>
    </header>
  );
};
