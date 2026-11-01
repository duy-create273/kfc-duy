# DATA-SCHEMA — Cấu trúc database CSV

Toàn bộ "database" là các file `.csv` trong thư mục `data/`. **Mọi dữ liệu dưới đây là MẪU tự tạo** (tên món, giá, mã, địa chỉ, số điện thoại đều giả định), không phải thông tin thật của KFC.

## 1. Quy ước chung
- Mã hoá: **UTF-8** (khi lưu từ Excel chọn *CSV UTF-8*). Parser phải bỏ ký tự BOM đầu file nếu có.
- Ngăn cách cột: dấu phẩy `,`. Ô có dấu phẩy hoặc xuống dòng → bọc trong dấu nháy kép `"..."`; dấu nháy kép bên trong viết thành `""`.
- Dòng 1 là **tiêu đề cột** (tên tiếng Anh, `snake_case`) — không đổi tên cột.
- Giá tiền: **số nguyên VND, không dấu chấm/phẩy** (vd. `39000`).
- Ngày: định dạng `YYYY-MM-DD`.
- Boolean: `true` / `false` (chữ thường).
- Danh sách trong 1 ô: ngăn cách bằng dấu `|` (vd. `2 gà rán|1 khoai|1 nước`).
- Dòng trống hoặc thiếu `id` → bỏ qua.
- Mọi file đọc bằng `fetch('data/<tên>.csv')`.

## 2. `data/menu.csv` — Thực đơn

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | số | Khoá duy nhất |
| `name` | chuỗi | Tên món |
| `category` | chuỗi | `ga-ran` · `burger` · `mon-phu` · `do-uong` |
| `description` | chuỗi | Mô tả ngắn (≤ 80 ký tự) |
| `price` | số | Giá VND |
| `image` | chuỗi | Tên file trong `assets/img/` (vd. `chicken.svg`), có thể để trống |
| `is_bestseller` | boolean | Hiện ở mục "Món bán chạy" |
| `is_available` | boolean | `false` = ẩn món |

Nhãn hiển thị cho `category`: `ga-ran` → "Gà rán", `burger` → "Burger", `mon-phu` → "Món phụ", `do-uong` → "Đồ uống". Emoji dự phòng: 🍗 🍔 🍟 🥤.

Dữ liệu mẫu:
```csv
id,name,category,description,price,image,is_bestseller,is_available
1,Gà rán giòn (1 miếng),ga-ran,Vàng giòn bên ngoài mềm ngọt bên trong,39000,chicken.svg,true,true
2,Gà rán giòn (3 miếng),ga-ran,Ba miếng gà nóng giòn cho bữa no nê,109000,chicken.svg,true,true
3,Gà không xương,ga-ran,Thịt gà mềm cắt miếng vừa ăn,55000,chicken.svg,false,true
4,Burger gà giòn,burger,Gà giòn rau tươi kẹp bánh mềm,49000,burger.svg,true,true
5,Burger gà phô mai,burger,Thêm lát phô mai béo ngậy,59000,burger.svg,false,true
6,Khoai tây chiên,mon-phu,Giòn rụm rắc muối nhẹ,25000,fries.svg,false,true
7,Salad bắp cải,mon-phu,Thanh mát giải ngấy,19000,salad.svg,false,true
8,Nước ngọt có ga,do-uong,Ly lớn lạnh sảng khoái,15000,drink.svg,false,true
9,Trà chanh mát lạnh,do-uong,Chua nhẹ ngọt dịu,22000,drink.svg,false,true
```

## 3. `data/combos.csv` — Combo

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | số | Khoá duy nhất |
| `name` | chuỗi | Tên combo |
| `items` | danh sách `\|` | Các món trong combo |
| `price` | số | Giá combo |
| `original_price` | số | Giá lẻ (để gạch ngang & tính % tiết kiệm) |
| `badge` | chuỗi | Nhãn góc thẻ (vd. "Hot"), có thể trống |
| `image` | chuỗi | Tên file SVG |
| `is_available` | boolean | `false` = ẩn |

