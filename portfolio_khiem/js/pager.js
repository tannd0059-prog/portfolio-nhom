/* Cuộn từng "trang": một cú lăn chuột đưa tới đúng trang kế tiếp (có hiệu ứng), muốn đi tiếp phải lăn chuột lần nữa.
   Chỉ bật trên máy tính có chuột. Điện thoại và máy cảm ứng dùng cuộn tự nhiên với CSS scroll-snap. */
(() => {
  const root = document.documentElement;
  const pages = [...document.querySelectorAll('.page')];
  const mq = matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');

  let idx = 0, locked = false, coolUntil = 0, lastWheel = 0, consumed = false, nativeScroll = false;

  // Những khối sẽ "hiện ra" khi trang được kích hoạt
  const targets = new Map(pages.map((p) => [p, p.id === 'hero'
    ? [...p.querySelectorAll('.hero-text, .portrait')]
    : p.id === 'f4' ? [...p.querySelectorAll('#contact > .wrap, .site-footer')]
    : [...p.querySelectorAll(':scope > .wrap')]]));
  targets.forEach((list) => list.forEach((el, i) => { el.classList.add('rv'); el.style.setProperty('--d', `${.3 + i * .18}s`); }));

  const topOf = (p) => p.getBoundingClientRect().top + window.scrollY; // offsetTop sai khi nằm trong khung có position
  const frameOf = (p) => Number((p.closest('.frame') || p).dataset.frame) || 1;
  const show = (i) => pages.forEach((p, k) => targets.get(p).forEach((el) => el.classList.toggle('in', k === i)));
  const announce = (i) => document.dispatchEvent(new CustomEvent('framechange', { detail: frameOf(pages[i]) }));

  // Trang đang nằm ở giữa màn hình (dùng khi người dùng tự cuộn trong trang dài)
  function currentIndex() {
    let k = 0;
    pages.forEach((p, i) => { if (topOf(p) <= window.scrollY + window.innerHeight * .5) k = i; });
    return k;
  }
  function sync() {
    const k = currentIndex();
    if (k !== idx) { idx = k; show(idx); announce(idx); }
  }

  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  function animateTo(y, ms) {
    return new Promise((done) => {
      const from = window.scrollY, delta = y - from, t0 = performance.now();
      (function frame(now) {
        const t = Math.min(1, (now - t0) / ms);
        window.scrollTo(0, from + delta * ease(t));
        if (t < 1) requestAnimationFrame(frame); else done();
      })(t0);
    });
  }

  function go(i, force) {
    i = Math.max(0, Math.min(pages.length - 1, i));
    if (i === idx && !force) return;
    const dir = Math.sign(i - idx) || 1;
    idx = i; locked = true;
    show(i); announce(i);
    document.dispatchEvent(new CustomEvent('pagechange', { detail: { dir } }));
    const max = root.scrollHeight - window.innerHeight;
    animateTo(Math.min(topOf(pages[i]), max), 1000).then(() => { locked = false; coolUntil = performance.now() + 300; }); // nghỉ một nhịp sau khi tới trang
  }

  // Trang cao hơn màn hình thì cho cuộn tự nhiên tới mép rồi mới chuyển trang
  function hasMore(dir) {
    const r = pages[idx].getBoundingClientRect();
    return dir > 0 ? r.bottom > window.innerHeight + 6 : r.top < -6;
  }
  const atEdge = (dir) => (dir > 0 && idx === pages.length - 1) || (dir < 0 && idx === 0);

  window.addEventListener('wheel', (e) => {
    if (!mq.matches || e.ctrlKey) return;
    const now = performance.now(), gap = now - lastWheel;
    lastWheel = now;
    if (gap > 140) { consumed = false; nativeScroll = false; } // khoảng nghỉ > 140ms = cú lăn mới
    if (locked || consumed || now < coolUntil) { e.preventDefault(); return; }
    const dir = Math.sign(e.deltaY);
    if (!dir) return;
    sync();
    if (hasMore(dir)) { nativeScroll = true; return; }
    if (nativeScroll) { e.preventDefault(); return; }   // cùng một cú lăn vừa chạm mép: chưa chuyển
    if (atEdge(dir)) return;
    e.preventDefault();
    consumed = true;
    go(idx + dir);
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (!mq.matches || locked || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
    const keys = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1 };
    if (e.key === ' ' && e.target === document.body) keys[' '] = e.shiftKey ? -1 : 1;
    const dir = keys[e.key];
    if (!dir) return;
    sync();
    if (hasMore(dir) || atEdge(dir)) return;
    e.preventDefault();
    go(idx + dir);
  });

  // Người dùng kéo thanh cuộn, bấm phím Home/End hoặc nhảy bằng đường dẫn #: đồng bộ lại trang đang xem
  let settle;
  window.addEventListener('scroll', () => {
    if (!mq.matches || locked) return;
    clearTimeout(settle);
    settle = setTimeout(sync, 120);
  }, { passive: true });

  // Bấm menu hoặc chấm điều hướng: bay thẳng tới trang chứa mục đó
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || !mq.matches) return;
    const id = a.getAttribute('href').slice(1);
    if (!id) { e.preventDefault(); return; }
    const target = document.getElementById(id);
    if (!target) return;
    let i = pages.findIndex((p) => p.contains(target));
    if (i < 0) i = pages.findIndex((p) => target.contains(p));
    if (i < 0) return;
    e.preventDefault();
    if (!locked) { consumed = true; go(i, true); }
  });

  function apply() {
    root.classList.toggle('js-pager', mq.matches);
    idx = currentIndex();
    show(idx);
    announce(idx);
  }
  mq.addEventListener('change', apply);
  window.addEventListener('load', apply);
  apply();
})();
