# BÁO CÁO TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)
**Mã kiểm toán:** `AUDIT-PORTFOLIO-THIEN-01`  
**Dự án:** Portfolio Cá Nhân Đinh Thanh Thiên — Sinh viên UTH & AI / Smart Logistics Engineer  
**Ngày thực hiện kiểm toán:** 31/10/2026  
**Chế độ kiểm toán:** Read-Only Source Code Extraction & Architectural Audit  
**Mục tiêu bàn giao:** Cung cấp tài liệu kỹ thuật toàn diện để một AI Agent hoặc Kỹ sư Frontend khác có thể tái thiết lập (rebuild) dự án đạt chuẩn chuyên nghiệp, lấy cảm hứng từ video tham chiếu MiladiCode 3D Developer Portfolio (`https://www.youtube.com/watch?v=tf_yi6DtDOQ`) và đáp ứng 100% (19/19 tiêu chí) trong Bảng chấm điểm học phần.

---

## 1. TỔNG QUAN DỰ ÁN (EXECUTIVE SUMMARY)

Dự án hiện tại là một Web Portfolio cá nhân tương tác cao (Scroll-Driven Interactive 3D Portfolio) đại diện cho **Đinh Thanh Thiên**, sinh viên chuyên ngành **Logistics thông minh & Công nghệ thông tin** tại **Trường Đại học Giao thông Vận tải TP.HCM (UTH)**.

Website kết hợp 3 trụ cột kỹ thuật:
1. **Frontend Hiện đại:** Single Page Application (SPA) phát triển trên nền **React 18.3.1**, **TypeScript 5.6.3**, xây dựng bằng **Vite 5.4.10**.
2. **Hệ thống Thiết kế & Kiểu dáng:** **Tailwind CSS 3.4.14**, hỗ trợ hoàn chỉnh 2 chế độ màu Dark / Light Mode, hiệu ứng Glassmorphism (kính mờ), Bento Grid hiện đại theo phong cách Linear/Awwwards, và 2-Row Infinite Logo Carousel lấy cảm hứng từ MiladiCode.
3. **Đồ họa Không gian 3D tương tác:** Kết hợp **Three.js (v0.187.0)** cho nền sóng hạt không gian đa chiều (Particle Wave WebGL Canvas 60 FPS) và các mô-đun 3D dự phòng (Procedural 3D Rig, GLTF Avatar Loader, Spline 3D Runtime).

---

## 2. THÔNG TIN CẤU HÌNH & RUNTIME (TECHNICAL STACK & RUNTIME)

| Hạng mục | Công nghệ / Phiên bản | Ghi chú & Vai trò |
| :--- | :--- | :--- |
| **Project Root** | `c:\Users\thiendz002\Downloads\pro5` | Không gian làm việc cục bộ |
| **Ngôn ngữ chính** | TypeScript 5.6.3 / JavaScript (ES2022) | Đảm bảo tính Type-Safe, cấu hình strict trong `tsconfig.json` |
| **Thư viện UI chính** | React 18.3.1 & React-DOM 18.3.1 | Kiến trúc Functional Components & React Hooks |
| **Công cụ đóng gói (Bundler)** | Vite 5.4.10 (`@vitejs/plugin-react` 4.3.3) | Hỗ trợ HMR tức thì, tách chunk manual trong Rollup |
| **Quản lý trạng thái (State)** | Zustand 5.0.1 | Quản lý Dark/Light theme, Active section, Project modal, Mobile menu |
| **Styling & CSS** | Tailwind CSS 3.4.14, PostCSS, Autoprefixer | Bảng màu tùy chỉnh UTH Blue `#005baa`, Cyan `#00f2fe`, Dark `#0b0c10` |
| **Bộ Icon** | Lucide React 1.16.0 | Hệ thống icon SVG vector sắc nét, đồng bộ |
| **Hiệu ứng Chuyển động** | GSAP 3.12.5 (GreenSock) | Xử lý timeline mượt mà, parallax, marquee CSS |
| **Công cụ 3D WebGL** | Three.js 0.187.0 (`@types/three` 0.187.0) | Nền Particle Wave, GLTF Loader, OrbitControls |
| **Tích hợp 3D phụ (Legacy)** | `@splinetool/react-spline` 4.1.0 & `@splinetool/runtime` 2.0.126 | Phục vụ tương thích ngược với mô hình Spline ban đầu |
| **Package Manager** | npm (với `package-lock.json`) | |

