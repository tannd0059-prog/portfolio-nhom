import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { usePortfolioStore } from '@/store/usePortfolioStore';

interface BikeDriveByProps {
  className?: string;
  onShake?: () => void;
}

export const BikeDriveBy: React.FC<BikeDriveByProps> = ({
  className = '',
  onShake,
}) => {
  const bikeRef = useRef<HTMLDivElement>(null);
  const flameRef = useRef<HTMLDivElement>(null);

  const isAudioMuted = usePortfolioStore((s) => s.isAudioMuted);
  const revTriggerCount = usePortfolioStore((s) => s.revTriggerCount);

  const [imageError, setImageError] = useState(false);
  const isDrivingRef = useRef<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const activeTimelineRef = useRef<gsap.core.Timeline | null>(null);

  // Initialize Web Audio API and decode sound
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    // Load exhaust sound file
    fetch('/assets/exhaust-sound.mp3')
      .then((res) => {
        if (!res.ok) throw new Error('Sound file not found');
        return res.arrayBuffer();
      })
      .then((arrBuffer) => ctx.decodeAudioData(arrBuffer))
      .then((decoded) => {
        audioBufferRef.current = decoded;
      })
      .catch((err) => {
        console.info('[BikeDriveBy] Sound file load info, will use Web Audio synthesis fallback if needed:', err);
      });

    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  // Web Audio Synthesizer Fallback for Wave 54zz Racing Exhaust Roar
  const playSynthesizedExhaust = (panner: StereoPannerNode, gainNode: GainNode, ctx: AudioContext) => {
    // 1. Fundamental Engine RPM Oscillator
    const osc = ctx.createOscillator();
    osc.type = 'sawtooth';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.6);
    osc.frequency.exponentialRampToValueAtTime(520, now + 1.2);
    osc.frequency.exponentialRampToValueAtTime(240, now + 1.8);

    // 2. High RPM Exhaust Noise Buffer (for open exhaust braaap texture)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + 0.8);
    filter.Q.value = 3.5;

    noiseSource.connect(filter);
    filter.connect(gainNode);

    osc.connect(gainNode);
    gainNode.connect(panner);

    osc.start(now);
    noiseSource.start(now);
    osc.stop(now + 2.0);
    noiseSource.stop(now + 2.0);
  };

  // Trigger Drive-by Animation with Spatial Audio
  const triggerDriveBy = useCallback(() => {
    if (isDrivingRef.current) return;
    isDrivingRef.current = true;

    const bikeEl = bikeRef.current;
    if (!bikeEl) {
      isDrivingRef.current = false;
      return;
    }

    // Kill any existing timeline
    if (activeTimelineRef.current) {
      activeTimelineRef.current.kill();
    }

    // Audio Playback with Spatial Panning
    const ctx = audioContextRef.current;
    let panner: StereoPannerNode | null = null;
    let gainNode: GainNode | null = null;

    if (ctx && !isAudioMuted) {
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      try {
        if (ctx.createStereoPanner) {
          panner = ctx.createStereoPanner();
          panner.pan.setValueAtTime(-1.0, ctx.currentTime);
        }

        gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.85, ctx.currentTime + 0.6);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.8);

        if (panner) {
          gainNode.connect(panner);
          panner.connect(ctx.destination);
        } else {
          gainNode.connect(ctx.destination);
        }

        if (audioBufferRef.current) {
          const source = ctx.createBufferSource();
          source.buffer = audioBufferRef.current;
          source.playbackRate.value = 1.05;
          source.connect(gainNode);
          source.start(0);
        } else {
          // Play Synthesized Wave 54zz Exhaust Roar
          if (panner) {
            playSynthesizedExhaust(panner, gainNode, ctx);
          }
        }
      } catch (err) {
        console.warn('[BikeDriveBy] Audio play issue:', err);
      }
    }

    // GSAP Drive-by Motion
    const tl = gsap.timeline({
      onComplete: () => {
        isDrivingRef.current = false;
        gsap.set(bikeEl, { x: -450, opacity: 0 });
      },
    });
    activeTimelineRef.current = tl;

    // Reset starting position off-screen left
    gsap.set(bikeEl, {
      x: -450,
      opacity: 1,
      scaleX: 1,
      scaleY: 1,
      filter: 'blur(0px)',
    });

    // Animate X across viewport with power2.in acceleration
    tl.to(bikeEl, {
      x: '115vw',
      duration: 1.8,
      ease: 'power2.in',
      onUpdate: function () {
        // Update spatial audio pan value according to bike's progress
        const prog = this.progress(); // 0 to 1
        if (panner && ctx) {
          // -1 (Left) -> 0 (Center) -> 1 (Right)
          const panVal = Math.max(-1, Math.min(1, (prog - 0.5) * 2.2));
          panner.pan.setValueAtTime(panVal, ctx.currentTime);
        }

        // Trigger camera shake when bike passes the center (prog ~ 0.45)
        if (prog >= 0.4 && prog <= 0.55 && onShake) {
          onShake();
        }
      },
    });

    // Rapid motion blur and exhaust flame sparks
    if (flameRef.current) {
      tl.fromTo(
        flameRef.current,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1.4, duration: 0.4, repeat: 3, yoyo: true },
        0.3
      );
    }
  }, [isAudioMuted, onShake]);

  // Listen to revTriggerCount from store (when user clicks "Vít Ga / Rev Engine")
  useEffect(() => {
    if (revTriggerCount > 0) {
      triggerDriveBy();
    }
  }, [revTriggerCount, triggerDriveBy]);

  // Periodic random drive-by every 26 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      triggerDriveBy();
    }, 26000);

    return () => clearInterval(timer);
  }, [triggerDriveBy]);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-[2] ${className}`}>
      {/* Moving Racing Drag Bike Element */}
      <div
        ref={bikeRef}
        className="absolute bottom-16 sm:bottom-24 left-0 w-72 sm:w-96 h-40 flex items-center justify-center opacity-0 filter drop-shadow-[0_10px_25px_rgba(0,242,254,0.4)]"
        style={{ transform: 'translateX(-450px)' }}
      >
        {/* Exhaust Motion Blur Trail */}
        <div className="absolute -left-20 bottom-8 w-44 h-8 bg-gradient-to-r from-transparent via-cyan-400/40 to-blue-600/70 blur-md pointer-events-none" />

        {/* Exhaust Flame Spark Burst */}
        <div
          ref={flameRef}
          className="absolute -left-5 bottom-6 w-12 h-6 bg-gradient-to-l from-amber-400 via-orange-500 to-transparent rounded-full blur-[2px] opacity-0"
        />

        {/* Racing Bike Image or Fallback Wave 54zz Vector */}
        {!imageError ? (
          <img
            src="/assets/racing-bike.png"
            alt="Wave Thai 54zz Racing Drag Bike"
            className="w-full h-full object-contain filter contrast-125"
            onError={() => setImageError(true)}
          />
        ) : (
          /* High-Detail Fallback Silhouette of Wave 54zz Racing Bike */
          <svg
            viewBox="0 0 400 200"
            className="w-full h-full text-cyan-400 fill-current drop-shadow-[0_0_15px_rgba(0,242,254,0.6)]"
          >
            {/* Front & Rear Spoke Wheels (Excel căm Yaguso) */}
            <circle cx="80" cy="140" r="45" stroke="#00f2fe" strokeWidth="4" fill="none" />
            <circle cx="80" cy="140" r="3" fill="#00f2fe" />
            <circle cx="320" cy="140" r="45" stroke="#00f2fe" strokeWidth="4" fill="none" />
            <circle cx="320" cy="140" r="3" fill="#00f2fe" />

            {/* Thin spokes lines */}
            <line x1="80" y1="95" x2="80" y2="185" stroke="#66fcf1" strokeWidth="1.5" />
            <line x1="35" y1="140" x2="125" y2="140" stroke="#66fcf1" strokeWidth="1.5" />
            <line x1="320" y1="95" x2="320" y2="185" stroke="#66fcf1" strokeWidth="1.5" />
            <line x1="275" y1="140" x2="365" y2="140" stroke="#66fcf1" strokeWidth="1.5" />

            {/* Wave 54zz Racing Frame Chassis */}
            <path
              d="M80,140 L160,110 L230,115 L320,140 L240,90 L170,90 L130,50 L110,60 L150,105 Z"
              fill="#005baa"
              stroke="#00f2fe"
              strokeWidth="2"
            />

            {/* Drag Handlebar & Tank */}
            <rect x="110" y="45" width="35" height="8" rx="3" fill="#00f2fe" />
            <path d="M160,85 Q200,70 230,85 Z" fill="#66fcf1" />

            {/* Open Exhaust Pipe (Pô lon độ) */}
            <path
              d="M190,130 L280,145 L340,135"
              stroke="#ff9500"
              strokeWidth="6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )}
      </div>
    </div>
  );
};
