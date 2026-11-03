import React from 'react';
import { PROFILE } from '@/config/portfolioData';
import { HeroThreeBackground } from '@/components/canvas/HeroThreeBackground';
import { AvatarBentoCard } from '@/components/ui/AvatarBentoCard';
import {
  ArrowRight,
  GraduationCap,
  GitBranch,
  Mail,
  ChevronDown,
  Sparkles,
  Terminal,
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="relative w-full min-h-[95vh] pt-28 sm:pt-32 pb-16 px-4 sm:px-6 overflow-hidden flex flex-col justify-center select-none"
    >
      {/* 1. THREE.JS 3D AMBIENT BACKGROUND (Particle Wave / Cybernetic Grid 60FPS) */}
      <HeroThreeBackground />

      {/* 2. MAIN 2-COLUMN HERO CONTAINER */}
      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center z-10">
        {/* LEFT COLUMN: HERO INFORMATION & METRICS (Col 1-7) */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* UTH Student Status Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-[#111318]/90 px-4 py-1.5 text-xs font-semibold text-cyan-400 backdrop-blur-md shadow-sm">
            <GraduationCap className="h-4 w-4 text-cyan-400" />
            <span>Sinh viên CNTT & Smart Logistics • UTH TP.HCM</span>
          </div>

          {/* Headline with High-End Gradient */}
          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12]">
              <span className="text-white">Xin chào, tôi là </span>
              <br />
              <span className="bg-gradient-to-r from-white via-cyan-200 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,242,254,0.3)]">
                {PROFILE.name}
              </span>
            </h1>
            <p className="mt-3 font-mono text-sm sm:text-base font-bold text-cyan-400 tracking-wide flex items-center justify-center lg:justify-start gap-2">
              <Terminal className="h-4 w-4 text-cyan-400" />
              <span>{PROFILE.role}</span>
            </p>
          </div>

          {/* Bio Description */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Kỹ sư tương lai kết hợp nền tảng <strong>Trí tuệ nhân tạo (PyTorch, YOLOv5, LightGBM)</strong> với chuyên ngành <strong>Logistics thông minh</strong> tại Trường Đại học Giao thông Vận tải TP.HCM (UTH). Tiên phong ứng dụng quy trình <em>Vibe Coding</em> giải quyết các bài toán vận tải và chuỗi cung ứng thực tế.
          </p>

          {/* Key Metric Cards (Glassmorphism with hover glow) */}
          <div className="grid grid-cols-3 gap-3.5 max-w-lg mx-auto lg:mx-0">
            <div className="p-3.5 rounded-2xl glass-panel text-center group hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(0,242,254,0.18)] transition-all duration-300">
              <span className="block text-[10px] font-mono text-slate-400">GPA Tích Lũy</span>
              <span className="text-base sm:text-xl font-black font-mono text-cyan-400 group-hover:scale-105 transition-transform inline-block">
                {PROFILE.creditsProgress.gpa}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl glass-panel text-center group hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.18)] transition-all duration-300">
              <span className="block text-[10px] font-mono text-slate-400">Tín Chỉ Hoàn Tất</span>
              <span className="text-base sm:text-xl font-black font-mono text-blue-400 group-hover:scale-105 transition-transform inline-block">
                52 / 120
              </span>
            </div>
            <div className="p-3.5 rounded-2xl glass-panel text-center group hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.18)] transition-all duration-300">
              <span className="block text-[10px] font-mono text-slate-400">ALPR mAP@0.5</span>
              <span className="text-base sm:text-xl font-black font-mono text-emerald-400 group-hover:scale-105 transition-transform inline-block">
                96.4%
              </span>
            </div>
          </div>

          {/* Action CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,242,254,0.35)] hover:shadow-[0_0_30px_rgba(0,242,254,0.55)] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <span>Khám Phá 5 Dự Án</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-white/10 hover:border-cyan-400/50 bg-[#111318]/80 text-white text-xs sm:text-sm font-semibold transition-all hover:bg-slate-800 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              <Mail className="h-4 w-4 text-cyan-400" />
              <span>Liên Hệ Hợp Tác</span>
            </a>

            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer"
              className="p-3.5 rounded-2xl border border-white/10 hover:border-cyan-400/50 bg-[#111318]/80 text-white hover:text-cyan-400 transition-colors backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <GitBranch className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: HIGH-TECH MODERN BENTO AVATAR FRAME (Col 8-12) */}
        <div className="lg:col-span-5 flex items-center justify-center w-full">
          <AvatarBentoCard imageSrc="/assets/avatar-uth.png" />
        </div>
      </div>

      {/* SCROLL DOWN INDICATOR */}
      <div className="mt-8 flex justify-center z-10">
        <a
          href="#about"
          className="flex flex-col items-center gap-1 text-[11px] font-mono text-slate-400 hover:text-cyan-400 transition-colors"
          aria-label="Cuộn xuống hồ sơ cá nhân"
        >
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-cyan-400" /> Cuộn xuống để khám phá
          </span>
          <ChevronDown className="h-4 w-4 animate-bounce text-cyan-400" />
        </a>
      </div>
    </section>
  );
};
