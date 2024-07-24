import { API_CONFIG, HTTPCODE } from "/src/utils/variables.js";
import { getCookie } from "./api/getCookie.js";

class Api {
  static async request(method, path, jsonData = null) {
    try {
      const url = `${API_CONFIG.BASE_URL}/${path}`;
      let accessToken = localStorage.getItem("accessToken");
      let headers = {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      };
      let options = {
        method,
        headers,
      };
      if (jsonData) {
        options.body = JSON.stringify(jsonData);
      }
      let response = await fetch(url, options);
      if (response.status == HTTPCODE.UNAUTHORIZED) {
        accessToken = await this.refreshAccessToken();
        headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(url, options);
      }
      return response;
    } catch (err) {
      console.error(`${method} request failed: ${err.message}`);
      return null;
    }
  }
  static async get(path) {
    return Api.request("GET", path);
  }

  static async post(path, jsonData) {
    return Api.request("POST", path, jsonData);
  }

  static async verifyAccessToken() {
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      return false;
    }
    let response = await this.post(API_CONFIG.ENDPOINT.TOKEN.VERIFY, {
      token: accessToken,
    });
    return response.ok;
  }

  static async refreshAccessToken() {
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
      console.log(`AccessToken updated: ${Date()}`);
      return data.access;
    } catch {
      console.error(`Error: ${err.message}`);
      return null;
    }
  }
}

export default Api;
