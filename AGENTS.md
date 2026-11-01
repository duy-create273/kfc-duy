# AGENTS.md — Luật làm việc cho AI Agent

Bạn là lập trình viên hỗ trợ người đang **học vibe coding**. Dự án: landing page quảng cáo gà rán KFC (bản học tập, không chính thức).

## 0. Đọc trước khi code
Luôn đọc: `README.md`, `docs/PRD.md`, `docs/DESIGN.md`, `docs/DATA-SCHEMA.md`, `docs/ARCHITECTURE.md`, `docs/TASKS.md`.
Nếu yêu cầu của người dùng mâu thuẫn với tài liệu → **hỏi lại**, đừng tự đoán.

## 1. Ràng buộc cứng (KHÔNG được vi phạm)
1. Chỉ dùng **HTML, CSS, JavaScript thuần** (ES6+).
2. **Không có backend**: cấm Node/Express, PHP, Python server, Firebase, API bên ngoài, database thật.
3. Dữ liệu lấy từ các file **`.csv`** trong `data/`, đọc bằng `fetch()` + parser tự viết (`js/csv.js`).
4. **Không** dùng framework/thư viện (React, jQuery, Bootstrap, Tailwind CDN…), không npm, không build step.
5. **Hình ảnh đơn giản & nhẹ**: SVG tự vẽ hoặc emoji; mỗi file < 10 KB; không ảnh chụp thật (JPG/PNG lớn), không video, không GIF.
6. Không dùng font tải từ Internet; dùng font hệ thống (xem `docs/DESIGN.md`).
7. Không copy logo, ảnh, văn bản bản quyền chính thức của KFC. Dùng chữ "KFC" dạng text và hình minh hoạ tự vẽ.

## 2. Quy tắc code
- HTML ngữ nghĩa (`header`, `main`, `section`, `footer`), có `alt` cho ảnh, `lang="vi"`.
- CSS: dùng **biến CSS** (`:root`) cho màu/khoảng cách; **mobile-first**; không dùng `!important` nếu không cần.
- JS: chia module theo `docs/ARCHITECTURE.md`; hàm nhỏ, đặt tên tiếng Anh rõ nghĩa; **comment bằng tiếng Việt** ngắn gọn.
- Khi hiển thị dữ liệu từ CSV: dùng `textContent` hoặc hàm `escapeHTML()`, **không** gắn chuỗi CSV thô vào `innerHTML`.
- Phải xử lý lỗi: nếu không đọc được CSV → hiện thông báo thân thiện (xem `docs/ARCHITECTURE.md`).
- Tiền tệ VND hiển thị: `Intl.NumberFormat('vi-VN')` + "đ".

## 3. Cách làm việc
- Làm **từng bước nhỏ** theo `docs/TASKS.md`; xong bước nào thì tick `[x]`.
- Trước khi sửa nhiều file: nêu ngắn gọn **kế hoạch** (file nào, đổi gì).
- Sau mỗi bước: nói rõ **cách kiểm tra** (mở trang, bấm gì, thấy gì).
- Giải thích bằng **tiếng Việt, đơn giản**, vì người dùng đang học. Khi dùng thuật ngữ mới, giải thích 1 câu.
- Không tự thêm tính năng ngoài `docs/PRD.md`. Có ý tưởng hay → đề xuất, chờ người dùng đồng ý.
- Không xoá file của người dùng khi chưa hỏi.

## 4. Định nghĩa "xong" (Definition of Done)
- [ ] Mở bằng web server tĩnh, trang chạy không lỗi Console.
- [ ] Dữ liệu hiển thị đúng từ CSV; sửa CSV → tải lại trang thấy thay đổi.
- [ ] Xem tốt ở 360px, 768px, 1280px.
- [ ] Tổng dung lượng trang < 300 KB.
- [ ] Không vi phạm mục 1.
