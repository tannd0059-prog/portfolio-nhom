# TÀI LIỆU THAM CHIẾU MÃ NGUỒN CỐT LÕI (SOURCE CODE REFERENCE)
**Mã tài liệu:** `AUDIT-PORTFOLIO-THIEN-07`  
**Dự án:** Portfolio Cá Nhân Đinh Thanh Thiên — UTH  
**Mục đích:** Cung cấp mã nguồn nguyên mẫu (verbatim source code) và logic kỹ thuật của các thành phần cốt lõi để AI hoặc kỹ sư khác có thể tái lập mã nguồn ngay lập tức mà không cần suy đoán.

---

## 1. KHO DỮ LIỆU TẬP TRUNG (`src/config/portfolioData.ts`)

```typescript
/**
 * Dữ liệu Portfolio tập trung (Centralized Portfolio Data)
 * Đinh Thanh Thiên — Trường Đại học Giao thông Vận tải TP.HCM (UTH)
 */

export interface ProjectMetric {
  label: string;
  value: string;
}

export type ProjectCategory = 'Tất cả' | 'AI & Computer Vision' | 'Smart Logistics' | 'Web & System';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'AI & Computer Vision' | 'Smart Logistics' | 'Web & System';
  description: string;
  tags: string[];
  metrics: ProjectMetric[];
  demoUrl?: string;
  githubUrl: string;
  highlights: string[];
  architecture?: string[];
  thumbnailGradient: string;
}

export interface SkillItem {
  name: string;
  level: number; // 0 - 100
  badge: string;
}

export interface SkillGroup {
  name: string;
  categoryKey: 'ai' | 'web' | 'tools';
  iconName: string;
  skills: SkillItem[];
}

export const PROFILE = {
  name: 'Đinh Thanh Thiên',
  shortName: 'Thanh Thiên',
  birthDate: '02/10/2006',
  hometown: 'Gò Vấp, TP.HCM / Đồng Nai',
  studentId: '075206003993',
  cohort: 'Khóa 2024',
  role: 'Smart Logistics & AI / Software Engineering',
  tagline: 'Kỹ sư AI ứng dụng & Nhà phát triển phần mềm trong chuỗi cung ứng thông minh.',
  university: 'Trường Đại học Giao thông Vận tải TP.HCM (UTH)',
  faculty: 'Khoa Công nghệ Thông tin & Logistics Thông Minh',
  major: 'Logistics thông minh & Công nghệ thông tin',
  highSchool: 'THPT Lê Quý Đôn (Đồng Nai)',
  creditsProgress: {
    completed: 52,
    total: 120,
    gpa: '3.08/4.0',
  },
  github: 'https://github.com/dinhthanhthien10-bit',
  email: 'dinhthanhthien.work@gmail.com',
  phone: '0901234567',
  location: 'Gò Vấp, TP. Hồ Chí Minh, Việt Nam',
  status: 'Open for AI, Smart Logistics & Fullstack Software Opportunities',
  bio: 'Sinh viên ngành Logistics thông minh & Công nghệ thông tin tại UTH với GPA 3.08/4.0. Đam mê kết hợp Trí tuệ nhân tạo (AI/Computer Vision/Machine Learning) vào tối ưu hóa vận tải và xây dựng phần mềm hiện đại.',
  careerGoals: {
    shortTerm:
      'Làm chủ quy trình Vibe Coding, củng cố chuyên sâu kiến trúc Deep Learning (YOLO, ResNet, DistilBERT) và thuật toán dự báo Gradient Boosting (LightGBM) để giải quyết các bài toán định tuyến và dự báo giao hàng thực tế.',
    longTerm:
      'Trở thành Kỹ sư Trưởng hệ thống AI & Phần mềm ứng dụng trong lĩnh vực Smart Logistics, xây dựng giải pháp chuỗi cung ứng tự động hóa kết nối IoT và WebGL 3D thời gian thực cho các cảng biển và trung tâm phân phối.',
  },
  experience: [
    {
      period: '2025 - 2026',
      role: 'Content Creator (Brand Collaborator)',
      company: 'Revu Vietnam Campaigns',
      description:
        'Hợp tác sáng tạo nội dung số, phân tích insight người dùng và tối ưu hóa mức độ tương tác qua các chiến dịch truyền thông đa nền tảng.',
    },
    {
      period: '2024 - 2025',
      role: 'Vận hành & Dịch vụ khách hàng',
      company: 'Ways Station (Gò Vấp)',
      description:
        'Quản lý quầy dịch vụ, tiếp nhận phản hồi, điều phối thời gian phục vụ tại chuỗi giải trí công nghệ trẻ.',
    },
    {
      period: '2024',
      role: 'Đối tác Tài xế Công nghệ (Tech Delivery Partner)',
      company: 'Grab Vietnam',
      description:
        'Trực tiếp trải nghiệm và thấu hiểu bài toán vận hành giao thông đô thị, thời gian giao nhận (ETA), các điểm nghẽn lộ trình và sự biến thiên nhu cầu theo khung giờ.',
    },
  ],
  lifestyle: {
    martialArts: {
      title: 'Võ thuật Muay Thái',
      details: 'Tập luyện Muay Thái bền bỉ (70kg, 1m75), trui rèn kỷ luật thép, phản xạ tốc độ và ý chí kiên định.',
    },
    bikeTuning: {
      title: 'Kỹ thuật Cơ khí & Đam mê Độ xe',
      details:
        'Đam mê độ xe kỹ thuật cao: Wave Thái cấu hình 54zz, bình xăng Nibbi 26, IC Shark, niềng Excel căm Yaguso & tự bảo dưỡng Yamaha Luvias GTX FI.',
    },
    entertainment: {
      title: 'Âm nhạc & Thể thao điện tử',
      details: 'Gu âm nhạc: Vinahouse, Viet Deep tràn đầy năng lượng khi tập luyện; game thủ Counter-Strike 2 (CS2) rèn luyện tư duy chiến thuật đồng đội.',
    },
  },
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: 'AI & Deep Learning',
    categoryKey: 'ai',
    iconName: 'Brain',
    skills: [
      { name: 'PyTorch', level: 85, badge: 'Framework' },
      { name: 'YOLOv5 (Object Detection)', level: 90, badge: 'Computer Vision' },
      { name: 'LightGBM / Boosting', level: 88, badge: 'Predictive ML' },
      { name: 'OpenCV', level: 82, badge: 'Image Processing' },
      { name: 'ResNet18 / VGG16', level: 80, badge: 'CNN Models' },
      { name: 'DenseNet121', level: 78, badge: 'Deep CNN' },
      { name: 'DistilBERT', level: 75, badge: 'NLP / Transformer' },
    ],
  },
  {
    name: 'Web & Backend Engineering',
    categoryKey: 'web',
    iconName: 'Code2',
    skills: [
      { name: 'Python', level: 92, badge: 'Core Language' },
      { name: 'FastAPI', level: 88, badge: 'Async REST' },
      { name: 'React', level: 85, badge: 'Frontend SPA' },
      { name: 'TypeScript', level: 82, badge: 'Type-Safe' },
      { name: 'JavaScript (ES6+)', level: 90, badge: 'DOM & Events' },
      { name: 'HTML5 Semantic', level: 95, badge: 'Markup Standard' },
      { name: 'CSS3 / Tailwind CSS', level: 90, badge: 'Modern Styling' },
      { name: 'SQLite', level: 85, badge: 'Database' },
    ],
  },
  {
    name: 'DevOps & Development Tools',
    categoryKey: 'tools',
    iconName: 'Cpu',
    skills: [
      { name: 'Docker', level: 78, badge: 'Containerization' },
      { name: 'Git & GitHub', level: 88, badge: 'Version Control' },
      { name: 'WSL2 (Ubuntu Linux)', level: 85, badge: 'Terminal / CLI' },
      { name: 'Vite', level: 90, badge: 'Fast Bundler' },
      { name: 'Three.js / WebGL', level: 80, badge: 'Interactive 3D' },
      { name: 'Vibe Coding with AI', level: 92, badge: 'Modern Workflow' },
    ],
  },
];

export const PROJECTS: ProjectItem[] = [
  {
    id: 'alpr',
    title: 'Automatic License Plate Recognition (ALPR)',
    subtitle: 'Nhận diện biển số xe tự động theo thời gian thực',
    category: 'AI & Computer Vision',
    description:
      'Hệ thống thị giác máy tính nhận diện và trích xuất ký tự biển số xe tự động phục vụ bãi đỗ xe thông minh và trạm thu phí không dừng ETC. Kết hợp mô hình YOLOv5 nhận diện bounding box biển số và pipeline xử lý ảnh thích ứng với OpenCV.',
    tags: ['Python', 'YOLOv5', 'OpenCV', 'PyTorch', 'Computer Vision'],
    metrics: [
      { label: 'Tốc độ xử lý', value: '~28 FPS' },
      { label: 'Độ chính xác mAP@0.5', value: '96.4%' },
      { label: 'Độ trễ suy luận', value: '< 35ms' },
    ],
    highlights: [
      'Huấn luyện mạng YOLOv5 phát hiện vùng biển số trong điều kiện ánh sáng yếu và góc nghiêng.',
      'Thuật toán làm sạch ảnh nhiễu, căn chỉnh góc xoay phối cảnh (perspective transform) tự động.',
      'Tách riêng mô-đun tiền xử lý và suy luận, sẵn sàng đóng gói Docker microservice.',
    ],
    architecture: [
      'Input Video Stream -> OpenCV Frame Capture -> Adaptive Bilateral Filter',
      'YOLOv5 Detector -> Perspective Rectification -> Character Segmentation & OCR',
      'Plate Validation -> SQLite Logging & REST API Response',
    ],
    githubUrl: 'https://github.com/dinhthanhthien10-bit',
    demoUrl: '#',
    thumbnailGradient: 'from-cyan-500/20 via-blue-600/20 to-slate-900',
  },
  {
    id: 'eta-logistics',
    title: 'Smart Logistics ETA Prediction',
    subtitle: 'Dự báo thời gian giao hàng & Tối ưu hóa điều phối',
    category: 'Smart Logistics',
    description:
      'Mô hình máy học dự đoán thời gian giao hàng ước tính (Estimated Time of Arrival) dựa trên phân tích đặc trưng đa biến: khoảng cách, thời tiết, khung giờ cao điểm và tải trọng phương tiện, ứng dụng kiến thức chuyên ngành Logistics UTH kết hợp kinh nghiệm thực chiến từ Grab.',
    tags: ['LightGBM', 'Python', 'Pandas', 'Scikit-Learn', 'Smart Logistics'],
    metrics: [
      { label: 'Sai số trung bình (MAE)', value: '±4.2 phút' },
      { label: 'Hệ số xác định (R²)', value: '0.912' },
      { label: 'Dữ liệu huấn luyện', value: '500K+ records' },
    ],
    highlights: [
      'Feature Engineering sâu sắc với dữ liệu không gian thời gian (spatial-temporal features).',
      'Tối ưu hóa siêu tham số (Hyperparameter tuning) qua Optuna trên thuật toán Gradient Boosting LightGBM.',
      'Giúp doanh nghiệp vận tải giảm tỷ lệ trễ hẹn giao hàng và tối ưu hóa kế hoạch tài xế.',
    ],
    architecture: [
      'Raw GPS & Timestamp Data -> Geo-Distance & Peak Hour Encoder -> Cleaned Dataset',
      'LightGBM Regressor -> 5-Fold Cross Validation -> Metric Evaluation (MAE, RMSE, R²)',
      'Inference Engine API -> Real-time ETA Output for Dispatchers',
    ],
    githubUrl: 'https://github.com/dinhthanhthien10-bit',
    demoUrl: '#',
    thumbnailGradient: 'from-emerald-500/20 via-teal-600/20 to-slate-900',
  },
  {
    id: 'gold-prediction',
    title: 'Gold Price Prediction Web Platform',
    subtitle: 'Nền tảng web dự báo xu hướng giá vàng thời gian thực',
    category: 'Web & System',
    description:
      'Ứng dụng web tài chính phân tích chuỗi thời gian (Time-series) và dự báo xu hướng giá vàng, xây dựng trên nền tảng FastAPI backend bất đồng bộ tốc độ cao kết hợp template động Jinja2 và trực quan hóa biểu đồ tương tác.',
    tags: ['FastAPI', 'Python', 'Machine Learning', 'Jinja2', 'Time Series'],
    metrics: [
      { label: 'Độ trễ phản hồi API', value: '< 15ms' },
      { label: 'Độ chính xác xu hướng', value: '88.5%' },
      { label: 'Tần suất cập nhật', value: 'Real-time' },
    ],
    highlights: [
      'Thu thập và chuẩn hóa dữ liệu lịch sử giá vàng thế giới và trong nước tự động.',
      'Backend FastAPI bất đồng bộ xử lý truy vấn nhanh, tích hợp mô hình dự báo thống kê.',
      'Giao diện trực quan hiển thị đường dự báo cùng dải tin cậy biến động.',
    ],
    architecture: [
      'Data Collector Worker -> Market Data API -> SQLite Time-Series Store',
      'Statistical ML Regressor -> Rolling Window Evaluation -> Trend Signal',
      'FastAPI Router -> Jinja2 Dynamic Views + ChartJS Visualizer',
    ],
    githubUrl: 'https://github.com/dinhthanhthien10-bit',
    demoUrl: '#',
    thumbnailGradient: 'from-amber-500/20 via-yellow-600/20 to-slate-900',
  },
  {
    id: 'uth-ecommerce',
    title: 'UTH Style E-Commerce Platform',
    subtitle: 'Nền tảng thương mại điện tử phong cách UTH Logistics',
    category: 'Web & System',
    description:
      'Hệ thống thương mại điện tử hiện đại tích hợp theo dõi đơn hàng và chuỗi logistics nội bộ phong cách sinh viên Đại học Giao thông Vận tải TP.HCM. Hỗ trợ giỏ hàng, phân loại hàng hóa thông minh, tính toán cước vận chuyển tức thì và quản lý trạng thái giao hàng.',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'FastAPI', 'E-Commerce'],
    metrics: [
      { label: 'Điểm Lighthouse UI', value: '98/100' },
      { label: 'Thời gian tải trang', value: '< 0.8s' },
      { label: 'Tính cước động', value: 'Tức thì' },
    ],
    highlights: [
      'Thiết kế giao diện hiện đại chuẩn Responsive thích ứng từ Mobile đến Desktop 4K.',
      'Tích hợp công cụ tính toán trọng lượng thể tích (DIM Weight) và dự báo chi phí vận chuyển.',
      'Quản lý trạng thái giỏ hàng và danh mục sản phẩm mượt mà với React Hooks & Zustand.',
    ],
    architecture: [
      'Vite + React UI Client -> Zustand State Store -> Tailwind Design System',
      'REST API Client -> FastAPI Backend -> Product & Order Relational Database',
      'Logistics Module -> Dynamic Shipping Cost Calculator',
    ],
    githubUrl: 'https://github.com/dinhthanhthien10-bit',
    demoUrl: '#',
    thumbnailGradient: 'from-blue-600/20 via-indigo-600/20 to-slate-900',
  },
  {
    id: 'barber-booking',
    title: 'Barber Shop Scheduling App',
    subtitle: 'Hệ thống đặt lịch & Quản lý dịch vụ salon thông minh',
    category: 'Web & System',
    description:
      'Giải pháp quản lý lịch hẹn và điều phối thợ trực tuyến cho tiệm salon tóc, giải quyết triệt để bài toán trùng giờ hẹn (overbooking), tự động thông báo và thống kê báo cáo doanh thu theo thời gian thực.',
    tags: ['Python', 'FastAPI', 'SQLite', 'Scheduling Logic', 'Fullstack'],
    metrics: [
      { label: 'Tỉ lệ xung đột lịch', value: '0%' },
      { label: 'Thời gian hoàn tất đặt', value: '< 30 giây' },
      { label: 'Dung lượng hệ thống', value: 'Siêu nhẹ' },
    ],
    highlights: [
      'Thuật toán kiểm tra lịch trống (Slot Availability) theo thời gian thực chống Race Condition.',
      'Thiết kế cơ sở dữ liệu quan hệ SQLite chuẩn hóa (3NF) dễ bảo trì và mở rộng.',
      'Bảng điều khiển trực quan cho quản lý theo dõi lịch hẹn và hiệu suất từng nhân sự.',
    ],
    architecture: [
      'Client Booking Portal -> Real-Time Slot Verification Engine',
      'FastAPI Endpoint -> SQLite Atomic Transaction Lock (No Overlap)',
      'Management Dashboard -> Revenue & Schedule Analytics',
    ],
    githubUrl: 'https://github.com/dinhthanhthien10-bit',
    demoUrl: '#',
    thumbnailGradient: 'from-purple-500/20 via-violet-600/20 to-slate-900',
  },
];

export const PROJECTS_MAP: Record<string, ProjectItem> = PROJECTS.reduce(
  (acc, proj) => {
    acc[proj.id] = proj;
    return acc;
  },
  {} as Record<string, ProjectItem>
);

export interface CarouselLogo {
  name: string;
  category: string;
  badge: string;
}

export const CAROUSEL_ROW_1: CarouselLogo[] = [
  { name: 'PyTorch', category: 'Deep Learning', badge: 'AI Framework' },
  { name: 'YOLOv5', category: 'Computer Vision', badge: 'Object Detection' },
  { name: 'LightGBM', category: 'Machine Learning', badge: 'Predictive Tree' },
  { name: 'OpenCV', category: 'Vision Library', badge: 'Image Processing' },
  { name: 'FastAPI', category: 'Backend Engine', badge: 'High-Perf REST' },
  { name: 'Python', category: 'Core Language', badge: 'AI & Data' },
  { name: 'React 18', category: 'Frontend', badge: 'Component UI' },
  { name: 'TypeScript', category: 'Type Safety', badge: 'Scalable Code' },
];

export const CAROUSEL_ROW_2: CarouselLogo[] = [
  { name: 'ĐH GTVT TP.HCM (UTH)', category: 'University', badge: 'Smart Logistics' },
  { name: 'Grab Vietnam', category: 'Real-world Ops', badge: 'ETA & Delivery' },
  { name: 'Revu Vietnam', category: 'Creator Platform', badge: 'Content Collaboration' },
  { name: 'Ways Station', category: 'Service Ops', badge: 'Customer Exp' },
  { name: 'Docker', category: 'Container', badge: 'DevOps' },
  { name: 'Tailwind CSS', category: 'Styling', badge: 'Design System' },
  { name: 'Three.js / WebGL', category: '3D Graphics', badge: 'Interactive Canvas' },
  { name: 'WSL2 Ubuntu', category: 'OS Environment', badge: 'Linux Terminal' },
];
```

