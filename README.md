# 🌐 UTH Web Development Team — Portfolio Hub Nhóm

> **Trường Đại Học Giao Thông Vận Tải TP.HCM (UTH)**  
> **Khoa Công Nghệ Thông Tin** • **Bộ Môn Lập Trình Web**  
> Dự án cổng thông tin tích hợp và hiển thị hồ sơ năng lực cá nhân (Portfolio Hub) của nhóm 6 sinh viên CNTT.

---

## 👥 Danh Sách Thành Viên & Vai Trò

| STT | Thành viên | Chuyên môn & Định hướng | Liên kết Portfolio |
|:---:|---|---|---|
| 1 | **Nguyễn Duy Tân** | Software Engineering & Frontend Developer | [`./portfolio_tan/index.html`](./portfolio_tan/index.html) |
| 2 | **Đinh Thanh Thiên** | AI & 3D Interactive Web (Three.js & Spline) | [`./pro5thanhthien/pro5/dist/index.html`](./pro5thanhthien/pro5/dist/index.html) |
| 3 | **Phạm Gia Khiêm (Ryuu)** | Android & Backend Developer (Kotlin, Java, Node.js) | [`./portfolio_khiem/index.html`](./portfolio_khiem/index.html) |
| 4 | **Bùi Gia Hưng** | Software, Data & Smart Logistics | [`./portfolio-bui-gia-hung/portfolio-bui-gia-hung/index.html`](./portfolio-bui-gia-hung/portfolio-bui-gia-hung/index.html) |
| 5 | **Nguyễn Đăng Khôi** | Computer Science & Algorithms | [`./myportfolio-master/index.html`](./myportfolio-master/index.html) |
| 6 | **Đoàn Đăng Khoa** | Web Developer & Software Engineering | [`./portfolio-khoa/index.html`](./portfolio-khoa/index.html) |

---

## 📁 Cấu Trúc Thư Mục Dự Án

```text
port nhóm/
├── index.html                    # Trang Hub tổng hợp 6 thành viên (Trang chủ)
├── server.js                     # Máy chủ Node.js cục bộ (Zero-dependency)
├── start-server.bat              # Script 1-click khởi chạy trên Windows
├── push-to-github.bat            # Script hỗ trợ kết nối và đẩy code lên GitHub
├── .gitignore                    # Bỏ qua node_modules, log, tệp tạm
├── README.md                     # Tài liệu giới thiệu dự án
│
├── portfolio_tan/                # Portfolio: Nguyễn Duy Tân
├── pro5thanhthien/               # Portfolio: Đinh Thanh Thiên (React 18 + Three.js)
│   └── pro5/
│       ├── dist/                 # Bản build tĩnh hoàn chỉnh (có video gương mặt & 3D)
│       ├── src/                  # Mã nguồn React + TypeScript + Tailwind
│       └── package.json
├── portfolio_khiem/              # Portfolio: Phạm Gia Khiêm
├── portfolio-bui-gia-hung/       # Portfolio: Bùi Gia Hưng
├── myportfolio-master/           # Portfolio: Nguyễn Đăng Khôi
└── portfolio-khoa/               # Portfolio: Đoàn Đăng Khoa
```

---

## 🚀 Hướng Dẫn Khởi Chạy Localhost

Tất cả 6 portfolio đã được thiết kế tương thích hoàn toàn để chạy chung trên **1 cổng (Port) duy nhất**:

### Cách 1: Click đúp 1-Click (Khuyên dùng trên Windows)
- Nhấp đúp vào file `start-server.bat`. Trình duyệt sẽ tự động mở `http://localhost:5500`.

### Cách 2: Sử dụng VS Code Live Server
- Mở thư mục dự án trong VS Code.
- Chuột phải vào file `index.html` -> Chọn **Open with Live Server**.

### Cách 3: Dùng Node.js hoặc Python CLI
```bash
# Bằng Node.js
node server.js

# Hoặc bằng Python
python -m http.server 5500
```

---

## 🌍 Hướng Dẫn Triển Khai Lên GitHub Pages

Dự án này sử dụng 100% đường dẫn tương đối, sẵn sàng để host trực tiếp miễn phí trên GitHub Pages:

1. Đẩy mã nguồn lên repository GitHub của bạn (xem hướng dẫn bên dưới).
2. Trên trang repository tại GitHub: Vào **Settings** -> mục **Pages** (bên trái).
3. Tại phần **Build and deployment**:
   - **Source:** Chọn `Deploy from a branch`
   - **Branch:** Chọn `main` và thư mục `/ (root)` -> bấm **Save**.
4. Chờ 1–2 phút, website của nhóm bạn sẽ hoạt động trực tuyến tại địa chỉ:  
   `https://tannd0059-prog.github.io/portfolio-nhom/`

---

## 📤 Hướng Dẫn Đẩy Lên GitHub Lần Đầu

```bash
# 1. Khởi tạo Git
git init

# 2. Thêm tất cả tệp vào Staging
git add .

# 3. Tạo commit đầu tiên
git commit -m "feat: complete team portfolio hub for 6 members"

# 4. Đổi nhánh chính thành main
git branch -M main

# 5. Kết nối với repository GitHub của bạn
git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git

# 6. Đẩy lên GitHub
git push -u origin main
```

---
© 2026 Nhóm Sinh Viên CNTT — Trường Đại Học Giao Thông Vận Tải TP.HCM (UTH).
