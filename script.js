let plps, clockDisplay, selectButtons;
let initialTimeInSeconds = 0;
let timeRemaining = 0;
let timerInterval = null;
let isRunning = false;
let customMessage = "Timer completed!";

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
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateClockDisplay(seconds) {
  clockDisplay.textContent = formatTime(seconds);
}

function updateVisuals(total, remaining) {
  const progress = (remaining / total) * 100;
  setProgress(progress);
}

function triggerFinishAnimation() {
  const finishAnim = document.getElementById("finish_animation");
  if (finishAnim) {
    finishAnim.classList.remove("active");
    setTimeout(() => finishAnim.classList.add("active"), 10);
  }
}

function playNotificationSound() {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Play three beeps as alarm notification
  oscillator.frequency.value = 800;
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
  
  oscillator.start(audioContext.currentTime + 0.3);
  oscillator.stop(audioContext.currentTime + 0.5);
  
  oscillator.start(audioContext.currentTime + 0.6);
  oscillator.stop(audioContext.currentTime + 0.8);
}

function timerFinishedNotification() {
  plps.textContent = "DONE!";
  plps.style.backgroundColor = "var(--accent-color)";
  selectButtons.forEach((btn) => btn.classList.remove("active"));
  
  // Trigger finish animation
  triggerFinishAnimation();
  
  // Play alarm sound
  playNotificationSound();
  
  // Show custom message
  const messageDisplay = document.getElementById("current_message");
  if (messageDisplay) {
    messageDisplay.textContent = customMessage;
  }
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

function resetTimer() {
  stopTimer();
  timeRemaining = 0;
  initialTimeInSeconds = 0;
  updateClockDisplay(0);
  setProgress(0);
  plps.textContent = "play";
  isRunning = false;
  plps.style.backgroundColor = "#797979";
  selectButtons.forEach((btn) => btn.classList.remove("active"));
}

function updateTimer() {
  if (timeRemaining > 0) {
    timeRemaining--;
    updateClockDisplay(timeRemaining);
    updateVisuals(initialTimeInSeconds, timeRemaining);
    plps.style.backgroundColor = "rgb(94, 92, 92)";
  } else {
    stopTimer();
    timerFinishedNotification();
  }
}

function startTimer() {
  isRunning = true;
  timerInterval = setInterval(updateTimer, 1000);
  plps.textContent = "pause";
  plps.style.backgroundColor = "rgb(94, 92, 92)";
}

function stopTimer() {
  if (timerInterval !== null) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  isRunning = false;
}

function toggleTimer() {
  if (timeRemaining === 0 && initialTimeInSeconds === 0) {
    return;
  }
  if (isRunning) {
    stopTimer();
    plps.textContent = "play";
    plps.style.backgroundColor = "#797979";
  } else {
    startTimer();
  }
}

window.addEventListener("DOMContentLoaded", function () {
  plps = document.getElementById("btn_timer");
  clockDisplay = document.getElementById("clock");
  selectButtons = document.querySelectorAll(".select");

  // Handle preset time buttons
  document.getElementById("t5m").addEventListener("click", function () {
    selectButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    setTimer(5);
  });

  document.getElementById("t10m").addEventListener("click", function () {
    selectButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    setTimer(10);
  });

  document.getElementById("t20m").addEventListener("click", function () {
    selectButtons.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");
    setTimer(20);
  });

  // Handle play/pause button
  plps.addEventListener("click", toggleTimer);

  // Handle quick reset button
  const resetBtn = document.getElementById("reset_btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetTimer);
  }

  // Handle custom message input
  const saveMessageBtn = document.getElementById("save_message_btn");
  const customMessageInput = document.getElementById("custom_message");
  const currentMessageDisplay = document.getElementById("current_message");
  
  if (saveMessageBtn && customMessageInput && currentMessageDisplay) {
    saveMessageBtn.addEventListener("click", function () {
      const newMessage = customMessageInput.value.trim();
      if (newMessage) {
        customMessage = newMessage;
        currentMessageDisplay.textContent = customMessage;
        customMessageInput.value = "";
      }
    });
    
    // Allow Enter key to save message
    customMessageInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        saveMessageBtn.click();
      }
    });
  }
});
