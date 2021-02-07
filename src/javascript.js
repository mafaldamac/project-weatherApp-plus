// date and time - current
let now = new Date();
let divCurrentInfo = document.getElementById("current-info");
let currentDateElement = document.getElementById("current-date");
let currentHourElement = document.getElementById("current-hour");
let date = now.getDate();
let month = now.getMonth();
let hours = now.getHours();
let minutes = now.getMinutes() + "";
let monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let day = days[now.getDay()];
currentDateElement.innerHTML = `${day}, ${date} ${monthNames[month]}`;
currentHourElement.innerHTML = `${hours}:${minutes}`;

// APIKEY
let apiKey = "be65b4815a4ad8711d696d04653d1f47";

// Search Form
function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#search");

  let city = document.querySelector("#search-city");
  if (searchInput.value) {
    city.innerHTML = `${searchInput.value}`;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${searchInput.value}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(tempCitySearched);
  } else {
    alert("Please write a city to search");
  }
}

function tempCitySearched(response) {
  console.log(response.data);
  let city = (document.querySelector("#search-city").innerHTML =
    response.data.name);
  let temp = (document.querySelector("#temp-shown").innerHTML = Math.round(
    response.data.main.temp
  ));
  let description = (document.querySelector("#description-weather").innerHTML =
    response.data.weather[0].description);
  let wind = (document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  ));
  let icon = document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
}

// degree  changes - C to F
function ctoF(degreeCelsius) {
  let degreesFar = degreeCelsius * 1.8 + 32;
  return degreesFar.toFixed(1);
}

function ftoC(degreeFarn) {
  let deegresCelsius = (degreeFarn - 32) / 1.8;
  return deegresCelsius.toFixed(1);
}

function degreesChange() {
  let celsiusAndFar = document.getElementById("celsius-link");
  let tempDif = document.getElementById("temp-shown");
  let units = celsiusAndFar.innerHTML;

  if (units === "ºC") {
    celsiusAndFar.innerHTML = "ºF";
    let fahDegree = ctoF(Number(tempDif.innerHTML));
    tempDif.innerHTML = fahDegree;
  } else {
    celsiusAndFar.innerHTML = "ºC";
    let degreeCelsius = ftoC(Number(tempDif.innerHTML));
    tempDif.innerHTML = degreeCelsius;
  }
}

let celsTofah = document.getElementById("celsius-link");
celsTofah.addEventListener("click", degreesChange);

// Current Location

function locationTemp(response) {
  let cityCurrentPosition = document.querySelector("#search-city");
  let cityCurrent = response.data.name;
  cityCurrentPosition.innerHTML = cityCurrent;
  let temperatureCurrentPosition = document.querySelector("#temp-shown");
  let temperatureCurrent = Math.round(response.data.main.temp);
  temperatureCurrentPosition.innerHTML = temperatureCurrent;
}

function currentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(locationTemp);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(currentLocation);
}

let button = document.querySelector("#current-button");
button.addEventListener("click", getCurrentPosition);

let form = document.getElementById("form");
form.addEventListener("submit", search);
