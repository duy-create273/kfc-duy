# ARCHITECTURE — Kiến trúc kỹ thuật

## 1. Nguyên tắc
Trang **tĩnh hoàn toàn**: trình duyệt tải `index.html` → JS `fetch` các file CSV → phân tích → vẽ ra giao diện. Không server xử lý, không API.

```
 index.html ──► css/style.css
     │
     └──► js/main.js ──► js/csv.js     (đọc & parse CSV)
                    └──► js/render.js  (đổ dữ liệu ra DOM)
                              ▲
                data/*.csv ───┘ (fetch)
```

## 2. Cấu trúc thư mục
```
KFC/
├── index.html
├── payment.html                 # checkout mô phỏng, không lưu đơn
├── css/
│   ├── style.css
│   └── payment.css
├── js/
│   ├── csv.js
│   ├── render.js
│   ├── main.js
│   ├── file-warning.js
│   ├── payment-core.js
│   └── payment.js
├── data/
│   ├── menu.csv
│   ├── combos.csv
│   ├── promotions.csv
│   ├── stores.csv
│   └── testimonials.csv
└── assets/img/
    ├── chicken.svg  bucket.svg  burger.svg
    ├── fries.svg    salad.svg   drink.svg
└── tests/                         # kiểm thử chạy trong trình duyệt
```
Chi tiết cột CSV: xem `docs/DATA-SCHEMA.md`.

## 3. Nạp script
Dùng ES Modules (chạy được vì mở qua web server tĩnh):
```html
<script type="module" src="js/main.js"></script>
```
`main.js` `import` từ `csv.js` và `render.js`.

## 4. Vai trò từng file JS

### `js/csv.js`
- `parseCSV(text)` → mảng object theo tiêu đề cột. Phải xử lý: ô bọc nháy kép, dấu phẩy trong ô, `""` thành `"`, xuống dòng `\r\n`, BOM đầu file, dòng trống.
- `loadCSV(url)` → `fetch(url)` → kiểm tra `response.ok` → `parseCSV`. Ném lỗi có thông điệp rõ ràng nếu thất bại.
- Hàm chuyển kiểu: `toNumber`, `toBool` (`'true'` → `true`), `toList` (tách bằng `|`).

### `js/render.js`
Mỗi section một hàm, nhận mảng dữ liệu và phần tử đích:
- `renderBestsellers(items, el)`
- `renderMenu(items, el, category)` + `renderCategoryChips(categories, el, onSelect)`
- `renderCombos(items, el)`
- `renderPromotions(items, el, today)` (+ lọc ngày, nút sao chép mã)
- `renderTestimonials(items, el)`
- `renderStores(items, el, city)` + bộ lọc thành phố
- Tiện ích: `formatVND(n)`, `escapeHTML(s)`, `categoryLabel(key)`, `fallbackEmoji(category)`, `starRating(n)`.

**Bảo mật:** dữ liệu CSV luôn đi qua `escapeHTML()` hoặc `textContent` trước khi vào DOM.

### `js/main.js`
1. Chờ `DOMContentLoaded`.
2. `Promise.all` đọc 5 file CSV song song.
3. Lọc dữ liệu (`is_available`, `active`, ngày).
4. Gọi các hàm `render*`.
5. Gắn sự kiện: lọc danh mục, hamburger, cuộn mượt, sao chép mã, toast.
6. `IntersectionObserver` cho hiệu ứng hiện dần.
7. Bắt lỗi → hiện khối thông báo lỗi (xem mục 6).

### Thanh toán mô phỏng
- `payment.html` và `js/payment.js` hiển thị form cùng giỏ mẫu.
- `js/payment-core.js` kiểm tra dữ liệu, tính tổng và định dạng tiền; không gửi hoặc lưu thông tin.
- `js/file-warning.js` hiển thị hướng dẫn khi trình duyệt không thể tải CSV từ `file://`.

## 5. Luồng dữ liệu
```
fetch(csv) → text → parseCSV → object[] → lọc/sắp xếp → render → DOM
```

## 6. Trạng thái tải & lỗi
- Trước khi dữ liệu về: mỗi section hiển thị skeleton (CSS).
- Lỗi `fetch` (thường do mở bằng `file://`): hiện khung trong section:
  > "Không tải được dữ liệu. Hãy mở trang bằng Live Server hoặc `python -m http.server` (xem README)."
- Một file CSV lỗi **không được làm hỏng** các section khác (dùng `Promise.allSettled` hoặc `try/catch` riêng từng file).

## 7. Hiệu năng
- Không thư viện ngoài; JS tổng < 15 KB, CSS < 15 KB.
- Ảnh SVG nhẹ; `loading="lazy"` cho ảnh dưới màn hình đầu.
- Không web font; không CDN.
- Có thể `<link rel="preload" href="data/menu.csv" as="fetch" crossorigin>` cho file đầu tiên cần dùng.

## 8. Quy ước đặt tên
| Loại | Quy ước | Ví dụ |
|---|---|---|
| Class CSS | BEM đơn giản | `.card`, `.card__title`, `.card--combo` |
| Biến CSS | `--ten-ngan` | `--red`, `--space-4` |
| Hàm JS | camelCase, động từ | `renderMenu`, `loadCSV` |
| Id trong HTML | kebab-case | `menu-grid`, `promo-list` |
| File | chữ thường, gạch ngang | `bucket.svg` |

## 9. Điểm neo trong `index.html` (để JS gắn dữ liệu)
```
#hero  #bestsellers  #menu  #combos  #promos  #why  #reviews  #stores  #cta
Vùng đổ dữ liệu: #bestseller-list  #menu-chips  #menu-grid  #combo-list
                 #promo-list  #review-list  #store-filter  #store-list
Khác:            #toast  #nav-toggle  #nav-menu
```

## 10. Giới hạn đã biết (vì không có backend)
- Không lưu được đơn hàng/biểu mẫu liên hệ vào CSV. Nếu cần lưu tạm, dùng `localStorage` (chỉ nằm trong trình duyệt người dùng) hoặc cho CTA dẫn ra kênh ngoài.
- CSV là dữ liệu công khai: ai mở trang cũng tải được → **không đặt thông tin nhạy cảm** trong CSV.
- Muốn dữ liệu tự cập nhật phải sửa file CSV và triển khai lại.
