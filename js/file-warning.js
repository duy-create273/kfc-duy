if (window.location.protocol === "file:") {
  document.querySelectorAll("[aria-busy='true']").forEach((element) => {
    const message = document.createElement("p");
    message.className = "data-error";
    message.textContent = "Trình duyệt không đọc được CSV khi mở trực tiếp bằng file://. Hãy mở trang bằng Live Server hoặc web server tĩnh (xem README).";
    element.replaceChildren(message);
    element.setAttribute("aria-busy", "false");
  });
}