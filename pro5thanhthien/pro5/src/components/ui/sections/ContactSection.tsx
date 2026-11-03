import React from 'react';
import { PROFILE } from '@/config/portfolioData';
import { Mail, GitBranch, MapPin, GraduationCap, CheckCircle2, Send } from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <div className="section-container max-w-lg rounded-3xl border border-white/10 bg-[#0f172a]/80 p-6 sm:p-8 backdrop-blur-xl shadow-2xl pointer-events-auto">
      {/* Tag */}
      <div className="gsap-stagger mb-2 flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-widest text-[#66fcf1]">
          Get In Touch
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Available
        </span>
      </div>

      {/* Title */}
      <h2 className="gsap-stagger text-2xl font-bold text-white sm:text-3xl tracking-tight">
        Kết Nối & Hợp Tác
      </h2>
      <p className="gsap-stagger mt-2 text-xs text-[#c5c6c7]/80 leading-relaxed sm:text-sm">
        Sẵn sàng thảo luận về các cơ hội phát triển dự án Trí tuệ nhân tạo (AI/Computer Vision), Tối ưu hóa chuỗi cung ứng thông minh (Smart Logistics) và Phát triển ứng dụng Web hiệu năng cao.
      </p>

      {/* Info Cards */}
      <div className="gsap-stagger mt-5 space-y-2.5 font-mono text-xs">
        <a
          href={`mailto:${PROFILE.email}`}
          className="group flex items-center justify-between rounded-2xl border border-white/5 bg-black/30 p-3.5 transition-all hover:border-[#66fcf1]/40 hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-2.5 text-white">
            <Mail className="h-4 w-4 text-[#66fcf1]" />
            <span className="text-[11px] text-[#c5c6c7]/70">Email:</span>
            <span className="text-white group-hover:text-[#66fcf1] transition-colors">{PROFILE.email}</span>
          </div>
          <Send className="h-3.5 w-3.5 text-[#66fcf1] opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>

        <a
          href={PROFILE.github}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center justify-between rounded-2xl border border-white/5 bg-black/30 p-3.5 transition-all hover:border-[#66fcf1]/40 hover:bg-white/[0.04]"
        >
          <div className="flex items-center gap-2.5 text-white">
            <GitBranch className="h-4 w-4 text-[#66fcf1]" />
            <span className="text-[11px] text-[#c5c6c7]/70">GitHub:</span>
            <span className="text-white group-hover:text-[#66fcf1] transition-colors">dinhthanhthien10-bit</span>
          </div>
          <Send className="h-3.5 w-3.5 text-[#66fcf1] opacity-0 group-hover:opacity-100 transition-opacity" />
        </a>

        <div className="flex items-center gap-2.5 rounded-2xl border border-white/5 bg-black/30 p-3.5 text-[#c5c6c7]/80">
          <GraduationCap className="h-4 w-4 text-[#45a29e]" />
          <span className="text-[11px] text-[#c5c6c7]/70">Đại học:</span>
          <span className="text-white text-xs">{PROFILE.university}</span>
        </div>

        <div className="flex items-center gap-2.5 rounded-2xl border border-white/5 bg-black/30 p-3.5 text-[#c5c6c7]/80">
          <MapPin className="h-4 w-4 text-[#45a29e]" />
          <span className="text-[11px] text-[#c5c6c7]/70">Khu vực:</span>
          <span className="text-white text-xs">{PROFILE.location}</span>
        </div>
      </div>

      {/* Note */}
      <div className="gsap-stagger mt-5 flex items-center gap-2 rounded-xl border border-white/5 bg-[#66fcf1]/5 p-3 text-[11px] text-[#66fcf1]">
        <CheckCircle2 className="h-4 w-4 shrink-0" />
        <span>Phản hồi tin nhắn nhanh trong vòng 24 giờ làm việc.</span>
      </div>
    </div>
  );
};
