import React, { useState } from 'react';
import { ComicPanel } from '../../types/comic';
import { SpeechBubble } from './SpeechBubble';

interface ComicPanelItemProps {
  panel: ComicPanel;
  onPlaySound?: (soundText?: string) => void;
}

export const ComicPanelItem: React.FC<ComicPanelItemProps> = ({ panel, onPlaySound }) => {
  const [isWiggling, setIsWiggling] = useState(false);

  const handleDecalClick = () => {
    setIsWiggling(true);
    if (onPlaySound && panel.soundEffect) {
      onPlaySound(panel.soundEffect.text);
    }
    setTimeout(() => setIsWiggling(false), 500);
  };

  return (
    <div className="relative flex flex-col justify-between h-full bg-white border-[2.5px] border-[#111827] rounded-2xl overflow-hidden shadow-[4px_4px_0px_#111827] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_#111827]">
      
      {/* Top Header: Panel Number Corner Stamp & Golden-Age Caption */}
      <div className="p-3 sm:p-3.5 bg-[#FDFBF7] border-b-2 border-[#111827]">
        <div className="flex items-center justify-between mb-2">
          <span className="bg-[#111827] text-white font-mono font-black text-[10px] px-2.5 py-0.5 rounded tracking-widest uppercase shadow-[1.5px_1.5px_0px_#111827]">
            PANEL #0{panel.panelNumber}
          </span>
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-wider">
            HISTORIC LORE
          </span>
        </div>

        {panel.narrativeCaption && (
          <div className="bg-[#FDE047] border-2 border-[#111827] shadow-[2px_2px_0px_#111827] px-3 py-1.5 text-xs font-mono font-black text-[#111827] tracking-wider uppercase rounded-lg">
            {panel.narrativeCaption}
          </div>
        )}
      </div>

      {/* Main Panel Illustration / Halftone Area */}
      <div 
        className="relative min-h-[180px] p-5 flex flex-col items-center justify-center border-b-2 border-[#111827] overflow-hidden select-none"
        style={{ backgroundColor: panel.illustrationBgColor }}
      >
        {/* Halftone Ben-Day pattern overlay */}
        <div className="absolute inset-0 comic-halftone opacity-15 pointer-events-none" />

        {/* Character Backdrop Burst Circle */}
        <div className="relative z-10 w-24 h-24 rounded-full bg-white/80 border-2 border-[#111827] shadow-[2.5px_2.5px_0px_#111827] flex items-center justify-center transform hover:scale-110 active:scale-95 transition-transform duration-200">
          <span className="text-5xl drop-shadow-sm select-none">
            {panel.illustrationEmoji}
          </span>
        </div>

        {/* Scene description subtitle pill */}
        <p className="relative z-10 mt-3 text-[11px] font-mono font-bold text-center text-[#111827] bg-white/95 px-3 py-1 rounded-full border-2 border-[#111827] max-w-[92%] shadow-[2px_2px_0px_#111827] leading-tight">
          {panel.panelScene}
        </p>

        {/* Clickable Action Sound Decal */}
        {panel.soundEffect && (
          <button 
            type="button"
            onClick={handleDecalClick}
            title="Tap sound decal for sound effect!"
            className={`absolute top-3 right-3 z-20 font-comic text-xl sm:text-2xl tracking-wider text-white px-3 py-1 rounded-xl border-2 border-[#111827] shadow-[3px_3px_0px_#111827] select-none cursor-pointer active:scale-125 transition-transform ${
              isWiggling ? 'animate-bounce scale-110' : 'hover:scale-105'
            }`}
            style={{
              backgroundColor: panel.soundEffect.color,
              transform: `rotate(${panel.soundEffect.rotationDeg}deg)`
            }}
          >
            <span className="drop-shadow-[1.5px_1.5px_0px_#111827]">
              {panel.soundEffect.text}
            </span>
          </button>
        )}
      </div>

      {/* Speech & Thought Bubbles Container (Newsprint tint with generous dialogue spacing) */}
      <div className="p-3.5 bg-[#FFFDF7] space-y-2.5 flex-1 flex flex-col justify-end">
        {panel.speechBubbles.map((bubble, i) => (
          <SpeechBubble key={i} bubble={bubble} />
        ))}
      </div>

    </div>
  );
};
