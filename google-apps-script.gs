/**
 * GOOGLE APPS SCRIPT — TIẾP NHẬN HỒ SƠ DỰ THI VÒNG SƠ KHẢO
 * Cuộc thi Thiết kế Mô hình "Tự hào Hải Phòng" năm 2026
 * ------------------------------------------------------------------
 * Cách cài đặt / cập nhật Web App:
 * 1) Mở Google Sheet của Ban Tổ chức -> Tiện ích mở rộng -> Apps Script.
 * 2) Dán toàn bộ nội dung file này vào Code.gs -> Lưu (Ctrl+S).
 * 3) (Tùy chọn) Chạy thử hàm setupSheet() để tạo tab "HoSoDuThi_2026" & tiêu đề cột.
 * 4) Chọn Triển khai -> Quản lý các bản triển khai -> biểu tượng bút chì ->
 *    Phiên bản: "Phiên bản mới" -> Triển khai (giữ nguyên URL Web App hiện tại).
 */

const SHEET_NAME = "HoSoDuThi_2026";

const HEADERS = [
  "Thời gian nộp",
  "Mã hồ sơ",
  "Hình thức",
  "Tên nhóm",
  "Số thành viên",
  "Trưởng nhóm / Thí sinh",
  "Ngày sinh",
  "Số điện thoại",
  "Email",
  "Đơn vị / Trường học",
  "Thành viên cùng nhóm",
  "Tên phương án",
  "Thứ tự phương án",
  "Quy mô diện tích",
  "Link thư mục hồ sơ",
  "Link video thuyết minh",
  "Khai báo công cụ AI",
  "Cam kết Thể lệ"
];

/**
 * Ngăn chặn lỗi/tấn công Google Sheets formula injection nếu người dùng nhập =, +, -, @ ở đầu ô.
 */
function sanitizeCell(value) {
  const str = String(value || "").trim();
  if (!str) return "";
  if (/^[=+\-@\t\r]/.test(str)) {
    return "'" + str;
  }
  return str;
}

/**
 * Tạo hoặc chuẩn hóa sheet tiếp nhận hồ sơ với 18 cột chính thức.
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange
      .setFontWeight("bold")
      .setBackground("#093795")
      .setFontColor("#ffffff")
      .setVerticalAlignment("middle")
      .setWrap(true);
    sheet.setFrozenRows(1);
    sheet.setRowHeight(1, 38);

    const widths = [165, 115, 115, 180, 110, 185, 110, 125, 200, 220, 230, 220, 125, 185, 280, 240, 210, 120];
    widths.forEach((w, idx) => sheet.setColumnWidth(idx + 1, w));
  }
  return sheet;
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Kiểm tra trạng thái hoạt động của endpoint Web App.
 */
function doGet() {
  const sheet = setupSheet();
  const totalSubmissions = Math.max(0, sheet.getLastRow() - 1);
  return jsonResponse({
    ok: true,
    service: "TuHaoHaiPhong2026-SubmissionAPI",
    sheet: SHEET_NAME,
    totalSubmissions
  });
}

/**
 * Tiếp nhận dữ liệu nộp hồ sơ Sơ khảo trực tiếp từ landing page.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);

    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "{}";
    const data = JSON.parse(raw);

    const entryType = data.entryType === "individual" ? "Cá nhân" : "Nhóm";
    const groupName = entryType === "Nhóm" ? String(data.groupName || "").trim() : "";
    const memberCount = entryType === "Nhóm" ? String(data.memberCount || "2").trim() : "1";
    const leaderName = String(data.leaderName || "").trim();
    const dob = String(data.dob || "").trim();
    const phone = String(data.phone || "").trim();
    const email = String(data.email || "").trim();
    const unit = String(data.unit || "").trim();
    const members = entryType === "Nhóm" ? String(data.members || "").trim() : "";

    const projectName = String(data.projectName || "").trim();
    const entryIndex = String(data.entryIndex || "Phương án 01").trim();
    const dimensions = String(data.dimensions || "").trim();
    const folderUrl = String(data.folderUrl || "").trim();
    const videoUrl = String(data.videoUrl || "").trim();
    const aiUsage = String(data.aiUsage || "").trim();
    const consent = data.consent ? "Đã cam kết" : "Chưa xác nhận";

    if (!leaderName || !dob || !phone || !email || !unit || !projectName || !folderUrl) {
      return jsonResponse({ ok: false, error: "Thiếu thông tin bắt buộc trong hồ sơ dự thi." });
    }
    if (!/^https?:\/\//i.test(folderUrl)) {
      return jsonResponse({ ok: false, error: "Link thư mục hồ sơ phải bắt đầu bằng http:// hoặc https://." });
    }
    if (videoUrl && !/^https?:\/\//i.test(videoUrl)) {
      return jsonResponse({ ok: false, error: "Link video thuyết minh phải bắt đầu bằng http:// hoặc https://." });
    }

    const sheet = setupSheet();
    const nowText = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    const code = String(data.code || ("HP26-" + Math.floor(1000 + Math.random() * 9000))).trim();

    sheet.appendRow([
      nowText,
      sanitizeCell(code),
      entryType,
      sanitizeCell(groupName),
      sanitizeCell(memberCount),
      sanitizeCell(leaderName),
      sanitizeCell(dob),
      sanitizeCell(phone),
      sanitizeCell(email),
      sanitizeCell(unit),
      sanitizeCell(members),
      sanitizeCell(projectName),
      sanitizeCell(entryIndex),
      sanitizeCell(dimensions),
      sanitizeCell(folderUrl),
      sanitizeCell(videoUrl),
      sanitizeCell(aiUsage),
      consent
    ]);

    return jsonResponse({
      ok: true,
      code,
      sheet: SHEET_NAME,
      row: sheet.getLastRow(),
      timestamp: nowText
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: err && err.message ? err.message : "Lỗi xử lý dữ liệu phía máy chủ."
    });
  } finally {
    lock.releaseLock();
  }
}
