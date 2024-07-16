import { verifyToken } from "/src/scripts/utils/fetch.js";
import { getServerHost } from "/src/scripts/utils/var.js";

const ftLoginButton = document.getElementById("btn-oauth-ft");
const googleLoginButton = document.getElementById("btn-oauth-google");
const naverLoginButton = document.getElementById("btn-oauth-naver");
const kakaoLoginButton = document.getElementById("btn-oauth-kakao");

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export async function setLogin() {
  ftLoginButton.href = getServerHost() + "/v1/auth/oauth/ft";
  googleLoginButton.href = getServerHost() + "/v1/auth/oauth/google";
  naverLoginButton.href = getServerHost() + "/v1/auth/oauth/naver";
  kakaoLoginButton.href = getServerHost() + "/v1/auth/oauth/kakao";
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
