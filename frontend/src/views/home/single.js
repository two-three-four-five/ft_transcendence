import SocketManager from "../../utils/socket.js";

import { navigateTo } from "../../utils/display.js";

const startBtn = document.getElementById("single-game-start");

const opponentScore = document.getElementById("single-game-opponent-score");
const myScore = document.getElementById("single-game-my-score");
const opponentSlider = document.getElementById("single-game-opponent-slider");
const mySlider = document.getElementById("single-game-my-slider");
const ball = document.getElementById("single-game-ball");

let handleKeydown = function (event) {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    SocketManager.send(
      "single",
      JSON.stringify({ type: "slider", direction: event.key })
    );
  }
};

let handleStartClick = function (event) {
  SocketManager.send("single", JSON.stringify({ type: "start" }));
};

export function updateSinglePlay() {
  initSinglePlaySocket();

  startBtn.removeEventListener("click", handleStartClick);
  startBtn.addEventListener("click", handleStartClick);
}

function initSinglePlaySocket() {
  SocketManager.initSocket("single", "games/single/");

  SocketManager.setOpenHandler("single", (event) => {
    console.log("Websocket connection opened:", event);
    SocketManager.send("single", JSON.stringify({ type: "join" }));
  });

  SocketManager.setCloseHandler("single", (event) => {
    console.log("Websocket closed unexpectedly:", event);
    document.removeEventListener("keydown", handleKeydown);
  });

  SocketManager.setErrorHandler("single", (event) => {
    console.error("WebSocket error observed:", event);
  });

  SocketManager.setMessageHandler("single", (event) => {
    const data = JSON.parse(event.data);
    console.log(data);

    if (data.type === "game_start") {
      document.addEventListener("keydown", handleKeydown);
      navigateTo("app-single-game", false);
    } else if (data.type === "update") {
      ball.style.left = data.ball[0] + "%";
      ball.style.top = data.ball[1] + "%";
      opponentSlider.style.left = data.host_slider + "%";
      mySlider.style.left = data.guest_slider + "%";
      opponentScore.textContent = data.host_score;
      myScore.textContent = data.guest_score;
    } else if (data.type === "finish") {
      SocketManager.close("single");
      document.removeEventListener("keydown", handleKeydown);
    }
  });
}
