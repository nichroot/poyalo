import React from 'react';
import { ComicSpeechBubble } from '../../types/comic';

interface SpeechBubbleProps {
  bubble: ComicSpeechBubble;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ bubble }) => {
  const isShout = bubble.type === 'shout';
  const isThought = bubble.type === 'thought';
  const isRight = bubble.pointerDirection === 'bottom-right';

  return (
    <div className={`relative my-1.5 max-w-[94%] sm:max-w-[88%] ${isRight ? 'ml-auto' : 'mr-auto'}`}>
      {/* Speaker Tag */}
      <div className={`flex items-center space-x-1 mb-1 text-[11px] font-mono font-bold select-none ${isRight ? 'justify-end' : 'justify-start'}`}>
        {bubble.avatarEmoji && <span className="text-sm select-none">{bubble.avatarEmoji}</span>}
        <span className="bg-[#111827] text-white px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-black">
          {bubble.speaker}
        </span>
      </div>

      {/* Bubble Container */}
      <div className={`relative px-3.5 py-2.5 border-2 border-[#111827] shadow-[2.5px_2.5px_0px_#111827] text-xs sm:text-sm font-display text-[#111827] leading-snug transition-transform hover:scale-[1.01] ${
        isThought
          ? 'rounded-3xl border-dashed bg-sky-50'
          : isShout
          ? 'rounded-xl bg-[#FEF08A] font-black tracking-wide border-[2.5px]'
          : 'rounded-2xl bg-white'
      } ${
        !isThought && bubble.pointerDirection === 'bottom-left' ? 'speech-tail-bottom-left' : ''
      } ${
        !isThought && bubble.pointerDirection === 'bottom-right' ? 'speech-tail-bottom-right' : ''
      }`}>
        <p className="relative z-10">{bubble.text}</p>
      </div>
    </div>
  );
};
