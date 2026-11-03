/* =====================================================================
   ui.js — tương tác giao diện: dark mode, menu mobile, scroll-spy,
   thanh tiến độ cuộn, nút lên đầu trang.
   Bạn KHÔNG cần sửa file này.
   ===================================================================== */
(function () {
  "use strict";

  const { $, $$ } = window.PF;
  const root = document.documentElement;

  /* ---------- Chế độ sáng / tối ---------- */
  const themeBtn = $("#themeToggle");
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    themeBtn.innerHTML = theme === "dark" ? '<i class="fa fa-sun-o" aria-hidden="true"></i>' : '<i class="fa fa-moon-o" aria-hidden="true"></i>';
    themeBtn.setAttribute("aria-label", theme === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối");
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#060d1f" : "#2563eb");
    try { localStorage.setItem("theme", theme); } catch (e) { /* bỏ qua nếu bị chặn lưu trữ */ }
  }
  setTheme(root.getAttribute("data-theme") || "light");
  themeBtn.addEventListener("click", () => setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark"));

  /* ---------- Menu mobile ---------- */
  const navLinks = $("#navLinks");
  const menuBtn = $("#menuToggle");
  function setMenu(open) {
    navLinks.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.firstElementChild.className = "fa " + (open ? "fa-times" : "fa-bars");
  }
  menuBtn.addEventListener("click", () => setMenu(!navLinks.classList.contains("open")));
  navLinks.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  document.addEventListener("click", (e) => { if (!e.target.closest("#navbar")) setMenu(false); });

  /* ---------- Thanh điều hướng, tiến độ cuộn, nút lên đầu ---------- */
  const navbar = $("#navbar");
  const bar = $("#scrollProgress");
  const toTop = $("#toTop");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    navbar.classList.toggle("scrolled", y > 10);
    toTop.classList.toggle("show", y > 600);
    bar.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
    ticking = false;
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- Scroll-spy: tô sáng mục menu của phần đang xem ---------- */
  const links = $$("a", navLinks);
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  $$("main > .section").forEach((s) => { if (!s.hidden) spy.observe(s); });
})();
