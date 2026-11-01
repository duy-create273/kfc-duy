# PRD — Yêu cầu sản phẩm: KFC Landing Page

## 1. Tóm tắt
Một trang web **một trang (single page)** quảng cáo gà rán KFC: gây thèm ăn, giới thiệu món/combo, khuyến mãi, và kêu gọi hành động (đặt hàng/gọi điện). Đây là bài tập học vibe coding nên trang là **bản minh hoạ, không phải trang chính thức**.

## 2. Mục tiêu
- Người xem hiểu trong 5 giây: *KFC — gà rán giòn, có combo & ưu đãi*.
- Người xem bấm được nút kêu gọi hành động (CTA).
- Người học nắm được quy trình: viết tài liệu `.md` → AI code → kiểm tra → chỉnh sửa.

## 3. Đối tượng
Giới trẻ, gia đình, nhóm bạn, dân văn phòng, dùng chủ yếu **điện thoại**.

## 4. Phạm vi

### Trong phạm vi
- Một file `index.html`, cuộn dọc các section.
- Dữ liệu động từ CSV (menu, combo, khuyến mãi, cửa hàng, đánh giá).
- Responsive, hiệu ứng nhẹ bằng CSS/JS thuần.
- Theo yêu cầu bổ sung đã chốt: trang `payment.html` mô phỏng nhập thông tin giao hàng, chọn phương thức và xem xác nhận; chỉ dùng giỏ mẫu tại trình duyệt, không tạo giao dịch/đơn hàng.

### Ngoài phạm vi
- Giỏ hàng thật, thanh toán/giao dịch thật, đăng nhập, lưu đơn hàng (cần backend).
- Ảnh chụp thật, video, bản đồ nhúng, mạng xã hội nhúng.
- Đa ngôn ngữ (chỉ tiếng Việt).

## 5. Các section của trang (theo thứ tự)

| # | Section | Nội dung | Dữ liệu |
|---|---|---|---|
| 1 | **Header / Menu** | Chữ "KFC", liên kết neo tới các section, nút "Đặt ngay" | — |
| 2 | **Hero** | Tiêu đề lớn, phụ đề, 2 nút CTA, hình SVG miếng gà/xô gà | — |
| 3 | **Món bán chạy** | Thẻ món nổi bật (`is_bestseller = true`) | `menu.csv` |
| 4 | **Thực đơn** | Lọc theo danh mục (Gà rán, Burger, Món phụ, Đồ uống), thẻ món | `menu.csv` |
| 5 | **Combo** | Combo tiết kiệm, giá gốc gạch ngang, nhãn badge | `combos.csv` |
| 6 | **Khuyến mãi** | Mã ưu đãi, hạn dùng, nút "Sao chép mã" | `promotions.csv` |
| 7 | **Vì sao chọn KFC** | 3–4 điểm mạnh (giòn, tươi, nhanh, giá tốt) — nội dung viết tay trong HTML | — |
| 8 | **Đánh giá** | Lời khen từ khách (dữ liệu mẫu) | `testimonials.csv` |
| 9 | **Cửa hàng** | Danh sách cửa hàng, lọc theo thành phố | `stores.csv` |
| 10 | **CTA cuối + Footer** | Nút đặt hàng/gọi, thông tin, dòng lưu ý "dự án học tập" | — |

## 6. Yêu cầu chức năng
- **F1** Đọc tất cả CSV khi tải trang và hiển thị đúng.
- **F2** Lọc thực đơn theo danh mục không tải lại trang.
- **F3** Chỉ hiển thị khuyến mãi còn hạn (`end_date >= hôm nay`) và `active = true`; món/combo `is_available = false` thì ẩn.
- **F4** Nút "Sao chép mã" dùng `navigator.clipboard`, hiện thông báo nhỏ "Đã sao chép".
- **F5** Cuộn mượt tới section khi bấm menu; menu thu gọn (hamburger) trên mobile.
- **F6** Nút CTA: `tel:` gọi tổng đài mẫu và/hoặc link ngoài (ghi rõ placeholder); **không** xử lý đơn hàng.
- **F7** Hiệu ứng xuất hiện khi cuộn (`IntersectionObserver`), tôn trọng `prefers-reduced-motion`.
- **F8** Có trạng thái *đang tải* và *lỗi tải dữ liệu*.

## 7. Yêu cầu phi chức năng
- Tổng dung lượng < 300 KB; điểm Lighthouse Performance mục tiêu ≥ 90.
- Chạy trên Chrome/Edge/Safari/Firefox bản mới.
- Dễ đọc: tương phản chữ/nền đạt chuẩn WCAG AA, nút bấm ≥ 44px trên mobile.
- Sửa nội dung chỉ cần sửa CSV, không sửa code.

## 8. Giọng văn quảng cáo
Ngắn, vui, gợi cảm giác thèm: *"Giòn tan từng miếng"*, *"Gọi là có, nóng giòn tận nơi"*.
Không hứa hẹn sai sự thật (không khẳng định giá/khuyến mãi thật — dữ liệu chỉ là **mẫu**).

## 9. Tiêu chí nghiệm thu
Xem mục **Definition of Done** trong `AGENTS.md` và các tick trong `docs/TASKS.md`.
