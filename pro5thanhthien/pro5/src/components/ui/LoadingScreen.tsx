import React, { useEffect, useState } from 'react';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { Loader2, Sparkles, ArrowRight, Clock } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  const isSceneLoaded = usePortfolioStore((s) => s.isSceneLoaded);
  const setSceneLoaded = usePortfolioStore((s) => s.setSceneLoaded);

  const [shouldRender, setShouldRender] = useState(true);
  const [fadeState, setFadeState] = useState<'visible' | 'fading' | 'hidden'>('visible');
  const [showSkipButton, setShowSkipButton] = useState(false);

  // Timeout an toàn 12s: Nếu mạng chậm, cho phép người dùng vào thẳng UI
  useEffect(() => {
    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 12000);

    return () => clearTimeout(skipTimer);
  }, []);

  // Xử lý hiệu ứng mờ dần (smooth fade-out 600ms) khi tải xong
  useEffect(() => {
    if (isSceneLoaded) {
      setFadeState('fading');
      const timer = setTimeout(() => {
        setFadeState('hidden');
        setShouldRender(false);
      }, 600);
      return () => clearTimeout(timer);
    } else {
      setFadeState('visible');
      setShouldRender(true);
    }
  }, [isSceneLoaded]);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b0c10] transition-opacity duration-600 ease-out ${
        fadeState === 'fading'
          ? 'opacity-0 pointer-events-none'
          : 'opacity-100 pointer-events-auto'
      }`}
    >
      {/* Background ambient glow */}
      <div className="absolute h-80 w-80 rounded-full bg-[#66fcf1]/5 blur-3xl" />

      <div className="relative flex flex-col items-center text-center px-4 max-w-md">
        {/* Animated Cyber Ring */}
        <div className="relative mb-6 flex items-center justify-center">
          <div className="h-20 w-20 rounded-full border-2 border-white/5 border-t-[#66fcf1] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-7 w-7 text-[#66fcf1] animate-pulse" />
          </div>
        </div>

        {/* Text Details */}
        <h2 className="mb-2 text-xl font-bold tracking-wider text-white">
          KHỞI TẠO KHÔNG GIAN 3D
        </h2>
        <p className="text-xs sm:text-sm text-[#c5c6c7]/75 font-mono leading-relaxed">
          Đang nạp WebGL Shader, Texture & 3D Workspace Scene...
        </p>

        {/* Progress simulation bar */}
        <div className="mt-6 h-1 w-52 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-full bg-gradient-to-r from-[#45a29e] to-[#66fcf1] animate-pulse" />
        </div>

        <div className="mt-4 flex items-center gap-2 text-xs text-[#c5c6c7]/50 font-mono">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-[#66fcf1]" />
          <span>Tối ưu hóa 60FPS</span>
        </div>

        {/* Nút thoát an toàn (Skip Wait Button) khi kết nối mạng chậm quá 12 giây */}
        {showSkipButton && !isSceneLoaded && (
          <div className="mt-8 flex flex-col items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-1.5 text-[11px] text-amber-400/90 font-mono">
              <Clock className="h-3.5 w-3.5" />
              <span>Đường truyền đang nạp ngầm mô hình 3D...</span>
            </div>
            <button
              onClick={() => {
                console.log('[LoadingScreen] User chose to skip 3D waiting.');
                setSceneLoaded(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl border border-[#66fcf1]/50 bg-[#66fcf1]/10 px-5 py-2.5 text-xs font-bold text-[#66fcf1] transition-all hover:bg-[#66fcf1] hover:text-[#0b0c10] shadow-[0_0_20px_rgba(102,252,241,0.25)] hover:scale-105"
            >
              <span>Vào thẳng Portfolio (Bỏ qua chờ 3D)</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
