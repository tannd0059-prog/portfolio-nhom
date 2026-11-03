/**
 * PORTFOLIO NGUYỄN DUY TÂN - JAVASCRIPT LOGIC
 * Khoa Công nghệ Thông tin - Trường ĐH Giao thông Vận tải TP.HCM (UTH)
 * Clean Architecture & Event-driven Programming
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initGreeting();
    initScrollProgress();
    initMobileMenu();
    initTypewriter();
    initScrollEvents();
    renderProjects('all');
    initContactForm();
});

/* ==========================================================================
   1. THEME SWITCHER (DARK / LIGHT MODE WITH LOCALSTORAGE)
   ========================================================================== */
function initTheme() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    function updateThemeUI(isDark) {
        if (!themeIcon) return;
        if (isDark) {
            themeIcon.className = 'fas fa-sun text-warm-400 text-lg transition-transform hover:rotate-45';
            themeToggleBtn.setAttribute('title', 'Chuyển sang chế độ Sáng');
        } else {
            themeIcon.className = 'fas fa-moon text-espresso-700 text-lg transition-transform hover:-rotate-12';
            themeToggleBtn.setAttribute('title', 'Chuyển sang chế độ Tối');
        }
    }

    // Kiểm tra cài đặt lưu trữ hoặc thiết lập mặc định của hệ thống
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.classList.add('dark');
        updateThemeUI(true);
    } else {
        document.documentElement.classList.remove('dark');
        updateThemeUI(false);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateThemeUI(isDark);
            showToast(isDark ? '🌙 Đã chuyển sang giao diện Tối sang trọng' : '☀️ Đã chuyển sang giao diện Sáng ấm áp', 'info');
        });
    }
}

/* ==========================================================================
   2. DYNAMIC REAL-TIME GREETING (LỜI CHÀO THỜI GIAN THỰC)
   ========================================================================== */
function initGreeting() {
    const greetingEl = document.getElementById('dynamic-greeting');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    let greetingText = '';
    let iconClass = '';

    if (hour >= 5 && hour < 12) {
        greetingText = 'Chào buổi sáng! Chúc bạn ngày mới tràn đầy năng lượng & sáng tạo.';
        iconClass = 'fa-sun text-amber-500';
    } else if (hour >= 12 && hour < 18) {
        greetingText = 'Chào buổi chiều! Cảm ơn bạn đã ghé thăm hồ sơ năng lực của Tân.';
        iconClass = 'fa-cloud-sun text-warm-500';
    } else {
        greetingText = 'Chào buổi tối! Chúc bạn có thời gian trải nghiệm website thật hữu ích.';
        iconClass = 'fa-moon text-indigo-400';
    }

    greetingEl.innerHTML = `<i class="fas ${iconClass} mr-2"></i><span>${greetingText}</span>`;
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR & ACTIVE NAV SCROLLSPY & COUNTERS
   ========================================================================== */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');
    const navLinks = document.querySelectorAll('.desktop-nav-link');
    const sections = document.querySelectorAll('section[id]');
    let animatedCounters = false;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

        // Cập nhật thanh tiến trình cuộn trang
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }

        // Ẩn / hiện nút Back to Top
        if (backToTopBtn) {
            if (scrollTop > 380) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
                backToTopBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
                backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            }
        }

        // ScrollSpy: Đánh dấu menu section đang xem
        let currentSectionId = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop - 120;
            const sectionHeight = sec.offsetHeight;
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });

        // Trigger Stats Counter khi cuộn đến mục About
        const aboutSection = document.getElementById('about');
        if (aboutSection && !animatedCounters) {
            const rect = aboutSection.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.85) {
                animatedCounters = true;
                animateNumberCounters();
            }
        }
    });
}

function animateNumberCounters() {
    document.querySelectorAll('.counter').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let current = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.innerText = target;
                clearInterval(timer);
            } else {
                counter.innerText = current;
            }
        }, 35);
    });
}

