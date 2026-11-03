/**
 * ImageSequenceCanvas.tsx
 * Cinematic scroll-driven image sequence player (Apple / MiladiCode style).
 * - Preloads all frames into memory on mount with a loading progress bar.
 * - Draws the current frame on a <canvas> with object-fit:cover logic.
 * - GSAP ScrollTrigger pins the section and scrubs frame 0→N as user scrolls.
 * - Text overlays fade in/out at three keyframe zones.
 * - Fully cleans up on unmount (GSAP contexts, image refs).
 * - Respects prefers-reduced-motion: shows static frame + no pin.
 */
import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Config ──────────────────────────────────────────────────────────────────
const getBase = () => {
  const b = (import.meta as any).env?.BASE_URL || './';
  return b.endsWith('/') ? b : `${b}/`;
};

const TOTAL_FRAMES = 120;
const FRAME_PATH = (i: number) =>
  `${getBase()}sequence/frame_${String(i).padStart(4, '0')}.jpg`;

const VIDEO_PATH = `${getBase()}thiendinhvideo.mp4`;
const FALLBACK_IMAGE = `${getBase()}thiendinh.png`;

interface TextOverlay {
  /** Frame range this overlay is visible (inclusive) */
  startFrame: number;
  endFrame: number;
  badge: string;
  title: string;
  subtitle: string;
}

