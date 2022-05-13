var citySearchEl = document.querySelector("#city-search");


var apiKeyOpenWeather = config.openWeatherApiKey;
var apiKeyPositionStack = config.positionStackApiKey

var cities = [];

var selectedCity = {}

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
    // temp = "";
    // feelsLike = "";
    // humidity = "";
    // pressure = "";
    // windDeg = "";
    // windSpeed = "";
    // windGust = "";
    // uvi = "";
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


var localTime = function(unixTime){
  return (moment
    .unix(unixTime)
    .format("MMM D, YYYY"));
};

var displayWeather = function(){
  $("#selected-city").html(selectedCity.label)
  $("#current-temp").html("<b>Temp:</b> " + weatherData.currentTemp());
  $("#current-wind").html("<b>Wind:</b> "+weatherData.wind());
  $("#current-humidity").html("<b>Humidity:</b> "+weatherData.humidity+"%");
  $("#current-uvi").html("<b>UV Index:</b> "+weatherData.uvi);
  
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
          // write data to selectedCity obj
          selectedCity.label = data.data[0].label;
          selectedCity.city = data.data[0].locality;
          selectedCity.street = data.data[0].street;
          selectedCity.state = data.data[0].region;
          selectedCity.zip = data.data[0].postal_code;
          selectedCity.country = data.data[0].country_code;
          selectedCity.lat = data.data[0].latitude;
          selectedCity.lon = data.data[0].longitude;
          // console.log(selectedCity.label);
          // console.log(selectedCity);

          getweatherData(selectedCity.lat, selectedCity.lon);
          displayWeather(data);
        });
    } else {
      alert("Error: City Not Found");
    }
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
          // write to api data to WeatherData obj and handles data errors with "-"
          if (data.current.hasOwnProperty("temp")){
            weatherData.temp = data.current.temp.toFixed(0);
          } else {weatherData.temp = "n/a";}

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
            weatherData.uvi = data.current.uvi.toFixed(0);
          } else {weatherData.uvi = "n/a";}

          
          // now fetch forecast data

          for (i in data.daily){
            debugger
            weatherData.f_dt[i] = data.daily[i].dt;
            weatherData.f_maxTemp[i] = data.daily[i].temp.max;
            weatherData.f_minTemp[i] = data.daily[i].temp.min;
            weatherData.f_minTemp[i] = data.daily[i].temp.min;
            weatherData.f_clouds[i] = data.daily[i].clouds;
            weatherData.f_humidity[i] = data.daily[i].humidity;
            weatherData.f_icon[i] = data.daily[i].icon;
            weatherData.f_description[i] = data.daily[i].description;
          }
          displayWeather()
        });
    } else {
      alert("Error: City Not Found");
    }
  });
};


geoCodeCity("livonia, MI");
// Livonia, MI = 4999837
// getWeather("4999837");