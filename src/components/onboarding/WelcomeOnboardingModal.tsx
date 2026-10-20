import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  Share, 
  PlusSquare, 
  CheckCircle2, 
  X, 
  Compass, 
  Flame, 
  ShieldCheck, 
  Gamepad2, 
  HelpCircle,
  Smartphone,
  Globe2
} from 'lucide-react';

interface WelcomeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any | null;
  onInstallApp?: () => void;
}

export const WelcomeOnboardingModal: React.FC<WelcomeOnboardingModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onInstallApp
}) => {
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [installSuccess, setInstallSuccess] = useState<boolean>(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isInStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as any).standalone === true;
    setIsStandalone(isInStandalone);

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) || 
      (navigator.maxTouchPoints > 1 && /macintosh/.test(userAgent));
    setIsIOS(isIOSDevice);
  }, []);

  if (!isOpen) return null;

  const handleNativeInstall = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setInstallSuccess(true);
        }
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (onInstallApp) {
      onInstallApp();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-[#FDFBF7] border-[3px] border-[#111827] rounded-3xl shadow-[8px_8px_0px_#111827] overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Comic Header Banner */}
        <div className="bg-[#1B3FFF] text-white p-4 sm:p-5 border-b-[2.5px] border-[#111827] relative">
          <button
            onClick={onClose}
            className="absolute right-3.5 top-3.5 p-1.5 bg-white text-[#111827] hover:bg-amber-100 border-2 border-[#111827] rounded-full shadow-[2px_2px_0px_#111827] active:scale-90 transition-transform"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="bg-[#FBBF24] text-[#111827] px-2 py-0.5 rounded font-mono font-black text-[11px] uppercase border border-[#111827]">
              FIRST TIME TRAVELER GUIDE
            </span>
            <span className="bg-[#FF5722] text-white px-2 py-0.5 rounded font-mono font-black text-[11px] uppercase border border-[#111827]">
              PWA OFFLINE-READY
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight flex items-center space-x-2">
            <span>WELCOME TO POYALO!</span>
            <span className="text-amber-300 text-lg sm:text-xl font-bold font-mono">
              (പോയാലോ?)
            </span>
          </h2>
          <p className="text-xs sm:text-sm font-mono text-blue-100 mt-1 max-w-md">
            Malayalam for <em>"Shall we go?!"</em> — Your story-first companion turning worldwide travel into a graphic adventure.
          </p>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* PWA INSTALL CALLOUT (HERO CARD) */}
          <div className="bg-[#FEF3C7] border-[2.5px] border-[#111827] rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_#111827] space-y-3">
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-[#FF5722]" />
              <h3 className="font-display font-black text-base text-[#111827] tracking-tight">
                ADD TO YOUR HOME SCREEN (PWA)
              </h3>
            </div>
            
            <p className="text-xs font-mono text-gray-800 leading-relaxed">
              Install POYALO as a lightweight app on your phone. It runs <strong>100% offline in Airplane Mode</strong> with no app store download required!
            </p>

            {isStandalone ? (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-800 rounded-xl flex items-center space-x-2 text-emerald-950 font-mono text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>You are already using POYALO in Standalone App Mode! 🎉</span>
              </div>
            ) : installSuccess ? (
              <div className="p-3 bg-emerald-100 border-2 border-emerald-800 rounded-xl flex items-center space-x-2 text-emerald-950 font-mono text-xs font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                <span>Installation accepted! Look for the POYALO icon on your home screen.</span>
              </div>
            ) : deferredPrompt ? (
              /* Native 1-Click Install Button (Chrome / Android / Desktop) */
              <button
                onClick={handleNativeInstall}
                className="w-full py-3 px-4 bg-[#FF5722] hover:bg-[#E64A19] text-white border-2 border-[#111827] rounded-xl font-display font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_#111827] flex items-center justify-center space-x-2 active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[48px]"
              >
                <Download className="w-4 h-4 stroke-[3]" />
                <span>📲 INSTALL POYALO ON YOUR HOME SCREEN</span>
              </button>
            ) : isIOS ? (
              /* iOS Safari Instructions */
              <div className="bg-white border-2 border-[#111827] rounded-xl p-3.5 space-y-2 text-xs font-mono">
                <div className="font-black text-[#111827] flex items-center space-x-1.5 text-xs uppercase">
                  <span>🍎 HOW TO INSTALL ON IPHONE / IPAD:</span>
                </div>
                <div className="space-y-1.5 text-gray-700 text-[11px]">
                  <div className="flex items-start space-x-2">
                    <span className="bg-[#1B3FFF] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5">1</span>
                    <span>Tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline mx-0.5 text-[#1B3FFF]" /> in Safari’s bottom toolbar.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-[#1B3FFF] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5">2</span>
                    <span>Scroll down and tap <strong>"Add to Home Screen"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-[#FF5722]" />.</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="bg-[#1B3FFF] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] flex-shrink-0 mt-0.5">3</span>
                    <span>Tap <strong>Add</strong> at top right. POYALO will launch in fullscreen like a native app!</span>
                  </div>
                </div>
              </div>
            ) : (
              /* General Android / Desktop Instructions */
              <div className="bg-white border-2 border-[#111827] rounded-xl p-3.5 space-y-1.5 text-xs font-mono">
                <span className="font-black text-[#111827] block uppercase">
                  ⚡ BROWSER INSTALLATION:
                </span>
                <p className="text-[11px] text-gray-700">
                  Tap your browser menu (<strong>⋮</strong> or <strong>Share</strong>) and select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                </p>
              </div>
            )}
          </div>

          {/* 4 CORE APP PILLARS */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-mono font-black text-gray-500 uppercase tracking-wider block">
              WHAT YOU CAN DO WITH POYALO:
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              
              <div className="p-3 bg-white border-2 border-[#111827] rounded-xl shadow-[2px_2px_0px_#111827] space-y-1">
                <div className="flex items-center space-x-1.5 font-display font-black text-xs text-[#1B3FFF]">
                  <Compass className="w-4 h-4" />
                  <span>AI TRIP REALITY CHECK</span>
                </div>
                <p className="text-[11px] font-mono text-gray-600">
                  Plans your day, audits travel physics, flags impossible transit, and auto-repairs chaotic schedules.
                </p>
              </div>

              <div className="p-3 bg-white border-2 border-[#111827] rounded-xl shadow-[2px_2px_0px_#111827] space-y-1">
                <div className="flex items-center space-x-1.5 font-display font-black text-xs text-[#FF5722]">
                  <Flame className="w-4 h-4" />
                  <span>COMIC LORE & ROASTS</span>
                </div>
                <p className="text-[11px] font-mono text-gray-600">
                  Turns historical city landmarks into graphic comic strips with speech bubbles and satirical commentary.
                </p>
              </div>

              <div className="p-3 bg-white border-2 border-[#111827] rounded-xl shadow-[2px_2px_0px_#111827] space-y-1">
                <div className="flex items-center space-x-1.5 font-display font-black text-xs text-[#10B981]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>VISA GUY TRAVEL MATCHER</span>
                </div>
                <p className="text-[11px] font-mono text-gray-600">
                  Evaluates the 180-day passport rule, matches easy destinations, and rates your visa stress level.
                </p>
              </div>

              <div className="p-3 bg-white border-2 border-[#111827] rounded-xl shadow-[2px_2px_0px_#111827] space-y-1">
                <div className="flex items-center space-x-1.5 font-display font-black text-xs text-[#9333EA]">
                  <HelpCircle className="w-4 h-4" />
                  <span>MYTH POINTER & 3D WORLD</span>
                </div>
                <p className="text-[11px] font-mono text-gray-600">
                  Debunks local stereotypes and tourist traps worldwide, plus lets you explore 3D heritage landmarks.
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Modal Bottom Sticky Dismiss Action */}
        <div className="p-4 bg-white border-t-[2.5px] border-[#111827] flex items-center justify-between gap-3">
          <div className="text-[11px] font-mono text-gray-500 hidden sm:block">
            made with <span className="text-red-500 font-bold">♥</span> by{' '}
            <a
              href="https://www.instagram.com/nichroot/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#111827] hover:text-[#1B3FFF] underline"
            >
              nichroot
            </a>{' '}
            and{' '}
            <a
              href="https://www.instagram.com/m_farshi__"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#111827] hover:text-[#1B3FFF] underline"
            >
              farshi
            </a>
          </div>
          <button
            onClick={onClose}
            className="flex-1 sm:flex-initial px-6 py-3 bg-[#111827] hover:bg-gray-800 text-white border-2 border-[#111827] rounded-xl font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#FF5722] active:translate-x-0.5 active:translate-y-0.5 transition-all text-center min-h-[48px]"
          >
            LET'S EXPLORE THE WORLD ➔
          </button>
        </div>

      </div>
    </div>
  );
};
