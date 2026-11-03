# DANH MỤC TẬP TIN & THÀNH PHẦN (FILE INVENTORY)
**Mã tài liệu:** `AUDIT-PORTFOLIO-THIEN-02`  
**Dự án:** Portfolio Cá Nhân Đinh Thanh Thiên — UTH  
**Quy mô kiểm toán:** Toàn bộ tập tin trong workspace (loại trừ `node_modules`, `.git`, `dist`)

---

## 1. BẢNG TỔNG KẾT DANH MỤC TẬP TIN (FILE INVENTORY MATRIX)

| STT | Đường dẫn tập tin | Loại tập tin | Trách nhiệm & Nội dung chính | Mức độ quan trọng | Trạng thái hiện tại |
| :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | `package.json` | Config / JSON | Khai báo dependencies (React 18, Three.js, GSAP, Tailwind, Zustand, Spline) và scripts | **Critical** | Active |
| 2 | `package-lock.json` | Lockfile | Khóa phiên bản chi tiết của cây phụ thuộc npm | **Critical** | Active |
| 3 | `tsconfig.json` | Config / JSON | Cấu hình TypeScript compiler (Strict mode, JSX React-JSX, path alias `@/*`) | **Critical** | Active |
| 4 | `tsconfig.node.json` | Config / JSON | Cấu hình TypeScript cho các script Node / Vite | **Medium** | Active |
| 5 | `vite.config.ts` | Config / TS | Cấu hình Vite bundler, alias `@`, manualChunks Rollup, dev server port 3000 | **Critical** | Active |
| 6 | `tailwind.config.js` | Config / JS | Bảng màu UTH, font Inter & JetBrains Mono, keyframes marquee & float | **Critical** | Active |
| 7 | `postcss.config.js` | Config / JS | Cấu hình PostCSS với Tailwind CSS & Autoprefixer | **Critical** | Active |
| 8 | `index.html` | HTML Entry | Trang gốc HTML, thẻ meta SEO, liên kết Google Fonts, `#root` element | **Critical** | Active |
| 9 | `.env` | Env Config | Khai báo biến môi trường `VITE_SPLINE_SCENE_URL` | **Medium** | Active |
| 10 | `.env.example` | Env Template | File mẫu biến môi trường phục vụ cấu hình | **Low** | Active |
| 11 | `src/main.tsx` | TSX Entry | Điểm khởi chạy React DOM, render `<App />` vào DOM root với `StrictMode` | **Critical** | Active |
| 12 | `src/App.tsx` | TSX Component | Component gốc tập hợp toàn bộ các Section theo luồng cuộn dọc | **Critical** | Active |
| 13 | `src/index.css` | Styling / CSS | Chỉ thị `@tailwind`, thanh cuộn tùy biến, lớp `.glass-panel`, CSS variables | **Critical** | Active |
| 14 | `src/vite-env.d.ts` | TS Definition | Khai báo kiểu môi trường Vite client (`ImportMetaEnv`) | **Medium** | Active |
| 15 | `src/config/portfolioData.ts` | TS Data | **Kho dữ liệu duy nhất (Single Source of Truth)** của Đinh Thanh Thiên | **Critical** | Active |
| 16 | `src/config/sceneConfig.ts` | TS Config | Cấu hình ánh xạ Spline 3D Scene, triggers camera và raycasting targets | **Medium** | Legacy/Fallback |
| 17 | `src/store/usePortfolioStore.ts` | TS State | Zustand store quản lý Theme, Active Section, Modal, Menu, Audio | **Critical** | Active |
| 18 | `src/hooks/useKeyboardNavigation.ts` | TS Hook | Hook lắng nghe phím tắt `[1-4]`, `[H]`, `[Esc]` điều hướng nhanh | **Medium** | Legacy/Active |
| 19 | `src/components/ui/Navbar.tsx` | TSX Component | Thanh điều hướng trên cùng, logo THIEN.3D, nút Dark/Light, Mobile menu | **Critical** | Active |
| 20 | `src/components/ui/HeroSection.tsx` | TSX Component | Hero Section 2 cột: Thông tin UTH, chỉ số GPA/mAP, nút CTA & Avatar Bento | **Critical** | Active |
| 21 | `src/components/ui/AvatarBentoCard.tsx` | TSX Component | Khung avatar Bento công nghệ cao, viền gradient phát sáng, Spotlight chuột | **Critical** | Active |
| 22 | `src/components/ui/LogoCarousel.tsx` | TSX Component | Marquee 2 hàng chạy vô tận ngược chiều lấy cảm hứng từ MiladiCode | **High** | Active |
| 23 | `src/components/ui/BentoGridSection.tsx` | TSX Component | Lưới Bento 5 thẻ: Giới thiệu, Học vấn, Kinh nghiệm, Đời sống, DIM Calculator | **Critical** | Active |
| 24 | `src/components/ui/SkillsSection.tsx` | TSX Component | Bảng kỹ năng kỹ thuật với bộ lọc tab (All, AI, Web, Tools) và thanh % | **High** | Active |
| 25 | `src/components/ui/ProjectsSection.tsx` | TSX Component | Bộ sưu tập 5 dự án với bộ lọc thể loại Tabs và trigger mở Modal chi tiết | **Critical** | Active |
| 26 | `src/components/ui/ProjectModal.tsx` | TSX Component | Cửa sổ pop-up hiển thị chi tiết kiến trúc, metrics, highlights của dự án | **High** | Active |
| 27 | `src/components/ui/ContactSection.tsx` | TSX Component | Biểu mẫu liên hệ với JS Regex validation, touch state, thẻ thông tin trực tiếp | **Critical** | Active |
| 28 | `src/components/ui/Footer.tsx` | TSX Component | Chân trang ngữ nghĩa, chứng nhận Rubric 19/19, nút Cuộn lên đầu trang | **High** | Active |
| 29 | `src/components/ui/LoadingScreen.tsx` | TSX Component | Màn hình chờ khởi tạo 3D với hiệu ứng Cyber Ring và nút Skip nếu quá 12s | **Medium** | Standby/Fallback |
| 30 | `src/components/ui/OverlayLayout.tsx` | TSX Component | Layout tầng giao diện cũ của phiên bản Spline viewport tĩnh | **Low** | Obsolete/Legacy |
| 31 | `src/components/ui/sections/HomeSection.tsx` | TSX Component | Tab Home của phiên bản Spline tĩnh cũ | **Low** | Obsolete/Legacy |
| 32 | `src/components/ui/sections/AboutSection.tsx` | TSX Component | Tab About của phiên bản Spline tĩnh cũ | **Low** | Obsolete/Legacy |
| 33 | `src/components/ui/sections/ProjectsSection.tsx` | TSX Component | Tab Projects của phiên bản Spline tĩnh cũ | **Low** | Obsolete/Legacy |
| 34 | `src/components/ui/sections/ContactSection.tsx` | TSX Component | Tab Contact của phiên bản Spline tĩnh cũ | **Low** | Obsolete/Legacy |
| 35 | `src/components/canvas/HeroThreeBackground.tsx` | TSX Component | Three.js WebGL Particle Wave Canvas 60 FPS gắn tại nền Hero | **Critical** | Active |
| 36 | `src/components/canvas/Avatar3DViewer.tsx` | TSX Component | Bộ hiển thị 3D Procedural Rig sinh viên UTH + Upload/Load GLTF | **High** | Alternate 3D |
| 37 | `src/components/canvas/Hero3DScene.tsx` | TSX Component | Cảnh Three.js WebGL Hologram Chibi UTH + Starfield & Orbital Rings | **Medium** | Alternate 3D |
| 38 | `src/components/canvas/HeroInteractiveChibi.tsx`| TSX Component | Nhân vật Chibi 2.5D tách đầu/thân liếc nhìn theo chuột (GSAP) | **Low** | Superseded |
| 39 | `src/components/canvas/BikeDriveBy.tsx` | TSX Component | Hoạt họa xe độ kéo ga lướt qua + Web Audio API bộ tạo âm thanh | **Low** | Deprecated |
| 40 | `src/components/canvas/CyberHighwayBg.tsx` | TSX Component | Nền đường cao tốc Three.js kết hợp video loop | **Low** | Superseded |
| 41 | `src/components/canvas/SplineCanvas.tsx` | TSX Component | Canvas bọc thư viện Spline Runtime 3D ban đầu | **Medium** | Fallback/Legacy |
| 42 | `public/assets/exhaust-sound.mp3` | Audio / MP3 | Tệp âm thanh tiếng pô xe máy phục vụ `BikeDriveBy.tsx` | **Low** | Asset |
| 43 | `public/images/thien-avatar.jpg` | Image / JPG | Ảnh chụp chân dung thực tế của Đinh Thanh Thiên | **High** | Asset |
| 44 | `docs/spline_architecture_guide.md` | Markdown Doc | Tài liệu kiến trúc hướng dẫn tích hợp Spline 3D vào Web hiện đại | **Medium** | Reference |
| 45 | `docs/SPLINE_SETUP_GUIDE.md` | Markdown Doc | Hướng dẫn cấu hình và xuất file scene từ Spline Editor | **Medium** | Reference |

