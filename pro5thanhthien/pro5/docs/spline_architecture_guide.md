# TÀI LIỆU KIẾN TRÚC KỸ THUẬT: TÍCH HỢP SPLINE 3D VÀO WEB PORTFOLIO HIỆN ĐẠI
**Mã tài liệu:** `ARC-SPLINE-3D-PORTFOLIO-01`  
**Phiên bản:** 1.0.0  
**Giai đoạn:** Phase 0 — Nghiên cứu & Thiết kế Kiến trúc Kỹ thuật (Technical Architecture Document)  
**Tác giả:** AI Engineering Team  

---

## 1. TỔNG QUAN HỆ THỐNG & MÔ HÌNH KIẾN TRÚC (SYSTEM ARCHITECTURE OVERVIEW)

### 1.1. Bối cảnh & Mục tiêu (Context & Objective)
Xây dựng một website Portfolio cá nhân mang phong cách **Dark Mode / Interactive Workspace 3D** (bàn làm việc tương tác, avatar 3D hoặc môi trường tech desk phản hồi theo tọa độ trỏ chuột, góc nhìn camera tự động chuyển động mượt mà khi người dùng cuộn trang hoặc nhấp chọn các mục: `Home`, `About`, `Projects`, `Contact`).

Mục tiêu kỹ thuật cốt lõi:
- Đạt hiệu năng rendering mượt mà (**60fps**) trên thiết bị phổ thông.
- Trải nghiệm liền mạch giữa thế giới 3D (WebGL Canvas) và tầng giao diện HTML/CSS thông thường (Buttons, Cards, Modals, Forms).
- Kiểm soát triệt để hiện tượng xung đột chuột (pointer hit-testing), tránh giật khung hình (FOUC), giải phóng bộ nhớ WebGL để chống rò rỉ RAM/VRAM.

### 1.2. Vị trí hệ thống & Ranh giới thành phần (System Placement & Component Boundaries)

```
[ Người dùng / User Input ]
        │
        ├── Chuột, Cuộn trang, Bàn phím
        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    TRÌNH DUYỆT WEB (BROWSER RUNTIME)                   │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │ TẦNG GIAO DIỆN PHẲNG (UI OVERLAY LAYER - DOM/HTML)              │   │
│   │ - Navbar, Tabs, Project Cards, Contact Form, Modals             │   │
│   │ - Quản lý tương tác click, hover, form input                    │   │
│   │ - CSS: pointer-events: none (Wrapper), auto (Interactive nodes) │   │
│   └──────────────────────────────┬──────────────────────────────────┘   │
│                                  │                                      │
│                  ┌───────────────┴───────────────┐                      │
│                  │  EVENT BUS / STATE CONTROLLER │                      │
│                  └───────────────┬───────────────┘                      │
│                                  │                                      │
│   ┌──────────────────────────────▼──────────────────────────────────┐   │
│   │ TẦNG KHÔNG GIAN 3D (CANVAS LAYER - SPLINE RUNTIME)              │   │
│   │ - WebGL 2.0 Canvas (`<canvas id="spline-canvas">`)              │   │
│   │ - Spline Application Instance (Scene Graph, Cameras, Meshes)   │   │
│   │ - Physics, State Machine, Spline Variables                      │   │
│   └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. CƠ CHẾ GIAO TIẾP 2 CHIỀU (BIDIRECTIONAL COMMUNICATION)

### 2.1. Phân tích nguyên lý

Một trong những sai lầm phổ biến nhất khi tích hợp 3D vào web là xem canvas 3D như một "video tĩnh" chạy ngầm. Trong kiến trúc hiện đại, Spline Scene và DOM Application là hai hệ thống thực thi độc lập nhưng đồng bộ trạng thái thông qua cơ chế **Event-Driven & Reactive State**.

```
Problem:    DOM và 3D Scene sử dụng hai context kết xuất hoàn toàn khác nhau (DOM Tree vs WebGL Context).
Constraint: DOM không thể trực tiếp truy cập bộ nhớ Three.js/Spline nội bộ; Spline không thể tự render thẻ HTML.
Mechanism:  Cầu nối truyền thông hai chiều (Bidirectional Bridge) sử dụng Spline Runtime API (`emitEvent`, `setVariable`) cho chiều xuống, và Spline Raycasting Callbacks (`addEventListener`, `onSplineMouseDown`) cho chiều lên.
Result:     Đồng bộ tức thời hai chiều, giảm thiểu coupling, giữ logic giao diện độc lập với scene 3D.
```

### 2.2. Chiều 1: Web DOM ➔ Spline 3D Runtime

Khi người dùng thao tác trên DOM (click tab menu điều hướng, trượt slider, gõ phím, hoặc scroll trang):
1. **Trigger Camera Transitions**: Đổi góc máy sang bàn làm việc (`Projects`), màn hình code (`About`), hoặc bảng ghi chú (`Contact`). Trong Spline Editor, mỗi trạng thái camera được gán với một **State** hoặc **Event Trigger** (ví dụ: `Mouse Down`, `Start`, hoặc Custom Event). DOM kích hoạt thông qua `spline.emitEvent(eventName, objectNameOrUuid)`.
2. **Cập nhật Biến (Variable Updates)**: Spline cho phép định nghĩa các biến toàn cục (Spline Variables) như biến số (`cameraIndex: 0..3`), biến logic (`isDarkMode: true`), biến chuỗi (`currentSection: "projects"`). Web DOM sử dụng `spline.setVariable(variableName, value)` để thay đổi tham số điều khiển animation hoặc shader.
3. **Thao tác trực tiếp Node trong Scene Graph**: Sử dụng `spline.findObjectByName(name)` để lấy đối tượng 3D (Mesh, Camera, Group), sau đó can thiệp trực tiếp vào thuộc tính vật lý: vị trí (`position.x/y/z`), góc xoay (`rotation.x/y/z`), độ co giãn (`scale.x/y/z`).

### 2.3. Chiều 2: Spline 3D Scene ➔ Web DOM

Khi người dùng di chuột hoặc nhấp chuột vào một vật thể 3D bên trong canvas (ví dụ: mô hình Laptop, Màn hình máy tính, Tập hồ sơ CV):
1. **Spline Internal Raycaster**: Spline Runtime tự động bắn tia raycast từ vị trí con trỏ màn hình vào không gian 3D để xác định mesh va chạm.
2. **Event Dispatching**: Nếu vật thể có trigger tương tác, Spline runtime phát ra sự kiện (`mouseDown`, `mouseHover`, `mouseUp`).
3. **Web Callback Handler**: Lập trình viên lắng nghe sự kiện bằng `spline.addEventListener(eventType, callback)` hoặc prop `onSplineMouseDown` (React). Dựa trên thuộc tính `e.target.name` hoặc `e.target.id`, ứng dụng Web kích hoạt các hành vi DOM tương ứng:
   - Mở Modal hiển thị chi tiết dự án (khi click vào màn hình Laptop 3D).
   - Tải file PDF CV về máy (khi click vào mô hình tập hồ sơ CV).
   - Cập nhật state URL/History API (`history.pushState`).

---

### 2.4. Sơ đồ ASCII: Luồng truyền sự kiện 2 chiều (Bidirectional Event Flow)

```text
===================================================================================================
                       SƠ ĐỒ LUỒNG TRUYỀN SỰ KIỆN HAI CHIỀU (BIDIRECTIONAL EVENT FLOW)