---

## 2. QUẢN LÝ TRẠNG THÁI ZUSTAND (`src/store/usePortfolioStore.ts`)

```typescript
import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';

interface PortfolioState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  selectedProjectId: string | null;
  setSelectedProject: (id: string | null) => void;
  isSceneLoaded: boolean;
  setSceneLoaded: (loaded: boolean) => void;
  customModelUrl: string | null;
  customModelName: string | null;
  setCustomModel: (url: string | null, name?: string | null) => void;
  resetCustomModel: () => void;
  isAudioMuted: boolean;
  toggleAudioMuted: () => void;
  setAudioMuted: (muted: boolean) => void;
  revTriggerCount: number;
  revEngine: () => void;
  isUiHidden: boolean;
  toggleUiHidden: () => void;
  setLoadingError: (hasError: boolean) => void;
  setSplineApp: (app: unknown) => void;
}

const getInitialTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('portfolio-theme') as ThemeMode;
    if (saved === 'dark' || saved === 'light') {
      if (saved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return saved;
    }
  }
  if (typeof document !== 'undefined') {
    document.documentElement.classList.add('dark');
  }
  return 'dark';
};

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  theme: getInitialTheme(),
  activeSection: 'home',
  isMobileMenuOpen: false,
  selectedProjectId: null,
  isSceneLoaded: false,
  customModelUrl: null,
  customModelName: null,
  isUiHidden: false,
  isAudioMuted: true,
  revTriggerCount: 0,

  toggleTheme: () => {
    const newTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme: newTheme });
  },

  setTheme: (theme: ThemeMode) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('portfolio-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    set({ theme });
  },

  setActiveSection: (section: string) => {
    set({ activeSection: section });
  },

  toggleMobileMenu: () => {
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen }));
  },

  closeMobileMenu: () => {
    set({ isMobileMenuOpen: false });
  },

  setSelectedProject: (id: string | null) => {
    set({ selectedProjectId: id });
  },

  setSceneLoaded: (loaded: boolean) => {
    set({ isSceneLoaded: loaded });
  },

  setCustomModel: (url: string | null, name: string | null = null) => {
    set({ customModelUrl: url, customModelName: name });
  },

  resetCustomModel: () => {
    set({ customModelUrl: null, customModelName: null });
  },

  toggleAudioMuted: () => {
    set((s) => ({ isAudioMuted: !s.isAudioMuted }));
  },

  setAudioMuted: (muted: boolean) => {
    set({ isAudioMuted: muted });
  },

  revEngine: () => {
    set((s) => ({ revTriggerCount: s.revTriggerCount + 1 }));
  },

  toggleUiHidden: () => {
    set((s) => ({ isUiHidden: !s.isUiHidden }));
  },

  setLoadingError: () => {},
  setSplineApp: () => {},
}));
```

