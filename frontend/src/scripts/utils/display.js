const navbar = document.getElementById("navbar");
const navLogoutBtn = document.getElementById("nav-logout-btn");
const navBackBtn = document.getElementById("nav-back-btn");

const apps = document.querySelectorAll(".container-app");

HTMLElement.prototype.show = function () {
  this.classList.replace("d-none", "d-block");
};

HTMLElement.prototype.hide = function () {
  this.classList.replace("d-block", "d-none");
};

function hideApps() {
  apps.forEach((app) => {
    app.hide();
  });
}

function showApp(targetApp) {
  const target = document.getElementById(targetApp);
  if (!target) {
    target = document.getElementById("app-login");
  }
  target.show();

  if (targetApp === "app-login" || targetApp === "app-spinner") {
    navbar.hide();
  } else if (targetApp === "app-home") {
    navbar.show();
    navLogoutBtn.show();
    navBackBtn.hide();
  } else {
    navbar.show();
    navLogoutBtn.hide();
    navBackBtn.show();
  }
}
export function navigateTo(targetApp, addToHistory = true) {
  hideApps();
  showApp(targetApp);

  if (addToHistory) {
    history.pushState({ page: targetApp }, "", "/" + targetApp);
  }
}

export function switchApp() {
  window.addEventListener("popstate", function (event) {
    if (event.state && event.state.page) {
      navigateTo(event.state.page, false);
    } else {
      navigateTo("app-home", false);
    }
  });
}