---

## 3. TRẠNG THÁI HIỆN TẠI CỦA DỰ ÁN (CURRENT REPOSITORY STATUS)

### 3.1. Các bước tiến hóa của mã nguồn
1. **Giai đoạn 1 (Spline Fixed Canvas):** Ban đầu dự án dựng theo kiến trúc một trang tĩnh không cuộn được (`overflow-hidden`), bọc bởi Spline 3D scene (`SplineCanvas.tsx`) và tầng HTML UI Overlay (`OverlayLayout.tsx`). Khi file Spline chưa tải xong hoặc mạng chậm, giao diện bị khóa thành một "khối hộp đen" ở giữa màn hình.
2. **Giai đoạn 2 (Scroll-Driven Major Upgrade):** Dự án được tái cấu trúc thành trang web cuộn tự do (`overflow-y-auto`, `scroll-smooth`), bổ sung đầy đủ 19 tiêu chí học phần: Mục tiêu nghề nghiệp, Học vấn GPA 3.08/4.0, Kinh nghiệm thực tế Grab/Ways Station, Bộ sưu tập xe độ Wave Thái 54zz, Bảng kỹ năng có thanh tiến độ, 5 Dự án thực tế có bộ lọc Filter Tabs, Form liên hệ có JS Regex Validation, Dark/Light Mode, Mobile Drawer Menu.
3. **Giai đoạn 3 (High-Tech Hero Bento & WebGL Canvas):** Loại bỏ các thành phần hoạt họa chắp vá (âm thanh pô xe, xe độ lướt qua), thiết kế Hero Section thành bố cục 2 cột cân đối: Cột trái chứa thông tin sinh viên UTH, chỉ số học vấn và nút CTA; Cột phải là **High-Tech Modern Bento Avatar Card** (`AvatarBentoCard.tsx`) với viền gradient phát sáng động, hiệu ứng rọi đèn Spotlight theo chuột, bóng tiếp đất và 2 huy hiệu nổi (Floating Badges).

### 3.2. Trạng thái Build & Kiểm thử
- Lệnh kiểm tra kiểu TypeScript: `npx tsc --noEmit` **PASSED (0 errors)**.
- Lệnh biên dịch kiểm tra: `npm run build` **SUCCESS** (sinh thư mục `dist/` với các chunk tách biệt: `vendor-react`, `three-vendor`, `icons`, `gsap-motion`).

---

## 4. MỤC TIÊU CỦA WEBSITE & ĐỐI TƯỢNG HƯỚNG TỚI (PURPOSE & TARGET AUDIENCE)

### 4.1. Mục tiêu
- **Đại diện danh tính kỹ thuật số (Digital Identity):** Thể hiện hình ảnh một sinh viên CNTT & Smart Logistics thế hệ mới (sinh năm 2006) tại Trường Đại học Giao thông Vận tải TP.HCM (UTH), có GPA tốt (3.08/4.0), tư duy công nghệ thực chiến, thành thạo Deep Learning (YOLOv5, OpenCV), Gradient Boosting (LightGBM), Web Fullstack (FastAPI, React), và quy trình *Vibe Coding*.
- **Đáp ứng học thuật:** Đạt điểm tuyệt đối (10.0/10) theo Bảng chấm điểm học phần Portfolio với 19/19 tiêu chí khắt khe.
- **Thu hút đối tác / Nhà tuyển dụng:** Hướng đến các cơ hội thực tập, việc làm kỹ sư AI ứng dụng, nghiên cứu tối ưu hóa chuỗi cung ứng thông minh, điều phối logistics, cảng biển và tự động hóa kho bãi.

