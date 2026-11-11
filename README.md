# Cuộc thi Thiết kế Mô hình “Tự hào Hải Phòng” năm 2026

Landing page chính thức của Cuộc thi Thiết kế Mô hình **“Tự hào Hải Phòng” năm 2026** (*“Sáng tạo không gian – Lan tỏa bản sắc”*), phối hợp tổ chức bởi **Thành đoàn Hải Phòng** và **Trường Cao đẳng FPT Polytechnic cơ sở Hải Phòng**.

## Cấu trúc thư mục
- `index.html`: Nội dung trang (Hero, Đếm ngược, Giới thiệu mô hình `5m²–10m²`, Lộ trình 3 giai đoạn, Thể lệ & Thang điểm 100, Giải thưởng, Form Đăng ký, Bộ nhận diện mẫu, Đơn vị tổ chức).
- `styles.css`: Giao diện & hệ thống màu sắc trích xuất từ bộ nhận diện cuộc thi.
- `script.js`: Đếm ngược tới `17h00 · 20/11/2026`, chuyển tab thành phần mô hình, kiểm tra form đăng ký, đồng bộ Google Sheet và xuất Phiếu xác nhận điện tử.
- `assets/`: Logo Đoàn TNCS Hồ Chí Minh, logo FPT Polytechnic và Poster mẫu cuộc thi.
- `google-apps-script.gs`: Mã Google Apps Script tự tạo bảng tính `DangKy_2026` (10 cột) và nhận dữ liệu đăng ký.

## Cấu hình liên kết Google Sheet & Cổng nộp bài
Mở `script.js` và cập nhật 2 biến ở đầu file:
- `GOOGLE_SCRIPT_URL`: URL Web App sau khi Deploy `google-apps-script.gs`.
- `SUBMISSION_PORTAL_URL`: Link cổng nộp hồ sơ Sơ khảo riêng (khi Ban Tổ chức mở đợt thu bài).
