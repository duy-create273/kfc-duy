import {
  calculateOrderTotals,
  formatVND,
  getPaymentLabel,
  normalizeCartItems,
  validateCheckout
} from "./payment-core.js";

const sampleCart = [
  { id: "sample-chicken", name: "Gà rán giòn (3 miếng)", price: 109000, quantity: 1 },
  { id: "sample-fries", name: "Khoai tây chiên", price: 25000, quantity: 1 }
];
const sampleDeliveryFee = 15000;

const form = document.querySelector("#checkout-form");
const confirmation = document.querySelector("#confirmation");
const errorTargets = {
  fullName: { message: document.querySelector("#name-error"), input: document.querySelector("#customer-name") },
  phone: { message: document.querySelector("#phone-error"), input: document.querySelector("#customer-phone") },
  address: { message: document.querySelector("#address-error"), input: document.querySelector("#delivery-address") },
  paymentMethod: { message: document.querySelector("#payment-error"), input: document.querySelector("input[name='paymentMethod']") }
};

function renderOrder(items) {
  const list = document.querySelector("#order-items");
  const fragment = document.createDocumentFragment();

  for (const item of items) {
    const row = document.createElement("li");
    row.className = "order-item";

    const copy = document.createElement("div");
    copy.className = "order-item__copy";
    const name = document.createElement("span");
    name.className = "order-item__name";
    name.textContent = item.name;
    const quantity = document.createElement("span");
    quantity.className = "order-item__quantity";
    quantity.textContent = `Số lượng: ${item.quantity}`;
    copy.append(name, quantity);

    const price = document.createElement("strong");
    price.className = "order-item__price";
    price.textContent = formatVND(item.price * item.quantity);
    row.append(copy, price);
    fragment.append(row);
  }

  list.replaceChildren(fragment);
}

function showTotals() {
  const totals = calculateOrderTotals(sampleCart, sampleDeliveryFee);
  document.querySelector("#subtotal").textContent = formatVND(totals.subtotal);
  document.querySelector("#delivery-fee").textContent = formatVND(totals.deliveryFee);
  document.querySelector("#total").textContent = formatVND(totals.total);
}

function clearErrors() {
  for (const target of Object.values(errorTargets)) {
    target.message.textContent = "";
    target.input.removeAttribute("aria-invalid");
  }
}

function showErrors(errors) {
  clearErrors();
  for (const [field, message] of Object.entries(errors)) {
    const target = errorTargets[field];
    target.message.textContent = message;
    target.input.setAttribute("aria-invalid", "true");
  }
  errorTargets[Object.keys(errors)[0]]?.input.focus();
}

function updatePaymentDescription(method) {
  const descriptions = {
    cod: "Mô phỏng chọn tiền mặt khi nhận hàng. Không có đơn hàng nào được gửi đi.",
    "bank-transfer": "Mô phỏng chuyển khoản. Không hiển thị thông tin tài khoản và không có giao dịch thật.",
    ewallet: "Mô phỏng ví điện tử. Không kết nối ví, không nhập mật khẩu hoặc mã OTP."
  };
  document.querySelector("#payment-disclaimer").textContent = descriptions[method] ?? "Chọn phương thức để xem thông tin mô phỏng.";
}

function resetConfirmation() {
  confirmation.hidden = true;
}

function submitDemo(event) {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const errors = validateCheckout(values);
  if (Object.keys(errors).length > 0) {
    showErrors(errors);
    return;
  }

  clearErrors();
  document.querySelector("#confirmed-name").textContent = values.fullName.trim();
  document.querySelector("#confirmation-detail").textContent =
    `${getPaymentLabel(values.paymentMethod)} · Tổng mẫu ${document.querySelector("#total").textContent}.`;
  confirmation.hidden = false;
  confirmation.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

try {
  const cartItems = normalizeCartItems(sampleCart);
  renderOrder(cartItems);
  showTotals();
} catch (error) {
  document.querySelector("#order-items").textContent = "Không thể tải giỏ hàng mẫu.";
  document.querySelector("#total").textContent = "Chưa có tổng tiền";
  console.error("Không thể khởi tạo trang thanh toán mô phỏng:", error);
}

form.addEventListener("submit", submitDemo);
form.addEventListener("input", resetConfirmation);
form.addEventListener("change", (event) => {
  if (event.target.name === "paymentMethod") {
    updatePaymentDescription(event.target.value);
    errorTargets.paymentMethod.message.textContent = "";
    errorTargets.paymentMethod.input.removeAttribute("aria-invalid");
  }
  resetConfirmation();
});
document.querySelector("#try-again").addEventListener("click", () => {
  form.reset();
  clearErrors();
  updatePaymentDescription("");
  resetConfirmation();
  document.querySelector("#customer-name").focus();
});