===================================================================================================

[ CHIỀU 1: WEB DOM ➔ SPLINE 3D ]

  User Action           DOM Element             Controller Bridge                 Spline Runtime
┌─────────────┐       ┌─────────────┐       ┌────────────────────────┐         ┌────────────────────────┐
│ Click Tab   │ ────> │ <button     │ ────> │ handleTabChange()      │ ──────> │ spline.emitEvent(      │
│ "Projects"  │       │ data-tab>   │       │ - activeTab = 'proj'   │         │   'mouseDown',         │
└─────────────┘       └─────────────┘       │ - update UI state      │         │   'Camera_Projects'    │
                                            └────────────────────────┘         │ )                      │
                                                                               │          HOẶC          │
                                                                               │ spline.setVariable(    │
                                                                               │   'targetView', 2      │
                                                                               │ )                      │
                                                                               └───────────┬────────────┘
                                                                                           │
                                                                                           ▼
                                                                               ┌────────────────────────┐
                                                                               │ Camera nội suy (Lerp)  │
                                                                               │ mượt mà sang góc nhìn  │
                                                                               │ Projects Workspace 3D  │
                                                                               └────────────────────────┘

───────────────────────────────────────────────────────────────────────────────────────────────────

[ CHIỀU 2: SPLINE 3D ➔ WEB DOM ]

  User Action          WebGL Canvas                Spline Runtime                   DOM Application
┌─────────────┐       ┌─────────────┐       ┌────────────────────────┐         ┌────────────────────────┐
│ Click vào   │ ────> │ <canvas>    │ ────> │ Spline Raycasting      │ ──────> │ spline.addEventListener│
│ Object 3D   │       │ WebGL Event │       │ - Detect hit mesh      │         │ ('mouseDown', (e) => { │
│ (e.g. PC)   │       └─────────────┘       │ - Mesh name: "PC_Mesh" │         │   if (name === 'PC') { │
└─────────────┘                             └────────────────────────┘         │     openModal('proj-1')│
                                                                               │   }                    │
                                                                               │ })                     │
                                                                               └───────────┬────────────┘
                                                                                           │
                                                                                           ▼
                                                                               ┌────────────────────────┐
                                                                               │ HTML Project Detail    │
                                                                               │ Modal hiển thị với     │
                                                                               │ hiệu ứng Glassmorphism │
                                                                               └────────────────────────┘
===================================================================================================
```

---

### 2.5. Đoạn code minh họa API tương tác thực tế (Code Snippets)

#### A. Triển khai với `@splinetool/runtime` (Vanilla JS / TypeScript)

```typescript
// src/services/SplineController.ts
import { Application, SPEObject } from '@splinetool/runtime';

