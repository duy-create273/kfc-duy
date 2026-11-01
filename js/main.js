import { loadCSV, toBool, toList, toNumber } from "./csv.js";
import {
  renderBestsellers,
  renderCategoryChips,
  renderCombos,
  renderMenu,
  renderPromotions,
  renderStores,
  renderTestimonials
} from "./render.js";

const DATA_FILES = {
  menu: "data/menu.csv",
  combos: "data/combos.csv",
  promotions: "data/promotions.csv",
  stores: "data/stores.csv",
  testimonials: "data/testimonials.csv"
};
const menuGrid = document.querySelector("#menu-grid");
let menuItems = [];
let storeItems = [];
let selectedCategory = "all";
let selectedCity = "all";
let toastTimer;

function validNameRow(row, fileName, labelColumn = "name") {
  if (!row.id || !row[labelColumn]?.trim()) {
    console.warn(`Bỏ dòng thiếu id/${labelColumn} trong ${fileName}.`, row);
    return false;
  }
  return true;
}

function parseMenu(rows) {
  return rows.flatMap((row) => {
    try {
      if (!validNameRow(row, DATA_FILES.menu)) return [];
      const price = toNumber(row.price);
      if (price < 0) throw new TypeError("Giá không được âm.");
      return [{
        id: toNumber(row.id),
        name: row.name.trim(),
        category: row.category.trim(),
        description: row.description.trim(),
        price,
        image: row.image.trim(),
        is_bestseller: toBool(row.is_bestseller),
        is_available: toBool(row.is_available)
      }];
    } catch (error) {
      console.warn(`Bỏ dòng thực đơn không hợp lệ: ${error.message}`, row);
      return [];
    }
  }).filter((item) => item.is_available);
}

function parseCombos(rows) {
  return rows.flatMap((row) => {
    try {
      if (!validNameRow(row, DATA_FILES.combos)) return [];
      const price = toNumber(row.price);
      const originalPrice = toNumber(row.original_price);
      if (price < 0 || originalPrice <= 0) throw new TypeError("Giá combo không hợp lệ.");
      return [{
        id: toNumber(row.id),
        name: row.name.trim(),
        items: toList(row.items),
        price,
        original_price: originalPrice,
        badge: row.badge.trim(),
        image: row.image.trim(),
        is_available: toBool(row.is_available)
      }];
    } catch (error) {
      console.warn(`Bỏ dòng combo không hợp lệ: ${error.message}`, row);
      return [];
    }
  }).filter((item) => item.is_available);
}

function parsePromotions(rows) {
  return rows.flatMap((row) => {
    try {
      if (!validNameRow(row, DATA_FILES.promotions, "title")) return [];
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.start_date) || !/^\d{4}-\d{2}-\d{2}$/.test(row.end_date)) {
        throw new TypeError("Ngày ưu đãi phải theo YYYY-MM-DD.");
      }
      if (row.end_date < row.start_date) throw new TypeError("Ngày kết thúc trước ngày bắt đầu.");
      return [{
        id: toNumber(row.id),
        title: row.title.trim(),
        description: row.description.trim(),
        code: row.code.trim(),
        start_date: row.start_date,
        end_date: row.end_date,
        active: toBool(row.active)
      }];
    } catch (error) {
      console.warn(`Bỏ dòng ưu đãi không hợp lệ: ${error.message}`, row);
      return [];
    }
  });
}

function parseStores(rows) {
  return rows.flatMap((row) => {
    if (!validNameRow(row, DATA_FILES.stores)) return [];
    return [{
      id: row.id.trim(),
      name: row.name.trim(),
      address: row.address.trim(),
      district: row.district.trim(),
      city: row.city.trim(),
      phone: row.phone.trim(),
      open_hours: row.open_hours.trim()
    }];
  });
}

