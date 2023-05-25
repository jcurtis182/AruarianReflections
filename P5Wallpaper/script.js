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

updateDate();

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

    setTimeout(updateDate, 1000)        //update every x millis
}

function checkZero(i) {         // add zero in front of numbers < 10
    if (i < 10) {i = "0" + i};  
    return i;
  }

function checkDayNight() {      //city day/night cycle
    if (hours >= 6 && hours <= 18){     //day = 6am->6pm
         console.log("%cIsDay " + currentTime, "color:cyan");
        city.style.backgroundImage = "url(/assets/img/cityDay.jpeg)";
        clouds.style.display = "inline";
        city.style.animation = "none";
    }
    else {
        // console.log("%cIsNight " + hours, "color:gold");
        city.style.backgroundImage = "url(/assets/img/cityNightOn.jpeg)";
        clouds.style.display = "none";
        city.style.animation = "flashingCity 3s linear infinite";
    }
} 