import { switchApp, navigateTo } from "/src/scripts/utils/display.js";
import { login, setLogin } from "/src/scripts/view/login.js";
import { setNavbar } from "/src/scripts/view/navbar.js";
import { setHome } from "/src/scripts/view/home.js";
import { alertNotifications } from "/src/scripts/view/navbar/notifications.js";

document.addEventListener("DOMContentLoaded", async function () {
  setLogin();
  switchApp();

  const loginSuccess = await login();
  if (loginSuccess) {
    navigateTo("app-home", false);
    setHome();
    setNavbar();
    alertNotifications();
  } else {
    navigateTo("app-login", false);
  }
});