export class SplineController {
  private app: Application | null = null;
  private canvas: HTMLCanvasElement;
  private isLoaded: boolean = false;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
  }

  public async initialize(sceneUrl: string, onProgress?: (pct: number) => void): Promise<void> {
    this.app = new Application(this.canvas);
    
    // Tải scene file .splinecode
    await this.app.load(sceneUrl);
    this.isLoaded = true;

    // Đăng ký nhận callbacks từ 3D Scene bắn ra DOM
    this.setupSplineToWebListeners();
  }

  // ================= CHIỀU 1: WEB -> SPLINE =================
  
  /**
   * Kích hoạt chuyển đổi Camera State theo tab điều hướng
   * @param sectionId 'home' | 'about' | 'projects' | 'contact'
   */
  public navigateToSection(sectionId: string): void {
    if (!this.app || !this.isLoaded) return;

    const cameraTriggerMap: Record<string, string> = {
      home: 'Camera_Home_Trigger',
      about: 'Camera_About_Trigger',
      projects: 'Camera_Projects_Trigger',
      contact: 'Camera_Contact_Trigger',
    };

    const targetTriggerName = cameraTriggerMap[sectionId];
    if (targetTriggerName) {
      // Bắn event 'mouseDown' vào trigger object đã gán animation transition trong Spline
      this.app.emitEvent('mouseDown', targetTriggerName);
    }

    // Đồng thời cập nhật biến trạng thái bên trong Spline
    this.app.setVariable('activeSection', sectionId);
  }

  /**
   * Đồng bộ góc nhìn camera theo vị trí con trỏ chuột (Custom Parallax)
   */
  public updateCursorParallax(normalizedX: number, normalizedY: number): void {
    if (!this.app || !this.isLoaded) return;
    
    // Giả sử có biến 'mouseOffsetX' và 'mouseOffsetY' trong Spline
    this.app.setVariable('mouseOffsetX', normalizedX);
    this.app.setVariable('mouseOffsetY', normalizedY);
  }

  // ================= CHIỀU 2: SPLINE -> WEB =================

  private setupSplineToWebListeners(): void {
    if (!this.app) return;

    // Lắng nghe sự kiện click chuột vào các mesh trong 3D
    this.app.addEventListener('mouseDown', (e: { target: SPEObject }) => {
      const objectName = e.target.name;
      console.log(`[Spline Event] Clicked 3D Object: ${objectName}`);

      switch (objectName) {
        case 'Monitor_Screen':
        case 'Laptop_Mesh':
          // Bắn CustomEvent ra ngoài cho DOM Application xử lý mở modal
          window.dispatchEvent(
            new CustomEvent('spline:open-project-modal', {
              detail: { projectId: 'featured-ai-project', sourceName: objectName }
            })
          );
          break;

        case 'Notebook_CV':
          window.dispatchEvent(
            new CustomEvent('spline:download-cv', {
              detail: { timestamp: Date.now() }
            })
          );
          break;

        case 'Desk_Lamp':
          // Toggle trạng thái đèn bàn -> bắn tín hiệu chuyển Dark/Light mode cho website
          window.dispatchEvent(new CustomEvent('spline:toggle-theme'));
          break;

        default:
          break;
      }
    });

    // Lắng nghe sự kiện Hover để đổi con trỏ chuột sang hình pointer trên canvas
    this.app.addEventListener('mouseHover', (e: { target: SPEObject }) => {
      const interactiveObjects = ['Monitor_Screen', 'Laptop_Mesh', 'Notebook_CV', 'Desk_Lamp'];
      if (interactiveObjects.includes(e.target.name)) {
        this.canvas.style.cursor = 'pointer';
      }
    });
  }

  public destroy(): void {
    if (this.app) {
      this.app.dispose();
      this.app = null;
      this.isLoaded = false;
    }
  }
}
```

#### B. Triển khai với `@splinetool/react-spline` (React Ecosystem)

```tsx
// src/components/SplineWorkspace.tsx
import React, { useRef, useCallback } from 'react';
import Spline from '@splinetool/react-spline';
import type { Application, SPEObject } from '@splinetool/runtime';

interface SplineWorkspaceProps {
  sceneUrl: string;
  onSceneLoaded: () => void;
  onOpenProjectModal: (projectId: string) => void;
}

