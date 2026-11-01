const PAYMENT_METHODS = Object.freeze({
  cod: "Tiền mặt khi nhận hàng (mô phỏng)",
  "bank-transfer": "Chuyển khoản (mô phỏng)",
  ewallet: "Ví điện tử (mô phỏng)"
});

export function normalizeCartItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new TypeError("Giỏ hàng phải có ít nhất một món.");
  }

  const seenIds = new Set();
  return items.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new TypeError(`Món thứ ${index + 1} không hợp lệ.`);
    }

    const id = typeof item.id === "string" || typeof item.id === "number" ? String(item.id).trim() : "";
    const name = typeof item.name === "string" ? item.name.trim() : "";
    if (!id || !name) {
      throw new TypeError(`Món thứ ${index + 1} cần có mã và tên.`);
    }
    if (seenIds.has(id)) {
      throw new TypeError(`Mã món bị trùng: ${id}.`);
    }
    if (!Number.isSafeInteger(item.price) || item.price < 0) {
      throw new TypeError(`Giá của món ${name} phải là số nguyên không âm.`);
    }
    if (!Number.isSafeInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      throw new TypeError(`Số lượng món ${name} phải từ 1 đến 99.`);
    }

    seenIds.add(id);
    return Object.freeze({ id, name, price: item.price, quantity: item.quantity });
  });
}

export function calculateOrderTotals(items, deliveryFee) {
  const validItems = normalizeCartItems(items);
  if (!Number.isSafeInteger(deliveryFee) || deliveryFee < 0) {
    throw new TypeError("Phí giao hàng phải là số nguyên không âm.");
  }

  const subtotal = validItems.reduce((sum, item) => {
    const next = sum + item.price * item.quantity;
    if (!Number.isSafeInteger(next)) {
      throw new RangeError("Tổng tiền vượt giới hạn an toàn.");
    }
    return next;
  }, 0);
  const total = subtotal + deliveryFee;
  if (!Number.isSafeInteger(total)) {
    throw new RangeError("Tổng tiền vượt giới hạn an toàn.");
  }

  return Object.freeze({ subtotal, deliveryFee, total });
}

export function validateCheckout(values) {
  const input = values && typeof values === "object" ? values : {};
  const fullName = typeof input.fullName === "string" ? input.fullName.trim() : "";
  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  const address = typeof input.address === "string" ? input.address.trim() : "";
  const paymentMethod = typeof input.paymentMethod === "string" ? input.paymentMethod : "";
  const errors = {};

  if (fullName.length < 2 || fullName.length > 80) {
    errors.fullName = "Tên người nhận cần có từ 2 đến 80 ký tự.";
  }
  if (!/^0\d{9}$/.test(phone)) {
    errors.phone = "Nhập số điện thoại gồm 10 chữ số và bắt đầu bằng 0.";
  }
  if (address.length < 5 || address.length > 200) {
    errors.address = "Địa chỉ cần có từ 5 đến 200 ký tự.";
  }
  if (!Object.hasOwn(PAYMENT_METHODS, paymentMethod)) {
    errors.paymentMethod = "Hãy chọn một phương thức thanh toán.";
  }

  return Object.freeze(errors);
}

export function getPaymentLabel(method) {
  return PAYMENT_METHODS[method] ?? "Phương thức không hợp lệ";
}

export function formatVND(amount) {
  if (!Number.isSafeInteger(amount) || amount < 0) {
    throw new TypeError("Số tiền phải là số nguyên không âm.");
  }
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(amount)}đ`;
}