/* Chế độ nhẹ: tự đo số khung hình/giây ngay sau khi tải trang. Nếu máy tụt dưới ngưỡng thì tự tắt các hiệu ứng liên tục.
   Người dùng cũng có thể bấm nút tia chớp trên thanh menu để bật/tắt và trình duyệt sẽ nhớ lựa chọn. */
(() => {
  const root = document.documentElement;
  const btn = document.getElementById('perfBtn');
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* bỏ qua */ } }
  };

  function setLite(on, remember) {
    root.classList.toggle('lite', on);
    if (btn) btn.setAttribute('aria-pressed', on);
    if (remember) store.set('perf', on ? 'lite' : 'full');
    document.dispatchEvent(new CustomEvent('litechange', { detail: on }));
  }

  if (btn) btn.addEventListener('click', () => setLite(!root.classList.contains('lite'), true));

  const saved = store.get('perf');
  if (saved) { setLite(saved === 'lite'); return; }

  // Chưa có lựa chọn: đo 2,5 giây sau khi trang ổn định; dưới 42 khung/giây thì chuyển sang chế độ nhẹ
  setLite(false);
  const THRESHOLD = 42;
  function measure() {
    if (document.visibilityState !== 'visible') { setTimeout(measure, 1000); return; }
    let frames = 0; const t0 = performance.now();
    (function tick(now) {
      frames++;
      if (now - t0 < 2500) requestAnimationFrame(tick);
      else if (frames * 1000 / (now - t0) < THRESHOLD) setLite(true);
    })(t0);
  }
  window.addEventListener('load', () => setTimeout(measure, 1800));
})();
