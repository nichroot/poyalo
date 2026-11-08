import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Header } from './components/layout/Header';
import { BottomDock, ActiveTab } from './components/layout/BottomDock';
import { ItineraryPlanner } from './components/planner/ItineraryPlanner';
import { ComicStoryBox } from './components/comic/ComicStoryBox';
import { VGWorldGame } from './components/game/VGWorldGame';
import { EntryCheckView } from './components/planner/EntryCheckView';
import { BoardingPass } from './components/pass/BoardingPass';
import { MythPointerView } from './components/myth/MythPointerView';
import { WelcomeOnboardingModal } from './components/onboarding/WelcomeOnboardingModal';
import { AirplaneEasterEgg } from './components/common/AirplaneEasterEgg';
import { ApiKeyModal } from './components/common/ApiKeyModal';

const tabToHash: Record<ActiveTab, string> = {
  planner: 'planner',
  comic: 'comic',
  myths: 'myths',
  game: 'explore',
  entry: 'entry',
  pass: 'pass'
};

const hashToTab = (hash: string): ActiveTab | null => {
  const clean = hash.replace(/^#/, '').toLowerCase();
  if (clean === 'explore' || clean === 'game') return 'game';
  if (clean === 'comic') return 'comic';
  if (clean === 'myths') return 'myths';
  if (clean === 'entry') return 'entry';
  if (clean === 'pass') return 'pass';
  if (clean === 'planner') return 'planner';
  return null;
};

const tabTitles: Record<ActiveTab, string> = {
  planner: 'POYALO (പോയാലോ?) — AI Travel Itinerary Planner, 3D UAE Exploration & Comic Lore',
  game: 'POYALO (പോയാലോ?) — 3D UAE Heritage Exploration (Al Qasba, Dubai Creek & Museum of the Future)',
  comic: 'POYALO (പോയാലോ?) — AI Comic Story Studio & Travel Lore',
  myths: 'POYALO (പോയാലോ?) — Travel Myth Buster & Etiquette Pointer',
  entry: 'POYALO (പോയാലോ?) — 180-Day Passport Expiry & UAE Visa Rules Checker',
  pass: 'POYALO (പോയാലോ?) — Travel Explorer Achievement Pass & Boarding Stub'
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    if (typeof window !== 'undefined') {
      const parsed = hashToTab(window.location.hash);
      if (parsed) return parsed;
    }
    return 'planner';
  });
  const [gameScore, setGameScore] = useState<number>(0);
  const [pearlsCollected, setPearlsCollected] = useState<number>(0);
  const [itineraryScore, setItineraryScore] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('poyalo_itinerary_score');
      return saved ? Number(saved) : 94;
    } catch {
      return 94;
    }
  });
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [currentCity, setCurrentCity] = useState<string>('');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);

  // PWA install prompt & first-time onboarding modal
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<any | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(() => {
    try {
      return localStorage.getItem('poyalo_welcome_dismissed') !== 'true';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent mini-infobar on mobile and stash the event
      e.preventDefault();
      setDeferredInstallPrompt(e);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleTabChange = React.useCallback((newTab: ActiveTab) => {
    setActiveTab(newTab);
    if (typeof window !== 'undefined') {
      const targetHash = `#${tabToHash[newTab]}`;
      if (window.location.hash !== targetHash) {
        window.history.pushState(null, '', targetHash);
      }
      document.title = tabTitles[newTab];
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const parsed = hashToTab(window.location.hash);
      if (parsed) {
        setActiveTab(parsed);
        document.title = tabTitles[parsed];
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleScoreUpdate = React.useCallback((score: number, pearls: number) => {
    setGameScore(score);
    setPearlsCollected(pearls);
  }, []);

  const handleOpenMythsForCity = (city: string) => {
    setCurrentCity(city);
    handleTabChange('myths');
  };

  const handleOpenComicForCity = (city: string) => {
    setCurrentCity(city);
    handleTabChange('comic');
  };

  const handleCloseWelcome = () => {
    setShowWelcome(false);
    try {
      localStorage.setItem('poyalo_welcome_dismissed', 'true');
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#111827] flex flex-col font-display">
      
      {/* Neo-Brutalist Top Header */}
      <Header
        isOffline={isOffline}
        onOpenInstallGuide={() => setShowWelcome(true)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        activeCity={currentCity}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-5">
        {activeTab === 'planner' && (
          <ItineraryPlanner 
            activeCity={currentCity}
            onOpenMyths={handleOpenMythsForCity} 
            onOpenComic={handleOpenComicForCity}
            onNavigateToPass={() => handleTabChange('pass')}
            onNavigateToEntry={() => handleTabChange('entry')}
            onScoreUpdate={setItineraryScore}
          />
        )}
        {activeTab === 'comic' && (
          <ComicStoryBox 
            key={currentCity}
            initialCity={currentCity}
          />
        )}
        {activeTab === 'myths' && (
          <MythPointerView 
            key={currentCity}
            initialCity={currentCity}
            onSelectCity={setCurrentCity}
          />
        )}
        {activeTab === 'game' && <VGWorldGame onScoreUpdate={handleScoreUpdate} />}
        {activeTab === 'entry' && (
          <EntryCheckView 
            onNavigateToPass={() => handleTabChange('pass')}
          />
        )}
        {activeTab === 'pass' && (
          <BoardingPass 
            gameScore={gameScore} 
            pearlsCollected={pearlsCollected} 
            itineraryScore={itineraryScore} 
          />
        )}
      </main>

      {/* Creator Attribution Section */}
      {activeTab !== 'game' && (
        <footer className="w-full text-center py-3 pb-24 sm:pb-28 text-xs font-mono text-gray-500 select-none">
          made with <span className="text-red-500 font-bold">♥</span> by{' '}
          <a
            href="https://www.instagram.com/nichroot/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-black text-[#111827] hover:text-[#1B3FFF] underline decoration-2 decoration-[#1B3FFF] hover:decoration-amber-400 transition-colors"
          >
            nichroot
          </a>{' '}
          and{' '}
          <a
            href="https://www.instagram.com/m_farshi__"
            target="_blank"
            rel="noopener noreferrer"
            className="font-black text-[#111827] hover:text-[#1B3FFF] underline decoration-2 decoration-[#1B3FFF] hover:decoration-amber-400 transition-colors"
          >
            farshi
          </a>
        </footer>
      )}

      {/* Persistent Bottom Mobile Dock */}
      <BottomDock
        activeTab={activeTab}
        onTabChange={handleTabChange}
        gameScore={gameScore}
      />

      {/* Welcome & PWA Install Onboarding Modal */}
      <WelcomeOnboardingModal
        isOpen={showWelcome}
        onClose={handleCloseWelcome}
        deferredPrompt={deferredInstallPrompt}
      />

      {/* Supersonic Comic Airplane Easter Egg (Phone Shake & Header Trigger, disabled during game) */}
      <AirplaneEasterEgg disabled={activeTab === 'game'} />

      {/* AI Key & Deterministic Mode Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

      {/* Vercel Web Analytics */}
      <Analytics />

    </div>
  );
};

export default App;
