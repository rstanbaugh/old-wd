var citySearchEl = document.querySelector("#city-search");


var apiKeyOpenWeather = config.openWeatherApiKey;
var apiKeyPositionStack = config.positionStackApiKey
var currentCity = {
    label: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    lat: "",
    lon: ""
}
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
          // write data to currentCity obj
          currentCity.label = data.data[0].label;
          currentCity.city = data.data[0].locality;
          currentCity.street = data.data[0].street;
          currentCity.state = data.data[0].region;
          currentCity.zip = data.data[0].postal_code;
          currentCity.country = data.data[0].country_code;
          currentCity.lat = data.data[0].latitude;
          currentCity.lon = data.data[0].longitude;
          // console.log(currentCity.label);
          // console.log(currentCity);

          getWeather(currentCity.lat, currentCity.lon)
        });
    } else {
      alert("Error: City Not Found");
    }
  });
    
}

var getWeather = function(lat, lon){

  // var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid="+apiKey;

  var apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKeyOpenWeather}`

  // make a request to the api
  fetch(apiUrl).then (response => {
    //  check if api returned any weather
    if(response.ok){
      response.json()
        .then (data => console.log(data));
    } else {
      alert("Error: City Not Found");
    }
  });
};


geoCodeCity("livonia, MI");
// Livonia, MI = 4999837
// getWeather("4999837");