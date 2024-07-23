import { setAppSwitch, navigateTo } from "/src/utils/display.js";
import { login, setLogin } from "/src/utils/login.js";
import { setHome, updateHome } from "/src/views/home.js";
import { setNavbar, updateNavbar, initWebSocket } from "/src/views/navbar.js";

function setApp() {
  setLogin();
  setHome();
  setNavbar();
  setAppSwitch();
}

document.addEventListener("DOMContentLoaded", async function () {
  setApp();
  const loginSuccess = await login();
  if (loginSuccess) {
    navigateTo("app-home", false);
    updateHome();
    updateNavbar();
    initWebSocket();
  } else {
    navigateTo("app-login", false);
  }
});
