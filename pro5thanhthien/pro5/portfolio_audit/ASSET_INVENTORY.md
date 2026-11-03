# BẢNG KIỂM KÊ TÀI NGUYÊN ĐỒ HỌA & ĐA PHƯƠNG TIỆN (ASSET INVENTORY)
**Mã tài liệu:** `AUDIT-PORTFOLIO-THIEN-05`  
**Dự án:** Portfolio Cá Nhân Đinh Thanh Thiên — UTH  
**Quy mô:** Tài nguyên tĩnh (`public/`, `dist/`), tài nguyên mã nguồn, tài nguyên mạng ngoài (CDN, Google Fonts, Spline)

---

## 1. BẢNG KIỂM KÊ TÀI NGUYÊN NỘI BỘ (INTERNAL ASSET AUDIT MATRIX)

| Tên tài nguyên | Đường dẫn vật lý hiện tại | Định dạng | Kích thước | Nơi sử dụng trong mã nguồn | Trạng thái kiểm toán |
| :--- | :--- | :---: | :---: | :--- | :--- |
| **Ảnh chân dung thật** | `public/images/thien-avatar.jpg` | JPG | 81.7 KB | Dùng cho hồ sơ học thuật, thẻ tác giả | **Tồn tại trong `public/`** |
| **Tiếng pô xe máy** | `public/assets/exhaust-sound.mp3` | MP3 | 154.7 KB | `src/components/canvas/BikeDriveBy.tsx` | **Tồn tại trong `public/`** |
| **Ảnh Avatar UTH Chibi** | `dist/assets/avatar-uth.png` | PNG | 1.35 MB | `AvatarBentoCard.tsx` (`/assets/avatar-uth.png`) | ⚠️ **Chỉ có trong `dist/`, THIẾU trong `public/`** |
| **Ảnh Chibi trong suốt** | `dist/images/thien-chibi.png` | PNG | 1.35 MB | `Hero3DScene.tsx`, Fallback onError của Avatar | ⚠️ **Chỉ có trong `dist/`, THIẾU trong `public/`** |
| **Ảnh xe đua drag** | `dist/assets/racing-bike.png` | PNG | 481.8 KB | `BikeDriveBy.tsx` (`/assets/racing-bike.png`) | ⚠️ **Chỉ có trong `dist/`, THIẾU trong `public/`** |
| **Đầu Chibi tách lớp** | `dist/assets/avatar-head.png` | PNG | 1.34 MB | `HeroInteractiveChibi.tsx` | ⚠️ **Chỉ có trong `dist/`, THIẾU trong `public/`** |
| **Thân Chibi tách lớp** | `dist/assets/avatar-body.png` | PNG | 1.35 MB | `HeroInteractiveChibi.tsx` | ⚠️ **Chỉ có trong `dist/`, THIẾU trong `public/`** |
| **File mô hình 3D cá nhân** | `public/models/thien-uth-avatar.glb` | GLB (3D) | 0 B | `Avatar3DViewer.tsx` (`/models/...glb`) | ❌ **CHƯA TỒN TẠI (Thư mục trống)** |
| **Video nền đường phố** | `public/assets/ambient-bg.mp4` | MP4 | 0 B | `CyberHighwayBg.tsx` (`/assets/...mp4`) | ❌ **CHƯA TỒN TẠI** |

---

## 2. PHÁT HIỆN ĐẶC BIỆT QUAN TRỌNG VỀ ĐƯỜNG DẪN TÀI NGUYÊN (CRITICAL ASSET FINDING)

