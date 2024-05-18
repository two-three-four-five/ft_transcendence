// import { showErrorPage404 } from "./view/errorPage.js";
import { showHome } from "./view/home.js";
import { showLogin } from "./view/login.js";

window.onload = function () {
  const hash = window.location.hash.substr(1);
  const tokens = new URLSearchParams(hash);
  var accessToken = tokens.get("access_token");
  const refreshToken = tokens.get("refresh_token");

  // 토큰이 존재할 때만 localStorage에 저장
  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (window.location.hash) {
    // Set the URL without the hash part
    window.history.replaceState(null, document.title, window.location.pathname);
  }

  if (accessToken == null) accessToken = localStorage.getItem("accessToken");
  const url = "http://10.13.1.7:8000/v1/users/test";
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + accessToken,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      showHome();
      console.log(data);

      let toast = document.createElement("div");
      toast.classList.add("toast");
      toast.setAttribute("role", "alert");
      toast.setAttribute("aria-live", "assertive");
      toast.setAttribute("aria-atomic", "true");

      // Create the toast header
      let header = document.createElement("div");
      header.classList.add("toast-header");
      let title = document.createElement("strong");
      title.classList.add("me-auto");
      title.textContent = "Login Success";
      let button = document.createElement("button");
      button.classList.add("btn-close");
      button.setAttribute("type", "button");
      button.setAttribute("data-bs-dismiss", "toast");
      button.setAttribute("aria-label", "Close");
      header.appendChild(title);
      header.appendChild(button);

      // Create the toast body
      let body = document.createElement("div");
      body.classList.add("toast-body");
      body.textContent = "Welcome, " + data.substring(1, data.lastIndexOf("@"));

      // Append header and body to the toast element
      toast.appendChild(header);
      toast.appendChild(body);

      // Append the toast element to the toast container
      document.querySelector(".toast-container").appendChild(toast);

      // Initialize the toast and show it
      let bsToast = new bootstrap.Toast(toast);
      bsToast.show();
    })
    .catch((error) => {
      showLogin();
      console.error("There was a problem with your fetch operation:", error);
    });
};

const test = document.getElementById("btn-oauth-ft");

var currentHostname = window.location.hostname;

test.href = test.href.replace("localhost", currentHostname);