export const SplineWorkspace: React.FC<SplineWorkspaceProps> = ({
  sceneUrl,
  onSceneLoaded,
  onOpenProjectModal,
}) => {
  const splineAppRef = useRef<Application | null>(null);

  const handleLoad = useCallback((splineApp: Application) => {
    splineAppRef.current = splineApp;
    onSceneLoaded();
  }, [onSceneLoaded]);

  // Spline -> React callback
  const handleSplineMouseDown = useCallback((e: { target: SPEObject }) => {
    if (e.target.name === 'Monitor_Screen') {
      onOpenProjectModal('spline-portfolio-v1');
    }
  }, [onOpenProjectModal]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <Spline
        scene={sceneUrl}
        onLoad={handleLoad}
        onSplineMouseDown={handleSplineMouseDown}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};
```

---

## 3. KIẾN TRÚC 2 TẦNG (LAYERING & HIT-TESTING ARCHITECTURE)

### 3.1. Phân tích bài toán xung đột sự kiện chuột

Trong giao diện Web Portfolio hiện đại, trải nghiệm tương tác yêu cầu:
1. Người dùng có thể rê chuột, xoay camera (orbit control), hoặc click vào các vật thể 3D ở phần nền phía sau.
2. Đồng thời, các thành phần giao diện phẳng như thanh điều hướng (Navbar), các thẻ tóm tắt (Info Cards), nút bấm (Buttons), và Hộp thoại (Modals) nằm đè lên trên phải bấm được bình thường.

Nếu không tổ chức CSS Stacking Context và Hit-testing đúng cách:
- **Trường hợp lỗi 1**: UI Overlay có `z-index` cao hơn và chiếm toàn màn hình (`width: 100vw; height: 100vh`) không thiết lập `pointer-events: none`. Kết quả: Toàn bộ canvas 3D bị block sự kiện, người dùng không thể xoay hay click vật thể 3D.
- **Trường hợp lỗi 2**: Canvas có `z-index` đè lên UI. Kết quả: Toàn bộ nút bấm HTML bị vô hiệu hóa.

### 3.2. Giải pháp kỹ thuật: Pointer-Events Dispatch Matrix

Áp dụng mô hình **Pass-through Layering Architecture**:
- **Layer 0 (Canvas Layer)**: Nằm ở lớp nền (`z-index: 0` hoặc `1`), thiết lập `pointer-events: auto` để canvas nhận đầy đủ sự kiện chuột từ trình duyệt.
- **Layer 1 (UI Overlay Layer Wrapper)**: Nằm đè lên trên (`z-index: 10`), trải rộng toàn màn hình (`inset: 0`) nhưng bắt buộc gán `pointer-events: none`. Khi đó, mọi cú click hay cử chỉ rê chuột vào các khoảng trống của web sẽ xuyên thẳng qua wrapper xuống canvas 3D phía sau.
- **Layer 2 (Interactive DOM Children)**: Các phần tử con thực sự cần tương tác (Header, Navigation buttons, Project Cards, Social links, Modals) được gán tường minh `pointer-events: auto`. Khi chuột nằm trên các phần tử này, DOM element sẽ chặn sự kiện và xử lý mà không làm rung lắc hay xoay canvas 3D.

---

### 3.3. Sơ đồ ASCII: Kiến trúc 2 tầng (CSS Stacking & Pointer-events Dispatch Matrix)

```text
===================================================================================================
                  SƠ ĐỒ KIẾN TRÚC XẾP LỚP CSS VÀ ĐIỀU PHỐI SỰ KIỆN CHUỘT
===================================================================================================

[ USER CURSOR DISPATCH ]
          │
          ├── (1) Click vào khoảng trống màn hình
          │     │
          │     ├──> [ UI Wrapper: pointer-events: none ] (Xuyên thấu - KHÔNG CHẶN)
          │     │
          │     └──> [ 3D Canvas: pointer-events: auto  ] (NHẬN EVENT: Orbit/Pan/Hover 3D)
          │
          └── (2) Click vào Nút bấm / Thẻ thông tin
                │
                └──> [ Button: pointer-events: auto     ] (CHẶN EVENT: Kích hoạt onClick DOM)
                     (Sự kiện dừng lại tại DOM, KHÔNG xuyên xuống Canvas)

┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   VIEWPORT WINDOW (100vw x 100vh)                               │
│                                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ LỚP 2: POPUP & MODAL OVERLAY (z-index: 100)                                               │  │
│  │ pointer-events: auto | Backdrop blur | Hiển thị chi tiết dự án khi click vật thể 3D       │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ LỚP 1: UI OVERLAY CONTAINER (z-index: 10, position: fixed, inset: 0)                      │  │
│  │ pointer-events: none (Cho phép con trỏ xuyên thấu qua các khoảng trống)                   │  │
│  │                                                                                           │  │
│  │   ┌──────────────────────────────┐              ┌──────────────────────────────┐          │  │
│  │   │ Navbar / Logo                │              │ Theme Toggle / Social Links  │          │  │
│  │   │ pointer-events: auto         │              │ pointer-events: auto         │          │  │
│  │   └──────────────────────────────┘              └──────────────────────────────┘          │  │
│  │                                                                                           │  │
│  │   ┌──────────────────────────────┐                                                        │  │
│  │   │ Hero Info / Call To Action   │   [ VÙNG TRỐNG XUYÊN THẤU ]                            │  │
│  │   │ pointer-events: auto         │   Con trỏ chuột tự do xoay 3D Desk Setup               │  │
│  │   └──────────────────────────────┘                                                        │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │ LỚP 0: 3D SPLINE CANVAS (z-index: 1, position: fixed, inset: 0)                           │  │
│  │ pointer-events: auto | WebGL 2.0 | Canvas full screen | Xử lý Raycast & 3D Orbit Control  │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
===================================================================================================
```

---

### 3.4. Code Snippet mẫu cấu trúc CSS & HTML Layout

#### File HTML Structure (`index.html` hoặc JSX)

```html
<div class="portfolio-viewport">
  <!-- LỚP 0: 3D Canvas Layer -->
  <div class="canvas-layer" id="canvas-container">
    <canvas id="spline-canvas"></canvas>
  </div>

  <!-- LỚP 1: UI Overlay Layer -->
  <div class="ui-overlay-layer">
    <!-- Header (Interactive) -->
    <header class="top-nav interactive-element">
      <div class="logo">PORTFOLIO.3D</div>
      <nav class="nav-links">
        <button class="nav-item active" data-section="home">Home</button>
        <button class="nav-item" data-section="about">About</button>
        <button class="nav-item" data-section="projects">Projects</button>
        <button class="nav-item" data-section="contact">Contact</button>
      </nav>
    </header>

    <!-- Floating Content Card (Interactive) -->
    <main class="hero-content interactive-element">
      <span class="badge">Creative Developer</span>
      <h1 class="title">Interactive 3D Workspace</h1>
      <p class="description">
        Khám phá không gian làm việc số bằng cách nhấp chuột vào các vật thể 3D.
      </p>
      <div class="actions">
        <button class="btn btn-primary" id="btn-explore">Khám phá Projects</button>
      </div>
    </main>
  </div>

  <!-- LỚP 2: Modal Container (Ẩn mặc định, hiển thị khi click vật thể 3D) -->
  <div class="modal-layer hidden" id="project-modal">
    <div class="modal-backdrop"></div>
    <div class="modal-dialog interactive-element">
      <button class="modal-close-btn" id="modal-close">&times;</button>
      <div class="modal-body">
        <h2>Dự án: AI Agent Automation</h2>
        <p>Chi tiết dự án được kích hoạt trực tiếp từ cú click vào mô hình máy tính 3D.</p>
      </div>
    </div>
  </div>
</div>
```

#### File CSS Styling (`layout.css`)

```css
/* Container gốc khóa khung hình */
.portfolio-viewport {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #0b1120; /* Dark mode background chống chớp trắng */
}

/* ================= LỚP 0: CANVAS ================= */
.canvas-layer {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto; /* Nhận sự kiện chuột để xoay / zoom 3D */
}

.canvas-layer canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}

