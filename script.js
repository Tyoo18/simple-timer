const plps = document.getElementById("btn_timer");

plps.addEventListener("click", () => {
  if (plps.textContent === "play") {
    plps.textContent = "pause";
  } else {
    plps.textContent = "play";
  }
});
