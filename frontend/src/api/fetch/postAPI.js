import { API_CONFIG, HTTPCODE } from "/src/utils/variables.js";
import { getCookie } from "./getCookie.js";
import { refreshAccessToken } from "./refreshAccessToken.js";

async function postAPI(path, jsonData) {
  try {
    const url = API_CONFIG.BASE_URL + "/" + path;
    let accessToken = localStorage.getItem("accessToken");
    let response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(jsonData),
    });
    if (response.status == HTTPCODE.UNAUTHORIZED) {
      accessToken = await refreshAccessToken();
      response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify(jsonData),
      });
    }
    return response;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return null;
  }
}

export { postAPI };
