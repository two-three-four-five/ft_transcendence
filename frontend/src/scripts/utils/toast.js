export function showToast(header, message) {
  let toast = document.createElement("div");

  toast.classList.add("toast");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  // Create the toast header
  let toastHeader = document.createElement("div");
  toastHeader.classList.add("toast-header");
  let title = document.createElement("strong");
  title.classList.add("me-auto");

  title.textContent = header;
  let button = document.createElement("button");
  button.classList.add("btn-close");
  button.setAttribute("type", "button");
  button.setAttribute("data-bs-dismiss", "toast");
  button.setAttribute("aria-label", "Close");
  toastHeader.appendChild(title);
  toastHeader.appendChild(button);

  // Create the toast body
  let body = document.createElement("div");
  body.classList.add("toast-body");
  body.textContent = message;

  // Append toastHeader and body to the toast element
  toast.appendChild(toastHeader);
  toast.appendChild(body);

  // Append the toast element to the toast container
  document.querySelector(".toast-container").appendChild(toast);

  // Initialize the toast and show it
  let bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}
