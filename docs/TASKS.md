# TASKS — Danh sách việc (tick dần)

> Làm từ trên xuống. Mỗi giai đoạn xong → mở trang kiểm tra → mới sang giai đoạn sau. Prompt tương ứng nằm trong `docs/PROMPTS.md`.

## Giai đoạn 0 — Chuẩn bị
- [ ] Mở thư mục `KFC` trong Antigravity
- [ ] Kiểm tra đủ file `.md`: README, AGENTS, PRD, DESIGN, DATA-SCHEMA, ARCHITECTURE, TASKS, PROMPTS
- [ ] Cài/bật Live Server (hoặc chuẩn bị lệnh `python -m http.server 5500`)
- [ ] Chạy **Prompt 0**: agent đọc tài liệu và tóm tắt lại kế hoạch

## Giai đoạn 1 — Dữ liệu CSV
- [x] Tạo `data/menu.csv` theo mẫu
- [x] Tạo `data/combos.csv`
- [x] Tạo `data/promotions.csv`
- [x] Tạo `data/stores.csv`
- [x] Tạo `data/testimonials.csv`
- [x] CSV UTF-8 được parser và trình duyệt đọc đúng tiếng Việt

## Giai đoạn 2 — Hình ảnh SVG
- [x] `assets/img/chicken.svg`
- [x] `assets/img/bucket.svg`
- [x] `assets/img/burger.svg`
- [x] `assets/img/fries.svg`
- [x] `assets/img/salad.svg`
- [x] `assets/img/drink.svg`
- [ ] Mỗi file < 10 KB (kiểm tra dung lượng)

## Giai đoạn 3 — Khung HTML + CSS
- [x] `index.html` có đủ 10 phần theo PRD, có điểm neo `id` theo ARCHITECTURE mục 9
- [x] `css/style.css`: biến màu, font hệ thống, nút, thẻ, lưới
- [x] Hero và lưới không tràn ngang ở 360px, 768px, 1280px
- [x] Menu điều hướng + hamburger trên mobile

## Giai đoạn 4 — JavaScript đọc CSV
- [x] `js/csv.js`: `parseCSV`, `loadCSV`, `toNumber/toBool/toList`
- [x] Test parser với ô có dấu phẩy, dấu nháy kép và dòng CRLF
- [x] `js/render.js`: các hàm render section + `formatVND`
- [x] `js/main.js`: nạp 5 CSV độc lập, render, xử lý lỗi từng file
- [ ] Sửa giá trong `menu.csv` → tải lại trang → giá đổi theo ✔

## Giai đoạn 5 — Tương tác
- [x] Lọc thực đơn theo danh mục
- [x] Lọc cửa hàng theo thành phố
- [x] Khuyến mãi: ẩn mã hết hạn / `active=false`
- [x] Nút "Sao chép mã" + toast
- [x] Cuộn mượt + hiệu ứng hiện dần (có `prefers-reduced-motion`)

## Giai đoạn 6 — Hoàn thiện & kiểm thử
- [x] Kiểm tra layout không tràn ngang ở 360px, 768px, 1280px
- [x] Console không có lỗi đỏ trong kiểm thử website
- [x] Có thông báo hướng dẫn dự phòng khi mở bằng `file://` không tải được CSV
- [x] Tổng dung lượng website tĩnh < 300 KB (đo được 81.654 byte, gồm trang thanh toán demo)
- [ ] Lighthouse Performance ≥ 90, Accessibility ≥ 90
- [x] Footer có dòng "Dự án học tập, không phải trang chính thức của KFC"
- [x] Rà lại `AGENTS.md` mục 1: không dùng backend/framework/ảnh chính thức

## Giai đoạn 7 — Mở rộng (tuỳ chọn, khi đã xong ở trên)
- [ ] Thanh tìm kiếm món (lọc theo tên)
- [ ] Chế độ sáng/tối (lưu lựa chọn bằng `localStorage`)
- [ ] Đếm ngược thời gian ưu đãi từ `end_date`
- [ ] Sắp xếp thực đơn theo giá
- [ ] Ghi lại những gì bạn học được vào cuối file này

## Ghi chú học tập
- (Viết vào đây: prompt nào hiệu quả, lỗi nào AI hay mắc, cách bạn đã sửa…)

## Bổ sung đã chốt — Thanh Toán mô phỏng
- [x] Trang thanh toán riêng dùng dữ liệu giỏ hàng mẫu
- [x] Xác thực biểu mẫu và kiểm tra phép tính tổng tiền
- [x] Xác nhận không tạo đơn hàng hoặc giao dịch thật
- [x] Có bộ test trình duyệt cho module thanh toán
