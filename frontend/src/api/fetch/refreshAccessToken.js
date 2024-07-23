import { API_CONFIG } from "/src/utils/variables.js";
import { getCookie } from "./getCookie.js";

async function refreshAccessToken() {
  try {
    const url = API_CONFIG.BASE_URL + "/" + API_CONFIG.ENDPOINT.TOKEN.REFRESH;
    let refreshToken = localStorage.getItem("refreshToken");
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    localStorage.setItem("accessToken", data.access);
    console.log("accessToken updated");
    return data.access;
  } catch {
    console.error(`Error: ${err.message}`);
    return null;
  }
}

export { refreshAccessToken };
