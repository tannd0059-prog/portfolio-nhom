import React, { useState } from 'react';
import { SKILL_GROUPS, SkillItem } from '@/config/portfolioData';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { sound } from '@/utils/soundEffects';
import { Brain, Code2, Cpu, Sparkles, CheckCircle } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const isAudioMuted = usePortfolioStore((s) => s.isAudioMuted);
  const [activeCategory, setActiveCategory] = useState<'all' | 'ai' | 'web' | 'tools'>('all');

  const handleCategoryChange = (cat: 'all' | 'ai' | 'web' | 'tools') => {
    if (!isAudioMuted) sound.playTab();
    setActiveCategory(cat);
  };

  const getCategoryIcon = (categoryKey: string) => {
    switch (categoryKey) {
      case 'ai':
        return <Brain className="h-5 w-5 text-cyan-400" />;
      case 'web':
        return <Code2 className="h-5 w-5 text-blue-400" />;
      case 'tools':
        return <Cpu className="h-5 w-5 text-purple-400" />;
      default:
        return <Code2 className="h-5 w-5 text-cyan-400" />;
    }
  };

  const filteredGroups = SKILL_GROUPS.filter((group) => {
    if (activeCategory === 'all') return true;
    return group.categoryKey === activeCategory;
  });

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/5">
      {/* Section Header */}
      <div className="mb-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Kỹ Năng Chuyên Môn • Tech Stack</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Bộ Kỹ Năng Kỹ Thuật (Technical Proficiency)
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Phân loại rõ ràng giữa Trí tuệ nhân tạo (AI & Deep Learning), Phát triển Web/Backend hiện đại và Công cụ DevOps.
          </p>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#111318] border border-slate-200 dark:border-white/10 self-center sm:self-auto">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all focus:outline-none ${
              activeCategory === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => handleCategoryChange('ai')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all focus:outline-none ${
              activeCategory === 'ai'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            AI & Deep Learning
          </button>
          <button
            onClick={() => handleCategoryChange('web')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all focus:outline-none ${
              activeCategory === 'web'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Web & Backend
          </button>
          <button
            onClick={() => handleCategoryChange('tools')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all focus:outline-none ${
              activeCategory === 'tools'
                ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tools & DevOps
          </button>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <article
            key={group.name}
            className="rounded-3xl p-6 glass-panel border border-slate-200/80 dark:border-white/5 hover:border-cyan-500/40 transition-all duration-300 shadow-lg flex flex-col justify-between"
          >
            <div>
              {/* Group Title */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-white/5">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                  {getCategoryIcon(group.categoryKey)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {group.name}
                  </h3>
                  <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                    {group.skills.length} Kỹ năng cốt lõi
                  </span>
                </div>
              </div>

              {/* Skill Bars */}
              <div className="space-y-4">
                {group.skills.map((skill: SkillItem) => (
                  <div key={skill.name} className="group/item">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 group-hover/item:text-cyan-400 transition-colors">
                        {skill.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                          {skill.badge}
                        </span>
                        <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                          {skill.level}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar with Cyan/Blue/Purple gradient */}
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 via-accent-purple to-cyan-400 transition-all duration-1000 group-hover/item:shadow-[0_0_12px_rgba(0,242,254,0.5)]"
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom summary note */}
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 text-cyan-400" /> Đã kiểm thử qua dự án
              </span>
              <span>UTH Standard</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
