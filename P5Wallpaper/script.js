let calDay = document.getElementById("day");
let calMonth = document.getElementById("month");
let calYear = document.querySelector(".calendar-year");

let clockHr = document.getElementById("hours");
let clockMin = document.getElementById("minutes");
let clockSec = document.getElementById("seconds");

let city = document.querySelector(".city");
let clouds = document.querySelector(".clouds-container");

let date = new Date();
let day, month, year, hours, minutes, seconds, currentClockTime;
let timeUnit = "standard";

let weatherUpdateMin = 15;

window.addEventListener("load", () => { 
    updateWeather();
    updateDate();
});


function updateDate() {
    let date = new Date();

    day = checkZero(date.getDate());
    month = checkZero(date.getMonth() + 1);     //+1 bc months start at 0
    year = checkZero(date.getFullYear());

    hours = date.getHours();
    minutes = date.getMinutes();
    seconds = date.getSeconds();
    currentClockTime = hours + ":" + minutes + ":" + seconds;

    calDay.innerHTML = day;
    calMonth.innerHTML = month;
    calYear.innerHTML = year;

    checkDayNight();                                          //find background day/night before time conversion

    if (timeUnit == "standard" && hours > 12) hours -= 12;    //standard time
                                                              //military time by default
    clockHr.innerHTML = checkZero(hours);
    clockMin.innerHTML = checkZero(minutes);
    clockSec.innerHTML = checkZero(seconds);

    setTimeout(updateDate, 1000)        //update every second
}

function checkZero(i) {         // add zero in front of numbers < 10
    if (i < 10) {i = "0" + i};  
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
            console.log(position);
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
                console.log(data);
                if (tempUnit == "F"){
                    temperature.textContent = Math.floor(data.main.temp) + "°F";
                }
                else {
                    temperature.textContent = Math.floor((data.main.temp - 32) / 1.8) + "°C";
                }
                loc.textContent = data.name + ", " + data.sys.country;
                let icon1 = data.weather[0].icon;
                icon.innerHTML = 
                    `<img src="assets/img/weather_icons/${icon1}.png" style= 'height:100px'/>`;
                
                weatherEffects("'" + icon1 + "'");
            });
        });
    }
    console.log("Weather updated.")
    setTimeout(updateWeather, weatherUpdateMin*60000)        //update every 15min (min to ms)
}

let effectsEnabled = true;
let effects = document.querySelector(".weather-effects");
function weatherEffects(weather) {
    // weather = '09d';
    console.log("Current weather code: " + weather);
    if (effectsEnabled){
        switch (weather) {
            case '09d':
            case '11d':
                city.style.filter = 'saturate(40%)';         //darken sky if raining during day
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
        }
    }
}


let menu = document.querySelector(".menu-container");
let menuButton = document.querySelector(".menu-button-outer");

function toggleMenu(){
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
    if (hours >= 6 && hours < 18){     //day = 6am->6pm
        city.style.backgroundImage = "url(assets/img/cityDay.jpg)";
        city.style.animation = "none";

        clouds.style.display = "inline";
        if (cloudButton.style.display = "url(assets/img/phone_icons/cloud-icon-night.png)") cloudButton.style.display = cloudStatus;    //restore previous status if page was loaded throughout the cycle
        cloudButton.disabled = false;
    }
    else {
        city.style.backgroundImage = "url(assets/img/cityNightOn.jpg)";
        city.style.animation = "flashingCity 3s linear infinite";

        clouds.style.display = "none";
        cloudStatus = cloudButton.style.backgroundImage;        //store current status before disabling
        cloudButton.style.backgroundImage = "url(assets/img/phone_icons/cloud-icon-night.png)";
        cloudButton.disabled = true;
    }
}

function switchTimeUnit() {
    if (timeUnit == "military"){
        console.log("Switching to standard time.");
        timeUnit = "standard";
    }
    else {
        console.log("Switching to military time.");
        timeUnit = "military";
    }
}

let tempButton = document.querySelector(".temp-switch"); 
function switchTempUnit() {
    if (tempUnit == "C"){
        console.log("Switching to Fahrenheit.");
        tempUnit = "F";
    }
    else {
        console.log("Switching to Celcius.");
        tempUnit = "C";
    }
    updateWeather();

    tempButton.disabled = true;             // cooldown to limit api calls
    tempButton.style.backgroundImage = "url(assets/img/phone_icons/temp-icon-cd.png)";
    setTimeout(function(){
        tempButton.disabled  = false;
        tempButton.style.backgroundImage = "url(assets/img/phone_icons/temp-icon.png)";
    }, 5000);
}

let song_list = [
    {
        name: "No More What Ifs",
        source: "Persona 5 Royal",
        artist: "Lyn",
        path: "assets/audio/Persona_5_Royal-No_More_What_Ifs.mp3"
    },
    {
        name: "Heartbeat, Heartbreak",
        source: "Persona 4",
        artist: "Shihoko Hirata",
        path: "assets/audio/Persona_4-Heartbeat_Heartbreak.mp3"
    },
    {
        name: "Memories of You",
        source: "Persona 3",
        artist: "Yumi Kawamura",
        path: "assets/audio/Persona_3-Kimi_no_Kioku_Memories_of_You.mp3"
    },
];

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

    //Update progression slider every 1000ms
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

function skipSong() {
    //move ahead in song list; start over if at end of list
    if (song_index < song_list.length - 1) song_index += 1;
    else song_index = 0;

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

loadSong(song_index);
setVolume();


//https://www.geeksforgeeks.org/create-a-music-player-using-javascript/#

//STATUS                TODO                                                            EFFORT REQ
// [-]      lore accurate calendar display                                              high
// [-]      lore accurate weather display                                               high
// [-]      customize app icons to show status                                          med
// [-]      music player                                                                high
// [-]          make icons (prev, skip, pause, play, vol up/down)                       med
// [-]          add music                                                               low
// [-]          custom playlists                                                        ultra
// [-]

// [~]    toggle individual displays (clouds, clock, calendar, weather, etc.)         med