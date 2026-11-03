# Portfolio — Nguyễn Đăng Khôi

Portfolio cá nhân bằng HTML / CSS / JavaScript thuần (không cần cài đặt hay build).
Mở `index.html` bằng trình duyệt là chạy (cần có mạng để tải font và icon).

## Cách chỉnh sửa nội dung
**Chỉ cần sửa `assets/js/content.js`.** Các dòng có chữ `✏️ SỬA` là chỗ nên kiểm tra lại cho đúng với bạn.
Lưu file rồi tải lại trang (F5). Muốn ẩn một phần thì để danh sách của phần đó rỗng (`[]`).

- Thêm ảnh slideshow: bỏ ảnh vào `assets/images/gallery/` rồi thêm một dòng trong `gallery` của `content.js`.
- Đổi tông màu: sửa `--accent` và `--accent-2` ở đầu `assets/css/base.css`.
- Nút **Về Hub**: sửa `hub.url` trong `content.js` (mặc định `../index.html`).

## Cấu trúc thư mục
```
index.html              Khung HTML (semantic: header, nav, main, section, form, footer)
assets/
  css/  base.css        Biến màu, bố cục chung, navbar, nút, tab, modal
        sections.css    Giao diện từng phần
        effects.css     Hiệu ứng, animation, hiện dần khi cuộn
  js/   content.js      ← NỘI DUNG CỦA BẠN
        core.js         Tiện ích dùng chung, tabs, modal
        render.js       Dựng các phần từ content.js
        gallery.js      Slideshow ảnh
        effects.js      Mạng hạt, gõ chữ, đếm số, thẻ nghiêng 3D...
        ui.js           Dark mode, menu mobile, scroll-spy, nút lên đầu
        form.js         Kiểm tra form liên hệ
  images/               avatar, gallery/, projects/, favicon
```

## Đối chiếu tiêu chí
| # | Tiêu chí | Vị trí trong portfolio |
|---|----------|------------------------|
| 1 | Header / Navbar / Banner | Thanh menu cố định + banner đầu trang, menu cuộn tới đúng section |
| 2 | Giới thiệu bản thân | Banner + mục **Về tôi** |
| 3 | Mục tiêu nghề nghiệp | Mục **Mục tiêu nghề nghiệp** (ngắn / trung / dài hạn) |
| 4 | Kỹ năng | Mục **Kỹ năng** (thanh tiến độ theo nhóm) |
| 5 | Học vấn / Kinh nghiệm / Hoạt động | Mục **Học vấn & Hoạt động** (2 timeline) |
| 6 | Dự án (≥ 2) | Mục **Dự án**: tên, mô tả, công nghệ, ảnh, link, modal chi tiết |
| 7 | Chứng chỉ / Giải thưởng / Sở thích | **Thành tích & Chứng chỉ**, **Sở thích & Ẩm thực** |
| 8–9 | HTML semantic, Flexbox/Grid | `index.html`, `sections.css` |
| 10–11 | Thẩm mỹ, Responsive | Desktop / Tablet / Mobile |
| 12 | CSS3 | hover, transition, transform, animation, `@keyframes` |
| 13–14 | JavaScript & tương tác | Dark mode, menu mobile, slideshow, modal, bộ lọc dự án, tabs, nút lên đầu, scroll-spy |
| 15 | Form liên hệ | Mục **Liên hệ**, kiểm tra bằng `form.js` |
| 16–18 | Clean code, tổ chức source, cá nhân hóa | CSS/JS tách file, thư mục css / js / images |
| 19 | Sáng tạo | Banner mạng hạt + gõ chữ, khung code trang trí, slideshow, thẻ nghiêng 3D, dải công nghệ chạy ngang |

## Ghi chú về form liên hệ
Trang tĩnh không có máy chủ, nên khi dữ liệu hợp lệ, form mở ứng dụng email của người gửi
với nội dung đã điền sẵn, gửi tới email trong `content.js`.
