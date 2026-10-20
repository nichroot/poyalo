import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Sparkles, 
  Check, 
  Share2, 
  Award, 
  Compass, 
  Edit3, 
  Save, 
  RotateCcw, 
  Printer, 
  Plane,
  User,
  Calendar,
  MapPin,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

interface BoardingPassProps {
  gameScore: number;
  pearlsCollected: number;
  itineraryScore?: number;
}

export interface PassportSyncInfo {
  nationality: string;
  destinationCountry: string;
  tripStartDate: string;
  passportExpiryDate: string;
  daysRemaining: number;
  isValid: boolean;
  visaStatus: string;
  syncedAt: string;
}

interface PassData {
  passengerName: string;
  originCode: string;
  originName: string;
  destCode: string;
  destName: string;
  trailName: string;
  seat: string;
  passClass: string;
  date: string;
  bookingRef: string;
  verificationStatus: string;
  passportSync?: PassportSyncInfo;
}

const DEFAULT_PASS_DATA: PassData = {
  passengerName: 'ALEX CHEN',
  originCode: 'DXB',
  originName: 'INTERNATIONAL DEPARTURE',
  destCode: 'WORLD',
  destName: 'GLOBAL DESTINATION',
  trailName: 'WORLDWIDE EXPLORER TRAIL',
  seat: '09F',
  passClass: 'EXPLORER CLASS',
  date: '16 OCT 2026',
  bookingRef: 'POY-2026-EXP',
  verificationStatus: 'PASSPORT 180-DAY VALID'
};

const PRESET_ROUTES = [
  {
    name: 'Dubai Heritage',
    originCode: 'DXB',
    originName: 'DUBAI INTERNATIONAL',
    destCode: 'CREEK',
    destName: 'AL FAHIDI DISTRICT',
    trailName: 'CREEK PEARL TRAIL',
    bookingRef: 'POY-DXB-772'
  },
  {
    name: 'Tokyo Neon & Temples',
    originCode: 'HND',
    originName: 'TOKYO HANEDA',
    destCode: 'SHIBUYA',
    destName: 'MEIJI & SHIBUYA',
    trailName: 'BLADE RUNNER TRAIL',
    bookingRef: 'POY-TYO-901'
  },
  {
    name: 'Paris Romance',
    originCode: 'CDG',
    originName: 'PARIS CHARLES DE GAULLE',
    destCode: 'LOUVRE',
    destName: 'MONTMARTRE & SEINE',
    trailName: 'BOHEMIAN TRAIL',
    bookingRef: 'POY-CDG-314'
  },
  {
    name: 'Rome Ancient Forum',
    originCode: 'FCO',
    originName: 'ROME FIUMICINO',
    destCode: 'FORUM',
    destName: 'COLOSSEUM & FORUM',
    trailName: 'GLADIATOR TRAIL',
    bookingRef: 'POY-FCO-505'
  },
  {
    name: 'Bangkok Street Food',
    originCode: 'BKK',
    originName: 'BANGKOK SUVARNABHUMI',
    destCode: 'OLD CITY',
    destName: 'WAT PHO & CHINATOWN',
    trailName: 'SPICE CANAL TRAIL',
    bookingRef: 'POY-BKK-888'
  }
];