/* ==========================================================================
   4. MOBILE DRAWER MENU
   ========================================================================== */
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });

    // Tự đóng menu khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            mobileMenu.classList.add('hidden');
        }
    });
}

/* ==========================================================================
   5. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
    const typewriterEl = document.getElementById('typewriter');
    if (!typewriterEl) return;

    const phrases = [
        "Frontend Web Developer",
        "Data Visualization Specialist",
        "Sinh viên CNTT — ĐH Giao thông Vận tải TP.HCM (UTH)",
        "React, TypeScript & Tailwind CSS Engineer",
        "Chuyên viên Dashboard & Trực quan dữ liệu"
    ];

    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        const currentText = phrases[phraseIdx];

        if (isDeleting) {
            typewriterEl.textContent = currentText.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typewriterEl.textContent = currentText.substring(0, charIdx + 1);
            charIdx++;
        }

        let speed = isDeleting ? 35 : 75;

        if (!isDeleting && charIdx === currentText.length) {
            speed = 2200; // Tạm dừng khi gõ xong
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            speed = 450;
        }

        setTimeout(type, speed);
    }

    type();
}

function initScrollEvents() {
    // Dự phòng các sự kiện cuộn bổ trợ
}

/* ==========================================================================
   6. PROJECTS DATA & MODAL INTERACTION
   ========================================================================== */
