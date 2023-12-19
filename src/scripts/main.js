
const shareButton = document.querySelectorAll(".shareButton");
const playBtn = document.querySelector(".play-btn");
const audioElement = document.querySelector(".audio-element");
const iconContainer = document.querySelector(".icon-container");
const btnPlayPlaylist = document.querySelectorAll(".btn-play-playlist");
const canvas = document.getElementById("waveform");
const canvasContext = canvas.getContext("2d");
let first = true;
let actualTheme = 2;

const playIcon = '<svg class="hover-play play-svg" viewBox="0 -910 960 960"><path d="M372-294v-372l292 186-292 186Zm28-186Zm0 134 212-134-212-134v268Z"/></svg>';
const playIconPlaylist = '<svg class="icon-svg-playlist" viewBox="0 -910 960 960"><path d="M372-294v-372l292 186-292 186Zm28-186Zm0 134 212-134-212-134v268Z"/></svg>';
const pauseIcon = '<svg class="hover-play play-svg" width="20" viewBox="-200 -1100 960 960"><path d="M540-240v-480h180v480H540Zm-300 0v-480h180v480H240Zm340-40h100v-400H580v400Zm-300 0h100v-400H280v400Zm0-400v400-400Zm300 0v400-400Z"/></svg>';
const pauseIconPlaylist = '<svg class="hover-play play-svg" width="25" viewBox="-250 -1130 960 960"><path d="M540-240v-480h180v480H540Zm-300 0v-480h180v480H240Zm340-40h100v-400H580v400Zm-300 0h100v-400H280v400Zm0-400v400-400Zm300 0v400-400Z"/></svg>';

const playList = {
  0 : '/music/The-Small-Things.mp3',
  1 : '/music/Without-Your-Love.mp3',
  2 : '/music/Therapy.mp3',
  3 : '/music/Fighters.mp3',
  4 : '/music/Way-Up.mp3',
  5 : '/music/Waiting.mp3',
  6 : '/music/Dreaming.mp3',
  7 : '/music/Tattoo.mp3',
  8 : '/music/Out-for-the-Night.mp3',
  9 : '/music/Overdue.mp3',
  10 : '/music/Say-It.mp3',
  11 : '/music/Here-to-Stay.mp3',
}

const arrayBtn = Array.from(btnPlayPlaylist);

// Play banner
shareButton.forEach((button) => {
  button.addEventListener("click", async (e) => {
    e.preventDefault();
    if (navigator.share) { 
      try {
        await navigator.share({
          title: "LEVEL DAYS - CONRO",
          text: "Instinct — Released May 22, 2020",
          url: "https://www.monstercat.com/release/MCLP017#track-6" 
        });
      } catch (error) {
        
      }
    } 
  });
});

playBtn.addEventListener("click", (e) => {

  if(first) {
    audioElement.src = playList[actualTheme];
    first = false;
  }

  if (audioElement.paused) {
    iconContainer.innerHTML = pauseIcon;
    arrayBtn[actualTheme].querySelector('.icon-container-multi').innerHTML = pauseIconPlaylist;
    audioElement.play();
  } else {
    iconContainer.innerHTML = playIcon;
    arrayBtn[actualTheme].querySelector('.icon-container-multi').innerHTML = playIconPlaylist;
    audioElement.pause();
  }
});

// Play playlist

btnPlayPlaylist.forEach((button) => {

  button.addEventListener("click", (e) => {
    e.preventDefault();
    const id = button.getAttribute('data-id');

    if(audioElement.paused) {
      if(actualTheme != id) {
        audioElement.src = playList[id];
        audioElement.play();
        arrayBtn[actualTheme].querySelector('.icon-container-multi').innerHTML = playIconPlaylist;
        actualTheme = id;
      } else {
        audioElement.play();
      }
      e.currentTarget.querySelector('.icon-container-multi').innerHTML = pauseIconPlaylist;
      iconContainer.innerHTML = pauseIcon;
    } else  {
      if(actualTheme == id) {
        audioElement.pause();
        e.currentTarget.querySelector('.icon-container-multi').innerHTML = playIconPlaylist;
        iconContainer.innerHTML = playIcon;
      } else {
        audioElement.src = playList[id];
        audioElement.play();
        arrayBtn[actualTheme].querySelector('.icon-container-multi').innerHTML = playIconPlaylist;
        e.currentTarget.querySelector('.icon-container-multi').innerHTML = pauseIconPlaylist;
        actualTheme = id;
      }
    }

  });

});

audioElement.addEventListener("ended", () => {

  arrayBtn[actualTheme].querySelector('.icon-container-multi').innerHTML = playIconPlaylist;

  actualTheme += 1;
  if(actualTheme > 11) {
    actualTheme = 0;
  }

  audioElement.src = playList[actualTheme];
  audioElement.play();

  arrayBtn[actualTheme].querySelector('.icon-container-multi').innerHTML = pauseIconPlaylist;
});

//Draw waveform
audioElement.addEventListener("play", () => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const analyser = audioContext.createAnalyser();
  const source = audioContext.createMediaElementSource(audioElement);

  source.connect(analyser);
  analyser.connect(audioContext.destination);
  analyser.fftSize = 256;

  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  canvas.width = bufferLength;
  canvas.height = 10;

  canvasContext.clearRect(0, 0, canvas.width, canvas.height);

  function draw() {
    analyser.getByteTimeDomainData(dataArray);
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.beginPath();

    const sliceWidth = canvas.width / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      const v = (dataArray[i] / 128.0);
      const y = (v * canvas.height) / 2;

      canvasContext.strokeStyle = "#fff";

      if (i === 0) {
        canvasContext.moveTo(x, y);
      } else {
        canvasContext.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasContext.lineTo(canvas.width, canvas.height / 2);
    canvasContext.stroke();

    requestAnimationFrame(draw);
  }

  draw();
});

function drawStaticWaveform() {
  const bufferLength = 256; // Número de puntos para la visualización estática
  const dataArray = new Uint8Array(bufferLength);

  canvas.width = bufferLength;
  canvas.height = 10;

  const sliceWidth = canvas.width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    const y = canvas.height / 2; 

    canvasContext.strokeStyle = "hsl(0, 0%, 100%)";

    if (i === 0) {
      canvasContext.moveTo(x, y);
    } else {
      canvasContext.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasContext.stroke();
}

drawStaticWaveform(); 





