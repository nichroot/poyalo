import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  ArrowRight, 
  RotateCcw, 
  Calendar, 
  Send, 
  HelpCircle, 
  MapPin, 
  Compass, 
  Plus, 
  Clock, 
  Layers, 
  Check, 
  ShieldCheck, 
  BookOpen 
} from 'lucide-react';
import { ItineraryStop, ItineraryDay } from '../../types/itinerary';
import { generateAIPlan, generateDeterministicPlan } from '../../services/aiService';
import { auditItinerary } from '../../engines/realityCheckEngine';
import { StopCard } from './StopCard';

interface ItineraryPlannerProps {
  onOpenMyths?: (city: string) => void;
  onOpenComic?: (city: string) => void;
  onNavigateToPass?: () => void;
  onNavigateToEntry?: () => void;
  onScoreUpdate?: (score: number) => void;
  activeCity?: string;
}

const INSPIRATION_CHIPS = [
  { label: '🗼 3 Days in Tokyo', prompt: '3 days cultural and modern exploration of Tokyo with food markets' },
  { label: '🥐 Weekend in Paris (2 Days)', prompt: '2 days historic walking tour of Paris art, cafes, and Eiffel views' },
  { label: '🏛️ 3 Days in Rome', prompt: '3 days exploring Ancient Rome, Vatican City, and Trastevere food' },
  { label: '🍜 2 Days in Bangkok', prompt: '2 days historic temples, river cruise, and night markets in Bangkok' },
  { label: '🇬🇧 2 Days in London', prompt: '2 days London royal landmarks, museums, and West End' },
  { label: '🌴 3 Days in Dubai', prompt: '3 days Dubai heritage creek, modern downtown spires, and desert sunset' }
];

