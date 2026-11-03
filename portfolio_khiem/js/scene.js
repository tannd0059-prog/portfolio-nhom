/* Ảnh nền 4 khung: cuộn tới khung nào thì ảnh nền đổi sang ảnh của khung đó (mượt nhờ CSS transition).
   Mỗi khung có 2 ảnh, một cho ban ngày và một cho ban đêm; đổi theme thì ảnh cũng đổi theo. */
(() => {
  // 2. Chọn ảnh nền theo khung đang xem và theme hiện tại
  const slides = [...document.querySelectorAll('.bg-slide')];
  const frames = [...document.querySelectorAll('.frame')];
  const decos = [...document.querySelectorAll('.deco-f')];
  const dots = [...document.querySelectorAll('.dots a')];
  let current = 1;

  function render() {
    const time = document.documentElement.dataset.theme === 'dark' ? 'night' : 'day';
    slides.forEach((s) => s.classList.toggle('on', s.dataset.t === time && Number(s.dataset.i) === current));
    decos.forEach((d) => d.classList.toggle('on', Number(d.dataset.f) === current));
    document.dispatchEvent(new CustomEvent('scenechange', { detail: { frame: current, time } }));
    dots.forEach((d, i) => {
      d.classList.toggle('active', i + 1 === current);
      d.setAttribute('aria-current', i + 1 === current ? 'true' : 'false');
    });
  }

  // Khung nào đang cắt ngang giữa màn hình thì là khung hiện tại
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting || document.documentElement.classList.contains('js-pager')) return; // pager tự báo khung
      current = Number(e.target.dataset.frame);
      render();
    });
  }, { rootMargin: '-50% 0px -50% 0px' });
  frames.forEach((f) => spy.observe(f));

  document.addEventListener('framechange', (e) => { current = e.detail; render(); });
  document.addEventListener('themechange', render);
  render();

  // 3. Parallax rất nhẹ cho ảnh nền theo chuột (tắt ở chế độ nhẹ). Vòng lặp chỉ chạy khi chuột đang di chuyển.
  const bg = document.querySelector('.bg');
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (fine && !still) {
    let tx = 0, ty = 0, cx = 0, cy = 0, running = false;
    const tick = () => {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      bg.style.translate = `${(-cx).toFixed(1)}px ${(-cy).toFixed(1)}px`;
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > .4) requestAnimationFrame(tick); else running = false;
    };
    window.addEventListener('pointermove', (e) => {
      if (document.documentElement.classList.contains('lite')) return;
      tx = (e.clientX / innerWidth - .5) * 26; ty = (e.clientY / innerHeight - .5) * 14;
      if (!running) { running = true; requestAnimationFrame(tick); }
    }, { passive: true });
  }

  // 4. Gõ chữ cho dòng chức danh ở hero
  const role = document.querySelector('.role[data-type]');
  if (role && !still) {
    const text = role.dataset.type;
    role.textContent = ''; role.classList.add('typing');
    let i = 0;
    setTimeout(function type() {
      role.textContent = text.slice(0, ++i);
      if (i < text.length) setTimeout(type, 55);
      else setTimeout(() => role.classList.remove('typing'), 1800);
    }, 900);
  }
})();