---

## 3. THREE.JS PARTICLE WAVE CANVAS (`src/components/canvas/HeroThreeBackground.tsx`)

```typescript
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroThreeBackgroundProps {
  className?: string;
}

export const HeroThreeBackground: React.FC<HeroThreeBackgroundProps> = ({
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0b0c10, 0.08);

    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 7.5);
    camera.lookAt(0, -0.5, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Circular Glow Particle Texture
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(0, 242, 254, 0.85)');
      grad.addColorStop(0.7, 'rgba(0, 91, 170, 0.35)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    // 4. Particle Wave / Cybernetic Grid (55 x 45 grid)
    const cols = 55;
    const rows = 45;
    const numPoints = cols * rows;

    const positions = new Float32Array(numPoints * 3);
    const colors = new Float32Array(numPoints * 3);

    const uthBlue = new THREE.Color(0x005baa);
    const cyanNeon = new THREE.Color(0x00f2fe);
    const tempCol = new THREE.Color();

    const spacingX = 0.38;
    const spacingZ = 0.38;
    const offsetX = (cols * spacingX) / 2;
    const offsetZ = (rows * spacingZ) / 2;

    let index = 0;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * spacingX - offsetX;
        const z = r * spacingZ - offsetZ;
        const y = 0;

        positions[index * 3] = x;
        positions[index * 3 + 1] = y;
        positions[index * 3 + 2] = z;

        const distFromCenter = Math.sqrt(x * x + z * z) / 10;
        const ratio = Math.max(0, Math.min(1, 1 - distFromCenter * 0.8));
        tempCol.copy(uthBlue).lerp(cyanNeon, ratio);

        colors[index * 3] = tempCol.r;
        colors[index * 3 + 1] = tempCol.g;
        colors[index * 3 + 2] = tempCol.b;

        index++;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.085,
      map: particleTexture,
      transparent: true,
      opacity: 0.8,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(geometry, material);
    particleSystem.position.set(0, -1.2, -1.5);
    scene.add(particleSystem);

    // 5. Mouse Parallax Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      mouse.targetX = (e.clientX - halfW) / halfW;
      mouse.targetY = (e.clientY - halfH) / halfH;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 6. Window Resize
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop (60 FPS smooth wave)
    const clock = new THREE.Clock();
    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse LERP
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      particleSystem.rotation.y = mouse.x * 0.15;
      particleSystem.rotation.x = -mouse.y * 0.1;

      // Compound sinusoidal waves across vertices
      const posAttr = geometry.attributes.position as THREE.BufferAttribute;
      const posArr = posAttr.array as Float32Array;

      let idx = 0;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = posArr[idx * 3];
          const z = posArr[idx * 3 + 2];

          const wave1 = Math.sin(x * 0.5 + elapsedTime * 1.4) * 0.32;
          const wave2 = Math.cos(z * 0.6 + elapsedTime * 1.1) * 0.28;
          const wave3 = Math.sin((x + z) * 0.3 + elapsedTime * 0.8) * 0.18;

          posArr[idx * 3 + 1] = wave1 + wave2 + wave3;
          idx++;
        }
      }

      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none select-none z-[-1] ${className}`}>
      <div ref={containerRef} className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-transparent to-[#0b0c10]/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0c10] via-transparent to-[#0b0c10]" />
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
    </div>
  );
};
```

---

## 4. KHUNG AVATAR BENTO CÔNG NGHỆ CAO (`src/components/ui/AvatarBentoCard.tsx`)

```typescript
import React, { useState, useRef } from 'react';
import { GraduationCap, Sparkles, ShieldCheck } from 'lucide-react';

