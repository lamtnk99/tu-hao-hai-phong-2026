(() => {
  "use strict";

  const DEADLINE_ISO = "2026-11-20T17:00:00+07:00";

  /**
   * 1) Dán URL Web App Google Apps Script vào đây sau khi Deploy file google-apps-script.gs
   * Ví dụ: "https://script.google.com/macros/s/AKfycb.../exec"
   * Khi để trống "", form sẽ chạy chế độ xem trước và tạo phiếu xác nhận trên trình duyệt.
   */
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxSE5ZhbKHU2UGREUPQEvOsRrjFeNigbao6IcFaV8hxuBRXjbFo3ETKl_65uNzREv2Z3Q/exec";

  /**
   * 2) (Cập nhật sau) Dán link Cổng nộp hồ sơ Sơ khảo riêng (Google Form / Link nộp bài) vào đây
   * khi Ban Tổ chức mở đợt thu bài chính thức. Để trống "" nếu chưa mở link.
   */
  const SUBMISSION_PORTAL_URL = "";

  const PILLAR_CONTENT = {
    identity: {
      title: "Điểm nhận diện “Tự hào Hải Phòng”:",
      text: "Thể hiện tên, chủ đề, infographic, biểu tượng hoa phượng, cầu cảng hoặc yếu tố đặc trưng của thành phố để tạo dấu ấn tổng thể."
    },
    display: {
      title: "Nội dung trưng bày đa chất liệu:",
      text: "Kết hợp tranh, ảnh, bản đồ, infographic, hiện vật, sa bàn (1:10–1:20) hoặc sản phẩm mỹ thuật kể câu chuyện Hải Phòng lịch sử – hôm nay – tương lai."
    },
    checkin: {
      title: "Điểm check-in lan tỏa:",
      text: "Bố trí góc chụp ảnh thẩm mỹ, thoáng mở trong diện tích 5m²–10m² để đoàn viên, sinh viên và khách tham quan lưu lại khoảnh khắc và chia sẻ rộng rãi."
    },
    digital: {
      title: "Tương tác & trải nghiệm số:",
      text: "Tích hợp mã QR, video thuyết minh, bản đồ số hoặc nội dung tương tác đa phương tiện giúp tăng khả năng tiếp cận thông tin chính thống."
    },
    green: {
      title: "Vật liệu xanh & kết cấu module:",
      text: "Ưu tiên vật liệu thân thiện môi trường, tái sử dụng, kết cấu module gọn nhẹ dễ thi công, tháo lắp và linh hoạt nhân rộng tại nhiều trường học."
    }
  };

  /* ---------------- Scroll Progress & Header State ---------------- */
  const progressBar = document.getElementById("pageProgress");
  const header = document.getElementById("siteHeader");
  const navLinks = Array.from(document.querySelectorAll("#navMenu a[data-scroll]"));
  const sections = navLinks
    .map((a) => document.getElementById(a.getAttribute("data-scroll")))
    .filter(Boolean);

  function updateScrollUI() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar && docHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      progressBar.style.width = `${pct.toFixed(2)}%`;
    }
    if (header) {
      header.classList.toggle("scrolled", scrollTop > 16);
    }

    // Active section highlight
    let currentId = "top";
    const offset = 140;
    for (const sec of sections) {
      const top = sec.getBoundingClientRect().top;
      if (top <= offset) {
        currentId = sec.id;
      }
    }
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("data-scroll") === currentId);
    });
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  /* ---------------- Mobile Menu & Smooth Navigation ---------------- */
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  function closeMenu() {
    if (!navMenu || !menuToggle) return;
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", (e) => {
      if (navMenu.classList.contains("open") && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
      }
    });
  }

  const revealEls = Array.from(document.querySelectorAll(".reveal"));

  function checkRevealInView() {
    const triggerBottom = window.innerHeight + 140;
    revealEls.forEach((el) => {
      if (el.classList.contains("visible")) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < triggerBottom) {
        el.classList.add("visible");
      }
    });
  }

  document.querySelectorAll("[data-scroll]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const targetId = el.getAttribute("data-scroll");
      const targetEl = targetId ? document.getElementById(targetId) : null;
      if (!targetEl) return;
      e.preventDefault();
      closeMenu();
      targetEl.querySelectorAll(".reveal").forEach((r) => r.classList.add("visible"));
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      targetEl.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    });
  });

  /* ---------------- Reveal on Scroll ---------------- */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "140px 0px 140px 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
    window.addEventListener("scroll", checkRevealInView, { passive: true });
    checkRevealInView();
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------------- Live Countdown Timer ---------------- */
  const cdDays = document.getElementById("cdDays");
  const cdHours = document.getElementById("cdHours");
  const cdMins = document.getElementById("cdMins");
  const cdSecs = document.getElementById("cdSecs");
  const countdownStatus = document.getElementById("countdownStatus");
  const targetMs = new Date(DEADLINE_ISO).getTime();

  function pad(n) {
    return String(Math.max(0, Math.floor(n))).padStart(2, "0");
  }

  function tickCountdown() {
    if (!cdDays || !cdHours || !cdMins || !cdSecs) return;
    const diff = targetMs - Date.now();
    if (diff <= 0) {
      cdDays.textContent = "00";
      cdHours.textContent = "00";
      cdMins.textContent = "00";
      cdSecs.textContent = "00";
      if (countdownStatus) {
        countdownStatus.textContent = "ĐÃ ĐÓNG CỔNG SƠ KHẢO // CHỜ CHẤM CHỌN TOP 10";
      }
      return;
    }
    const secTotal = Math.floor(diff / 1000);
    const days = Math.floor(secTotal / 86400);
    const hours = Math.floor((secTotal % 86400) / 3600);
    const mins = Math.floor((secTotal % 3600) / 60);
    const secs = secTotal % 60;

    cdDays.textContent = pad(days);
    cdHours.textContent = pad(hours);
    cdMins.textContent = pad(mins);
    cdSecs.textContent = pad(secs);
  }

  tickCountdown();
  setInterval(tickCountdown, 1000);

  /* ---------------- 5-Pillar Space Tabs ---------------- */
  const pillarTabs = Array.from(document.querySelectorAll(".pillar-tab"));
  const pillarDetail = document.getElementById("pillarDetail");

  pillarTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.getAttribute("data-pillar");
      const info = key ? PILLAR_CONTENT[key] : null;
      if (!info || !pillarDetail) return;

      pillarTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", String(active));
      });
      pillarDetail.replaceChildren();
      const strong = document.createElement("strong");
      strong.textContent = info.title + " ";
      pillarDetail.appendChild(strong);
      pillarDetail.appendChild(document.createTextNode(info.text));
    });
  });

  /* ---------------- Modals (Poster Lightbox & Receipt) ---------------- */
  const posterModal = document.getElementById("posterModal");
  const receiptModal = document.getElementById("receiptModal");

  function openDialog(dlg) {
    if (!dlg) return;
    if (typeof dlg.showModal === "function") {
      dlg.showModal();
    } else {
      dlg.setAttribute("open", "");
    }
  }

  function closeDialog(dlg) {
    if (!dlg) return;
    if (typeof dlg.close === "function" && dlg.open) {
      dlg.close();
    } else {
      dlg.removeAttribute("open");
    }
  }

  ["openPosterBtn", "openPosterImgBtn", "openShowcasePosterBtn"].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => openDialog(posterModal));
    }
  });

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close-modal");
      closeDialog(document.getElementById(id));
    });
  });

  [posterModal, receiptModal].forEach((dlg) => {
    if (!dlg) return;
    dlg.addEventListener("click", (e) => {
      const rect = dlg.getBoundingClientRect();
      const inside =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!inside) closeDialog(dlg);
    });
  });

  /* ---------------- Registration Form & Validation ---------------- */
  const form = document.getElementById("registrationForm");
  const entryRadios = Array.from(document.querySelectorAll('input[name="entryType"]'));
  const groupNameField = document.getElementById("groupNameField");
  const memberCountField = document.getElementById("memberCountField");
  const leaderNameLabel = document.getElementById("leaderNameLabel");
  const regGroupName = document.getElementById("regGroupName");
  const submitBtn = document.getElementById("submitBtn");
  const submitBtnLabel = document.getElementById("submitBtnLabel");
  const formGlobalError = document.getElementById("formGlobalError");
  const submissionPortalBtn = document.getElementById("submissionPortalBtn");
  const submissionPortalDesc = document.getElementById("submissionPortalDesc");
  const receiptPortalBtn = document.getElementById("receiptPortalBtn");

  // Nếu đã cấu hình link Cổng nộp hồ sơ Sơ khảo riêng, tự động kích hoạt nút mở link
  if (SUBMISSION_PORTAL_URL.trim()) {
    const portalHref = SUBMISSION_PORTAL_URL.trim();
    if (submissionPortalBtn) {
      submissionPortalBtn.href = portalHref;
      submissionPortalBtn.target = "_blank";
      submissionPortalBtn.rel = "noopener noreferrer";
      submissionPortalBtn.removeAttribute("data-scroll");
      submissionPortalBtn.textContent = "Mở cổng nộp hồ sơ ↗";
    }
    if (submissionPortalDesc) {
      submissionPortalDesc.innerHTML =
        'Đã hoàn thiện Bản thuyết minh (≤ 05 trang A4) &amp; Phối cảnh? Gửi hồ sơ Sơ khảo qua cổng tiếp nhận chính thức trước <strong>17h00 · 20/11/2026</strong>.';
    }
    if (receiptPortalBtn) {
      receiptPortalBtn.href = portalHref;
      receiptPortalBtn.hidden = false;
    }
  }

  function syncEntryTypeUI() {
    const selected = document.querySelector('input[name="entryType"]:checked');
    const isGroup = !selected || selected.value === "group";

    [groupNameField, memberCountField].forEach((el) => {
      if (el) el.classList.toggle("hidden-field", !isGroup);
    });
    if (regGroupName) {
      regGroupName.required = isGroup;
      if (!isGroup) {
        regGroupName.classList.remove("invalid");
        const err = document.getElementById("errGroupName");
        if (err) err.textContent = "";
      }
    }
    if (leaderNameLabel) {
      leaderNameLabel.innerHTML = isGroup
        ? 'Họ và tên Trưởng nhóm <span class="req">*</span>'
        : 'Họ và tên Thí sinh <span class="req">*</span>';
    }
  }

  entryRadios.forEach((r) => r.addEventListener("change", syncEntryTypeUI));
  syncEntryTypeUI();

  function setError(inputId, errId, msg) {
    const input = document.getElementById(inputId);
    const err = document.getElementById(errId);
    if (input) input.classList.toggle("invalid", Boolean(msg));
    if (err) err.textContent = msg || "";
  }

  let lastReceiptText = "";

  function setSubmitting(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle("is-loading", loading);
    if (submitBtnLabel) {
      submitBtnLabel.textContent = loading
        ? "ĐANG ĐỒNG BỘ ĐĂNG KÝ..."
        : "XÁC NHẬN ĐĂNG KÝ THAM GIA";
    }
  }

  function showGlobalError(msg) {
    if (!formGlobalError) return;
    formGlobalError.textContent = msg || "";
    formGlobalError.hidden = !msg;
  }

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      showGlobalError("");
      let valid = true;

      const selectedType = document.querySelector('input[name="entryType"]:checked')?.value || "group";
      const isGroup = selectedType === "group";

      const groupName = document.getElementById("regGroupName").value.trim();
      const memberCount = document.getElementById("regMemberCount").value;
      const leaderName = document.getElementById("regLeaderName").value.trim();
      const phone = document.getElementById("regPhone").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const unit = document.getElementById("regUnit").value.trim();
      const consent = document.getElementById("regConsent").checked;

      if (isGroup && groupName.length < 2) {
        setError("regGroupName", "errGroupName", "Vui lòng nhập tên nhóm dự kiến.");
        valid = false;
      } else {
        setError("regGroupName", "errGroupName", "");
      }

      if (leaderName.length < 2) {
        setError("regLeaderName", "errLeaderName", "Vui lòng nhập họ và tên đầy đủ.");
        valid = false;
      } else {
        setError("regLeaderName", "errLeaderName", "");
      }

      if (!/^0\d{9,10}$/.test(phone)) {
        setError("regPhone", "errPhone", "Số điện thoại hợp lệ gồm 10–11 chữ số, bắt đầu bằng số 0.");
        valid = false;
      } else {
        setError("regPhone", "errPhone", "");
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("regEmail", "errEmail", "Vui lòng nhập địa chỉ email hợp lệ.");
        valid = false;
      } else {
        setError("regEmail", "errEmail", "");
      }

      if (unit.length < 2) {
        setError("regUnit", "errUnit", "Vui lòng nhập đơn vị hoặc trường học của bạn.");
        valid = false;
      } else {
        setError("regUnit", "errUnit", "");
      }

      const errConsent = document.getElementById("errConsent");
      if (!consent) {
        if (errConsent) errConsent.textContent = "Vui lòng xác nhận điều kiện tham gia và tuân thủ Thể lệ.";
        valid = false;
      } else if (errConsent) {
        errConsent.textContent = "";
      }

      if (!valid) {
        const firstInvalid = form.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      let code = "HP26-" + Math.floor(1000 + Math.random() * 9000);
      let syncedToSheet = false;

      if (GOOGLE_SCRIPT_URL.trim()) {
        setSubmitting(true);
        try {
          const payload = {
            code,
            entryType: selectedType,
            groupName: isGroup ? groupName : "",
            memberCount: isGroup ? memberCount : "1",
            leaderName,
            phone,
            email,
            unit,
            consent
          };

          const response = await fetch(GOOGLE_SCRIPT_URL.trim(), {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload),
            redirect: "follow"
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          const result = await response.json();
          if (!result || !result.ok) {
            throw new Error((result && result.error) || "Phản hồi không hợp lệ từ Google Sheet.");
          }
          if (result.code) code = result.code;
          syncedToSheet = true;
        } catch (err) {
          setSubmitting(false);
          showGlobalError(
            "Không thể kết nối tới Google Sheet lúc này (" +
              (err.message || "Lỗi mạng") +
              "). Vui lòng kiểm tra kết nối mạng hoặc thử lại sau ít phút."
          );
          return;
        } finally {
          setSubmitting(false);
        }
      }

      const entryLabel = isGroup ? `Nhóm (${memberCount} thành viên) — ${groupName}` : "Thí sinh cá nhân";
      const rows = [
        ["Mã đăng ký", code],
        ["Hình thức", entryLabel],
        [isGroup ? "Trưởng nhóm" : "Thí sinh", leaderName],
        ["Liên hệ", `${phone} · ${email}`],
        ["Đơn vị", unit],
        ["Bước tiếp theo", "Nộp hồ sơ Sơ khảo trước 17h00 · 20/11/2026"]
      ];

      const rcCode = document.getElementById("rcCode");
      const receiptDetails = document.getElementById("receiptDetails");
      const receiptFeedback = document.getElementById("receiptFeedback");
      if (rcCode) rcCode.textContent = code;
      if (receiptFeedback) {
        receiptFeedback.textContent = syncedToSheet
          ? "Đăng ký đã được ghi trực tiếp vào Google Sheet của Ban Tổ chức!"
          : "Chế độ xem trước (chưa cấu hình GOOGLE_SCRIPT_URL): Phiếu tạo tạm trên trình duyệt.";
      }

      if (receiptDetails) {
        receiptDetails.replaceChildren();
        rows.forEach(([label, value]) => {
          const wrap = document.createElement("div");
          wrap.className = "receipt-row";
          const dt = document.createElement("dt");
          dt.textContent = label;
          const dd = document.createElement("dd");
          dd.textContent = value;
          wrap.append(dt, dd);
          receiptDetails.appendChild(wrap);
        });
      }

      lastReceiptText =
        `PHIẾU XÁC NHẬN ĐĂNG KÝ — TỰ HÀO HẢI PHÒNG 2026\n` +
        `==================================================\n` +
        rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
        `\nThời điểm tạo phiếu: ${new Date().toLocaleString("vi-VN")}\n`;

      try {
        localStorage.setItem("tu_hao_hp_2026_last_registration", JSON.stringify({ code, rows }));
      } catch {
        // Bỏ qua nếu localStorage bị giới hạn
      }

      openDialog(receiptModal);
    });
  }

  const copyReceiptBtn = document.getElementById("copyReceiptBtn");
  const downloadReceiptBtn = document.getElementById("downloadReceiptBtn");
  const receiptFeedback = document.getElementById("receiptFeedback");

  if (copyReceiptBtn) {
    copyReceiptBtn.addEventListener("click", async () => {
      if (!lastReceiptText) return;
      try {
        await navigator.clipboard.writeText(lastReceiptText);
        if (receiptFeedback) receiptFeedback.textContent = "Đã sao chép tóm tắt hồ sơ vào bộ nhớ tạm!";
      } catch {
        if (receiptFeedback) receiptFeedback.textContent = "Không thể tự động sao chép, vui lòng dùng nút Tải phiếu (.txt).";
      }
    });
  }

  if (downloadReceiptBtn) {
    downloadReceiptBtn.addEventListener("click", () => {
      if (!lastReceiptText) return;
      const blob = new Blob([lastReceiptText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "phieu-dang-ky-tu-hao-hai-phong-2026.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      if (receiptFeedback) receiptFeedback.textContent = "Đã tải xuống phiếu xác nhận dự thi.";
    });
  }
})();
