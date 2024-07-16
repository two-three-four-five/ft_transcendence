import { getServerHost } from "/src/scripts/utils/var.js";

export async function verifyToken() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error(`Error: cannot login without access token`);
    return false;
  }

  const path = "v1/auth/token/verify/";
  const jsonToken = { token: accessToken };

  const response = await postAPI(path, jsonToken);
  return response.ok;
}

export async function getAPI(path) {
  const accessToken = localStorage.getItem("accessToken");
  const url = getServerHost() + "/" + path;
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
    return response;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return null;
  }
}

export async function postAPI(path, jsonData) {
  const accessToken = localStorage.getItem("accessToken");
  const url = getServerHost() + "/" + path;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify(jsonData),
    });
    return response;
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return null;
  }
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
