/* =====================================================================
   core.js — tiện ích dùng chung (PF) và các component nhỏ: tabs, modal.
   Bạn KHÔNG cần sửa file này.
   ===================================================================== */
window.PF = (function () {
  "use strict";

  const P = window.PORTFOLIO || PORTFOLIO;   // "const" ở content.js không tự thành thuộc tính của window
  const $ = (selector, root) => (root || document).querySelector(selector);
  const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));

  /* Tạo phần tử DOM an toàn (dùng textContent, không chèn HTML thô).
     opts: cls, text, href, attrs{}, style{} (hỗ trợ biến CSS --x), on{event: fn} */
  function el(tag, opts, children) {
    const node = document.createElement(tag);
    const o = opts || {};
    if (o.cls) node.className = o.cls;
    if (o.text != null) node.textContent = o.text;
    if (o.href) {
      node.href = o.href;
      if (/^https?:/i.test(o.href)) { node.target = "_blank"; node.rel = "noopener noreferrer"; }
    }
    if (o.attrs) Object.keys(o.attrs).forEach((k) => node.setAttribute(k, o.attrs[k]));
    if (o.style) Object.keys(o.style).forEach((k) => node.style.setProperty(k, o.style[k]));
    if (o.on) Object.keys(o.on).forEach((k) => node.addEventListener(k, o.on[k]));
    (children || []).forEach((child) => {
      if (child == null || child === false) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  const icon = (name) => el("i", { cls: "fa " + name, attrs: { "aria-hidden": "true" } });

  /* ---------- Tabs (có hỗ trợ bàn phím ← → Home End) ---------- */
  function tabs(items, label) {
    const uid = "tabs-" + Math.random().toString(36).slice(2, 7);
    const list = el("div", { cls: "tablist", attrs: { role: "tablist", "aria-label": label || "Chọn nội dung" } });
    const panels = el("div", { cls: "tabpanels" });
    const buttons = [];
    const panes = [];

    function select(index, focus) {
      buttons.forEach((b, i) => {
        const on = i === index;
        b.setAttribute("aria-selected", String(on));
        b.tabIndex = on ? 0 : -1;
        panes[i].hidden = !on;
        if (on) panes[i].classList.add("pop-in");
      });
      if (focus) buttons[index].focus();
    }

    items.forEach((item, i) => {
      const btn = el("button", {
        cls: "tab", attrs: { role: "tab", id: uid + "-t" + i, "aria-controls": uid + "-p" + i, type: "button" },
        on: { click: () => select(i) }
      }, [item.icon ? icon(item.icon) : null, el("span", { text: item.label })]);
      const pane = el("div", { cls: "tabpanel", attrs: { role: "tabpanel", id: uid + "-p" + i, "aria-labelledby": uid + "-t" + i, tabindex: "0" } }, [item.panel]);
      pane.addEventListener("animationend", () => pane.classList.remove("pop-in"));
      buttons.push(btn); panes.push(pane);
      list.appendChild(btn); panels.appendChild(pane);
    });

    list.addEventListener("keydown", (e) => {
      const cur = buttons.indexOf(document.activeElement);
      if (cur < 0) return;
      const last = buttons.length - 1;
      const map = { ArrowRight: cur === last ? 0 : cur + 1, ArrowLeft: cur === 0 ? last : cur - 1, Home: 0, End: last };
      if (e.key in map) { e.preventDefault(); select(map[e.key], true); }
    });

    select(0);
    return el("div", { cls: "tabs" }, [list, panels]);
  }

  /* ---------- Modal dùng thẻ <dialog> (tự có ESC, khoá focus) ---------- */
  const modal = {
    dialog: null,
    open(content) {
      const dlg = this.dialog || (this.dialog = $("#modal"));
      if (!dlg) return;
      $(".modal-body", dlg).replaceChildren(content);
      if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
      document.documentElement.classList.add("modal-open");
    },
    close() {
      const dlg = this.dialog || $("#modal");
      if (!dlg) return;
      if (typeof dlg.close === "function") dlg.close(); else dlg.removeAttribute("open");
    },
    init() {
      const dlg = (this.dialog = $("#modal"));
      if (!dlg) return;
      $(".modal-close", dlg).addEventListener("click", () => this.close());
      dlg.addEventListener("click", (e) => { if (e.target === dlg) this.close(); });   // bấm ra ngoài để đóng
      dlg.addEventListener("close", () => document.documentElement.classList.remove("modal-open"));
    }
  };
  modal.init();

  return { P, $, $$, el, icon, tabs, modal };
})();
