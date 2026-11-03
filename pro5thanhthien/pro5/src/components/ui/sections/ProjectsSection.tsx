import React from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { PROJECTS } from '@/config/portfolioData';
import { ArrowRight, Sparkles, FolderGit2 } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);

  return (
    <div className="section-container max-w-lg max-h-[75vh] overflow-y-auto rounded-3xl border border-white/10 bg-[#0f172a]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl pointer-events-auto">
      {/* Tag */}
      <div className="gsap-stagger mb-2 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-[#66fcf1]">
          Featured Projects
        </span>
        <span className="flex items-center gap-1 text-[11px] text-[#c5c6c7]/60">
          <Sparkles className="h-3 w-3 text-[#66fcf1]" /> 4 Dự Án Thực Tế
        </span>
      </div>

      {/* Title */}
      <h2 className="gsap-stagger text-2xl font-bold text-white sm:text-3xl tracking-tight">
        Dự Án Nghiên Cứu & Phát Triển
      </h2>
      <p className="gsap-stagger mt-2 text-xs text-[#c5c6c7]/80 leading-relaxed">
        Nhấp chọn một dự án bên dưới hoặc tương tác trực tiếp với các mô hình 3D (Màn hình máy tính, Laptop...) để xem kiến trúc chi tiết:
      </p>

      {/* Projects List */}
      <div className="gsap-stagger mt-5 space-y-3">
        {PROJECTS.map((proj) => (
          <div
            key={proj.id}
            onClick={() => setSelectedProject(proj.id)}
            className="group cursor-pointer rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all duration-300 hover:border-[#66fcf1]/40 hover:bg-white/[0.06] hover:shadow-[0_4px_20px_rgba(102,252,241,0.08)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="inline-block rounded-md border border-white/10 bg-black/40 px-2 py-0.5 text-[10px] font-mono text-[#66fcf1]">
                  {proj.category}
                </span>
                <h3 className="mt-1.5 text-sm font-bold text-white group-hover:text-[#66fcf1] transition-colors">
                  {proj.title}
                </h3>
                <p className="mt-1 text-xs text-[#c5c6c7]/75 line-clamp-2 leading-relaxed">
                  {proj.subtitle}
                </p>
              </div>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-[#c5c6c7] group-hover:bg-[#66fcf1] group-hover:text-[#0b0c10] transition-all">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>

            {/* Metrics preview & Tech tags */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2.5">
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#45a29e]">
                <FolderGit2 className="h-3 w-3" />
                <span>{proj.tags.slice(0, 3).join(' • ')}</span>
              </div>
              <span className="text-[11px] font-mono font-semibold text-[#66fcf1]">
                {proj.metrics[0].label}: {proj.metrics[0].value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
