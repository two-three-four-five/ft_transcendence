import { API_CONFIG, HTTPCODE } from "/src/utils/variables.js";

class Api {
  static async get(path) {
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
        accessToken = await Api.refreshAccessToken();
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

  static async post(path, jsonData) {
    try {
      const url = API_CONFIG.BASE_URL + "/" + path;
      let accessToken = localStorage.getItem("accessToken");
      let response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + accessToken,
          "Content-Type": "application/json",
          "X-CSRFToken": Api.getCookie("csrftoken"),
        },
        body: JSON.stringify(jsonData),
      });
      if (response.status == HTTPCODE.UNAUTHORIZED) {
        accessToken = await Api.refreshAccessToken();
        response = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: "Bearer " + accessToken,
            "Content-Type": "application/json",
            "X-CSRFToken": Api.getCookie("csrftoken"),
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

  static getCookie(name) {
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

  static async refreshAccessToken() {
    try {
      const url = API_CONFIG.BASE_URL + "/" + API_CONFIG.ENDPOINT.TOKEN.REFRESH;
      let refreshToken = localStorage.getItem("refreshToken");
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Api.getCookie("csrftoken"),
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

  static async verifyToken() {
    try {
      const url = API_CONFIG.BASE_URL + "/" + API_CONFIG.ENDPOINT.TOKEN.VERIFY;
      let accessToken = localStorage.getItem("accessToken");
      let jsonTokenData = { token: accessToken };
      let response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": Api.getCookie("csrftoken"),
        },
        body: JSON.stringify(jsonTokenData),
      });
      if (!response.ok) {
        accessToken = await Api.refreshAccessToken();
        jsonTokenData = { token: accessToken };
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": Api.getCookie("csrftoken"),
          },
          body: JSON.stringify(jsonTokenData),
        });
      }
      return response.ok;
    } catch {
      return false;
    }
  }
}

export default Api;
