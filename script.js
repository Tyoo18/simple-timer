let plps, clockDisplay, selectButtons;
let initialTimeInSeconds = 0;
let timeRemaining = 0;
let timerInterval = null;
let isRunning = false;

const circle = document.querySelector(".progress-ring__circle");
const radius = 101.3;
const circumference = 2 * Math.PI * radius;

if (circle) {
  circle.style.strokeDasharray = `${circumference}`;
  circle.style.strokeDashoffset = 0;
}

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  if (circle) circle.style.strokeDashoffset = offset;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function updateClockDisplay(seconds) {
  clockDisplay.textContent = formatTime(seconds);
}

function updateVisuals(total, remaining) {
  const progress = (remaining / total) * 100;
  setProgress(progress);
}

function timerFinishedNotification() {
  plps.textContent = "DONE!";
  plps.style.backgroundColor = "var(--accent-color)";
  selectButtons.forEach((btn) => btn.classList.remove("active"));
}

function setTimer(minutes) {
  stopTimer();
  initialTimeInSeconds = minutes * 60;
  timeRemaining = initialTimeInSeconds;
  updateClockDisplay(timeRemaining);
  setProgress(100);
  plps.textContent = "play";
  isRunning = false;
  plps.style.backgroundColor = "#797979";
}

function updateTimer() {
  if (timeRemaining > 0) {
    timeRemaining--;
    updateClockDisplay(timeRemaining);
    updateVisuals(initialTimeInSeconds, timeRemaining);
    plps.style.backgroundColor = "rgb(94, 92, 92)";
  } else {
    stopTimer();
    updateClockDisplay(0);
    updateVisuals(initialTimeInSeconds, 0);
    timerFinishedNotification();
  }
}

function startTimer() {
  if (timeRemaining > 0 && !isRunning) {
    isRunning = true;
    plps.textContent = "pause";
    plps.style.backgroundColor = "rgb(94, 92, 92)";
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    plps.textContent = "play";
    plps.style.backgroundColor = "#797979";
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
}

function handlePlayPauseReset() {
  if (timeRemaining === 0 && initialTimeInSeconds !== 0) {
    setTimer(initialTimeInSeconds / 60);
    startTimer();
  } else if (timeRemaining > 0) {
    if (isRunning) pauseTimer();
    else startTimer();
  } else if (initialTimeInSeconds === 0) {
    setTimer(5);
    document.getElementById("t5m").classList.add("active");
    startTimer();
  }
}

function initializeApp() {
  plps = document.getElementById("btn_timer");
  clockDisplay = document.getElementById("clock");
  selectButtons = document.querySelectorAll(".select");

  plps.addEventListener("click", handlePlayPauseReset);

  selectButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      let minutes = 0;
      switch (event.target.id) {
        case "t5m":
          minutes = 5;
          break;
        case "t10m":
          minutes = 10;
          break;
        case "t20m":
          minutes = 20;
          break;
        default:
          return;
      }
      setTimer(minutes);
      selectButtons.forEach((btn) => btn.classList.remove("active"));
      event.target.classList.add("active");
    });
  });

  setTimer(5);
  document.getElementById("t5m").classList.add("active");
}

document.addEventListener("DOMContentLoaded", initializeApp);