const OVERLAYS: TextOverlay[] = [
  {
    startFrame: 0,
    endFrame: 38,
    badge: '🎓 AI Engineering Student @ UTH',
    title: 'Đinh Thanh Thiên',
    subtitle: 'Kỹ thuật Trí tuệ Nhân tạo · Smart Logistics · Vibe Coder',
  },
  {
    startFrame: 39,
    endFrame: 78,
    badge: '⚡ Technical Philosophy',
    title: 'Biến Dữ Liệu Thành Giá Trị',
    subtitle:
      'PyTorch · YOLOv5 · LightGBM · FastAPI · React — từ mô hình AI đến sản phẩm chạy thực tế.',
  },
  {
    startFrame: 79,
    endFrame: 119,
    badge: '🚀 Open to Opportunities',
    title: 'Cùng Nhau Xây Dựng',
    subtitle:
      'Tìm kiếm cơ hội internship & collaboration trong AI, Computer Vision, và Logistics thông minh.',
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface Props {
  /** Pixel height of the scroll-pinned zone (controls scrub duration) */
  scrollHeight?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export const ImageSequenceCanvas: React.FC<Props> = ({
  scrollHeight = 4000,
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const prefersReduced = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  const [loadProgress, setLoadProgress] = useState(0); // 0-100
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [hasDrawnFrame, setHasDrawnFrame] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState<TextOverlay>(OVERLAYS[0]);
  const [overlayVisible, setOverlayVisible] = useState(true);

  // ── Draw a frame to canvas with cover-fit ──────────────────────────────────
  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
    setHasDrawnFrame(true);

    if (videoRef.current && Number.isFinite(videoRef.current.duration) && videoRef.current.duration > 0) {
      const progress = index / (TOTAL_FRAMES - 1);
      videoRef.current.currentTime = progress * videoRef.current.duration;
    }
  }, []);

  // ── Resize canvas to fill container ───────────────────────────────────────
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    drawFrame(currentFrameRef.current);
  }, [drawFrame]);

  // ── Preload all frames ─────────────────────────────────────────────────────
  useEffect(() => {
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded === TOTAL_FRAMES) {
          setIsLoaded(true);
          drawFrame(0);
        }
      };
      img.onerror = () => {
        loaded++;
        setLoadProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
        if (loaded === TOTAL_FRAMES) setIsLoaded(true);
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, [drawFrame]);

  // ── Resize listener ────────────────────────────────────────────────────────
  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  // ── GSAP ScrollTrigger scrub ───────────────────────────────────────────────
  useEffect(() => {
    if (!isLoaded || prefersReduced.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${scrollHeight}`,
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const rawFrame = Math.round(self.progress * (TOTAL_FRAMES - 1));
          const frame = Math.max(0, Math.min(TOTAL_FRAMES - 1, rawFrame));

          if (frame !== currentFrameRef.current) {
            currentFrameRef.current = frame;
            drawFrame(frame);
          }

          // Update text overlay
          const overlay = OVERLAYS.find(
            (o) => frame >= o.startFrame && frame <= o.endFrame
          );
          if (overlay) {
            if (overlay !== activeOverlay) {
              setOverlayVisible(false);
              setTimeout(() => {
                setActiveOverlay(overlay);
                setOverlayVisible(true);
              }, 200);
            }
          }

          // Hide overlay near transitions between zones
          const isNearTransition = OVERLAYS.some(
            (o) =>
              Math.abs(frame - o.endFrame) <= 3 ||
              Math.abs(frame - o.startFrame) <= 3
          );
          setOverlayVisible(!isNearTransition);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, scrollHeight, drawFrame]);

  // ── Static mode (reduced motion) ──────────────────────────────────────────
  useEffect(() => {
    if (isLoaded && prefersReduced.current) {
      drawFrame(0);
    }
  }, [isLoaded, drawFrame]);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-label="Cinematic Hero Section"
      className="relative w-full h-screen overflow-hidden bg-[#0B0C10]"
    >
      {/* 0. Video chạy gương mặt chân dung (thiendinhvideo.mp4) */}
      <video
        ref={videoRef}
        src={VIDEO_PATH}
        playsInline
        autoPlay
        muted
        loop
        onError={() => setVideoError(true)}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{
          filter: 'brightness(0.92) contrast(1.05)',
        }}
      />

      {/* Fallback Face Image */}
      {videoError && (
        <img
          src={FALLBACK_IMAGE}
          alt="Đinh Thanh Thiên"
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      )}

      {/* 1. Canvas — fills the entire viewport & overlays scrubbed frames */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-[1]"
        aria-hidden="true"
        style={{
          display: 'block',
          opacity: hasDrawnFrame ? 1 : 0.85,
        }}
      />

      {/* Dark gradient overlays for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0C10] via-[#0B0C10]/30 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B0C10]/70 via-transparent to-transparent pointer-events-none z-10" />

      {/* Loading Screen */}
      {!isLoaded && !hasDrawnFrame && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#0B0C10]/80 backdrop-blur-md gap-6">
          <div className="flex flex-col items-center gap-3 w-72">
            <p className="font-mono text-xs text-cyan-400 tracking-widest uppercase">
              Đang tải cảnh quay cinematic…
            </p>
            <div className="w-full h-1 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#005BAA] to-[#00F2FE] rounded-full transition-all duration-100"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="font-mono text-[11px] text-slate-500">
              {loadProgress}% / 100%
            </p>
          </div>
        </div>
      )}

      {/* Text Overlay — appears above canvas */}
      {isLoaded && (
        <div
          className={`absolute inset-0 z-20 flex flex-col items-start justify-end pb-20 px-8 sm:px-16 lg:px-24 transition-all duration-500 ${
            overlayVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {/* Badge */}
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-[#111318]/80 px-4 py-1.5 text-xs font-semibold text-cyan-400 backdrop-blur-md">
            {activeOverlay.badge}
          </span>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_2px_24px_rgba(0,0,0,0.9)] max-w-3xl">
            {activeOverlay.title}
          </h1>

          {/* Subtitle */}
          <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed drop-shadow-[0_1px_12px_rgba(0,0,0,0.8)]">
            {activeOverlay.subtitle}
          </p>

          {/* CTA Buttons (only on first overlay) */}
          {activeOverlay === OVERLAYS[0] && (
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-[0_0_20px_rgba(0,242,254,0.35)] hover:shadow-[0_0_30px_rgba(0,242,254,0.55)] transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                Khám Phá Dự Án
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/15 bg-[#111318]/70 text-white text-sm font-semibold transition-all hover:border-cyan-400/50 hover:bg-slate-800 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                Liên Hệ Hợp Tác
              </a>
            </div>
          )}

          {/* Last overlay — extra CTA */}
          {activeOverlay === OVERLAYS[2] && (
            <div className="mt-6">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#005BAA] to-[#00F2FE] text-slate-950 font-bold text-sm hover:scale-105 transition-all duration-300 shadow-lg focus:outline-none"
              >
                Gửi Lời Kết Nối
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Scroll cue — fades when not on first overlay */}
      {isLoaded && activeOverlay === OVERLAYS[0] && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 text-[11px] font-mono text-slate-400 animate-bounce pointer-events-none select-none">
          <span className="text-cyan-400/80">Cuộn để khám phá</span>
          <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      )}

      {/* Frame progress indicator (top-right — dev/presentation aid) */}
      {isLoaded && (
        <div className="absolute top-24 right-6 z-20 hidden sm:flex items-center gap-1.5 rounded-full border border-white/10 bg-[#111318]/60 px-3 py-1.5 backdrop-blur-md pointer-events-none select-none">
          <span className="font-mono text-[10px] text-slate-400">
            {OVERLAYS.findIndex((o) => o === activeOverlay) + 1} / {OVERLAYS.length}
          </span>
          <div className="flex gap-1">
            {OVERLAYS.map((o, i) => (
              <div
                key={i}
                className={`h-1.5 w-6 rounded-full transition-all duration-300 ${
                  o === activeOverlay ? 'bg-cyan-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default ImageSequenceCanvas;
