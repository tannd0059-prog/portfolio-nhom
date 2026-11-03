import React, { useState, useEffect } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { sound } from '@/utils/soundEffects';
import {
  Home,
  User,
  Cpu,
  FolderGit2,
  Mail,
  Sun,
  Moon,
  Menu,
  X,
  Box,
  Volume2,
  VolumeX,
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const NAV_LINKS: NavItem[] = [
  { id: 'home', label: 'Trang chủ', icon: Home },
  { id: 'about', label: 'Hồ sơ Bento', icon: User },
  { id: 'skills', label: 'Kỹ năng', icon: Cpu },
  { id: 'projects', label: 'Dự án', icon: FolderGit2 },
  { id: 'contact', label: 'Liên hệ', icon: Mail },
];

export const Navbar: React.FC = () => {
  const theme = usePortfolioStore((s) => s.theme);
  const toggleTheme = usePortfolioStore((s) => s.toggleTheme);
  const activeSection = usePortfolioStore((s) => s.activeSection);
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection);
  const isMobileMenuOpen = usePortfolioStore((s) => s.isMobileMenuOpen);
  const toggleMobileMenu = usePortfolioStore((s) => s.toggleMobileMenu);
  const closeMobileMenu = usePortfolioStore((s) => s.closeMobileMenu);
  const isAudioMuted = usePortfolioStore((s) => s.isAudioMuted);
  const toggleAudioMuted = usePortfolioStore((s) => s.toggleAudioMuted);

  const [isScrolled, setIsScrolled] = useState(false);

  // Track scroll position to enhance navbar blur and update active section
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      // Section spy
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [setActiveSection]);

  const handleNavClick = (id: string) => {
    if (!isAudioMuted) {
      sound.playTab();
    }
    setActiveSection(id);
    closeMobileMenu();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-white/85 dark:bg-[#0b0c10]/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-lg'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('home');
          }}
          className="flex items-center gap-3 group focus:outline-none"
          aria-label="Đinh Thanh Thiên Trang chủ"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-uth-blue via-accent-purple to-uth-cyan text-slate-950 font-black shadow-md group-hover:scale-105 transition-transform">
            <Box className="h-5 w-5 text-slate-950" />
          </div>
          <div>
            <span className="font-mono text-sm font-black tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              THIEN<span className="text-cyan-400">.DEV</span>
            </span>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Smart Logistics AI</span>
            </div>
          </div>
        </a>

        {/* Desktop Navigation Links (Pill Style) */}
        <nav
          className="hidden md:flex items-center gap-1 p-1.5 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/70 dark:bg-[#111318]/80 backdrop-blur-xl shadow-md"
          aria-label="Điều hướng chính"
        >
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 focus:outline-none ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.35)] scale-105 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Micro-Sound Effects Toggle Button */}
          <button
            onClick={() => {
              toggleAudioMuted();
              if (isAudioMuted) {
                sound.playSuccess();
              }
            }}
            className={`flex h-10 px-3 items-center gap-1.5 rounded-2xl border transition-all shadow-sm active:scale-95 focus:outline-none ${
              !isAudioMuted
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-500 dark:text-cyan-400'
                : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#111318]/80 text-slate-400'
            }`}
            title={!isAudioMuted ? 'Tắt âm thanh hiệu ứng (Mute)' : 'Bật âm thanh hiệu ứng (Unmute)'}
            aria-label="Bật/Tắt âm thanh hiệu ứng"
          >
            {!isAudioMuted ? (
              <>
                <Volume2 className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
                <div className="flex items-end gap-0.5 h-3">
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-pulse h-2" />
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-pulse h-3 [animation-delay:150ms]" />
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-pulse h-1.5 [animation-delay:300ms]" />
                </div>
              </>
            ) : (
              <VolumeX className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={() => {
              if (!isAudioMuted) sound.playClick();
              toggleTheme();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#111318]/80 text-slate-700 dark:text-slate-200 hover:text-cyan-500 dark:hover:text-cyan-400 backdrop-blur-md transition-all shadow-sm active:scale-95 focus:outline-none"
            title={theme === 'dark' ? 'Chuyển sang giao diện Sáng' : 'Chuyển sang giao diện Tối'}
            aria-label="Đổi giao diện Sáng / Tối"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700 transition-transform duration-300 rotate-0 hover:-rotate-45" />
            )}
          </button>

          {/* Quick CTA Button (Desktop) */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('contact');
            }}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500 text-cyan-600 dark:text-cyan-300 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 transition-all duration-300 shadow-sm focus:outline-none"
          >
            <Mail className="h-3.5 w-3.5" />
            <span>Liên hệ ngay</span>
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-[#111318]/80 text-slate-700 dark:text-slate-200 hover:text-cyan-400 backdrop-blur-md transition-all shadow-sm active:scale-95 focus:outline-none"
            aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu di động'}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-2xl px-6 py-6 animate-in slide-in-from-top duration-300 shadow-2xl">
          <nav className="flex flex-col gap-2" aria-label="Menu di động">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all focus:outline-none ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono text-slate-500">
            <span>Đinh Thanh Thiên • UTH</span>
            <span className="text-cyan-400 font-bold">GPA 3.08</span>
          </div>
        </div>
      )}
    </header>
  );
};
