# CẨM NANG THIẾT LẬP SPLINE 3D EDITOR (SPLINE SETUP & EXPORT GUIDE)
**Mã tài liệu:** `SOP-SPLINE-SETUP-01`  
**Dự án:** 3D Interactive Portfolio — Đinh Thanh Thiên  
**Tương thích mã nguồn:** `src/config/sceneConfig.ts` & `src/config/portfolioData.ts`  

---

## 1. TỔNG QUAN TÍCH HỢP (INTEGRATION OVERVIEW)

Ứng dụng Web Portfolio kết nối với mô hình 3D thông qua **Spline Runtime Bridge**. Để đảm bảo toàn bộ cơ chế đổi góc camera, raycasting mở modal dự án và đồng bộ biến hoạt động chuẩn xác 100%, các đối tượng trong **Spline Editor (Hierarchy)** và các **State/Events** bắt buộc phải khớp chính xác với các hằng số đã định nghĩa trong mã nguồn frontend.

```
┌─────────────────────────────────┐                 ┌─────────────────────────────────┐
│     SPLINE 3D EDITOR SCENE      │                 │     REACT FRONTEND APPLICATION  │
│                                 │                 │                                 │
│  • Object: "Monitor_Screen"     │ ── Raycast ───> │  • Opens: ALPR Project Modal    │
│  • Object: "Laptop_Mesh"        │ ── Raycast ───> │  • Opens: ETA Logistics Modal   │
│  • Trigger: Camera_Projects...  │ <── emitEvent ─ │  • Tab Click: [Projects]        │
│  • Variable: activeSection      │ <── setVariable │  • State: 'home'|'about'|...    │
└─────────────────────────────────┘                 └─────────────────────────────────┘
```

---

## 2. QUY CHUẨN ĐẶT TÊN ĐỐI TƯỢNG TRONG HIERARCHY (OBJECT NAMING)

Trong bảng **Hierarchy bên trái của Spline Editor**, bạn cần đặt tên chính xác (phân biệt hoa thường) cho các vật thể tương tác:

| Tên Object trong Spline Hierarchy | Loại đối tượng (Type) | Hành vi tương ứng trên Web Portfolio | ID dự án liên kết (`portfolioData.ts`) |
| :--- | :--- | :--- | :--- |
| **`Monitor_Screen`** | Mesh hoặc Group (Màn hình PC) | Bật Modal xem chi tiết dự án ALPR Computer Vision | `alpr` |
| **`Laptop_Mesh`** | Mesh hoặc Group (Laptop trên bàn) | Bật Modal xem chi tiết dự án Smart Logistics ETA Prediction | `eta-logistics` |
| **`Notebook_CV`** | Mesh hoặc Group (Sổ tay / CV) | Chuyển ngay góc camera & tab sang phần **About Me** | `targetSection: 'about'` |
| **`Desk_Lamp`** | Mesh hoặc Group (Đèn bàn làm việc) | Bật Modal xem chi tiết nền tảng Gold Price Prediction | `gold-prediction` |

> [!TIP]
> Bạn có thể nhóm các chi tiết phức tạp lại thành một **Group** và đặt tên Group theo bảng trên (ví dụ: Group màn hình gồm chân đế, khung và mặt kính ➔ Đặt tên Group là `Monitor_Screen`).

---

## 3. CẤU HÌNH CAMERA STATES & TRIGGER EVENTS (CAMERA TRANSITIONS)

Khi người dùng nhấn phím tắt `[1-4]` hoặc click vào các tab Navbar (`Home`, `About`, `Projects`, `Contact`), Frontend sẽ gửi lệnh:
```typescript
splineApp.emitEvent('mouseDown', SCENE_CONFIG.cameraTriggers[section]);
```

### 3.1. Danh sách tên Trigger Object / Events bắt buộc

