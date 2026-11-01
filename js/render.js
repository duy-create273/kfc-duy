export function formatVND(amount) {
  return `${new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(amount)}đ`;
}

export function categoryLabel(key) {
  const labels = {
    "ga-ran": "Gà rán",
    burger: "Burger",
    "mon-phu": "Món phụ",
    "do-uong": "Đồ uống"
  };
  return labels[key] ?? key;
}

export function fallbackEmoji(category) {
  const icons = { "ga-ran": "🍗", burger: "🍔", "mon-phu": "🍟", "do-uong": "🥤" };
  return icons[category] ?? "🍽️";
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function makeArt(image, alt, category, className = "card__art") {
  const art = makeElement("div", className);
  const safeFilename = /^[a-z0-9-]+\.svg$/i.test(image) ? image : "";
  if (!safeFilename) {
    art.append(makeElement("span", "card__emoji", fallbackEmoji(category)));
    return art;
  }

  const picture = document.createElement("img");
  picture.src = `assets/img/${safeFilename}`;
  picture.alt = alt;
  picture.width = 132;
  picture.height = 128;
  picture.loading = "lazy";
  picture.addEventListener("error", () => {
    const fallback = makeElement("span", "card__emoji", fallbackEmoji(category));
    art.replaceChildren(fallback);
  }, { once: true });
  art.append(picture);
  return art;
}

function makeProductCard(item) {
  const card = makeElement("article", "card");
  card.append(makeArt(item.image, `Minh họa ${item.name}`, item.category));
  const body = makeElement("div", "card__body");
  const meta = makeElement("div", "card__meta");
  meta.append(makeElement("span", "card__category", categoryLabel(item.category)));
  if (item.is_bestseller) meta.append(makeElement("span", "badge", "Bán chạy"));
  const title = makeElement("h3", "", item.name);
  const description = makeElement("p", "card__description", item.description);
  const price = makeElement("p", "card__price", formatVND(item.price));
  body.append(meta, title, description, price);
  card.append(body);
  return card;
}

export function renderBestsellers(items, element) {
  const bestsellers = items.filter((item) => item.is_bestseller);
  renderCards(bestsellers, element, "Chưa có món bán chạy để hiển thị.");
}

function renderCards(items, element, emptyMessage) {
  if (items.length === 0) {
    element.replaceChildren(makeElement("p", "empty-note", emptyMessage));
  } else {
    element.replaceChildren(...items.map(makeProductCard));
  }
  element.setAttribute("aria-busy", "false");
}

export function renderMenu(items, element, category = "all") {
  const visibleItems = category === "all" ? items : items.filter((item) => item.category === category);
  renderCards(visibleItems, element, "Danh mục này hiện chưa có món.");
}

export function renderCategoryChips(categories, element, onSelect) {
  const options = [{ key: "all", label: "Tất cả món" }, ...categories.map((key) => ({ key, label: categoryLabel(key) }))];
  element.replaceChildren(...options.map(({ key, label }, index) => {
    const chip = makeElement("button", "chip", label);
    chip.type = "button";
    chip.dataset.category = key;
    chip.setAttribute("aria-pressed", String(index === 0));
    chip.addEventListener("click", () => {
      element.querySelectorAll(".chip").forEach((button) => button.setAttribute("aria-pressed", String(button === chip)));
      onSelect(key);
    });
    return chip;
  }));
}

export function renderCombos(items, element) {
  if (items.length === 0) {
    element.replaceChildren(makeElement("p", "empty-note", "Hiện chưa có combo khả dụng."));
    element.setAttribute("aria-busy", "false");
    return;
  }

  const cards = items.map((combo) => {
    const card = makeElement("article", "card card--combo");
    card.append(makeArt(combo.image, `Minh họa ${combo.name}`, "ga-ran"));
    const body = makeElement("div", "card__body");
    const meta = makeElement("div", "card__meta");
    meta.append(makeElement("span", "card__category", "COMBO"));
    if (combo.badge) meta.append(makeElement("span", "badge", combo.badge));
    body.append(meta, makeElement("h3", "", combo.name));
    const itemsText = makeElement("p", "card__items", combo.items.join(" · "));
    const priceLine = makeElement("div", "card__price-line");
    priceLine.append(makeElement("strong", "", formatVND(combo.price)), makeElement("del", "", formatVND(combo.original_price)));
    const saving = Math.max(0, Math.round((1 - combo.price / combo.original_price) * 100));
    body.append(itemsText, priceLine, makeElement("p", "card__saving", `Tiết kiệm ${saving}% so với giá lẻ mẫu`));
    card.append(body);
    return card;
  });
  element.replaceChildren(...cards);
  element.setAttribute("aria-busy", "false");
}

export function renderPromotions(items, element, today) {
  const currentPromotions = items.filter((promotion) => promotion.active && promotion.start_date <= today && promotion.end_date >= today);
  if (currentPromotions.length === 0) {
    element.replaceChildren(makeElement("p", "empty-note", "Hiện chưa có ưu đãi mẫu đang áp dụng."));
    element.setAttribute("aria-busy", "false");
    return;
  }

  const cards = currentPromotions.map((promotion) => {
    const card = makeElement("article", "promo");
    card.append(makeElement("h3", "", promotion.title), makeElement("p", "", promotion.description));
    card.append(makeElement("p", "promo__date", `Có hiệu lực đến ${formatDate(promotion.end_date)}`));
    const codeRow = makeElement("div", "promo__code-row");
    codeRow.append(makeElement("span", "promo__code", promotion.code));
    const copyButton = makeElement("button", "promo__copy", "Sao chép mã");
    copyButton.type = "button";
    copyButton.dataset.code = promotion.code;
    copyButton.setAttribute("aria-label", `Sao chép mã ${promotion.code}`);
    codeRow.append(copyButton);
    card.append(codeRow);
    return card;
  });
  element.replaceChildren(...cards);
  element.setAttribute("aria-busy", "false");
}

function formatDate(isoDate) {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

export function renderTestimonials(items, element) {
  if (items.length === 0) {
    element.replaceChildren(makeElement("p", "empty-note", "Chưa có đánh giá mẫu."));
    element.setAttribute("aria-busy", "false");
    return;
  }
  const cards = items.map((review) => {
    const card = makeElement("article", "review");
    const stars = makeElement("p", "review__stars", `${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}`);
    stars.setAttribute("aria-label", `${review.rating} trên 5 sao`);
    card.append(stars, makeElement("p", "review__comment", `“${review.comment}”`), makeElement("p", "review__name", review.name));
    return card;
  });
  element.replaceChildren(...cards);
  element.setAttribute("aria-busy", "false");
}

export function renderStores(items, element, city = "all") {
  const visibleStores = city === "all" ? items : items.filter((store) => store.city === city);
  if (visibleStores.length === 0) {
    element.replaceChildren(makeElement("p", "empty-note", "Không có cửa hàng mẫu ở thành phố này."));
    element.setAttribute("aria-busy", "false");
    return;
  }
  const cards = visibleStores.map((store) => {
    const card = makeElement("article", "store");
    card.append(makeElement("h3", "", store.name));
    card.append(makeElement("p", "", `${store.address}, ${store.district}, ${store.city}`));
    card.append(makeElement("p", "", `Giờ mở cửa mẫu: ${store.open_hours}`));
    const phone = makeElement("a", "", `Gọi ${store.phone}`);
    phone.href = `tel:${store.phone.replace(/[^\d+]/g, "")}`;
    card.append(phone);
    return card;
  });
  element.replaceChildren(...cards);
  element.setAttribute("aria-busy", "false");
}