interface AvatarBentoCardProps {
  className?: string;
  imageSrc?: string;
}

export const AvatarBentoCard: React.FC<AvatarBentoCardProps> = ({
  className = '',
  imageSrc = '/assets/avatar-uth.png',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [spotlightPos, setSpotlightPos] = useState<{ x: number; y: number }>({ x: 200, y: 200 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full max-w-[460px] mx-auto p-[2px] rounded-3xl group transition-all duration-500 ${className}`}
    >
      {/* 1. Animated Glow Border (Cyan -> UTH Blue -> Teal gradient aura) */}
      <div className="absolute -inset-[2px] rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-teal-400 opacity-70 group-hover:opacity-100 blur-lg transition-all duration-500" />
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-teal-400" />

      {/* 2. Inner Glassmorphism Card Container */}
      <div className="relative w-full h-[490px] sm:h-[550px] md:h-[590px] rounded-[22px] bg-gradient-to-b from-slate-900/95 via-[#0e1726]/95 to-[#0b0c10] overflow-hidden flex flex-col justify-between backdrop-blur-2xl">
        {/* Dynamic Spotlight Radial Layer */}
        {isHovered && (
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300"
            style={{
              background: `radial-gradient(450px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(0, 242, 254, 0.16), transparent 60%)`,
            }}
          />
        )}

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        {/* TOP FLOATING BADGES */}
        <div className="relative z-20 p-5 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/90 border border-cyan-500/40 text-xs font-semibold text-cyan-300 backdrop-blur-xl shadow-lg">
            <GraduationCap className="h-4 w-4 text-cyan-400 shrink-0" />
            <span className="font-mono text-[11px] tracking-tight">Sinh viên CNTT & Smart Logistics - UTH</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active</span>
          </div>
        </div>

        {/* CENTER AVATAR IMAGE */}
        <div className="relative flex-1 flex items-end justify-center px-4 overflow-hidden">
          <div className="absolute bottom-12 w-72 h-72 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl pointer-events-none" />

          <img
            src={imageSrc}
            alt="Đinh Thanh Thiên - Sinh viên UTH Chibi"
            className="relative z-10 w-full h-[92%] object-contain object-bottom filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] group-hover:scale-105 group-hover:drop-shadow-[0_20px_45px_rgba(0,242,254,0.3)] transition-transform duration-500 ease-out"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/images/thien-chibi.png';
            }}
          />

          <div className="absolute bottom-2 w-56 h-6 bg-black/60 rounded-full blur-md z-10 pointer-events-none" />
        </div>

        {/* BOTTOM FLOATING BADGES */}
        <div className="relative z-20 p-5 flex items-center justify-between gap-2 border-t border-white/5 bg-slate-950/60 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            </div>
            <div>
              <span className="block text-[11px] font-mono font-bold text-white">
                GPA 3.08 • AI & Vibe Coding
              </span>
              <span className="block text-[9px] font-mono text-cyan-400">
                52 / 120 Tín Chỉ Hoàn Tất
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
            <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
            <span>Verified Dossier</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```
