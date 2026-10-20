import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Send, 
  RotateCcw,
  Share2,
  Dices,
  Check,
  Search,
  Sparkle
} from 'lucide-react';
import { ComicStory, ComicTone, EraLayer } from '../../types/comic';
import { getComicForCityToneEra, COMIC_CITIES } from '../../data/mockComics';
import { generateAIComicStory } from '../../services/aiService';
import { ComicPanelItem } from './ComicPanelItem';

// Synthesize snappy offline comic sound effects using Web Audio API
function playComicSynth(type: 'pop' | 'chime' | 'whoosh' | 'splash' | 'kapow' = 'pop') {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'chime') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      osc.frequency.setValueAtTime(783.99, now + 0.16);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'whoosh') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.28);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'splash') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.18);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    } else if (type === 'kapow') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      // Pop
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.1);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  } catch {
    // Audio context may be restricted before user gesture
  }
}

interface ComicStoryBoxProps {
  initialCity?: string;
}

export const ComicStoryBox: React.FC<ComicStoryBoxProps> = ({ initialCity }) => {
  const [selectedCity, setSelectedCity] = useState<string>(() => {
    if (initialCity && initialCity.trim() !== '') return initialCity.trim();
    return 'Dubai';
  });
  const [tone, setTone] = useState<ComicTone>('roast');
  const [era, setEra] = useState<EraLayer>('1800s');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showAiCreator, setShowAiCreator] = useState<boolean>(false);
  const [customStoryPrompt, setCustomStoryPrompt] = useState<string>('');
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [aiCustomStory, setAiCustomStory] = useState<ComicStory | null>(null);

  const activeStory = aiCustomStory || getComicForCityToneEra(selectedCity, tone, era);

  // If initialCity prop changes from parent
  useEffect(() => {
    if (initialCity && initialCity.trim() !== '') {
      setSelectedCity(initialCity.trim());
      setAiCustomStory(null);
    }
  }, [initialCity]);

  const handleSelectCity = (cityName: string) => {
    setSelectedCity(cityName);
    setAiCustomStory(null);
    playComicSynth('pop');
    setToastMessage(`📖 Loaded verified lore for ${cityName}!`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleSurpriseMe = () => {
    playComicSynth('chime');
    const availableCities = COMIC_CITIES.map(c => c.name);
    const tonesList: ComicTone[] = ['roast', 'storyteller', 'kid', 'professor'];
    const erasList: EraLayer[] = ['1800s', '1950s', 'modern'];

    const randomCity = availableCities[Math.floor(Math.random() * availableCities.length)];
    const randomTone = tonesList[Math.floor(Math.random() * tonesList.length)];
    const randomEra = erasList[Math.floor(Math.random() * erasList.length)];

    setSelectedCity(randomCity);
    setTone(randomTone);
    setEra(randomEra);
    setAiCustomStory(null);
    setToastMessage(`🎲 Discovered ${randomCity} in ${randomEra.toUpperCase()} (${randomTone.toUpperCase()} tone)!`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleShareComic = async () => {
    playComicSynth('pop');
    const formattedText = `📖 ${activeStory.title} — ${activeStory.cityName}\n"${activeStory.tagline}"\n\n` +
      activeStory.panels.map((p, i) => 
        `[PANEL ${i + 1}: ${p.narrativeCaption || p.panelScene}]\n` +
        p.speechBubbles.map(b => `${b.speaker}: "${b.text}"`).join('\n')
      ).join('\n\n') +
      `\n\nPOYALO • Story-First Travel Companion`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: activeStory.title,
          text: formattedText,
          url: window.location.href
        });
        return;
      } catch {}
    }

    try {
      await navigator.clipboard.writeText(formattedText);
      setToastMessage('📋 Comic strip transcript copied to clipboard!');
      setTimeout(() => setToastMessage(''), 2800);
    } catch {
      setToastMessage('⚠️ Unable to copy to clipboard.');
      setTimeout(() => setToastMessage(''), 2800);
    }
  };

  const handleGenerateCustomStory = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    const promptToUse = customPrompt || customStoryPrompt;
    if (!promptToUse.trim()) return;

    setIsGeneratingStory(true);
    setToastMessage('🎨 POYALO AI drafting authentic 3-panel graphic novel...');

    try {
      const generated = await generateAIComicStory(promptToUse, tone, era);
      setAiCustomStory(generated);
      playComicSynth('chime');
      setToastMessage(`✨ Comic created for ${generated.placeName || generated.cityName}!`);
      setCustomStoryPrompt('');
    } catch (err: any) {
      console.warn('Comic generation error:', err);
      setToastMessage('⚠️ Connection unavailable, displaying verified historical lore.');
    } finally {
      setIsGeneratingStory(false);
      setTimeout(() => setToastMessage(''), 3500);
    }
  };

  const handlePlaySoundDecal = (soundText?: string) => {
    const s = (soundText || '').toLowerCase();
    if (s.includes('splash')) playComicSynth('splash');
    else if (s.includes('whoosh') || s.includes('swoosh') || s.includes('zoom')) playComicSynth('whoosh');
    else if (s.includes('kapow') || s.includes('boom') || s.includes('clang')) playComicSynth('kapow');
    else if (s.includes('ding') || s.includes('ring')) playComicSynth('chime');
    else playComicSynth('pop');
  };

  const tones: { id: ComicTone; label: string; icon: string }[] = [
    { id: 'roast', label: 'Roast', icon: '🔥' },
    { id: 'storyteller', label: 'Story', icon: '📖' },
    { id: 'kid', label: 'Cartoon', icon: '🧸' },
    { id: 'professor', label: 'Deep Lore', icon: '🎓' }
  ];

  const eras: { id: EraLayer; label: string; icon: string }[] = [
    { id: '1800s', label: '1800s Origins', icon: '⏳' },
    { id: '1950s', label: '1950s Golden Era', icon: '📻' },
    { id: 'modern', label: 'Modern Day', icon: '⚡' }
  ];

  return (
    <div className="space-y-4 pb-20">
      
      {/* Golden-Age Comic Book Issue Cover Plaque */}
      <div className="bg-[#FFFDF8] border-[2.5px] border-[#111827] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#111827] relative overflow-hidden">
        
        {/* Halftone Ben-Day dot pattern accent */}
        <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-[#FF5722]/10 rounded-full comic-halftone pointer-events-none" />

        {/* Vintage Comic Header Strip */}
        <div className="flex items-center justify-between gap-2 flex-wrap pb-3 mb-3 border-b-2 border-dashed border-[#111827]/30">
          
          {/* Issue Badge & Barcode */}
          <div className="flex items-center space-x-2">
            <div className="bg-[#111827] text-white px-2 py-0.5 rounded font-mono font-black text-[10px] tracking-widest uppercase flex items-center space-x-1">
              <span>VOL. 1</span>
              <span>•</span>
              <span>NO. 01</span>
            </div>
            <span className="hidden sm:inline-block font-mono font-bold text-[9px] text-gray-500 tracking-tighter select-none">
              ||| | ||||| |||
            </span>
            <span className="bg-[#FEF08A] text-[#111827] px-2 py-0.5 rounded font-mono font-black text-[10px] border border-[#111827] uppercase hidden xs:inline-block">
              ★ 100% VERIFIED LORE ★
            </span>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleSurpriseMe}
              title="Pick a surprise random story from archives"
              className="px-2.5 py-1 bg-white hover:bg-amber-100 border-2 border-[#111827] rounded-xl font-mono font-black text-xs shadow-[2px_2px_0px_#111827] flex items-center space-x-1 active:translate-x-0.5 active:translate-y-0.5 transition-all text-[#111827]"
            >
              <Dices className="w-3.5 h-3.5 text-[#FF5722]" />
              <span className="hidden sm:inline">SURPRISE</span>
            </button>

            <button
              onClick={handleShareComic}
              title="Copy / Share comic strip transcript"
              className="px-2.5 py-1 bg-white hover:bg-sky-50 border-2 border-[#111827] rounded-xl font-mono font-black text-xs shadow-[2px_2px_0px_#111827] flex items-center space-x-1 active:translate-x-0.5 active:translate-y-0.5 transition-all text-[#111827]"
            >
              <Share2 className="w-3.5 h-3.5 text-[#1B3FFF]" />
              <span className="hidden sm:inline">SHARE</span>
            </button>

            <button
              onClick={() => setShowAiCreator(!showAiCreator)}
              title="Toggle AI custom comic generator"
              className={`px-3 py-1 border-2 border-[#111827] rounded-xl font-mono font-black text-xs shadow-[2px_2px_0px_#111827] flex items-center space-x-1 active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                showAiCreator 
                  ? 'bg-[#111827] text-white' 
                  : 'bg-[#FEF08A] hover:bg-amber-300 text-[#111827]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{showAiCreator ? 'CLOSE' : 'AI DRAW'}</span>
            </button>
          </div>
        </div>

        {/* Story Title & Newsprint Tagline Ribbon */}
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="bg-[#FF5722] text-white px-2 py-0.5 rounded font-mono font-black text-[10px] uppercase border border-[#111827] tracking-wider">
              {activeStory.cityName}
            </span>
            <span className="text-xs font-mono font-bold text-gray-500 uppercase">
              {activeStory.placeName}
            </span>
            {aiCustomStory && (
              <button
                onClick={() => {
                  setAiCustomStory(null);
                  playComicSynth('pop');
                }}
                className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 border border-[#111827] rounded text-[10px] font-mono font-bold text-gray-700 flex items-center space-x-1 shadow-[1.5px_1.5px_0px_#111827] active:translate-x-0.5"
                title="Reset to verified sample lore"
              >
                <RotateCcw className="w-2.5 h-2.5" />
                <span>SAMPLE</span>
              </button>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-black text-[#111827] tracking-tight leading-tight">
            {activeStory.title}
          </h1>

          <div className="pt-0.5">
            <span className="inline-block bg-[#FEF9C3] border border-[#111827] px-2.5 py-1 rounded text-xs sm:text-[13px] font-mono font-bold text-[#111827] shadow-[1px_1px_0px_#111827]">
              "{activeStory.tagline}"
            </span>
          </div>
        </div>

        {/* Expandable AI Prompt Studio Drawer */}
        {showAiCreator && (
          <div className="mt-4 pt-3.5 border-t-2 border-[#111827] animate-in fade-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleGenerateCustomStory} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={customStoryPrompt}
                  onChange={(e) => setCustomStoryPrompt(e.target.value)}
                  placeholder="Ask for ANY place worldwide (e.g. Kyoto Samurai, Colosseum, 1920s Harlem)..."
                  className="w-full pl-8 pr-3.5 py-2 bg-white border-2 border-[#111827] rounded-xl font-mono text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FF5722] font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={isGeneratingStory}
                className="px-4 py-2 bg-[#FF5722] hover:bg-[#E64A19] text-white border-2 border-[#111827] rounded-xl font-mono font-black text-xs uppercase shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1.5 disabled:opacity-50 whitespace-nowrap"
              >
                {isGeneratingStory ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>{isGeneratingStory ? 'DRAWING...' : 'DRAW'}</span>
              </button>
            </form>

            {/* Quick Inspiration suggestions */}
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">Try:</span>
              {[
                { label: '⛩️ Kyoto Samurai', prompt: 'Feudal Samurai in Kyoto Japan' },
                { label: '🏛️ Colosseum Gladiators', prompt: 'Gladiators in Ancient Rome' },
                { label: '🎨 Renaissance Florence', prompt: 'Leonardo vs Michelangelo in Florence' },
                { label: '🗽 1920s Harlem Jazz', prompt: 'Jazz Age in 1920s Harlem New York' }
              ].map((pill) => (
                <button
                  key={pill.label}
                  type="button"
                  onClick={(e) => handleGenerateCustomStory(e, pill.prompt)}
                  disabled={isGeneratingStory}
                  className="px-2 py-0.5 bg-white hover:bg-[#FEF3C7] border border-[#111827] rounded text-[10px] font-mono font-bold text-gray-800 shadow-[1px_1px_0px_#111827] active:translate-x-0.5 transition-colors disabled:opacity-50"
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Clean Auto-dismissing Toast Message */}
        {toastMessage && (
          <div className="mt-3 p-2 bg-amber-50 border-2 border-[#111827] rounded-xl text-[#111827] text-xs font-mono font-bold flex items-center space-x-2 shadow-[2px_2px_0px_#111827] animate-in fade-in">
            <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>

      {/* The Unified Comic Director Toolbar: Cities + Tone + Era */}
      <div className="bg-white border-2 border-[#111827] rounded-2xl p-3 shadow-[3px_3px_0px_#111827] space-y-2.5">
        
        {/* City Archives Carousel Row */}
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-wider flex-shrink-0">
            CITY:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none flex-1">
            {COMIC_CITIES.map((c) => {
              const isSelected = selectedCity.toLowerCase() === c.name.toLowerCase() && !aiCustomStory;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelectCity(c.name)}
                  className={`px-2.5 py-1 rounded-xl border-2 border-[#111827] text-xs font-mono font-black flex items-center space-x-1 whitespace-nowrap transition-all flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#1B3FFF] text-white shadow-[2px_2px_0px_#111827] -translate-y-0.5'
                      : 'bg-[#FDFBF7] text-gray-800 hover:bg-gray-100 shadow-[1px_1px_0px_#111827]'
                  }`}
                >
                  <span>{c.flag}</span>
                  <span>{c.name}</span>
                </button>
              );
            })}

            {aiCustomStory && (
              <span className="px-2.5 py-1 rounded-xl border-2 border-[#111827] text-xs font-mono font-black bg-[#FEF08A] text-[#111827] shadow-[2px_2px_0px_#111827] whitespace-nowrap">
                ✨ {activeStory.cityName} (AI)
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gray-200" />

        {/* Tone & Era Controls in a Clean Horizontal Flow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Tone Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-wider flex-shrink-0">
              TONE:
            </span>
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTone(t.id);
                  playComicSynth('pop');
                }}
                className={`px-2.5 py-1 rounded-xl border-2 border-[#111827] text-xs font-mono font-black flex items-center space-x-1 whitespace-nowrap transition-all ${
                  tone === t.id
                    ? 'bg-[#1B3FFF] text-white shadow-[2px_2px_0px_#111827] -translate-y-0.5'
                    : 'bg-[#FDFBF7] text-gray-700 hover:bg-gray-100 shadow-[1px_1px_0px_#111827]'
                }`}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Era Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-wider flex-shrink-0">
              ERA:
            </span>
            {eras.map((e) => (
              <button
                key={e.id}
                onClick={() => {
                  setEra(e.id);
                  playComicSynth('pop');
                }}
                className={`px-2.5 py-1 rounded-xl border-2 border-[#111827] text-xs font-mono font-black flex items-center space-x-1 whitespace-nowrap transition-all ${
                  era === e.id
                    ? 'bg-[#FF5722] text-white shadow-[2px_2px_0px_#111827] -translate-y-0.5'
                    : 'bg-[#FDFBF7] text-gray-700 hover:bg-gray-100 shadow-[1px_1px_0px_#111827]'
                }`}
              >
                <span>{e.icon}</span>
                <span>{e.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* The 3-Panel Comic Strip — Equal heights with generous gutters & spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
        {activeStory.panels.map((panel) => (
          <ComicPanelItem 
            key={panel.panelNumber} 
            panel={panel} 
            onPlaySound={handlePlaySoundDecal}
          />
        ))}
      </div>

      {/* Historical Sources Grounding Footer */}
      <div className="bg-[#FFFDF7] border-2 border-[#111827] rounded-xl p-3 sm:p-3.5 shadow-[2px_2px_0px_#111827] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-gray-700" />
          <span className="text-[11px] font-mono font-black text-gray-800 uppercase tracking-wider">
            HISTORICAL SOURCES GROUNDING:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activeStory.sources.map((src, i) => (
            <span 
              key={i} 
              className="px-2 py-0.5 bg-white border border-[#111827] rounded text-[10px] font-mono font-bold text-gray-700 shadow-[1px_1px_0px_#111827]"
            >
              📜 {src}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
