/**
 * Google Apps Script — Cổng ĐĂNG KÝ THAM GIA Cuộc thi Thiết kế Mô hình "Tự hào Hải Phòng" năm 2026
 *
 * HƯỚNG DẪN TẠO SHEET & LIÊN KẾT NHANH:
 * 1. Mở https://sheets.new để tạo 1 Google Sheet mới.
 * 2. Vào menu: Tiện ích mở rộng (Extensions) -> Apps Script.
 * 3. Xóa code mẫu, dán toàn bộ file này vào và nhấn Lưu (Ctrl+S).
 * 4. Chọn hàm `setupSheet` trên thanh công cụ -> nhấn Chạy (Run) & cấp quyền để TỰ ĐỘNG tạo 10 cột tiêu đề chuẩn.
 * 5. Nhấn Triển khai (Deploy) -> Tùy chọn triển khai mới (New deployment):
 *    - Loại (Type): Ứng dụng web (Web app)
 *    - Thực thi với tư cách (Execute as): Tôi (Me)
 *    - Ai có quyền truy cập (Who has access): Bất kỳ ai (Anyone)
 * 6. Copy URL Web App (dạng https://script.google.com/macros/s/.../exec) dán vào biến `GOOGLE_SCRIPT_URL` trong `script.js`.
 */

const SHEET_NAME = "DangKy_2026";
const SEND_CONFIRMATION_EMAIL = false; // Đổi thành true nếu muốn tự động gửi email xác nhận cho thí sinh

const HEADERS = [
  "Thời gian đăng ký (GMT+7)",
  "Mã đăng ký",
  "Hình thức dự thi",
  "Tên nhóm",
  "Số thành viên dự kiến",
  "Họ tên (Trưởng nhóm / Thí sinh)",
  "Số điện thoại / Zalo",
  "Email",
  "Đơn vị / Trường học / Địa phương",
  "Xác nhận điều kiện & Thể lệ"
];

const COLUMN_WIDTHS = [
  180, // Thời gian đăng ký
  115, // Mã đăng ký
  145, // Hình thức
  200, // Tên nhóm
  125, // Số thành viên
  210, // Họ tên
  140, // SĐT / Zalo
  225, // Email
  270, // Đơn vị
  170  // Xác nhận
];

/**
 * Chạy hàm này 1 lần để tự động tạo tab `DangKy_2026` và định dạng 10 cột tiêu đề.
 * Hàm doPost cũng sẽ tự gọi nếu sheet chưa được khởi tạo.
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    const firstSheet = ss.getSheets()[0];
    if (firstSheet && firstSheet.getLastRow() === 0 && firstSheet.getLastColumn() === 0) {
      firstSheet.setName(SHEET_NAME);
      sheet = firstSheet;
    } else {
      sheet = ss.insertSheet(SHEET_NAME);
    }
  }

  if (sheet.getLastRow() === 0) {
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setValues([HEADERS]);
    headerRange
      .setBackground("#093795")
      .setFontColor("#FFFFFF")
      .setFontWeight("bold")
      .setVerticalAlignment("middle")
      .setHorizontalAlignment("center")
      .setWrap(true);

    sheet.setRowHeight(1, 38);
    sheet.setFrozenRows(1);

    COLUMN_WIDTHS.forEach((width, index) => {
      sheet.setColumnWidth(index + 1, width);
    });
  }

  return sheet;
}

/**
 * Ngăn Excel/Sheets hiểu nhầm ký tự đầu (=, +, -, @) thành công thức
 */
function sanitizeCell(value) {
  const str = value == null ? "" : String(value).trim();
  if (/^[=+\-@]/.test(str)) {
    return "'" + str;
  }
  return str;
}

/**
 * Kiểm tra nhanh API khi mở URL Web App trên trình duyệt
 */
function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({
      ok: true,
      service: "Tu Hao Hai Phong 2026 — Registration Sheet API",
      sheet: SHEET_NAME
    })
  ).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Nhận dữ liệu POST từ Form đăng ký trên Landing Page và ghi 1 dòng mới vào Google Sheet
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);

  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    if (!payload.leaderName || !payload.phone || !payload.email || !payload.unit) {
      return jsonResponse({
        ok: false,
        error: "Thiếu thông tin đăng ký bắt buộc (Họ tên, SĐT, Email, Đơn vị)."
      });
    }

    const sheet = setupSheet();
    const now = new Date();
    const submittedAt = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");
    const code = payload.code || ("HP26-" + Math.floor(1000 + Math.random() * 9000));
    const isGroup = payload.entryType !== "individual";

    const row = [
      submittedAt,
      sanitizeCell(code),
      isGroup ? "Nhóm tác giả" : "Thí sinh cá nhân",
      isGroup ? sanitizeCell(payload.groupName) : "—",
      isGroup ? sanitizeCell(payload.memberCount || "2") : "1",
      sanitizeCell(payload.leaderName),
      sanitizeCell(payload.phone),
      sanitizeCell(payload.email),
      sanitizeCell(payload.unit),
      payload.consent ? "Đã xác nhận (≥ 15 tuổi & Thể lệ)" : "Chưa xác nhận"
    ];

    sheet.appendRow(row);
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1, 1, HEADERS.length).setVerticalAlignment("top").setWrap(true);

    if (SEND_CONFIRMATION_EMAIL && payload.email) {
      try {
        MailApp.sendEmail({
          to: String(payload.email).trim(),
          subject: `[Tự hào Hải Phòng 2026] Xác nhận đăng ký tham gia (${code})`,
          body:
            `Xin chào ${payload.leaderName},\n\n` +
            `Ban Tổ chức đã ghi nhận thông tin đăng ký tham gia Cuộc thi thiết kế mô hình "Tự hào Hải Phòng" năm 2026.\n` +
            `- Mã đăng ký: ${code}\n` +
            `- Hình thức: ${isGroup ? "Nhóm (" + payload.groupName + ")" : "Cá nhân"}\n` +
            `- Đơn vị: ${payload.unit}\n` +
            `- Thời gian đăng ký: ${submittedAt} (GMT+7)\n\n` +
            `Vui lòng hoàn thiện và nộp hồ sơ Sơ khảo qua cổng nộp bài của Ban Tổ chức trước 17h00 ngày 20/11/2026.\n\n` +
            `Trân trọng,\nBan Tổ chức Cuộc thi Thiết kế Mô hình "Tự hào Hải Phòng" 2026.`
        });
      } catch (mailErr) {
        // Bỏ qua nếu vượt hạn mức gửi mail miễn phí trong ngày
      }
    }

    return jsonResponse({
      ok: true,
      code: code,
      submittedAt: submittedAt
    });
  } catch (err) {
    return jsonResponse({
      ok: false,
      error: "Không thể ghi dữ liệu vào Google Sheet: " + err.message
    });
  } finally {
    lock.releaseLock();
  }
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
