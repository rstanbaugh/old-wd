var cities = [];


var getWeather = function(city){
  var apiKey = config.apkiKey;
  var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&appid=1c357a3191ed3689b3d98c44e3cbb7a6"

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


getWeather("livonia");