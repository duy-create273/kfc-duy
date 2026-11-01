# DESIGN — Hướng dẫn thiết kế

## 1. Cảm giác thương hiệu
Nóng – giòn – vui – năng lượng. Nền sáng ấm, mảng đỏ đậm lớn, chữ đậm, bo góc tròn thân thiện.

## 2. Bảng màu (khai báo bằng biến CSS)

```css
:root {
  --red:        #E4002B; /* màu chủ đạo, nút CTA, tiêu đề nhấn */
  --red-dark:   #B30022; /* hover, viền */
  --ink:        #1A1A1A; /* chữ chính, footer */
  --cream:      #FFF6EC; /* nền section sáng */
  --white:      #FFFFFF;
  --gold:       #FFB81C; /* badge, sao đánh giá, điểm nhấn */
  --gray:       #6B6B6B; /* chữ phụ */
  --line:       #EADFD3; /* viền nhẹ */
}
```

Quy tắc dùng màu:
- Chữ trắng trên nền `--red` hoặc `--ink`; chữ `--ink` trên `--cream`/`--white`.
- `--gold` chỉ dùng làm điểm nhấn nhỏ (badge, sao), **không** làm nền chữ trắng (kém tương phản).
- Một nút CTA chính mỗi khung nhìn: nền `--red`, chữ trắng.

## 3. Chữ (không tải font ngoài)
```css
font-family: system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif;
```
| Cấp | Cỡ (mobile → desktop) | Đậm |
|---|---|---|
| H1 (hero) | `clamp(2.2rem, 6vw, 4rem)` | 800 |
| H2 (section) | `clamp(1.6rem, 4vw, 2.4rem)` | 800 |
| H3 (thẻ) | `1.15rem` | 700 |
| Nội dung | `1rem` (16px), dòng cao 1.6 | 400 |

## 4. Khoảng cách & hình khối
- Thang khoảng cách: 4 / 8 / 16 / 24 / 40 / 64 px (biến `--space-1…6`).
- Bo góc: thẻ `16px`, nút `999px` (viên thuốc), badge `8px`.
- Bóng đổ nhẹ: `0 4px 14px rgba(0,0,0,.08)`.
- Chiều rộng nội dung tối đa `1100px`, căn giữa, lề hai bên `16px` trên mobile.

## 5. Bố cục responsive (mobile-first)
| Màn hình | Lưới thẻ món | Ghi chú |
|---|---|---|
| < 600px | 1–2 cột | menu hamburger |
| 600–1023px | 2–3 cột | |
| ≥ 1024px | 3–4 cột | menu ngang |

Dùng CSS Grid: `grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))`.

## 6. Thành phần giao diện (components)
- **Nút**: `.btn`, `.btn--primary` (đỏ), `.btn--ghost` (viền). Cao ≥ 44px, có `:focus-visible` rõ.
- **Thẻ món** `.card`: hình SVG/emoji ở trên, tên, mô tả 2 dòng, giá (đậm, đỏ), nhãn "Bán chạy" (gold).
- **Thẻ combo** `.card--combo`: giá mới đỏ lớn, giá gốc gạch ngang xám, badge góc trên.
- **Thẻ khuyến mãi** `.promo`: viền nét đứt kiểu phiếu giảm giá, mã in đậm, nút "Sao chép mã".
- **Tab lọc** `.chip`: nút dạng viên thuốc, đang chọn = nền đỏ chữ trắng.
- **Toast**: thông báo nhỏ dưới màn hình, tự tắt sau 2 giây.
- **Skeleton/Loading**: khối xám nhấp nháy nhẹ khi đang tải CSV.

## 7. Quy tắc hình ảnh (nhẹ & đơn giản)
- Định dạng: **SVG** hoặc **emoji** (🍗 🍔 🍟 🥤 🧃 🥗). Không JPG/PNG/GIF lớn.
- Mỗi SVG < 10 KB, vẽ hình khối phẳng (flat), 2–3 màu từ bảng màu.
- Hình sử dụng: miếng gà, xô gà, burger, khoai tây, ly nước, hình tròn/sóng trang trí.
- Tên file `assets/img/` viết thường, gạch ngang: `chicken.svg`, `bucket.svg`, `burger.svg`, `fries.svg`, `salad.svg`, `drink.svg`.
- Cột `image` trong CSV chỉ ghi **tên file** (vd. `chicken.svg`); nếu thiếu file → dùng emoji dự phòng theo `category`.
- `<img>` luôn có `alt`, `width`, `height`, `loading="lazy"` (trừ hình hero).
- **Không** dùng logo chính thức hay hình ông Colonel; dùng chữ "KFC" (text, chữ đậm đỏ) làm wordmark.

## 8. Hiệu ứng (nhẹ)
- Hiện dần khi cuộn: `opacity` + `translateY(12px)` trong 400ms.
- Hover thẻ: nâng nhẹ `translateY(-4px)`.
- Tắt hết khi `@media (prefers-reduced-motion: reduce)`.
- Không dùng thư viện animation.

## 9. Khả năng truy cập (a11y)
- Tương phản chữ/nền đạt WCAG AA.
- Điều hướng bằng bàn phím được; `:focus-visible` hiển thị rõ.
- Nút hamburger có `aria-expanded`, `aria-label`.
- Thông báo toast dùng `role="status"`.

## 10. Nội dung mẫu cho Hero
- H1: **Giòn tan từng miếng.**
- Phụ đề: *Gà rán nóng hổi, combo tiết kiệm, ưu đãi mỗi ngày.*
- CTA chính: **Đặt ngay** · CTA phụ: **Xem thực đơn**
