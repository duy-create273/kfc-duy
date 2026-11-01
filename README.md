# KFC Landing Page — Dự án học Vibe Coding

> **Lưu ý:** Đây là dự án **học tập**, không phải trang chính thức của KFC. Không dùng logo/ảnh chính thức, không dùng để kinh doanh hay đánh lừa người xem.

## 1. Mục tiêu

Tạo **một trang landing page quảng cáo gà rán KFC** bằng cách "vibe coding" với **Antigravity**: mô tả bằng lời → AI viết code → bạn xem kết quả và chỉnh tiếp.

Trang chủ có các section giới thiệu theo PRD. Trang `payment.html` là luồng thanh toán **mô phỏng** được bổ sung theo yêu cầu; không tạo giao dịch hoặc lưu đơn hàng.

## 2. Ràng buộc (bắt buộc)

| Hạng mục | Quy định |
|---|---|
| Công nghệ | Chỉ **HTML + CSS + JavaScript thuần** |
| Database | Các file **.csv** trong thư mục `data/` |
| Backend | **Không có** (không Node server, PHP, Python server, API…) |
| Thư viện | Không framework, không npm. Không build step |
| Hình ảnh | Đơn giản, nhẹ: **SVG** tự vẽ / emoji. Mỗi ảnh < 10 KB |
| Tổng dung lượng trang | Mục tiêu < 300 KB (không tính font hệ thống) |

## 3. Bộ tài liệu `.md` trong dự án

| File | Dùng để làm gì |
|---|---|
| `README.md` | Tổng quan, cách chạy (file này) |
| `AGENTS.md` | **Luật cho AI** — Antigravity đọc file này trước khi code |
| `docs/PRD.md` | Yêu cầu sản phẩm: trang có gì, ai xem, mục tiêu |
| `docs/DESIGN.md` | Màu sắc, font, bố cục, quy tắc hình ảnh |
| `docs/DATA-SCHEMA.md` | Cấu trúc các file CSV + dữ liệu mẫu |
| `docs/ARCHITECTURE.md` | Cấu trúc thư mục, cách JS đọc CSV và hiển thị |
| `docs/TASKS.md` | Danh sách việc theo từng bước (tick dần) |
| `docs/PROMPTS.md` | Prompt mẫu để dán vào Antigravity theo thứ tự |

## 4. Cách dùng với Antigravity (gợi ý)

1. Mở thư mục `KFC` bằng Antigravity (**File → Open Folder**).
2. Mở `docs/PROMPTS.md`, chép **Prompt 0** dán vào khung chat của agent → agent đọc toàn bộ tài liệu.
3. Làm lần lượt Prompt 1 → 2 → 3… Mỗi bước xong thì xem trang, thấy ổn rồi mới sang bước sau.
4. Tick `[x]` vào `docs/TASKS.md` khi xong từng việc.
5. Nếu AI làm sai luật → nhắc: *"Hãy đọc lại AGENTS.md và sửa cho đúng."*

> Nếu phiên bản Antigravity của bạn dùng thư mục luật riêng (ví dụ `.agent/rules/`), hãy chép nội dung `AGENTS.md` vào đó.

## 5. Cách chạy trang (QUAN TRỌNG)

Trình duyệt **chặn `fetch()` đọc file CSV khi mở trực tiếp bằng đường dẫn `file://`** (bấm đúp `index.html`). Trang sẽ hiện trống hoặc báo lỗi. Hãy mở bằng một web server tĩnh cục bộ — vẫn **không phải backend**, chỉ để trình duyệt cho phép đọc file:

- **Cách 1 (dễ nhất):** VS Code / Antigravity cài tiện ích **Live Server** → chuột phải `index.html` → *Open with Live Server*.
- **Cách 2:** mở Terminal trong thư mục `KFC`, chạy `python -m http.server 5500`, rồi vào `http://localhost:5500`.
- **Cách 3:** nhờ agent trong Antigravity mở trang bằng trình duyệt tích hợp.

## 6. Cấu trúc thư mục dự kiến

```
KFC/
├── index.html
├── payment.html     # trang thanh toán mô phỏng
├── css/
│   ├── style.css
│   └── payment.css
├── js/
│   ├── csv.js        # đọc & phân tích CSV
│   ├── render.js     # đổ dữ liệu ra giao diện
│   ├── main.js       # khởi chạy, sự kiện, hiệu ứng
│   ├── file-warning.js
│   ├── payment-core.js
│   └── payment.js
├── data/
│   ├── menu.csv
│   ├── combos.csv
│   ├── promotions.csv
│   ├── stores.csv
│   └── testimonials.csv
├── assets/
│   └── img/          # chỉ SVG nhẹ
├── tests/             # trang test chạy trên trình duyệt
├── docs/             # các file .md chi tiết
├── AGENTS.md
└── README.md
```

## 7. Cách sửa nội dung

Muốn đổi món, giá, khuyến mãi → **chỉ mở file `.csv` trong `data/`** (bằng Excel hoặc Notepad), lưu dạng **CSV UTF-8**, tải lại trang. Không cần sửa code.

## 8. Kiểm thử

Mở các trang sau bằng cùng web server tĩnh:

- `tests/csv-tests.html` — parser và dữ liệu CSV.
- `tests/site-tests.html` — các section, bộ lọc, menu, sao chép mã và responsive.
- `tests/payment-tests.html` — kiểm tra module thanh toán mô phỏng.

## 9. Deploy lên Render

Repo đã có `render.yaml` cho **Static Site**. Không cần cài package hay chạy lệnh build.

1. Đăng nhập [Render Dashboard](https://dashboard.render.com/).
2. Chọn **New → Blueprint** và kết nối GitHub nếu được hỏi.
3. Chọn repo `duy-create273/kfc-duy`, branch `main`, rồi tạo Blueprint `kfc-duy`.
4. Chờ trạng thái deploy thành công, sau đó mở URL `.onrender.com` mà Render cấp.

Render sẽ tự deploy các commit mới trên `main`. Trang thanh toán vẫn chỉ là mô phỏng; Render không thêm backend hay chức năng lưu đơn.
