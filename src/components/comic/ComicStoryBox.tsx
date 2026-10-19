import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Download, 
  Check, 
  History, 
  BookOpen, 
  Send, 
  RotateCcw,
  Square
} from 'lucide-react';
import { ComicStory, ComicTone, EraLayer } from '../../types/comic';
import { getComicForCityToneEra, COMIC_CITIES } from '../../data/mockComics';
import { generateAIComicStory } from '../../services/aiService';
import { ComicPanelItem } from './ComicPanelItem';

// Synthesize playful comic sound effects using Web Audio API (100% offline)
function playComicSynth(type: 'pop' | 'chime' | 'whoosh' | 'splash' = 'pop') {
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
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
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
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [activePanelIndex, setActivePanelIndex] = useState<number>(-1);
  const [, setIsCachedOffline] = useState<boolean>(true);
  const [cacheToast, setCacheToast] = useState<string>('');
  const [customStoryPrompt, setCustomStoryPrompt] = useState<string>('');
  const [lastCustomPrompt, setLastCustomPrompt] = useState<string>('');
  const [isGeneratingStory, setIsGeneratingStory] = useState<boolean>(false);
  const [aiCustomStory, setAiCustomStory] = useState<ComicStory | null>(null);

  // References for Web Speech cancellation
  const isPlayingRef = useRef<boolean>(false);
  const speechTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeStory = aiCustomStory || getComicForCityToneEra(selectedCity, tone, era);

  // If initialCity changes from parent
  useEffect(() => {
    if (initialCity && initialCity.trim() !== '') {
      setSelectedCity(initialCity.trim());
      setAiCustomStory(null);
    }
  }, [initialCity]);

  // Stop narration helper
  const stopNarration = () => {
    isPlayingRef.current = false;
    setIsPlayingAudio(false);
    setActivePanelIndex(-1);
    if (speechTimerRef.current) {
      clearTimeout(speechTimerRef.current);
      speechTimerRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {}
    }
  };

  // Web Speech API Voice Narration Routine
  const startNarration = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setCacheToast('⚠️ Voice narration is not supported in this browser.');
      setTimeout(() => setCacheToast(''), 3000);
      return;
    }

    stopNarration();
    isPlayingRef.current = true;
    setIsPlayingAudio(true);
    playComicSynth('chime');

    const panels = activeStory.panels;
    let currentPanelIdx = 0;

    const narratePanel = (panelIdx: number) => {
      if (!isPlayingRef.current || panelIdx >= panels.length) {
        stopNarration();
        return;
      }

      setActivePanelIndex(panelIdx);
      const currentPanel = panels[panelIdx];

      // Play sound effect when panel opens
      if (currentPanel.soundEffect) {
        playComicSynth('whoosh');
      } else {
        playComicSynth('pop');
      }

      // Collect narration items for this panel
      const utterancesQueue: SpeechSynthesisUtterance[] = [];

      // 1. Narrative caption
      if (currentPanel.narrativeCaption) {
        const captionUtt = new SpeechSynthesisUtterance(currentPanel.narrativeCaption);
        captionUtt.rate = tone === 'professor' ? 0.92 : 1.0;
        captionUtt.pitch = tone === 'kid' ? 1.15 : 0.98;
        utterancesQueue.push(captionUtt);
      }

      // 2. Speech bubbles
      currentPanel.speechBubbles.forEach((bubble) => {
        const textToSay = `${bubble.speaker}: "${bubble.text}"`;
        const bubbleUtt = new SpeechSynthesisUtterance(textToSay);

        // Modulate pitch and speed based on character bubble type & comic tone
        if (bubble.type === 'shout') {
          bubbleUtt.pitch = tone === 'kid' ? 1.35 : 1.25;
          bubbleUtt.rate = 1.1;
        } else if (bubble.type === 'thought') {
          bubbleUtt.pitch = 0.92;
          bubbleUtt.rate = 0.88;
        } else {
          bubbleUtt.pitch = tone === 'kid' ? 1.2 : 1.05;
          bubbleUtt.rate = tone === 'roast' ? 1.05 : 0.98;
        }
        utterancesQueue.push(bubbleUtt);
      });

      // Play queue sequentially
      let itemIdx = 0;
      const playNextItem = () => {
        if (!isPlayingRef.current) return;

        if (itemIdx >= utterancesQueue.length) {
          // Finished this panel, brief comic pause before next panel
          speechTimerRef.current = setTimeout(() => {
            currentPanelIdx++;
            narratePanel(currentPanelIdx);
          }, 900);
          return;
        }

        const currentUtt = utterancesQueue[itemIdx];
        currentUtt.onend = () => {
          itemIdx++;
          playNextItem();
        };

        currentUtt.onerror = () => {
          // If speech synthesis has an error or cancels, advance cleanly
          itemIdx++;
          playNextItem();
        };

        window.speechSynthesis.speak(currentUtt);
      };

      playNextItem();
    };

    narratePanel(0);
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopNarration();
    } else {
      startNarration();
    }
  };

  // Cleanup speech on unmount or story switch
  useEffect(() => {
    return () => {
      stopNarration();
    };
  }, []);

  const handleDownloadOfflinePack = () => {
    setIsCachedOffline(true);
    playComicSynth('pop');
    setCacheToast('📦 Comic Pack & Audio Voice Script Cached for Offline Travel!');
    setTimeout(() => setCacheToast(''), 3500);
  };

  const handleSelectCity = (cityName: string) => {
    stopNarration();
    setSelectedCity(cityName);
    setAiCustomStory(null);
    playComicSynth('pop');
    setCacheToast(`📖 Loaded verified historical comic lore for ${cityName}!`);
    setTimeout(() => setCacheToast(''), 3000);
  };

  const handleGenerateCustomStory = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    const promptToUse = customPrompt || customStoryPrompt;
    if (!promptToUse.trim()) return;

    stopNarration();
    setIsGeneratingStory(true);
    setLastCustomPrompt(promptToUse);
    setCacheToast('🎨 POYALO AI drafting worldwide 3-panel graphic novel...');

    try {
      const generated = await generateAIComicStory(promptToUse, tone, era);
      setAiCustomStory(generated);
      playComicSynth('chime');
      setCacheToast(`✨ Comic created for ${generated.placeName || generated.cityName}!`);
      setCustomStoryPrompt('');
    } catch (err: any) {
      console.warn('Comic generation failed:', err);
      setCacheToast('⚠️ AI connection unavailable, displaying verified historical lore.');
    } finally {
      setIsGeneratingStory(false);
      setTimeout(() => setCacheToast(''), 4000);
    }
  };

  // Re-generate custom AI story if user changes tone or era while custom story is active
  const handleToneChange = async (newTone: ComicTone) => {
    stopNarration();
    setTone(newTone);
    playComicSynth('pop');

    if (aiCustomStory && lastCustomPrompt) {
      setIsGeneratingStory(true);
      setCacheToast(`🎭 Redrawing custom story in ${newTone.toUpperCase()} tone...`);
      try {
        const regenerated = await generateAIComicStory(lastCustomPrompt, newTone, era);
        setAiCustomStory(regenerated);
      } catch {
        // Fall back gracefully
      } finally {
        setIsGeneratingStory(false);
        setTimeout(() => setCacheToast(''), 3000);
      }
    }
  };

  const handleEraChange = async (newEra: EraLayer) => {
    stopNarration();
    setEra(newEra);
    playComicSynth('pop');

    if (aiCustomStory && lastCustomPrompt) {
      setIsGeneratingStory(true);
      setCacheToast(`⏳ Shifting era machine to ${newEra.toUpperCase()}...`);
      try {
        const regenerated = await generateAIComicStory(lastCustomPrompt, tone, newEra);
        setAiCustomStory(regenerated);
      } catch {
        // Fall back gracefully
      } finally {
        setIsGeneratingStory(false);
        setTimeout(() => setCacheToast(''), 3000);
      }
    }
  };

  const tones: { id: ComicTone; label: string; icon: string; desc: string }[] = [
    { id: 'roast', label: 'Roast Comic', icon: '🔥', desc: 'Satirical caricature & tourist traps' },
    { id: 'storyteller', label: 'Storyteller', icon: '📖', desc: 'Dramatic cinematic novel' },
    { id: 'professor', label: 'Professor', icon: '🎓', desc: 'Historical schematics & facts' },
    { id: 'kid', label: 'Kid Comic', icon: '🧸', desc: 'Saturday morning cartoon strip' }
  ];

  // Dynamic Era label computation tailored to the active city
  const getEraMetadata = (eraId: EraLayer): { label: string; year: string } => {
    const c = (selectedCity || '').toLowerCase();
    if (c.includes('tokyo') || c.includes('japan')) {
      if (eraId === '1800s') return { label: 'Edo Bakumatsu', year: '1842' };
      if (eraId === '1950s') return { label: 'Showa Rebirth', year: '1958' };
      return { label: 'Cyber Tokyo', year: '2026' };
    }
    if (c.includes('paris') || c.includes('france')) {
      if (eraId === '1800s') return { label: 'Haussmann Avenues', year: '1853' };
      if (eraId === '1950s') return { label: 'Existentialist Cafés', year: '1946' };
      return { label: 'Tradition Law', year: '2026' };
    }
    if (c.includes('rome') || c.includes('italy')) {
      if (eraId === '1800s') return { label: 'Forum Cow Pasture', year: '1840' };
      if (eraId === '1950s') return { label: 'Cinecittà Golden Age', year: '1953' };
      return { label: 'Metro C Digs', year: '2026' };
    }
    if (c.includes('kozhikode') || c.includes('calicut') || c.includes('kerala')) {
      if (eraId === '1800s') return { label: 'Beypore Khalasis', year: '1887' };
      if (eraId === '1950s') return { label: 'Dhow Corridor', year: '1952' };
      return { label: 'UNESCO Literature', year: '2026' };
    }
    // Default: Dubai
    if (eraId === '1800s') return { label: 'Pearl Diving', year: '1880' };
    if (eraId === '1950s') return { label: 'Creek Dredging', year: '1954' };
    return { label: 'VG World Era', year: '2026' };
  };

  const eras: { id: EraLayer; label: string; year: string }[] = [
    { id: '1800s', ...getEraMetadata('1800s') },
    { id: '1950s', ...getEraMetadata('1950s') },
    { id: 'modern', ...getEraMetadata('modern') }
  ];

  return (
    <div className="space-y-6 pb-24">
      
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] border-[2.5px] border-[#111827] rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_#111827] relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-[#FF5722]/10 rounded-full comic-halftone pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="bg-[#FF5722] text-white px-2.5 py-0.5 rounded font-mono font-black text-xs uppercase border border-[#111827]">
                THE HEART • COMIC LORE
              </span>
              <span className="text-xs font-mono font-bold text-gray-600 uppercase">
                {activeStory.placeName} • {activeStory.cityName}
              </span>
              {aiCustomStory && (
                <button
                  onClick={() => {
                    stopNarration();
                    setAiCustomStory(null);
                  }}
                  className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 border border-[#111827] rounded text-[10px] font-mono font-bold text-gray-700 flex items-center space-x-1 shadow-[1.5px_1.5px_0px_#111827] active:translate-x-0.5"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>RESET TO SAMPLE</span>
                </button>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-[#111827] mt-1 tracking-tight">
              {activeStory.title}
            </h1>
            <p className="text-xs sm:text-sm font-mono text-gray-700 mt-1 max-w-xl">
              {activeStory.tagline}
            </p>
          </div>

          {/* Audio narration & Cache controls */}
          <div className="flex items-center space-x-2 self-start sm:self-center">
            <button
              onClick={handleToggleAudio}
              className={`px-3.5 py-2.5 rounded-xl border-2 border-[#111827] font-mono font-black text-xs shadow-[2.5px_2.5px_0px_#111827] flex items-center space-x-2 active:translate-x-0.5 active:translate-y-0.5 transition-all ${
                isPlayingAudio 
                  ? 'bg-[#10B981] text-white animate-pulse' 
                  : 'bg-white hover:bg-amber-50 text-[#111827]'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>STOP NARRATION</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-[#1B3FFF]" />
                  <span>NARRATE COMIC</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadOfflinePack}
              className="px-3.5 py-2.5 rounded-xl border-2 border-[#111827] font-mono font-black text-xs bg-[#FBBF24] hover:bg-amber-300 text-[#111827] shadow-[2.5px_2.5px_0px_#111827] flex items-center space-x-1.5 active:translate-x-0.5 active:translate-y-0.5"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">OFFLINE PACK</span>
            </button>
          </div>
        </div>

        {/* AI Worldwide Comic Lore Generator Form */}
        <form onSubmit={handleGenerateCustomStory} className="mt-4 flex gap-2">
          <input
            type="text"
            value={customStoryPrompt}
            onChange={(e) => setCustomStoryPrompt(e.target.value)}
            placeholder="Generate comic lore for ANY place worldwide (e.g. 'Kyoto Samurai Era', 'Colosseum Gladiators', 'Jazz Age Paris')..."
            className="flex-1 px-3.5 py-2.5 bg-[#FDFBF7] border-2 border-[#111827] rounded-xl font-mono text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#FF5722] shadow-inner font-bold"
          />
          <button
            type="submit"
            disabled={isGeneratingStory}
            className="px-4 py-2.5 bg-[#FF5722] hover:bg-[#E64A19] text-white border-2 border-[#111827] rounded-xl font-mono font-black text-xs uppercase shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1.5 disabled:opacity-50"
          >
            {isGeneratingStory ? <Sparkles className="w-4 h-4 animate-spin text-amber-300" /> : <Send className="w-4 h-4" />}
            <span className="hidden sm:inline">{isGeneratingStory ? 'DRAWING...' : 'AI COMIC'}</span>
          </button>
        </form>

        {/* Quick Inspiration Pills */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase mr-1">Sample Topics:</span>
          {[
            { label: '⛩️ Kyoto Samurai', prompt: 'Feudal Samurai Era in Kyoto Japan' },
            { label: '🏛️ Roman Gladiators', prompt: 'Colosseum gladiators in Ancient Rome' },
            { label: '🎨 Renaissance Florence', prompt: 'Leonardo and Michelangelo rivalry in Renaissance Florence' },
            { label: '🗽 1920s New York', prompt: 'Roaring twenties jazz age in Manhattan New York' }
          ].map((pill) => (
            <button
              key={pill.label}
              type="button"
              onClick={(e) => handleGenerateCustomStory(e, pill.prompt)}
              disabled={isGeneratingStory}
              className="px-2 py-0.5 bg-[#FDFBF7] hover:bg-[#FEF3C7] border border-[#111827] rounded-lg text-[10px] font-mono font-bold text-gray-800 shadow-[1px_1px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 transition-colors disabled:opacity-50"
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Cache Toast notification */}
        {cacheToast && (
          <div className="mt-3 p-2.5 bg-emerald-100 border-2 border-[#111827] rounded-xl text-emerald-900 text-xs font-mono font-bold flex items-center space-x-2 animate-fade-in shadow-[2px_2px_0px_#111827]">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>{cacheToast}</span>
          </div>
        )}
      </div>

      {/* Verified Historical City Archives Switcher */}
      <div className="bg-[#FFFFFF] border-2 border-[#111827] rounded-2xl p-3 sm:p-4 shadow-[3px_3px_0px_#111827]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-black text-[#111827] flex items-center space-x-1.5">
            <span>🌍</span>
            <span>HISTORICAL CITY ARCHIVES (100% OFFLINE LORE):</span>
          </span>
          <span className="text-[10px] font-mono font-bold text-gray-500 uppercase">
            {COMIC_CITIES.length} Grounded Historical Cities
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {COMIC_CITIES.map((c) => {
            const isSelected = selectedCity.toLowerCase() === c.name.toLowerCase() && !aiCustomStory;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectCity(c.name)}
                className={`px-3 py-2 rounded-xl border-2 border-[#111827] text-xs font-mono font-black flex items-center space-x-1.5 whitespace-nowrap transition-all flex-shrink-0 ${
                  isSelected
                    ? 'bg-[#1B3FFF] text-white shadow-[2.5px_2.5px_0px_#111827] -translate-y-0.5'
                    : 'bg-[#FDFBF7] text-gray-800 hover:bg-gray-100 shadow-[1px_1px_0px_#111827]'
                }`}
              >
                <span className="text-sm">{c.flag}</span>
                <span>{c.name}</span>
                <span className="text-[10px] opacity-75 font-normal">({c.landmark.split('&')[0].trim()})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Control Dials: Tone Dial & Era Layer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 4-Way Tone Dial */}
        <div className="bg-[#FFFFFF] border-2 border-[#111827] rounded-2xl p-3 sm:p-4 shadow-[3px_3px_0px_#111827]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-black text-[#111827] flex items-center space-x-1">
              <span>🎭</span>
              <span>COMIC TONE DIAL:</span>
            </span>
            <span className="text-[11px] font-mono text-gray-500 font-bold uppercase">
              {tones.find(t => t.id === tone)?.desc}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => handleToneChange(t.id)}
                className={`py-2 px-2 rounded-xl border-2 border-[#111827] text-xs font-mono font-black flex items-center justify-center space-x-1 transition-all ${
                  tone === t.id
                    ? 'bg-[#1B3FFF] text-white shadow-[2px_2px_0px_#111827] -translate-y-0.5'
                    : 'bg-[#FDFBF7] text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{t.icon}</span>
                <span className="truncate">{t.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Era Layers Slider / Selector */}
        <div className="bg-[#FFFFFF] border-2 border-[#111827] rounded-2xl p-3 sm:p-4 shadow-[3px_3px_0px_#111827]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-black text-[#111827] flex items-center space-x-1">
              <History className="w-3.5 h-3.5 text-[#111827]" />
              <span>ERA TIME MACHINE:</span>
            </span>
            <span className="text-[11px] font-mono text-[#FF5722] font-black uppercase">
              {eras.find(e => e.id === era)?.label}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {eras.map((e) => (
              <button
                key={e.id}
                onClick={() => handleEraChange(e.id)}
                className={`py-2 px-2 rounded-xl border-2 border-[#111827] text-xs font-mono font-black flex flex-col items-center justify-center transition-all ${
                  era === e.id
                    ? 'bg-[#FF5722] text-white shadow-[2px_2px_0px_#111827] -translate-y-0.5'
                    : 'bg-[#FDFBF7] text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span>{e.year}</span>
                <span className="text-[9px] font-bold opacity-90 truncate max-w-full">
                  {e.label}
                </span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* The Responsive Comic Strip Panels */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold text-gray-600 uppercase flex items-center space-x-1.5">
            <span>3-PANEL GRAPHIC NOVEL STRIP • {activeStory.panels.length} PANELS</span>
            {isPlayingAudio && (
              <span className="text-emerald-600 font-black animate-pulse">
                • [NARRATING PANEL {activePanelIndex + 1}]
              </span>
            )}
          </span>
          <span className="text-[11px] font-mono text-[#1B3FFF] font-bold">
            100% OFFLINE SPEECH READY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeStory.panels.map((panel, idx) => (
            <ComicPanelItem 
              key={panel.panelNumber} 
              panel={panel} 
              isActive={isPlayingAudio && activePanelIndex === idx}
            />
          ))}
        </div>
      </div>

      {/* Citations & Historical Archive Footer */}
      <div className="bg-[#FDFBF7] border-2 border-[#111827] rounded-xl p-3 shadow-[2px_2px_0px_#111827] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-gray-700" />
          <span className="text-[11px] font-mono font-bold text-gray-800">
            Historical Sources Grounding:
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {activeStory.sources.map((src, i) => (
            <span 
              key={i} 
              className="px-2 py-0.5 bg-white border border-[#111827] rounded text-[10px] font-mono font-medium text-gray-700 shadow-[1.5px_1.5px_0px_#111827]"
            >
              📜 {src}
            </span>
          ))}
        </div>
      </div>

    </div>
  );
};
