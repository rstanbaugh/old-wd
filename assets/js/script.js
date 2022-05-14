var citySearchEl = document.querySelector("#city-search");
var forecastContainerEl = document.querySelector("#forecast");

var alert_1 = "Error: City Not Found";
var alert_2 = "Error: City Not Found.\n\nSearch: city, state, country or zip code.";
var alert_3 = "Please enter a City";
var alert_4 = "network error"

// get apiKeys from config.js
var apiKeyOpenWeather = config.openWeatherApiKey;
var apiKeyPositionStack = config.positionStackApiKey

var cities = [];
var selectedCity = {};

// object & methods for weather data
var weatherData = {
  f_dt: [],
  f_maxTemp: [],
  f_minTemp: [],
  f_minTemp: [],
  f_clouds: [],
  f_humidity: [],
  f_icon: [],
  f_description: [],

  wind: function(){
    return this.windSpeed+" mph from "+this.windDeg+"º gusting "+this.windGust+" mph";
  },

  currentTemp: function(){
    return this.temp+"º (feels like " + this.feelsLike+"º)";
  },

  clear: function(){
    f_dt = [];
    f_maxTemp = [];
    f_minTemp = [];
    f_minTemp = [];
    f_clouds = [];
    f_humidity = [];
    f_icon = [];
    f_description = [];
  }
};



var searchHistory = function(city){
  // limit search history to 8 cities
  if (cities.length >= 10) {
    cities = cities.slice(1,10);
  }
  // don't enter duplicate cities
  if(!cities.includes(city)){
    cities.push(city);
  } else {
    // move current search to top of the list
    cities.push(cities.splice(cities.indexOf(city), 1)[0]);
  }
  $("#past-searches").empty();
  let i = cities.length - 1;
  while (i >= 0){
    $("#past-searches").append("<button type='button' class='list-group-item list-group-item-action'>"+cities[i]+"</button>");
    i--;
  }

};
var forecastDate = function(unixTime){
  return (moment
    .unix(unixTime)
    .format("ddd  DD"));
};

var displayWeather = function(){
   // display existing current weather
  $("#current-weather").empty();

  $("#current-weather").append("<h5>"+selectedCity.label + " - " + moment(weatherData.dt).format("MMM DD, YYYY")+"</h5>");
  $("#current-weather").append("<img src=https://openweathermap.org/img/wn/"+weatherData.icon+"@2x.png>");
  $("#current-weather").append("<p><b>Temp:</b> " + weatherData.currentTemp()+"</p>");
  $("#current-weather").append("<p>Wind:</b> "+weatherData.wind()+"</p>");
  $("#current-weather").append("<p><b>Humidity:</b> <>"+weatherData.humidity+"%</p>");
  $("#current-weather").append("<p id=uvi><b>UV Index:</b> <span>"+weatherData.uvi+"</span></p>");  
    // if favorable / moderate / severe
    if (weatherData.uvi <= 2) {
      $("#uvi span").addClass("badge badge-success");
    } else if (weatherData.uvi <= 5)
      $("#uvi span").addClass("badge badge-warning");
    else {
      $("#uvi span").addClass("badge badge-danger");
    }
  
  // delete any existing forecast cards
  $("#forecast").empty();

  // display forecast
  for (i = 1; i < 6;i ++){
    var card = document.createElement("div");
    card.classList = "weather-card rounded bg-primary m-2";

    // create the date header
    var header = document.createElement("h5");
    header.innerHTML = forecastDate(weatherData.f_dt[i]);
    card.appendChild(header);
   
    // create the weather icon
    var weatherIcon = document.createElement("img");
    weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/"+weatherData.f_icon[i]+"@2x.png");
    card.appendChild(weatherIcon);

    // create weather description
    var description = document.createElement("p");
    description.innerHTML = weatherData.f_description[i];
    card.appendChild(description);

    var temps = document.createElement("p");
    temps.innerHTML = weatherData.f_maxTemp[i] + "º | " + weatherData.f_minTemp[i] + "º";
    card.appendChild(temps);
    
    var temps = document.createElement("p");
    temps.innerHTML = "Humidity "+weatherData.f_humidity[i] + "%";
    card.appendChild(temps);

    $("#forecast").append(card);
  };

};

