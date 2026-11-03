import React, { useState, useRef } from 'react';
import { GraduationCap, Sparkles, ShieldCheck, Terminal } from 'lucide-react';

interface AvatarBentoCardProps {
  className?: string;
  imageSrc?: string;
}

export const AvatarBentoCard: React.FC<AvatarBentoCardProps> = ({
  className = '',
  imageSrc = '/assets/avatar-uth.png',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number }>({ x: 220, y: 220 });
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setSpotlightPos({ x, y });

    // Subtle 3D tilt computation (max ±5 degrees)
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const ry = ((x - centerX) / centerX) * 5;
    const rx = -((y - centerY) / centerY) * 5;
    setTilt({ rx, ry });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className={`relative w-full max-w-[460px] mx-auto select-none ${className}`}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
        }}
        className="relative w-full p-[2px] rounded-3xl group cursor-pointer"
      >
        {/* 1. Animated Glow Border (Cyan -> UTH Blue -> Accent Purple) */}
        <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-accent-purple opacity-70 group-hover:opacity-100 blur-lg transition-all duration-500" />
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-accent-purple" />

        {/* 2. Inner Glassmorphism Card Container */}
        <div className="relative w-full h-[490px] sm:h-[550px] md:h-[580px] rounded-[22px] bg-gradient-to-b from-[#111318]/95 via-[#0e121a]/95 to-[#0b0c10] overflow-hidden flex flex-col justify-between backdrop-blur-2xl">
          {/* Dynamic Spotlight Radial Layer */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(450px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(0, 242, 254, 0.18), transparent 65%)`,
              }}
            />
          )}

          {/* Ambient Subtle Cyber Grid Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

          {/* TOP FLOATING BADGES */}
          <div className="relative z-20 p-5 flex items-start justify-between gap-2">
            {/* Badge 1: Academic Institution */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-[#111318]/90 border border-cyan-500/40 text-xs font-semibold text-cyan-300 backdrop-blur-xl shadow-lg">
              <GraduationCap className="h-4 w-4 text-cyan-400 shrink-0" />
              <span className="font-mono text-[11px] tracking-tight">Smart Logistics & IT • UTH</span>
            </div>

            {/* Status Chip */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111318]/90 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active</span>
            </div>
          </div>

          {/* CENTER AVATAR IMAGE (Isolated character with zero white edges) */}
          <div className="relative flex-1 flex items-end justify-center px-4 overflow-hidden">
            {/* Soft Ambient Backlight Disc */}
            <div className="absolute bottom-10 w-72 h-72 bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-accent-purple/20 rounded-full blur-3xl pointer-events-none" />

            {/* Character Photo with Spotlight Zoom on Hover */}
            <img
              src={imageSrc}
              alt="Đinh Thanh Thiên - 3D Developer Avatar"
              className="relative z-10 w-full h-[92%] object-contain object-bottom filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] group-hover:scale-105 group-hover:drop-shadow-[0_22px_45px_rgba(0,242,254,0.32)] transition-transform duration-500 ease-out"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/images/thien-chibi.png';
              }}
            />

            {/* Ground Contact Shadow */}
            <div className="absolute bottom-2 w-56 h-6 bg-black/65 rounded-full blur-md z-10 pointer-events-none" />
          </div>

          {/* BOTTOM FLOATING BADGES */}
          <div className="relative z-20 p-5 flex items-center justify-between gap-2 border-t border-white/5 bg-[#0b0c10]/80 backdrop-blur-xl">
            {/* Badge 2: Key Academic Milestone */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                <Terminal className="h-4 w-4 text-cyan-400" />
              </div>
              <div>
                <span className="block text-[11px] font-mono font-bold text-white flex items-center gap-1.5">
                  GPA 3.08 • AI & Vibe Coding
                  <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
                </span>
                <span className="block text-[9px] font-mono text-cyan-400">
                  52 / 120 Tín Chỉ Hoàn Tất
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              <span>Verified Dossier</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
