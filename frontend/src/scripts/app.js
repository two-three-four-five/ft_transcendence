import { setAppSwitch, navigateTo } from "/src/scripts/utils/display.js";
import { setHome, updateHome } from "/src/scripts/view/home.js";
import { login, setLogin } from "/src/scripts/view/login.js";
import { setNavbar, updateNavbar } from "/src/scripts/view/navbar.js";
import { alertNotifications } from "/src/scripts/view/navbar/notifications.js";

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
    alertNotifications();
  } else {
    navigateTo("app-login", false);
  }
});