/* ================= LỚP 1: UI OVERLAY ================= */
.ui-overlay-layer {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 2.5rem;
  box-sizing: border-box;

  /* QUAN TRỌNG: Cho phép chuột xuyên thấu qua nền UI xuống canvas */
  pointer-events: none;
}

/* Tất cả interactive elements bên trong UI Overlay */
.interactive-element,
.interactive-element button,
.interactive-element a,
.interactive-element input {
  /* BẬT LẠI sự kiện chuột cho các nút bấm, link, cards */
  pointer-events: auto;
}

/* Header & Nav */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  backdrop-filter: blur(12px);
  background: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  padding: 0.75rem 1.75rem;
  width: fit-content;
  margin: 0 auto;
}

/* Hero Content Box */
.hero-content {
  max-width: 480px;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.25rem;
  padding: 2rem;
  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
}

/* ================= LỚP 2: MODAL ================= */
.modal-layer {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-layer.hidden {
  display: none;
}

.modal-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  pointer-events: auto;
}

.modal-dialog {
  position: relative;
  z-index: 101;
  background: #151f32;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 1rem;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  pointer-events: auto;
}
```

---

## 4. XỬ LÝ TẢI TÀI NGUYÊN & HIỆU NĂNG (ASSET LOADING & PERFORMANCE)

### 4.1. Preload & Lazy Load chiến lược cho file `.splinecode`

Một file `.splinecode` thực chất là một gói lưu trữ nén nhị phân chứa: Scene Hierarchy, Hình học 3D (Vertices, Indices), Vật liệu & Shaders, Textures, và Keyframe Animations. Kích thước file thường dao động từ **2MB đến 15MB**.

```
Problem:    File .splinecode lớn khiến trình duyệt mất từ 1 - 4 giây để tải và khởi tạo WebGL context.
Constraint: Nếu hiển thị canvas ngay lập tức, người dùng sẽ thấy màn hình trống, sau đó giao diện bị giật (FOUC). Nếu chờ tải xong mới render HTML, điểm FCP (First Contentful Paint) và LCP (Largest Contentful Paint) sẽ bị tụt dốc thê thảm.
Mechanism:  Tách biệt luồng tải (Decoupled Loading Strategy): Render Skeleton/Loading UI ngay lập tức -> Preload file 3D ngầm -> Khởi tạo WebGL -> Hoàn tất `onLoad` -> Kích hoạt Smooth Fade-out chuyển cảnh.
Result:     Giao diện phản hồi tức thì (<100ms), người dùng có phản hồi trực quan (Progress bar), loại bỏ 100% hiện tượng FOUC.
```

#### Chiến lược triển khai tối ưu:
1. **Preload qua thẻ `<link>`**:
   ```html
   <link rel="preload" href="https://prod.spline.design/your-scene-hash/scene.splinecode" as="fetch" crossorigin="anonymous">
   ```
2. **Lazy Load thông qua `IntersectionObserver` hoặc User Intent**:
   - Nếu canvas 3D nằm ở giữa trang (ví dụ phần Projects), không khởi tạo runtime ngay lúc trang mở.
   - Dùng `IntersectionObserver` khi người dùng cuộn đến cách vị trí canvas 200px mới gọi `spline.load()`.
   - Nếu là Background Hero Workspace (ngay trang chủ), kích hoạt load song song ngay sau khi DOM sẵn sàng (`DOMContentLoaded`).

---

### 4.2. Sơ đồ ASCII: Asset Loading Lifecycle & FOUC Prevention Pipeline

```text
===================================================================================================
                   QUY TRÌNH NẠP TÀI NGUYÊN & ĐỒNG BỘ GIAO DIỆN KHÔNG FOUC
===================================================================================================

Thời gian (t)
 │
 ├── [0ms] Trình duyệt nhận HTML
 │    ├── DOMContentLoaded: Hiển thị ngay Skeleton / Spinner / Hero Text tĩnh (FCP cực nhanh)
 │    └── Loading Overlay: Đặt opacity: 1, z-index: 50 che phủ hoàn toàn vùng canvas
 │
 ├── [50ms] Kích hoạt `link rel="preload"` & `spline.load(sceneUrl)`
 │    ├── Trình duyệt tải gói nhị phân `.splinecode`
 │    └── Dispatch sự kiện `progress(loaded / total)` ➔ Cập nhật thanh % loading
 │
 ├── [600ms - 1500ms] Download hoàn tất & Khởi tạo WebGL
 │    ├── WebGL Shaders biên dịch (Shader Compilation)
 │    ├── Upload Textures lên VRAM GPU
 │    └── Spline Runtime phát sự kiện `onLoad()`
 │
 ├── [Sau onLoad] Hoãn 1 frame (`requestAnimationFrame`) để canvas render frame đầu tiên
 │    │
 │    ├── Kích hoạt hiệu ứng Fade Transition (CSS opacity 1 ➔ 0 trong 400ms)
 │    │   Loading Overlay mờ dần để lộ 3D Scene mượt mà bên dưới
 │    │
 │    └── Hủy bỏ hoàn toàn Loading Overlay khỏi DOM (`display: none` hoặc unmount React)
 │
 └── [Hoàn tất] 3D Scene tương tác 60FPS mượt mà, không giật lag, không chớp trắng.
===================================================================================================
```

---

### 4.3. Code Snippet: Loading Manager đồng bộ với `onLoad`

```typescript
// src/utils/SplineSceneLoader.ts
import { Application } from '@splinetool/runtime';

