let timeLeft = 0;
    let initialTime = 0;
    let timerInterval = null;
    let isPaused = true;

    const clockDisplay = document.getElementById("clock");
    const stPsBtn = document.getElementById("st-ps");
    const stSpBtn = document.getElementById("st-sp");
    const templateBtns = document.querySelectorAll(".template button");

    const circle = document.querySelector(".progress-ring__circle");

    const radius = circle.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;

    circle.style.strokeDasharray = circumference;
    circle.style.strokeDashoffset = 0;

    function setProgress(percent) {
      const offset = circumference - (percent / 100) * circumference;
      circle.style.strokeDashoffset = offset;
    }

    function updateDisplay() {
      let mins = Math.floor(timeLeft / 60);
      let secs = timeLeft % 60;

      clockDisplay.innerText = `${mins.toString().padStart(2, "0")}:${secs
        .toString()
        .padStart(2, "0")}`;

      if (initialTime > 0) {
        const percent = (timeLeft / initialTime) * 100;
        setProgress(percent);
      }
    }

    templateBtns.forEach((btn) => {
      btn.onclick = function () {
        templateBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const mins = parseInt(this.innerText);
        timeLeft = mins * 60;
        initialTime = timeLeft;

        stopTimer();
        updateDisplay();
        setProgress(100);
      };
    });

    stPsBtn.onclick = function () {
      if (timeLeft <= 0) return alert("Pilih waktu dulu");

      isPaused ? startTimer() : pauseTimer();
    };

    stSpBtn.onclick = function () {
      stopTimer();
      timeLeft = initialTime;
      updateDisplay();
      setProgress(100);
    };

    function startTimer() {
      isPaused = false;
      stPsBtn.className = "fa-solid fa-pause";
      stSpBtn.textContent = "reset";

      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateDisplay();
        } else {
          stopTimer();
          alert("Waktu habis!");
        }
      }, 1000);
    }

    function pauseTimer() {
      isPaused = true;
      stPsBtn.className = "fa-solid fa-play";
      clearInterval(timerInterval);
    }

    function stopTimer() {
      isPaused = true;
      stPsBtn.className = "fa-solid fa-play";
      clearInterval(timerInterval);
      timerInterval = null;
    }