Dữ liệu mẫu:
```csv
id,name,items,price,original_price,badge,image,is_available
1,Combo Một Mình,1 gà rán|1 khoai tây|1 nước,69000,79000,Tiết kiệm,bucket.svg,true
2,Combo Đôi Bạn,2 gà rán|1 burger|2 nước,149000,178000,Hot,bucket.svg,true
3,Combo Gia Đình,6 gà rán|2 khoai tây|1 salad|4 nước,329000,399000,Best seller,bucket.svg,true
```

JS tính phần trăm tiết kiệm: `Math.round((1 - price / original_price) * 100)`.

## 4. `data/promotions.csv` — Khuyến mãi

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | số | Khoá duy nhất |
| `title` | chuỗi | Tiêu đề ưu đãi |
| `description` | chuỗi | Điều kiện ngắn gọn |
| `code` | chuỗi | Mã (IN HOA, không dấu) |
| `start_date` | ngày | Bắt đầu |
| `end_date` | ngày | Kết thúc |
| `active` | boolean | `false` = ẩn |

Hiển thị khi: `active = true` **và** `start_date <= hôm nay <= end_date`.

Dữ liệu mẫu:
```csv
id,title,description,code,start_date,end_date,active
1,Giảm 20% đơn đầu tiên,Áp dụng cho đơn từ 100.000đ,HELLO20,2026-11-01,2026-12-31,true
2,Mua 1 tặng 1 nước,Áp dụng mọi combo vào cuối tuần,WEEKEND,2026-11-01,2027-01-31,true
3,Ưu đãi hết hạn (ví dụ ẩn),Dòng này dùng để thử logic ẩn,OLDCODE,2026-01-01,2026-02-01,true
```

## 5. `data/stores.csv` — Cửa hàng

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | số | Khoá duy nhất |
| `name` | chuỗi | Tên cửa hàng |
| `address` | chuỗi | Địa chỉ (bọc nháy kép vì có dấu phẩy) |
| `district` | chuỗi | Quận/huyện |
| `city` | chuỗi | Thành phố (dùng để lọc) |
| `phone` | chuỗi | SĐT (mẫu) |
| `open_hours` | chuỗi | Giờ mở cửa |

Dữ liệu mẫu (địa chỉ giả):
```csv
id,name,address,district,city,phone,open_hours
1,Cửa hàng Mẫu 1,"123 Đường Mẫu, Phường A",Quận 1,TP.HCM,028 0000 0001,08:00 - 22:00
2,Cửa hàng Mẫu 2,"45 Đường Ví Dụ, Phường B",Quận 3,TP.HCM,028 0000 0002,08:00 - 22:00
3,Cửa hàng Mẫu 3,"78 Phố Thử Nghiệm, Phường C",Hoàn Kiếm,Hà Nội,024 0000 0003,08:00 - 21:30
```

## 6. `data/testimonials.csv` — Đánh giá

| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | số | Khoá duy nhất |
| `name` | chuỗi | Tên hiển thị (tên giả/viết tắt, ví dụ "Minh A.") |
| `rating` | số 1–5 | Số sao |
| `comment` | chuỗi | Lời nhận xét (≤ 140 ký tự) |

Dữ liệu mẫu (lời nhận xét **minh hoạ**, không phải đánh giá thật):
```csv
id,name,rating,comment
1,Minh A.,5,Gà giòn tan ăn một lần là nhớ mãi.
2,Lan T.,5,Combo đôi bạn đủ cho hai người mà giá hợp lý.
3,Hùng P.,4,Khoai tây nóng giòn giao tới vẫn ngon.
```

## 7. Bản đồ quan hệ
```
menu.csv         → Section "Món bán chạy" + "Thực đơn"
combos.csv       → Section "Combo"
promotions.csv   → Section "Khuyến mãi"
testimonials.csv → Section "Đánh giá"
stores.csv       → Section "Cửa hàng"
```
Các file độc lập, không có khoá ngoại.

## 8. Kiểm tra dữ liệu (JS nên làm)
- Bỏ dòng thiếu `id`/`name`.
- `Number(price)` không hợp lệ → bỏ dòng và `console.warn`.
- Cột `image` rỗng hoặc file không tồn tại → dùng emoji dự phòng.
