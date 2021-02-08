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
  function forecastInfo(response) {
    let forecast = document.querySelector("#forecast-info");
  }
  // Forecast
  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchInput.value}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(forecastInfo);
}
// Date & Time Info
function dateFormat(timestamp) {
  let date = new Date(timestamp);
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
  let month = monthNames[date.getMonth()];

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return ` ${date.getDate()} ${month}, ${day}`;
}

function hourFormat(timestamp) {
  let date = new Date(timestamp);

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

// Searched City

function tempCitySearched(response) {
  let date = (document.querySelector("#current-date").innerHTML = dateFormat(
    response.data.dt * 1000
  ));

  let hour = (document.querySelector("#current-hour").innerHTML = hourFormat(
    response.data.dt * 1000
  ));

  let city = (document.querySelector("#search-city").innerHTML =
    response.data.name);

  celsiusTemp = response.data.main.temp;

  let temp = (document.querySelector("#temp-shown").innerHTML = Math.round(
    celsiusTemp
  ));
  let description = (document.querySelector("#description-weather").innerHTML =
    response.data.weather[0].description);
  let wind = (document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  ));
  let humidity = (document.querySelector("#humidity").innerHTML =
    response.data.main.humidity);
  let icon = document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
}

// Temperature Units

function showFahrTemperature(event) {
  event.preventDefault();
  let fahrTemperature = (celsiusTemp * 9) / 5 + 32;
  let tempElement = (document.querySelector("#temp-shown").innerHTML =
    Math.round(fahrTemperature) + "");
}

function showCelsiusTemperature(event) {
  event.preventDefault();
  let tempElement = (document.querySelector(
    "#temp-shown"
  ).innerHTML = Math.round(celsiusTemp));
}

// Current Location

function locationTemp(response) {
  let date = (document.querySelector("#current-date").innerHTML = dateFormat(
    response.data.dt * 1000
  ));

  let hour = (document.querySelector("#current-hour").innerHTML = hourFormat(
    response.data.dt * 1000
  ));
  let humidity = (document.querySelector("#humidity").innerHTML =
    response.data.main.humidity);

  let cityCurrent = response.data.name;
  let cityCurrentPosition = (document.querySelector(
    "#search-city"
  ).innerHTML = cityCurrent);

  let temperatureCurrentPosition = document.querySelector("#temp-shown");
  let temperatureCurrent = Math.round(response.data.main.temp);
  celsiusTemp = temperatureCurrent;
  temperatureCurrentPosition.innerHTML = temperatureCurrent;
  let iconCurrent = document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  let descriptionCurrent = (document.querySelector(
    "#description-weather"
  ).innerHTML = response.data.weather[0].description);
  let wind = (document.querySelector("#wind-speed").innerHTML = Math.round(
    response.data.wind.speed
  ));
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

// Runnings

let button = document.querySelector("#current-button");
button.addEventListener("click", getCurrentPosition);

let celsiusTemp = null;
let form = document.getElementById("form");
form.addEventListener("submit", search);

let fahrenheit = document.querySelector("#fahrenheit-link");
fahrenheit.addEventListener("click", showFahrTemperature);

let celsius = document.querySelector("#celsius-link");
celsius.addEventListener("click", showCelsiusTemperature);
