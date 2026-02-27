const form = document.querySelector("#weatherform");
const city = document.querySelector("#city");
const container = document.querySelector(".info");
const history = document.querySelector("#searchHistory");
const consoleBox = document.querySelector("#consoleBox");

// ✅ log function (no auto scroll)
function logMessage(msg) {
  const p = document.createElement("p");
  p.textContent = msg;
  consoleBox.appendChild(p);
}

let visitedCities = JSON.parse(localStorage.getItem("visitedCities")) || [];

const API_KEY = "d0b4bd2cdbb42ae1a0998288414eacea";

async function searchWeather(cityName) {
  try {
    consoleBox.innerHTML = ""; // clear old logs

    // ✅ EVENT LOOP START
    logMessage("1️⃣ Sync Start");

    const responsePromise = fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
    );

    logMessage("[ASYNC] Start fetching");

    logMessage("2️⃣ Sync End"); // ✅ correct position

    const response = await responsePromise;

    logMessage("3️⃣ Promise.then (Microtask)");

    const weatherData = await response.json();

    setTimeout(() => {
      logMessage("4️⃣ setTimeout (Macrotask)");
    }, 0);

    // ✅ UI UPDATE
    if (weatherData.cod == 200) {
      container.innerHTML = `
        <h3>Weather Info</h3>
        <p>City: ${weatherData.name}</p>
        <p>Temp: ${(weatherData.main.temp - 273.15).toFixed(1)}°C</p>
        <p>Weather: ${weatherData.weather[0].main}</p>
        <p>Humidity: ${weatherData.main.humidity}</p>
        <p>Wind: ${weatherData.wind.speed} m/s</p>
      `;

      logMessage("[ASYNC] Data received");

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

// ✅ FORM SUBMIT
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = city.value.trim().toLowerCase();

  if (data) {
    searchWeather(data);
  }
});

// ✅ HISTORY BUTTONS
function showHistory() {
  history.innerHTML = "";

  const cities = JSON.parse(localStorage.getItem("visitedCities")) || [];

  cities.forEach((cityName) => {
    if (typeof cityName !== "string") return;

    const btn = document.createElement("button");
    btn.textContent = cityName;

    btn.addEventListener("click", () => {
      searchWeather(cityName);
    });

    history.appendChild(btn);
  });
}

showHistory();
