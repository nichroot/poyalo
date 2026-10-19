import React, { useState, useEffect, useRef } from 'react';

// Web Audio API Doppler Jet Engine Synthesizer (100% Offline)
function playJetSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const duration = 2.4;

    // 1. Noise Generator for wind/jet blast
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Filter for Doppler shift sweep (low -> high -> low)
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.setValueAtTime(2.5, now);
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(2200, now + 1.1); // Peak overhead
    filter.frequency.exponentialRampToValueAtTime(280, now + duration);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.01, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.4, now + 1.0);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // 2. Turbine Low Rumble Oscillator
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.linearRampToValueAtTime(180, now + 1.1);
    osc.frequency.linearRampToValueAtTime(60, now + duration);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.01, now);
    oscGain.gain.exponentialRampToValueAtTime(0.2, now + 1.0);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    noise.start(now);
    noise.stop(now + duration);
    osc.start(now);
    osc.stop(now + duration);
  } catch {
    // Audio context may fail if restricted
  }
}

export const AirplaneEasterEgg: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const isTriggeringRef = useRef<boolean>(false);

  const triggerFlyby = () => {
    if (isTriggeringRef.current) return;
    isTriggeringRef.current = true;
    setIsActive(true);

    // Haptic vibration on mobile
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([120, 60, 180, 60, 240]);
      } catch {}
    }

    // Play synthesized jet sound
    playJetSound();

    // Reset after animation ends (2.6 seconds)
    setTimeout(() => {
      setIsActive(false);
      isTriggeringRef.current = false;
    }, 2700);
  };

  useEffect(() => {
    // 1. Phone accelerometer shake detection (High-pass gravity filter + 6 vigorous reversals)
    let gravityX = 0;
    let gravityY = 0;
    let gravityZ = 0;
    let shakeReversals = 0;
    let lastReversalTime = 0;
    let sequenceStartTime = 0;
    let lastAxisSign = 0;
    const REQUIRED_SHAKES = 6; // Requires 6 vigorous back-and-forth shakes
    const SHAKE_COOLDOWN = 5000; // 5s cooldown between flights
    let lastTriggerTime = 0;

    const handleMotion = (event: DeviceMotionEvent) => {
      const now = Date.now();
      if (now - lastTriggerTime < SHAKE_COOLDOWN || isTriggeringRef.current) return;

      let linearX = 0;
      let linearY = 0;
      let linearZ = 0;

      if (event.acceleration && event.acceleration.x !== null && event.acceleration.y !== null && event.acceleration.z !== null) {
        linearX = event.acceleration.x;
        linearY = event.acceleration.y;
        linearZ = event.acceleration.z;
      } else if (
        event.accelerationIncludingGravity && 
        event.accelerationIncludingGravity.x !== null &&
        event.accelerationIncludingGravity.y !== null
      ) {
        // High-pass filter to isolate pure dynamic motion from static 9.8m/s² gravity
        const alpha = 0.82;
        const gx = event.accelerationIncludingGravity.x || 0;
        const gy = event.accelerationIncludingGravity.y || 0;
        const gz = event.accelerationIncludingGravity.z || 0;
        gravityX = alpha * gravityX + (1 - alpha) * gx;
        gravityY = alpha * gravityY + (1 - alpha) * gy;
        gravityZ = alpha * gravityZ + (1 - alpha) * gz;
        linearX = gx - gravityX;
        linearY = gy - gravityY;
        linearZ = gz - gravityZ;
      } else {
        return;
      }

      // Net dynamic acceleration magnitude (without gravity)
      const magnitude = Math.hypot(linearX, linearY, linearZ);

      // High threshold: gentle movement is 1-5 m/s²; picking up is 6-10; deliberate shake is > 24
      if (magnitude > 24) {
        const dominantAcc = Math.abs(linearX) > Math.abs(linearY) ? linearX : linearY;
        const currentSign = Math.sign(dominantAcc);

        // Require distinct direction reversals with minimum 90ms spacing
        if (currentSign !== 0 && currentSign !== lastAxisSign && (now - lastReversalTime > 90)) {
          lastAxisSign = currentSign;
          lastReversalTime = now;

          if (shakeReversals === 0) {
            sequenceStartTime = now;
          }
          shakeReversals++;

          // Require 6 complete reversals within 1600ms
          if (shakeReversals >= REQUIRED_SHAKES && (now - sequenceStartTime <= 1600)) {
            lastTriggerTime = now;
            shakeReversals = 0;
            triggerFlyby();
            return;
          }
        }
      }

      // Reset count if user stops shaking or sequence took longer than 1600ms
      if (shakeReversals > 0 && (now - sequenceStartTime > 1600)) {
        shakeReversals = 0;
      }
    };

    // 2. Custom Event Listener for programmatic or click triggers
    const handleCustomTrigger = () => {
      triggerFlyby();
    };

    // 3. Desktop Keyboard Shortcut (Alt+P for Poyalo Easter Egg, never plain WASD 'S' key!)
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.altKey && (e.key === 'p' || e.key === 'P') && 
        document.activeElement?.tagName !== 'INPUT' && 
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        triggerFlyby();
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    window.addEventListener('poyalo:airplane-shake', handleCustomTrigger);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('poyalo:airplane-shake', handleCustomTrigger);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden select-none">
      
      {/* Background Comic Speed Lines Flash */}
      <div className="absolute inset-0 bg-[#1B3FFF]/10 animate-pulse pointer-events-none" />

      {/* Comic Decals popping on screen */}
      <div className="absolute top-[20%] left-[8%] animate-in fade-in zoom-in duration-300">
        <div className="bg-[#FBBF24] text-[#111827] border-[3px] border-[#111827] shadow-[4px_4px_0px_#111827] font-comic text-2xl sm:text-4xl px-4 py-1.5 rounded-2xl transform -rotate-12">
          WHOOSH!!!
        </div>
      </div>

      <div className="absolute top-[42%] left-[45%] animate-in fade-in zoom-in duration-500 delay-300">
        <div className="bg-[#FF5722] text-white border-[3px] border-[#111827] shadow-[4px_4px_0px_#111827] font-comic text-3xl sm:text-5xl px-4 py-2 rounded-2xl transform rotate-6">
          പോയാലോ! ✈️
        </div>
      </div>

      <div className="absolute top-[65%] right-[10%] animate-in fade-in zoom-in duration-300 delay-500">
        <div className="bg-[#10B981] text-white border-[3px] border-[#111827] shadow-[4px_4px_0px_#111827] font-comic text-2xl sm:text-4xl px-4 py-1.5 rounded-2xl transform -rotate-6">
          ZOOMMM! 💨
        </div>
      </div>

      {/* Bottom Floating Comic Notification Decal */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-white border-[2.5px] border-[#111827] rounded-xl shadow-[4px_4px_0px_#111827] flex items-center space-x-2 animate-bounce">
        <span className="text-xl">✈️</span>
        <span className="font-mono font-black text-xs uppercase text-[#111827]">
          PHONE SHAKE DETECTED • SUPERSONIC POYALO FLYBY!
        </span>
      </div>

      {/* The Animated Supersonic Comic Jet flying across the entire screen */}
      <div className="absolute poyalo-supersonic-flight">
        <div className="relative">
          
          {/* Contrail / Smoke Puffs behind engine */}
          <div className="absolute -bottom-8 -left-20 flex space-x-3 pointer-events-none opacity-80">
            <span className="text-3xl animate-ping">💨</span>
            <span className="text-2xl animate-pulse">☁️</span>
            <span className="text-4xl">🔥</span>
          </div>

          {/* Neo-Brutalist Comic Supersonic Aircraft SVG */}
          <svg
            className="w-44 h-44 sm:w-56 sm:h-56 drop-shadow-[5px_5px_0px_#111827]"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main Delta Jet Body */}
            <path
              d="M175 25 L145 75 L75 125 L35 155 L45 130 L95 90 L125 55 Z"
              fill="#1B3FFF"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Wing Left */}
            <path
              d="M115 70 L30 115 L55 125 L100 85 Z"
              fill="#FF5722"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Wing Right */}
            <path
              d="M130 50 L115 15 L95 25 L120 55 Z"
              fill="#FF5722"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Cockpit Canopy */}
            <path
              d="M160 38 L142 55 L130 50 L145 35 Z"
              fill="#38BDF8"
              stroke="#111827"
              strokeWidth="3.5"
            />
            {/* Tail Fin */}
            <path
              d="M50 140 L35 180 L20 175 L38 135 Z"
              fill="#FBBF24"
              stroke="#111827"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            {/* Engine Afterburner Glow */}
            <circle cx="28" cy="165" r="8" fill="#EF4444" stroke="#111827" strokeWidth="3" />
            <circle cx="28" cy="165" r="4" fill="#FBBF24" />
          </svg>

        </div>
      </div>

      <style>{`
        @keyframes poyaloSupersonicFly {
          0% {
            transform: translate3d(-20vw, 110vh, 0) rotate(-35deg) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          50% {
            transform: translate3d(45vw, 45vh, 0) rotate(-28deg) scale(1.15);
          }
          85% {
            opacity: 1;
          }
          100% {
            transform: translate3d(115vw, -25vh, 0) rotate(-22deg) scale(1.4);
            opacity: 0;
          }
        }
        .poyalo-supersonic-flight {
          animation: poyaloSupersonicFly 2.5s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>

    </div>
  );
};