---

## 2. PHÂN TÍCH CHI TIẾT CÁC TẬP TIN CỐT LÕI (DETAILED BREAKDOWN)

### 2.1. `src/config/portfolioData.ts` (CRITICAL)
- **Mục đích:** Là nơi lưu trữ toàn bộ nội dung văn bản, thông số kỹ thuật, hồ sơ cá nhân và cấu trúc dự án của Đinh Thanh Thiên.
- **Các Export chính:**
  - `PROFILE`: Chứa họ tên, ngày sinh, quê quán, MSSV, khóa học, chuyên ngành UTH, GPA 3.08/4.0, số tín chỉ (52/120), mục tiêu ngắn hạn & dài hạn, kinh nghiệm làm việc (Grab, Ways Station, Revu Vietnam), sở thích (Muay Thái, Wave 54zz, CS2).
  - `SKILL_GROUPS`: Mảng gồm 3 nhóm kỹ năng (AI & Deep Learning, Web & Backend Engineering, DevOps & Development Tools) với mức độ % và nhãn badge.
  - `PROJECTS`: Danh sách 5 dự án thực chiến (`alpr`, `eta-logistics`, `gold-prediction`, `uth-ecommerce`, `barber-booking`) kèm thông số metrics, pipeline kiến trúc, highlights, link GitHub.
  - `PROJECTS_MAP`: Object tra cứu nhanh dự án theo key `id`.
  - `CAROUSEL_ROW_1` & `CAROUSEL_ROW_2`: Dữ liệu cho 2 hàng logo đối tác & công nghệ trong Marquee.
