console.log("Starting...");

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

async function main() {
  // get songs
  let songs = await getSongs();
  console.log(songs);

  let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0];
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="images/svgs/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playNow pN">
                                <span>Play Now</span>
                                <img class="invert pN_img" src="images/svgs/play-now.svg" alt="">
                            </div>
     </li>`;
  }

  // play songs
  var audio = new Audio(songs[2]);
  // audio.play();

  audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log(duration);
    
    // The duration variable now holds the duration (in seconds) of the audio clip
  });
}


main();
