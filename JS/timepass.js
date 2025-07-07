console.log('lets write javascript');
let currentsong = new Audio();
let songs;
let currfolder;


async function get_Songs(folder) {
    currfolder = folder;

    let a = await fetch(`http://127.0.0.1:3000/Spotify_Clone/${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")


    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);

        }


    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songul.innerHTML = " ";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<div class="sng_li_2">
        <li class="sng_li"> 
     

                        <img class="li_1" src="music.svg" alt="">
                        <div class="info">
                            <div>${song.replaceAll("%20", " ").replaceAll("+", " ")} </div>
                            <div>meet</div>
                        </div>
                        <div class="playnow">
                            <span>Play now</span>
                        <img src="play.svg" alt="">
                    </div>
                     </li> </div>` ;

    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })
    })


}
const playmusic = (track, pause = false) => {
    // let audio = new Audio("http://127.0.0.1:3000/Spotify_Clone/song/"+ track)
    currentsong.src = `/Spotify_Clone/${currfolder}/` + track
    if (!pause) {

        currentsong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

function convertSecondsToMinSec(seconds) {
    if (isNaN(seconds) || seconds < 0) {

    }
    const minutes = Math.floor(seconds / 60);
    const remainingseconds = Math.floor(seconds % 60);
    const formateminutes = String(minutes).padStart(2, '0');
    const formateseconds = String(remainingseconds).padStart(2, '0');
    return `${formateminutes}:${formateseconds}`;

}
async function displayalbum() {
    let a = await fetch(`http://127.0.0.1:3000/Spotify_Clone/song/`)
    let response = await a.text();
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
let cardcontainer = document.querySelector(".grid");
let array = Array.from(anchors);

for (let index_1 = 0; index_1 < array.length; index_1++) {
    const e = array[index_1];
    
    // ✅ Skip .mp3 files, only process folders
    if (!e.href.endsWith(".mp3") && e.href.includes("/song/")) {
        let folder = e.href.split("/").filter(Boolean).slice(-1)[0];

        try {
            let a = await fetch(`http://127.0.0.1:3000/Spotify_Clone/song/${folder}/info.json`);
            let response = await a.json();

            cardcontainer.innerHTML += `
                <div data-folder="${folder}" class="art_1 card">
                    <img src="/Spotify_Clone/song/${folder}/cover.jpg" alt="">
                    <div class="play">
                        <svg data-encore-id="icon" role="img" aria-hidden="true" class="e-9640-icon" viewBox="0 0 24 24">
                            <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z"></path>
                        </svg>
                    </div>
                    <div class="name_artist">${response.title}</div>
                    <div class="artist">${response.description}</div>
                </div>
            `;
        } catch (err) {
            console.error(`Error loading metadata for ${folder}:`, err);
        }
    }
}


    Array.from(document.getElementsByClassName("card")).forEach(e => {
        console.log(e)
        e.addEventListener("click", async item => {
            console.log(item.currentTarget, item.currentTarget.dataset)
            songs = await get_Songs(`song/${item.currentTarget.dataset.folder}`)

        })

    })


}



async function main() {

    //fetch list of songs
    await get_Songs(`song/Garba`);
    playmusic(songs[0], true)
    console.log(songs)

    //for dynamicalbum
    displayalbum();


    //attach an event listner to each song

    // Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    //     e.addEventListener("click", element => {
    //         const songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
    //         playmusic(songName);
    //     });
    // });

    //attach an event listner to the previous play and next
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"

        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })
    //listen for timeupdate event
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinSec(currentsong.currentTime)}/${convertSecondsToMinSec(currentsong.duration)}`;
        document.querySelector(".circular").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    //add an event listner to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        // document.querySelector(".circular").style.left=(e.)
        document.querySelector(".circular").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentsong.currentTime = ((e.offsetX / e.target.getBoundingClientRect().width) * 100) * (currentsong.duration) / 100
    })

    //add eventlistner on previous and next

    previous.addEventListener("click", () => {
        let currentTrack = decodeURIComponent(currentsong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);
    
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1]);
        }
    });
    
    next.addEventListener("click", () => {
        let currentTrack = decodeURIComponent(currentsong.src.split("/").pop());
        let index = songs.indexOf(currentTrack);
    
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1]);
        }
    });
    
    // add an event listner to the volume 
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentsong.volume = parseInt(e.target.value) / 100;
    })

    //load playlist whenever card is clicked

   
}
main();