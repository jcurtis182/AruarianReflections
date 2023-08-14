let calDate = document.querySelector(".cal-date")
let calMonthNum = document.querySelector(".cal-month-num")
let calMonthName = document.querySelector(".cal-month-name")
let calDay = document.querySelector(".cal-day");

let clockHr = document.getElementById("hours");
let clockMin = document.getElementById("minutes");
let clockSec = document.querySelector(".cal-time-sec");
let timePeriod = document.getElementById("time-period");

let city = document.querySelector(".city");
let cityBG = document.querySelector(".cityBG");
let clouds = document.querySelector(".clouds-container");

let date = new Date();
let day, month, hours, minutes, seconds, currentClockTime;
const months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let timeUnit = "standard";

let weatherUpdate = 10;         //how often in mins to update weather

window.addEventListener("load", () => {
    updateWeather();
    updateDate();
});


function updateDate() {
    let date = new Date();

    day = checkZero(date.getDate());
    month = date.getMonth() + 1;     //+1 bc months start at 0

    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    currentClockTime = hours + ":" + minutes + ":" + seconds;

    calDate.innerHTML = day;
    calMonthNum.innerHTML = month;
    calMonthName.innerHTML = months[month - 1];
    calDay.style.backgroundImage = `url(assets/img/week_days/day${date.getDay()}.png)`;

    if (hours >= 13) timePeriod.innerHTML = "PM";
    else timePeriod.innerHTML = "AM";

    checkDayNight();                                          //find background day/night before time conversion

    if (timeUnit == "standard" && hours > 12) hours -= 12;    //standard time calc; military time by default
    else if (timeUnit == "military") timePeriod.innerHTML = ""; //hide am/pm in military time

    clockHr.innerHTML = checkZero(hours);
    clockMin.innerHTML = checkZero(minutes);
    clockSec.innerHTML = checkZero(seconds);

    setTimeout(updateDate, 1000)        //update every second
}

function checkZero(i) {         //add zero in front of numbers < 10
    if (i < 10) { i = "0" + i };
    return i;
}


let lon, lat;
let temperature = document.querySelector(".weather-temp");
let loc = document.querySelector(".weather-location");
let icon = document.querySelector(".weather-icon");
let tempUnit = "F";

function updateWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            lon = position.coords.longitude;
            lat = position.coords.latitude;

            // API ID
            const api = "6d055e39ee237af35ca066f35474e9df";

            // API URL
            const base =
                `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${api}`;

            // Calling the API
            fetch(base)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    if (tempUnit == "F") {
                        temperature.textContent = Math.floor(data.main.temp) + "°F";
                    }
                    else {
                        temperature.textContent = Math.floor((data.main.temp - 32) / 1.8) + "°C";
                    }
                    loc.textContent = data.name;
                    let icon1 = data.weather[0].icon;
                    icon.innerHTML =
                        `<img src="assets/img/weather_icons/${icon1}.png" style= 'height:100px'/>`;

                    weatherEffects("'" + icon1 + "'");
                });
        });
    }
    console.log("Weather updated");
    setTimeout(updateWeather, weatherUpdate * 60000);
}

let effectsEnabled = true;
let effects = document.querySelector(".weather-effects");
function weatherEffects(weather) {
    if (effectsEnabled) {
        switch (weather) {
            case '09d':
            case '11d':
                city.style.filter = 'saturate(50%)';         //darken sky if raining during day
            case '09n':
            case '10n':
            case '11n':
                effects.style.backgroundImage = "url(assets/img/rain.gif)";
                effects.style.opacity = '70%';
                effects.style.filter = 'blur(1px)';
                console.log("It is raining.");
                break;
            case '13d':
            case '13n':
                effects.style.backgroundImage = "url(assets/img/snow.gif)";
                effects.style.opacity = '100%';
                effects.style.filter = 'blur(0px)';
                console.log("It is snowing.");
                break;
            default:
                effects.style.backgroundImage = "";
                effects.style.opacity = '100%';
                city.style.filter = 'saturate(100%)';
                effects.style.filter = 'blur(0px)';
        }
    }
}


let menu = document.querySelector(".menu-container");
let menuButton = document.querySelector(".menu-button-outer");

function toggleMenu() {
    if (menu.style.display == "inline") {
        console.log("Hiding menu.")
        menu.style.display = "none";
        menuButton.style.display = "inline";
    }
    else {
        console.log("Showing menu.")
        menu.style.display = "inline";
        menuButton.style.display = "none";
    }
}