> [!WARNING] CẢNH BÁO NGUY CƠ LỖI 404 KHI REBUILD HOẶC CHẠY DEV
> Hiện tại, các tệp hình ảnh đồ họa chất lượng cao như `avatar-uth.png`, `thien-chibi.png`, `racing-bike.png`, `avatar-head.png`, `avatar-body.png` **chỉ đang nằm trong thư mục biên dịch `dist/`**, nhưng **chưa được sao chép vào thư mục gốc `public/`**.
>
> **Hệ quả kỹ thuật:**
> - Nếu một nhà phát triển hoặc AI khác clone repository này về và chạy `npm run dev`, trình duyệt sẽ gọi đến `http://localhost:3000/assets/avatar-uth.png` và nhận mã lỗi **404 Not Found** (vì thư mục `public/assets/` chỉ có duy nhất file `exhaust-sound.mp3`).
> - Khi tái thiết dự án (Rebuild Phase), hành động bắt buộc đầu tiên là **đồng bộ hóa (copy)** toàn bộ các tệp `.png` từ `dist/assets/` sang `public/assets/` và `public/images/`.

---

## 3. TÀI NGUYÊN MẠNG NGOÀI & DỊCH VỤ ĐÁM MÂY (EXTERNAL & CDN ASSETS)

### 3.1. Phông chữ Web (Google Fonts)
Khai báo tại thẻ `<head>` của `index.html`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```
- **Font `Inter`:** Cung cấp các trọng số nét (Weights: 300 Light, 400 Normal, 500 Medium, 600 SemiBold, 700 Bold, 800 ExtraBold).
- **Font `JetBrains Mono`:** Cung cấp các trọng số nét (Weights: 400 Regular, 500 Medium, 600 SemiBold, 700 Bold).

### 3.2. Không gian 3D Spline Scene (CDN Spline Design)
- **URL Scene mặc định:** `https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode`
- **Mục đích:** Cung cấp scene 3D không gian bàn làm việc công nghệ cao qua thư viện `@splinetool/runtime`.
- **Cơ chế dự phòng:** Dự án đã có sẵn giải pháp thay thế hoàn toàn độc lập bằng Three.js thuần (`HeroThreeBackground.tsx` và `AvatarBentoCard.tsx`), đảm bảo website luôn hiển thị tức thì không bị phụ thuộc vào tốc độ CDN của bên thứ ba.

### 3.3. Thư viện Biểu tượng Vector (Lucide React)
Hệ thống sử dụng các icon SVG vector từ gói `lucide-react` (phiên bản `1.16.0`):
- **Điều hướng & Cấu trúc:** `Home`, `User`, `Cpu`, `FolderGit2`, `Mail`, `Sun`, `Moon`, `Menu`, `X`, `Box`, `ArrowUp`, `ChevronDown`, `ArrowRight`, `ExternalLink`.
- **Học vấn & Thành tích:** `GraduationCap`, `Award`, `ShieldCheck`, `CheckCircle2`, `Sparkles`.
- **Công nghệ & Kỹ thuật:** `Terminal`, `Brain`, `Code2`, `GitBranch`, `Boxes`, `Layers`, `Zap`, `Calculator`, `TrendingUp`.
- **Đời sống & Hoạt động:** `Briefcase`, `Truck`, `Activity`, `Wrench`, `Music`, `Gamepad2`, `Calendar`, `MapPin`.
- **Tương tác & Hệ thống:** `Loader2`, `Clock`, `AlertCircle`, `Upload`, `RotateCcw`, `Send`.

---

## 4. XỬ LÝ ĐẶC THÙ HÌNH ẢNH (IMAGE TRANSPARENCY & OPTIMIZATION)

1. **Vấn đề nền trắng (White Edge Elimination):**
   - File gốc `thien-chibi.png` / `avatar-uth.png` ban đầu có viền nền màu trắng `rgb(254, 255, 255)`.
   - Đã được xử lý chuyển đổi toàn bộ pixel vùng biên thành kênh Alpha trong suốt (`RGBA(0, 0, 0, 0)`), đảm bảo hiển thị hoàn mỹ trên nền kính tối của `AvatarBentoCard.tsx` mà không bị lộ bất kỳ viền răng cưa hay vệt màu trắng nào.
2. **Kích thước hiển thị tối ưu:**
   - Ảnh Chibi UTH có tỷ lệ khung hình đứng (`aspect-ratio: ~3:4`), kích thước gốc ~1024x1024 px, hiển thị trong thẻ bento ở mức chiều cao từ `490px` đến `590px` với thuộc tính CSS `object-contain object-bottom`.
