/* =====================================================================
   render.js — đọc dữ liệu từ content.js và dựng nội dung các phần.
   Bạn KHÔNG cần sửa file này. Hãy chỉnh nội dung trong content.js.
   ===================================================================== */
(function () {
  "use strict";

  const { P, $, $$, el, icon, tabs, modal } = window.PF;

  /* Điền một phần: nếu dữ liệu rỗng thì ẩn cả phần (và mục menu tương ứng) */
  function mount(id, data, build) {
    const sec = $("#" + id);
    if (!sec) return;
    const empty = data == null || (Array.isArray(data) && !data.length);
    if (empty) { sec.hidden = true; return; }
    const title = $(".section-title", sec);
    if (title && P.sections[id]) title.textContent = P.sections[id];
    $(".section-body", sec).replaceChildren(build());
  }

  const initial = (name) => (name || "?").trim().charAt(0).toUpperCase();

  /* ---------- HERO ---------- */
  function renderHero() {
    $("#heroName").textContent = P.name;

    const img = $("#heroAvatar");
    img.alt = "Ảnh đại diện của " + P.name;
    img.addEventListener("error", () => {
      img.replaceWith(el("div", { cls: "avatar avatar-fallback", text: initial(P.name) }));
    });
    img.src = P.avatar;

    const words = P.roles && P.roles.length ? P.roles : [P.role];
    $("#typed").dataset.words = JSON.stringify(words);
    $("#typed").textContent = words[0];
    $("#heroTagline").textContent = P.tagline || "";

    (P.heroChips || []).forEach((text, i) => {
      $("#heroChips").appendChild(el("span", { cls: "chip chip-" + (i % 4), text, style: { "--depth": String(8 + i * 4) } }));
    });

    const actions = $("#heroActions");
    actions.appendChild(el("a", { cls: "btn primary", href: "#contact" }, [icon("fa-envelope"), " Liên hệ với mình"]));
    actions.appendChild(el("a", { cls: "btn", href: "#projects" }, [icon("fa-folder-open"), " Xem dự án"]));
    if (P.cv && P.cv.url) actions.appendChild(el("a", { cls: "btn", href: P.cv.url }, [icon("fa-download"), " " + (P.cv.label || "Tải CV")]));

    (P.social || []).forEach((s) => {
      $("#heroSocial").appendChild(el("a", { href: s.url, attrs: { "aria-label": s.label, title: s.label } }, [icon(s.icon)]));
    });

    const skillCount = (P.skills || []).reduce((n, g) => n + g.items.length, 0);
    [
      { label: "Dự án", value: (P.projects || []).length },
      { label: "Kỹ năng", value: skillCount },
      { label: "Giải thưởng", value: (P.awards || []).length }
    ].forEach((s) => {
      $("#heroStats").appendChild(el("li", {}, [
        el("strong", { text: String(s.value), attrs: { "data-count": s.value } }),
        el("span", { text: s.label })
      ]));
    });

    /* Dải công nghệ chạy ngang: lấy từ danh sách kỹ năng + thẻ công nghệ dự án */
    const techs = new Set();
    (P.skills || []).forEach((g) => g.items.forEach((i) => techs.add(i.name)));
    (P.projects || []).forEach((p) => (p.tags || []).forEach((t) => techs.add(t)));
    const row = () => Array.from(techs).map((t) => el("span", { cls: "marquee-item" }, [icon("fa-circle"), t]));
    const track = $("#marqueeTrack");
    [1, 2].forEach(() => row().forEach((n) => track.appendChild(n)));   // nhân đôi để chạy vòng lặp liền mạch
  }

  /* ---------- VỀ TÔI ---------- */
  function codeValue(v) {
    if (Array.isArray(v)) {
      const out = [el("span", { cls: "tk-p", text: "[" })];
      v.forEach((item, i) => {
        out.push(el("span", { cls: "tk-str", text: '"' + item + '"' }));
        if (i < v.length - 1) out.push(el("span", { cls: "tk-p", text: ", " }));
      });
      out.push(el("span", { cls: "tk-p", text: "]" }));
      return out;
    }
    if (typeof v === "boolean") return [el("span", { cls: "tk-bool", text: String(v) })];
    return [el("span", { cls: "tk-str", text: '"' + v + '"' })];
  }

  function codeWindow(c) {
    const line = (children) => el("div", { cls: "code-line" }, children);
    const lines = [
      line([el("span", { cls: "tk-kw", text: "const " }), el("span", { cls: "tk-var", text: c.variable }), el("span", { cls: "tk-p", text: " = {" })])
    ];
    c.fields.forEach((f) => {
      lines.push(line([
        el("span", { cls: "tk-indent" }),
        el("span", { cls: "tk-key", text: f.key }),
        el("span", { cls: "tk-p", text: ": " }),
        ...codeValue(f.value),
        el("span", { cls: "tk-p", text: "," })
      ]));
    });
    lines.push(line([el("span", { cls: "tk-p", text: "};" })]));
    if (c.comment) lines.push(line([el("span", { cls: "tk-cm", text: c.comment }), el("span", { cls: "code-caret" })]));

    return el("div", { cls: "code-window tilt" }, [
      el("div", { cls: "code-bar" }, [
        el("span", { cls: "dot r" }), el("span", { cls: "dot y" }), el("span", { cls: "dot g" }),
        el("span", { cls: "code-file", text: c.file || "about.js" })
      ]),
      el("div", { cls: "code-body", attrs: { "aria-hidden": "true" } }, lines)
    ]);
  }

  function renderAbout() {
    mount("about", P.about && P.about.bio, () => {
      const left = el("div", { cls: "about-text stagger" });
      P.about.bio.forEach((t, i) => left.appendChild(el("p", { cls: i === 0 ? "lead" : "", text: t })));

      const facts = el("div", { cls: "facts" });
      (P.about.facts || []).forEach((f) => facts.appendChild(el("div", { cls: "fact spot" }, [
        icon(f.icon),
        el("div", {}, [el("small", { text: f.label }), el("strong", { text: f.value })])
      ])));
      left.appendChild(facts);

      const right = P.about.code ? codeWindow(P.about.code) : null;
      return el("div", { cls: "about-grid" }, [left, right]);
    });
  }

  /* ---------- MỤC TIÊU NGHỀ NGHIỆP ---------- */
  function renderGoal() {
    mount("goal", P.goal, () => {
      const g = P.goal;
      const steps = el("ol", { cls: "goal-steps stagger" });
      (g.steps || []).forEach((s, i) => {
        steps.appendChild(el("li", { cls: "goal-step spot", style: { "--n": String(i + 1) } }, [
          el("div", { cls: "goal-head" }, [
            el("span", { cls: "goal-icon" }, [icon(s.icon || "fa-flag")]),
            el("div", {}, [el("span", { cls: "goal-term", text: s.term }), el("span", { cls: "goal-time", text: s.time })])
          ]),
          el("h3", { text: s.title }),
          el("ul", {}, (s.points || []).map((p) => el("li", { text: p })))
        ]));
      });

      const values = el("ul", { cls: "value-chips stagger", attrs: { "aria-label": "Giá trị theo đuổi" } },
        (g.values || []).map((v) => el("li", {}, [icon("fa-check-circle"), v])));

      return el("div", {}, [
        el("blockquote", { cls: "goal-statement" }, [icon("fa-bullseye"), el("p", { text: g.statement })]),
        steps,
        values
      ]);
    });
  }

  /* ---------- CHUYÊN NGÀNH ---------- */
  function trackPanel(t) {
    const list = (title, items, ic) => el("div", { cls: "track-list" }, [
      el("h4", {}, [icon(ic), " " + title]),
      el("ul", {}, items.map((x) => el("li", { text: x })))
    ]);

    const side = el("div", { cls: "track-side" }, [
      el("h4", {}, [icon("fa-wrench"), " Công nghệ"]),
      el("div", { cls: "tags" }, (t.tech || []).map((x) => el("span", { cls: "tag", text: x })))
    ]);
    if (t.project) {
      side.appendChild(el("a", { cls: "track-link", href: "#projects" }, ["Xem dự án liên quan ", icon("fa-arrow-right")]));
    }

    return el("div", { cls: "track" }, [
      el("div", { cls: "track-main" }, [
        el("p", { cls: "track-summary", text: t.summary }),
        el("div", { cls: "track-cols" }, [
          list("Mình đã thực hành", t.done || [], "fa-check"),
          list("Định hướng tìm hiểu", t.learn || [], "fa-lightbulb-o")
        ])
      ]),
      side
    ]);
  }

  function renderSpecialization() {
    const S = P.specialization;
    mount("specialization", S && S.tracks, () => el("div", {}, [
      el("p", { cls: "lead-block", text: S.intro }),
      tabs(S.tracks.map((t) => ({ id: t.id, label: t.title, icon: t.icon, panel: trackPanel(t) })), "Các mảng chuyên ngành")
    ]));
  }

  /* ---------- HỌC VẤN & HOẠT ĐỘNG ---------- */
  function timeline(items) {
    return el("div", { cls: "timeline stagger" }, items.map((it) => el("div", { cls: "tl-item spot" }, [
      el("div", { cls: "tl-period", text: it.period }),
      el("h4", { text: it.title }),
      it.sub ? el("div", { cls: "tl-sub", text: it.sub }) : null,
      it.detail ? el("p", { cls: "tl-detail", text: it.detail }) : null
    ])));
  }

  function renderEducation() {
    mount("education", P.education, () => {
      const edu = P.education.map((e) => ({ period: e.period, title: e.school, sub: e.major, detail: e.detail }));
      const exp = (P.experience || []).map((e) => ({ period: e.period, title: e.title, sub: e.org, detail: e.detail }));
      const col = (title, ic, items) => el("div", { cls: "tl-col" }, [
        el("h3", { cls: "col-title" }, [el("span", { cls: "col-icon" }, [icon(ic)]), title]),
        timeline(items)
      ]);
      return el("div", { cls: "edu-grid" }, [
        col("Học vấn", "fa-graduation-cap", edu),
        exp.length ? col("Hoạt động & Kinh nghiệm", "fa-flag-checkered", exp) : null
      ]);
    });
  }

  /* ---------- KỸ NĂNG ---------- */
  function renderSkills() {
    mount("skills", P.skills, () => el("div", { cls: "skill-groups stagger" }, P.skills.map((g) =>
      el("div", { cls: "skill-card spot" }, [
        el("h3", {}, [el("span", { cls: "col-icon" }, [icon(g.icon || "fa-code")]), g.group]),
        ...g.items.map((s) => {
          const lvl = Math.max(0, Math.min(100, Number(s.level) || 0));
          return el("div", { cls: "skill" }, [
            el("div", { cls: "skill-top" }, [el("span", { text: s.name }), el("span", { text: lvl + "%" })]),
            el("div", { cls: "bar", attrs: { role: "progressbar", "aria-label": s.name, "aria-valuemin": "0", "aria-valuemax": "100", "aria-valuenow": String(lvl) } },
              [el("i", { style: { "--level": lvl + "%" } })])
          ]);
        })
      ])
    )));
  }

  /* ---------- DỰ ÁN (bộ lọc + modal chi tiết) ---------- */
  function projectModal(p) {
    const media = el("figure", { cls: "modal-media" + (p.fit === "contain" ? " is-contain" : "") });
    if (p.image) {
      const img = el("img", { attrs: { src: p.image, alt: p.title } });
      img.addEventListener("error", () => { img.remove(); media.appendChild(icon("fa-code")); });
      media.appendChild(img);
    } else media.appendChild(icon("fa-code"));

    return el("article", { cls: "project-detail" }, [
      media,
      el("div", { cls: "modal-text" }, [
        p.category ? el("span", { cls: "eyebrow", text: p.category }) : null,
        el("h3", { text: p.title }),
        el("p", { text: p.description }),
        (p.features || []).length ? el("h4", { text: "Tính năng chính" }) : null,
        (p.features || []).length ? el("ul", { cls: "check-list" }, p.features.map((f) => el("li", { text: f }))) : null,
        el("h4", { text: "Công nghệ sử dụng" }),
        el("div", { cls: "tags" }, (p.tags || []).map((t) => el("span", { cls: "tag", text: t }))),
        p.link ? el("a", { cls: "btn primary", href: p.link }, [icon("fa-github"), " Xem mã nguồn"]) : null
      ])
    ]);
  }

  function renderProjects() {
    mount("projects", P.projects, () => {
      const cats = Array.from(new Set(P.projects.map((p) => p.category).filter(Boolean)));
      const grid = el("div", { cls: "projects-grid" });
      const cards = P.projects.map((p) => {
        const imgBox = el("div", { cls: "project-img" + (p.fit === "contain" ? " is-contain" : "") });
        if (p.image) {
          const img = el("img", { attrs: { src: p.image, alt: p.title, loading: "lazy" } });
          img.addEventListener("error", () => { img.remove(); imgBox.appendChild(icon("fa-code")); });
          imgBox.appendChild(img);
        } else imgBox.appendChild(icon("fa-code"));

        const open = () => modal.open(projectModal(p));
        const card = el("article", { cls: "project tilt spot", attrs: { "data-cat": p.category || "" } }, [
          imgBox,
          el("div", { cls: "project-body" }, [
            p.category ? el("span", { cls: "eyebrow", text: p.category }) : null,
            el("h3", { text: p.title }),
            el("p", { text: p.description }),
            el("div", { cls: "tags" }, (p.tags || []).map((t) => el("span", { cls: "tag", text: t }))),
            el("div", { cls: "project-actions" }, [
              el("button", { cls: "btn small", attrs: { type: "button" }, on: { click: open } }, [icon("fa-info-circle"), " Chi tiết"]),
              p.link ? el("a", { cls: "btn small ghost", href: p.link, attrs: { "aria-label": "Mở " + p.title + " trên GitHub" } }, [icon("fa-github"), " GitHub"]) : null
            ])
          ])
        ]);
        grid.appendChild(card);
        return card;
      });

      const wrap = el("div", {});
      if (cats.length > 1) {
        const bar = el("div", { cls: "filter-bar", attrs: { role: "group", "aria-label": "Lọc dự án" } });
        ["Tất cả"].concat(cats).forEach((c, i) => {
          const btn = el("button", { cls: "filter-btn", text: c, attrs: { type: "button", "aria-pressed": String(i === 0) } });
          btn.addEventListener("click", () => {
            $$(".filter-btn", bar).forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
            cards.forEach((card) => {
              const show = i === 0 || card.dataset.cat === c;
              card.hidden = !show;
              if (show) { card.classList.remove("pop-in"); void card.offsetWidth; card.classList.add("pop-in"); }
            });
          });
          bar.appendChild(btn);
        });
        wrap.appendChild(bar);
      }
      wrap.appendChild(grid);
      return wrap;
    });
  }

  /* ---------- THÀNH TÍCH & CHỨNG CHỈ ---------- */
  function awardCard(a) {
    return el("div", { cls: "award spot" }, [
      el("div", { cls: "award-year", text: a.year }),
      el("div", {}, [
        el("h4", { text: a.title }),
        a.org ? el("div", { cls: "org", text: a.org }) : null,
        a.detail ? el("p", { text: a.detail }) : null
      ])
    ]);
  }

  function renderAwards() {
    mount("awards", P.awards, () => {
      const certs = P.certificates || [];
      const aiLearning = P.aiLearning || [];
      return el("div", {}, [
        el("h3", { cls: "sub-title" }, [icon("fa-trophy"), " Giải thưởng & thành tích"]),
        el("div", { cls: "awards-list stagger" }, P.awards.map(awardCard)),
        el("h3", { cls: "sub-title" }, [icon("fa-certificate"), " Chứng chỉ"]),
        certs.length
          ? el("div", { cls: "awards-list stagger" }, certs.map(awardCard))
          : el("div", { cls: "empty-card" }, [icon("fa-certificate"), el("p", { text: "Chưa có chứng chỉ." })]),
        aiLearning.length
          ? el("div", {}, [
            el("h3", { cls: "sub-title" }, [icon("fa-book"), " Đang tìm hiểu (chưa phải chứng chỉ)"]),
            el("div", { cls: "awards-list stagger" }, aiLearning.map(awardCard))
          ])
          : null
      ]);
    });
  }

  /* ---------- SỞ THÍCH & ẨM THỰC ---------- */
  function cards(items) {
    return el("div", { cls: "cards-grid stagger-pop" }, items.map((i) => el("div", { cls: "mini-card tilt spot" }, [
      el("div", { cls: "emoji", text: i.icon }),
      el("h3", { text: i.title }),
      el("p", { text: i.description })
    ])));
  }

  function renderInterests() {
    const sets = [
      { label: "Sở thích", icon: "fa-heart", items: P.hobbies },
      { label: "Món ăn yêu thích", icon: "fa-cutlery", items: P.foods }
    ].filter((s) => s.items && s.items.length);
    mount("interests", sets, () => tabs(sets.map((s) => ({ label: s.label, icon: s.icon, panel: cards(s.items) })), "Sở thích và món ăn"));
  }

  /* ---------- LIÊN HỆ ---------- */
  function renderContact() {
    const c = P.contact;
    const info = $("#contactInfo");
    if (!c) { $("#contact").hidden = true; return; }
    const title = $("#contact .section-title");
    if (title && P.sections.contact) title.textContent = P.sections.contact;

    const row = (ic, label, value, href) => el("li", {}, [
      el("span", { cls: "ci-icon" }, [icon(ic)]),
      el("div", {}, [el("small", { text: label }), href ? el("a", { href, text: value }) : el("span", { text: value })])
    ]);

    info.appendChild(el("h3", { text: c.heading || "Thông tin liên hệ" }));
    if (c.intro) info.appendChild(el("p", { text: c.intro }));
    const list = el("ul", { cls: "contact-list" });
    if (c.email) list.appendChild(row("fa-envelope", "Email", c.email, "mailto:" + c.email));
    if (c.phone) list.appendChild(row("fa-phone", "Điện thoại", c.phone, "tel:" + c.phone.replace(/\s/g, "")));
    if (c.location) list.appendChild(row("fa-map-marker", "Địa điểm", c.location));
    info.appendChild(list);

    if ((P.social || []).length) {
      info.appendChild(el("div", { cls: "social-row" }, P.social.map((s) =>
        el("a", { href: s.url, attrs: { "aria-label": s.label, title: s.label } }, [icon(s.icon)]))));
    }
  }

  /* ---------- NAVBAR, HUB, FOOTER ---------- */
  function renderChrome() {
    const brand = $("#brand");
    brand.append(P.name);
    brand.appendChild(el("span", { text: "." }));

    const nav = $("#navLinks");
    (P.nav || []).forEach((id) => {
      const sec = $("#" + id);
      if (!sec || sec.hidden) return;
      nav.appendChild(el("a", { href: "#" + id, text: (P.navLabels && P.navLabels[id]) || P.sections[id] }));
    });

    if (P.hub && P.hub.url) {
      const hubBtn = el("a", { cls: "hub-btn", href: P.hub.url, attrs: { title: P.hub.label || "Về Hub" } }, [
        icon("fa-th-large"), el("span", { text: " " + (P.hub.label || "Về Hub") })
      ]);
      $("#navActions").prepend(hubBtn);
    }

    const footer = $("#footer");
    footer.appendChild(el("p", { text: "© " + new Date().getFullYear() + " " + P.name + ". Mọi quyền được bảo lưu." }));
    if (P.hub && P.hub.url) footer.appendChild(el("a", { href: P.hub.url }, [icon("fa-th-large"), " " + (P.hub.label || "Về Hub")]));
  }

  document.title = P.siteTitle || P.name;
  renderHero();
  renderAbout();
  renderGoal();
  renderSpecialization();
  renderEducation();
  renderSkills();
  renderProjects();
  renderAwards();
  renderInterests();
  renderContact();
  // Gallery được dựng riêng trong gallery.js; menu cần đợi nó biết phần nào bị ẩn
  window.PF.renderChrome = renderChrome;
})();
