let play = document.querySelector('#play');
let rewind = document.querySelector('#rewind');
let fastForward = document.querySelector("#fastforward");
let masterplay = document.querySelector('#masterplay');
let slidebar = document.getElementById('slidebar');
let seeker = document.getElementById('seeker');
let background = document.getElementById('background');
let body = document.querySelector('body');
let playingIndex = 0;

slidebar.value = 0;

class SongItems {
    constructor(name, artist, link, imageURL, timestamp) {
        this.name = name;
        this.artist = artist;
        this.link = link;
        this.imageURL = imageURL;
        this.timestamp = timestamp;
    }
}

function changeDisplayColor() {
    let currentImage = document.createElement('img');
    currentImage.src = songArr[playingIndex].imageURL;
    console.log(currentImage);
    let newRGB = getDisplayColor(currentImage);
    let use = 'rgb(' + newRGB.r + ', ' + newRGB.g + ', ' + newRGB.b + ')';
    body.style.backgroundImage = 'linear-gradient(to top, black,' + use + ')';
}

function getDisplayColor(imgEl) {
    var blockSize = 5, // only visit every 5 pixels
        defaultRGB = {r:0,g:0,b:0}, // for non-supporting envs
        canvas = document.createElement('canvas'),
        context = canvas.getContext && canvas.getContext('2d'),
        data, width, height,
        i = -4,
        length,
        rgb = {r:0,g:0,b:0},
        count = 0;

    if (!context) {
        return defaultRGB;
    }

    height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
    width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

    context.drawImage(imgEl, 0, 0);

    try {
        data = context.getImageData(0, 0, width, height);
    } catch(e) {
        /* security error, img on diff domain */
        return defaultRGB;
    }

    length = data.data.length;

    while ( (i += blockSize * 4) < length ) {
        ++count;
        rgb.r += data.data[i];
        rgb.g += data.data[i+1];
        rgb.b += data.data[i+2];
    }

    // ~~ used to floor values
    rgb.r = ~~(rgb.r/count);
    rgb.g = ~~(rgb.g/count);
    rgb.b = ~~(rgb.b/count);

    return rgb;

}

let itemArr = Array.from(document.getElementsByClassName('songs'));

itemArr[0].style.backgroundColor = 'rgba(5, 155, 105, 1)';

let audio = new Audio('songs/Tesseract__April/audio.mp3');

let song1 = new SongItems('April', 'Tesseract', 'songs/Tesseract__April/audio.mp3', 'songs/Tesseract__April/image.jpg', '4:48');
let song2 = new SongItems('Crossfire', 'Stephen', 'songs/Stephen__Crossfire/audio.mp3', 'songs/Stephen__Crossfire/image.jpg', '4:31');
let song3 = new SongItems('Garden Of Everything', 'Steve Conte', 'songs/SteveConte__GardenOfEverything/audio.mp3', 'songs/SteveConte__GardenOfEverything/image.jpg', '6:18');

let songArr = [song1, song2, song3];

changeDisplayColor();

itemArr.forEach((element, i) => {
    let image = element.querySelector('img');
    let list = element.getElementsByTagName('div');
    try {
        image.src = songArr[i].imageURL;
        list[0].innerHTML = songArr[i].name + ' - ' + songArr[i].artist;
        list[1].innerHTML = songArr[i].timestamp;
        
    }
    catch {
        itemArr[i].style.display = 'none';
    }
    element.addEventListener('click', () => {
        setSong(i);
    });
});

function updateSlider() {
    let progress = (audio.currentTime / audio.duration) * 1000;
    slidebar.value = progress;
}

function updateTime() {
    if(audio.currentTime == audio.duration)
    {
        masterplay.classList.remove('fa-pause');
        masterplay.classList.add('fa-play');
    }
    let mins = parseInt(audio.currentTime / 60);
    let secs = parseInt(audio.currentTime % 60);
    let current = document.getElementById("currentTime");
    let middle = ':';
    if(secs < 10)
        middle += '0';
    current.innerText = mins + middle + secs;
}

function timer() {
    updateSlider();
    updateTime();
}

function playAudio() {
    masterplay.classList.remove('fa-play');
    masterplay.classList.add('fa-pause');
    audio.addEventListener('timeupdate', timer);
    seeker.style.opacity = '1';
    let endTime = audio.duration;
    let end = document.getElementById('endTime');
    let secs = parseInt(endTime % 60);
    let mins = parseInt(endTime / 60);
    let middle = ':';
    if(secs < 10)
        middle += '0';
    end.innerText = mins + middle + secs;
    audio.play();
}

function play_pause() {
    if(audio.paused || audio.currentTime <= 0)
    {
        playAudio();
    }
    else
    {
        slidebar.value = 0;
        masterplay.classList.remove('fa-pause');
        masterplay.classList.add('fa-play');
        audio.pause();
    }
}

function setSong(i) {
    if(!audio.paused)
        play_pause();
    audio = new Audio(songArr[i].link);
    title.innerHTML = songArr[i].name + ' - ' + songArr[i].artist;
    background.style.background = 'url(' + songArr[i].imageURL + ') no-repeat center center/cover';
    seeker.style.opacity = '0';
    itemArr[playingIndex].style.backgroundColor = 'rgba(5, 155, 105, 0)';
    playingIndex = i;
    changeDisplayColor();
    itemArr[i].style.backgroundColor = 'rgba(5, 155, 105, 1)';
}

function getSong(song) {
    let toGet = 'songs/' + song.artist + '__' + song.name + '/audio.mp3';
    let newAudio = new Audio(toGet);
    return newAudio;
}

play.addEventListener("click", play_pause);

rewind.addEventListener("click", () => {
    if(audio.currentTime < 2)
    {
        if(playingIndex > 0)
            setSong(playingIndex - 1);
        else
            setSong(songArr.length - 1);
    }
    audio.currentTime = 0;
});

fastForward.addEventListener("click", () => {
    if(playingIndex == songArr.length - 1)
        setSong(0);
    else
        setSong(playingIndex + 1);
});

slidebar.addEventListener('click', () => {
    let progress = slidebar.value;
    audio.currentTime = (progress / 1000) * audio.duration;
});