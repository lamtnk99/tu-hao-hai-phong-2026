(() => {
  "use strict";

  const DEADLINE_ISO = "2026-11-20T17:00:00+07:00";

  /**
   * 1) URL Web App Google Apps Script sau khi Deploy file google-apps-script.gs
   * Khi để trống "", form sẽ chạy chế độ xem trước và tạo phiếu xác nhận trên trình duyệt.
   */
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwyy7hsO6nbA9hwWiJ8EeqUjC3Z9S_-ufXeI1c_ht6taFP9B0AJF__xsjNCAPiKQd2IXg/exec";

  const DESIGN_MODELS = [
    {
      id: "bachdang",
      indexLabel: "MẪU 01 · DẤU ẤN BẠCH ĐẰNG",
      name: "Tự hào Hải Phòng — Dấu ấn Bạch Đằng",
      topic: "CHỦ ĐỀ 01 · LỊCH SỬ & TRUYỀN THỐNG CÁCH MẠNG",
      src: "./assets/mau-thiet-ke-dau-an-bach-dang.jpg",
      alt: "Phối cảnh 3D mẫu thiết kế Tự hào Hải Phòng - Dấu ấn Bạch Đằng",
      chips: [
        "🏛️ Vòm nhận diện gỗ & đại cảnh Ngô Quyền",
        "⛵ Sa bàn thuyền chiến trong tủ kính",
        "📜 Tranh đại cảnh & Niên biểu 938, 981, 1288",
        "📸 Khung check-in thuyền vượt sóng"
      ],
      desc: "Không gian mở 5m² – 10m² tái hiện hào khí Bạch Đằng giang với tranh tường lịch sử, bảng niên biểu 3 lần chiến thắng giặc ngoại xâm, sa bàn thuyền chiến và khung chụp ảnh check-in sáng tạo."
    },
    {
      id: "bienlon",
      indexLabel: "MẪU 02 · VƯƠN RA BIỂN LỚN",
      name: "Tự hào Hải Phòng — Vươn ra biển lớn",
      topic: "CHỦ ĐỀ 02 · VĂN HÓA XỨ ĐÔNG & THÀNH PHỐ CẢNG",
      src: "./assets/mau-thiet-ke-vuon-ra-bien-lon.jpg",
      alt: "Phối cảnh 3D mẫu thiết kế Tự hào Hải Phòng - Vươn ra biển lớn",
      chips: [
        "⚓ Vòm nhận diện bánh lái & tàu hàng",
        "🚢 Sa bàn cảng container & cẩu giàn STS",
        "🏝️ Infographic Di sản thiên nhiên vịnh Cát Bà",
        "📸 Khung check-in xanh dương ngọn hải đăng"
      ],
      desc: "Khai thác thế mạnh kinh tế biển với gam màu xanh đại dương, khắc họa vị thế cửa ngõ hàng hải quốc tế, trung tâm logistics hiện đại, Di sản thiên nhiên thế giới Cát Bà cùng sa bàn cảng biển sống động."
    },
    {
      id: "hoaphuong",
      indexLabel: "MẪU 03 · HOA PHƯỢNG ĐỎ",
      name: "Tự hào Hải Phòng — Thành phố Hoa Phượng Đỏ",
      topic: "CHỦ ĐỀ 03 · BẢN SẮC & DI SẢN KIẾN TRÚC",
      src: "./assets/mau-thiet-ke-thanh-pho-hoa-phuong-do.jpg",
      alt: "Phối cảnh 3D mẫu thiết kế Tự hào Hải Phòng - Thành phố Hoa Phượng Đỏ",
      chips: [
        "🌺 Vòm nhận diện hoa phượng & cẩu cảng",
        "🏛️ Mô hình mặt đứng Nhà hát Lớn hắt sáng",
        "📺 Màn hình trình chiếu cảnh sắc thành phố",
        "📸 Bục ghế ngồi check-in hoa phượng đỏ"
      ],
      desc: "Tôn vinh biểu tượng hoa phượng đỏ và công trình kiến trúc trăm năm Nhà hát Lớn Hải Phòng, tích hợp màn hình trình chiếu cảnh sắc thành phố năng động và sa bàn tàu biển kết hợp góc check-in."
    },
    {
      id: "sangtao",
      indexLabel: "MẪU 04 · NĂNG ĐỘNG, SÁNG TẠO",
      name: "Tự hào Hải Phòng — Hải Phòng Năng động, Sáng tạo",
      topic: "CHỦ ĐỀ 04 · TUỔI TRẺ & TƯƠNG TÁC SỐ",
      src: "./assets/mau-thiet-ke-hai-phong-sang-tao.jpg",
      alt: "Phối cảnh 3D mẫu thiết kế Tự hào Hải Phòng - Hải Phòng Năng động, Sáng tạo",
      chips: [
        "🗼 Vòm nhận diện hải đăng & hải âu",
        "🖥️ Màn hình TV tương tác & thuyết minh số",
        "💡 Bảng Giáo dục đổi mới sáng tạo & Kết nối",
        "📸 Sa bàn mica led cầu Hoàng Văn Thụ & check-in"
      ],
      desc: "Thiết kế hiện đại mang hơi thở công nghệ với màn hình TV tương tác số, sa bàn mica led phát sáng cầu Hoàng Văn Thụ, các bảng infographic giáo dục – khởi nghiệp và khung check-in mạng xã hội trẻ trung."
    }
  ];

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

  /* ---------------- 3D Design Samples Showcase ---------------- */
  let currentDesignIdx = 0;
  const designTabs = Array.from(document.querySelectorAll(".design-tab"));
  const showcaseMainImg = document.getElementById("showcaseMainImg");
  const showcaseBadgeText = document.getElementById("showcaseBadgeText");
  const designDetailTitle = document.getElementById("designDetailTitle");
  const designDetailTopic = document.getElementById("designDetailTopic");

  const designModal = document.getElementById("designModal");
  const designModalTitle = document.getElementById("designModalTitle");
  const designModalSubtitle = document.getElementById("designModalSubtitle");
  const designModalImg = document.getElementById("designModalImg");
  const designModalTopic = document.getElementById("designModalTopic");
  const designModalCounter = document.getElementById("designModalCounter");
  const prevDesignBtn = document.getElementById("prevDesignBtn");
  const nextDesignBtn = document.getElementById("nextDesignBtn");
  const openDesignModalBtn = document.getElementById("openDesignModalBtn");
  const showcaseImgWrap = document.getElementById("showcaseImgWrap");

  function renderDesignUI(idx, updateModal = false) {
    if (idx < 0 || idx >= DESIGN_MODELS.length) return;
    currentDesignIdx = idx;
    const model = DESIGN_MODELS[idx];

    // Update main stage
    if (showcaseMainImg) {
      showcaseMainImg.style.opacity = "0.4";
      setTimeout(() => {
        showcaseMainImg.src = model.src;
        showcaseMainImg.alt = model.alt;
        showcaseMainImg.style.opacity = "1";
      }, 120);
    }
    if (showcaseBadgeText) showcaseBadgeText.textContent = model.indexLabel;
    if (designDetailTitle) designDetailTitle.textContent = model.name;
    if (designDetailTopic) designDetailTopic.textContent = model.topic;

    // Update tab states
    designTabs.forEach((tab, i) => {
      const active = i === idx;
      tab.classList.toggle("active", active);
      tab.setAttribute("aria-selected", String(active));
    });

    // Update modal if open or requested
    if (designModalTitle) designModalTitle.textContent = model.name;
    if (designModalSubtitle) designModalSubtitle.textContent = model.name;
    if (designModalImg) {
      designModalImg.src = model.src;
      designModalImg.alt = model.alt;
    }
    if (designModalTopic) designModalTopic.textContent = model.topic;
    if (designModalCounter) designModalCounter.textContent = `${idx + 1} / ${DESIGN_MODELS.length}`;
  }

  function selectDesignById(id) {
    const foundIdx = DESIGN_MODELS.findIndex((m) => m.id === id);
    if (foundIdx !== -1) {
      renderDesignUI(foundIdx);
    }
  }

  designTabs.forEach((tab, idx) => {
    tab.addEventListener("click", () => renderDesignUI(idx));
  });

  // Brief cards in #noi-dung linking to design models
  document.querySelectorAll("[data-select-design]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const designId = btn.getAttribute("data-select-design");
      selectDesignById(designId);
      const targetSec = document.getElementById("yeu-cau");
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: "smooth", block: "start" });
        const sc = document.getElementById("designShowcase");
        if (sc) {
          sc.classList.remove("highlight-flash");
          void sc.offsetWidth; // trigger reflow
          sc.classList.add("highlight-flash");
        }
      }
    });
  });

  /* ---------------- Modals (Poster Lightbox, Design Modal & Receipt) ---------------- */
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

  const openPosterImgBtn = document.getElementById("openPosterImgBtn");
  if (openPosterImgBtn) {
    openPosterImgBtn.addEventListener("click", () => openDialog(posterModal));
  }

  if (openDesignModalBtn) {
    openDesignModalBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      renderDesignUI(currentDesignIdx);
      openDialog(designModal);
    });
  }

  if (showcaseImgWrap) {
    showcaseImgWrap.addEventListener("click", () => {
      renderDesignUI(currentDesignIdx);
      openDialog(designModal);
    });
  }

  if (prevDesignBtn) {
    prevDesignBtn.addEventListener("click", () => {
      const prev = (currentDesignIdx - 1 + DESIGN_MODELS.length) % DESIGN_MODELS.length;
      renderDesignUI(prev);
    });
  }

  if (nextDesignBtn) {
    nextDesignBtn.addEventListener("click", () => {
      const next = (currentDesignIdx + 1) % DESIGN_MODELS.length;
      renderDesignUI(next);
    });
  }

  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-close-modal");
      closeDialog(document.getElementById(id));
    });
  });

  [posterModal, designModal, receiptModal].forEach((dlg) => {
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

  // Modal keyboard navigation
  window.addEventListener("keydown", (e) => {
    if (designModal && designModal.open) {
      if (e.key === "ArrowLeft") {
        const prev = (currentDesignIdx - 1 + DESIGN_MODELS.length) % DESIGN_MODELS.length;
        renderDesignUI(prev);
      } else if (e.key === "ArrowRight") {
        const next = (currentDesignIdx + 1) % DESIGN_MODELS.length;
        renderDesignUI(next);
      }
    }
  });

  /* ---------------- Registration & Submission Form ---------------- */
  const form = document.getElementById("registrationForm");
  const entryRadios = Array.from(document.querySelectorAll('input[name="entryType"]'));
  const groupNameField = document.getElementById("groupNameField");
  const memberCountField = document.getElementById("memberCountField");
  const memberListField = document.getElementById("memberListField");
  const leaderNameLabel = document.getElementById("leaderNameLabel");
  const regGroupName = document.getElementById("regGroupName");
  const submitBtn = document.getElementById("submitBtn");
  const submitBtnLabel = document.getElementById("submitBtnLabel");
  const formGlobalError = document.getElementById("formGlobalError");

  function syncEntryTypeUI() {
    const selected = document.querySelector('input[name="entryType"]:checked');
    const isGroup = !selected || selected.value === "group";

    [groupNameField, memberCountField, memberListField].forEach((el) => {
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

  function validateHttpUrl(value) {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  }

  function validateAgeAtLeast15(dobStr) {
    if (!dobStr) return false;
    const parts = dobStr.split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return false;
    const [year, month, day] = parts;
    const cutoffYear = 2026;
    const cutoffMonth = 11;
    const cutoffDay = 20;
    let age = cutoffYear - year;
    if (cutoffMonth < month || (cutoffMonth === month && cutoffDay < day)) {
      age -= 1;
    }
    return age >= 15;
  }

  let lastReceiptText = "";

  function setSubmitting(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.classList.toggle("is-loading", loading);
    if (submitBtnLabel) {
      submitBtnLabel.textContent = loading
        ? "ĐANG GỬI HỒ SƠ DỰ THI..."
        : "NỘP HỒ SƠ DỰ THI";
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
      const dob = document.getElementById("regDob").value.trim();
      const phone = document.getElementById("regPhone").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const unit = document.getElementById("regUnit").value.trim();
      const members = document.getElementById("regMembers").value.trim();

      const projectName = document.getElementById("regProjectName").value.trim();
      const entryIndex = document.getElementById("regEntryIndex").value;
      const dimensions = document.getElementById("regDimensions").value;
      const folderUrl = document.getElementById("regFolderUrl").value.trim();
      const videoUrl = document.getElementById("regVideoUrl").value.trim();
      const aiUsage = document.getElementById("regAiUsage").value.trim();
      const consent = document.getElementById("regConsent").checked;

      if (isGroup && groupName.length < 2) {
        setError("regGroupName", "errGroupName", "Vui lòng nhập tên nhóm dự thi.");
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

      if (!dob) {
        setError("regDob", "errDob", "Vui lòng chọn ngày sinh để đối chiếu điều kiện dự thi.");
        valid = false;
      } else if (!validateAgeAtLeast15(dob)) {
        setError("regDob", "errDob", "Thí sinh phải từ đủ 15 tuổi trở lên tính đến hạn nhận bài 20/11/2026.");
        valid = false;
      } else {
        setError("regDob", "errDob", "");
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
      } else if (
        /^(đoàn(\s+thanh\s+niên)?\s*(xã\s*[/,]\s*phường|xã\s+phường|đặc\s+khu)?(\s+tp\.?\s*hải\s*phòng)?)$/i.test(unit) ||
        unit.toLowerCase().includes("xã / phường / đặc khu") ||
        unit.toLowerCase() === "đoàn xã/phường" ||
        unit.toLowerCase() === "đoàn xã" ||
        unit.toLowerCase() === "đoàn phường"
      ) {
        setError("regUnit", "errUnit", "Vui lòng ghi rõ tên xã, phường hoặc trường cụ thể (Ví dụ: Đoàn phường Hạ Lý, Đoàn xã An Đồng...).");
        valid = false;
      } else {
        setError("regUnit", "errUnit", "");
      }

      if (projectName.length < 3) {
        setError("regProjectName", "errProjectName", "Vui lòng nhập tên mô hình hoặc phương án dự thi.");
        valid = false;
      } else {
        setError("regProjectName", "errProjectName", "");
      }

      if (!validateHttpUrl(folderUrl)) {
        setError("regFolderUrl", "errFolderUrl", "Vui lòng dán đường dẫn http:// hoặc https:// hợp lệ (mở quyền xem cho BTC).");
        valid = false;
      } else {
        setError("regFolderUrl", "errFolderUrl", "");
      }

      if (videoUrl && !validateHttpUrl(videoUrl)) {
        setError("regVideoUrl", "errVideoUrl", "Link video không hợp lệ (cần bắt đầu bằng http:// hoặc https://).");
        valid = false;
      } else {
        setError("regVideoUrl", "errVideoUrl", "");
      }

      const errConsent = document.getElementById("errConsent");
      if (!consent) {
        if (errConsent) errConsent.textContent = "Vui lòng xác nhận cam kết bản quyền, tiêu chuẩn kỹ thuật và Thể lệ.";
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
            dob,
            phone,
            email,
            unit,
            members: isGroup ? members : "",
            projectName,
            entryIndex,
            dimensions,
            folderUrl,
            videoUrl,
            aiUsage,
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
        ["Mã hồ sơ", code],
        ["Tên phương án", `${projectName} (${entryIndex})`],
        ["Quy mô mô hình", dimensions],
        ["Hình thức", entryLabel],
        [isGroup ? "Trưởng nhóm" : "Thí sinh", `${leaderName} (${dob})`],
        ["Liên hệ", `${phone} · ${email}`],
        ["Đơn vị", unit],
        ["Link hồ sơ", folderUrl]
      ];
      if (videoUrl) rows.push(["Link video", videoUrl]);
      if (aiUsage) rows.push(["Công cụ AI", aiUsage]);

      const rcCode = document.getElementById("rcCode");
      const receiptDetails = document.getElementById("receiptDetails");
      const receiptFeedback = document.getElementById("receiptFeedback");
      if (rcCode) rcCode.textContent = code;
      if (receiptFeedback) {
        receiptFeedback.textContent = syncedToSheet
          ? "Hồ sơ dự thi đã được ghi trực tiếp vào Google Sheet của Ban Tổ chức!"
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
        `PHIẾU ĐĂNG KÝ & XÁC NHẬN NỘP HỒ SƠ — TỰ HÀO HẢI PHÒNG 2026\n` +
        `============================================================\n` +
        rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
        `\nThời điểm nộp hồ sơ: ${new Date().toLocaleString("vi-VN")}\n`;

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
