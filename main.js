document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake"); // Select the cake element
  const blowMessage = document.getElementById("blowMessage");
  const happyBirthdaySong = document.getElementById("happyBirthdaySong");
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  canvas.style.position = "fixed";
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let candle = document.querySelector(".candle"); // Check if candle already exists
  if (!candle) {
    candle = document.createElement("div");
    candle.className = "candle";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
  }

  function updateCandleCount() {
    if (!candle.classList.contains("out")) {
      blowMessage.textContent = "Blow the candle!";
    } else {
      blowMessage.textContent = "Your wish will come true!";
    }
  }

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 50;
  }

  function blowOutCandle() {
    if (!candle.classList.contains("out")) {
      if (isBlowing()) {
        candle.classList.add("out");
        const flame = candle.querySelector(".flame");
        flame.style.display = "none"; // Hide the flame
        updateCandleCount();
        setTimeout(function () {
          triggerConfetti();
          startConfetti();
          happyBirthdaySong.play(); // Play the Happy Birthday song
        }, 200);
      }
    }
  }

  let audioContext;
  let analyser;
  let microphone;

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandle, 200);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
});

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function startConfetti() {
  const confettiSettings = {
    target: canvas,
    max: 100,
    size: 1,
    animate: true,
    props: ["circle", "square", "triangle", "line"],
    colors: [
      [165, 104, 246],
      [230, 61, 135],
      [0, 199, 228],
      [253, 214, 126]
    ],
    clock: 25,
    rotate: true,
    start_from_edge: true,
    respawn: true
  };
  confetti(confettiSettings);
}

function stopConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  canvas.remove();
}
