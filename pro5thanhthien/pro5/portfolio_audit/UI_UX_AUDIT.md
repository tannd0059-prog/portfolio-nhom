# ĐÁNH GIÁ THIẾT KẾ GIAO DIỆN & TRẢI NGHIỆM NGƯỜI DÙNG (UI/UX AUDIT)
**Mã tài liệu:** `AUDIT-PORTFOLIO-THIEN-04`  
**Dự án:** Portfolio Cá Nhân Đinh Thanh Thiên — UTH  
**Quy chuẩn tham chiếu:** Video MiladiCode 3D Portfolio (`https://www.youtube.com/watch?v=tf_yi6DtDOQ`), Awwwards / Linear Design Standards, Bảng chấm điểm học phần 19 tiêu chí.

---

## 1. HỆ THỐNG THIẾT KẾ (DESIGN SYSTEM AUDIT)

### 1.1. Bảng màu chủ đạo (Color Palette)
Hệ thống màu sắc được xây dựng dựa trên nhận diện thương hiệu của **Trường Đại học Giao thông Vận tải TP.HCM (UTH)** kết hợp phong cách Cyberpunk / High-Tech tối giản:

| Tên màu | Mã HEX / Tailwind | Ý nghĩa & Vị trí ứng dụng |
| :--- | :--- | :--- |
| **UTH Blue** | `#005baa` (`uth-blue`) | Màu nhận diện Đại học UTH, dùng cho các nút điểm nhấn, thanh tiến độ học vấn, hạt nền WebGL. |
| **Cyan Neon** | `#00f2fe` (`uth-cyan`) | Màu công nghệ tương lai, dùng cho viền sáng (glow), text gradient, trạng thái hover, chỉ số metrics nổi bật. |
| **UTH Navy** | `#002b49` (`uth-navy`) | Màu nền phụ, gradient chiều sâu của các thẻ kính mờ. |
| **Dark Background** | `#0b0c10` (`dark-bg`) | Màu nền đen vũ trụ của Dark Mode, giúp hạt ánh sáng 3D và viền kính mờ nổi bật. |
| **Light Background**| `#f8fafc` (`slate-50`) | Màu nền sáng thanh lịch khi người dùng kích hoạt Light Mode. |
| **Card Surface** | `rgba(15, 23, 42, 0.8)` / `rgba(255, 255, 255, 0.85)` | Bề mặt kính mờ (Glassmorphism) với `backdrop-blur-xl`. |
| **Accent Emerald** | `#10b981` (`emerald-500`) | Chỉ số độ chính xác cao, trạng thái hoạt động ("Active", "Verified Dossier"). |
| **Accent Amber** | `#f59e0b` (`amber-500`) | Thẻ thành tích, cựu học sinh THPT, cảnh báo nhẹ. |

### 1.2. Kiểu chữ & Typography
- **Font chữ giao diện chính (Sans-serif):** `Inter` (tải từ Google Fonts) — Đường nét hiện đại, rõ ràng, tối ưu cho đọc trên mọi kích thước màn hình từ điện thoại đến màn hình 4K.
- **Font chữ kỹ thuật (Monospace):** `JetBrains Mono` — Áp dụng cho các chỉ số định lượng (GPA `3.08`, mAP `96.4%`), mã MSSV, mã hex, thẻ ngôn ngữ lập trình, thanh đo đạc Logistics.
- **Hệ thống cấp bậc văn bản (Hierarchy):**
  - Hero Headline: `text-4xl sm:text-5xl lg:text-6xl font-black` kết hợp `bg-clip-text text-transparent`.
  - Section Title: `text-3xl sm:text-4xl font-extrabold tracking-tight`.
  - Card Title: `text-base sm:text-lg font-bold`.
  - Body Text: `text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed`.
  - Captions / Meta: `text-[10px] sm:text-[11px] font-mono`.

