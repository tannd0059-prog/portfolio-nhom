/* =====================================================================
   effects.js — hiệu ứng: mạng hạt ở banner, gõ chữ, đếm số, hiện dần khi cuộn,
   nghiêng thẻ 3D, đốm sáng theo chuột.
   Bạn KHÔNG cần sửa file này.
   ===================================================================== */
(function () {
  "use strict";

  const { $, $$ } = window.PF;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const root = document.documentElement;

  /* ---------- 1. Mạng hạt (particles) ở banner ---------- */
  function initParticles() {
    const canvas = $("#heroCanvas");
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext("2d");
    const hero = canvas.parentElement;
    const mouse = { x: -9999, y: -9999 };
    let w = 0, h = 0, dpr = 1, dots = [], raf = null, visible = true, rgb = "37, 99, 235";

    function readColor() {
      const hex = getComputedStyle(root).getPropertyValue("--accent").trim();
      const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
      if (m) rgb = parseInt(m[1], 16) + ", " + parseInt(m[2], 16) + ", " + parseInt(m[3], 16);
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(80, Math.round((w * h) / 16000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35, r: Math.random() * 1.6 + 0.8
      }));
      if (reduceMotion) draw(false);
    }

    function draw(move) {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (move) {
          d.x += d.vx; d.y += d.vy;
          if (d.x < 0 || d.x > w) d.vx *= -1;
          if (d.y < 0 || d.y > h) d.vy *= -1;
        }
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + rgb + ", .65)";
        ctx.fill();
        for (let j = i + 1; j < dots.length; j++) {
          const o = dots[j], dx = d.x - o.x, dy = d.y - o.y, dist = dx * dx + dy * dy;
          if (dist < 130 * 130) {
            ctx.strokeStyle = "rgba(" + rgb + "," + (0.22 * (1 - Math.sqrt(dist) / 130)).toFixed(3) + ")";
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(o.x, o.y); ctx.stroke();
          }
        }
        const mx = d.x - mouse.x, my = d.y - mouse.y, md = mx * mx + my * my;   // nối với con trỏ chuột
        if (md < 160 * 160) {
          ctx.strokeStyle = "rgba(" + rgb + "," + (0.5 * (1 - Math.sqrt(md) / 160)).toFixed(3) + ")";
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
    }

    function loop() {
      draw(true);
      raf = visible && !document.hidden ? requestAnimationFrame(loop) : null;
    }
    function start() { if (!raf && !reduceMotion) raf = requestAnimationFrame(loop); }

    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", start);
    new IntersectionObserver((e) => { visible = e[0].isIntersecting; if (visible) start(); }).observe(hero);
    new MutationObserver(() => { readColor(); if (reduceMotion) draw(false); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });

    readColor(); resize(); start();
  }

  /* ---------- 2. Gõ chữ / xoá chữ ---------- */
  function initTyped() {
    const node = $("#typed");
    if (!node || reduceMotion) return;
    let words;
    try { words = JSON.parse(node.dataset.words || "[]"); } catch (e) { words = []; }
    if (!words.length) return;

    let wi = 0, ci = 0, deleting = false;
    function tick() {
      const word = words[wi];
      ci += deleting ? -1 : 1;
      node.textContent = word.slice(0, ci);
      let delay = deleting ? 35 : 75;
      if (!deleting && ci === word.length) { deleting = true; delay = 1600; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 350; }
      setTimeout(tick, delay);
    }
    node.textContent = "";
    setTimeout(tick, 600);
  }

  /* ---------- 3. Đếm số ---------- */
  function animateCount(node) {
    const target = Number(node.dataset.count) || 0;
    if (reduceMotion || target === 0) { node.textContent = String(target); return; }
    const start = performance.now(), dur = 1200;
    (function step(now) {
      const t = Math.min(1, (now - start) / dur);
      node.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(step);
    })(start);
  }

  /* ---------- 4. Hiện dần khi cuộn ---------- */
  function initReveal() {
    $$(".stagger, .stagger-pop").forEach((group) => {
      Array.from(group.children).forEach((child, i) => child.style.setProperty("--i", String(i)));
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("visible");
        $$("[data-count]", en.target).forEach(animateCount);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach((n) => io.observe(n));

    $$("#heroStats [data-count]").forEach(animateCount);
  }

  /* ---------- 5. Thẻ nghiêng 3D + đốm sáng theo chuột ---------- */
  function initPointerEffects() {
    if (!canHover) return;
    document.addEventListener("pointermove", (e) => {
      const spot = e.target.closest && e.target.closest(".spot");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", e.clientX - r.left + "px");
        spot.style.setProperty("--my", e.clientY - r.top + "px");
      }
      const tilt = e.target.closest && e.target.closest(".tilt");
      if (tilt && !reduceMotion) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.transform = "perspective(800px) rotateX(" + (-py * 7).toFixed(2) + "deg) rotateY(" + (px * 9).toFixed(2) + "deg) translateY(-4px)";
      }
    }, { passive: true });
    document.addEventListener("pointerout", (e) => {
      const tilt = e.target.closest && e.target.closest(".tilt");
      if (tilt && !tilt.contains(e.relatedTarget)) tilt.style.transform = "";
    });

    /* Vầng sáng mờ đi theo con trỏ trên toàn trang */
    if (!reduceMotion) {
      const glow = document.createElement("div");
      glow.className = "cursor-glow";
      glow.setAttribute("aria-hidden", "true");
      document.body.appendChild(glow);
      let gx = 0, gy = 0, tx = 0, ty = 0;
      document.addEventListener("pointermove", (e) => { tx = e.clientX; ty = e.clientY; glow.classList.add("on"); }, { passive: true });
      document.documentElement.addEventListener("pointerleave", () => glow.classList.remove("on"));
      (function follow() {
        gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
        glow.style.transform = "translate3d(" + (gx - 200) + "px," + (gy - 200) + "px,0)";
        requestAnimationFrame(follow);
      })();
    }
  }

  /* ---------- 6. Ảnh đại diện + thẻ nổi xê dịch nhẹ theo chuột ---------- */
  function initAvatarParallax() {
    const wrap = $("#avatarWrap");
    if (!wrap || !canHover || reduceMotion) return;
    const hero = $("#top");
    hero.addEventListener("pointermove", (e) => {
      const r = hero.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      $$(".chip", wrap).forEach((c) => {
        const d = Number(c.style.getPropertyValue("--depth")) || 10;
        c.style.translate = (px * d * 2).toFixed(1) + "px " + (py * d * 2).toFixed(1) + "px";
      });
    });
  }

  initParticles();
  initTyped();
  initReveal();
  initPointerEffects();
  initAvatarParallax();
})();
