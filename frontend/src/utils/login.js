import { verifyToken } from "/src/api/fetch.js";
import { API_CONFIG } from "/src/utils/variables.js";

const ftLoginButton = document.getElementById("btn-oauth-ft");
const googleLoginButton = document.getElementById("btn-oauth-google");
const naverLoginButton = document.getElementById("btn-oauth-naver");
const kakaoLoginButton = document.getElementById("btn-oauth-kakao");

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function setLogin() {
  ftLoginButton.href = API_CONFIG.BASE_URL + "/v1/auth/oauth/ft";
  googleLoginButton.href = API_CONFIG.BASE_URL + "/v1/auth/oauth/google";
  naverLoginButton.href = API_CONFIG.BASE_URL + "/v1/auth/oauth/naver";
  kakaoLoginButton.href = API_CONFIG.BASE_URL + "/v1/auth/oauth/kakao";
}

export async function login() {
  const hash = window.location.hash.substring(1);
  const tokens = new URLSearchParams(hash);

  let accessToken = tokens.get("access_token");
  let refreshToken = tokens.get("refresh_token");

  if (accessToken) {
    localStorage.setItem("accessToken", accessToken);
  }
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  if (window.location.hash) {
    window.history.replaceState(null, document.title, window.location.pathname);
  }

  return await verifyToken();
}
