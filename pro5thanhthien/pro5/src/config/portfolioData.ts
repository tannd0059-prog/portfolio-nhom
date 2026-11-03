/**
 * Dữ liệu Portfolio tập trung (Centralized Portfolio Data)
 * Đinh Thanh Thiên — Trường Đại học Giao thông Vận tải TP.HCM (UTH)
 *
 * Professional Public Profile — Data Sanitized (No private IDs, exact addresses or placeholder phones)
 */

export interface ProjectMetric {
  label: string;
  value: string;
}

export type ProjectCategory = 'Tất cả' | 'AI & Computer Vision' | 'Smart Logistics' | 'Web & System';

export type DemoType =
  | 'eta-simulator'
  | 'surveillance-cctv'
  | 'dim-freight'
  | 'music-radar'
  | 'dev-card'
  | null;

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
  /** Key that maps to an interactive inline demo component in ProjectModal */
  demoType?: DemoType;
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
  academicStatus: 'Sinh viên Chính quy • Khóa 2024 - 2028',
  cohort: 'Niên khóa 2024 - 2028',
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
    percent: '43.3%',
  },
  github: 'https://github.com/dinhthanhthien10-bit',
  email: 'dinhthanhthien.work@gmail.com',
  location: 'TP. Hồ Chí Minh, Việt Nam',
  status: 'Open for AI, Smart Logistics & Fullstack Software Opportunities',
  bio: 'Sinh viên ngành Logistics thông minh & Công nghệ thông tin tại UTH với GPA 3.08/4.0. Đam mê kết hợp Trí tuệ nhân tạo (Computer Vision, Machine Learning, Deep Learning) vào bài toán tối ưu hóa vận tải, định tuyến và phát triển phần mềm hiện đại.',
  careerGoals: {
    shortTerm:
      'Làm chủ quy trình Vibe Coding, củng cố chuyên sâu kiến trúc Deep Learning (YOLO, ResNet, DistilBERT) và thuật toán Gradient Boosting (LightGBM) để giải quyết các bài toán định tuyến và dự báo giao hàng thực tế.',
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
      company: 'Ways Station',
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
    id: 'eta-logistics',
    title: 'Logistics ETA Prediction System',
    subtitle: 'Dự báo thời gian giao hàng & Tối ưu điều phối với LightGBM',
    category: 'Smart Logistics',
    description:
      'Hệ thống máy học cao cấp xử lý dữ liệu vận tải chuỗi cung ứng thực tế, tự động hóa Feature Engineering và huấn luyện mô hình hồi quy Gradient Boosting LightGBM nhằm tối ưu hóa độ chính xác thời gian dự kiến giao hàng (ETA), giải quyết bài toán tắc nghẽn cảng biển và điều phối tài xế.',
    tags: ['Python', 'LightGBM', 'Pandas', 'Scikit-Learn', 'Feature Engineering', 'Logistics'],
    metrics: [
      { label: 'Mô hình ML', value: 'LightGBM' },
      { label: 'Sai số trung bình', value: '±3.8 phút' },
      { label: 'Hệ số R²', value: '0.924' },
    ],
    highlights: [
      'Xử lý tập dữ liệu giao vận quy mô lớn với pipeline trích xuất đặc trưng không-thời gian (spatial-temporal).',
      'Tối ưu hóa siêu tham số tự động, chống Overfitting bằng K-Fold Cross Validation.',
      'Đóng gói file model `lgbm_eta_model.pkl` sẵn sàng cho suy luận độ trễ thấp ở Production.',
    ],
    architecture: [
      'Raw GPS & Fleet Sensors -> Geohash & Peak-Hour Feature Pipeline',
      'LightGBM Regressor -> 5-Fold Cross Validation -> Hyperparameter Tuning',
      'Inference Engine -> Real-Time ETA Dispatch API',
    ],
    githubUrl: 'https://github.com/dinhthanhthien10-bit/ETA-LOGISTICS',
    demoUrl: 'https://github.com/dinhthanhthien10-bit/ETA-LOGISTICS',
    thumbnailGradient: 'from-emerald-500/20 via-teal-600/20 to-slate-900',
    demoType: 'eta-simulator',
  },
  {
    id: 'smart-ai-surveillance',
    title: 'Smart AI Surveillance & Real-Time Alert',
    subtitle: 'Hệ thống giám sát camera thông minh & Cảnh báo an ninh Telegram',
    category: 'AI & Computer Vision',
    description:
      'Hệ sinh thái giám sát an ninh camera thời gian thực kết hợp FastAPI, OpenCV và mô hình YOLO Object Detection cục bộ. Hệ thống tự động phân tích luồng RTSP/Webcam, nhận diện người và phương tiện xâm nhập khu vực cấm, lưu snapshot bằng chứng vào SQLite và gửi tin nhắn cảnh báo tức thì qua Telegram Bot API.',
    tags: ['FastAPI', 'OpenCV', 'YOLO', 'Python', 'Telegram Bot', 'Computer Vision'],
    metrics: [
      { label: 'Độ trễ phát hiện', value: '< 25ms' },
      { label: 'Độ chính xác YOLO', value: '95.2%' },
      { label: 'Tốc độ cảnh báo', value: 'Tức thì' },
    ],
    highlights: [
      'Xử lý luồng hình ảnh thời gian thực với OpenCV & tối ưu hóa suy luận mô hình YOLO.',
      'Bộ quy tắc phát hiện xâm nhập thông minh (ROI & Intrusion Logic) giảm thiểu cảnh báo giả.',
      'Tự động chụp snapshot bằng chứng, lưu lịch sử sự kiện và gửi ảnh trực tiếp đến Telegram Admin.',
    ],
    architecture: [
      'RTSP/Webcam Stream -> OpenCV Frame Reader -> Preprocessing & ROI Filter',
      'YOLO Detection Engine -> Intrusion Rule Evaluator -> SQLite Event Log',
      'Telegram Bot API Dispatcher -> Push Notification & Snapshot Photo',
    ],
    githubUrl: 'https://github.com/dinhthanhthien10-bit/smart-ai-surveillance',
    demoUrl: 'https://github.com/dinhthanhthien10-bit/smart-ai-surveillance',
    thumbnailGradient: 'from-cyan-500/20 via-blue-600/20 to-slate-900',
    demoType: 'surveillance-cctv',
  },
  {
    id: 'smart-logistics-api',
    title: 'Smart Logistics Freight & Routing Engine',
    subtitle: 'API tính cước B2B & Khối lượng quy đổi DIM Weight tối ưu',
    category: 'Smart Logistics',
    description:
      'Dịch vụ REST API chuyên sâu cho vận tải B2B, cung cấp thuật toán tính toán cước phí và khối lượng thể tích quy đổi (DIM Weight / CBM) cho cả đường bộ, đường biển và đường hàng không. Hỗ trợ doanh nghiệp xác định chính xác Chargeable Weight và tối ưu hóa không gian xếp dỡ container.',
    tags: ['Python', 'REST API', 'DIM Weight', 'B2B Logistics', 'Flask', 'Freight Engine'],
    metrics: [
      { label: 'Thời gian tính toán', value: '< 8ms' },
      { label: 'Chuẩn quy đổi', value: 'IATA & FMC' },
      { label: 'Kiến trúc', value: 'Microservice' },
    ],
    highlights: [
      'Thuật toán tính toán khối lượng quy đổi (Dimensional Weight) tự động chuẩn hóa hệ số hàng không (1:5000 / 1:6000) và đường biển (CBM).',
      'Xác định Trọng lượng tính cước (Chargeable Weight) giữa Gross Weight và Volumetric Weight tức thì.',
      'Thiết kế chuẩn RESTful, có sẵn cơ chế Seed Data mẫu B2B phục vụ tích hợp ERP.',
    ],
    architecture: [
      'Cargo Dimensions (L x W x H) & Gross Weight -> Metric Normalizer',
      'Freight Engine -> Divisor Factor Selector (Air/Sea/Road) -> DIM vs Actual Weight',
      'Chargeable Weight Decision -> B2B Rate Tariff Engine -> JSON Response',
    ],
    githubUrl: 'https://github.com/dinhthanhthien10-bit/smart-logistics-api',
    demoUrl: 'https://github.com/dinhthanhthien10-bit/smart-logistics-api',
    thumbnailGradient: 'from-blue-600/20 via-indigo-600/20 to-slate-900',
    demoType: 'dim-freight',
  },
  {
    id: 'music-recommender-project',
    title: 'Personalized Music Recommender Platform',
    subtitle: 'Nền tảng nghe nhạc trực tuyến & Gợi ý bài hát thông minh bằng K-Means',
    category: 'Web & System',
    description:
      'Nền tảng nghe nhạc trực tuyến hoàn chỉnh tích hợp hệ thống trí tuệ nhân tạo phân cụm và gợi ý bài hát theo gu cá nhân (K-Means Clustering & Recommender System). Hệ thống phân tích sâu các chỉ số âm học như Danceability, Energy, Valence để tìm kiếm bài hát tương đồng tối ưu cho người nghe.',
    tags: ['Python', 'K-Means', 'Machine Learning', 'Music System', 'Alembic', 'Fullstack'],
    metrics: [
      { label: 'Thuật toán gợi ý', value: 'K-Means Clustered' },
      { label: 'Độ hài lòng người nghe', value: '91.8%' },
      { label: 'Số thuộc tính âm học', value: '8 Audio Features' },
    ],
    highlights: [
      'Mô hình K-Means gom cụm thư viện âm nhạc theo vector đặc trưng âm thanh thực tế.',
      'Tính năng đăng ký, nghe nhạc trực tuyến, tìm kiếm và tạo Playlist tương thích đa gu.',
      'Gợi ý bài hát tương đồng theo thời gian thực dựa trên khoảng cách Euclidean trong không gian đặc trưng.',
    ],
    architecture: [
      'Audio Feature Vector (Energy, Valence, Tempo) -> StandardScaler Normalizer',
      'K-Means Clustering Pipeline -> Nearest Neighbors Search',
      'Web Player UI -> Streaming Client & Playlist Recommendation Queue',
    ],
    githubUrl: 'https://github.com/dinhthanhthien10-bit/music-recommender-project',
    demoUrl: 'https://github.com/dinhthanhthien10-bit/music-recommender-project',
    thumbnailGradient: 'from-purple-500/20 via-violet-600/20 to-slate-900',
    demoType: 'music-radar',
  },
  {
    id: 'social-profile-extractor',
    title: 'Social Profile & Dev Intelligence Extractor',
    subtitle: 'RESTful API trích xuất dữ liệu hồ sơ developer thời gian thực',
    category: 'Web & System',
    description:
      'Hệ thống trích xuất dữ liệu công khai (OSINT & Developer Profile) thời gian thực siêu nhẹ qua một endpoint REST duy nhất. Hỗ trợ bóc tách cấu trúc hồ sơ GitHub, phân tích ngôn ngữ lập trình chủ đạo, đóng góp open-source và sức khỏe kho mã nguồn mà không bị chặn IP hay rào cản Captcha.',
    tags: ['Python', 'Flask', 'BeautifulSoup4', 'OSINT', 'Data Scraping', 'REST API'],
    metrics: [
      { label: 'Tốc độ phản hồi', value: '< 180ms' },
      { label: 'Độ sạch dữ liệu', value: '100% JSON' },
      { label: 'Xử lý Captcha', value: 'Zero-Block' },
    ],
    highlights: [
      'Trích xuất cấu trúc dữ liệu sạch mà không cần máy khách phải xử lý HTML phức tạp.',
      'Phân tích tự động tỷ lệ các ngôn ngữ lập trình và các repository nổi bật của developer.',
      'Dễ dàng tích hợp vào hệ thống tuyển dụng công nghệ, đánh giá ứng viên hoặc CRM doanh nghiệp.',
    ],
    architecture: [
      'Profile Username Request -> Low-Latency Scraper Worker',
      'BeautifulSoup4 Clean Parser -> Metric Normalizer & Repository Extractor',
      'Structured JSON Response -> Developer Radar Visualizer Client',
    ],
    githubUrl: 'https://github.com/dinhthanhthien10-bit/social-profile-extractor',
    demoUrl: 'https://github.com/dinhthanhthien10-bit/social-profile-extractor',
    thumbnailGradient: 'from-amber-500/20 via-yellow-600/20 to-slate-900',
    demoType: 'dev-card',
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
