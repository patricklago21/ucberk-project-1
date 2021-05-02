var searchCityForm = ("#searchCityForm");

var cityInfoPull = function(searchCityName) {
    console.log(searchCityName);
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchCityName + '&appid=b4e179a8b169927bbbf8d46d7054d6b7')
    .then (function(response) {
        if (response.ok) {
            return response.json().then(function (response) {
                $("#cityName").html(response.name);

                var lat = response.coord.lat;
                var lng = response.coord.lon;

                weatherPull(lat, lng);
                console.log(lat);
                console.log(lng);
            });
        } else {
            alert("Please enter a valid city name.");
        }
    });
};

var weatherPull = function(lat, lng) {
    var params = "waterTemperature,windSpeed,airTemperature,visibility"
    fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {
    headers: {
    'Authorization': '89c81292-a891-11eb-80d0-0242ac130002-89c8130a-a891-11eb-80d0-0242ac130002'
    }
    }).then((response) => response.json()).then((jsonData) => {
        console.log(jsonData)
        $("#windSpeed").text(jsonData.hours[12].windSpeed.noaa + " m/s")
        $("#waterTemp").text(jsonData.hours[12].waterTemperature.noaa + " ºC")
        $("#airTemp").text(jsonData.hours[12].airTemperature.noaa + " ºC")
        $("#visibility").text(jsonData.hours[12].visibility.noaa + " km")

    });
};

// pulling JSON data from Guardian
var newsPull = function(searchCityName) {
    console.log("newsPull working!!");
    var apiKey = "5bfa4270-0651-4c74-bf63-b6dece86fc3e";
    fetch('https://content.guardianapis.com/search?q=' + searchCityName + '&tag=environment/environment&from-date=2014-01-01&api-key=' + apiKey)
    .then((response) => response.json()).then((jsonData) => {
            console.log(jsonData);
            createDiv(jsonData);
    });
};

var createDiv = function(jsonData) {
    for(var i=0; i<5; i++) {
        var articleTitle = document.createElement("li");
        articleTitle.id = 'headline' + i;
        articleTitle.innerText = jsonData.response.results[i].webTitle;

        var articleLink = document.createElement("a");
        articleLink.id = 'link' + i;
        articleLink.href = jsonData.response.results[i].webUrl;

        articleLink.append(articleTitle);
        $("#news-list").append(articleLink);
    } 
}

var formSubmitEvent = function(event) {
    event.preventDefault();

    var searchCityName = $("#searchCity").val().trim();
    cityInfoPull(searchCityName);
    newsPull(searchCityName);

};

$("#searchCityForm").on("submit", function() {
    formSubmitEvent(event);
});