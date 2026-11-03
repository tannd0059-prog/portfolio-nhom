import React, { useEffect, useState, useRef } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { sound } from '@/utils/soundEffects';

/**
 * Custom High-Tech Magnetic Cursor & Ambient Spotlight Glow Follower
 * Features:
 * - Fluid pinpoint dot + delayed spring ring
 * - Soft ambient radial glow trail illuminating cards
 * - Magnetic pull on interactive buttons/links
 * - Subtle micro-tick sound on hover
 * - Auto-disabled on touch devices
 */
export const CustomCursor: React.FC = () => {
  const isAudioMuted = usePortfolioStore((s) => s.isAudioMuted);

  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [ringPos, setRingPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const requestRef = useRef<number | null>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentRingPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined' || !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    setIsVisible(true);

    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      setMousePos({ x: e.clientX, y: e.clientY });

      // Check hovered element
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('a, button, [role="button"], input, select, textarea, .cursor-pointer');
      const textElement = target.closest('[data-cursor]');

      if (textElement) {
        setCursorText(textElement.getAttribute('data-cursor'));
      } else {
        setCursorText(null);
      }

      if (interactive && !isHovered) {
        setIsHovered(true);
        if (!isAudioMuted) {
          sound.playHover();
        }
      } else if (!interactive && isHovered) {
        setIsHovered(false);
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
      if (!isAudioMuted) {
        sound.playClick();
      }
    };
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Smooth lerp loop for outer ring
    const animate = () => {
      currentRingPos.current.x += (targetPos.current.x - currentRingPos.current.x) * 0.18;
      currentRingPos.current.y += (targetPos.current.y - currentRingPos.current.y) * 0.18;
      setRingPos({ x: currentRingPos.current.x, y: currentRingPos.current.y });
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isAudioMuted, isHovered]);

  if (!isVisible) return null;

  return (
    <>
      {/* 1. Ambient Spotlight Glow that follows mouse across whole page */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 hidden md:block"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 242, 254, 0.05), transparent 80%)`,
        }}
      />

      {/* 2. Pinpoint Dot Cursor */}
      <div
        className="pointer-events-none fixed z-50 rounded-full bg-cyan-400 mix-blend-difference hidden md:block transition-transform duration-75"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          width: isClicking ? '4px' : '6px',
          height: isClicking ? '4px' : '6px',
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* 3. Outer Magnetic Spring Follower Ring */}
      <div
        className={`pointer-events-none fixed z-50 rounded-full border hidden md:flex items-center justify-center transition-all duration-200 ${
          isHovered
            ? 'border-cyan-400/80 bg-cyan-500/10 scale-150 backdrop-blur-[1px]'
            : 'border-cyan-500/40 scale-100'
        } ${isClicking ? 'scale-75 bg-cyan-400/20' : ''}`}
        style={{
          left: `${ringPos.x}px`,
          top: `${ringPos.y}px`,
          width: cursorText ? '56px' : '34px',
          height: cursorText ? '56px' : '34px',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {cursorText && (
          <span className="text-[9px] font-mono font-black text-cyan-300 tracking-wider uppercase select-none">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
