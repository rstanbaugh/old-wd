var citySearchEl = document.querySelector("#city-search");


var apiKeyOpenWeather = config.openWeatherApiKey;
var apiKeyPositionStack = config.positionStackApiKey


var selectedCity = {}
var currentWeather = {}

var cities = [];


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

          getCurrentWeather(selectedCity.lat, selectedCity.lon);
          getUvi(selectedCity.lat, selectedCity.lon);
          getForecast(selectedCity.lat, selectedCity.lon);
          displayWeather(data);

        });
    } else {
      alert("Error: City Not Found");
    }
  });
    
}

var displayWeather = function(data){
  $("#selected-city").html(selectedCity.label)
  $("#current-temp").html("<b>Temp:</b> "+currentWeather.temp+" (feels like "+currentWeather.feelsLike+")");
  $("#current-wind").html("<b>Wind:</b> "+currentWeather.wind+" from "+currentWeather.windDeg+" deg, Gusting "+currentWeather.windGust+" mph");
  $("#current-humidity").html("<b>Humidity:</b> "+currentWeather.humidity+"%");
  $("#current-uvi").html("<b>UV Index:</b> "+currentWeather.uvi);
  
};
var getCurrentWeather = function(lat, lon){

  // var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid="+apiKey;

  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyOpenWeather}`
  // make a request to the api
  fetch(apiUrl).then (response => {
    //  check if api returned any weather
    if(response.ok){
      response.json()
        .then (data => {
          // write to object and handles data errors with "-"
          if (data.main.hasOwnProperty("temp")){
            currentWeather.temp = data.main.temp.toFixed(0);
          } else {currentWeather.temp = "n/a";}

          if(data.main.hasOwnProperty("feels_like")) {
            currentWeather.feelsLike = data.main.feels_like.toFixed(0);
          } else {currentWeather.feelsLike = "n/a";}

          if(data.main.hasOwnProperty("humidity")) {
            currentWeather.humidity = data.main.humidity.toFixed(0);
          } else {currentWeather.humidity = "n/a";}
          
          if(data.main.hasOwnProperty("pressure")) {
            currentWeather.pressure = data.main.pressure.toFixed(1);
          } else {currentWeather.pressure = "n/a";}

          if(data.wind.hasOwnProperty("deg")) {
            currentWeather.windDeg = data.wind.deg.toFixed(0);
          } else {currentWeather.windDeg = "n/a";}

          if(data.wind.hasOwnProperty("speed")) {
            currentWeather.windSpeed = data.wind.speed.toFixed(0);
          } else {currentWeather.windSpeed = "n/a";}

          if(data.wind.hasOwnProperty("gust")) {
            currentWeather.windGust = data.wind.gust.toFixed(0);
          } else {currentWeather.windGust = "n/a";}

          displayWeather(data)
          

        });
    } else {
      alert("Error: City Not Found");
    }
  });
};

var getUvi = function(lat, lon){

  // var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid="+apiKey;

  var apiUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyOpenWeather}`
  // make a request to the api
  
  fetch(apiUrl).then (response => {
    //  check if api returned any weather
    if(response.ok){
      response.json()
        .then (data => {
          // write to object and handles data errors with "-"
          if (data.hasOwnProperty("value")){
            currentWeather.uvi = data.value.toFixed(1);
          } else {currentWeather.uvi = "n/a";}
        });
    } else {
      alert("Error: City Not Found");
    }
  });
};

var getForecast = function(lat, lon){

  var apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyOpenWeather}`
debugger
  var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyOpenWeather}`
  // make a request to the api
  fetch(apiUrl).then (response => {
    //  check if api returned any weather
    if(response.ok){
      response.json()
        .then (data => {
          debugger
          // write to object and handles data errors with "-"
          if (data.hasOwnProperty("value")){
            currentWeather.uvi = data.value.toFixed(1);
          } else {currentWeather.uvi = "n/a";}
        });
    } else {
      alert("Error: City Not Found");
    }
  });
};
geoCodeCity("livonia, MI");
// Livonia, MI = 4999837
// getWeather("4999837");