### 1.3. Cơ chế chuyển đổi Giao diện Tối / Sáng (Dark / Light Theme)
- Khai báo class `.dark` tại thẻ gốc `<html>`.
- Trạng thái được quản lý tự động bởi `usePortfolioStore` và lưu trữ bền vững vào `localStorage` với khóa `'portfolio-theme'`.
- Hiệu ứng chuyển màu mượt mà qua thuộc tính CSS `transition-colors duration-300`.
- Nút chuyển theme trên Navbar hiển thị icon `Sun` (màu vàng hổ phách, xoay 90 độ khi hover) khi ở Dark mode và icon `Moon` khi ở Light mode.

---

## 2. KIỂM TOÁN TỪNG PHÂN ĐOẠN GIAO DIỆN (SECTION-BY-SECTION AUDIT)

### 2.1. Thanh điều hướng trên cùng (Sticky Navbar)
- **Vị trí & Hiệu ứng:** Cố định ở đỉnh màn hình (`fixed top-0 left-0 right-0 z-40`). Khi cuộn xuống quá 20px, tự động thu nhỏ độ đệm (`py-3`) và phủ nền kính mờ `bg-white/80 dark:bg-[#0b0c10]/80 backdrop-blur-xl border-b`.
- **Thương hiệu (Brand):** Logo `Box` 3D gradient kết hợp chữ `THIEN.3D` và chấm xanh nhấp nháy `UTH Logistics AI`.
- **Liên kết điều hướng (Desktop):** Phong cách viên thuốc (Pill Navigation) bọc trong thanh kính nổi: `Trang chủ`, `Hồ sơ Bento`, `Kỹ năng`, `Dự án`, `Liên hệ`.
- **Cơ chế Scroll Spy:** Tự động phát hiện vị trí các phần tử trên màn hình khi cuộn để làm sáng tab điều hướng tương ứng với hiệu ứng nền Cyan nổi bật.
- **Menu di động (Mobile Drawer):** Nút Hamburger mở ra một ngăn kéo kính mờ trượt từ trên xuống với animation mượt mà, đầy đủ các nút bấm kích thước lớn dễ chạm trên ngón tay cái.

### 2.2. Phần mở đầu (Hero Section & Avatar Bento Card)
- **Bố cục:** Hai cột cân đối hoàn hảo trên Desktop (7 cột thông tin bên trái : 5 cột đồ họa bên phải).
- **Cột trái:**
  - Huy hiệu tư cách: *"Sinh viên CNTT & Smart Logistics • UTH TP.HCM"* với icon nón cử nhân.
  - Tiêu đề cá nhân: Tên *Đinh Thanh Thiên* được xử lý hiệu ứng dải chuyển màu phát sáng ánh cyan.
  - 3 Thẻ chỉ số nổi bật: GPA `3.08/4.0`, Tín chỉ `52/120`, Độ chính xác ALPR `96.4%`.
  - Cụm nút kêu gọi hành động (CTA): Nút chính *"Khám Phá 5 Dự Án"*, nút phụ *"Liên Hệ Hợp Tác"*, nút icon mở GitHub.
- **Cột phải (`AvatarBentoCard.tsx`):**
  - Khung ảnh bo góc 3D hiện đại (`rounded-3xl`).
  - Viền phát sáng động (Animated Glow Border) với gradient 3 màu (Cyan - Blue - Teal) có độ nhòe `blur-lg`.
  - Hiệu ứng rọi đèn tương tác (Spotlight Hover): Khi rê chuột vào thẻ, một quầng sáng tròn `radial-gradient` di chuyển chính xác theo tọa độ con trỏ (`onMouseMove`).
  - Ảnh chân dung xử lý tách nền trong suốt, phóng to nhẹ `scale-105` khi hover, có bóng mờ tiếp đất mềm mại.
  - Hai huy hiệu nổi khẳng định hồ sơ học thuật xác thực (Verified Dossier).
- **Lớp nền 3D Canvas:** `HeroThreeBackground.tsx` chạy Three.js WebGL kết xuất hơn 2.400 hạt sóng số bồng bềnh, nghiêng theo chuột và hòa trộn khéo léo vào nền tối qua lớp mặt nạ Vignette.

