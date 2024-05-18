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
    })
    .catch((error) => {
      showLogin();
      console.error("There was a problem with your fetch operation:", error);
    });
};

const test = document.getElementById("btn-oauth-ft");

var currentHostname = window.location.hostname;

test.href = test.href.replace("localhost", currentHostname);
