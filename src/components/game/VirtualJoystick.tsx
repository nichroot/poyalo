import React, { useRef, useState, useCallback } from 'react';

interface VirtualJoystickProps {
  onMove: (vector: { x: number; y: number }) => void;
  maxRadius?: number; // default 56px
}

const VirtualJoystickComponent: React.FC<VirtualJoystickProps> = ({
  onMove,
  maxRadius = 56
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [touchActive, setTouchActive] = useState(false);
  const touchOriginRef = useRef({ x: 0, y: 0 });
  const activePointerIdRef = useRef<number | null>(null);
  const isInteractingRef = useRef<boolean>(false);

  const updateKnob = useCallback((clientX: number, clientY: number) => {
    const dx = clientX - touchOriginRef.current.x;
    const dy = clientY - touchOriginRef.current.y;
    const dist = Math.hypot(dx, dy);

    let clampedX = dx;
    let clampedY = dy;

    if (dist > maxRadius) {
      clampedX = (dx / dist) * maxRadius;
      clampedY = (dy / dist) * maxRadius;
    }

    setKnobPos({ x: clampedX, y: clampedY });

    // 6px dead zone to prevent accidental jitter
    if (dist < 6) {
      onMove({ x: 0, y: 0 });
    } else {
      // Normalized vector: x between -1 and 1, y inverted so up is positive
      onMove({
        x: clampedX / maxRadius,
        y: -(clampedY / maxRadius)
      });
    }
  }, [maxRadius, onMove]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    activePointerIdRef.current = e.pointerId;
    isInteractingRef.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Fallback if not supported
    }

    touchOriginRef.current = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };

    setTouchActive(true);
    updateKnob(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isInteractingRef.current || e.pointerId !== activePointerIdRef.current) return;
    updateKnob(e.clientX, e.clientY);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerId !== activePointerIdRef.current) return;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Fallback
    }
    activePointerIdRef.current = null;
    isInteractingRef.current = false;
    setTouchActive(false);
    setKnobPos({ x: 0, y: 0 });
    onMove({ x: 0, y: 0 });
  };

  const isUp = knobPos.y < -12;
  const isDown = knobPos.y > 12;
  const isLeft = knobPos.x < -12;
  const isRight = knobPos.x > 12;

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: 'none' }}
      className={`relative w-32 h-32 rounded-full border-[2.5px] flex items-center justify-center select-none touch-none backdrop-blur-sm shadow-[4px_4px_0px_#111827] transition-colors cursor-grab active:cursor-grabbing ${
        touchActive
          ? 'border-[#1B3FFF] bg-white/90'
          : 'border-[#111827] bg-white/70'
      }`}
    >
      {/* Active gradient background */}
      {touchActive && (
        <div className="absolute inset-0 rounded-full pointer-events-none bg-[radial-gradient(circle,rgba(27,63,255,0.2)_0%,transparent_70%)]" />
      )}

      {/* Directional Indicators */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] pointer-events-none font-bold transition-colors">
        <span className={isUp ? 'text-[#1B3FFF]' : 'text-gray-400'}>▲</span>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] pointer-events-none font-bold transition-colors">
        <span className={isDown ? 'text-[#1B3FFF]' : 'text-gray-400'}>▼</span>
      </div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none font-bold transition-colors">
        <span className={isLeft ? 'text-[#1B3FFF]' : 'text-gray-400'}>◀</span>
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] pointer-events-none font-bold transition-colors">
        <span className={isRight ? 'text-[#1B3FFF]' : 'text-gray-400'}>▶</span>
      </div>

      {/* Outer crosshair guides */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-35">
        <div className="w-full h-[1px] bg-[#111827]" />
        <div className="absolute h-full w-[1px] bg-[#111827]" />
      </div>

      {/* Movable Thumb Knob */}
      <div
        className="w-14 h-14 rounded-full border-[2.5px] border-[#111827] bg-[#FF5722] text-white flex items-center justify-center font-black text-lg shadow-[3px_3px_0px_#111827] pointer-events-none"
        style={{
          transform: `translate(${knobPos.x}px, ${knobPos.y}px) scale(${touchActive ? 1.1 : 1})`,
          willChange: 'transform'
        }}
      >
        <span>🕹️</span>
      </div>
    </div>
  );
};

export const VirtualJoystick = React.memo(VirtualJoystickComponent);