var geoCodeCity = function (location) {
    var location = location.toString().replace(/ /g, '%20');

    // use position stack api to find the lat / lon of the city (much better than getweather geocoding)
    apiUrl = `http://api.positionstack.com/v1/forward?access_key=${apiKeyPositionStack}&query=${location}&limit=1`
    
      // make a request to the api
  fetch(apiUrl).then (response => {
    //  check if api returned any weather
    if(response.ok){
      response.json()
        .then (data => {
          // check if valid location found
          if (data.data[0]){
            // write data to selectedCity obj
            selectedCity.label = data.data[0].label;
            selectedCity.city = data.data[0].locality;
            selectedCity.street = data.data[0].street;
            selectedCity.state = data.data[0].region;
            selectedCity.zip = data.data[0].postal_code;
            selectedCity.country = data.data[0].country_code;
            selectedCity.lat = data.data[0].latitude;
            selectedCity.lon = data.data[0].longitude;

            //  save selected city and getWeather()
            searchHistory(selectedCity.label);
            getweatherData(selectedCity.lat, selectedCity.lon);

          } else {
            alert(alert_2)
          }

        })
    } else {
      alert(alert_2);
    }
  })
  .catch(error => {
    // this catch is chained to the end of the '.then()
    alert(alert_4);
  });
}

var getweatherData = function(lat, lon){
  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyOpenWeather}`
  // make a request to the api
  fetch(apiUrl).then (response => {
    //  check if api returned any weather
    if(response.ok){
      response.json()
        .then (data => {
          weatherData.clear();
          // write to api data to WeatherData obj and handles data errors with "-"
          if (data.current.hasOwnProperty("temp")){
            weatherData.temp = data.current.temp.toFixed(0);
          } else {weatherData.temp = "n/a";}

          if (data.current.weather[0].hasOwnProperty("icon")){
            weatherData.icon = data.current.weather[0].icon;
          } else {weatherData.icon = "n/a";}

          if(data.current.hasOwnProperty("feels_like")) {
            weatherData.feelsLike = data.current.feels_like.toFixed(0);
          } else {weatherData.feelsLike = "n/a";}

          if(data.current.hasOwnProperty("humidity")) {
            weatherData.humidity = data.current.humidity.toFixed(0);
          } else {weatherData.humidity = "n/a";}
          
          if(data.current.hasOwnProperty("pressure")) {
            weatherData.pressure = data.current.pressure.toFixed(1);
          } else {weatherData.pressure = "n/a";}

          if(data.current.hasOwnProperty("wind_deg")) {
            weatherData.windDeg = data.current.wind_deg.toFixed(0);
          } else {weatherData.windDeg = "n/a";}

          if(data.current.hasOwnProperty("wind_speed")) {
            weatherData.windSpeed = data.current.wind_speed.toFixed(0);
          } else {weatherData.windSpeed = "n/a";}

          if(data.current.hasOwnProperty("wind_gust")) {
            weatherData.windGust = data.current.wind_gust.toFixed(0);
          } else {weatherData.windGust = "n/a";}

          if(data.current.hasOwnProperty("uvi")) {
            weatherData.uvi = data.current.uvi.toFixed(1);
          } else {weatherData.uvi = "n/a";}

          
          // now fetch forecast data
          for (i in data.daily){
            weatherData.f_dt[i] = data.daily[i].dt;
            weatherData.f_icon[i] = data.daily[i].weather[0].icon;
            weatherData.f_description[i] = data.daily[i].weather[0].description;
            weatherData.f_maxTemp[i] = data.daily[i].temp.max.toFixed(0);
            weatherData.f_minTemp[i] = data.daily[i].temp.min.toFixed(0);
            weatherData.f_clouds[i] = data.daily[i].clouds;
            weatherData.f_humidity[i] = data.daily[i].humidity;
          }
          displayWeather()
        });
    } else {
      alert(alert_1);
    }
  })
  .catch(error => {
    // this catch is chained to the end of the '.then()
    alert(alert_4);
  });
};
var pastSearchClickHandler = function(event){
  event.preventDefault();
  geoCodeCity($(event.target).text());
};

var formSubmitHandler = function(event){
  event.preventDefault();
  let city = $("#city").val().trim();
  $("#city").val("")
  
  if(city){
      geoCodeCity(city);
 
  } else{
      alert(alert_3);
  }};

  // default City
  geoCodeCity("Miami, FL");

// listeners
$("#city-search").on("submit", formSubmitHandler);
$("#past-searches").on("click", pastSearchClickHandler);
