import React, { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { PROJECTS_MAP, ProjectItem } from '@/config/portfolioData';
import { ProjectInteractiveDemo } from '@/components/demos/ProjectInteractiveDemo';
import { sound } from '@/utils/soundEffects';
import {
  X,
  GitBranch,
  Sparkles,
  CheckCircle2,
  Award,
  Layers,
  Play,
  FileText,
} from 'lucide-react';

export const ProjectModal: React.FC = () => {
  const selectedProjectId = usePortfolioStore((s) => s.selectedProjectId);
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);
  const isAudioMuted = usePortfolioStore((s) => s.isAudioMuted);
  const [activeTab, setActiveTab] = useState<'overview' | 'demo'>('overview');

  const project: ProjectItem | null = selectedProjectId
    ? PROJECTS_MAP[selectedProjectId] || null
    : null;

  const handleClose = () => {
    if (!isAudioMuted) sound.playModalClose();
    setSelectedProject(null);
  };

  const handleTabChange = (tab: 'overview' | 'demo') => {
    if (!isAudioMuted) sound.playTab();
    setActiveTab(tab);
  };

  // Reset tab & play sound when modal opens
  useEffect(() => {
    if (selectedProjectId) {
      setActiveTab('overview');
      if (!isAudioMuted) sound.playModalOpen();
    }
  }, [selectedProjectId, isAudioMuted]);

  // Listen to Escape key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    if (selectedProjectId) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [selectedProjectId]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-project-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-[#111318] p-6 sm:p-8 text-slate-800 dark:text-slate-200 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200 z-10">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-5 top-5 rounded-full border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-white/5 p-2 text-slate-500 dark:text-white/70 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white focus:outline-none"
          aria-label="Đóng cửa sổ chi tiết dự án"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header Tags */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Interactive Project Inspector</span>
          </div>
          <span className="rounded-full border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1 text-xs font-mono text-slate-700 dark:text-slate-300">
            {project.category}
          </span>
          {project.demoType && (
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Live Demo Ready
            </span>
          )}
        </div>

        {/* Title & Subtitle */}
        <h3
          id="modal-project-title"
          className="text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl tracking-tight"
        >
          {project.title}
        </h3>
        <p className="mt-1 text-sm text-cyan-600 dark:text-cyan-400 font-semibold">
          {project.subtitle}
        </p>

        {/* Tab Switcher (Overview vs Live Demo) */}
        {project.demoType && (
          <div className="mt-5 flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <button
              type="button"
              onClick={() => handleTabChange('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'overview'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Kiến Trúc & Tổng Quan</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('demo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'demo'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.35)]'
                  : 'text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 border border-cyan-500/30'
              }`}
            >
              <Play className="h-4 w-4 fill-current" />
              <span>🎮 Trải Nghiệm Demo Trực Tiếp</span>
            </button>
          </div>
        )}

        {/* Tab 1 Content: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Description */}
            <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {project.description}
            </p>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-100/70 dark:bg-white/[0.02] p-4">
              {project.metrics.map((m, idx) => (
                <div key={idx} className="text-center">
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {m.label}
                  </span>
                  <span className="mt-1 block font-mono text-base font-bold text-cyan-600 dark:text-cyan-400 sm:text-lg">
                    {m.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick Demo Launch Banner */}
            {project.demoType && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-500/30 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Có sẵn bộ mô phỏng chạy trực tiếp trên web
                  </span>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Tương tác với các tham số thuật toán thực tế ngay trên trình duyệt.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleTabChange('demo')}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
                >
                  Mở Demo Ngay
                </button>
              </div>
            )}

            {/* Highlights / Technical Features */}
            {project.highlights && project.highlights.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] p-4">
                <h4 className="mb-2.5 text-xs font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-2 font-bold">
                  <Award className="h-4 w-4" /> Điểm Nhấn Kỹ Thuật (Key Highlights)
                </h4>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  {project.highlights.map((h, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-500 mt-0.5 shrink-0" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Architecture Pipeline Steps */}
            {project.architecture && project.architecture.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] p-4 font-mono">
                <h4 className="mb-2.5 text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2 font-bold">
                  <Layers className="h-4 w-4" /> Kiến Trúc Luồng Xử Lý (System Pipeline)
                </h4>
                <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  {project.architecture.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-cyan-500 font-bold">0{idx + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech Stack Tags */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-1 text-xs font-mono text-slate-700 dark:text-slate-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2 Content: Interactive Live Demo */}
        {activeTab === 'demo' && (
          <div className="mt-4 space-y-4">
            <ProjectInteractiveDemo demoType={project.demoType || null} />
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
          <div className="text-[11px] font-mono text-slate-400">
            Repository: <span className="text-cyan-400 font-bold">github.com/dinhthanhthien10-bit</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleClose}
              className="rounded-xl border border-slate-300 dark:border-white/10 px-5 py-2.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none"
            >
              Đóng
            </button>

            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-5 py-2.5 text-xs font-bold text-white dark:text-slate-950 hover:bg-cyan-500 dark:hover:bg-cyan-400 hover:text-slate-950 transition-colors shadow-md focus:outline-none"
            >
              <GitBranch className="h-4 w-4" />
              <span>Xem Code Trên GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
