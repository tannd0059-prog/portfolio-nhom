/* =====================================================================
   FILE NỘI DUNG PORTFOLIO — CHỈ CẦN SỬA FILE NÀY
   ---------------------------------------------------------------------
   - Thay nội dung trong dấu nháy "..." bằng thông tin của bạn.
   - Giữ nguyên dấu nháy, dấu phẩy ở cuối mỗi dòng và các dấu { } [ ].
   - Muốn thêm một mục: copy nguyên một khối { ... }, dán thêm rồi sửa.
   - Muốn ẩn cả một phần: để danh sách rỗng, ví dụ  gallery: [],
   - Các dòng có chữ  ✏️ SỬA  là chỗ mình đã viết tạm — hãy sửa cho đúng với bạn.
   - Lưu file rồi tải lại trang (F5) để xem thay đổi.
   ===================================================================== */

const PORTFOLIO = {

  /* ---------- THÔNG TIN CHUNG ---------- */
  siteTitle: "Portfolio | Nguyễn Đăng Khôi",
  name: "Nguyễn Đăng Khôi",
  role: "Sinh viên Công nghệ thông tin",
  // Các dòng chữ tự gõ/xoá ở đầu trang
  roles: [
    "sinh viên Computer Science",
    "người thích biến ý tưởng thành code",
    "dân bóng rổ & mê phượt"
  ],
  tagline: "Biến ý tưởng thành hiện thực với code.",
  avatar: "assets/images/avatar.jpg",
  cv: { label: "Tải CV", url: "" },            // để url trống nếu chưa có CV (nút sẽ ẩn)
  hub: { label: "Về Hub", url: "../index.html" },   // nút quay về trang Hub của nhóm
  heroChips: ["</>", "C++", "Django", "JS"],        // các thẻ nổi quanh ảnh đại diện

  /* ---------- MENU ĐIỀU HƯỚNG: thứ tự & tên ngắn hiển thị trên thanh menu ---------- */
  nav: ["about", "goal", "specialization", "education", "skills", "projects", "awards", "gallery", "interests", "contact"],
  navLabels: {
    about: "Về tôi", goal: "Mục tiêu", specialization: "Chuyên ngành", education: "Học vấn",
    skills: "Kỹ năng", projects: "Dự án", awards: "Thành tích", gallery: "Khoảnh khắc",
    interests: "Sở thích", contact: "Liên hệ"
  },

  /* ---------- TIÊU ĐỀ ĐẦY ĐỦ CỦA TỪNG PHẦN ---------- */
  sections: {
    about: "Về tôi",
    goal: "Mục tiêu nghề nghiệp",
    specialization: "Chuyên ngành của mình",
    education: "Học vấn & Hoạt động",
    skills: "Kỹ năng",
    projects: "Dự án",
    awards: "Thành tích & Chứng chỉ",
    gallery: "Khoảnh khắc",
    interests: "Sở thích & Ẩm thực",
    contact: "Liên hệ"
  },

  /* ---------- VỀ TÔI ---------- */
  about: {
    bio: [
      "Xin chào! Mình là Nguyễn Đăng Khôi, hiện đang học năm 3 ngành Công nghệ thông tin.",
      "Mình đam mê lập trình và thích tham gia các dự án thực tế để nâng cao kỹ năng.",
      "Mục tiêu của mình là trở thành một lập trình viên toàn diện, có thể làm việc với nhiều công nghệ khác nhau."
    ],
    // icon lấy từ Font Awesome 4.7: https://fontawesome.com/v4/icons/
    facts: [
      { icon: "fa-birthday-cake", label: "Ngày sinh", value: "23/10/2006" },
      { icon: "fa-map-marker",    label: "Nơi ở",     value: "TP. Hồ Chí Minh" },
      { icon: "fa-language",      label: "Ngôn ngữ",  value: "Tiếng Việt, Tiếng Anh" },
      { icon: "fa-heart",         label: "Châm ngôn", value: "Simplicity is the soul of efficiency." }
    ],
    // Khung "code" trang trí bên cạnh phần giới thiệu (chuỗi, mảng hoặc true/false)
    code: {
      file: "khoi.js",
      variable: "khoi",
      fields: [
        { key: "name",     value: "Nguyễn Đăng Khôi" },
        { key: "school",   value: "ĐH GTVT TP.HCM" },
        { key: "major",    value: "Computer Science" },
        { key: "skills",   value: ["HTML/CSS", "JavaScript", "Python", "C/C++"] },
        { key: "hobbies",  value: ["bóng rổ", "gaming", "phượt"] },
        { key: "motto",    value: "Simplicity is the soul of efficiency." },
        { key: "openToLearn", value: true }
      ],
      comment: "// luôn sẵn sàng học hỏi & làm dự án mới"
    }
  },

  /* ---------- MỤC TIÊU NGHỀ NGHIỆP (✏️ SỬA cho đúng định hướng của bạn) ---------- */
  goal: {
    statement: "Trở thành một lập trình viên toàn diện — vững nền tảng Computer Science, làm được từ web, backend đến hệ thống — và tạo ra những sản phẩm thật sự hữu ích cho người dùng.",
    steps: [
      {
        term: "Ngắn hạn", time: "1 – 2 năm", icon: "fa-book", title: "Củng cố nền tảng",
        points: [
          "Vững cấu trúc dữ liệu & giải thuật, hệ điều hành, mạng máy tính, cơ sở dữ liệu",
          "Hoàn thiện thêm các dự án cá nhân và dự án nhóm",
          "Tận dụng lợi thế tiếng Anh để đọc tài liệu kỹ thuật"
        ]
      },
      {
        term: "Trung hạn", time: "3 – 4 năm", icon: "fa-briefcase", title: "Thực tập & chuyên sâu",
        points: [
          "Thực tập tại doanh nghiệp phần mềm, làm quen quy trình làm việc nhóm",
          "Chọn một hướng chuyên sâu (web full-stack hoặc backend)",
          "Xây dựng portfolio và đóng góp mã nguồn trên GitHub"
        ]
      },
      {
        term: "Dài hạn", time: "5 năm trở đi", icon: "fa-rocket", title: "Lập trình viên toàn diện",
        points: [
          "Làm chủ nhiều công nghệ, thích ứng nhanh với công cụ mới",
          "Tham gia xây dựng sản phẩm có tác động thực tế",
          "Chia sẻ kiến thức và hỗ trợ các bạn đi sau"
        ]
      }
    ],
    values: ["Học hỏi liên tục", "Làm việc nhóm", "Code sạch & dễ đọc", "Tư duy giải quyết vấn đề"]
  },

  /* ---------- CHUYÊN NGÀNH (✏️ SỬA/BỔ SUNG theo những gì bạn đã học) ---------- */
  specialization: {
    intro: "Mình theo học ngành Công nghệ thông tin, hướng Computer Science (Khoa học máy tính) tại ĐH Giao thông vận tải TP.HCM. Đây là ngành nghiên cứu cách thiết kế thuật toán, tổ chức dữ liệu và xây dựng hệ thống phần mềm để giải quyết bài toán thực tế. Dưới đây là những mảng mình đã và đang tiếp cận:",
    tracks: [
      {
        id: "web", icon: "fa-globe", title: "Lập trình Web",
        summary: "Xây dựng giao diện và ứng dụng web: từ cấu trúc HTML, trình bày bằng CSS đến tương tác bằng JavaScript, luôn chú trọng trải nghiệm người dùng và khả năng hiển thị tốt trên mọi thiết bị.",
        done: ["Làm web app Quản lý điểm sinh viên", "Dựng portfolio responsive bằng HTML, CSS, JavaScript"],
        learn: ["Responsive design & UX/UI", "Framework giao diện hiện đại", "Hiệu năng & bảo mật web cơ bản"],
        tech: ["HTML", "CSS", "JavaScript", "Django"],
        project: "Quản lý điểm sinh viên(webapp)"
      },
      {
        id: "backend", icon: "fa-database", title: "Backend & Cơ sở dữ liệu",
        summary: "Xử lý logic phía máy chủ và thiết kế cơ sở dữ liệu: tổ chức bảng, truy vấn, và xây dựng các chức năng lưu trữ, tra cứu dữ liệu cho ứng dụng.",
        done: ["Dùng Django + SQLite để lưu và quản lý dữ liệu điểm", "Thực hành mô hình MVC/MTV"],
        learn: ["Thiết kế CSDL quan hệ & SQL nâng cao", "Xây dựng RESTAPI/FastAPI", "Xác thực & phân quyền người dùng"],
        tech: ["Python", "Django", "SQLite", "SQL"],
        project: "Quản lý điểm sinh viên(webapp)"
      },
      {
        id: "network", icon: "fa-sitemap", title: "Mạng & Lập trình hệ thống",
        summary: "Hiểu cách các máy tính giao tiếp với nhau qua mạng: giao thức, socket, kết nối thời gian thực — và dùng C/C++ để điều khiển hệ thống ở mức thấp.",
        done: ["Xây dựng app chat Chatties với WebSocket và TCP/IP", "Hiển thị thống kê số lượng tin nhắn", "Điều hành hệ thống real-time"],
        learn: ["Lập trình socket nâng cao", "Hệ điều hành & đa luồng", "Bảo mật mạng cơ bản"],
        tech: ["C/C++", "TCP/IP", "WebSocket"],
        project: "Ứng dụng Chat - Textbox"
      },
      {
        id: "engineering", icon: "fa-code-fork", title: "Kỹ thuật phần mềm",
        summary: "Làm phần mềm không chỉ là viết code: còn là làm việc nhóm, quản lý phiên bản, viết code sạch và duy trì chất lượng của sản phẩm theo thời gian.",
        done: ["Dùng Git/GitHub để quản lý mã nguồn và cộng tác", "Tham gia các dự án nhóm ở trường"],
        learn: ["Kiểm thử phần mềm", "Quy trình Agile/Scrum", "CI/CD cơ bản"],
        tech: ["Git", "GitHub", "Clean Code"]
      }
    ]
  },

  /* ---------- HỌC VẤN (mới nhất để lên đầu) ---------- */
  education: [
    {
      period: "2024 – nay",
      school: "Đại học Giao thông vận tải TP.HCM",
      major: "Công nghệ thông tin - Computer Science",
      detail: "Tham gia các dự án nhóm và các cuộc thi lập trình ở trường"
    },
    {
      period: "2019 – 2022",
      school: "THPT Hoàng Hoa Thám - HCM",
      major: "Chuyên Anh Văn",
      detail: "Tham gia các kì thi HSG Tiếng Anh cấp quận và đạt nhiều giải"
    }
  ],

  /* ---------- HOẠT ĐỘNG & KINH NGHIỆM (✏️ SỬA/THÊM: CLB, tình nguyện, thực tập, làm thêm...) ---------- */
  experience: [
    {
      period: "2024 – nay",
      title: "Dự án nhóm & cuộc thi lập trình",
      org: "ĐH Giao thông vận tải TP.HCM",
      detail: "Tham gia các dự án nhóm và các cuộc thi lập trình do trường tổ chức."
    },
    {
      period: "Dự án nhóm",
      title: "Xây dựng web Quản lý điểm sinh viên",
      org: "Django · SQLite",
      detail: "Cùng nhóm phát triển hệ thống quản lý điểm với giao diện thân thiện."
    },
    {
      period: "Dự án cá nhân",
      title: "Phát triển ứng dụng chat Chatties",
      org: "C/C++ · WebSocket · TCP/IP",
      detail: "Tự xây dựng ứng dụng chat và biểu đồ thống kê số lượng tin nhắn."
    }
  ],

  /* ---------- KỸ NĂNG (level từ 0 đến 100) ---------- */
  skills: [
    {
      group: "Lập trình & Web", icon: "fa-code",
      items: [
        { name: "HTML / CSS", level: 90 },
        { name: "JavaScript", level: 80 },
        { name: "Python",     level: 70 },
        { name: "C / C++",    level: 65 }       // ✏️ SỬA mức cho đúng với bạn
      ]
    },
    {
      group: "Framework & Cơ sở dữ liệu", icon: "fa-database",
      items: [
        { name: "Django",          level: 65 },  // ✏️ SỬA
        { name: "SQL / SQLite",    level: 60 }   // ✏️ SỬA
      ]
    },
    {
      group: "Công cụ & Ngoại ngữ", icon: "fa-cogs",
      items: [
        { name: "Git / GitHub", level: 75 },
        { name: "Tiếng Anh",    level: 100 }
      ]
    }
  ],

  /* ---------- DỰ ÁN ---------- */
  projects: [
    {
      title: "Ứng dụng Chat - Textbox",
      category: "Mạng & Hệ thống",              // dùng cho bộ lọc dự án
      description: "App chat đơn giản sử dụng WebSocket và TCP/IP để hiển thị biểu đồ số lượng tin nhắn.",
      features: [
        "Gửi và nhận tin nhắn giữa các máy qua mạng",
        "Giao tiếp client – server trên nền TCP/IP và WebSocket",
        "Real-time chatting, emotes, notfication, và thống kê số lượng tin nhắn"
      ],
      image: "assets/images/projects/chatties.png",
      fit: "contain",                              // "contain" = giữ nguyên tỉ lệ ảnh, "cover" = phủ kín khung
      tags: ["C/C++", "WebSocket", "TCP/IP"],
      link: "https://github.com/Khoi2310/App_Chatties"
    },
    {
      title: "Quản lý điểm sinh viên(webapp)",
      category: "Web",
      description: "Hệ thống quản lý điểm sinh viên với giao diện người dùng thân thiện.",
      features: [
        "Quản lý dữ liệu điểm sinh viên trên nền web",
        "Giao diện thân thiện, dễ thao tác",
        "Lưu trữ dữ liệu bằng SQLite thông qua Django"
      ],
      image: "assets/images/projects/quanly-diem.png",
      fit: "contain",
      tags: ["HTML", "CSS", "Django", "SQLite"],
      link: "https://github.com/vitruong240106/QuanLyDiem"
    }
  ],

  /* ---------- GIẢI THƯỞNG ---------- */
  awards: [
    { year: "2024", title: "Giải Nhì Hackathon Sinh viên", org: "Đại học Giao thông vận tải TP.HCM", detail: "Xây dựng ứng dụng quản lý chi tiêu trong 48 giờ.(Cap)" },
    { year: "2023", title: "Học bổng khuyến khích học tập", org: "Đại học Giao thông vận tải TP.HCM", detail: "Đạt học bổng 2 học kỳ liên tiếp.(Cap)" },
    { year: "2021", title: "Giải Ba HSG Tiếng Anh cấp thành phố", org: "Sở GD&ĐT", detail: "(real)" }
  ],

  /* ---------- CHỨNG CHỈ (để [] nếu chưa có — trang sẽ hiện "Chưa có") ---------- */
  certificates: [
    // { year: "2025", title: "IELTS 7.5", org: "British Council", detail: "" }
  ],

  /* ---------- KHOẢNH KHẮC: SLIDESHOW ẢNH CÁ NHÂN ----------
     Thêm ảnh: bỏ file vào assets/images/gallery/ rồi thêm một dòng như bên dưới. */
  galleryInterval: 5000,          // thời gian tự chuyển ảnh (mili-giây)
  gallery: [
    { src: "assets/images/gallery/01-chan-dung.jpg", title: "Chân dung", caption: "Giữa đồi chè và mây núi trong một chuyến đi.", alt: "Khôi đứng giữa đồi chè, phía sau là núi và mây" },
    { src: "assets/images/gallery/02-can-canh.jpg",  title: "My pet",  caption: "Em mèo yêu dấu của mình", alt: "Ảnh em mèo" },
    { src: "assets/images/gallery/03-chan-troi.jpg", title: "Chân trời", caption: "Thích đi tới những vùng núi trên chiếc xe máy.", alt: "Dãy núi và biển mây phía chân trời" }
  ],

  /* ---------- SỞ THÍCH (icon có thể là emoji) ---------- */
  hobbies: [
    { icon: "🎧", title: "Nghe nhạc", description: "Các nghệ sĩ như Daniel Ceasar, Chris Brown vân vân và mây mây" },
    { icon: "🏀", title: "Bóng rổ",   description: "Lowkey retired baller" },
    { icon: "🎮", title: "Gaming",    description: "Valorant, CS2, GTA" },
    { icon: "✈️", title: "Phượt",     description: "Mình thích đi khám phá các vùng đất mới trên chiếc xe máy, đi tới các vùng núi.." }
  ],

  /* ---------- MÓN ĂN YÊU THÍCH ---------- */
  foods: [
    { icon: "🍜", title: "Phở bò",  description: "Tái nạm" },
    { icon: "🥖", title: "Bánh mì", description: "Món ăn sáng quốc dân, 2 trứng nhiều pate chả cá(hoặc chả lụa)" },
    { icon: "🍚", title: "Cơm tấm", description: "Sườn chả trứng all the way" },
    { icon: "🧋", title: "Trà sữa", description: "Ít đường, yêu phô mai viên." }
  ],

  /* ---------- MẠNG XÃ HỘI ---------- */
  social: [
    { icon: "fa-github",   label: "GitHub",   url: "https://github.com/Khoi2310" },
    { icon: "fa-linkedin", label: "LinkedIn", url: "https://linkedin.com/" },
    { icon: "fa-facebook", label: "Facebook", url: "https://www.facebook.com/baka2310" }
  ],

  /* ---------- LIÊN HỆ ---------- */
  contact: {
    heading: "My Contact Info",
    intro: "Bạn có ý tưởng, cơ hội hợp tác hay chỉ muốn trao đổi về lập trình? Hãy để lại lời nhắn cho mình nhé!",
    email: "dangkhoinguyen2310@gmail.com",
    phone: "0123 456 789",                       // ✏️ SỬA: số điện thoại thật (hoặc để "" để ẩn)
    location: "TP. Hồ Chí Minh, Việt Nam"
  }
};
