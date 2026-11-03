# ĐẶC TẢ KỸ THUẬT TÁI THIẾT DỰ ÁN (REBUILD SPECIFICATION)
**Mã tài liệu:** `AUDIT-PORTFOLIO-THIEN-06`  
**Dành cho:** AI Engineering Agent / Senior Frontend Architect kế nhiệm  
**Mục tiêu:** Bản thiết kế kiến trúc chuẩn mực (Blueprint) hướng dẫn chi tiết từng bước xây dựng lại toàn diện website Portfolio từ con số không (From Scratch to Production), đảm bảo đạt chuẩn video tham chiếu MiladiCode và đáp ứng trọn vẹn 19/19 tiêu chí Bảng chấm điểm.

---

## 1. NGUYÊN TẮC THIẾT KẾ & RÀNG BUỘC KỸ THUẬT (CORE PRINCIPLES & CONSTRAINTS)

1. **Scroll-Driven Native SPA:** Tuyệt đối không khóa cuộn trang bằng `overflow-hidden` trên thẻ `body`. Toàn bộ website phải cuộn tự nhiên (`overflow-y-auto`, `scroll-smooth`) với thanh cuộn tùy chỉnh theo giao diện Dark/Light.
2. **Zero White Background on Avatar:** Toàn bộ ảnh đại diện nhân vật Chibi và chân dung phải được xử lý kênh Alpha trong suốt, hòa trộn hoàn hảo vào nền kính tối.
3. **Tuân thủ Strict TypeScript:** Bật cấu hình `"strict": true` và `"noUnusedLocals": true` trong `tsconfig.json`. Mọi biến hoặc import không sử dụng phải bị dọn dẹp triệt để, không để phát sinh lỗi `TS6133`.
4. **Quản lý Vòng đời WebGL An toàn (Memory Leak Prevention):** Toàn bộ các cảnh 3D Three.js phải có cơ chế dọn dẹp trong hàm `cleanup` của `useEffect`: Hủy `requestAnimationFrame`, gỡ bỏ bộ lắng nghe sự kiện (`window.removeEventListener`), gọi `.dispose()` trên `geometry`, `material`, `texture` và `renderer`.
5. **Kho Dữ liệu Duy nhất (Single Source of Truth):** Không hardcode thông tin cá nhân rải rác trong các file UI. Mọi thông tin phải xuất phát từ `src/config/portfolioData.ts`.
6. **Bảo tồn Danh tính Sinh viên UTH:** Phải bảo tồn nguyên vẹn các thông tin xác thực của Đinh Thanh Thiên: MSSV `075206003993`, GPA `3.08/4.0`, 52/120 tín chỉ, 3 vị trí kinh nghiệm (Grab, Ways Station, Revu), và 5 dự án thực chiến (`alpr`, `eta-logistics`, `gold-prediction`, `uth-ecommerce`, `barber-booking`).

---

## 2. KẾ HOẠCH TRIỂN KHAI 10 BƯỚC CHI TIẾT (10-STEP REBUILD BLUEPRINT)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       LỘ TRÌNH 10 BƯỚC TÁI THIẾT DỰ ÁN                      │
└─────────────────────────────────────────────────────────────────────────────┘
  [Bước 1] Khởi tạo Scaffold (Vite + React 18 + TS + Tailwind)
     │
  [Bước 2] Thiết lập Tài nguyên tĩnh vào `public/assets/` & `public/images/`
     │
  [Bước 3] Cấu hình Tailwind Design System, Typography & Font Google
     │
  [Bước 4] Thiết lập Single Source of Truth (`src/config/portfolioData.ts`)
     │
  [Bước 5] Thiết lập Zustand Store quản trị Theme & Navigation
     │
  [Bước 6] Xây dựng Three.js Particle Wave Canvas (`HeroThreeBackground.tsx`)
     │
  [Bước 7] Xây dựng High-Tech Avatar Bento Card (`AvatarBentoCard.tsx`)
     │
  [Bước 8] Xây dựng Hero Section & 2-Row Infinite Logo Carousel
     │
  [Bước 9] Xây dựng Bento Grid (Kèm DIM Weight Calculator), Skills, Projects & Form
     │
  [Bước 10] Tối ưu hóa Bundle (Vite manualChunks), Kiểm thử & Xác thực Rubric 19/19
```

---

### BƯỚC 1: KHỞI TẠO SCAFFOLD & CÀI ĐẶT THƯ VIỆN

Khởi tạo dự án bằng Vite với mẫu React TypeScript:
```bash
npm create vite@latest portfolio-thien -- --template react-ts
cd portfolio-thien
```

Cài đặt các gói phụ thuộc bắt buộc:
```bash
npm install three @types/three gsap lucide-react zustand clsx tailwind-merge
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### BƯỚC 2: CẤU HÌNH TÀI NGUYÊN TĨNH (PUBLIC DIRECTORY SETUP)

