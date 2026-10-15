import React from 'react';
import { Compass, Wifi, WifiOff, Sparkles, MapPin, Smartphone, Key } from 'lucide-react';

interface HeaderProps {
  isOffline: boolean;
  onTeleportDemo?: () => void;
  onOpenInstallGuide?: () => void;
  onOpenApiKeyModal?: () => void;
  activeCity?: string;
}

export const Header: React.FC<HeaderProps> = ({
  isOffline = false,
  onTeleportDemo,
  onOpenInstallGuide,
  onOpenApiKeyModal,
  activeCity = 'Worldwide'
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#FDFBF7] border-b-[2.5px] border-[#111827] px-3 sm:px-4 py-2.5 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Brand & City (Clickable to trigger supersonic easter egg) */}
        <button 
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new CustomEvent('poyalo:airplane-shake'));
            }
          }}
          title="Shake phone or click here for Supersonic Easter Egg! ✈️"
          className="flex items-center space-x-2 sm:space-x-2.5 text-left group active:translate-x-0.5 active:translate-y-0.5 transition-transform"
        >
          <div className="bg-[#1B3FFF] group-hover:bg-[#1532CC] text-white px-2.5 py-1 rounded-lg border-2 border-[#111827] shadow-[2px_2px_0px_#111827] font-display font-black text-lg tracking-tight flex items-center space-x-1">
            <span>POYALO</span>
            <span className="text-sm">✈️</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display font-black text-xs text-[#111827] tracking-wider uppercase group-hover:text-[#FF5722] transition-colors">
                പോയാലോ?
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FBBF24] border border-[#111827] text-[#111827]">
                <MapPin className="w-2.5 h-2.5 mr-0.5" />
                {activeCity}
              </span>
            </div>
            <p className="text-[10px] font-mono text-gray-500 hidden sm:block">
              Story-First Travel Companion
            </p>
          </div>
        </button>

        {/* Right Badges: AI Engine, Install App, Offline & Demo Teleport */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          
          {/* AI Engine Settings Button */}
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              title="Configure AI Engine / Gemini API Key"
              className="bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#111827] px-2 sm:px-2.5 py-1 rounded-full border-2 border-[#111827] text-[10px] sm:text-[11px] font-mono font-bold shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1 transition-transform"
            >
              <Key className="w-3 h-3 text-[#7C3AED]" />
              <span className="hidden xs:inline">AI</span>
              <span>KEY</span>
            </button>
          )}

          {/* Install / Guide Pill */}
          {onOpenInstallGuide && (
            <button
              onClick={onOpenInstallGuide}
              title="Add POYALO to your home screen"
              className="bg-[#FBBF24] hover:bg-amber-300 text-[#111827] px-2 sm:px-2.5 py-1 rounded-full border-2 border-[#111827] text-[10px] sm:text-[11px] font-mono font-black shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1 transition-transform"
            >
              <Smartphone className="w-3 h-3 text-[#111827]" />
              <span className="hidden xs:inline">INSTALL</span>
              <span>APP</span>
            </button>
          )}

          {/* Offline / PWA Pill */}
          <div className={`flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-full border-2 border-[#111827] text-[10px] sm:text-[11px] font-mono font-bold shadow-[2px_2px_0px_#111827] ${
            isOffline ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
          }`}>
            {isOffline ? <WifiOff className="w-3 h-3 text-amber-700" /> : <Wifi className="w-3 h-3 text-emerald-700" />}
            <span className="hidden md:inline">{isOffline ? 'AIRPLANE MODE' : 'OFFLINE PACK: SYNCED'}</span>
            <span className="md:hidden">{isOffline ? 'OFFLINE' : 'SYNCED'}</span>
          </div>

          {/* Quick Demo Teleport Button */}
          {onTeleportDemo && (
            <button
              onClick={onTeleportDemo}
              title="Quickly fill chaotic sample itinerary for stage pitch"
              className="bg-[#FFA07A] hover:bg-[#FF885A] text-[#111827] px-2 sm:px-2.5 py-1 rounded-full border-2 border-[#111827] text-[10px] sm:text-[11px] font-mono font-bold shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1 transition-transform"
            >
              <Sparkles className="w-3 h-3 text-[#111827]" />
              <span className="hidden sm:inline">PITCH TELEPORT</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
