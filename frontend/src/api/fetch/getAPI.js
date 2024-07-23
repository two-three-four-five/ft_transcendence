import { API_CONFIG, HTTPCODE } from "/src/utils/variables.js";
import { refreshAccessToken } from "./refreshAccessToken.js";

async function getAPI(path) {
  try {
    const url = API_CONFIG.BASE_URL + "/" + path;
    let accessToken = localStorage.getItem("accessToken");
    let response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    if (response.status == HTTPCODE.UNAUTHORIZED) {
      accessToken = await refreshAccessToken();
      response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
    }
    return response;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return null;
  }
}

export { getAPI };