function parseTestimonials(rows) {
  return rows.flatMap((row) => {
    try {
      if (!validNameRow(row, DATA_FILES.testimonials)) return [];
      const rating = toNumber(row.rating);
      if (rating < 1 || rating > 5) throw new TypeError("Số sao phải từ 1 đến 5.");
      return [{ id: row.id.trim(), name: row.name.trim(), rating, comment: row.comment.trim() }];
    } catch (error) {
      console.warn(`Bỏ dòng đánh giá không hợp lệ: ${error.message}`, row);
      return [];
    }
  });
}

function setDataError(element, label, error) {
  const message = document.createElement("p");
  message.className = "data-error";
  message.textContent = `Không tải được ${label}. Hãy mở trang bằng Live Server hoặc web server tĩnh (xem README).`;
  element.replaceChildren(message);
  element.setAttribute("aria-busy", "false");
  console.error(`Lỗi tải ${label}:`, error);
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2000);
}

async function copyPromotionCode(code) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error("Clipboard API không khả dụng.");
    await navigator.clipboard.writeText(code);
    showToast("Đã sao chép mã");
  } catch {
    showToast("Không thể sao chép tự động. Hãy chọn và sao chép mã.");
  }
}

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

async function loadSection(key, target, label, transform, render) {
  try {
    const rows = await loadCSV(DATA_FILES[key]);
    const data = transform(rows);
    render(data);
  } catch (error) {
    setDataError(target, label, error);
  }
}

async function loadMenu() {
  const bestsellers = document.querySelector("#bestseller-list");
  try {
    const rows = await loadCSV(DATA_FILES.menu);
    menuItems = parseMenu(rows);
    renderBestsellers(menuItems, bestsellers);
    renderCategoryChips([...new Set(menuItems.map((item) => item.category))], document.querySelector("#menu-chips"), (category) => {
      selectedCategory = category;
      renderMenu(menuItems, menuGrid, selectedCategory);
    });
    renderMenu(menuItems, menuGrid, selectedCategory);
  } catch (error) {
    setDataError(bestsellers, "món bán chạy", error);
    setDataError(menuGrid, "thực đơn", error);
  }
}

async function loadPromotions() {
  const target = document.querySelector("#promo-list");
  try {
    const rows = await loadCSV(DATA_FILES.promotions);
    renderPromotions(parsePromotions(rows), target, localDateString());
  } catch (error) {
    setDataError(target, "ưu đãi", error);
  }
}

async function loadStores() {
  const target = document.querySelector("#store-list");
  try {
    storeItems = parseStores(await loadCSV(DATA_FILES.stores));
    const cities = [...new Set(storeItems.map((store) => store.city).filter(Boolean))].sort((a, b) => a.localeCompare(b, "vi"));
    const filter = document.querySelector("#store-filter");
    for (const city of cities) {
      const option = document.createElement("option");
      option.value = city;
      option.textContent = city;
      filter.append(option);
    }
    renderStores(storeItems, target, selectedCity);
  } catch (error) {
    setDataError(target, "cửa hàng", error);
  }
}

function bindNavigation() {
  const toggle = document.querySelector("#nav-toggle");
  const menu = document.querySelector("#nav-menu");
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Mở menu" : "Đóng menu");
    menu.classList.toggle("is-open", !isOpen);
  });
  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Mở menu");
      menu.classList.remove("is-open");
    }
  });
}

function bindInteractions() {
  bindNavigation();
  document.querySelector("#store-filter").addEventListener("change", (event) => {
    selectedCity = event.target.value;
    renderStores(storeItems, document.querySelector("#store-list"), selectedCity);
  });
  document.querySelector("#promo-list").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-code]");
    if (button) copyPromotionCode(button.dataset.code);
  });

  const revealItems = document.querySelectorAll(".section-heading, .reason, .why-heading");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => {
    item.classList.add("reveal");
    observer.observe(item);
  });
}

bindInteractions();
await Promise.all([
  loadMenu(),
  loadSection("combos", document.querySelector("#combo-list"), "combo", parseCombos, (items) => renderCombos(items, document.querySelector("#combo-list"))),
  loadPromotions(),
  loadStores(),
  loadSection("testimonials", document.querySelector("#review-list"), "đánh giá", parseTestimonials, (items) => renderTestimonials(items, document.querySelector("#review-list")))
]);