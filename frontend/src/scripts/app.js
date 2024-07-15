import { switchApp } from "/src/scripts/utils/display.js";
import { login, setLogin } from "/src/scripts/view/login.js";
import { setNavbar } from "/src/scripts/view/navbar.js";
import { setHome } from "/src/scripts/view/home.js";

// window.addEventListener("load", login);

async function test() {
  await login();
  setLogin();
  switchApp();
  setNavbar();
  setHome();
}
document.addEventListener("DOMContentLoaded", function () {
  test();
});
