var SUPPORTING_COLORS = [
  "black",
  "white",
  "grey",
  "red",
  "green",
  "blue",
  "yellow",
];

export function showToast(symbol, color, message) {
  let toast = document.createElement("div");

  toast.classList.add("toast");
  toast.classList.add("border-radius-16");
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  // Create the toast body
  let body = document.createElement("div");
  body.classList.add(
    "toast-body",
    "p-3",
    "d-flex",
    "flex-row",
    "justify-content-start",
    "align-items-center",
    "gap-3"
  );

  let icon = document.createElement("span");
  if (!SUPPORTING_COLORS.includes(color)) color = "green";
  icon.classList.add(color);
  icon.classList.add("material-symbols-rounded");
  icon.textContent = symbol;

  let text = document.createElement("span");
  text.classList.add("small");
  text.classList.add("black");
  text.textContent = message;

  body.appendChild(icon);
  body.appendChild(text);

  // Append toastHeader and body to the toast element
  toast.appendChild(body);

  // Append the toast element to the toast container
  document.querySelector(".toast-container").appendChild(toast);

  // Initialize the toast and show it
  let bsToast = new bootstrap.Toast(toast);
  bsToast.show();
}
