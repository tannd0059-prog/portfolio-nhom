import React from 'react';
import { CAROUSEL_ROW_1, CAROUSEL_ROW_2, CarouselLogo } from '@/config/portfolioData';
import {
  Brain,
  Cpu,
  Layers,
  Terminal,
  Code2,
  Truck,
  Sparkles,
  GraduationCap,
  Boxes,
  Zap,
} from 'lucide-react';

export const LogoCarousel: React.FC = () => {
  // Mapping logo icon
  const getLogoIcon = (name: string) => {
    switch (name) {
      case 'PyTorch':
      case 'YOLOv5':
        return <Brain className="h-4 w-4" />;
      case 'LightGBM':
      case 'OpenCV':
        return <Cpu className="h-4 w-4" />;
      case 'FastAPI':
      case 'Python':
        return <Terminal className="h-4 w-4" />;
      case 'React 18':
      case 'TypeScript':
        return <Code2 className="h-4 w-4" />;
      case 'ĐH GTVT TP.HCM (UTH)':
        return <GraduationCap className="h-4 w-4 text-cyan-400" />;
      case 'Grab Vietnam':
        return <Truck className="h-4 w-4 text-emerald-400" />;
      case 'Revu Vietnam':
      case 'Ways Station':
        return <Sparkles className="h-4 w-4 text-amber-400" />;
      case 'Docker':
      case 'WSL2 Ubuntu':
        return <Layers className="h-4 w-4" />;
      case 'Three.js / WebGL':
        return <Boxes className="h-4 w-4 text-cyan-300" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  const renderLogoItem = (item: CarouselLogo, idx: number) => {
    return (
      <div
        key={`${item.name}-${idx}`}
        className="group relative flex items-center gap-3 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-[#111318]/70 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/40 hover:bg-slate-100 dark:hover:bg-cyan-950/20 hover:scale-105 shrink-0 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(0,242,254,0.15)]"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-200 dark:bg-white/5 text-slate-700 dark:text-slate-300 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-colors">
          {getLogoIcon(item.name)}
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-cyan-300 transition-colors tracking-tight">
              {item.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400">
            <span>{item.category}</span>
            <span>•</span>
            <span className="text-cyan-600 dark:text-cyan-400 font-mono">{item.badge}</span>
          </div>
        </div>
      </div>
    );
  };

  // Duplicate arrays to create continuous infinite marquee
  const row1Duplicated = [...CAROUSEL_ROW_1, ...CAROUSEL_ROW_1, ...CAROUSEL_ROW_1];
  const row2Duplicated = [...CAROUSEL_ROW_2, ...CAROUSEL_ROW_2, ...CAROUSEL_ROW_2];

  return (
    <section
      className="relative w-full py-10 overflow-hidden border-y border-slate-200 dark:border-white/5 bg-slate-100/60 dark:bg-[#0b0c10]/90"
      aria-label="Đối tác hệ sinh thái và công nghệ"
    >
      {/* Background Subtle Gradient Lines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent pointer-events-none" />

      {/* Side Fade Mask Gradients for seamless carousel entry/exit */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-slate-50 dark:from-[#0b0c10] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-slate-50 dark:from-[#0b0c10] to-transparent z-10" />

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-2.5">
          <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-semibold uppercase tracking-widest text-cyan-600 dark:text-cyan-400">
            Ecosystem & Tech Stack Partners
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Continuous Integration • Smart Logistics • Deep Learning
        </p>
      </div>

      {/* 2-Row Infinite Marquee Container */}
      <div className="space-y-4">
        {/* Row 1: Right to Left */}
        <div className="flex w-max gap-4 animate-marquee-left hover:[animation-play-state:paused]">
          {row1Duplicated.map((logo, idx) => renderLogoItem(logo, idx))}
        </div>

        {/* Row 2: Left to Right */}
        <div className="flex w-max gap-4 animate-marquee-right hover:[animation-play-state:paused]">
          {row2Duplicated.map((logo, idx) => renderLogoItem(logo, idx))}
        </div>
      </div>
    </section>
  );
};