| Tên Trigger trong Spline | Sự kiện kích hoạt | Góc Camera tương ứng | Section kích hoạt |
| :--- | :--- | :--- | :--- |
| **`Camera_Home_Trigger`** | `Mouse Down` | Góc nhìn toàn cảnh bàn làm việc Workspace tổng thể | `home` (Phím `1`) |
| **`Camera_About_Trigger`** | `Mouse Down` | Góc nhìn cận cảnh sổ tay `Notebook_CV` hoặc góc học vấn | `about` (Phím `2`) |
| **`Camera_Projects_Trigger`** | `Mouse Down` | Góc nhìn tập trung vào `Monitor_Screen` & `Laptop_Mesh` | `projects` (Phím `3`) |
| **`Camera_Contact_Trigger`** | `Mouse Down` | Góc nhìn thư thái về đèn bàn `Desk_Lamp` hoặc danh thiếp | `contact` (Phím `4`) |

### 3.2. Cách thiết lập trong Spline Editor:
1. Tạo 4 Empty Object (hoặc 4 Triggers) và đặt tên lần lượt theo bảng trên.
2. Tại bảng **Events bên phải**:
   - Chọn Event: **Mouse Down**.
   - Action: **Transition**.
   - Target: **Camera**.
   - To State: Chọn State góc nhìn camera mong muốn (ví dụ `State_Projects`).
   - Duration: `0.8s` – `1.2s`, Easing: `Ease In Out`.

---

## 4. KHAI BÁO BIẾN TOÀN CỤC TRONG SPLINE (SPLINE VARIABLES)

Tại thanh công cụ trên cùng của Spline Editor, mở tab **Variables** và tạo các biến sau:

| Tên biến (Variable Name) | Kiểu dữ liệu | Giá trị mặc định | Mục đích sử dụng |
| :--- | :--- | :--- | :--- |
| **`activeSection`** | `String` | `"home"` | Đồng bộ mục hiện tại giữa Web và Scene 3D |
| **`isDarkMode`** | `Boolean` | `true` | Điều khiển độ sáng đèn / vật liệu dạ quang |
| **`mouseOffsetX`** | `Number` | `0.0` | Nhận tọa độ con trỏ chuột trục X để tạo hiệu ứng Parallax |
| **`mouseOffsetY`** | `Number` | `0.0` | Nhận tọa độ con trỏ chuột trục Y để tạo hiệu ứng Parallax |

---

## 5. QUY TRÌNH TỐI ƯU HÓA HIỆU NĂNG TRƯỚC KHI EXPORT (PERFORMANCE CHECKLIST)

Để đảm bảo website đạt chuẩn **60FPS** trên mọi thiết bị và file nạp nhanh dưới 3 giây:

- [ ] **Gộp khối tĩnh (Merge Geometries)**: Gộp các vật thể không chuyển động (mặt bàn, chân bàn, tường, giá sách) thành một mesh duy nhất để giảm **Draw Calls < 60**.
- [ ] **Khống chế Polycount**: Tổng số triangles toàn cảnh < **70.000 tris**.
- [ ] **Kích thước Texture**: Sử dụng tối đa **1024x1024px** (chỉ dùng 2048px cho chi tiết tiêu điểm màn hình chính).
- [ ] **Ánh sáng (Lighting)**: Chỉ bật bóng đổ (Cast Shadow) cho **1 Directional Light chính**. Tắt shadow cho tất cả Point Light và Ambient Light.
- [ ] **Hiệu ứng Post-Processing**: Tắt **Depth of Field (DoF)** và **Motion Blur**. Giữ Bloom ở mức nhẹ (`Intensity: 0.15`).

---

## 6. XUẤT FILE & CẤU HÌNH VÀO DỰ ÁN (EXPORT TO PRODUCTION)

1. Trong Spline Editor, nhấn nút **Export** ở góc trên bên phải.
2. Chọn mục **Code** ➔ Chọn tab **Web Content / Vanilla JS**.
3. Sao chép đường dẫn file `.splinecode` công khai (có dạng `https://prod.spline.design/xxxxxxxx/scene.splinecode`).
4. Mở file [`.env`](file:///c:/Users/thiendz002/Downloads/pro5/.env) trong thư mục gốc dự án và dán link vào:
   ```env
   VITE_SPLINE_SCENE_URL=https://prod.spline.design/your-actual-hash/scene.splinecode
   ```
5. Chạy lệnh kiểm tra môi trường:
   ```bash
   npm run build
   ```
6. Khởi động môi trường xem trước cục bộ:
   ```bash
   npm run dev
   ```
   Sau đó mở trình duyệt tại `http://localhost:3000` để trải nghiệm!