### 2.3. Băng chuyền Logo 2 Hàng (2-Row Infinite Logo Carousel)
- **Cảm hứng thiết kế:** Workflow video MiladiCode.
- **Kỹ thuật thực hiện:**
  - Hàng 1 (8 logo công nghệ): Chuyển động liên tục từ Phải sang Trái trong 28 giây (`animate-marquee-left`).
  - Hàng 2 (8 đối tác & môi trường): Chuyển động liên tục từ Trái sang Phải trong 28 giây (`animate-marquee-right`).
  - Mặt nạ chuyển mờ hai bên sườn (Side Fade Mask Gradients) tạo hiệu ứng các logo lướt vào và biến mất tự nhiên không bị cụt mép.
  - Tương tác: Tự động dừng hoạt họa khi người dùng rê chuột vào (`hover:[animation-play-state:paused]`).

### 2.4. Hồ sơ Năng lực Bento Grid (Bento Grid Section)
- **Cấu trúc:** Lưới 12 cột linh hoạt gom nhóm thông tin cá nhân thành 5 thẻ Bento:
  1. **Thẻ 1 (8 cột): Giới thiệu & Mục tiêu nghề nghiệp:** Trình bày thông tin UTH, MSSV, ngày sinh, bio và 2 khối mục tiêu ngắn hạn & dài hạn.
  2. **Thẻ 2 (4 cột): Học vấn & Thành tích:** Thẻ điểm GPA 3.08, tiến độ hoàn thành 52/120 tín chỉ với thanh đo phần trăm thực tế (43.3%) và mốc tốt nghiệp năm 2027.
  3. **Thẻ 3 (6 cột): Kinh nghiệm & Hoạt động thực tế:** Dòng thời gian liên tục với 3 cột mốc: Đối tác Grab, Vận hành Ways Station, Sáng tạo nội dung Revu Vietnam.
  4. **Thẻ 4 (6 cột): Đời sống & Đam mê cơ khí:** Giới thiệu môn võ Muay Thái, cấu hình cơ khí xe Wave Thái 54zz, gu nhạc Vinahouse và game CS2.
  5. **Thẻ 5 (12 cột): Tính năng sáng tạo — Máy tính trọng lượng thể tích Logistics (DIM Weight Calculator):** Cho phép người dùng trực tiếp nhập Chiều dài, Rộng, Cao, Cân nặng thực tế, chuyển đổi quy chuẩn Hàng không (/5000) và Đường bộ (/6000), hệ thống tự động tính toán trọng lượng tính cước (Chargeable Weight) tức thì.

### 2.5. Bảng Kỹ năng Kỹ thuật (Skills Section)
- Phân nhóm thành 3 thẻ lớn: AI & Deep Learning (7 kỹ năng), Web & Backend (8 kỹ năng), Tools & DevOps (6 kỹ năng).
- Bộ lọc danh mục (Filter Tabs): Cho phép lọc nhanh từng nhóm hoặc xem "Tất cả".
- Mỗi kỹ năng đều có huy hiệu định vị (badge) và thanh đo tỷ lệ % tiến độ có dải màu gradient và bóng đổ phát sáng khi hover.

### 2.6. Bộ sưu tập Dự án có Bộ lọc (Projects Section & Project Modal)
- Bộ lọc Tabs tương tác: `Tất cả`, `AI & Computer Vision`, `Smart Logistics`, `Web & System`.
- Thẻ dự án:
  - Băng rôn gradient đại diện riêng biệt theo từng dự án.
  - Thẻ định danh #ProjectID, tiêu đề, tiêu đề phụ.
  - Các nhãn công nghệ (Tags).
  - Bảng 2 chỉ số hiệu năng rút gọn (FPS, mAP, Latency, MAE...).
  - Nút xem mã nguồn trên GitHub và nút mở cửa sổ kiểm tra chi tiết.
- Cửa sổ chi tiết (Project Modal):
  - Hiển thị đầy đủ thông số kỹ thuật, 3 chỉ số chuyên sâu, các điểm nổi bật (Highlights) và **Sơ đồ luồng kiến trúc (Architecture Pipeline)** 3 giai đoạn.
  - Hỗ trợ đóng modal bằng phím `Escape` hoặc click vào vùng nền mờ bên ngoài.

