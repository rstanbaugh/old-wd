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

          getWeather(selectedCity.lat, selectedCity.lon)
        });
    } else {
      alert("Error: City Not Found");
    }
  });
    
}

var displayWeather = function(data){
  $("#selected-city").text(selectedCity.label)
  $("#current-temp").text("Temp: "+currentWeather.temp+" (feels like "+currentWeather.feelsLike+")");
  $("#current-wind").text("Wind: "+currentWeather.wind+" from "+currentWeather.windDeg.toFixed(0)+" deg, Gusting "+currentWeather.windGust.toFixed(1)+" mph");
  $("#current-humidity").text("Humidity: "+currentWeather.humidity+"%");
  
};
var getWeather = function(lat, lon){

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
            currentWeather.temp = data.main.temp;
          } else {currentWeather.temp = "n/a";}

          if(data.main.hasOwnProperty("feels_like")) {
            currentWeather.feelsLike = data.main.feels_like;
          } else {currentWeather.feelsLike = "n/a";}

          if(data.main.hasOwnProperty("humidity")) {
            currentWeather.humidity = data.main.humidity;
          } else {currentWeather.humidity = "n/a";}
          
          if(data.main.hasOwnProperty("pressure")) {
            currentWeather.pressure = data.main.pressure;
          } else {currentWeather.pressure = "n/a";}

          if(data.wind.hasOwnProperty("deg")) {
            currentWeather.windDeg = data.wind.deg;
          } else {currentWeather.windDeg = "n/a";}

          if(data.wind.hasOwnProperty("speed")) {
            currentWeather.windSpeed = data.wind.speed;
          } else {currentWeather.windSpeed = "n/a";}

          if(data.wind.hasOwnProperty("gust")) {
            currentWeather.windGust = data.wind.gust;
          } else {currentWeather.windGust = "n/a";}

          displayWeather(data)
          

        });
    } else {
      alert("Error: City Not Found");
    }
  });
};



geoCodeCity("livonia, MI");
// Livonia, MI = 4999837
// getWeather("4999837");