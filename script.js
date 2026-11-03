
const locations = {
    "Tamil Nadu": {
        "Chennai": [13.0827, 80.2707],
        "Coimbatore": [11.0168, 76.9558],
        "Madurai": [9.9252, 78.1198],
        "Tiruchirappalli": [10.7905, 78.7047],
        "Salem": [11.6643, 78.1460]
    },
    "Puducherry": {
        "Puducherry": [11.9416, 79.8083]
    }
};

function loadCities() {
    const state = document.getElementById("stateSelect").value;
    const citySelect = document.getElementById("citySelect");

    citySelect.innerHTML =
        '<option value="">-- Select City --</option>';

    if (state === "") {
        return;
    }

    const cities = locations[state];

    for (let city in cities) {
        const option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        citySelect.appendChild(option);
    }
}

function getWeather() {
    const state = document.getElementById("stateSelect").value;
    const city = document.getElementById("citySelect").value;
    const result = document.getElementById("weatherResult");
    const loading = document.getElementById("loading");

    if (state === "" || city === "") {
        result.innerHTML =
            "<p class='error'>Please select State and City.</p>";
        return;
    }

    loading.innerHTML = "Loading weather data...";
    result.innerHTML = "";

    
    const xhr = new XMLHttpRequest();

    xhr.open("GET", "weather.json", true);

    xhr.onload = function () {
        loading.innerHTML = "";

        if (xhr.status === 200) {
           
            const data = JSON.parse(xhr.responseText);

            const current = data[city];

            if (!current) {
                result.innerHTML =
                    "<p class='error'>Weather data not found.</p>";
                return;
            }

            const description =
                getWeatherDescription(current.weather_code);

            result.innerHTML = `
                <h2>${city}</h2>

                <p class="condition">${description}</p>

                <div class="weather-grid">
                    <div class="weather-item">
                        <span>Temperature</span>
                        <strong>${current.temperature_2m} °C</strong>
                    </div>

                    <div class="weather-item">
                        <span>Feels Like</span>
                        <strong>${current.apparent_temperature} °C</strong>
                    </div>

                    <div class="weather-item">
                        <span>Humidity</span>
                        <strong>${current.relative_humidity_2m} %</strong>
                    </div>

                    <div class="weather-item">
                        <span>Wind Speed</span>
                        <strong>${current.wind_speed_10m} km/h</strong>
                    </div>

                    <div class="weather-item">
                        <span>Precipitation</span>
                        <strong>${current.precipitation} mm</strong>
                    </div>
                </div>

                <p class="updated">
                    Weather data fetched using AJAX and JSON.
                </p>
            `;
        } else {
            result.innerHTML =
                "<p class='error'>Unable to fetch weather data.</p>";
        }
    };

    xhr.onerror = function () {
        loading.innerHTML = "";
        result.innerHTML =
            "<p class='error'>Unable to load weather.json. Check your server.</p>";
    };

    xhr.send();
}

function getWeatherDescription(code) {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code === 45 || code === 48) return "Fog";
    if (code >= 51 && code <= 57) return "Drizzle";
    if (code >= 61 && code <= 67) return "Rain";
    if (code >= 71 && code <= 77) return "Snow";
    if (code >= 80 && code <= 82) return "Rain Showers";
    if (code >= 95) return "Thunderstorm";

    return "Weather Information";
}
