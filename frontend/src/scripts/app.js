import { switchApp } from "/src/scripts/utils/display.js";
import { login } from "/src/scripts/view/login.js";
import { setNavbar } from "/src/scripts/view/navbar.js";
import { setHome } from "/src/scripts/view/home.js";

window.addEventListener("load", login);
document.addEventListener("DOMContentLoaded", switchApp);

setNavbar();
setLogin();
setHome();
