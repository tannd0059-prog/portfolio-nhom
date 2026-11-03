/**
 * MAIN.JS - PORTFOLIO ĐINH THANH THIÊN (UTH)
 * JavaScript thuần túy - Chạy mượt mà trực tiếp trên mọi trình duyệt
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dark / Light Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  // Khôi phục giao diện từ localStorage
  const savedTheme = localStorage.getItem('thien_theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('thien_theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
  }

  // 2. Video Gương Mặt Chân Dung - Xử lý fallback mượt mà
  const faceVideo = document.querySelector('.face-video');
  const faceFallback = document.querySelector('.face-fallback');

  if (faceVideo && faceFallback) {
    // Nếu video gặp sự cố tải, tự động chuyển sang hiển thị ảnh chân dung
    faceVideo.addEventListener('error', () => {
      faceVideo.style.display = 'none';
      faceFallback.style.display = 'block';
    });

    // Thử autoplay có tiếng tắt (muted)
    faceVideo.play().catch(() => {
      // Nếu trình duyệt chặn autoplay, hiển thị fallback
      console.log('Video autoplay restrained, falling back gracefully.');
    });
  }

  // 3. Highlight navigation link khi cuộn trang
  const sections = document.querySelectorAll('section, header');
  const navItems = document.querySelectorAll('.nav-item');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    navItems.forEach(item => {
      item.classList.remove('active');
      if (item.getAttribute('href') === `#${current}`) {
        item.classList.add('active');
      }
    });
  });

  // 4. Contact Form Validation
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');

  if (contactForm && formAlert) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        showAlert('Vui lòng điền đầy đủ các thông tin bắt buộc!', false);
        return;
      }

      // Giả lập gửi thành công
      showAlert(`Cảm ơn ${name}! Tin nhắn của bạn đã được gửi thành công đến Đinh Thanh Thiên.`, true);
      contactForm.reset();
    });
  }

  function showAlert(msg, isSuccess) {
    formAlert.textContent = msg;
    formAlert.className = `form-alert ${isSuccess ? 'success' : 'error'}`;
    formAlert.style.display = 'block';
    setTimeout(() => {
      formAlert.style.display = 'none';
    }, 6000);
  }
});