interface LoaderConfig {
  canvas: HTMLCanvasElement;
  loadingOverlay: HTMLElement;
  progressBar?: HTMLElement;
  sceneUrl: string;
}

export async function mountSplineSceneWithLoading({
  canvas,
  loadingOverlay,
  progressBar,
  sceneUrl,
}: LoaderConfig): Promise<Application> {
  const app = new Application(canvas);

  try {
    // 1. Đặt trạng thái ban đầu của Loading Overlay
    loadingOverlay.style.opacity = '1';
    loadingOverlay.style.pointerEvents = 'auto';
    loadingOverlay.style.transition = 'opacity 0.45s cubic-bezier(0.4, 0, 0.2, 1)';

    // 2. Tải scene file
    await app.load(sceneUrl);

    // 3. Đợi WebGL render khung hình đầu tiên tránh flash đen/trắng
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // 4. Mờ dần Loading Overlay
        loadingOverlay.style.opacity = '0';
        loadingOverlay.style.pointerEvents = 'none';

        // 5. Sau khi transition CSS hoàn tất, ẩn hoàn toàn
        setTimeout(() => {
          loadingOverlay.style.display = 'none';
          console.log('[SplineLoader] 3D Scene loaded and rendered successfully.');
        }, 450);
      });
    });

    return app;
  } catch (error) {
    console.error('[SplineLoader] Failed to load 3D scene:', error);
    loadingOverlay.innerHTML = `
      <div class="error-box">
        <p>Không thể khởi tạo không gian 3D. Đang chuyển sang chế độ fallback tĩnh.</p>
      </div>
    `;
    throw error;
  }
}
```

---

### 4.4. Các điểm nghẽn hiệu năng (Bottlenecks) & Quy chuẩn tối ưu khi xuất từ Spline

| Thành phần kiểm soát | Vấn đề / Điểm nghẽn | Ngưỡng rủi ro | Quy chuẩn tối ưu hóa bắt buộc khi Export từ Spline |
| :--- | :--- | :--- | :--- |
| **Draw Calls** | Quá nhiều mesh rời rạc khiến CPU tốn tài nguyên gửi lệnh vẽ cho GPU | > 120 calls | • **Gộp Mesh (Merge Geometries)**: Gộp các chi tiết tĩnh không chuyển động (chân bàn, giá sách, bàn phím) thành 1 mesh duy nhất.<br>• Giữ tổng số Draw calls dưới **50 - 70 calls**. |
| **Polycount / Triangles** | Số lượng đa giác quá cao gây nghẽn băng thông đỉnh (Vertex Pipeline) | > 150.000 tris | • Giữ tổng số Triangle count của toàn bộ scene dưới **80.000 - 100.000 tris** cho Desktop, dưới **50.000 tris** cho Mobile.<br>• Dùng công cụ **Decimate / Retopology** trong Spline hoặc Blender trước khi nhập. |
| **Texture & VRAM** | Ảnh texture kích thước 4K/2K không nén làm tràn bộ nhớ VRAM điện thoại | > 50MB VRAM | • Kích thước texture tối đa: **1024x1024px** (chỉ dùng 2048px cho chi tiết tiêu điểm như màn hình chính).<br>• Dùng định dạng nén tối ưu (WebP hoặc KTX2 basis compression nếu hỗ trợ).<br>• Tránh lạm dụng texture procedural quá dày đặc. |
| **Shadows & Lighting** | Đổ bóng thời gian thực (Real-time Shadows) tính toán trên từng frame | > 3 nguồn sáng bóng đổ | • Tối đa **1 Directional Light** có bật Soft Shadow.<br>• Chuyển các đèn phụ sang chế độ No Shadow.<br>• Sử dụng **Bake Lighting (Nướng sáng)** vào texture cho các vật thể tĩnh. |
| **Post-Processing** | Các hiệu ứng Bloom, Chromatic Aberration, Depth of Field (DoF), Screen-space AO | FPS giảm < 30 trên iGPU | • Tắt **Depth of Field** và **Motion Blur** trên môi trường Web.<br>• Giảm bán kính của **Bloom** xuống mức vừa phải.<br>• Tắt tính năng Post-processing đối với thiết bị màn hình nhỏ (Mobile breakpoint). |
| **Pixel Ratio (DPR)** | Render tại DPR = 3 trên màn hình Retina làm tăng số pixel phải tính toán lên gấp 9 lần | Canvas 4K render | • Luôn giới hạn `window.devicePixelRatio` tối đa ở mức **1.5 hoặc 2.0**: `Math.min(window.devicePixelRatio, 2)`. Không để trình duyệt tự do render ở DPR = 3. |

---

## 5. LỰA CHỌN TECH STACK KHUNG WEB (FRAMEWORK TRADE-OFFS & SELECTION)

### 5.1. Ma trận so sánh chi tiết: Vite + React vs Vite + Vanilla JS

```
Problem:    Cần lựa chọn khung công nghệ tối ưu cho Website Portfolio kết hợp 3D tương tác.
Constraint: Dự án yêu cầu vừa có hiệu ứng mượt mà (Smooth transition, camera orbit, parallax), vừa dễ mở rộng thêm trang/dự án trong tương lai, nhưng không được để runtime của UI làm chậm vòng lặp render của WebGL.
```

| Tiêu chí đánh giá | Phương án A: Vite + React (TypeScript) | Phương án B: Vite + Vanilla JS / HTML / SCSS |
| :--- | :--- | :--- |
| **Hỗ trợ Thư viện Spline** | Rất tốt với thư viện chính thức `@splinetool/react-spline` cung cấp declarative props (`onLoad`, `onSplineMouseDown`). | Rất tốt và linh hoạt với `@splinetool/runtime`. Không phụ thuộc vào lifecycle của React component. |
| **Hiệu năng & Bundle Size** | Bundle ban đầu lớn hơn (~45KB gzip cho React core). Cần chú ý tránh trigger re-render component cha khi nhận event từ 3D. | **Cực nhẹ** (0KB framework overhead). Tốc độ tải và phân tích JS tối đa. |
| **Quản lý State phức tạp** | **Vượt trội**: Dễ dàng đồng bộ Modal, Form, Project Filter, Dark Mode thông qua React State/Zustand. | Khó bảo trì hơn khi ứng dụng mở rộng nhiều modal, filters, hoặc dynamic project routing (phải tự viết EventBus hoặc StateStore). |
| **Tích hợp Animation (GSAP)** | Tích hợp rất tốt thông qua `useGSAP()` hook (`@gsap/react`), quản lý cleanup animation tự động chống leak memory. | Tích hợp trực tiếp và tự nhiên nhất với GSAP Timeline và ScrollTrigger. Không lo ngại re-render. |
| **Khả năng mở rộng & Bảo trì** | **Rất cao**: Cấu trúc module component hóa (`<Navbar />`, `<SplineCanvas />`, `<ProjectModal />`), dễ tách code và tái sử dụng. | Thấp hơn: Cần kỷ luật kiến trúc chặt chẽ để tránh mã nguồn Vanilla JS trở thành "Spaghetti DOM code". |
| **Developer Experience (DX)** | Cao: Hỗ trợ HMR mượt, TypeScript gõ chặt chẽ, dễ chia sẻ state giữa các component. | Đơn giản, không cần cấu hình phức tạp, nhưng tốn công viết boilerplate DOM manipulation. |

---

### 5.2. Đề xuất Kiến trúc Stack tối ưu (Recommended Tech Stack)

**Khuyến nghị chính thức:** Lựa chọn **Vite + React (TypeScript) + Tailwind CSS + GSAP**.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    STACK TỔNG HỢP KHUYẾN NGHỊ                           │
├────────────────────────────────┬────────────────────────────────────────┤
│ Build Tool & Core              │ Vite + React 18+ (TypeScript)          │
│ 3D Runtime Integration         │ @splinetool/react-spline + runtime     │
│ UI Layout & Styling            │ Tailwind CSS (Utility-first, Dark Mode)│
│ High-performance Motion/Scroll │ GSAP + ScrollTrigger + @gsap/react     │
│ State Management               │ Zustand (Nhẹ, không gây re-render thừa)│
└────────────────────────────────┴────────────────────────────────────────┘
```

