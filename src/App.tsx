import React, { useState, useEffect } from 'react';
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

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('planner');
  const [gameScore, setGameScore] = useState<number>(0);
  const [pearlsCollected, setPearlsCollected] = useState<number>(0);
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

  const handleScoreUpdate = (score: number, pearls: number) => {
    setGameScore(score);
    setPearlsCollected(pearls);
  };

  const handleTeleportDemo = () => {
    // Quick toggle between planner and game for stage presentations
    if (activeTab === 'planner') {
      setActiveTab('game');
    } else if (activeTab === 'game') {
      setActiveTab('comic');
    } else if (activeTab === 'comic') {
      setActiveTab('myths');
    } else {
      setActiveTab('planner');
    }
  };

  const handleOpenMythsForCity = (city: string) => {
    setCurrentCity(city);
    setActiveTab('myths');
  };

  const handleOpenComicForCity = (city: string) => {
    setCurrentCity(city);
    setActiveTab('comic');
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
        onTeleportDemo={handleTeleportDemo}
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
            onNavigateToPass={() => setActiveTab('pass')}
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
            onNavigateToPass={() => setActiveTab('pass')}
          />
        )}
        {activeTab === 'pass' && (
          <BoardingPass 
            gameScore={gameScore} 
            pearlsCollected={pearlsCollected} 
            itineraryScore={94} 
          />
        )}
      </main>

      {/* Persistent Bottom Mobile Dock */}
      <BottomDock
        activeTab={activeTab}
        onTabChange={setActiveTab}
        gameScore={gameScore}
      />

      {/* Welcome & PWA Install Onboarding Modal */}
      <WelcomeOnboardingModal
        isOpen={showWelcome}
        onClose={handleCloseWelcome}
        deferredPrompt={deferredInstallPrompt}
      />

      {/* Supersonic Comic Airplane Easter Egg (Phone Shake & Header Trigger) */}
      <AirplaneEasterEgg />

      {/* AI Key & Deterministic Mode Configuration Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />

    </div>
  );
};

export default App;