const projectsData = [
    {
        id: 1,
        title: 'Hệ thống Quản lý Sách & Thư Viện Trực Quan',
        subtitle: 'Smart Library Management & Analytics',
        category: 'hybrid',
        typeLabel: 'Hybrid Web & Data',
        desc: 'Hệ thống quản lý thư viện số hóa thông minh, tích hợp bảng điều khiển phân tích số liệu mượn/trả thời gian thực với biểu đồ Chart.js sinh động và cơ sở dữ liệu quan hệ SQL.',
        image: 'images/project-library.svg',
        tags: ['React.js', 'Chart.js', 'Tailwind CSS', 'SQL (MySQL)', 'RESTful API', 'Node.js'],
        demoLink: 'https://smart-library-uth.demo.app',
        githubLink: 'https://github.com/nguyenduytan/smart-library-dashboard',
        details: {
            goal: 'Tự động hóa hoàn toàn quy trình số hóa mượn - trả sách, kiểm soát tồn kho theo thời gian thực và tự động gửi cảnh báo sách quá hạn đến sinh viên UTH.',
            arch: 'Kiến trúc Single Page Application (SPA) React kết nối cơ sở dữ liệu MySQL qua RESTful API tiêu chuẩn; tích hợp bộ đệm tối ưu hóa truy vấn dữ liệu lớn.',
            feTech: 'Giao diện đặt lịch mượn sách tương tác cao, thiết kế Responsive 100%, tích hợp bộ lọc tìm kiếm theo tác giả/mã ISBN và biểu đồ đường biểu diễn lưu lượng theo tuần.',
            result: 'Giảm 65% thời gian thủ công kiểm kê, loại bỏ 100% tình trạng mất mát sách và nâng cao 80% trải nghiệm tra cứu tài liệu của sinh viên.'
        }
    },
    {
        id: 2,
        title: 'Nhận diện Biển Số Xe Tự Động Bằng AI & Python',
        subtitle: 'Computer Vision & Real-time Parking Management',
        category: 'data',
        typeLabel: 'Data Analytics & AI',
        desc: 'Giải pháp phát hiện, phân tích và trích xuất ký tự biển số xe tự động từ luồng video camera giám sát bãi đỗ xe thông minh theo thời gian thực với độ chính xác trên 98%.',
        image: 'images/project-ocr.svg',
        tags: ['Python', 'OpenCV', 'YOLOv8', 'Tesseract OCR', 'Chart.js', 'Flask API'],
        demoLink: 'https://ai-parking-vision.demo.app',
        githubLink: 'https://github.com/nguyenduytan/ai-license-plate-recognition',
        details: {
            goal: 'Giải quyết bài toán ùn tắc tại bãi đỗ xe giờ cao điểm, loại bỏ vé xe giấy truyền thống bằng giải pháp nhận diện thị giác máy tính tự động.',
            arch: 'Pipeline xử lý thị giác máy tính nhiều giai đoạn: Tiền xử lý ảnh (Grayscale, Gaussian Blur), phát hiện vùng biển số bằng YOLO/Contours, trích xuất ký tự bằng OCR và lưu lịch sử xe ra vào vào Database.',
            feTech: 'Giao diện Web giám sát camera trực tiếp 60 FPS, biểu đồ cột thống kê mật độ phương tiện theo từng khung giờ và dashboard phân tích doanh thu.',
            result: 'Đạt độ chính xác 98.4% với thời gian nhận diện siêu nhanh chỉ 18ms mỗi khung hình, tự động điều khiển thanh chắn barrier chỉ trong 0.5 giây.'
        }
    },
    {
        id: 3,
        title: 'Dashboard Phân Tích Dữ Liệu Kinh Doanh Bán Lẻ',
        subtitle: 'Retail Business Intelligence & Executive Analytics',
        category: 'frontend',
        typeLabel: 'Frontend UI/UX',
        desc: 'Bảng điều khiển KPI điều hành kinh doanh đa kênh tương tác cao, theo dõi tăng trưởng doanh thu, phễu chuyển đổi khách hàng và dự báo xu hướng bán hàng trực quan.',
        image: 'images/project-dashboard.svg',
        tags: ['React.js', 'TypeScript', 'Tailwind CSS', 'D3.js', 'ApexCharts', 'Figma'],
        demoLink: 'https://retail-analytics-pro.demo.app',
        githubLink: 'https://github.com/nguyenduytan/retail-bi-dashboard',
        details: {
            goal: 'Cung cấp góc nhìn toàn diện 360 độ cho ban giám đốc về sức khỏe tài chính, phân khúc khách hàng và tồn kho trên toàn bộ chuỗi bán lẻ.',
            arch: 'Xây dựng với React & TypeScript đảm bảo Type Safety tối đa, kiến trúc Component phân lớp kết hợp kỹ thuật Lazy Loading và Memoization nhằm mượt mà 60fps khi render hàng nghìn điểm dữ liệu.',
            feTech: 'Hệ thống biểu đồ tương tác đa chiều (zoom, pan, filter ngày tháng), chuyển đổi chủ đề Sáng/Tối mượt mà, hỗ trợ xuất báo cáo định dạng PDF và Excel chỉ với một click.',
            result: 'Tăng 40% hiệu suất ra quyết định của các cấp quản lý và giảm thiểu 50% thời gian tổng hợp số liệu báo cáo định kỳ.'
        }
    }
];