let cloudButton = document.querySelector(".cloud-switch");
function toggleClouds() {
    if (clouds.style.opacity == "0") {
        clouds.style.opacity = "100";
        cloudButton.style.backgroundImage = "url(assets/img/phone_icons/cloud-icon-on.png)";
        console.log("   Clouds shown.");
    }
    else {
        clouds.style.opacity = "0";
        cloudButton.style.backgroundImage = "url(assets/img/phone_icons/cloud-icon-off.png)";
        console.log("   Clouds hidden.");
    }
}

let cloudStatus = "";
function checkDayNight() {      //city day/night cycle
    if (hours >= 6 && hours < 18) {     //day = 6am->6pm
        city.style.backgroundImage = "url(assets/img/cityDay.jpg)";
        city.style.animation = "none";

        clouds.style.display = "inline";
        if (cloudButton.style.display = "url(assets/img/phone_icons/cloud-icon-night.png)")
            cloudButton.style.display = cloudStatus;    //restore previous cloud toggle status 
        cloudButton.disabled = false;
    }
    else {
        cityBG.style.backgroundImage = "url(assets/img/cityNightOff.jpg)";
        city.style.backgroundImage = "url(assets/img/cityNightOn.jpg)";
        city.style.animation = "flashingCity 3s linear infinite";

        clouds.style.display = "none";
        cloudStatus = cloudButton.style.backgroundImage;        //store current status before disabling
        cloudButton.style.backgroundImage = "url(assets/img/phone_icons/cloud-icon-night.png)";
        cloudButton.disabled = true;
    }
}

let timeButton = document.querySelector(".time-switch");
function switchTimeUnit() {
    if (timeUnit == "military") {
        console.log("Switching to standard time.");
        timeUnit = "standard";
        timeButton.style.backgroundImage = "url(assets/img/phone_icons/time-icon-standard.png)";
    }
    else {
        console.log("Switching to military time.");
        timeUnit = "military";
        timeButton.style.backgroundImage = "url(assets/img/phone_icons/time-icon-military.png)";
    }
}

let tempButton = document.querySelector(".temp-switch");
function switchTempUnit() {
    if (tempUnit == "C") {
        console.log("Switching to Fahrenheit.");
        tempUnit = "F";
    }
    else {
        console.log("Switching to Celcius.");
        tempUnit = "C";
    }

    updateWeather();

    tempButton.disabled = true;             //cooldown to limit api calls
    tempButton.style.backgroundImage = "url(assets/img/phone_icons/temp-icon-cd.png)";
    setTimeout(function () {
        tempButton.disabled = false;
        tempButton.style.backgroundImage = "url(assets/img/phone_icons/temp-icon.png)";
    }, 5000);
}

const song_list_ordered = [
    {
        name: "Phantom",
        source: "Persona 5",
        artist: "アトラスサウンドチーム",
        order: 1,
        path: "assets/audio/Persona_5-Phantom.mp3"
    },
    {
        name: "Beneath the Mask (Rain)",
        source: "Persona 5",
        artist: "Lyn",
        order: 2,
        path: "assets/audio/Persona_5-Beneath_the_Mask_(Rain).mp3"
    },
    {
        name: "Layer Cake",
        source: "Persona 5",
        artist: "アトラスサウンドチーム",
        order: 3,
        path: "assets/audio/Persona_5-Layer_Cake.mp3"
    },
    {
        name: "I Believe",
        source: "Persona 5 Royal",
        artist: "Lyn",
        order: 4,
        path: "assets/audio/Persona_5_Royal-I_Believe.mp3"
    },
    {
        name: "No More What Ifs",
        source: "Persona 5 Royal",
        artist: "Lyn",
        order: 5,
        path: "assets/audio/Persona_5_Royal-No_More_What_Ifs.mp3"
    },
    {
        name: "Heartbeat, Heartbreak",
        source: "Persona 4",
        artist: "Shihoko Hirata",
        order: 6,
        path: "assets/audio/Persona_4-Heartbeat_Heartbreak.mp3"
    },
    {
        name: "Signs of Love",
        source: "Persona 4",
        artist: "Shihoko Hirata",
        order: 7,
        path: "assets/audio/Persona_4-Signs_of_Love.mp3"
    },
    {
        name: "Heaven",
        source: "Persona 4",
        artist: "Shihoko Hirata",
        order: 8,
        path: "assets/audio/Persona_4-Heaven.mp3"
    },
    {
        name: "Memories of You",
        source: "Persona 3",
        artist: "Yumi Kawamura",
        order: 9,
        path: "assets/audio/Persona_3-Kimi_no_Kioku_Memories_of_You.mp3"
    },
    {
        name: "A Lone Prayer",
        source: "Persona 1 (PSP)",
        artist: "Yumi Kawamura",
        order: 10,
        path: "assets/audio/Persona_1-A_Lone_Prayer.mp3"
    }
];

//create object copy for us to modify without changing original order
let song_list = JSON.parse(JSON.stringify(song_list_ordered));

