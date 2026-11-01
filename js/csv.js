export function parseCSV(text) {
  if (typeof text !== "string") {
    throw new TypeError("Dữ liệu CSV phải là chuỗi.");
  }

  const source = text.replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (inQuotes) {
      if (character === '"' && source[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        inQuotes = false;
      } else {
        cell += character;
      }
    } else if (character === '"' && cell === "") {
      inQuotes = true;
    } else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && source[index + 1] === "\n") index += 1;
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }

  if (inQuotes) {
    throw new SyntaxError("CSV có ô mở dấu nháy kép nhưng chưa đóng.");
  }
  row.push(cell);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  if (rows.length === 0) return [];

  const headers = rows[0].map((header) => header.trim());
  if (headers.some((header) => header === "")) {
    throw new SyntaxError("CSV có tiêu đề cột rỗng.");
  }
  if (new Set(headers).size !== headers.length) {
    throw new SyntaxError("CSV có tiêu đề cột bị trùng.");
  }

  return rows.slice(1).map((values) => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = values[index] ?? "";
    });
    return record;
  }).filter((record) => Object.values(record).some((value) => value.trim() !== ""));
}

export async function loadCSV(url) {
  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error(`Không thể truy cập ${url}. Hãy mở trang bằng web server tĩnh.`, { cause: error });
  }
  if (!response.ok) {
    throw new Error(`Không tải được ${url} (HTTP ${response.status}).`);
  }
  return parseCSV(await response.text());
}

export function toNumber(value) {
  const normalized = String(value ?? "").trim();
  if (normalized === "") throw new TypeError("Giá trị số đang bị trống.");
  const number = Number(normalized);
  if (!Number.isSafeInteger(number)) throw new TypeError(`Giá trị không phải số nguyên hợp lệ: ${normalized}`);
  return number;
}

export function toBool(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  throw new TypeError(`Giá trị boolean không hợp lệ: ${normalized}`);
}

export function toList(value) {
  const normalized = String(value ?? "").trim();
  return normalized === "" ? [] : normalized.split("|").map((item) => item.trim()).filter(Boolean);
}