function renderProjects(filter = 'all') {
    const container = document.getElementById('projects-grid');
    if (!container) return;

    container.innerHTML = '';
    const filtered = filter === 'all' ? projectsData : projectsData.filter(p => p.category === filter);

    filtered.forEach(p => {
        const card = document.createElement('article');
        card.className = 'glass-card rounded-2xl border border-cream-border dark:border-cream-darkBorder overflow-hidden flex flex-col justify-between card-hover-effect group';

        card.innerHTML = `
            <div>
                <!-- Hình ảnh Mockup Dự án -->
                <div class="relative w-full h-48 overflow-hidden bg-espresso-950/60 border-b border-cream-border dark:border-cream-darkBorder">
                    <img src="${p.image}" alt="${p.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    <div class="absolute top-3 left-3">
                        <span class="text-[11px] font-mono px-3 py-1 rounded-full bg-espresso-900/90 text-warm-400 border border-warm-500/40 backdrop-blur-md font-semibold">
                            ${p.typeLabel}
                        </span>
                    </div>
                </div>

                <!-- Nội dung tóm tắt -->
                <div class="p-6">
                    <h4 class="text-lg font-bold text-espresso-800 dark:text-white mb-1.5 group-hover:text-warm-500 transition-colors">
                        ${p.title}
                    </h4>
                    <p class="text-xs text-warm-600 dark:text-warm-400 font-mono font-medium mb-3">
                        ${p.subtitle}
                    </p>
                    <p class="text-xs text-espresso-600 dark:text-espresso-300 leading-relaxed mb-4">
                        ${p.desc}
                    </p>

                    <!-- Tags Công nghệ -->
                    <div class="flex flex-wrap gap-1.5 mb-2">
                        ${p.tags.map(t => `<span class="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-warm-50 dark:bg-espresso-950 text-espresso-700 dark:text-espresso-200 border border-warm-200/70 dark:border-espresso-800 font-medium">${t}</span>`).join('')}
                    </div>
                </div>
            </div>

            <!-- Nút Hành Động & Liên Kết -->
            <div class="p-6 pt-0 border-t border-cream-border/60 dark:border-cream-darkBorder/60 mt-4">
                <div class="flex items-center gap-2 pt-4">
                    <button onclick="openProjectModal(${p.id})" class="flex-1 py-2.5 rounded-xl bg-warm-500 hover:bg-warm-600 text-white font-semibold text-xs shadow-md shadow-warm-500/20 hover:shadow-warm-500/35 transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                        <i class="fas fa-eye text-xs"></i> Chi tiết
                    </button>
                    <a href="${p.demoLink}" target="_blank" rel="noopener noreferrer" class="px-3 py-2.5 rounded-xl bg-warm-100 dark:bg-espresso-800 text-espresso-700 dark:text-espresso-200 hover:text-warm-600 hover:bg-warm-200 dark:hover:bg-espresso-700 text-xs font-semibold transition-colors flex items-center gap-1.5" title="Xem Demo Trực Tiếp">
                        <i class="fas fa-arrow-up-right-from-square text-xs"></i> Demo
                    </a>
                    <a href="${p.githubLink}" target="_blank" rel="noopener noreferrer" class="px-3 py-2.5 rounded-xl bg-warm-100 dark:bg-espresso-800 text-espresso-700 dark:text-espresso-200 hover:text-warm-600 hover:bg-warm-200 dark:hover:bg-espresso-700 text-xs font-semibold transition-colors flex items-center gap-1.5" title="Mã nguồn GitHub">
                        <i class="fab fa-github text-sm"></i>
                    </a>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterProjects(category, btnElement) {
    document.querySelectorAll('.proj-tab').forEach(btn => {
        btn.className = 'proj-tab px-5 py-2.5 rounded-xl text-xs font-semibold bg-warm-100/70 dark:bg-espresso-900 text-espresso-700 dark:text-espresso-200 hover:bg-warm-200/80 dark:hover:bg-espresso-800 transition-all cursor-pointer';
    });
    if (btnElement) {
        btnElement.className = 'proj-tab px-5 py-2.5 rounded-xl text-xs font-semibold bg-warm-500 text-white shadow-md shadow-warm-500/25 transition-all cursor-pointer';
    }
    renderProjects(category);
}

function openProjectModal(id) {
    const project = projectsData.find(p => p.id === id);
    if (!project) return;

    const modal = document.getElementById('project-modal');
    const content = document.getElementById('modal-content');

    content.innerHTML = `
        <div class="relative w-full h-56 sm:h-64 rounded-xl overflow-hidden mb-5 border border-warm-300 dark:border-espresso-700 bg-espresso-950">
            <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover">
            <div class="absolute bottom-3 left-3">
                <span class="text-xs font-mono px-3 py-1 rounded-full bg-espresso-900/90 text-warm-400 border border-warm-500/40 backdrop-blur-md font-semibold">
                    ${project.typeLabel}
                </span>
            </div>
        </div>

        <h3 class="text-2xl font-bold text-espresso-800 dark:text-white">${project.title}</h3>
        <p class="text-xs text-warm-600 dark:text-warm-400 font-mono">${project.subtitle}</p>
        
        <p class="text-sm text-espresso-700 dark:text-espresso-200 leading-relaxed pt-2">${project.desc}</p>

        <div class="flex flex-wrap gap-1.5 py-3 border-y border-cream-border dark:border-cream-darkBorder my-3">
            ${project.tags.map(t => `<span class="text-xs font-mono px-3 py-1 rounded-lg bg-warm-100 dark:bg-espresso-800 text-espresso-800 dark:text-espresso-100 font-medium">${t}</span>`).join('')}
        </div>

        <div class="space-y-3.5 text-xs text-espresso-700 dark:text-espresso-300">
            <div class="p-3.5 rounded-xl bg-warm-50 dark:bg-espresso-950/60 border border-warm-200 dark:border-espresso-800">
                <strong class="text-warm-600 dark:text-warm-400 font-mono text-xs uppercase block mb-1">
                    🎯 Mục tiêu giải pháp:
                </strong>
                <p class="leading-relaxed">${project.details.goal}</p>
            </div>

            <div class="p-3.5 rounded-xl bg-warm-50 dark:bg-espresso-950/60 border border-warm-200 dark:border-espresso-800">
                <strong class="text-warm-600 dark:text-warm-400 font-mono text-xs uppercase block mb-1">
                    🏗️ Kiến trúc & Xử lý dữ liệu:
                </strong>
                <p class="leading-relaxed">${project.details.arch}</p>
            </div>

            <div class="p-3.5 rounded-xl bg-warm-50 dark:bg-espresso-950/60 border border-warm-200 dark:border-espresso-800">
                <strong class="text-warm-600 dark:text-warm-400 font-mono text-xs uppercase block mb-1">
                    ⚡ Kỹ thuật Frontend & Trực quan:
                </strong>
                <p class="leading-relaxed">${project.details.feTech}</p>
            </div>

            <div class="p-3.5 rounded-xl bg-warm-50 dark:bg-espresso-950/60 border border-warm-200 dark:border-espresso-800">
                <strong class="text-warm-600 dark:text-warm-400 font-mono text-xs uppercase block mb-1">
                    📈 Kết quả & Giá trị mang lại:
                </strong>
                <p class="leading-relaxed font-semibold text-espresso-900 dark:text-white">${project.details.result}</p>
            </div>
        </div>

        <div class="pt-5 flex flex-wrap items-center justify-between gap-3 border-t border-cream-border dark:border-cream-darkBorder mt-4">
            <div class="flex items-center gap-2">
                <a href="${project.demoLink}" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 rounded-xl bg-warm-500 hover:bg-warm-600 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5">
                    <i class="fas fa-play text-xs"></i> Trải Nghiệm Demo
                </a>
                <a href="${project.githubLink}" target="_blank" rel="noopener noreferrer" class="px-4 py-2.5 rounded-xl bg-espresso-800 dark:bg-espresso-700 hover:bg-espresso-900 text-white text-xs font-semibold shadow-md transition-all flex items-center gap-1.5">
                    <i class="fab fa-github text-sm"></i> Xem GitHub
                </a>
            </div>
            <button onclick="closeProjectModal()" class="px-5 py-2.5 rounded-xl bg-warm-100 dark:bg-espresso-800 text-espresso-700 dark:text-espresso-200 hover:bg-warm-200 text-xs font-semibold transition-all">
                Đóng
            </button>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Đóng modal khi bấm ra ngoài hoặc nhấn Esc
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProjectModal();
        closeCVModal();
    }
});