export const BoardingPass: React.FC<BoardingPassProps> = ({
  gameScore = 0,
  pearlsCollected = 0,
  itineraryScore = 94
}) => {
  const [passData, setPassData] = useState<PassData>(() => {
    try {
      const saved = localStorage.getItem('poyalo_boarding_pass');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_PASS_DATA;
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Realtime listener for passport sync events
  useEffect(() => {
    const handlePassportSync = (e: any) => {
      if (e.detail) {
        setPassData(e.detail);
      } else {
        try {
          const saved = localStorage.getItem('poyalo_boarding_pass');
          if (saved) setPassData(JSON.parse(saved));
        } catch {}
      }
    };

    window.addEventListener('poyalo:passport-sync', handlePassportSync);
    window.addEventListener('storage', handlePassportSync);

    return () => {
      window.removeEventListener('poyalo:passport-sync', handlePassportSync);
      window.removeEventListener('storage', handlePassportSync);
    };
  }, []);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('poyalo_boarding_pass', JSON.stringify(passData));
    } catch {
      // ignore storage quota
    }
  }, [passData]);

  const handleApplyPreset = (preset: typeof PRESET_ROUTES[0]) => {
    setPassData(prev => ({
      ...prev,
      originCode: preset.originCode,
      originName: preset.originName,
      destCode: preset.destCode,
      destName: preset.destName,
      trailName: preset.trailName,
      bookingRef: preset.bookingRef
    }));
  };

  const handleResetDefaults = () => {
    setPassData(DEFAULT_PASS_DATA);
  };

  const handleSharePass = () => {
    const summary = 
      `🎫 POYALO BOARDING PASS\n` +
      `Passenger: ${passData.passengerName} (${passData.seat})\n` +
      `Route: ${passData.originCode} ➔ ${passData.destCode} (${passData.trailName})\n` +
      `Class: ${passData.passClass} | Date: ${passData.date}\n` +
      `Booking Ref: ${passData.bookingRef}\n` +
      `Verification: ${passData.verificationStatus}\n` +
      `Status: Confirmed • Zone 1 Priority\n` +
      `https://poyaloo.vercel.app`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      alert("Boarding Pass details copied!");
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-md mx-auto">
      
      {/* Header & Edit Mode Switch */}
      <div className="flex items-center justify-between">
        <div className="text-left space-y-0.5">
          <span className="bg-[#FFA07A] text-[#111827] px-2 py-0.5 rounded font-mono font-black text-[11px] uppercase border border-[#111827]">
            TRAVEL TOKEN • BOARDING PASS
          </span>
          <h1 className="text-2xl font-display font-black text-[#111827]">
            Digital Boarding Stub
          </h1>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-3 py-2 rounded-xl border-2 border-[#111827] font-mono text-xs font-black flex items-center space-x-1.5 transition-all shadow-[2px_2px_0px_#111827] active:translate-x-0.5 active:translate-y-0.5 ${
            isEditing 
              ? 'bg-[#10B981] text-white hover:bg-emerald-600' 
              : 'bg-white text-[#111827] hover:bg-gray-100'
          }`}
        >
          {isEditing ? (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>SAVE STUB</span>
            </>
          ) : (
            <>
              <Edit3 className="w-3.5 h-3.5 text-[#1B3FFF]" />
              <span>EDIT STUB</span>
            </>
          )}
        </button>
      </div>

      {/* Quick Route Preset Bar (Visible when editing) */}
      {isEditing && (
        <div className="bg-white border-2 border-[#111827] rounded-2xl p-3.5 shadow-[3px_3px_0px_#111827] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-black text-gray-500 uppercase">
              ⚡ QUICK ROUTE PRESETS:
            </span>
            <button
              onClick={handleResetDefaults}
              className="text-[10px] font-mono text-red-600 hover:underline flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Defaults</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_ROUTES.map(preset => (
              <button
                key={preset.name}
                onClick={() => handleApplyPreset(preset)}
                className="px-2.5 py-1 bg-[#FDFBF7] hover:bg-amber-100 border border-[#111827] rounded-lg text-[10px] font-mono font-bold text-[#111827] transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* The Neo-Brutalist Vertical Boarding Pass */}
      <div className="relative bg-white border-[2.5px] border-[#111827] rounded-3xl overflow-hidden shadow-[6px_6px_0px_#111827] print:shadow-none">
        
        {/* Pass Top Section */}
        <div className="p-5 bg-[#1B3FFF] text-white space-y-4">
          <div className="flex items-center justify-between">
            {isEditing ? (
              <input
                type="text"
                value={passData.passClass}
                onChange={(e) => setPassData({ ...passData, passClass: e.target.value.toUpperCase() })}
                className="bg-white/20 border border-white/50 px-2 py-0.5 rounded font-mono font-black text-xs text-white uppercase focus:outline-none focus:ring-1 focus:ring-white max-w-[170px]"
              />
            ) : (
              <span className="font-mono font-black text-xs tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded">
                {passData.passClass}
              </span>
            )}

            {isEditing ? (
              <input
                type="text"
                value={passData.seat}
                onChange={(e) => setPassData({ ...passData, seat: e.target.value.toUpperCase() })}
                placeholder="SEAT"
                className="bg-[#FF5722] border border-[#111827] text-white px-2 py-0.5 rounded font-mono font-bold text-xs uppercase focus:outline-none w-20 text-center"
              />
            ) : (
              <span className="font-mono font-bold text-xs bg-[#FF5722] text-white px-2 py-0.5 rounded border border-[#111827]">
                SEAT {passData.seat}
              </span>
            )}
          </div>

          {/* Passenger Name Header */}
          <div className="border-t border-white/20 pt-2 flex items-center justify-between">
            <div>
              <span className="text-[9px] font-mono text-blue-200 block uppercase">PASSENGER NAME</span>
              {isEditing ? (
                <input
                  type="text"
                  value={passData.passengerName}
                  onChange={(e) => setPassData({ ...passData, passengerName: e.target.value.toUpperCase() })}
                  className="bg-white/20 border border-white/50 px-2 py-0.5 rounded font-display font-black text-sm text-white uppercase focus:outline-none w-44"
                />
              ) : (
                <span className="font-display font-black text-sm tracking-wide text-white">
                  {passData.passengerName}
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-[9px] font-mono text-blue-200 block uppercase">TRAVEL DATE</span>
              {isEditing ? (
                <input
                  type="text"
                  value={passData.date}
                  onChange={(e) => setPassData({ ...passData, date: e.target.value.toUpperCase() })}
                  className="bg-white/20 border border-white/50 px-2 py-0.5 rounded font-mono font-bold text-xs text-white uppercase focus:outline-none w-28 text-right"
                />
              ) : (
                <span className="font-mono font-bold text-xs text-white">
                  {passData.date}
                </span>
              )}
            </div>
          </div>

          {/* Route Display */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {isEditing ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    value={passData.originCode}
                    onChange={(e) => setPassData({ ...passData, originCode: e.target.value.toUpperCase() })}
                    className="bg-white/20 border border-white/50 px-1 py-0.5 rounded font-display font-black text-2xl text-white w-20 uppercase"
                  />
                  <input
                    type="text"
                    value={passData.originName}
                    onChange={(e) => setPassData({ ...passData, originName: e.target.value.toUpperCase() })}
                    className="bg-white/20 border border-white/50 px-1 py-0.5 rounded font-mono text-[9px] text-blue-100 w-28 uppercase block"
                  />
                </div>
              ) : (
                <>
                  <span className="text-3xl font-display font-black tracking-tight">{passData.originCode}</span>
                  <p className="text-[10px] font-mono text-blue-200 truncate max-w-[100px]">{passData.originName}</p>
                </>
              )}
            </div>

            <div className="flex flex-col items-center px-2">
              <Compass className="w-6 h-6 text-amber-300 animate-pulse" />
              <div className="w-16 h-[2px] bg-white/40 my-1" />
              {isEditing ? (
                <input
                  type="text"
                  value={passData.trailName}
                  onChange={(e) => setPassData({ ...passData, trailName: e.target.value.toUpperCase() })}
                  className="bg-white/20 border border-white/50 px-1 py-0.5 rounded font-mono text-[8px] text-blue-100 w-24 text-center uppercase"
                />
              ) : (
                <span className="text-[9px] font-mono text-blue-200 text-center">{passData.trailName}</span>
              )}
            </div>

            <div className="text-right">
              {isEditing ? (
                <div className="space-y-1 text-right">
                  <input
                    type="text"
                    value={passData.destCode}
                    onChange={(e) => setPassData({ ...passData, destCode: e.target.value.toUpperCase() })}
                    className="bg-white/20 border border-white/50 px-1 py-0.5 rounded font-display font-black text-2xl text-white w-20 uppercase text-right"
                  />
                  <input
                    type="text"
                    value={passData.destName}
                    onChange={(e) => setPassData({ ...passData, destName: e.target.value.toUpperCase() })}
                    className="bg-white/20 border border-white/50 px-1 py-0.5 rounded font-mono text-[9px] text-blue-100 w-28 uppercase text-right block ml-auto"
                  />
                </div>
              ) : (
                <>
                  <span className="text-3xl font-display font-black tracking-tight">{passData.destCode}</span>
                  <p className="text-[10px] font-mono text-blue-200 truncate max-w-[100px]">{passData.destName}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Middle Boarding & Cabin Details Grid */}
        <div className="p-4 bg-white grid grid-cols-2 gap-3 border-b-2 border-[#111827]">
          <div className="p-2.5 bg-[#FDFBF7] rounded-xl border border-gray-200">
            <span className="text-[10px] font-mono text-gray-500 font-bold block">FLIGHT STATUS</span>
            <span className="text-sm font-mono font-black text-emerald-600">CONFIRMED • ZONE 1</span>
            <p className="text-[9px] font-mono text-gray-500">Boarding on schedule</p>
          </div>

          <div className="p-2.5 bg-[#FDFBF7] rounded-xl border border-gray-200">
            <span className="text-[10px] font-mono text-gray-500 font-bold block">CABIN & BAGGAGE</span>
            <span className="text-sm font-mono font-black text-[#1B3FFF]">1 CARRY-ON + 1 PERSONAL</span>
            <p className="text-[9px] font-mono text-gray-500">Max 7kg overhead bin</p>
          </div>
        </div>

        {/* Official 180-Day Passport Security Seal */}
        {passData.passportSync ? (
          <div className={`p-3.5 border-b-2 border-[#111827] flex items-center justify-between transition-colors ${
            passData.passportSync.isValid ? 'bg-[#F0FDF4]' : 'bg-[#FEF2F2]'
          }`}>
            <div className="flex items-center space-x-2.5">
              <span className="text-2xl flex-shrink-0">
                {passData.passportSync.isValid ? '🛡️' : '🚨'}
              </span>
              <div>
                <div className="flex items-center space-x-1.5 flex-wrap">
                  <span className="text-[9px] font-mono font-black uppercase tracking-wider text-[#111827]">
                    {passData.passportSync.isValid ? '180-DAY IMMIGRATION COMPLIANCE SEAL' : 'BORDER CONTROL WARNING'}
                  </span>
                  <span className={`text-[8px] font-mono font-black px-1.5 py-0.2 rounded border border-[#111827] ${
                    passData.passportSync.isValid ? 'bg-[#10B981] text-white' : 'bg-[#EF4444] text-white animate-pulse'
                  }`}>
                    {passData.passportSync.isValid ? 'PASSED' : 'DENIED'}
                  </span>
                </div>
                <p className="text-[11px] font-mono font-black text-[#111827] mt-0.5">
                  {passData.passportSync.daysRemaining} Days Buffer • {passData.passportSync.nationality} ➔ {passData.passportSync.destinationCountry}
                </p>
                <span className="text-[9px] font-mono text-gray-500">
                  Verified via POYALO Deterministic Engine
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="text-[8px] font-mono font-bold text-gray-500 uppercase block">VISA ADVISORY</span>
              <span className="text-[10px] font-mono font-black text-[#1B3FFF] max-w-[90px] truncate block">
                {passData.passportSync.visaStatus}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-3 bg-[#FEF3C7] border-b-2 border-[#111827] flex items-center justify-between text-amber-950">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-800 flex-shrink-0" />
              <div>
                <span className="text-[10px] font-mono font-black block">
                  PASSPORT NOT SYNCED YET
                </span>
                <span className="text-[9px] font-mono text-amber-900">
                  Verify 180-day rule on Visa Check tab to stamp ticket
                </span>
              </div>
            </div>
            <span className="text-[8px] font-mono font-black bg-white px-2 py-0.5 rounded border border-amber-300 uppercase">
              1-TAP SYNC
            </span>
          </div>
        )}

        {/* Perforated Tear Line with Circular Notches */}
        <div className="relative py-2 bg-white flex items-center justify-center">
          {/* Left circular cutout notch */}
          <div className="absolute -left-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#FDFBF7] border-[2.5px] border-[#111827] rounded-full" />
          
          {/* Dashed perforation */}
          <div className="w-[85%] border-b-2 border-dashed border-[#111827]" />

          {/* Right circular cutout notch */}
          <div className="absolute -right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#FDFBF7] border-[2.5px] border-[#111827] rounded-full" />
        </div>

        {/* Bottom Stub: QR Code & Verification */}
        <div className="p-5 bg-[#FDFBF7] flex items-center justify-between">
          <div className="space-y-1.5 flex-1 pr-3">
            <span className="text-[10px] font-mono font-black text-gray-500 uppercase block">
              OFFICIAL VERIFICATION
            </span>
            <div className="flex items-center space-x-1.5 text-xs font-mono font-black text-[#111827]">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              {isEditing ? (
                <input
                  type="text"
                  value={passData.verificationStatus}
                  onChange={(e) => setPassData({ ...passData, verificationStatus: e.target.value.toUpperCase() })}
                  className="bg-white border border-gray-300 px-1 py-0.5 rounded text-[10px] font-mono font-bold w-full uppercase"
                />
              ) : (
                <span className="truncate">{passData.verificationStatus}</span>
              )}
            </div>
            
            <p className="text-[10px] font-mono text-gray-500 flex items-center space-x-1">
              <span>Booking Ref:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={passData.bookingRef}
                  onChange={(e) => setPassData({ ...passData, bookingRef: e.target.value.toUpperCase() })}
                  className="bg-white border border-gray-300 px-1 py-0.2 rounded text-[10px] font-mono font-black w-28 uppercase"
                />
              ) : (
                <strong className="text-[#111827] font-black">{passData.bookingRef}</strong>
              )}
            </p>
          </div>

          {/* Retro QR Block */}
          <div className="w-16 h-16 bg-white border-2 border-[#111827] rounded-xl p-1 shadow-[2px_2px_0px_#111827] flex items-center justify-center flex-shrink-0">
            <QrCode className="w-12 h-12 text-[#111827]" />
          </div>
        </div>

      </div>

      {/* Action Buttons Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <button 
          onClick={handleSharePass}
          className="py-3 px-3 bg-[#111827] text-white border-2 border-[#111827] rounded-xl font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#FF5722] flex items-center justify-center space-x-2 active:translate-x-0.5 active:translate-y-0.5 transition-all min-h-[48px]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>COPIED!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>SHARE STUB</span>
            </>
          )}
        </button>

        <button 
          onClick={() => window.print()}
          className="py-3 px-3 bg-white text-[#111827] border-2 border-[#111827] rounded-xl font-display font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_#111827] flex items-center justify-center space-x-2 active:translate-x-0.5 active:translate-y-0.5 transition-all hover:bg-gray-50 min-h-[48px]"
        >
          <Printer className="w-4 h-4 text-[#1B3FFF]" />
          <span>PRINT / PDF</span>
        </button>
      </div>

      {/* Creator Attribution */}
      <div className="text-center pt-2 text-[11px] font-mono text-gray-500">
        made with <span className="text-red-500 font-bold">♥</span> by{' '}
        <a
          href="https://www.instagram.com/nichroot/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-black text-[#111827] hover:text-[#1B3FFF] underline decoration-1 hover:decoration-[#1B3FFF] transition-colors"
        >
          nichroot
        </a>{' '}
        and{' '}
        <a
          href="https://www.instagram.com/m_farshi__"
          target="_blank"
          rel="noopener noreferrer"
          className="font-black text-[#111827] hover:text-[#1B3FFF] underline decoration-1 hover:decoration-[#1B3FFF] transition-colors"
        >
          farshi
        </a>
      </div>

    </div>
  );
};
