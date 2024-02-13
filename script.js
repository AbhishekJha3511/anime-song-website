console.log("Starting...");

let currentSong = new Audio();
let songs;
let currentFolder;

function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    // return "Invalid input";
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
  currentFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  // console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  // Show all the songs in the playlist
  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li> <img class="invert" src="images/svgs/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playNow pN">
                                <span>Play Now</span>
                                <img class="invert pN_img" src="images/svgs/play-now.svg" alt="">
                            </div> </li>`;
  }

  // Attach event listeners to each songs
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      // console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currentFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "images/svgs/pause.svg";
  }
  document.querySelector(".song-info").innerHTML = decodeURI(track);
  document.querySelector(".song-time").innerHTML = "00:00 / 00: 00";
};

async function displayAlbums() {
  console.log("Dislpaling Albums");
  let a = await fetch(`http://127.0.0.1:5500/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let songCards = document.querySelector(".songCards");
  // Array.from(anchors).forEach(async (e) => {
  let array = Array.from(anchors);
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      console.log(e.href.split("/").slice(-1)[0]); //Get the folder name
      let folder = e.href.split("/").slice(-1)[0];
      //Get the meta data of the folder
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);
      songCards.innerHTML =
        songCards.innerHTML +
        `<div data-folder="kk" class="cardBody">
        <div class="playbtn">
            <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24" fill="#cc0059">
                <circle cx="12" cy="12" r="10" stroke="none" />
                <path d="M9.5 16V8L16 12L9.5 16Z" fill="#ffffff" stroke-linejoin="round"/>
            </svg>
        </div>
        <img src="/songs/${folder}/cover.jpg" alt="">
        <h4>${response.title}</h4>
        <p>${response.description}</p>
    </div>`;
    }
  }
  // Load the playlist whenever card is clicked
  Array.from(document.getElementsByClassName("cardBody")).forEach((e) => {
    console.log(e);
    e.addEventListener("click", async (item) => {
      console.log(item, item.currentTarget.dataset.folder);

      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}

async function main() {
  // get songs
  await getSongs("songs/kk");
  playMusic(songs[0], true);

  // Display all the albums on the pages
  displayAlbums();

  //Attach event listener to the play, next and previous buttons
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/svgs/pause.svg";
    } else {
      currentSong.pause();
      play.src = "images/svgs/play.svg";
    }
  });

  //Listen to the time update event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".song-time").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )}/${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".seekCircle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Add an event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".seekCircle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".lContainer").style.left = "0";
  });
  document.querySelector(".close-ham").addEventListener("click", () => {
    document.querySelector(".lContainer").style.left = "-110%";
  });

  //Add an event listener to the previous
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //Add an event listener to the next

  next.addEventListener("click", () => {
    currentSong.pause();

    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //Add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });
}

main();