export const ItineraryPlanner: React.FC<ItineraryPlannerProps> = ({
  onOpenMyths,
  onOpenComic,
  onNavigateToPass,
  onNavigateToEntry,
  onScoreUpdate,
  activeCity = ''
}) => {
  const [days, setDays] = useState<ItineraryDay[]>([]);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [planToast, setPlanToast] = useState<string | null>(null);
  const [currentCity, setCurrentCity] = useState<string>(activeCity || '');
  const [tripTheme, setTripTheme] = useState<string>('');
  const [countryName, setCountryName] = useState<string>('Worldwide');

  // Currently displayed day
  const activeDay = days[activeDayIndex] || days[0] || null;
  const currentStops = activeDay ? activeDay.stops : [];
  const totalStopsCount = days.reduce((acc, d) => acc + (d.stops?.length || 0), 0);

  // Deterministic Reality Check Audit Engine (Runs locally in client TypeScript)
  const auditResult = useMemo(() => {
    return auditItinerary(currentStops);
  }, [currentStops]);

  useEffect(() => {
    if (auditResult && typeof auditResult.score === 'number') {
      try {
        localStorage.setItem('poyalo_itinerary_score', String(auditResult.score));
      } catch {}
      onScoreUpdate?.(auditResult.score);
    }
  }, [auditResult.score, onScoreUpdate]);

  const handleGenerateFromPrompt = async (e?: React.FormEvent, customPrompt?: string) => {
    if (e && e.preventDefault) e.preventDefault();
    const promptToUse = customPrompt || userPrompt;
    if (!promptToUse.trim()) return;

    setIsGenerating(true);
    setPlanToast('🤖 POYALO AI analyzing destination & drafting multi-day itinerary...');

    try {
      const plan = await generateAIPlan(promptToUse);
      if (plan && plan.days && plan.days.length > 0) {
        setDays(plan.days);
        setActiveDayIndex(0);
        const cityClean = plan.city || plan.cityName || 'Custom Destination';
        setCurrentCity(cityClean);
        setCountryName(plan.country || 'Worldwide');
        setTripTheme(plan.theme || `${cityClean} Exploration Trail`);
        
        const totalDays = plan.days.length;
        setPlanToast(`✨ Generated ${totalDays}-day plan with ${totalStopsCount || plan.stops.length} stops for ${cityClean}!`);
        setUserPrompt('');
        try {
          confetti({ particleCount: 45, spread: 55, origin: { y: 0.6 } });
        } catch {}
      } else {
        throw new Error('No days returned');
      }
    } catch (err: any) {
      console.warn('AI generation notice, using deterministic engine:', err);
      const fallbackPlan = generateDeterministicPlan(promptToUse);
      if (fallbackPlan && fallbackPlan.days && fallbackPlan.days.length > 0) {
        setDays(fallbackPlan.days);
        setActiveDayIndex(0);
        const cityClean = fallbackPlan.city || fallbackPlan.cityName || 'Destination';
        setCurrentCity(cityClean);
        setCountryName(fallbackPlan.country || 'Worldwide');
        setTripTheme(fallbackPlan.theme || `${cityClean} Exploration Trail`);
        setPlanToast(`✨ Created curated ${fallbackPlan.days.length}-day plan for ${cityClean}!`);
        setUserPrompt('');
      }
    } finally {
      setIsGenerating(false);
      setTimeout(() => setPlanToast(null), 4000);
    }
  };

  const handleResetTrip = () => {
    setDays([]);
    setActiveDayIndex(0);
    setTripTheme('');
  };

  const handleAddDay = () => {
    const newDayNum = days.length + 1;
    const newDay: ItineraryDay = {
      dayNumber: newDayNum,
      theme: `Day ${newDayNum} Hidden Treasures`,
      stops: [
        {
          id: `stop-${Date.now()}-new`,
          poiId: `poi-new-${Date.now()}`,
          name: `${currentCity} Neighborhood Exploration`,
          category: 'heritage',
          startTime: '10:00',
          endTime: '12:00',
          durationMinutes: 120,
          lat: 35.6895,
          lng: 139.6917,
          isOutdoor: true,
          notes: 'Wander off-the-beaten-path streets and local cafes'
        },
        {
          id: `stop-${Date.now()}-new-2`,
          poiId: `poi-new-${Date.now()}-2`,
          name: `${currentCity} Sunset Pier & Lookout`,
          category: 'viewpoint',
          startTime: '17:30',
          endTime: '19:00',
          durationMinutes: 90,
          lat: 35.6895,
          lng: 139.6917,
          isOutdoor: true,
          idealForSunset: true,
          notes: 'Golden hour scenic viewpoint'
        }
      ]
    };
    setDays([...days, newDay]);
    setActiveDayIndex(days.length); // Switch to newly created day
    setPlanToast(`✨ Added Day ${newDayNum} to your itinerary!`);
    setTimeout(() => setPlanToast(null), 3000);
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto">
      
      {/* Search & AI Generator Hero Card */}
      <div className="bg-[#FFFFFF] border-[2.5px] border-[#111827] rounded-2xl p-4 sm:p-6 shadow-[4px_4px_0px_#111827] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="bg-[#1B3FFF] text-white px-2.5 py-0.5 rounded font-mono font-black text-xs uppercase border border-[#111827]">
                POYALO • MULTI-DAY TRIP GENERATOR
              </span>
              <span className="text-xs font-mono font-bold text-gray-500">
                Powered by POYALO AI
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black text-[#111827] mt-1 tracking-tight">
              Where Are You Traveling?
            </h1>
            <p className="text-xs sm:text-sm font-mono text-gray-700 mt-1 max-w-2xl">
              Enter any worldwide trip (e.g. "3 days in Tokyo", "weekend in Paris", "4 days in Rome"). We generate 
              multi-day sequenced schedules with transit timing, sunset viewpoints, and local myth checks.
            </p>
          </div>

          {days.length > 0 && (
            <button
              onClick={handleResetTrip}
              className="self-start sm:self-center px-3 py-1.5 bg-[#FDFBF7] hover:bg-gray-100 border-2 border-[#111827] rounded-xl text-xs font-mono font-black shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
              <span>PLAN ANOTHER DESTINATION</span>
            </button>
          )}
        </div>

        {/* Smart Prompt Input Bar */}
        <form onSubmit={handleGenerateFromPrompt} className="mt-4 flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ask for ANY trip worldwide (e.g. '3 days in Tokyo', 'Weekend in Paris', '4 days in Rome')..."
              className="w-full pl-10 pr-3.5 py-3 bg-[#FDFBF7] border-2 border-[#111827] rounded-xl font-mono text-xs font-bold text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#1B3FFF] shadow-inner"
            />
          </div>
          <button
            type="submit"
            disabled={isGenerating || !userPrompt.trim()}
            className="px-5 py-3 bg-[#1B3FFF] hover:bg-[#1532CC] text-white border-2 border-[#111827] rounded-xl font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 flex items-center justify-center space-x-2 disabled:opacity-50 min-h-[46px]"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>GENERATING ITINERARY...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>GENERATE ITINERARY</span>
              </>
            )}
          </button>
        </form>

        {/* Worldwide Inspiration Chips */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono font-black text-gray-500 uppercase mr-1">
            POPULAR INSPIRATION:
          </span>
          {INSPIRATION_CHIPS.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => handleGenerateFromPrompt(undefined, chip.prompt)}
              disabled={isGenerating}
              className="px-2.5 py-1 bg-[#FDFBF7] hover:bg-amber-100 border border-[#111827] rounded-lg text-[10px] font-mono font-bold text-gray-800 shadow-[1px_1px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 transition-colors disabled:opacity-50"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {planToast && (
          <div className="mt-3 p-2.5 bg-emerald-100 border-2 border-[#111827] rounded-xl text-emerald-900 text-xs font-mono font-bold flex items-center space-x-2 shadow-[2px_2px_0px_#111827] animate-fade-in">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>{planToast}</span>
          </div>
        )}
      </div>

      {/* STATE A: NO TRIPS YET (WELCOME HERO STATE) */}
      {days.length === 0 && !isGenerating && (
        <div className="bg-white border-[2.5px] border-[#111827] rounded-2xl p-8 text-center space-y-4 shadow-[4px_4px_0px_#111827]">
          <div className="w-16 h-16 mx-auto bg-[#FEF3C7] border-2 border-[#111827] rounded-2xl flex items-center justify-center text-3xl shadow-[3px_3px_0px_#111827]">
            ✈️
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-xl font-display font-black text-[#111827]">
              Start Your Graphic Travel Journey
            </h3>
            <p className="text-xs font-mono text-gray-600 leading-relaxed">
              Type any destination above or tap one of the inspiration cities (Tokyo, Paris, Rome, Bangkok) 
              to generate a multi-day plan with real coordinates, sunset timings, and local myth checks.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 max-w-2xl mx-auto text-left">
            <div className="p-3 bg-[#FDFBF7] border border-gray-300 rounded-xl">
              <span className="text-xs font-display font-black text-[#1B3FFF] block">⏱️ TRANSIT AWARE</span>
              <p className="text-[10px] font-mono text-gray-600 mt-0.5">Calculates realistic travel buffer between attractions.</p>
            </div>
            <div className="p-3 bg-[#FDFBF7] border border-gray-300 rounded-xl">
              <span className="text-xs font-display font-black text-[#FF5722] block">🌅 GOLDEN HOUR</span>
              <p className="text-[10px] font-mono text-gray-600 mt-0.5">Pins scenic viewpoints to authentic sunset timing.</p>
            </div>
            <div className="p-3 bg-[#FDFBF7] border border-gray-300 rounded-xl">
              <span className="text-xs font-display font-black text-[#9333EA] block">🔮 MYTH POINTER</span>
              <p className="text-[10px] font-mono text-gray-600 mt-0.5">Debunks local stereotypes & etiquette customs.</p>
            </div>
            <div className="p-3 bg-[#FDFBF7] border border-gray-300 rounded-xl">
              <span className="text-xs font-display font-black text-[#FF5722] block">📖 COMIC LORE</span>
              <p className="text-[10px] font-mono text-gray-600 mt-0.5">Illustrated graphic novel adventures across history.</p>
            </div>
          </div>
        </div>
      )}

      {/* STATE B: MULTI-DAY ITINERARY GENERATED */}
      {days.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-500">
          
          {/* Trip Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
            <div>
              <span className="text-[10px] font-mono font-black text-gray-500 uppercase tracking-widest block">
                ACTIVE GENERATED TRIP • {days.length} DAYS TOTAL
              </span>
              <h2 className="font-display font-black text-2xl text-[#111827] flex items-center space-x-2">
                <span>🗺️</span>
                <span>{tripTheme.toUpperCase()}</span>
              </h2>
            </div>
            <span className="text-xs font-mono font-black bg-[#FBBF24] text-[#111827] px-3 py-1.5 rounded-lg border border-[#111827] shadow-[2px_2px_0px_#111827] self-start sm:self-center">
              {totalStopsCount} TOTAL STOPS • {currentCity.toUpperCase()}, {countryName.toUpperCase()}
            </span>
          </div>

          {/* Neo-Brutalist Multi-Day Tab Switcher */}
          <div className="bg-[#FFFFFF] border-2 border-[#111827] rounded-2xl p-2.5 shadow-[3px_3px_0px_#111827]">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-mono font-black text-[#111827] flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-[#1B3FFF]" />
                <span>SELECT TRIP DAY:</span>
              </span>
              <span className="text-[10px] font-mono text-gray-500 font-bold">
                Viewing Day {activeDayIndex + 1} of {days.length}
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {days.map((day, idx) => {
                const isSelected = activeDayIndex === idx;
                return (
                  <button
                    key={day.dayNumber || idx}
                    onClick={() => setActiveDayIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl border-2 border-[#111827] font-mono font-black text-xs uppercase flex items-center space-x-1.5 transition-all whitespace-nowrap min-h-[40px] ${
                      isSelected
                        ? 'bg-[#1B3FFF] text-white shadow-[3px_3px_0px_#111827] -translate-y-0.5'
                        : 'bg-[#FDFBF7] text-gray-700 hover:bg-gray-100 shadow-[1.5px_1.5px_0px_#111827]'
                    }`}
                  >
                    <span>📅</span>
                    <span>DAY 0{day.dayNumber || idx + 1}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      isSelected 
                        ? 'bg-white text-[#1B3FFF] border-[#111827]' 
                        : 'bg-gray-200 text-gray-800 border-gray-400'
                    }`}>
                      {day.stops?.length || 0} stops
                    </span>
                  </button>
                );
              })}

              {/* Add Extra Day Button */}
              <button
                onClick={handleAddDay}
                className="px-3.5 py-2 rounded-xl border-2 border-dashed border-[#111827] font-mono font-black text-xs bg-[#FEF3C7] hover:bg-amber-200 text-[#111827] flex items-center space-x-1 whitespace-nowrap active:translate-x-0.5 shadow-[1.5px_1.5px_0px_#111827] min-h-[40px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD DAY {days.length + 1}</span>
              </button>
            </div>
          </div>

          {/* Active Day Theme Sub-banner with Reality Check Audit Score */}
          {activeDay && (
            <div className="bg-[#EFF6FF] border-2 border-[#111827] rounded-xl p-3 shadow-[2px_2px_0px_#111827] flex items-center justify-between flex-wrap gap-2">
              <div>
                <span className="text-[10px] font-mono font-black text-[#1B3FFF] uppercase tracking-wider block">
                  DAY {activeDay.dayNumber} ITINERARY TRAIL
                </span>
                <h3 className="font-display font-black text-base text-[#111827]">
                  {activeDay.theme}
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-[10px] font-mono font-black px-2.5 py-1 rounded-lg border border-[#111827] ${
                  auditResult.status === 'approved' 
                    ? 'bg-emerald-100 text-emerald-900' 
                    : auditResult.status === 'caution'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-red-100 text-red-900'
                }`}>
                  ⚡ {auditResult.score}% REALITY AUDIT
                </span>
                <span className="text-xs font-mono font-bold text-gray-700 bg-white px-2.5 py-1 rounded-lg border border-[#111827]">
                  {currentStops.length} STOPS
                </span>
              </div>
            </div>
          )}

          {/* Comic Lore Hook Banner for this Destination */}
          <div className="bg-[#FF5722] text-white border-[2.5px] border-[#111827] rounded-xl p-4 shadow-[4px_4px_0px_#111827] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span className="font-mono font-black text-xs uppercase tracking-wide">
                  COMIC NOVEL LORE • {currentCity.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] font-mono text-orange-100">
                Immerse in illustrated graphic novel adventures, character humor, and secret history in {currentCity}.
              </p>
            </div>

            <button
              onClick={() => onOpenComic && onOpenComic(currentCity)}
              className="px-4 py-2.5 bg-white hover:bg-amber-100 text-[#111827] border-2 border-[#111827] rounded-xl font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#111827] flex items-center justify-center space-x-1.5 whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[42px]"
            >
              <span>📖 READ {currentCity.toUpperCase()} COMIC NOVEL</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Myth Pointer Hook Banner for this Destination */}
          <div className="bg-[#9333EA] text-white border-[2.5px] border-[#111827] rounded-xl p-4 shadow-[4px_4px_0px_#111827] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-amber-300" />
                <span className="font-mono font-black text-xs uppercase tracking-wide">
                  MYTH POINTER • {currentCity.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] font-mono text-purple-100">
                Check cultural taboos, dining misconceptions & tourist etiquette before you arrive in {currentCity}.
              </p>
            </div>

            <button
              onClick={() => onOpenMyths && onOpenMyths(currentCity)}
              className="px-4 py-2.5 bg-white hover:bg-amber-100 text-[#111827] border-2 border-[#111827] rounded-xl font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#111827] flex items-center justify-center space-x-1.5 whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[42px]"
            >
              <span>🔮 AUDIT MYTHS FOR {currentCity.toUpperCase()}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Passport Expiry & Visa Validation Link */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#F0FDF4] border-2 border-[#111827] rounded-xl p-3 shadow-[2.5px_2.5px_0px_#111827]">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="font-mono font-bold text-xs text-gray-800">
                180-Day Passport Rule & Visa Eligibility for {countryName}
              </span>
            </div>
            {onNavigateToEntry && (
              <button
                type="button"
                onClick={onNavigateToEntry}
                className="self-start sm:self-center px-3 py-1.5 bg-white hover:bg-emerald-100 text-[#111827] border-2 border-[#111827] rounded-lg text-xs font-mono font-black shadow-[1.5px_1.5px_0px_#111827] flex items-center space-x-1 active:translate-x-0.5 transition-colors"
              >
                <span>VERIFY ENTRY RULES</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Timeline Stop Cards for Active Day */}
          <div className="space-y-3 pt-1">
            {currentStops.map((stop, idx) => (
              <React.Fragment key={stop.id || idx}>
                <div className="transition-all duration-300 hover:-translate-y-0.5">
                  <StopCard
                    stop={stop}
                    index={idx}
                    flags={auditResult.flags}
                    goldenHourTime={auditResult.goldenHourTime}
                  />
                </div>

                {/* Transit indicator between stops */}
                {idx < currentStops.length - 1 && (
                  <div className="flex items-center justify-center my-1.5">
                    <div className="px-3 py-1 bg-white border-2 border-[#111827] rounded-full text-[10px] font-mono font-bold text-gray-700 shadow-[1.5px_1.5px_0px_#111827] flex items-center space-x-1.5">
                      <span>🚗 TRANSIT</span>
                      <ArrowRight className="w-3 h-3 text-[#FF5722]" />
                      <span>~20 MINS ESTIMATED TRANSIT</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