Đảm bảo cấu trúc thư mục `public/` được tổ chức như sau:
```
public/
├── assets/
│   ├── avatar-uth.png            # [1.35 MB] Ảnh chibi UTH nền trong suốt
│   ├── racing-bike.png           # [481 KB] Ảnh xe đua drag Wave
│   └── exhaust-sound.mp3         # [154 KB] Âm thanh pô xe
├── images/
│   ├── thien-chibi.png           # [1.35 MB] Bản sao ảnh chibi
│   └── thien-avatar.jpg          # [81.7 KB] Ảnh chân dung thực tế
└── models/
    └── thien-uth-avatar.glb      # (Tùy chọn) File mô hình 3D cá nhân
```

---

### BƯỚC 3: CẤU HÌNH HỆ THỐNG THIẾT KẾ TAILWIND & POSTCSS

#### `tailwind.config.js`:
Cấu hình màu sắc nhận diện UTH (`uth-blue`, `uth-cyan`, `uth-navy`), bảng màu Dark mode, font chữ `Inter` và `JetBrains Mono`, cùng keyframes chạy chữ vô tận `marqueeLeft`, `marqueeRight`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        uth: {
          blue: '#005baa',
          cyan: '#00f2fe',
          navy: '#002b49',
          light: '#e0f2fe',
        },
        dark: {
          DEFAULT: '#0b0c10',
          bg: '#0b0c10',
          surface: '#121826',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'marquee-left': 'marqueeLeft 28s linear infinite',
        'marquee-right': 'marqueeRight 28s linear infinite',
      },
      keyframes: {
        marqueeLeft: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeRight: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [],
}
```

#### `src/index.css`:
Thiết lập scrollbar mượt mà, định nghĩa lớp `.glass-panel` với hiệu ứng `backdrop-blur-xl`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: dark light; }
html { scroll-behavior: smooth; scroll-padding-top: 5rem; }

.glass-panel {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(226, 232, 240, 0.8);
}
.dark .glass-panel {
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

---

### BƯỚC 4: THIẾT LẬP KHO DỮ LIỆU TẬP TRUNG (`src/config/portfolioData.ts`)

Sao chép toàn bộ nội dung từ `PORTFOLIO_CONTENT.md` sang file TypeScript này, bao gồm:
- Interface `ProjectItem`, `SkillGroup`, `SkillItem`, `CarouselLogo`.
- Hằng số `PROFILE`, `SKILL_GROUPS`, `PROJECTS`, `CAROUSEL_ROW_1`, `CAROUSEL_ROW_2`.

---

### BƯỚC 5: THIẾT LẬP ZUSTAND STATE STORE (`src/store/usePortfolioStore.ts`)

Xây dựng store quản lý:
- `theme`: Đọc giá trị ban đầu từ `localStorage.getItem('portfolio-theme')`, mặc định `'dark'`.
- `toggleTheme`: Đổi giữa `'dark'` và `'light'`, cập nhật class `.dark` trên thẻ `<html>`.
- `activeSection`: Chuỗi định danh section đang duyệt.
- `selectedProjectId`: `string | null` điều khiển trạng thái mở modal dự án.
- `isMobileMenuOpen`: Điều khiển đóng mở menu trên di động.

---

### BƯỚC 6: XÂY DỰNG THREE.JS PARTICLE WAVE CANVAS (`src/components/canvas/HeroThreeBackground.tsx`)

Xây dựng nền WebGL không gian 3 chiều 60 FPS:
- Khởi tạo `THREE.Scene`, `THREE.PerspectiveCamera(55, w/h, 0.1, 100)`.
- Khởi tạo `THREE.WebGLRenderer` với `alpha: true, powerPreference: 'high-performance'`.
- Tạo `THREE.Points` với lưới 55x45 điểm (2.475 đỉnh).
- Tô màu nội suy từ Xanh UTH (`0x005baa`) sang Cyan Neon (`0x00f2fe`).
- Tạo vòng lặp animation tính toán sóng bề mặt bằng 3 hàm điều hòa cộng dồn (`Math.sin(x*0.5 + t*1.4)*0.32 + Math.cos(z*0.6 + t*1.1)*0.28`).
- Theo dõi chuột theo công thức LERP: `mouse.x += (mouse.targetX - mouse.x) * 0.05`.
- Dọn dẹp bộ nhớ triệt để khi unmount.

---

### BƯỚC 7: XÂY DỰNG HIGH-TECH AVATAR BENTO CARD (`src/components/ui/AvatarBentoCard.tsx`)

Thành phần đồ họa trung tâm của Hero:
- Lớp 1: Khung bo viền phát sáng gradient Cyan -> UTH Blue -> Teal với `blur-lg`.
- Lớp 2: Khung kính mờ đa tầng với hiệu ứng Spotlight rọi đèn theo chuột (`radial-gradient` tâm tại tọa độ con trỏ).
- Lớp 3: Ảnh nhân vật Chibi UTH trong suốt có bóng đổ tiếp đất và quầng sáng disc phía sau, phóng to nhẹ `scale-105` khi rê chuột.
- Lớp 4: Các huy hiệu nổi (Floating Badges): Huy hiệu sinh viên UTH ở đỉnh, huy hiệu GPA 3.08 & verified dossier ở đáy.

---

### BƯỚC 8: HOÀN THIỆN HERO SECTION & 2-ROW INFINITE CAROUSEL

- Ghép nối `HeroThreeBackground` và `AvatarBentoCard` vào `HeroSection.tsx`.
- Thêm các thẻ metrics GPA, Tín chỉ, ALPR mAP và các nút CTA có liên kết neo (`#projects`, `#contact`).
- Dựng `LogoCarousel.tsx` với 2 hàng marquee nhân 3 độ dài mảng dữ liệu để chuyển động vô tận không bị ngắt quãng.

