// APIKEY
let apiKey = "be65b4815a4ad8711d696d04653d1f47";

// data for Forecast
let currentInfoForecast = 1; // 1 = hours & 0 = days
let currentLocation = 0; // 0 = current city & 1 = search city

let lastCurrentLocation;

// Search Form
function search(event = {}) {
  currentLocation = 1; // 0 = current city & 1 = search city
  if (event.preventDefault) {
    event.preventDefault();
  }
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
  if (response.data.main) {
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
    let description = (document.querySelector(
      "#description-weather"
    ).innerHTML = response.data.weather[0].description);
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
    // Forecast API
    lastCurrentLocation = {
      coords: {
        latitude: response.data.coord.lat,
        longitude: response.data.coord.lon,
      },
    };
    apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${response.data.coord.lat}&lon=${response.data.coord.lon}&units=metric&appid=${apiKey}`;
    axios.get(apiUrl).then(forecastInfoHours);
  }
}

// Forecast by HOURS

function forecastInfoHours(response) {
  currentInfoForecast = 0; // 1 = hours & 0 = days
  let forecastElement = document.querySelector("#forecast-info");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 5; index++) {
    let date = response.data.hourly[index].dt;
    let tempCel = Math.round(response.data.hourly[index].temp);
    let tempFar = Math.round((tempCel * 9) / 5 + 32);
    let iconForecast = response.data.hourly[index].weather[0].icon;
    let forecastDescription =
      response.data.hourly[index].weather[0].description;
    forecastElement.innerHTML += `
    
  <div class="col-sm-6 col-md-2 container-border me-1">
    <p>${hourFormat(date * 1000, 0)}</p>
    <img src="http://openweathermap.org/img/wn/${iconForecast}@2x.png" id="icon-forecast" class="icon temp" />
    <p> ${tempCel}ºC Max </br> ${tempFar}ºF</p>
    <p>${forecastDescription}</p>

  </div>
  `;
  }
}

// Forecast by DAYS

function forecastInfoDays(response) {
  currentInfoForecast = 1; // 1 = hours & 0 = days
  let forecastElement = document.querySelector("#forecast-info");
  forecastElement.innerHTML = "";
  for (let index = 1; index < 6; index++) {
    let date = response.data.daily[index].dt;
    let tempCelMax = Math.round(response.data.daily[index].temp.max);
    let tempCelMin = Math.round(response.data.daily[index].temp.min);
    let tempFarMax = Math.round((tempCelMax * 9) / 5 + 32);
    let tempFarMin = Math.round((tempCelMin * 9) / 5 + 32);
    let iconForecast = response.data.daily[index].weather[0].icon;
    let forecastDescription = response.data.daily[index].weather[0].description;
    const aux = new Date(date * 1000);
    forecastElement.innerHTML += `
  <div class="col-sm-12 col-md-2 container-border me-1">
    <p>${dateFormat(date * 1000, 0)}</p>
    <img src="http://openweathermap.org/img/wn/${iconForecast}@2x.png" id="icon-forecast" class="icon temp" />
    <p> ${tempCelMax}ºC Max / ${tempCelMin}ºC Min </br> ${tempFarMax}ºF Max / ${tempFarMin}ºF Min </p>
    <p>${forecastDescription}</p>

  </div>
  `;
  }
}

// Button Forecast Days & Hours

function changeForecastInfo(event) {
  event.preventDefault();

  let forecastButton = document.querySelector("#forecast-button");
  let latitude = lastCurrentLocation.coords.latitude;
  let longitude = lastCurrentLocation.coords.longitude;
  if (currentInfoForecast === 0) {
    forecastButton.innerHTML = `To see the forecast by hours click here!`;

    if (currentLocation === 0) {
      let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
      axios.get(urlForecast).then(forecastInfoDays);
    } else {
      let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
      axios.get(urlForecast).then(forecastInfoDays);
    }
  }

  if (currentInfoForecast === 1) {
    forecastButton.innerHTML = `To see the forecast by days click here!`;

    if (currentLocation === 0) {
      let latitude = lastCurrentLocation.coords.latitude;
      let longitude = lastCurrentLocation.coords.longitude;
      let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
      axios.get(urlForecast).then(forecastInfoHours);
    } else {
      let urlForecast = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
      axios.get(urlForecast).then(forecastInfoHours);
    }
  }
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

function currentLocationFunc(position) {
  currentLocation = 0; // 0 = current city & 1 = search city
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  lastCurrentLocation = position;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(locationTemp);

  apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
  axios.get(apiUrl).then(forecastInfoHours);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(currentLocationFunc);
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

let forecastButton = document.querySelector("#forecast-button");
forecastButton.addEventListener("click", changeForecastInfo);

//
document.querySelector("#search").value = "Lisbon";

search();
