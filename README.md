# 🌐 UTH Web Development Team — Portfolio Hub Nhóm

> **Trường Đại Học Giao Thông Vận Tải TP.HCM (UTH)**  
> **Khoa Công Nghệ Thông Tin** • **Bộ Môn Lập Trình Web**  
> Dự án cổng thông tin tích hợp và hiển thị hồ sơ năng lực cá nhân (Portfolio Hub) của nhóm 6 sinh viên CNTT.

---

## 👥 Danh Sách Thành Viên & Vai Trò

| STT | Thành viên | Chuyên môn & Định hướng | Liên kết Portfolio |
|:---:|---|---|---|
| 1 | **Nguyễn Duy Tân** | Software Engineering & Frontend Developer | [`./portfolio_tan/index.html`](./portfolio_tan/index.html) |
| 2 | **Đinh Thanh Thiên** | AI & Smart Logistics Developer | [`./portfolio_thien/index.html`](./portfolio_thien/index.html) |
| 3 | **Phạm Gia Khiêm (Ryuu)** | Android & Backend Developer | [`./portfolio_khiem/index.html`](./portfolio_khiem/index.html) |
| 4 | **Bùi Gia Hưng** | Software, Data & Smart Logistics | [`./portfolio_hung/index.html`](./portfolio_hung/index.html) |
| 5 | **Nguyễn Đăng Khôi** | Computer Science & Algorithms | [`./portfolio_khoi/index.html`](./portfolio_khoi/index.html) |
| 6 | **Đoàn Đăng Khoa** | Web Developer & Software Engineering | [`./portfolio_khoa/index.html`](./portfolio_khoa/index.html) |

---

## 📁 Cấu Trúc Thư Mục Đồng Bộ & Tối Giản (100% Web Tĩnh)

```text
port nhóm/
├── index.html                    # Trang Hub tổng hợp 6 thành viên (Trang chủ)
├── .nojekyll                     # Tắt Jekyll để chạy ngay trên GitHub Pages
├── _config.yml                   # Cấu hình GitHub Pages
├── .gitignore                    # Bỏ qua tệp hệ thống tạm
├── README.md                     # Giới thiệu dự án & Hướng dẫn
├── push-to-github.bat            # Script 1-click đẩy lên GitHub
├── start-server.bat              # Script chạy server cục bộ nếu muốn
│
├── portfolio_tan/                # Portfolio: Nguyễn Duy Tân (HTML/CSS/JS)
├── portfolio_thien/              # Portfolio: Đinh Thanh Thiên (HTML/CSS/JS + Face Video)
├── portfolio_khiem/              # Portfolio: Phạm Gia Khiêm (HTML/CSS/JS)
├── portfolio_hung/               # Portfolio: Bùi Gia Hưng (HTML/CSS/JS)
├── portfolio_khoi/               # Portfolio: Nguyễn Đăng Khôi (HTML/CSS/JS)
└── portfolio_khoa/               # Portfolio: Đoàn Đăng Khoa (HTML/CSS/JS)
```

---

## 🚀 Cách Mở & Xem Trang Web

Dự án được xây dựng hoàn toàn bằng **HTML5, CSS3 và JavaScript thuần túy**:
- **Không cần Live Server hay môi trường máy chủ phức tạp:** Bạn có thể mở trực tiếp file `index.html` bằng cách nhấp đúp chuột để xem trên trình duyệt Chrome, Edge, Cốc Cốc.
- **Xem trực tuyến trên GitHub Pages:**  
  👉 **`https://tannd0059-prog.github.io/portfolio-nhom/`**

---

## 📤 Hướng Dẫn Đẩy Lên GitHub

Chỉ cần nhấp đúp vào file `push-to-github.bat` hoặc chạy lệnh:
```bash
git add -A
git commit -m "feat: standardize all 6 member portfolios to pure HTML/CSS/JS"
git push origin main -f
```

---
© 2026 Nhóm Sinh Viên CNTT — Trường Đại Học Giao Thông Vận Tải TP.HCM (UTH).
