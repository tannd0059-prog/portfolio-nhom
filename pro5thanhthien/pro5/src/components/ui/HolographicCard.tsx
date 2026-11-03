import React, { useState, useRef } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { sound } from '@/utils/soundEffects';
import { Sparkles, ShieldCheck, Cpu, Wifi } from 'lucide-react';

interface HolographicCardProps {
  className?: string;
}

export const HolographicCard: React.FC<HolographicCardProps> = ({ className = '' }) => {
  const isAudioMuted = usePortfolioStore((s) => s.isAudioMuted);
  const cardRef = useRef<HTMLDivElement>(null);

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;
    setGlarePos({ x: px, y: py });

    // Smooth tilt angles
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const ry = ((x - centerX) / centerX) * 12;
    const rx = -((y - centerY) / centerY) * 12;
    setTilt({ rx, ry });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (!isAudioMuted) {
      sound.playHover();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
    setGlarePos({ x: 50, y: 50 });
  };

  const handleClick = () => {
    setIsActivated(true);
    if (!isAudioMuted) {
      sound.playSuccess();
    }
    setTimeout(() => setIsActivated(false), 1200);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className={`relative w-full max-w-[420px] mx-auto select-none ${className}`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.03, 1.03, 1.03)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.5s ease-out',
        }}
        className={`relative aspect-[1.586/1] w-full rounded-3xl p-6 cursor-pointer overflow-hidden transition-shadow duration-300 shadow-2xl ${
          isActivated
            ? 'ring-4 ring-cyan-400 shadow-[0_0_50px_rgba(0,242,254,0.6)]'
            : 'hover:shadow-[0_20px_50px_rgba(0,242,254,0.25)]'
        } bg-[#0c1017] border border-white/15`}
        data-cursor="TILT"
      >
        {/* Background Dark Carbon Cyber Texture */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-30" />
        <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-gradient-to-br from-cyan-500/20 via-blue-600/20 to-purple-600/20 rounded-full blur-2xl" />

        {/* 1. PRISMATIC RAINBOW HOLOGRAPHIC FOIL OVERLAY */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0.75 : 0,
            background: `linear-gradient(${
              115 + tilt.ry * 3
            }deg, transparent 15%, rgba(255, 0, 128, 0.3) 30%, rgba(0, 242, 254, 0.45) 50%, rgba(255, 215, 0, 0.35) 70%, rgba(139, 92, 246, 0.3) 85%, transparent 100%)`,
            backgroundPosition: `${glarePos.x}% ${glarePos.y}%`,
            mixBlendMode: 'color-dodge',
          }}
        />

        {/* 2. SPECULAR GLARE REFLECTION */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          style={{
            opacity: isHovered ? 0.45 : 0,
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.7) 0%, transparent 60%)`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* CARD CONTENT */}
        <div className="relative z-10 h-full flex flex-col justify-between text-white">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#005baa] to-[#00f2fe] text-slate-950 font-black shadow-lg">
                <span className="text-xs font-mono font-black tracking-tighter">UTH</span>
              </div>
              <div>
                <span className="block text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-bold">
                  ĐH GIAO THÔNG VẬN TẢI TP.HCM
                </span>
                <span className="text-xs font-extrabold tracking-tight text-white drop-shadow">
                  Smart Logistics Engineering Pass
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wifi className="h-5 w-5 text-cyan-400 rotate-90 opacity-80" />
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          {/* Golden Smart IC Chip Simulation */}
          <div className="my-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-9 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-1 shadow-md border border-amber-300/60 overflow-hidden">
                <div className="w-full h-full border border-amber-800/40 rounded flex items-center justify-center">
                  <Cpu className="h-4 w-4 text-amber-950 opacity-70" />
                </div>
                {/* Circuit lines */}
                <div className="absolute inset-x-0 top-1/2 h-px bg-amber-800/40" />
                <div className="absolute inset-y-0 left-1/3 w-px bg-amber-800/40" />
                <div className="absolute inset-y-0 right-1/3 w-px bg-amber-800/40" />
              </div>
              <span className="text-[10px] font-mono text-cyan-300 font-semibold tracking-wider">
                RFID ENCRYPTED • SECURE
              </span>
            </div>

            {/* Hologram Seal Badge */}
            <div className="h-11 w-11 rounded-full border border-cyan-400/50 p-0.5 bg-gradient-to-tr from-cyan-500/30 via-purple-500/30 to-pink-500/30 shadow-inner flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-cyan-300 drop-shadow animate-pulse" />
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-end justify-between pt-2 border-t border-white/10">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block">
                Kỹ sư / Nhà phát triển
              </span>
              <h4 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                <span>ĐINH THANH THIÊN</span>
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              </h4>
              <span className="text-[10px] font-mono text-cyan-400 font-bold block">
                Logistics Thông Minh & CNTT • 2024 - 2028
              </span>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-mono text-slate-400 block uppercase">STATUS</span>
              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ACTIVE • UTH
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Click Tip */}
        <div className="absolute bottom-1.5 right-4 z-20 text-[9px] font-mono text-cyan-400/60 pointer-events-none">
          {isActivated ? '✓ VERIFIED ACCESS GRANTED' : '✦ Chạm để kích hoạt'}
        </div>
      </div>
    </div>
  );
};

export default HolographicCard;
