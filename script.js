// Global Variables (Declared with 'let' so they can be assigned later)
let plps, clockDisplay, animCover, selectButtons;
let initialTimeInSeconds = 0; // Total duration of the selected timer in seconds
let timeRemaining = 0; // Current time left in seconds
let timerInterval = null; // Holds the setInterval ID
let isRunning = false; // Tracks if the timer is currently running

// --- Utility Functions ---

/**
 * Converts total seconds into a MM:SS string format.
 * @param {number} totalSeconds - The total number of seconds.
 * @returns {string} The formatted time string (e.g., "05:00").
 */
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Use String.padStart() to ensure two digits for MM and SS
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

/**
 * Updates the clock display element with the formatted time.
 * @param {number} seconds - The time in seconds.
 */
function updateClockDisplay(seconds) {
  clockDisplay.textContent = formatTime(seconds);
}

/**
 * Updates the visual representation of the timer by changing the conic-gradient angle.
 * @param {number} initial - The initial total time in seconds.
 * @param {number} remaining - The time remaining in seconds.
 */
function updateVisuals(initial, remaining) {
  // If initial time is 0, reset the visual to fully elapsed (0 remaining)
  if (initial === 0) {
    animCover.parentElement.style.setProperty("--progress", 0);
    return;
  }

  // Calculate the ratio of time REMAINING (1.0 = full, 0.0 = empty)
  const remainingRatio = Math.max(0, remaining / initial);

  // Set the CSS variable on the .anim element (which holds the gradient)
  animCover.parentElement.style.setProperty("--progress", remainingRatio);
}

// --- Core Timer Logic ---

/**
 * Displays a simple message box when the timer finishes.
 */
function timerFinishedNotification() {
  console.log("Timer finished!");
  plps.textContent = "DONE!";
  plps.style.backgroundColor = "var(--accent-color)";
  plps.style.boxShadow = "0 0 15px var(--accent-color)";

  // --- New Logic: Remove 'active' class when timer finishes ---
  selectButtons.forEach((btn) => btn.classList.remove("active"));
}

/**
 * Sets the timer duration when a time button is clicked.
 * @param {number} minutes - The total duration in minutes.
 */
function setTimer(minutes) {
  // Stop any existing timer first
  stopTimer();

  // Set the new time
  initialTimeInSeconds = minutes * 60;
  timeRemaining = initialTimeInSeconds;

  // Update display and visuals
  updateClockDisplay(timeRemaining);

  // When set, the visual should be 100% full (ratio 1)
  animCover.parentElement.style.setProperty("--progress", 1);

  // Reset play/pause button style and state
  plps.textContent = "play";
  isRunning = false;
  plps.style.backgroundColor = "#797979"; // Reset to default grey
  plps.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.3)";
}

/**
 * The main function called every second to decrement time and update the display.
 */
function updateTimer() {
  if (timeRemaining > 0) {
    timeRemaining--;
    updateClockDisplay(timeRemaining);
    updateVisuals(initialTimeInSeconds, timeRemaining);

    // Change button color to indicate running state
    plps.style.backgroundColor = "var(--second-color)";
  } else {
    // Timer finished
    stopTimer();
    updateClockDisplay(0); // Ensure it displays 00:00
    updateVisuals(initialTimeInSeconds, 0); // Ensure visual is fully empty (ratio 0)
    timerFinishedNotification(); // Custom notification
  }
}

/**
 * Starts the timer interval.
 */
function startTimer() {
  if (timeRemaining > 0 && !isRunning) {
    isRunning = true;
    plps.textContent = "pause";
    plps.style.backgroundColor = "var(--second-color)";
    // Call updateTimer every 1000 milliseconds (1 second)
    timerInterval = setInterval(updateTimer, 1000);
  }
}

/**
 * Stops/Pauses the timer interval.
 */
function pauseTimer() {
  if (isRunning) {
    isRunning = false;
    plps.textContent = "play";
    plps.style.backgroundColor = "#797979"; // Back to grey when paused
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

/**
 * Completely stops the timer and resets the state.
 */
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isRunning = false;
}

/**
 * Handles the logic for the Play/Pause/Reset button.
 */
function handlePlayPauseReset() {
  if (timeRemaining === 0 && initialTimeInSeconds !== 0) {
    // Reset state (after timer finished)
    // We call setTimer with the minutes calculated from the initial seconds
    setTimer(initialTimeInSeconds / 60);
    // After reset, we start immediately for better user experience
    startTimer();
  } else if (timeRemaining > 0) {
    // Play or Pause state
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  } else if (initialTimeInSeconds === 0) {
    // Safety: If no time is selected, default to 5 minutes
    setTimer(5);
    document.getElementById("t5m").classList.add("active"); // Highlight default 5m button
    startTimer();
  }
}

// --- Initialization Function ---
function initializeApp() {
  // Get DOM elements (Assignment happens here, AFTER the DOM is ready)
  plps = document.getElementById("btn_timer");
  clockDisplay = document.getElementById("clock");
  animCover = document.querySelector(".cover"); // This refers to the inner mask
  selectButtons = document.querySelectorAll(".select");

  // 1. Play/Pause/Reset Button Listener
  plps.addEventListener("click", handlePlayPauseReset);

  // 2. Timer Duration Select Buttons Listeners
  selectButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Determine the time based on the button's ID
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
          return; // Do nothing if it's not a recognized button
      }

      // Apply the selected time
      setTimer(minutes);

      // Highlight the selected button (This ensures the highlight is permanent until finished)
      selectButtons.forEach((btn) => btn.classList.remove("active"));
      event.target.classList.add("active");
    });
  });

  // Initial Setup
  setTimer(5);
  document.getElementById("t5m").classList.add("active");
}

// --- Initial Setup Trigger ---
// Call the initialization function once the entire page is loaded
document.addEventListener("DOMContentLoaded", initializeApp);
