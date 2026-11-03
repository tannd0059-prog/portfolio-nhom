/* =====================================================================
   gallery.js — slideshow ảnh cá nhân (tự chạy, vuốt, bàn phím, toàn màn hình).
   Bạn KHÔNG cần sửa file này. Thêm ảnh trong content.js (mục gallery).
   ===================================================================== */
(function () {
  "use strict";

  const { P, $, $$, el, icon } = window.PF;
  const section = $("#gallery");
  const slides = P.gallery || [];

  if (!section || !slides.length) {
    if (section) section.hidden = true;
    window.PF.renderChrome();
    return;
  }

  const INTERVAL = P.galleryInterval || 5000;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  $(".section-title", section).textContent = P.sections.gallery;

  let current = 0;
  let timer = null;
  let playing = !reduceMotion;
  let hovering = false;

  /* ----- Dựng DOM ----- */
  function buildSlide(s, i) {
    const img = el("img", { cls: "slide-img", attrs: { src: s.src, alt: s.alt || s.title || "", loading: i === 0 ? "eager" : "lazy", draggable: "false" } });
    const bg = el("img", { cls: "slide-bg", attrs: { src: s.src, alt: "", "aria-hidden": "true", loading: "lazy" } });
    const fig = el("figure", {
      cls: "slide", attrs: { role: "group", "aria-roledescription": "slide", "aria-label": (i + 1) + " trên " + slides.length }
    }, [
      bg, img,
      el("figcaption", {}, [el("strong", { text: s.title || "" }), el("span", { text: s.caption || "" })])
    ]);
    img.addEventListener("error", () => {
      fig.classList.add("is-missing");
      img.replaceWith(el("div", { cls: "slide-missing" }, [icon("fa-camera"), el("p", { text: "Không tìm thấy ảnh: " + s.src })]));
    });
    return fig;
  }

  const slideEls = slides.map(buildSlide);
  const btn = (cls, label, ic, onClick) =>
    el("button", { cls: "car-btn " + cls, attrs: { type: "button", "aria-label": label }, on: { click: onClick } }, [icon(ic)]);

  const counter = el("span", { cls: "car-counter", attrs: { "aria-hidden": "true" } });
  const progress = el("span", { cls: "car-progress" }, [el("i")]);
  const playBtn = btn("car-play", "Tạm dừng tự chuyển ảnh", "fa-pause", () => { playing = !playing; sync(); });
  const fsBtn = btn("car-fs", "Xem toàn màn hình", "fa-expand", toggleFullscreen);

  const carousel = el("div", {
    cls: "carousel", attrs: { role: "region", "aria-roledescription": "carousel", "aria-label": "Ảnh cá nhân", tabindex: "0" }
  }, [
    el("div", { cls: "slides", attrs: { "aria-live": "off" } }, slideEls),
    btn("car-prev", "Ảnh trước", "fa-chevron-left", () => go(current - 1, true)),
    btn("car-next", "Ảnh sau", "fa-chevron-right", () => go(current + 1, true)),
    el("div", { cls: "car-tools" }, [counter, playBtn, fsBtn]),
    progress
  ]);

  const thumbs = el("div", { cls: "thumbs", attrs: { role: "tablist", "aria-label": "Chọn ảnh" } }, slides.map((s, i) =>
    el("button", { cls: "thumb", attrs: { type: "button", role: "tab", "aria-label": "Xem ảnh " + (i + 1) + ": " + (s.title || "") }, on: { click: () => go(i, true) } },
      [el("img", { attrs: { src: s.src, alt: "", loading: "lazy" } })])
  ));

  $(".section-body", section).replaceChildren(carousel, slides.length > 1 ? thumbs : null);
  if (slides.length < 2) { $$(".car-prev, .car-next, .car-play", carousel).forEach((n) => n.remove()); }

  /* ----- Điều khiển ----- */
  function go(index, user) {
    current = (index + slides.length) % slides.length;
    slideEls.forEach((s, i) => s.classList.toggle("active", i === current));
    $$(".thumb", thumbs).forEach((t, i) => { t.classList.toggle("active", i === current); t.setAttribute("aria-selected", String(i === current)); });
    counter.textContent = String(current + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
    restart();
    if (user && !reduceMotion) carousel.classList.add("nudge");
  }

  function restart() {
    clearTimeout(timer);
    const bar = $("i", progress);
    bar.style.animation = "none";
    void bar.offsetWidth;                               // khởi động lại hiệu ứng thanh tiến trình
    if (playing && !hovering && slides.length > 1 && !document.hidden) {
      bar.style.animation = "carProgress " + INTERVAL + "ms linear forwards";
      timer = setTimeout(() => go(current + 1), INTERVAL);
    }
  }

  function sync() {
    const icn = $("i", playBtn);
    icn.className = "fa " + (playing ? "fa-pause" : "fa-play");
    playBtn.setAttribute("aria-label", playing ? "Tạm dừng tự chuyển ảnh" : "Tự chuyển ảnh");
    carousel.classList.toggle("paused", !playing);
    restart();
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (carousel.requestFullscreen) carousel.requestFullscreen();
  }
  document.addEventListener("fullscreenchange", () => {
    const on = document.fullscreenElement === carousel;
    $("i", fsBtn).className = "fa " + (on ? "fa-compress" : "fa-expand");
    fsBtn.setAttribute("aria-label", on ? "Thoát toàn màn hình" : "Xem toàn màn hình");
  });

  /* Tạm dừng khi rê chuột/đang focus; dừng khi tab bị ẩn */
  carousel.addEventListener("pointerenter", () => { hovering = true; restart(); });
  carousel.addEventListener("pointerleave", () => { hovering = false; restart(); });
  document.addEventListener("visibilitychange", restart);

  carousel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(current - 1, true); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(current + 1, true); }
  });

  /* Vuốt trái/phải trên điện thoại */
  let startX = null;
  carousel.addEventListener("pointerdown", (e) => { startX = e.clientX; });
  carousel.addEventListener("pointerup", (e) => {
    if (startX == null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50 && !e.target.closest(".car-btn")) go(current + (dx < 0 ? 1 : -1), true);
  });
  carousel.addEventListener("pointercancel", () => { startX = null; });

  sync();
  go(0);
  window.PF.renderChrome();
})();
