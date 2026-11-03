/* Hạt ánh sáng sống động theo từng khung và theo ngày/đêm:
   ngày = lấp lánh mặt nước, bụi nắng, phấn hoa; đêm = đom đóm, bokeh hồng, tia neon, tàn lửa đèn lồng. */
(() => {
  const canvas = document.getElementById('ambient');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, groups = [], frame = 1, time = 'day', last = performance.now();

  // Mỗi mục: kiểu hạt, số lượng, màu (RGB), cỡ, vùng xuất hiện theo chiều dọc (tỉ lệ màn hình), vận tốc
  const NEON = ['0,220,255', '255,70,160', '255,160,60'];
  const CONFIG = {
    day: {
      1: [{ k: 'glint', n: 16, c: ['255,255,255'], s: [10, 22], y: [.62, .96] }, { k: 'mote', n: 18, c: ['255,246,214'], s: [3, 7], vx: [.06, .22], vy: [-.1, .04] }],
      2: [{ k: 'mote', n: 50, c: ['255,252,210'], s: [2, 6], vx: [-.08, .16], vy: [.03, .2] }],
      3: [{ k: 'pollen', n: 30, c: ['255,255,255'], s: [2, 5], vx: [.35, .95], vy: [-.15, .1] }],
      4: [{ k: 'glint', n: 18, c: ['255,255,255'], s: [10, 22], y: [.6, .95] }, { k: 'mote', n: 14, c: ['255,240,200'], s: [3, 6], vx: [.04, .16], vy: [-.08, .06] }]
    },
    night: {
      1: [{ k: 'twinkle', n: 30, c: ['255,255,255'], s: [2, 5], y: [0, .6] }, { k: 'firefly', n: 26, c: ['214,255,120'], s: [11, 22], y: [.35, .98] }],
      2: [{ k: 'bokeh', n: 22, c: ['255,120,200', '190,130,255'], s: [22, 46], vx: [-.1, .1], vy: [-.08, .05] }, { k: 'firefly', n: 10, c: ['255,228,150'], s: [10, 18] }],
      3: [{ k: 'spark', n: 36, c: NEON, s: [8, 18], vx: [-.12, .12], vy: [-.25, .05] }, { k: 'firefly', n: 8, c: ['255,228,150'], s: [10, 18] }],
      4: [{ k: 'ember', n: 32, c: ['255,150,60', '255,200,90'], s: [8, 16], vx: [-.15, .15], vy: [-.7, -.25] }, { k: 'firefly', n: 8, c: ['255,228,150'], s: [10, 18] }]
    }
  };

  // Sprite dựng sẵn để vẽ nhanh: vòng sáng mềm và ngôi sao 4 cánh
  const cache = {};
  function sprite(rgb, star) {
    const key = rgb + star;
    if (cache[key]) return cache[key];
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const rad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    rad.addColorStop(0, `rgba(${rgb},1)`); rad.addColorStop(.25, `rgba(${rgb},.55)`); rad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = rad; g.fillRect(0, 0, 64, 64);
    if (star) {
      g.fillStyle = `rgba(${rgb},.9)`;
      g.beginPath(); g.moveTo(32, 2); g.quadraticCurveTo(34, 30, 62, 32); g.quadraticCurveTo(34, 34, 32, 62); g.quadraticCurveTo(30, 34, 2, 32); g.quadraticCurveTo(30, 30, 32, 2); g.fill();
    }
    return (cache[key] = c);
  }

  const rnd = (a, b) => a + Math.random() * (b - a);
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function spawn(spec, initial) {
    const y = spec.y || [0, 1];
    return {
      x: Math.random() * w, y: (initial === false && spec.vy && spec.vy[1] < 0 ? h + 20 : rnd(y[0], y[1]) * h),
      s: rnd(spec.s[0], spec.s[1]), c: pick(spec.c), ph: Math.random() * 6.28, sp: rnd(.5, 1.6),
      vx: spec.vx ? rnd(spec.vx[0], spec.vx[1]) : 0, vy: spec.vy ? rnd(spec.vy[0], spec.vy[1]) : 0, a: Math.random() * 6.28
    };
  }
  function makeGroup(spec) {
    const count = Math.max(4, Math.round(spec.n * .7 * Math.min(1, w / 1300 + .3)));
    return { spec, mul: 0, dir: 1, ps: Array.from({ length: count }, () => spawn(spec)) };
  }

  function rebuild() {
    groups.forEach((g) => { g.dir = -1; });                       // nhóm cũ mờ dần
    (CONFIG[time][frame] || []).forEach((spec) => groups.push(makeGroup(spec)));
  }

  function alphaOf(k, p, t) {
    const s = Math.sin(t * .001 * p.sp + p.ph);
    switch (k) {
      case 'twinkle': return .2 + .8 * (s + 1) / 2;
      case 'glint': return Math.pow(Math.max(0, s), 3);                 // lóe sáng ngắn
      case 'spark': return Math.pow(Math.max(0, s), 2) * .95;
      case 'firefly': return Math.pow(Math.max(0, Math.sin(t * .0012 * p.sp + p.ph)), 2); // nhấp nháy chậm
      case 'bokeh': return .16 + .16 * (s + 1) / 2;
      case 'ember': return .55 + .45 * s;
      default: return .35 + .4 * (s + 1) / 2;                           // mote, pollen
    }
  }

  function step(g, dt, t) {
    const k = g.spec.k;
    for (const p of g.ps) {
      if (k === 'firefly') {                                         // bay lang thang, hơi hướng lên
        p.a += (Math.random() - .5) * .22;
        p.x += Math.cos(p.a) * .45; p.y += Math.sin(p.a) * .35 - .06;
      } else if (k === 'pollen') {
        p.x += p.vx; p.y += p.vy + Math.sin(t * .002 * p.sp + p.ph) * .5;
      } else if (k === 'ember') {
        p.x += p.vx + Math.sin(t * .003 * p.sp + p.ph) * .5; p.y += p.vy;
      } else if (k !== 'glint' && k !== 'twinkle') {
        p.x += p.vx; p.y += p.vy;
      }
      if (p.x < -60) p.x = w + 60; if (p.x > w + 60) p.x = -60;
      if (p.y < -60 || p.y > h + 60) {                               // ra khỏi màn hình thì hồi sinh ở phía đối diện
        const vy = p.vy;
        Object.assign(p, spawn(g.spec, true));
        if (k === 'firefly' || k === 'glint' || k === 'twinkle') { const yr = g.spec.y || [0, 1]; p.y = rnd(yr[0], yr[1]) * h; }
        else p.y = p.vy < 0 || (p.vy === 0 && vy < 0) ? h + 20 : -20;
      }
    }
    g.mul = Math.max(0, Math.min(1, g.mul + g.dir * dt / 1200));
  }

  function draw(g, t) {
    const star = g.spec.k === 'glint' || g.spec.k === 'spark';
    for (const p of g.ps) {
      const a = alphaOf(g.spec.k, p, t) * g.mul;
      if (a < .02) continue;
      const size = p.s * (g.spec.k === 'firefly' ? .6 + .5 * a : 1);
      ctx.globalAlpha = Math.min(1, a);
      ctx.drawImage(sprite(p.c, star), p.x - size, p.y - size, size * 2, size * 2);
      if (g.spec.k === 'firefly') { const core = size * .3; ctx.drawImage(sprite('255,255,210', false), p.x - core, p.y - core, core * 2, core * 2); } // lõi sáng của đom đóm
    }
  }

  function loop(now) {
    const dt = Math.min(60, now - last); last = now;
    ctx.clearRect(0, 0, w, h);
    if (document.documentElement.classList.contains('lite')) { requestAnimationFrame(loop); return; }   // chế độ nhẹ: không vẽ hạt
    ctx.globalCompositeOperation = 'lighter';
    groups.forEach((g) => { step(g, dt, now); draw(g, now); });
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    groups = groups.filter((g) => !(g.dir < 0 && g.mul <= 0));
    requestAnimationFrame(loop);
  }

  function resize() {
    w = innerWidth; h = innerHeight;           // hạt sáng mềm nên không cần độ phân giải cao, giúp máy nhẹ hơn
    canvas.width = w; canvas.height = h;
  }

  document.addEventListener('scenechange', (e) => {
    if (e.detail.frame === frame && e.detail.time === time && groups.length) return;
    frame = e.detail.frame; time = e.detail.time; rebuild();
  });
  window.addEventListener('resize', resize);
  resize();
  if (!reduce) requestAnimationFrame(loop);
})();