/* ==========================================================================
   7. CV MODAL & DOWNLOAD HANDLER
   ========================================================================== */
function openCVModal() {
    const modal = document.getElementById('cv-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCVModal() {
    const modal = document.getElementById('cv-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function downloadCV() {
    showToast('📄 Đang khởi tạo tải hồ sơ CV của Nguyễn Duy Tân (PDF)...', 'success');
    setTimeout(() => {
        closeCVModal();
        // In ấn trực tiếp hoặc tải tài liệu
        window.print();
    }, 800);
}

/* ==========================================================================
   8. CONTACT FORM JS VALIDATION & TOAST NOTIFICATION
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Real-time input validation
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const phoneInput = document.getElementById('form-phone');
    const msgInput = document.getElementById('form-msg');

    if (nameInput) nameInput.addEventListener('input', () => validateName(nameInput.value));
    if (emailInput) emailInput.addEventListener('input', () => validateEmail(emailInput.value));
    if (phoneInput) phoneInput.addEventListener('input', () => validatePhone(phoneInput.value));
    if (msgInput) msgInput.addEventListener('input', () => validateMsg(msgInput.value));
}

function validateName(value) {
    const err = document.getElementById('err-name');
    const isValid = value.trim().length >= 2;
    if (err) err.classList.toggle('hidden', isValid);
    return isValid;
}

function validateEmail(value) {
    const err = document.getElementById('err-email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(value.trim());
    if (err) err.classList.toggle('hidden', isValid);
    return isValid;
}

function validatePhone(value) {
    const err = document.getElementById('err-phone');
    // Định dạng số điện thoại Việt Nam (10 chữ số, đầu 03, 05, 07, 08, 09)
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    const isValid = phoneRegex.test(value.trim());
    if (err) err.classList.toggle('hidden', isValid);
    return isValid;
}

function validateMsg(value) {
    const err = document.getElementById('err-msg');
    const isValid = value.trim().length >= 10;
    if (err) err.classList.toggle('hidden', isValid);
    return isValid;
}

function handleContactSubmit(e) {
    e.preventDefault();

    const nameVal = document.getElementById('form-name')?.value || '';
    const emailVal = document.getElementById('form-email')?.value || '';
    const phoneVal = document.getElementById('form-phone')?.value || '';
    const msgVal = document.getElementById('form-msg')?.value || '';

    const isNameValid = validateName(nameVal);
    const isEmailValid = validateEmail(emailVal);
    const isPhoneValid = validatePhone(phoneVal);
    const isMsgValid = validateMsg(msgVal);

    if (isNameValid && isEmailValid && isPhoneValid && isMsgValid) {
        showToast('🎉 Gửi tin nhắn thành công! Cảm ơn bạn, Tân sẽ phản hồi trong vòng 24 giờ.', 'success');
        document.getElementById('contact-form').reset();
    } else {
        showToast('⚠️ Vui lòng kiểm tra lại các trường thông tin báo lỗi màu đỏ.', 'error');
    }
}

/* ==========================================================================
   9. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white text-xs font-semibold transition-all transform translate-y-3 opacity-0 z-50 ${
        type === 'success' ? 'bg-gradient-to-r from-warm-500 to-warm-600 border border-warm-400' :
        type === 'error' ? 'bg-gradient-to-r from-red-600 to-rose-700 border border-red-400' :
        'bg-gradient-to-r from-espresso-800 to-espresso-900 border border-espresso-700'
    }`;

    const icon = type === 'success' ? 'fa-circle-check text-emerald-200' :
                 type === 'error' ? 'fa-triangle-exclamation text-amber-200' :
                 'fa-circle-info text-blue-200';

    toast.innerHTML = `
        <i class="fas ${icon} text-base flex-shrink-0"></i>
        <span class="leading-snug">${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-3', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    }, 20);

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-3', 'opacity-0');
        setTimeout(() => toast.remove(), 350);
    }, 4500);
}