#### Lý do kỹ thuật (Architectural Rationale):
1. **Cô lập Re-render**: Nhờ **Zustand** hoặc React Refs (`useRef`), ta có thể nhận các sự kiện tần suất cao từ Spline (như tọa độ con trỏ chuột, góc quay camera) mà **không làm kích hoạt re-render** toàn bộ cây DOM giao diện, bảo toàn 60fps.
2. **Quản lý UI phức tạp**: Một Portfolio cao cấp sẽ có nhiều mục động: Bộ lọc dự án (Tags), Xem ảnh preview, Modal chi tiết dự án, Trình gửi tin nhắn liên hệ. React xử lý tầng UI này vượt trội so với Vanilla JS.
3. **Phối hợp GSAP mượt mà**: Trong khi Spline xử lý biến đổi không gian 3D, GSAP xử lý các hiệu ứng chữ xuất hiện (Stagger text), thanh tiến trình đọc trang, và hiệu ứng mờ kính (Glassmorphism backdrop fade).

---

## 6. BẢNG TỔNG HỢP API QUAN TRỌNG CỦA SPLINE RUNTIME

Bảng tra cứu các hàm API cốt lõi của `@splinetool/runtime` / `@splinetool/react-spline` bắt buộc sử dụng trong dự án:

| Tên Phương thức / Sự kiện | Tham số (Parameters) | Kiểu trả về | Mục đích & Ứng dụng thực chiến trong Portfolio |
| :--- | :--- | :--- | :--- |
| `new Application(canvas)` | `canvas: HTMLCanvasElement` | `Application` | Khởi tạo thể hiện ứng dụng Spline gắn vào thẻ `<canvas>` của DOM. |
| `await app.load(url)` | `url: string` (Link `.splinecode`) | `Promise<void>` | Tải bất đồng bộ tài nguyên 3D scene, biên dịch shaders và nạp mesh vào bộ nhớ GPU. |
| `app.emitEvent(event, target)` | `event: string`, `target: string \| SPEObject` | `void` | **Web -> Spline**: Kích hoạt sự kiện (ví dụ `'mouseDown'`) lên object cụ thể để chạy animation đổi camera, bật đèn, xoay vật thể. |
| `app.emitEventReverse(event, target)` | `event: string`, `target: string \| SPEObject` | `void` | **Web -> Spline**: Đảo ngược quá trình chuyển đổi trạng thái đã kích hoạt trước đó (hữu ích khi đóng modal, quay lại view cũ). |
| `app.setVariable(name, value)` | `name: string`, `value: number \| boolean \| string` | `void` | **Web -> Spline**: Thay đổi giá trị biến toàn cục trong Spline (ví dụ: chuyển tab `sectionIndex = 2`, bật tắt `isDarkMode = true`). |
| `app.getVariable(name)` | `name: string` | `number \| boolean \| string` | **Web <- Spline**: Đọc giá trị hiện tại của một biến nội bộ trong scene 3D để đồng bộ logic bên ngoài web. |
| `app.findObjectByName(name)` | `name: string` | `SPEObject \| undefined` | Truy vấn đối tượng 3D trong scene graph theo tên đã đặt trong Spline Editor (ví dụ tìm `'Laptop_Mesh'`, `'Camera_Main'`). |
| `app.findObjectById(uuid)` | `uuid: string` | `SPEObject \| undefined` | Truy vấn đối tượng 3D theo mã định danh duy nhất (UUID) tránh xung đột khi có nhiều mesh trùng tên. |
| `app.addEventListener(type, cb)` | `type: SplineEventName`, `cb: (e: SplineEvent) => void` | `void` | **Spline -> Web**: Lắng nghe sự kiện người dùng tương tác trong canvas (`'mouseDown'`, `'mouseHover'`, `'mouseUp'`) để mở Modal HTML. |
| `app.removeEventListener(type, cb)` | `type: SplineEventName`, `cb: Function` | `void` | Hủy đăng ký listener khi unmount component, ngăn chặn hiện tượng rò rỉ bộ nhớ (Memory Leak). |
| `app.setSize(width, height)` | `width: number`, `height: number` | `void` | Cập nhật lại kích thước hiển thị của canvas và ma trận chiếu của Camera khi cửa sổ trình duyệt thay đổi kích thước (`resize`). |
| `app.dispose()` | *Không có* | `void` | **Dọn dẹp tài nguyên**: Giải phóng WebGL context, xóa textures, geometries trong VRAM và hủy toàn bộ animation loop khi rời trang. |

