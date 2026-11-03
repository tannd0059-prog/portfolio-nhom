import React, { useState } from 'react';
import { PROJECTS, ProjectItem, ProjectCategory } from '@/config/portfolioData';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { sound } from '@/utils/soundEffects';
import {
  ExternalLink,
  ArrowRight,
  Sparkles,
  GitBranch,
} from 'lucide-react';

const FILTER_TABS: ProjectCategory[] = [
  'Tất cả',
  'AI & Computer Vision',
  'Smart Logistics',
  'Web & System',
];

export const ProjectsSection: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<ProjectCategory>('Tất cả');
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);
  const isAudioMuted = usePortfolioStore((s) => s.isAudioMuted);

  const filteredProjects = PROJECTS.filter((proj) => {
    if (selectedFilter === 'Tất cả') return true;
    return proj.category === selectedFilter;
  });

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200 dark:border-white/5">
      {/* Section Header */}
      <div className="mb-12 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            <span>Dự Án Cá Nhân • Portfolio Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dự Án Nghiên Cứu & Triển Khai Thực Tế
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
            Tuyển tập 5 công trình phần mềm ứng dụng và trí tuệ nhân tạo do Đinh Thanh Thiên trực tiếp thiết kế, huấn luyện mô hình và hiện thực hóa.
          </p>
        </div>

        {/* Project Filter Tabs (JS Filter Buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-[#111318] border border-slate-200 dark:border-white/10 self-center sm:self-auto">
          {FILTER_TABS.map((tab) => {
            const isActive = selectedFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  if (!isAudioMuted) sound.playTab();
                  setSelectedFilter(tab);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300 focus:outline-none ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(0,242,254,0.3)] scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid (Responsive Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((proj: ProjectItem) => (
          <article
            key={proj.id}
            className="group rounded-3xl glass-panel border border-slate-200/80 dark:border-white/5 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 flex flex-col justify-between overflow-hidden"
          >
            {/* Project Card Header Gradient Banner */}
            <div className={`h-36 w-full bg-gradient-to-br ${proj.thumbnailGradient} p-5 flex flex-col justify-between relative overflow-hidden`}>
              <div className="flex items-center justify-between">
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#111318]/90 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                  {proj.category}
                </span>

                <div className="flex items-center gap-1.5">
                  {proj.demoType && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                      Live Demo
                    </span>
                  )}
                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#111318]/90 text-slate-300 hover:text-white hover:bg-cyan-500 hover:text-slate-950 transition-all border border-white/10 focus:outline-none"
                    title="Xem mã nguồn trên GitHub"
                    aria-label={`Mã nguồn GitHub cho ${proj.title}`}
                  >
                    <GitBranch className="h-4 w-4" />
                  </a>
                </div>
              </div>

              <div>
                <span className="font-mono text-[11px] text-cyan-200/90 font-medium tracking-wide">
                  #ProjectID: {proj.id}
                </span>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                  {proj.title}
                </h3>
              </div>
            </div>

            {/* Project Content Body */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-2">
                  {proj.subtitle}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                  {proj.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Metrics Bar & Action Button */}
              <div>
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/70 dark:border-white/5 mb-4">
                  <div>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {proj.metrics[0].label}
                    </span>
                    <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">
                      {proj.metrics[0].value}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {proj.metrics[1]?.label || 'Độ trễ'}
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {proj.metrics[1]?.value || '< 20ms'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!isAudioMuted) sound.playClick();
                      setSelectedProject(proj.id);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-900 dark:bg-white/10 hover:bg-cyan-500 dark:hover:bg-cyan-500 text-white dark:text-white hover:text-slate-950 dark:hover:text-slate-950 text-xs font-bold transition-all duration-300 shadow-sm focus:outline-none"
                  >
                    <span>{proj.demoType ? '🎮 Chạy Demo & Chi Tiết' : 'Chi Tiết Dự Án'}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>

                  <a
                    href={proj.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-slate-300 dark:border-white/10 hover:border-cyan-500/40 text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors focus:outline-none"
                    title="Mở GitHub"
                    aria-label={`Mở GitHub repo của ${proj.title}`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
