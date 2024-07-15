import { formatDate } from "/src/scripts/utils/datetime.js";
import { getSocialTypeName } from "/src/scripts/utils/var.js";

const mypageProfileNameCardNickname = document.getElementById(
  "mypage-profile-name-card-nickname"
);

const mypageProfileNameCardRegisterDate = document.getElementById(
  "mypage-profile-name-card-register-date"
);

export function updateMypage() {
  /* PROFILE */
  // getItem 실패시 -> users/me GET 요청
  // GET 요청 실패시 -> default 값
  mypageProfileNameCardNickname.textContent = localStorage.getItem("nickname");
  mypageProfileNameCardRegisterDate.textContent =
    formatDate(localStorage.getItem("date_joined")) +
    " " +
    getSocialTypeName(localStorage.getItem("social_type")) +
    " 가입";
}
