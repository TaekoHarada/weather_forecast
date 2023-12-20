const APIID = "431416ee6ac11ff008eca9e762cf30d3";
let default_city = "Calgary"; //later it will be determine from user's location

const serchBtn = document.getElementById("search_btn");
const cityText = document.getElementById("city");

// get lat and lon from city name
async function getCityData(city_name) {
  try {
    const response = await fetch(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city_name}&limit=1&appid=${APIID}`
    );

    // No error in response data
    if (response.ok) {
      // empty object
      if (Object.hasOwn(response)) {
        console.log("No data: ", Object.keys(response).length);
        throw new Error(Object.hasOwn(response));
      } else {
        const city_data = await response.json();

        return city_data;
      }
    } else {
      throw new Error(response.status);
    }
  } catch (err) {
    console.error("ERROR", err);
    return err;
  }
}

//get weather data from its position(lat, lon)
async function getWeatherData(lat, lon) {
  console.log(lat, lon);
  try {
    const response = await fetch(
      `http://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&appid=${APIID}`
    );
    // No error in response data
    if (response.ok) {
      const weather_data = await response.json();
      console.log(weather_data);
      return weather_data;
    } else {
      throw new Error(response.status);
    }
  } catch (err) {
    console.error("ERROR", err);
    return err;
  }
}

function getMonDay(date) {
  month_str = "";
  switch (date.getMonth()) {
    case 0:
      month_str = "Jan";
      break;
    case 1:
      month_str = "Feb";
      break;
    case 2:
      month_str = "Mar";
      break;
    case 3:
      month_str = "Apr";
      break;
    case 4:
      month_str = "May";
      break;
    case 5:
      month_str = "Jan";
      break;
    case 6:
      month_str = "Jul";
      break;
    case 7:
      month_str = "Aug";
      break;
    case 8:
      month_str = "Sep";
      break;
    case 9:
      month_str = "Oct";
      break;
    case 10:
      month_str = "Nov";
      break;
    case 11:
      month_str = "Dec";
      break;
  }

  date_str = month_str + " " + date.getDate();
  return date_str;
}

async function renderWeather(city_name) {
  getCityData(city_name)
    .then((city) => {
      return getWeatherData(city[0].lat, city[0].lon);
    })
    .then((weather_data) => {
      cityText.value = weather_data.city.name;
      for (let i = 0; i < 3; i++) {
        document.getElementById(`weather_${i + 1}`).innerText =
          weather_data.list[i].weather[0].main;

        // set image by Weather condition codes (open weather)
        weather_id = weather_data.list[i].weather[0].id;
        // weather_img = "images/clear.png";
        if ((weather_id >= 200) & (weather_id < 300)) {
          weather_img = "images/thunderstorm.png"; //Thunderstorm
        } else if ((weather_id >= 300) & (weather_id < 400)) {
          weather_img = "images/drizzle.png"; // Drizzle
        } else if ((weather_id >= 500) & (weather_id < 600)) {
          weather_img = "images/rain.png"; // Rain
        } else if ((weather_id >= 600) & (weather_id < 700)) {
          weather_img = "images/snow.png"; // Snow
        } else if ((weather_id >= 700) & (weather_id < 800)) {
          weather_img = "images/atmosphere.png"; // Atmosphere
        } else if (weather_id == 800) {
          weather_img = "images/clear.png"; // Clear
        } else if ((weather_id >= 800) & (weather_id < 900)) {
          weather_img = "images/clouds.png"; // Clouds
        }

        document.getElementById(`weather_pic_${i + 1}`).src = weather_img;

        document.getElementById(`date_${i + 1}`).innerText = getMonDay(
          new Date(weather_data.list[i].dt * 1000)
        );
        document.getElementById(`highest_${i + 1}`).innerText =
          parseInt(weather_data.list[i].temp.max - 273.15) + "℃";
        document.getElementById(`lowest_${i + 1}`).innerText =
          parseInt(weather_data.list[i].temp.min - 273.15) + "℃";
      }
    })
    .catch((error) => {
      console.log("catch error", error);
      cityText.value = default_city;
    });
}

// Initialize event
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page has been fully loaded for the first time!");
  cityText.value = default_city;
  renderWeather(cityText.value);
});

// Onclick event
//also want to add an event when use click enter button
serchBtn.addEventListener("click", () => {
  console.log("event happen!!");
  renderWeather(cityText.value);
});

cityText.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    console.log("press enter key");
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("search_btn").click();
  }
});
