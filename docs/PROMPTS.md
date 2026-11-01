# PROMPTS — Prompt mẫu cho Antigravity

Cách dùng: chép nguyên khối prompt vào khung chat của agent, **từng bước một**. Xong bước nào thì mở trang kiểm tra rồi mới sang bước sau.

## Mẹo viết prompt tốt khi vibe coding
1. **Nói rõ mục tiêu + phạm vi**: "Chỉ làm phần X, đừng đụng phần khác."
2. **Trỏ tới tài liệu**: "Theo `docs/DESIGN.md`…" — để AI không tự bịa.
3. **Nêu cách kiểm tra**: "Sau khi xong, cho tôi biết mở trang thế nào và phải thấy gì."
4. **Sửa nhỏ, lặp nhiều**: mỗi lần một thay đổi; lỗi thì dán nguyên thông báo lỗi trong Console.
5. **Nếu AI đi chệch**: "Hãy đọc lại `AGENTS.md` mục 1 và sửa cho đúng ràng buộc."
6. Với việc lớn, nên bật chế độ cho agent **lập kế hoạch trước** (nếu Antigravity có) rồi duyệt kế hoạch mới cho chạy.

---

## Prompt 0 — Cho agent đọc tài liệu
```
Hãy đọc toàn bộ các file: README.md, AGENTS.md, docs/PRD.md, docs/DESIGN.md,
docs/DATA-SCHEMA.md, docs/ARCHITECTURE.md, docs/TASKS.md.
Sau đó tóm tắt lại bằng tiếng Việt, tối đa 10 gạch đầu dòng:
- Dự án làm gì, ràng buộc nào bắt buộc
- Cấu trúc thư mục sẽ tạo
- Thứ tự các bước
Nếu có điểm mâu thuẫn hoặc chưa rõ, hãy hỏi tôi. CHƯA viết code.
```

## Prompt 1 — Tạo dữ liệu CSV
```
Theo docs/DATA-SCHEMA.md, tạo 5 file trong thư mục data/:
menu.csv, combos.csv, promotions.csv, stores.csv, testimonials.csv
bằng đúng dữ liệu mẫu trong tài liệu. Lưu UTF-8, giữ nguyên tên cột.
Đừng tạo file nào khác. Xong thì liệt kê số dòng của mỗi file.
```

## Prompt 2 — Tạo hình SVG
```
Theo mục 7 của docs/DESIGN.md, tạo 6 file SVG trong assets/img/:
chicken.svg, bucket.svg, burger.svg, fries.svg, salad.svg, drink.svg.
Yêu cầu: hình khối phẳng đơn giản, 2–3 màu từ bảng màu, mỗi file < 10 KB,
tự vẽ (không giống logo chính thức), có viewBox để co giãn.
Xong thì cho tôi biết dung lượng từng file.
```

## Prompt 3 — Khung HTML + CSS
```
Theo docs/PRD.md (mục 5) và docs/DESIGN.md, tạo index.html và css/style.css.
- Đủ 10 section với các id đúng như docs/ARCHITECTURE.md mục 9.
- Vùng dữ liệu (#bestseller-list, #menu-grid, #combo-list, #promo-list,
  #review-list, #store-list…) để trống, JS sẽ đổ dữ liệu sau.
- Mobile-first, có hamburger, hero với SVG, font hệ thống.
- Chưa viết JS.
Cho tôi cách mở trang để xem và những gì tôi nên thấy.
```

## Prompt 4 — JavaScript đọc CSV
```
Theo docs/ARCHITECTURE.md, tạo js/csv.js, js/render.js, js/main.js (ES Modules).
- csv.js: parseCSV xử lý đúng nháy kép, dấu phẩy trong ô, BOM, \r\n.
- render.js: các hàm render cho từng section, escapeHTML, formatVND.
- main.js: đọc 5 CSV song song, lọc theo is_available/active/ngày,
  render, và hiện thông báo lỗi thân thiện nếu fetch thất bại.
- Thêm <script type="module"> vào index.html.
Giải thích ngắn từng file bằng tiếng Việt đơn giản để tôi học.
```

## Prompt 5 — Tương tác
```
Thêm các tương tác theo docs/PRD.md mục 6 (F2, F4, F5, F7):
lọc thực đơn theo danh mục, lọc cửa hàng theo thành phố,
nút "Sao chép mã" + toast, cuộn mượt, hiệu ứng hiện dần khi cuộn
(tôn trọng prefers-reduced-motion). Không thêm thư viện.
```

## Prompt 6 — Kiểm thử & tối ưu
```
Rà soát dự án theo "Definition of Done" trong AGENTS.md và Giai đoạn 6
trong docs/TASKS.md. Kiểm tra:
1) Lỗi Console  2) Responsive 360/768/1280  3) Tổng dung lượng trang
4) Tương phản màu & điều hướng bàn phím  5) Có vi phạm ràng buộc nào không.
Liệt kê vấn đề tìm được, rồi sửa từng cái, báo lại kết quả.
```

## Prompt 7 — Sửa lỗi (mẫu dùng khi gặp lỗi)
```
Trang đang bị lỗi: [mô tả bạn thấy gì].
Thông báo trong Console (F12): [dán nguyên văn].
Hãy tìm nguyên nhân, giải thích ngắn gọn bằng tiếng Việt,
sửa tối thiểu số file cần thiết, và chỉ tôi cách kiểm tra lại.
```

## Prompt 8 — Tinh chỉnh giao diện (mẫu)
```
Phần [tên section] trông [mô tả vấn đề: chật / nhạt / khó đọc…].
Hãy chỉnh theo docs/DESIGN.md, chỉ sửa CSS của phần này,
giữ nguyên các section khác.
```

## Prompt 9 — Học qua code
```
Giải thích file js/csv.js cho người mới học: từng hàm làm gì,
một dòng CSV đi qua parser thành object như thế nào (lấy ví dụ 1 dòng
trong menu.csv). Dùng ngôn ngữ đơn giản và ví dụ đời thường.
```

## Prompt 10 — Cập nhật tài liệu
```
Cập nhật docs/TASKS.md: tick các việc đã hoàn thành, thêm vào "Ghi chú học tập"
3 điều đáng nhớ rút ra từ quá trình làm. Không sửa nội dung khác.
```
