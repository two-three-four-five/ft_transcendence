import { getServerHost } from "/src/scripts/utils/var.js";

export async function verifyToken() {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.error(`Error: cannot login without access token`);
    return false;
  }

  const path = "v1/auth/token/verify/";
  const jsonToken = { token: accessToken };

  const verifyTokenSuccess = await postAPI(path, jsonToken);
  if (verifyTokenSuccess) {
    return true;
  } else {
    return false;
  }
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

    if (!response.ok)
      throw new Error(`GET ${url} ${response.status} (${response.statusText})`);

    return await response.json();
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
      },
      body: JSON.stringify(jsonData),
    });

    if (!response.ok)
      throw new Error(
        `POST ${url} ${response.status} (${response.statusText})`
      );

    return await response.json();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return null;
  }
}