---

## 7. CHECKLIST TRIỂN KHAI THỰC CHIẾN & CÁC LỖI THƯỜNG GẶP (PITFALLS)

### 7.1. Các lỗi phổ biến & Cách phòng tránh

> [!WARNING] Lỗi rò rỉ bộ nhớ WebGL (WebGL Context Leak)
> **Hiện tượng:** Khi người dùng chuyển trang hoặc tab nhiều lần (trong SPA), trình duyệt báo lỗi `WARNING: Too many active WebGL contexts. Oldest context will be lost` hoặc crash tab.  
> **Khắc phục:** Luôn gọi `app.dispose()` trong hàm cleanup của `useEffect` (React) hoặc sự kiện `beforeunload` (Vanilla JS).

> [!CAUTION] Lỗi lệch toạ độ Raycast khi Canvas bị co dãn sai tỉ lệ (Canvas Aspect Distortion)
> **Hiện tượng:** Chuột click vào vật thể 3D nhưng Spline không nhận diện đúng vật thể, hoặc phải click lệch sang bên cạnh mới kích hoạt.  
> **Nguyên nhân:** Thẻ `<canvas>` bị CSS ép kích thước khác với thuộc tính `width` và `height` nội bộ của buffer canvas.  
> **Khắc phục:** Lắng nghe sự kiện `window.resize` và gọi `app.setSize(window.innerWidth, window.innerHeight)` để đồng bộ kích thước khung đệm.

> [!IMPORTANT] Lỗi giật khung hình khi người dùng cuộn trang (Scroll Stuttering)
> **Hiện tượng:** Vừa chạy animation 3D vừa cuộn danh sách dự án khiến FPS tụt từ 60 xuống 25.  
> **Khắc phục:** Tạm dừng (`pause`) animation loop của Spline hoặc hạn chế render khi phần tử 3D bị khuất khỏi màn hình, đồng thời dùng thuộc tính CSS `will-change: transform` cho các thẻ HTML nổi.

---

### 7.2. Bảng kiểm tra trước khi chuyển sang Phase 1 (Scaffolding Checklist)

- [ ] **Scene Setup**: Đặt tên rõ ràng cho các đối tượng quan trọng trong Spline Editor (`Camera_Home`, `Camera_Projects`, `Monitor_Screen`, `Desk_Lamp`).
- [ ] **Trigger Events**: Gán trigger `Mouse Down` / `State Transition` cho các đối tượng tương tác trong Spline Editor.
- [ ] **Asset Size**: File `.splinecode` đã được tối ưu dung lượng dưới **5MB** (đã nén texture, giảm bớt poly).
- [ ] **Layer Hierarchy**: Thiết lập đúng cấu trúc z-index (`Canvas = 1`, `UI Wrapper = 10`, `Modal = 100`) và `pointer-events: none` trên wrapper.
- [ ] **Loading Overlay**: Thiết kế sẵn màn hình Skeleton / Dark Loading Screen với hiệu ứng chuyển tiếp mờ dần (Fade-out).
- [ ] **Cleanup Strategy**: Đảm bảo có kế hoạch giải phóng `app.dispose()` khi component unmount.

---

## 8. KẾT LUẬN & BƯỚC TIẾP THEO (NEXT STEPS)

Tài liệu này đã hoàn thành việc nghiên cứu và thiết lập nền tảng kiến trúc kỹ thuật vững chắc cho việc tích hợp Spline 3D vào Web Portfolio. Việc tuân thủ phân lớp giao diện, quản lý sự kiện chuột 2 chiều và tối ưu hóa tài nguyên đảm bảo hệ thống đạt độ mượt mà cao, code sạch và dễ bảo trì.

**Bước tiếp theo (Phase 1):**
Khởi tạo khung dự án mẫu (Project Scaffolding) theo chuẩn **Vite + React + TypeScript + Tailwind CSS**, cấu hình sẵn `SplineController` và hệ thống CSS Pass-through layering theo đúng tài liệu này.