---

### BƯỚC 9: XÂY DỰNG CÁC PHÂN ĐOẠN CÒN LẠI

1. **BentoGridSection.tsx:** 5 Thẻ bento (Giới thiệu, Học vấn, Kinh nghiệm, Đời sống, DIM Calculator).
   - Tích hợp bộ tính trọng lượng thể tích: `volumetricWeight = (L * W * H) / divisor`, `chargeableWeight = Math.max(volumetricWeight, actualWeight)`.
2. **SkillsSection.tsx:** Bộ lọc Tabs cho 3 nhóm kỹ năng, thanh tiến độ % có dải chuyển màu.
3. **ProjectsSection.tsx:** Lưới 5 dự án với bộ lọc thể loại Tabs, nút xem GitHub và nút mở modal.
4. **ProjectModal.tsx:** Hiển thị chi tiết kiến trúc, metrics, highlights; hỗ trợ phím `Escape`.
5. **ContactSection.tsx:** Biểu mẫu với JS Regex validation cho 4 trường (fullName, email, subject, message).
6. **Navbar.tsx & Footer.tsx:** Thanh điều hướng cố định có scroll-spy, nút đổi theme, và chân trang ngữ nghĩa có tem xác nhận Rubric 19/19.

---

### BƯỚC 10: TỐI ƯU HÓA ĐÓNG GÓI & KIỂM TRA TOÀN DIỆN (BUILD & AUDIT CHECK)

Cấu hình tách chunk trong `vite.config.ts`:
```typescript
build: {
  chunkSizeWarningLimit: 4500,
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('three')) return 'three-vendor';
        if (id.includes('gsap')) return 'gsap-motion';
        if (id.includes('lucide-react')) return 'icons';
        if (id.includes('react') || id.includes('zustand')) return 'vendor-react';
      },
    },
  },
}
```

Kiểm tra lệnh build:
```bash
npx tsc --noEmit
npm run build
```

---

## 3. DANH SÁCH CÁC CẠM BẪY CẦN TRÁNH (COMMON PITFALLS & SOLUTIONS)

| Cạm bẫy kỹ thuật | Hậu quả | Giải pháp ngăn chặn |
| :--- | :--- | :--- |
| **Ảnh avatar dính viền trắng** | Phá hỏng thẩm mỹ Dark Mode, lộ khung hình chữ nhật xấu xí. | Bắt buộc kiểm tra kênh Alpha, sử dụng ảnh đã khử trắng `dist/assets/avatar-uth.png`. |
| **Lỗi TS6133 (Unused Locals)** | Build production thất bại trên CI/CD. | Kiểm tra `npx tsc --noEmit`, xóa toàn bộ import hoặc biến không dùng. |
| **Thiếu file trong `public/`** | Trình duyệt báo lỗi 404 khi chạy dev server. | Sao chép đầy đủ các asset ảnh tĩnh vào `public/assets/` và `public/images/`. |
| **Rò rỉ bộ nhớ Three.js** | Trình duyệt bị giật, sập tab WebGL sau một thời gian duyệt web. | Luôn `dispose()` geometry, material, texture trong hàm cleanup của `useEffect`. |
| **Khóa cuộn trang** | Người dùng không thể cuộn xem các nội dung bên dưới. | Đảm bảo thẻ `<body>` có `overflow-y-auto` và `overflow-x-hidden`. |
