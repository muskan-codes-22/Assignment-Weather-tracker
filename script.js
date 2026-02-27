const form = document.querySelector("#weatherform");
const city = document.querySelector("#city");
const container = document.querySelector(".info");
const history = document.querySelector("#searchHistory");

let visitedCities = JSON.parse(localStorage.getItem("visitedCities")) || [];

const API_KEY = "d0b4bd2cdbb42ae1a0998288414eacea";

async function searchWeather(cityName) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`,
    );

    const weatherData = await response.json();

    if (weatherData.cod == 200) {
      container.innerHTML = `
        <h3>Weather Info</h3>
        <p>City: ${weatherData.name}</p>
        <p>Temp: ${(weatherData.main.temp - 273.15).toFixed(1)}°C</p>
        <p>Weather: ${weatherData.weather[0].main}</p>
        <p>Humidity: ${weatherData.main.humidity}</p>
        <p>Wind: ${weatherData.wind.speed} m/s</p>
      `;

      if (!visitedCities.includes(cityName)) {
        visitedCities.push(cityName);
        localStorage.setItem("visitedCities", JSON.stringify(visitedCities));
      }

      showHistory();
    } else {
      container.innerHTML = `
        <h3>Weather Info</h3>
        <p>${weatherData.message}</p>
      `;
    }
  } catch (e) {
    console.log(e);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = city.value.trim().toLowerCase();

  if (data) {
    searchWeather(data);
  }
});

function showHistory() {
  history.innerHTML = "";

  const cities = JSON.parse(localStorage.getItem("visitedCities")) || [];

  cities.forEach((cityName) => {
    const btn = document.createElement("button");

    btn.textContent = cityName;

    btn.addEventListener("click", () => {
      searchWeather(cityName);
    });

    history.appendChild(btn);
  });
}

showHistory();
