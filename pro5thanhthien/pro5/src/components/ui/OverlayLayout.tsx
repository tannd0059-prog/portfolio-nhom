import React, { useRef, useEffect } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Navbar } from './Navbar';
import { ProjectModal } from './ProjectModal';
import { HomeSection } from './sections/HomeSection';
import { AboutSection } from './sections/AboutSection';
import { ProjectsSection } from './sections/ProjectsSection';
import { ContactSection } from './sections/ContactSection';
import { MousePointer, Eye, EyeOff, Sparkles, Command } from 'lucide-react';
import gsap from 'gsap';

export const OverlayLayout: React.FC = () => {
  // Kích hoạt lắng nghe phím tắt toàn cục [1-4], [H], [Esc]
  useKeyboardNavigation();

  const activeSection = usePortfolioStore((s) => s.activeSection);
  const isUiHidden = usePortfolioStore((s) => s.isUiHidden);
  const toggleUiHidden = usePortfolioStore((s) => s.toggleUiHidden);
  const sectionContentRef = useRef<HTMLDivElement>(null);

  // GSAP Smooth Stagger Transition mỗi khi activeSection thay đổi
  useEffect(() => {
    if (!sectionContentRef.current || isUiHidden) return;

    const ctx = gsap.context(() => {
      // 1. Fade và trượt nhẹ container chính
      gsap.fromTo(
        sectionContentRef.current,
        { opacity: 0, y: 16, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out' }
      );

      // 2. Hiệu ứng Stagger nhịp nhàng trên các phần tử con có class .gsap-stagger
      const staggerItems = sectionContentRef.current?.querySelectorAll('.gsap-stagger');
      if (staggerItems && staggerItems.length > 0) {
        gsap.fromTo(
          staggerItems,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.05,
            duration: 0.35,
            ease: 'power2.out',
            delay: 0.05,
          }
        );
      }
    }, sectionContentRef);

    return () => ctx.revert(); // Dọn dẹp animation khi đổi tab để tránh xung đột
  }, [activeSection, isUiHidden]);

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return <HomeSection />;
      case 'about':
        return <AboutSection />;
      case 'projects':
        return <ProjectsSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="fixed inset-0 z-10 w-screen h-screen overflow-hidden pointer-events-none flex flex-col justify-between p-4 sm:p-8 md:p-10">
      {/* Top Bar: Navbar */}
      <div className={`transition-all duration-500 ${isUiHidden ? 'opacity-80' : 'opacity-100'}`}>
        <Navbar />
      </div>

      {/* Floating Notification when in Free-Look 3D Mode */}
      {isUiHidden && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300">
          <button
            onClick={toggleUiHidden}
            className="flex items-center gap-2 rounded-full border border-[#66fcf1]/40 bg-[#0f172a]/90 px-4 py-2 text-xs font-semibold text-[#66fcf1] shadow-[0_0_25px_rgba(102,252,241,0.25)] backdrop-blur-xl hover:bg-[#66fcf1] hover:text-[#0b0c10] transition-all hover:scale-105"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Chế độ 3D Free-Look (Bấm [H] hoặc chạm để hiện lại UI)</span>
          </button>
        </div>
      )}

      {/* Center Body: Dynamic Glassmorphism Section */}
      <div className="flex-1 flex items-center justify-between pointer-events-none my-auto">
        {/* Left Side: Animated Section Container */}
        <div
          ref={sectionContentRef}
          className={`pointer-events-none w-full max-w-lg transition-all duration-500 ${
            isUiHidden
              ? 'opacity-0 scale-95 -translate-x-8 pointer-events-none'
              : 'opacity-100 scale-100 translate-x-0'
          }`}
        >
          {renderActiveSection()}
        </div>

        {/* Right Side: Pass-through empty space for 3D Desk Setup interaction */}
        <div className="hidden lg:block w-96 pointer-events-none" />
      </div>

      {/* Bottom HUD Bar: Keyboard hints & 3D Controls */}
      <footer className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 pointer-events-none">
        {/* Left: Mouse interaction hint */}
        <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#0f172a]/75 px-3.5 py-1.5 text-xs text-[#c5c6c7]/80 backdrop-blur-md pointer-events-auto shadow-lg">
          <MousePointer className="h-3.5 w-3.5 text-[#66fcf1] animate-bounce" />
          <span>Xoay chuột 3D • Click máy tính/laptop mở dự án</span>
        </div>

        {/* Center: Keyboard Shortcuts HUD */}
        <div className="hidden md:flex items-center gap-3 rounded-full border border-white/10 bg-[#0f172a]/80 px-4 py-1.5 text-[11px] font-mono text-[#c5c6c7]/85 backdrop-blur-md pointer-events-auto shadow-xl">
          <div className="flex items-center gap-1.5">
            <Command className="h-3 w-3 text-[#66fcf1]" />
            <span className="text-white/60">Phím tắt:</span>
          </div>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-white text-[10px]">1-4</kbd> Camera
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-white text-[10px]">H</kbd> Ẩn/Hiện UI
          </span>
          <span className="text-white/20">•</span>
          <span className="flex items-center gap-1">
            <kbd className="rounded bg-white/10 px-1.5 py-0.5 text-white text-[10px]">Esc</kbd> Đóng Modal
          </span>
        </div>

        {/* Right: Quick Toggle UI Mode Button (Touch/Mouse accessible) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={toggleUiHidden}
            title="Bật/Tắt chế độ xem 3D toàn cảnh (Phím tắt: H)"
            className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-105 ${
              isUiHidden
                ? 'border-[#66fcf1] bg-[#66fcf1] text-[#0b0c10] shadow-[0_0_20px_rgba(102,252,241,0.35)]'
                : 'border-white/10 bg-[#0f172a]/80 text-[#c5c6c7] hover:text-white hover:border-[#66fcf1]/40'
            }`}
          >
            {isUiHidden ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Hiện UI [H]</span>
              </>
            ) : (
              <>
                <EyeOff className="h-3.5 w-3.5 text-[#66fcf1]" />
                <span>3D View [H]</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0f172a]/75 px-3 py-1.5 text-[11px] text-[#c5c6c7]/70 backdrop-blur-md">
            <Sparkles className="h-3 w-3 text-[#66fcf1]" />
            <span>WebGL 60FPS</span>
          </div>
        </div>
      </footer>

      {/* Modal Dialog */}
      <ProjectModal />
    </div>
  );
};