let song_source = document.querySelector(".song-source");
let song_name = document.querySelector(".song-name");
let song_artist = document.querySelector(".song-artist");

let playpause_btn = document.querySelector(".playpause-song");
let skip_btn = document.querySelector(".skip-song");
let prev_btn = document.querySelector(".prev-song");

let seek_slider = document.querySelector(".seek-slider");
let volume_slider = document.querySelector(".volume-slider");
let curr_time = document.querySelector(".current-time");
let song_duration = document.querySelector(".duration");
let seekPos = 0;

let song_index = 0;
let isPlaying = false;
let updateTimer;

let current_song = document.createElement('audio');

function loadSong(song_index) {
    clearInterval(updateTimer);
    resetValues();

    current_song.src = song_list[song_index].path;
    current_song.load();

    song_name.textContent = song_list[song_index].name;
    song_artist.textContent = song_list[song_index].artist;
    song_source.textContent = song_list[song_index].source;

    //Update progress slider every second
    updateTimer = setInterval(seekUpdate, 1000);

    //When current song ends, play next song
    current_song.addEventListener("ended", skipSong);
}

function resetValues() {
    curr_time.textContent = "00:00";
    song_duration.textContent = "00:00";
    seek_slider.value = 0;
}

function playPause() {
    if (!isPlaying) playSong();
    else pauseSong();
}

function playSong() {
    current_song.play();
    isPlaying = true;
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseSong() {
    current_song.pause();
    isPlaying = false;
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

let previous_song = "";
function skipSong() {
    if (!repeatStatus) {
        if (song_index < song_list.length - 1) song_index++;
        else song_index = 0;
    }
    loadSong(song_index);
    playSong();
}

function prevSong() {
    //move backwards in song list; jump to end if at beginning of list
    if (song_index > 0) song_index -= 1;
    else song_index = song_list.length - 1;

    loadSong(song_index);
    playSong();
}

let shuffleButton = document.querySelector(".shuffle-songs");
let shuffleStatus = false;
function shuffleSongs() {
    shuffleStatus = !shuffleStatus;
    if (shuffleStatus) {
        shuffleButton.style.color = "white";
        repeatStatus = false;
        repeatButton.style.color = "black";

        shuffleList(song_list);
        console.log("Song list shuffled.");
        console.log("Song index is now: " + song_index);
    }
    else {
        shuffleButton.style.color = "black";
        //revert back to original song order
        song_index = song_list[song_index].order - 1;
        song_list = JSON.parse(JSON.stringify(song_list_ordered));;
        console.log("Song index changed to " + song_index);
    }
}

let repeatButton = document.querySelector(".repeat-song");
let repeatStatus = false;
function repeatSong() {
    repeatStatus = !repeatStatus;
    if (repeatStatus) {
        repeatButton.style.color = "white";
        shuffleStatus = false;
        shuffleButton.style.color = "black";
    }
    else repeatButton.style.color = "black";
}

function seekTo() {
    //find current position by calc percentage of song 
    seekPos = current_song.duration * (seek_slider.value / 100);
    current_song.currentTime = seekPos;
}

function setVolume() {
    current_song.volume = volume_slider.value / 100;
}

function seekUpdate() {
    let seekPosition = 0;

    //check if duration is valid
    if (!isNaN(current_song.duration) && isPlaying == true) {

        seekPosition = current_song.currentTime * (100 / current_song.duration);
        seek_slider.value = seekPosition;

        //calc time left and total duration
        let currentMin = Math.floor(current_song.currentTime / 60);
        let currentSec = Math.floor(current_song.currentTime - currentMin * 60);
        let durationMin = Math.floor(current_song.duration / 60);
        let durationSec = Math.floor(current_song.duration - durationMin * 60);

        //add zero to single digit time values
        if (currentSec < 10) currentSec = "0" + currentSec;
        if (durationSec < 10) durationSec = "0" + durationSec;
        if (currentMin < 10) currentMin = "0" + currentMin;
        if (durationMin < 10) durationMin = "0" + durationMin;

        //display updated duration
        curr_time.textContent = currentMin + ":" + currentSec;
        song_duration.textContent = durationMin + ":" + durationSec;
    }
}

function shuffleList(list) {
    var i = list.length,
        j = 0,
        temp;
    while (i--) {
        j = Math.floor(Math.random() * (i + 1));
        // swap randomly chosen index with current index
        temp = list[i];
        list[i] = list[j];
        list[j] = temp;
    }
    return list;
}

loadSong(song_index);
setVolume();

//STATUS                TODO                                                            EFFORT REQ
// [-]      lore accurate weather display                                               high
// [-]      separate settings and music player into separate menues                     med

// [~]    toggle individual displays (clouds, clock, calendar, weather, etc.)           med