### 4.2. Đối tượng phục vụ
1. Giảng viên và Hội đồng chấm điểm học phần tại Đại học Giao thông Vận tải TP.HCM (UTH).
2. Nhà tuyển dụng, Tech Lead, Engineering Manager tại các công ty Công nghệ, Tập đoàn Logistics (Grab, Shopee Express, Viettel Post, Cảng Cát Lái, Tân Cảng...).
3. Cộng đồng lập trình viên, học viên AI/Data Science, những người đam mê Vibe Coding và xe độ kỹ thuật cao.

---

## 5. CÁC QUYẾT ĐỊNH KIẾN TRÚC THEN CHỐT (KEY ARCHITECTURAL DECISIONS)

1. **Kiến trúc cuộn đa tầng (Scroll-Driven Hybrid Architecture):**
   - Loại bỏ hoàn toàn sự phụ thuộc đơn nhất vào một WebGL canvas toàn màn hình. Thay vào đó, canvas Three.js (`HeroThreeBackground.tsx`) được cố định ở `z-[-1]` phía sau Hero Section, cho phép toàn bộ trang web cuộn bình thường với CSS native mượt mà.
2. **Kho Dữ liệu Tập trung Duy nhất (Single Source of Truth):**
   - Mọi thông tin cá nhân, tiểu sử, học vấn, kinh nghiệm, thông số kỹ thuật xe độ, kỹ năng, dữ liệu 5 dự án, và logo đối tác được khai báo chuẩn hóa kiểu (Typed Interfaces) tại `src/config/portfolioData.ts`. Các component giao diện chỉ việc import và hiển thị, không bị trùng lặp dữ liệu (DRY).
3. **Quản lý Trạng thái Tinh gọn (Zustand Lightweight State):**
   - Thay vì dùng Redux cồng kềnh hoặc React Context gây re-render diện rộng, `usePortfolioStore.ts` của Zustand quản lý độc lập các trạng thái UI: `theme` (dark/light được lưu vào `localStorage`), `activeSection`, `selectedProjectId` (đóng/mở modal dự án), `isMobileMenuOpen`.
4. **Phân tách Bundle thông minh (Rollup Manual Chunking):**
   - Cấu hình trong `vite.config.ts` chia tách thư viện 3D nặng `three` (`three-vendor`), `gsap` (`gsap-motion`), `lucide-react` (`icons`), và `react`/`zustand` (`vendor-react`), tối ưu thời gian tải trang đầu tiên (FCP < 0.8s).
5. **Thiết kế Bento Grid & 2-Row Logo Carousel:**
   - Lấy cảm hứng trực tiếp từ xu hướng UI MiladiCode: Bento Grid chia 12 cột linh hoạt gom nhóm thông tin thành các khối thẻ kính mờ có chiều sâu; Logo Carousel 2 hàng chạy ngược chiều nhau vô tận mang đến diện mạo công nghệ tương lai.

---

## 6. LỆNH VẬN HÀNH & TRIỂN KHAI (COMMANDS & SCRIPTS)

```bash
# Cài đặt phụ thuộc
npm install

# Khởi chạy môi trường phát triển cục bộ (Local Dev Server tại http://localhost:3000)
npm run dev

# Kiểm tra lỗi cú pháp và kiểu dữ liệu TypeScript
npx tsc --noEmit

# Biên dịch mã nguồn cho môi trường Production (Output: dist/)
npm run build

# Chạy thử bản build đã đóng gói
npm run preview
```

---

## 7. TỔNG HỢP BIẾN MÔI TRƯỜNG (ENVIRONMENT VARIABLES)

Dự án có file cấu hình mẫu `.env.example` và file cục bộ `.env`:
- `VITE_SPLINE_SCENE_URL`: Đường dẫn tới file `.splinecode` export từ Spline Editor (Mặc định: `https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode`).
- **Lưu ý bảo mật:** Dự án hoạt động hoàn toàn ở phía client (Static SPA), **KHÔNG** yêu cầu khóa bí mật (API Keys), mật khẩu cơ sở dữ liệu hay token xác thực nhạy cảm nào.
