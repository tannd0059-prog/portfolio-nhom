/* Tương tác chính: giao diện ngày/đêm, song ngữ, menu, kỹ năng (rừng tre), dự án (chọn nhiệm vụ), liên hệ. */
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const root = document.documentElement;
  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) { /* bỏ qua */ } }
  };
  let lang = store.get('lang') === 'en' ? 'en' : 'vi';
  const t = (key) => I18N[lang][key] || key;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg; el.hidden = false;
    clearTimeout(toast.id); toast.id = setTimeout(() => { el.hidden = true; }, 1800);
  }

  /* ---------- 1. Ngày / đêm ---------- */
  const themeBtn = $('#themeBtn');
  function setTheme(theme) {
    root.dataset.theme = theme; store.set('theme', theme);
    const dark = theme === 'dark';
    themeBtn.setAttribute('aria-pressed', dark);
    themeBtn.setAttribute('aria-label', t(dark ? 'theme_to_light' : 'theme_to_dark'));
    $('span', themeBtn).textContent = dark ? '☀' : '☾';
    document.dispatchEvent(new Event('themechange'));
  }
  themeBtn.addEventListener('click', () => setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark'));

  /* ---------- 2. Kỹ năng: mỗi cây tre là một kỹ năng ---------- */
  let skillId = DATA.skills[0].id;
  const GROUPS = ['mobile', 'backend', 'data', 'base'];
  function renderSkills() {
    $('#stage').innerHTML = DATA.skills.map((s, i) =>
      `<button class="stalk" role="tab" data-id="${s.id}" data-g="${s.g}" style="--h:${s.h}%;--i:${i}" aria-selected="${s.id === skillId}"><span>${esc(s.n[lang])}</span></button>`).join('');
    $('#legend').innerHTML = GROUPS.map((g) => `<li style="--c:var(--g-${g})">${t('g_' + g)}</li>`).join('');
    showSkill(skillId);
  }
  function showSkill(id) {
    skillId = id;
    const s = DATA.skills.find((x) => x.id === id);
    $$('.stalk').forEach((b) => b.setAttribute('aria-selected', b.dataset.id === id));
    const dots = Array.from({ length: 5 }, (_, i) => `<i class="${i < (s.lv === 'good' ? 4 : 2) ? 'on' : ''}"></i>`).join('');
    $('#skillCard').style.setProperty('--gc', `var(--g-${s.g})`);
    $('#skillCard').innerHTML = `<h3>${esc(s.n[lang])}</h3>
      <div class="meta"><span class="pill">${t('lv_' + s.lv)}</span><span>${t('g_' + s.g)}</span></div>
      <p class="use">${t('use_label')}</p><p>${esc(s.u[lang])}</p><div class="nodes">${dots}</div>`;
  }
  $('#stage').addEventListener('click', (e) => { const b = e.target.closest('.stalk'); if (b) showSkill(b.dataset.id); });
  $('#stage').addEventListener('keydown', (e) => {   // mũi tên trái/phải để duyệt kỹ năng
    if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const list = $$('.stalk'); const i = list.findIndex((b) => b.dataset.id === skillId);
    const next = list[(i + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
    showSkill(next.dataset.id); next.focus(); e.preventDefault();
  });

  /* ---------- 3. Dự án: chọn nhiệm vụ ---------- */
  let projId = DATA.projects[0].id;
  function renderProjects() {
    $('#projTabs').innerHTML = DATA.projects.map((p) =>
      `<button class="proj-tab" role="tab" data-id="${p.id}" aria-selected="${p.id === projId}"><strong>${p.name.replace('&', '&amp;')}</strong><small>${esc(p[lang].role)}</small></button>`).join('');
    showProject(projId, false);
  }
  function showProject(id, animate = true) {
    projId = id;
    const p = DATA.projects.find((x) => x.id === id), c = p[lang];
    $$('.proj-tab').forEach((b) => b.setAttribute('aria-selected', b.dataset.id === id));
    const panel = $('#projPanel');
    panel.innerHTML = `<div><img src="${p.img}" alt="${esc(p.name)}" width="800" height="500">
        <span class="status">${esc(c.status)}</span>
        <p class="k">${t('tech_label')}</p><ul class="chips">${p.tech.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <a class="link" href="${p.repo}" target="_blank" rel="noopener">${t('view_gh')}</a></div>
      <div><p class="summary">${esc(c.summary)}</p>
        <p class="k">${t('role_label')}</p><span class="roleline">${esc(c.role)}</span>
        <p class="k">${t('did_label')}</p><ul class="did">${c.did.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>`;
    if (animate) { panel.style.animation = 'none'; void panel.offsetWidth; panel.style.animation = ''; }
  }
  $('#projTabs').addEventListener('click', (e) => { const b = e.target.closest('.proj-tab'); if (b) showProject(b.dataset.id); });

  /* ---------- 4. Song ngữ ---------- */
  const langBtn = $('#langBtn');
  function applyLang(next) {
    lang = next; store.set('lang', lang); root.lang = lang;
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-aria]').forEach((el) => { const k = el.dataset.i18nAria; if (I18N[lang][k]) el.setAttribute('aria-label', I18N[lang][k]); });
    langBtn.textContent = lang === 'vi' ? 'EN' : 'VI';
    const cv = `assets/CV_PhamGiaKhiem_${lang.toUpperCase()}.pdf`;   // nút tải CV đổi theo ngôn ngữ
    ['#cvBtn', '#cvBtn2'].forEach((id) => { const a = $(id); a.href = cv; a.setAttribute('download', cv.split('/').pop()); });
    renderSkills(); renderProjects();
    setTheme(root.dataset.theme || 'light');
  }
  langBtn.addEventListener('click', () => applyLang(lang === 'vi' ? 'en' : 'vi'));

  /* ---------- 5. Menu mobile và đánh dấu mục đang xem ---------- */
  const menuBtn = $('#menuBtn'), nav = $('#nav');
  const toggleMenu = (open) => { nav.classList.toggle('open', open); menuBtn.setAttribute('aria-expanded', open); };
  menuBtn.addEventListener('click', () => toggleMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) toggleMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(false); });
  const links = $$('#nav a');
  const spy = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  /* ---------- 6. Liên hệ: sao chép email và kiểm tra form ---------- */
  $('#copyMail').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('khiemanh94@gmail.com'); toast(t('copied')); }
    catch (e) { toast('khiemanh94@gmail.com'); }
  });
  const form = $('#contactForm');
  const rules = { name: (v) => v.trim().length >= 2, email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()), message: (v) => v.trim().length >= 10 };
  function validateField(input) {
    const ok = rules[input.name](input.value);
    input.setAttribute('aria-invalid', !ok); $('#err-' + input.name).hidden = ok;
    return ok;
  }
  $$('input, textarea', form).forEach((input) => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => { if (input.getAttribute('aria-invalid') === 'true') validateField(input); });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = $$('input, textarea', form);
    const results = fields.map(validateField);
    const bad = fields[results.indexOf(false)];
    if (bad) { bad.focus(); return; }
    const d = new FormData(form);
    const body = `${d.get('message')}\n\n${d.get('name')} (${d.get('email')})`;
    window.location.href = `mailto:khiemanh94@gmail.com?subject=${encodeURIComponent(t('mail_subject'))}&body=${encodeURIComponent(body)}`;
    $('#formOk').hidden = false; form.reset();
  });

  if (!root.dataset.theme) root.dataset.theme = 'light';
  applyLang(lang);
})();
