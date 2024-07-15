import { updateNotifications } from "/src/scripts/view/navbar/notifications.js";
import {
  setAddFriend,
  setFriends,
  updateFriends,
  updateFriendRequests,
} from "/src/scripts/view/navbar/friends.js";

export function setNavbar() {
  setLogout();
  setBack();
  setFriends();
}

function setLogout() {
  const navLogoutBtn = document.getElementById("nav-logout-btn");
  navLogoutBtn.addEventListener("click", function () {
    window.localStorage.clear();
    window.history.replaceState(null, document.title, window.location.origin);
    location.reload(true);
  });
}

function setBack() {
  const navBackBtn = document.getElementById("nav-back-btn");
  navBackBtn.addEventListener("click", function () {
    window.history.back();
  });
}

export function updateNavbar() {
  setAddFriend();
  updateNotifications();
  updateFriends();
  updateFriendRequests();
}
