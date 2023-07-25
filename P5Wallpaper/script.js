let calDay = document.getElementById("day");
let calMonth = document.getElementById("month");
let calYear = document.querySelector(".calendar-year");

let clockHr = document.getElementById("hours");
let clockMin = document.getElementById("minutes");
let clockSec = document.getElementById("seconds");

let city = document.querySelector(".city");
let clouds = document.querySelector(".clouds-container");

let date = new Date();
let day, month, year, hours, minutes, seconds, currentTime;

let weatherUpdateMin = 15;

function updateDate() {
    let date = new Date();

    day = checkZero(date.getDate());
    month = checkZero(date.getMonth() + 1);     //+1 because months start at 0
    year = checkZero(date.getFullYear());

    hours = checkZero(date.getHours());
    minutes = checkZero(date.getMinutes());
    seconds = checkZero(date.getSeconds());
    currentTime = hours + ":" + minutes + ":" + seconds;


    calDay.innerHTML = day;
    calMonth.innerHTML = month;
    calYear.innerHTML = year;

    clockHr.innerHTML = hours;
    clockMin.innerHTML = minutes;
    clockSec.innerHTML = seconds;

    checkDayNight();
    setTimeout(updateDate, 1000)        //update every second
}

function checkZero(i) {         // add zero in front of numbers < 10
    if (i < 10) {i = "0" + i};  
    return i;
  }

function checkDayNight() {      //city day/night cycle
    if (hours >= 6 && hours <= 18){     //day = 6am->6pm
        // console.log("%cIsDay " + currentTime, "color:cyan");
        city.style.backgroundImage = "url(assets/img/cityDay.jpg)";
        clouds.style.display = "inline";
        city.style.animation = "none";
    }
    else {
        // console.log("%cIsNight " + hours, "color:gold");
        city.style.backgroundImage = "url(assets/img/cityNightOn.jpg)";
        clouds.style.display = "none";
        city.style.animation = "flashingCity 3s linear infinite";
    }
}

let lon, lat;
let temperature = document.querySelector(".weather-temp");
let loc = document.querySelector(".weather-location");
let icon = document.querySelector(".weather-icon");

window.addEventListener("load", () => {     //weather api call
    updateWeather();
    updateDate();
  });

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
    `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` +
    `lon=${lon}&units=imperial&appid=${api}`;
        
            // Calling the API
            fetch(base)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                temperature.textContent = 
                    Math.floor(data.main.temp) + "°F";
                loc.textContent = data.name + ", " + data.sys.country;
                let icon1 = data.weather[0].icon;
                icon.innerHTML = 
                    `<img src="assets/img/${icon1}.png" style= 'height:100px'/>`; 
            });
        });
    }
    console.log("Weather updated.")
    setTimeout(updateWeather, weatherUpdateMin*60000)        //update every x mins (converted mins to ms)
}
