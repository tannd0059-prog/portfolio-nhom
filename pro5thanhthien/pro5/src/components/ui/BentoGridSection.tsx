import React, { useState } from 'react';
import { PROFILE } from '@/config/portfolioData';
import { HolographicCard } from '@/components/ui/HolographicCard';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { sound } from '@/utils/soundEffects';
import {
  User,
  Target,
  GraduationCap,
  Briefcase,
  Activity,
  Wrench,
  Music,
  Gamepad2,
  Calendar,
  MapPin,
  Award,
  Sparkles,
  Calculator,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';

export const BentoGridSection: React.FC = () => {
  const isAudioMuted = usePortfolioStore((s) => s.isAudioMuted);

  // Mini Logistics DIM Weight Calculator State (Criterion #19)
  const [dimLength, setDimLength] = useState<number>(50);
  const [dimWidth, setDimWidth] = useState<number>(40);
  const [dimHeight, setDimHeight] = useState<number>(30);
  const [actualWeight, setActualWeight] = useState<number>(8.5);
  const [dimDivisor, setDimDivisor] = useState<number>(5000); // 5000: Air, 6000: Road

  const volumetricWeight = Number(((dimLength * dimWidth * dimHeight) / dimDivisor).toFixed(2));
  const chargeableWeight = Math.max(volumetricWeight, actualWeight);
  const isVolumetricCharge = volumetricWeight > actualWeight;

  return (
    <section id="about" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 mb-3">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Bento Profile & Personal Dossier</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Hồ Sơ Năng Lực & Bản Sắc Cá Nhân
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Khám phá tư duy kỹ thuật, học vấn thực tế, trải nghiệm vận hành và đời sống sinh viên đa sắc màu của{' '}
          <span className="font-semibold text-cyan-600 dark:text-cyan-400">{PROFILE.name}</span>.
        </p>
      </div>

      {/* Modern Bento Grid (Responsive 12-column layout) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* =========================================================================
            BENTO CARD 1: LARGE HERO CARD - GIỚI THIỆU & MỤC TIÊU NGHỀ NGHIỆP (Col 1-8)
            ========================================================================= */}
        <article className="md:col-span-8 rounded-3xl p-6 sm:p-8 glass-panel relative overflow-hidden group hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-cyan-500/5">
          {/* Subtle Grid Glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Tag */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {PROFILE.name}
                </h3>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400">
                  {PROFILE.academicStatus}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 font-mono text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-cyan-500" /> {PROFILE.cohort}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-cyan-500" /> {PROFILE.location}
              </span>
            </div>
          </div>

          {/* Academic Profile Hook */}
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/5 mb-6">
            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {PROFILE.university}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Chuyên ngành: <strong className="text-cyan-600 dark:text-cyan-400">Logistics thông minh & Công nghệ thông tin</strong> (Smart Logistics & IT).
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {PROFILE.bio}
                </p>
              </div>
            </div>
          </div>

          {/* Career Goals */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Mục Tiêu Nghề Nghiệp (Career Objectives)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Short-Term Goal */}
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] hover:bg-cyan-500/[0.03] transition-colors">
                <div className="flex items-center gap-2 mb-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>Mục Tiêu Ngắn Hạn (1-2 năm)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {PROFILE.careerGoals.shortTerm}
                </p>
              </div>

              {/* Long-Term Goal */}
              <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white/50 dark:bg-white/[0.02] hover:bg-cyan-500/[0.03] transition-colors">
                <div className="flex items-center gap-2 mb-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold">
                  <Award className="h-3.5 w-3.5" />
                  <span>Mục Tiêu Dài Hạn (3-5 năm)</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {PROFILE.careerGoals.longTerm}
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* =========================================================================
            BENTO CARD 2: EDUCATION & ACADEMIC ACHIEVEMENTS (Col 9-12)
            ========================================================================= */}
        <article className="md:col-span-4 rounded-3xl p-6 glass-panel flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300 shadow-lg">
          <div>
            <div className="flex items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Học Vấn & Thành Tích
                  </h3>
                  <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                    Academic Milestones
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                GPA {PROFILE.creditsProgress.gpa}
              </span>
            </div>

            {/* 3D Holographic Prismatic Student Engineer Pass Card */}
            <div className="mb-5">
              <HolographicCard />
            </div>

            {/* University Progress */}
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/5">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-900 dark:text-white">ĐH GTVT TP.HCM (UTH)</span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
                    {PROFILE.creditsProgress.completed}/{PROFILE.creditsProgress.total} Tín chỉ
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                  Chuyên ngành: Logistics thông minh & CNTT
                </p>
                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-1000"
                    style={{
                      width: `${(PROFILE.creditsProgress.completed / PROFILE.creditsProgress.total) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Tiến độ: {PROFILE.creditsProgress.percent}</span>
                  <span>Dự kiến tốt nghiệp: 2027</span>
                </div>
              </div>

              {/* High School */}
              <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-white/40 dark:bg-white/[0.02]">
                <div className="flex items-start gap-2.5">
                  <Award className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                      Cựu Học Sinh {PROFILE.highSchool}
                    </h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Đồng Nai • Nền tảng tư duy Toán học, Tin học và Kỹ thuật vững chắc.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-200 dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
            <span>Xếp loại học lực:</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">Khá - Giỏi (GPA 3.08)</span>
          </div>
        </article>

        {/* =========================================================================
            BENTO CARD 3: REAL-WORLD EXPERIENCE & OPERATIONS (Col 1-6)
            ========================================================================= */}
        <article className="md:col-span-6 rounded-3xl p-6 sm:p-7 glass-panel group hover:border-cyan-500/40 transition-all duration-300 shadow-lg">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Kinh Nghiệm & Hoạt Động Thực Tế
              </h3>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Hands-on Operational Experience
              </span>
            </div>
          </div>

          {/* Experience Timeline */}
          <div className="space-y-4">
            {PROFILE.experience.map((exp, idx) => (
              <div
                key={idx}
                className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800 last:before:hidden"
              >
                <span className="absolute left-0.5 top-1.5 h-3 w-3 rounded-full border-2 border-emerald-500 bg-white dark:bg-slate-950" />

                <div className="flex flex-wrap items-center justify-between gap-1">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white">
                    {exp.role}
                  </h5>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 dark:bg-white/5 text-slate-600 dark:text-slate-400">
                    {exp.period}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400 block mb-1">
                  {exp.company}
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </article>

        {/* =========================================================================
            BENTO CARD 4: LIFESTYLE, INTERESTS & TECHNICAL PASSIONS (Col 7-12)
            ========================================================================= */}
        <article className="md:col-span-6 rounded-3xl p-6 sm:p-7 glass-panel group hover:border-cyan-500/40 transition-all duration-300 shadow-lg">
          <div className="flex items-center gap-2 mb-5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Cá Tính, Sở Thích & Đời Sống
              </h3>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                Lifestyle & Technical Passions
              </span>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Martial Arts */}
            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Activity className="h-4 w-4 text-red-500" />
                <span>{PROFILE.lifestyle.martialArts.title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {PROFILE.lifestyle.martialArts.details}
              </p>
            </div>

            {/* Motorcycle Engine Tuning */}
            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Wrench className="h-4 w-4 text-cyan-500" />
                <span>{PROFILE.lifestyle.bikeTuning.title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                {PROFILE.lifestyle.bikeTuning.details}
              </p>
            </div>

            {/* Music & CS2 Gaming */}
            <div className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Music className="h-4 w-4 text-purple-500" />
                <Gamepad2 className="h-4 w-4 text-indigo-500" />
                <span>{PROFILE.lifestyle.entertainment.title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {PROFILE.lifestyle.entertainment.details}
              </p>
            </div>
          </div>
        </article>

        {/* =========================================================================
            BENTO CARD 5: LOGISTICS DIM WEIGHT CALCULATOR (Col 1-12)
            ========================================================================= */}
        <article className="md:col-span-12 rounded-3xl p-6 sm:p-8 glass-panel border-cyan-500/30 group hover:border-cyan-500/60 transition-all duration-300 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    Công Cụ Tính Trọng Lượng Thể Tích Logistics (DIM Weight Calculator)
                  </h3>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/30">
                    Smart Logistics Feature
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Ứng dụng kiến thức chuyên ngành UTH: Tính trọng lượng tính cước (Chargeable Weight) giữa thể tích kiện hàng và khối lượng thực tế.
                </p>
              </div>
            </div>

            {/* Transport Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/80 dark:bg-[#111318] border border-slate-300 dark:border-white/10 font-mono text-xs">
              <button
                onClick={() => {
                  if (!isAudioMuted) sound.playClick();
                  setDimDivisor(5000);
                }}
                className={`px-3 py-1 rounded-lg transition-colors focus:outline-none ${
                  dimDivisor === 5000
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Hàng Không (/5000)
              </button>
              <button
                onClick={() => {
                  if (!isAudioMuted) sound.playClick();
                  setDimDivisor(6000);
                }}
                className={`px-3 py-1 rounded-lg transition-colors focus:outline-none ${
                  dimDivisor === 6000
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Đường Bộ (/6000)
              </button>
            </div>
          </div>

          {/* Calculator Inputs & Result Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Input Length */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111318]/60">
              <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                Chiều dài (cm)
              </label>
              <input
                type="number"
                min="1"
                value={dimLength}
                onChange={(e) => setDimLength(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-100 dark:bg-slate-800/70 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold font-mono text-slate-900 dark:text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* Input Width */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111318]/60">
              <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                Chiều rộng (cm)
              </label>
              <input
                type="number"
                min="1"
                value={dimWidth}
                onChange={(e) => setDimWidth(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-100 dark:bg-slate-800/70 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold font-mono text-slate-900 dark:text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* Input Height */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111318]/60">
              <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                Chiều cao (cm)
              </label>
              <input
                type="number"
                min="1"
                value={dimHeight}
                onChange={(e) => setDimHeight(Math.max(1, Number(e.target.value)))}
                className="w-full bg-slate-100 dark:bg-slate-800/70 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold font-mono text-slate-900 dark:text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* Actual Weight */}
            <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/40 dark:bg-[#111318]/60">
              <label className="block text-[11px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                Cân nặng thực tế (kg)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={actualWeight}
                onChange={(e) => setActualWeight(Math.max(0.1, Number(e.target.value)))}
                className="w-full bg-slate-100 dark:bg-slate-800/70 border border-slate-300 dark:border-white/10 rounded-xl px-3 py-1.5 text-sm font-bold font-mono text-slate-900 dark:text-white outline-none focus:border-cyan-400"
              />
            </div>

            {/* Result Box */}
            <div className="p-3.5 rounded-2xl border border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 via-blue-600/10 to-[#111318] flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-mono text-cyan-600 dark:text-cyan-400">
                <span>Trọng Lượng Tính Cước</span>
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div className="mt-1">
                <span className="text-2xl font-black font-mono text-cyan-500">
                  {chargeableWeight} <span className="text-xs font-normal">kg</span>
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-1">
                {isVolumetricCharge ? 'Theo thể tích (DIM)' : 'Theo khối lượng thực'}
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};
