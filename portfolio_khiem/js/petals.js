/* Cánh hoa anh đào rơi trên canvas. Cánh hoa được vẽ sẵn một lần thành sprite (đầu khuyết chữ V, nhạt ở đầu,
   đậm dần về cuống, có gân giữa) rồi chỉ xoay/lật khi rơi nên rất nhẹ. Phần lớn cánh hoa bắt đầu rơi từ chỗ
   cành hoa ở hai góc trên. Gió thổi theo chuột, cuộn trang và mỗi lần chuyển trang. */
(() => {
  const canvas = document.getElementById('petals');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let w = 0, h = 0, petals = [], wind = 0, windTarget = 0, lastX = null, lastY = window.scrollY, sprite = null, dark = false;
  const SIZE = 64, HALF = 26; // sprite 64px, nửa chiều dài cánh hoa 26px

  function buildSprite() {
    const css = getComputedStyle(document.documentElement);
    const tip = css.getPropertyValue('--petal-tip').trim() || '#FFF1F5';
    const base = css.getPropertyValue('--petal-base').trim() || '#F59DB6';
    dark = document.documentElement.dataset.theme === 'dark';
    const c = document.createElement('canvas'); c.width = c.height = SIZE;
    const g = c.getContext('2d');
    g.translate(SIZE / 2, SIZE / 2);
    if (dark) {                                                       // đêm: quầng sáng hồng phía sau cánh hoa
      const glow = g.createRadialGradient(0, 0, 4, 0, 0, 31);
      glow.addColorStop(0, 'rgba(255,160,215,.45)'); glow.addColorStop(1, 'rgba(255,160,215,0)');
      g.fillStyle = glow; g.fillRect(-32, -32, 64, 64);
    }
    const s = HALF * .82;
    g.beginPath();
    g.moveTo(0, s);
    g.bezierCurveTo(-s * .5, s * .6, -s * .95, -s * .15, -s * .5, -s * .82);
    g.quadraticCurveTo(-s * .22, -s * 1.08, 0, -s * .7);              // khuyết giữa
    g.quadraticCurveTo(s * .22, -s * 1.08, s * .5, -s * .82);
    g.bezierCurveTo(s * .95, -s * .15, s * .5, s * .6, 0, s);
    g.closePath();
    const grad = g.createLinearGradient(0, -s, 0, s);
    grad.addColorStop(0, tip); grad.addColorStop(.5, tip); grad.addColorStop(1, base);
    g.fillStyle = grad; g.fill();
    g.strokeStyle = 'rgba(200,70,110,.35)'; g.lineWidth = .9; g.stroke();
    g.beginPath(); g.moveTo(0, s * .92); g.lineTo(0, -s * .45);       // gân giữa
    g.strokeStyle = 'rgba(200,70,110,.3)'; g.stroke();
    sprite = c;
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const lite = document.documentElement.classList.contains('lite');
    const target = lite ? 10 : Math.min(30, Math.round(w / 44));
    while (petals.length < target) petals.push(makePetal(true));
    petals.length = target;
  }

  function makePetal(anywhere) {
    const p = {
      x: Math.random() * w, y: anywhere ? Math.random() * h : -24,
      size: 7 + Math.random() * 6,
      vy: .45 + Math.random() * .7, drift: (Math.random() - .5) * .45,
      rot: Math.random() * 6.28, spin: (Math.random() - .5) * .035, flip: Math.random() * 6.28,
      alpha: .8 + Math.random() * .2
    };
    if (!anywhere && Math.random() < .65) {                          // rơi ra từ cành hoa ở hai góc trên
      const right = Math.random() < .6;
      p.x = right ? w * (.5 + Math.random() * .45) : w * Math.random() * .32;
      p.y = h * (.02 + Math.random() * .2);
    }
    return p;
  }

  function drawPetal(p) {
    const d = p.size / HALF * SIZE;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.scale(Math.abs(Math.cos(p.flip)) * .85 + .2, 1);              // lật quanh trục dọc
    ctx.globalAlpha = p.alpha;
    ctx.drawImage(sprite, -d / 2, -d / 2, d, d);
    ctx.restore();
  }

  const push = (v) => { windTarget = Math.max(-7, Math.min(7, windTarget + v)); };

  function frame() {
    ctx.clearRect(0, 0, w, h);
    wind += (windTarget - wind) * .06;
    windTarget *= .94;
    for (const p of petals) {
      p.x += p.drift + wind + Math.sin(p.flip) * .45;
      p.y += p.vy;
      p.rot += p.spin + wind * .02;
      p.flip += .028;
      if (p.y > h + 24 || p.x < -40 || p.x > w + 40) Object.assign(p, makePetal(false));
      drawPetal(p);
    }
    requestAnimationFrame(frame);
  }

  window.addEventListener('pointermove', (e) => { if (lastX !== null) push((e.clientX - lastX) * .05); lastX = e.clientX; }, { passive: true });
  window.addEventListener('scroll', () => { push((window.scrollY - lastY) * .01); lastY = window.scrollY; }, { passive: true });
  document.addEventListener('pagechange', (e) => push(e.detail.dir * 6));
  window.addEventListener('resize', resize);
  document.addEventListener('themechange', buildSprite);
  document.addEventListener('litechange', resize);

  buildSprite();
  resize();
  if (reduceMotion) { ctx.clearRect(0, 0, w, h); petals.forEach(drawPetal); }
  else requestAnimationFrame(frame);
})();
