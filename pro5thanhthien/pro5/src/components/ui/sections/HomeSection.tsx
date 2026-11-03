import React from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { PROFILE } from '@/config/portfolioData';
import { ArrowRight, Sparkles, Terminal, GraduationCap } from 'lucide-react';

export const HomeSection: React.FC = () => {
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection);
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);

  return (
    <div className="section-container max-w-lg rounded-3xl border border-white/10 bg-[#0f172a]/75 p-6 sm:p-8 backdrop-blur-xl shadow-2xl pointer-events-auto">
      {/* Top Badge */}
      <div className="gsap-stagger mb-3 inline-flex items-center gap-2 rounded-full border border-[#66fcf1]/30 bg-[#66fcf1]/10 px-3.5 py-1 text-xs font-semibold text-[#66fcf1]">
        <Sparkles className="h-3 w-3 animate-pulse" />
        <span>3D Interactive Engineering Workspace</span>
      </div>

      {/* Hero Name & Title */}
      <h1 className="gsap-stagger text-3xl font-extrabold text-white sm:text-4xl tracking-tight leading-tight">
        {PROFILE.name}
      </h1>
      <p className="gsap-stagger mt-1 font-mono text-sm font-semibold text-[#66fcf1]">
        {PROFILE.role}
      </p>

      {/* University Tag */}
      <div className="gsap-stagger mt-2 flex items-center gap-2 text-xs text-[#c5c6c7]/80">
        <GraduationCap className="h-4 w-4 text-[#45a29e]" />
        <span>{PROFILE.university}</span>
      </div>

      {/* Tagline */}
      <p className="gsap-stagger mt-4 text-sm text-[#c5c6c7]/90 leading-relaxed">
        {PROFILE.tagline}
      </p>

      {/* Feature highlights */}
      <div className="gsap-stagger mt-4 rounded-2xl border border-white/5 bg-black/30 p-3.5 text-xs text-[#c5c6c7]/80 font-mono">
        <div className="flex items-center gap-2 text-[#66fcf1]">
          <Terminal className="h-3.5 w-3.5" />
          <span>Core Focus: Computer Vision • LightGBM • WebGL 3D</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="gsap-stagger mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setActiveSection('projects')}
          className="inline-flex items-center gap-2 rounded-xl bg-[#66fcf1] px-5 py-2.5 text-xs font-bold text-[#0b0c10] shadow-[0_0_25px_rgba(102,252,241,0.3)] transition-all duration-300 hover:scale-105"
        >
          Khám Phá Dự Án <ArrowRight className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setSelectedProject('alpr')}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition-colors duration-300 hover:bg-white/10 hover:border-[#66fcf1]/40"
        >
          <Terminal className="h-3.5 w-3.5 text-[#66fcf1]" /> Demo ALPR
        </button>
      </div>
    </div>
  );
};
