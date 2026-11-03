/* =====================================================================
   form.js — kiểm tra dữ liệu form liên hệ bằng JavaScript.
   Trang tĩnh không có máy chủ nên khi hợp lệ, form mở ứng dụng email
   của người gửi với nội dung đã điền sẵn (mailto) gửi tới email trong content.js.
   Bạn KHÔNG cần sửa file này.
   ===================================================================== */
(function () {
  "use strict";

  const { P, $, $$ } = window.PF;
  const form = $("#contactForm");
  if (!form) return;

  const status = $("#formStatus");
  const counter = $("#cMessage-count");
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* Mỗi trường: hàm trả về chuỗi lỗi, hoặc "" nếu hợp lệ */
  const rules = {
    name(v) {
      if (!v) return "Vui lòng nhập họ và tên.";
      if (v.length < 2) return "Họ và tên cần ít nhất 2 ký tự.";
      if (/\d/.test(v)) return "Họ và tên không nên chứa chữ số.";
      return "";
    },
    email(v) {
      if (!v) return "Vui lòng nhập email.";
      if (!EMAIL_RE.test(v)) return "Email chưa đúng định dạng (ví dụ: ban@example.com).";
      return "";
    },
    subject(v) {
      if (!v) return "Vui lòng nhập chủ đề.";
      if (v.length < 3) return "Chủ đề cần ít nhất 3 ký tự.";
      return "";
    },
    message(v) {
      if (!v) return "Vui lòng nhập lời nhắn.";
      if (v.length < 10) return "Lời nhắn cần ít nhất 10 ký tự (hiện có " + v.length + ").";
      return "";
    }
  };

  function validate(field) {
    const input = form.elements[field];
    const msg = rules[field](input.value.trim());
    const err = $("#" + input.id + "-err");
    err.textContent = msg;
    input.classList.toggle("invalid", !!msg);
    input.classList.toggle("valid", !msg && input.value.trim() !== "");
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
  }

  Object.keys(rules).forEach((field) => {
    const input = form.elements[field];
    input.addEventListener("blur", () => validate(field));
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid") || input.classList.contains("valid")) validate(field);
      if (field === "message") counter.textContent = input.value.length + "/" + input.maxLength;
    });
  });

  function setStatus(text, type) {
    status.textContent = text;
    status.className = "form-status " + (type || "");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map((f) => ({ f, ok: validate(f) }));
    const firstBad = results.find((r) => !r.ok);
    if (firstBad) {
      form.elements[firstBad.f].focus();
      setStatus("Vui lòng kiểm tra lại các trường được đánh dấu đỏ.", "error");
      return;
    }

    const data = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      subject: form.elements.subject.value.trim(),
      message: form.elements.message.value.trim()
    };
    const to = (P.contact && P.contact.email) || "";
    const body = data.message + "\n\n— " + data.name + " (" + data.email + ")";
    const href = "mailto:" + to + "?subject=" + encodeURIComponent(data.subject) + "&body=" + encodeURIComponent(body);

    setStatus("Cảm ơn " + data.name + "! Đang mở ứng dụng email để bạn gửi lời nhắn…", "success");
    window.location.href = href;

    form.reset();
    counter.textContent = "0/" + form.elements.message.maxLength;
    $$("input, textarea", form).forEach((n) => { n.classList.remove("valid", "invalid"); n.removeAttribute("aria-invalid"); });
  });
})();
