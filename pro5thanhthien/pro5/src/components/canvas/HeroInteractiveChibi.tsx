import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Sparkles, GraduationCap } from 'lucide-react';

interface HeroInteractiveChibiProps {
  className?: string;
  headSrc?: string;
  bodySrc?: string;
}

export const HeroInteractiveChibi: React.FC<HeroInteractiveChibiProps> = ({
  className = '',
  headSrc = '/assets/avatar-head.png',
  bodySrc = '/assets/avatar-body.png',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  // Mouse interpolation state
  const mousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const currentRot = useRef<{ x: number; y: number; z: number }>({ x: 0, y: 0, z: 0 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // 1. Mousemove listener for whole screen
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 2. Subtle breathing animation for Body Anchor
    const bodyEl = bodyRef.current;
    const shadowEl = shadowRef.current;

    let breathTween: gsap.core.Tween | null = null;
    let shadowTween: gsap.core.Tween | null = null;

    if (bodyEl) {
      breathTween = gsap.to(bodyEl, {
        y: -3,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    if (shadowEl) {
      shadowTween = gsap.to(shadowEl, {
        scaleX: 0.94,
        scaleY: 0.94,
        opacity: 0.75,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // 3. Smooth Head Tracking Animation Loop (LERP + 3D Perspective Transform)
    const updateHeadOrientation = () => {
      animFrameRef.current = requestAnimationFrame(updateHeadOrientation);

      const headEl = headRef.current;
      if (!headEl) return;

      const rect = headEl.getBoundingClientRect();
      const headCenterX = rect.left + rect.width / 2;
      const headCenterY = rect.top + rect.height * 0.85; // Pivot at neck

      // Deltas
      const deltaX = mousePos.current.x - headCenterX;
      const deltaY = mousePos.current.y - headCenterY;

      // Target angles clamped strictly within safe [-18deg, +18deg] range
      const maxScreenDist = Math.max(window.innerWidth, window.innerHeight) * 0.6;
      const rawRotY = (deltaX / maxScreenDist) * 24;
      const rawRotX = -(deltaY / maxScreenDist) * 20;
      const rawRotZ = (deltaX / maxScreenDist) * 8;

      const targetRotY = Math.max(-18, Math.min(18, rawRotY));
      const targetRotX = Math.max(-15, Math.min(15, rawRotX));
      const targetRotZ = Math.max(-6, Math.min(6, rawRotZ));

      // LERP (Linear Interpolation) with factor 0.085 for organic, fluid motion
      currentRot.current.x += (targetRotX - currentRot.current.x) * 0.085;
      currentRot.current.y += (targetRotY - currentRot.current.y) * 0.085;
      currentRot.current.z += (targetRotZ - currentRot.current.z) * 0.085;

      // Apply 3D transform with perspective
      headEl.style.transform = `perspective(850px) rotateX(${currentRot.current.x.toFixed(2)}deg) rotateY(${currentRot.current.y.toFixed(2)}deg) rotateZ(${currentRot.current.z.toFixed(2)}deg)`;

      // Dynamic Holographic Glare sweep across eyes/visor
      if (glareRef.current) {
        const glareX = 50 + currentRot.current.y * 2.2;
        const glareY = 40 - currentRot.current.x * 2.0;
        glareRef.current.style.transform = `translate(${glareX}%, ${glareY}%) rotate(-25deg)`;
      }
    };

    updateHeadOrientation();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (breathTween) breathTween.kill();
      if (shadowTween) shadowTween.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[420px] h-[520px] sm:h-[580px] flex flex-col items-center justify-end select-none pointer-events-none z-[5] ${className}`}
    >
      {/* 1. Ambient Ground Pedestal Radial Glow & Drop Shadow Under Sneakers */}
      <div className="absolute bottom-2 sm:bottom-4 w-72 h-14 flex items-center justify-center">
        {/* Soft Cyan Floor Glow */}
        <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-2xl" />

        {/* Dynamic Dark Radial Footprint Shadow */}
        <div
          ref={shadowRef}
          className="w-56 h-8 bg-gradient-to-r from-black/20 via-black/85 to-black/20 rounded-full blur-[4px]"
        />
      </div>

      {/* 2. Character Composite Rig (Head + Neck Overlap Buffer + Body Anchor) */}
      <div className="relative w-full h-full flex flex-col items-center justify-end">
        {/* Soft Ambient Character Backlight Glow (No black card borders!) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-80 h-96 bg-cyan-500/15 rounded-full blur-3xl opacity-60" />
        </div>

        {/* BODY ANCHOR LAYER: Holds shoulders, UTH polo jacket, arms, legs, sneakers */}
        <div
          ref={bodyRef}
          className="absolute inset-0 flex items-center justify-center filter drop-shadow-[0_12px_30px_rgba(0,242,254,0.3)]"
        >
          {/* Overlap Buffer: Guaranteed 20px neck/collar backing so zero gap can ever appear during rotation */}
          <div className="absolute top-[34%] w-24 h-12 bg-[#005baa] rounded-full blur-[2px] opacity-40 z-[1]" />

          <img
            src={bodySrc}
            alt="Sinh viên UTH Đinh Thanh Thiên Body Anchor"
            className="w-full h-full object-contain pointer-events-auto"
            onError={(e) => {
              // Fallback to full chibi image if segmented body is not found
              const target = e.target as HTMLImageElement;
              target.src = '/assets/avatar-uth.png';
            }}
          />
        </div>

        {/* HEAD ANCHOR LAYER: Rigged neck pivot with 3D Head Tracking */}
        <div
          ref={headRef}
          className="absolute inset-0 flex items-center justify-center z-[6] filter drop-shadow-[0_8px_25px_rgba(0,242,254,0.35)]"
          style={{
            transformOrigin: '50% 39%', // Exact joint pivot at neck/collar
            willChange: 'transform',
          }}
        >
          {/* Head Image Layer */}
          <img
            src={headSrc}
            alt="Sinh viên UTH Đinh Thanh Thiên Head Anchor"
            className="w-full h-full object-contain pointer-events-auto"
            onError={(e) => {
              // Fallback to full chibi image if head segment fails
              const target = e.target as HTMLImageElement;
              target.src = '/assets/avatar-uth.png';
            }}
          />

          {/* Holographic Glare sweep overlay on glasses/visor */}
          <div
            ref={glareRef}
            className="absolute top-[16%] left-[30%] w-28 h-6 bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent blur-[2px] pointer-events-none opacity-80"
          />
        </div>

        {/* 3. Floating Cyber Student Badge */}
        <div className="absolute top-12 -right-2 sm:right-2 flex items-center gap-2 px-3.5 py-1.5 rounded-2xl border border-cyan-400/40 bg-slate-900/85 backdrop-blur-md shadow-[0_0_20px_rgba(0,242,254,0.25)] z-20 animate-float pointer-events-auto">
          <GraduationCap className="h-4 w-4 text-cyan-400 shrink-0" />
          <div className="text-left font-mono">
            <span className="block text-[11px] font-black text-cyan-300">UTH // SMART LOGISTICS</span>
            <span className="block text-[9px] text-slate-400">Đinh Thanh Thiên • GPA 3.08</span>
          </div>
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
        </div>
      </div>
    </div>
  );
};