- **Dependencies:** Không phụ thuộc thư viện ngoài (Pure TypeScript).

### 2.2. `src/store/usePortfolioStore.ts` (CRITICAL)
- **Mục đích:** Quản lý state toàn cục bằng thư viện Zustand.
- **Các State & Actions chính:**
  - `theme`: Kiểu `'dark' | 'light'`, tự động đồng bộ class `.dark` vào `document.documentElement` và lưu vào `localStorage`.
  - `toggleTheme()` / `setTheme(mode)`: Hàm chuyển đổi theme.
  - `activeSection`: Quản lý section đang hiển thị hoặc đang được scroll spy.
  - `isMobileMenuOpen`: Đóng/mở mobile drawer navigation.
  - `selectedProjectId`: `string | null` phục vụ mở/đóng `ProjectModal`.
  - `isAudioMuted` / `revTriggerCount`: Quản lý trạng thái âm thanh pô xe.
  - `isSceneLoaded` / `customModelUrl` / `customModelName`: Trạng thái nạp 3D model.
- **Dependencies:** `zustand`.

### 2.3. `src/App.tsx` (CRITICAL)
- **Mục đích:** Thành phần gốc điều phối toàn bộ trải nghiệm cuộn trang của người dùng.
- **Cấu trúc render:**
  1. `<Navbar />` (Cố định ở đỉnh trang)
  2. `<main>`:
     - `<HeroSection />`
     - `<LogoCarousel />`
     - `<BentoGridSection />`
     - `<SkillsSection />`
     - `<ProjectsSection />`
     - `<ContactSection />`
  3. `<Footer />` (Chân trang ngữ nghĩa)
  4. `<ProjectModal />` (Modal portal hiển thị khi có dự án được chọn)
