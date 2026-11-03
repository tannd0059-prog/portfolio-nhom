import React, { memo, useCallback, useState, useEffect, useRef, lazy, Suspense } from 'react';
import type { Application, SplineEvent } from '@splinetool/runtime';
import { usePortfolioStore } from '@/store/usePortfolioStore';
import { SCENE_CONFIG } from '@/config/sceneConfig';
import { AlertCircle, RefreshCw, Cpu } from 'lucide-react';

// Code Splitting: Tách riêng thư viện nặng @splinetool/react-spline ra khỏi main bundle
const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineCanvasProps {
  sceneUrl?: string;
}

/**
 * Lớp 0: Spline 3D Canvas Layer
 * - Bọc React.memo & Code-split với React.lazy + Suspense
 * - KHÔNG subscribe vào state activeSection hay selectedProjectId để đảm bảo Zero Re-render
 * - Cơ chế hoãn 2 nhịp rAF trong onLoad để triệt tiêu 100% FOUC
 * - Production Hardening: Lắng nghe webglcontextlost & webglcontextrestored để chống màn hình đen
 */
const SplineCanvasComponent: React.FC<SplineCanvasProps> = ({
  sceneUrl = SCENE_CONFIG.defaultSceneUrl,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Lấy các actions tĩnh từ store
  const setSplineApp = usePortfolioStore((s) => s.setSplineApp);
  const setSceneLoaded = usePortfolioStore((s) => s.setSceneLoaded);
  const setLoadingError = usePortfolioStore((s) => s.setLoadingError);
  const setSelectedProject = usePortfolioStore((s) => s.setSelectedProject);
  const setActiveSection = usePortfolioStore((s) => s.setActiveSection);

  const [hasError, setHasError] = useState(false);
  const [isContextLost, setIsContextLost] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Xử lý khi tải scene thành công
  const handleLoad = useCallback(
    (splineApp: Application) => {
      console.log('[SplineCanvas] Spline Runtime loaded successfully.');
      setSplineApp(splineApp);

      // Đợi 2 nhịp requestAnimationFrame để WebGL render frame đầu tiên hoàn chỉnh,
      // triệt tiêu 100% hiện tượng màn hình đen / FOUC trước khi ẩn LoadingScreen
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSceneLoaded(true);
        });
      });
    },
    [setSplineApp, setSceneLoaded]
  );

  // Xử lý sự kiện click vào các vật thể 3D (Raycasting từ Spline -> Web)
  const handleSplineMouseDown = useCallback(
    (e: SplineEvent) => {
      const targetName = e.target?.name;
      if (!targetName) return;

      console.log(`[SplineCanvas] Clicked 3D object: "${targetName}"`);

      // Tìm kiếm cấu hình tương tác tương ứng
      const matched = SCENE_CONFIG.interactiveObjects.find(
        (item) => item.name.toLowerCase() === targetName.toLowerCase()
      );

      if (matched) {
        if (matched.type === 'project' && matched.targetId) {
          setSelectedProject(matched.targetId);
        } else if (matched.type === 'section' && matched.targetSection) {
          setActiveSection(matched.targetSection);
        }
      }
    },
    [setSelectedProject, setActiveSection]
  );

  // Lắng nghe sự kiện mất Context WebGL (webglcontextlost & webglcontextrestored)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Tìm thẻ canvas sinh ra bởi Spline
    const observer = new MutationObserver(() => {
      const canvas = container.querySelector('canvas');
      if (canvas) {
        const handleContextLost = (e: Event) => {
          e.preventDefault(); // Cho phép WebGL tự động hoặc chủ động khôi phục
          console.warn('[SplineCanvas] WebGL context lost detected by GPU protection.');
          setIsContextLost(true);
        };

        const handleContextRestored = () => {
          console.log('[SplineCanvas] WebGL context restored successfully.');
          setIsContextLost(false);
          setRetryCount((prev) => prev + 1);
        };

        canvas.addEventListener('webglcontextlost', handleContextLost, false);
        canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

        observer.disconnect();
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [retryCount]);

  // Timeout dự phòng: nếu sau 15 giây không tải được thì thông báo lỗi nhẹ nhàng
  useEffect(() => {
    const timer = setTimeout(() => {
      const isLoaded = usePortfolioStore.getState().isSceneLoaded;
      if (!isLoaded && !hasError) {
        console.warn('[SplineCanvas] Scene loading timeout. Activating fallback option.');
      }
    }, 15000);

    return () => clearTimeout(timer);
  }, [hasError, retryCount]);

  // Fallback UI khi GPU quá tải hoặc WebGL Context bị thu hồi
  if (isContextLost) {
    return (
      <div className="fixed inset-0 z-[1] flex items-center justify-center bg-[#0b0c10] p-6 text-center">
        <div className="max-w-md rounded-2xl border border-amber-500/30 bg-[#1f2833]/90 p-8 backdrop-blur-xl shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <Cpu className="h-7 w-7 animate-pulse" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white">WebGL Context Lost</h2>
          <p className="mb-6 text-xs sm:text-sm text-[#c5c6c7]/80">
            Trình duyệt vừa tạm dừng GPU do bộ nhớ hoặc chuyển đổi tab. Bạn có thể bấm nút bên dưới để khôi phục không gian 3D.
          </p>
          <button
            onClick={() => {
              setIsContextLost(false);
              setRetryCount((prev) => prev + 1);
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#66fcf1] px-5 py-2.5 text-xs font-bold text-[#0b0c10] shadow-[0_0_20px_rgba(102,252,241,0.25)] hover:scale-105 transition-transform"
          >
            <RefreshCw className="h-4 w-4" /> Khôi phục Canvas 3D
          </button>
        </div>
      </div>
    );
  }

  // Fallback UI nếu WebGL gặp sự cố hoặc link không tải được
  if (hasError) {
    return (
      <div className="fixed inset-0 z-[1] flex items-center justify-center bg-[#0b0c10] p-6 text-center">
        <div className="max-w-md rounded-2xl border border-white/10 bg-[#1f2833]/80 p-8 backdrop-blur-xl shadow-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-white">Chế độ hiển thị dự phòng (Fallback)</h2>
          <p className="mb-6 text-sm text-[#c5c6c7]">
            Không thể tải tài nguyên 3D Spline hoặc trình duyệt chưa bật gia tốc phần cứng WebGL. Bạn vẫn có thể trải nghiệm toàn bộ giao diện danh mục bình thường.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setHasError(false);
                setRetryCount((prev) => prev + 1);
                setLoadingError(false);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#66fcf1] px-4 py-2.5 text-sm font-semibold text-[#0b0c10] transition-transform hover:scale-105"
            >
              <RefreshCw className="h-4 w-4" /> Thử tải lại
            </button>
            <button
              onClick={() => setSceneLoaded(true)}
              className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              Tiếp tục vào Portfolio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[1] w-full h-full bg-[#0b0c10] pointer-events-auto"
    >
      <Suspense fallback={null}>
        <Spline
          key={retryCount}
          scene={sceneUrl}
          onLoad={handleLoad}
          onSplineMouseDown={handleSplineMouseDown}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </Suspense>
    </div>
  );
};

export const SplineCanvas = memo(SplineCanvasComponent);
