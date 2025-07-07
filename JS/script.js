console.log('lets write javascript');
let currentsong = new Audio();
let songs;
let currfolder;

async function get_Songs(folder) {
    currfolder = folder;

    let a = await fetch(`http://127.0.0.1:3000/Spotify_Clone/${folder}/`);
    let response = await a.text();
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

    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML += `
            <div class="sng_li_2">
                <li class="sng_li">
                    <img class="li_1" src="music.svg" alt="">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ").replaceAll("+", " ")}</div>
                        <div>meet</div>
                    </div>
                    <div class="playnow">
                        <span>Play now</span>
                        <img src="play.svg" alt="">
                    </div>
                </li>
            </div>`;
    }

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            let name = e.querySelector(".info").firstElementChild.innerHTML.trim();
            playmusic(name);
        });
    });

    return songs;
}

const playmusic = (track, pause = false) => {
    currentsong.src = `/Spotify_Clone/${currfolder}/` + track;
    if (!pause) {
        currentsong.play();
        play.src = "pause.svg";
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

function convertSecondsToMinSec(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingseconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingseconds).padStart(2, '0')}`;
}

async function displayalbum() {
    let a = await fetch(`http://127.0.0.1:3000/Spotify_Clone/song/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".grid");
    let array = Array.from(anchors);

    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/song")) {
            let folder = e.href.split("/").slice(-2)[0];
            // console.log(folder);
            try {
                let a = await fetch(`http://127.0.0.1:3000/Spotify_Clone/song/${folder}/info.json`);
                let response = await a.json();
                cardcontainer.innerHTML += `
                    <div data-folder="${folder}" class="art_1 card">
                        <img src="/Spotify_Clone/song/${folder}/cover.jpg" alt="">
                        <div class="play">
                            <svg data-encore-id="icon" role="img" aria-hidden="true"
                                 class="e-9640-icon" viewBox="0 0 24 24">
                                <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                            </svg>
                        </div>
                        <div class="name_artist">${response.title}</div>
                        <div class="artist">${response.description}</div>
                    </div>`;
            } catch (err) {
                // console.error("Failed to load album info:", err);
            }
        }
    }

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await get_Songs(`song/${item.currentTarget.dataset.folder}`);
            playmusic(songs[0]);
        });
    });
}

async function main() {
    await get_Songs(`song/Garba`);
    playmusic(songs[0], true);

    displayalbum();

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play();
            play.src = "pause.svg";
        } else {
            currentsong.pause();
            play.src = "play.svg";
        }
    });

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${convertSecondsToMinSec(currentsong.currentTime)}/${convertSecondsToMinSec(currentsong.duration)}`;
        document.querySelector(".circular").style.left =
            (currentsong.currentTime / currentsong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        const percent = (e.offsetX / e.target.getBoundingClientRect().width);
        document.querySelector(".circular").style.left = percent * 100 + "%";
        currentsong.currentTime = percent * currentsong.duration;
    });

    previous.addEventListener("click", () => {
        if (!songs || !Array.isArray(songs) || songs.length === 0) {
            console.warn("No songs loaded for previous button");
            return;
        }

        let currentTrack = decodeURIComponent(currentsong.src.split("/").pop().split("?")[0]);
        let index = songs.findIndex(song => decodeURIComponent(song) === currentTrack);

        if (index > 0) {
            playmusic(songs[index - 1]);
        } else {
            console.warn("Already at the first song");
        }
    });

    next.addEventListener("click", () => {
        if (!songs || !Array.isArray(songs) || songs.length === 0) {
            console.warn("No songs loaded for next button");
            return;
        }

        let currentTrack = decodeURIComponent(currentsong.src.split("/").pop().split("?")[0]);
        let index = songs.findIndex(song => decodeURIComponent(song) === currentTrack);

        if (index !== -1 && index + 1 < songs.length) {
            playmusic(songs[index + 1]);
        } else {
            console.warn("Already at the last song");
        }
    });

    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    });
}

//add event listner to mute volume 
document.querySelector(".volume>img").addEventListener("click",e=>{
    // console.log(e.target);
    // console.log("changing",e.target.src);
    if(e.target.src.includes("volume.svg")){
        e.target.src=e.target.src.replace("volume.svg","mute.svg");
        currentsong.volume=0;
        document.querySelector(".volume").getElementsByTagName("input")[0].value=0
    }
    else{
        e.target.src=e.target.src.replace("mute.svg","volume.svg");
        currentsong.volume=.10;
        document.querySelector(".volume").getElementsByTagName("input")[0].value=10
    }
})

main();