### 2.7. Biểu mẫu Liên hệ (Contact Section)
- Kiểm tra tính hợp lệ bằng JavaScript thuần (Real-Time JS Regex Validation):
  - Họ và tên: Tối thiểu 2 ký tự.
  - Địa chỉ email: Kiểm tra định dạng hợp lệ qua biểu thức chính quy (Regex).
  - Chủ đề: Tối thiểu 3 ký tự.
  - Nội dung tin nhắn: Tối thiểu 10 ký tự, có đếm số ký tự trực tiếp.
- Trạng thái tương tác: Báo đỏ khi người dùng bấm rời khỏi ô nhập mà điền sai (`onBlur`), tự động xóa lỗi khi người dùng gõ đúng (`onChange`).
- Mô phỏng quá trình gửi tin nhắn với icon xoay tải và thông báo gửi thành công kèm nút gửi lại.

### 2.8. Chân trang ngữ nghĩa (Footer)
- Thể hiện đầy đủ tên tác giả, chuyên ngành, niên khóa.
- Con dấu xác nhận tuân thủ **19/19 Tiêu chí Bảng chấm điểm học phần**.
- Nút cuộn mượt mà lên đầu trang (Scroll-to-top) bằng JavaScript `window.scrollTo({ top: 0, behavior: 'smooth' })`.

---

## 3. ĐỐI SOÁI VỚI VIDEO THAM CHIẾU (MILADICODE 3D PORTFOLIO)

| Yếu tố trong Video MiladiCode | Hiện trạng trong Dự án của Đinh Thanh Thiên | Đánh giá & Khuyến nghị tái thiết |
| :--- | :--- | :--- |
| **Hero 3D Model (.glb)** | Hiện dùng thẻ Avatar Bento Card kết hợp nền Three.js Wave 60 FPS. Đã có sẵn component `Avatar3DViewer.tsx` hỗ trợ nạp `.glb`. | Có thể kích hoạt lại mô hình 3D thực tế của Thiên khi có file `/models/thien-uth-avatar.glb`. |
| **2-Row Infinite Logo Carousel** | Đã triển khai hoàn chỉnh với 2 hàng chạy ngược chiều nhau, có mặt nạ làm mờ 2 sườn và tạm dừng khi hover. | **Đạt 100% chuẩn MiladiCode.** |
| **Bento Grid Architecture** | Đã xây dựng lưới Bento 12 cột với 5 thẻ kính mờ cao cấp, bao gồm công cụ tính toán DIM Logistics tương tác. | **Đạt chuẩn xuất sắc, vượt trội về tính năng chuyên ngành.** |
| **Dark Theme & High-Tech Glow** | Tông màu đen `#0b0c10`, viền phát sáng gradient Cyan/Blue, phông chữ JetBrains Mono. | **Đạt chuẩn thẩm mỹ Linear/Awwwards.** |
| **Mobile Responsiveness** | Tự động xếp chồng mượt mà từ 2 cột sang 1 cột, menu drawer trượt xuống trên mobile. | **Đạt 100% chuẩn trải nghiệm di động.** |

---

## 4. TỔNG HỢP KIỂM ĐỊNH KHẢ NĂNG TIẾP CẬN (ACCESSIBILITY & USABILITY)

1. **Độ tương phản màu sắc (Color Contrast):**
   - Chữ trắng trên nền tối `#0b0c10` đạt tỷ lệ tương phản > 14:1 (vượt chuẩn WCAG AAA).
   - Màu xanh Cyan `#00f2fe` trên nền tối đạt tỷ lệ tương phản > 7:1.
2. **Hỗ trợ điều khiển bàn phím (Keyboard Navigation):**
   - Toàn bộ các nút bấm và liên kết đều có thể focus bằng phím `Tab`.
   - Project Modal hỗ trợ đóng lập tức bằng phím `Escape`.
   - Có hook `useKeyboardNavigation.ts` hỗ trợ phím số `[1-4]` để chuyển nhanh các section.
3. **Thuộc tính ngữ nghĩa (Semantic HTML5):**
   - Sử dụng đúng các thẻ `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
   - Thẻ ảnh đều có thuộc tính `alt` mô tả rõ ràng.
   - Các nút icon đều có thuộc tính `aria-label` hoặc `title` phục vụ trình đọc màn hình.
