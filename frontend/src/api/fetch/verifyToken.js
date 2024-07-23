import { API_CONFIG } from "/src/utils/variables.js";
import { getCookie } from "./getCookie.js";
import { refreshAccessToken } from "./refreshAccessToken.js";

async function verifyToken() {
  try {
    const url = API_CONFIG.BASE_URL + "/" + API_CONFIG.ENDPOINT.TOKEN.VERIFY;
    let accessToken = localStorage.getItem("accessToken");
    let jsonTokenData = { token: accessToken };
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(jsonTokenData),
    });
    if (!response.ok) {
      accessToken = await refreshAccessToken();
      jsonTokenData = { token: accessToken };
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(jsonTokenData),
      });
    }
    return response.ok;
  } catch {
    return false;
  }
}

export { verifyToken };
