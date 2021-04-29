var apiKey = "89c81292-a891-11eb-80d0-0242ac130002-89c8130a-a891-11eb-80d0-0242ac130002";
var currentDirection = "currentDirection";
var seaLevel = "seaLevel";
var temperature = "waterTemperature";
var plankton = "phytoplankton";
var salinity = "salinity";
var searchCityForm = ("#searchCityForm");


var cityInfoPull = function(searchCityName) {
    console.log(searchCityName);
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchCityName + '&appid=b4e179a8b169927bbbf8d46d7054d6b7')
    .then (function(response) {
        if (response.ok) {
            return response.json().then(function (response) {
                $("#cityName").html(response.name);

                var lat = response.coord.lat;
                var lon = response.coord.lon;

                // uvPull(lat, lon);
                // forecastPull(lat, lon);
                console.log(lat);
                console.log(lon);
            });
        } else {
            alert("Please enter a valid city name.");
        }
    });
};



var formSubmitEvent = function(event) {
    event.preventDefault();

    var searchCityName = $("#searchCity").val().trim();
    cityInfoPull(searchCityName);
    // add local storage here later
}

$("#searchCityForm").on("submit", function() {
    formSubmitEvent(event);
})