- **Dependencies:** React, các UI components trong `@/components/ui/`.

### 2.4. `src/components/ui/HeroSection.tsx` & `AvatarBentoCard.tsx` (CRITICAL)
- **Mục đích:** Tạo ấn tượng thị giác đầu tiên (First Visual Impact) chuẩn Awwwards/Linear.
- **Đặc điểm:**
  - Lớp nền là Three.js Canvas (`HeroThreeBackground.tsx`) kết xuất sóng hạt 60 FPS.
  - Khung Avatar Bento (`AvatarBentoCard.tsx`): Sử dụng ảnh avatar viền trong suốt, viền ngoài phủ gradient phát sáng đa màu (Cyan -> UTH Blue -> Teal), hiệu ứng rọi đèn Spotlight theo con trỏ chuột (`onMouseMove` tính toán tâm vệt sáng động), hai huy hiệu nổi khẳng định tư cách sinh viên UTH và GPA 3.08.

### 2.5. `src/components/ui/BentoGridSection.tsx` (CRITICAL)
- **Mục đích:** Thể hiện hồ sơ năng lực theo dạng lưới Bento 12 cột, đáp ứng tiêu chí #2, #3, #5, #7, #18, #19 trong bảng chấm điểm.
- **Các Card thành phần:**
  - Card 1 (Col 1-8): Giới thiệu bản thân & Mục tiêu nghề nghiệp (Ngắn hạn & Dài hạn).
  - Card 2 (Col 9-12): Học vấn chi tiết, tiến độ tín chỉ 52/120 và thanh tiến độ GPA 3.08.
  - Card 3 (Col 1-6): Kinh nghiệm vận hành thực tế (Grab Partner, Ways Station, Revu Creator).
  - Card 4 (Col 7-12): Đời sống & cá tính kỹ thuật (Muay Thái, Wave 54zz, CS2).
  - Card 5 (Col 1-12): **Tính năng sáng tạo độc quyền** — Công cụ tính trọng lượng thể tích Logistics (DIM Weight Calculator) cho phép chuyển đổi giữa Hàng không (/5000) và Đường bộ (/6000).

### 2.6. `src/components/canvas/HeroThreeBackground.tsx` (CRITICAL)
- **Mục đích:** Nền đồ họa WebGL tương tác sử dụng Three.js thuần.
- **Nguyên lý:**
  - Khởi tạo lưới 55x45 điểm (2.475 hạt).
  - Áp dụng Texture tròn mờ mềm mại tạo qua Canvas 2D.
  - Tô màu chuyển sắc theo khoảng cách từ tâm: Xanh UTH (`#005baa`) chuyển sang Cyan Neon (`#00f2fe`).
  - Vòng lặp `requestAnimationFrame` tính toán 3 hàm sóng sin kết hợp (`sin`, `cos`) tạo làn sóng đại dương số bồng bềnh.
  - Tương tác Parallax: Lưới hạt nghiêng nhẹ theo tọa độ chuột với phép nội suy LERP mượt mà.
  - Quản lý vòng đời WebGL chặt chẽ: `cancelAnimationFrame`, `dispose()` geometry, material, texture, renderer để chống rò rỉ bộ nhớ.
