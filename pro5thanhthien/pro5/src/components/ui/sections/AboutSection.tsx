import React from 'react';
import { PROFILE, SKILL_GROUPS } from '@/config/portfolioData';
import { Brain, Code2, Cpu, GraduationCap, UserCheck } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Brain':
        return <Brain className="h-4 w-4 text-[#66fcf1]" />;
      case 'Code2':
        return <Code2 className="h-4 w-4 text-[#66fcf1]" />;
      case 'Cpu':
        return <Cpu className="h-4 w-4 text-[#66fcf1]" />;
      default:
        return <Code2 className="h-4 w-4 text-[#66fcf1]" />;
    }
  };

  return (
    <div className="section-container max-w-lg max-h-[75vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0f172a]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl pointer-events-auto">
      {/* Tag */}
      <div className="gsap-stagger mb-2 flex items-center gap-2">
        <span className="text-xs font-mono uppercase tracking-widest text-[#66fcf1]">
          About / Background
        </span>
      </div>

      {/* Title */}
      <h2 className="gsap-stagger text-2xl font-bold text-white sm:text-3xl tracking-tight">
        Kỹ sư AI & Smart Logistics
      </h2>

      {/* University & Degree */}
      <div className="gsap-stagger mt-2 rounded-2xl border border-white/5 bg-black/25 p-3 flex items-start gap-3">
        <GraduationCap className="h-5 w-5 text-[#66fcf1] shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-bold text-white">{PROFILE.university}</h4>
          <p className="text-[11px] text-[#c5c6c7]/80">{PROFILE.major}</p>
        </div>
      </div>

      {/* Bio text */}
      <p className="gsap-stagger mt-3 text-xs leading-relaxed text-[#c5c6c7]/90 sm:text-sm">
        {PROFILE.bio}
      </p>

      {/* Skills Groups */}
      <div className="gsap-stagger mt-5 space-y-3">
        <h3 className="text-xs font-mono uppercase tracking-wider text-white/90 flex items-center gap-1.5">
          <UserCheck className="h-3.5 w-3.5 text-[#66fcf1]" /> Bộ Kỹ Năng Kỹ Thuật (Tech Stack)
        </h3>

        {SKILL_GROUPS.map((group) => (
          <div
            key={group.name}
            className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5 transition-all hover:bg-white/[0.04]"
          >
            <div className="mb-2 flex items-center gap-2">
              {getIcon(group.iconName)}
              <span className="text-xs font-semibold text-white">{group.name}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <span
                  key={typeof skill === 'string' ? skill : skill.name}
                  className="rounded-lg border border-white/5 bg-black/30 px-2.5 py-1 text-[11px] font-mono text-[#c5c6c7] transition-colors hover:text-[#66fcf1] hover:border-[#66fcf1]/30"
                >
                  {typeof skill === 'string' ? skill : skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
