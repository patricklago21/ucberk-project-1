var cityInfoPull = function(searchCityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchCityName + '&appid=b4e179a8b169927bbbf8d46d7054d6b7')
    .then (function(response) {
        if (response.ok) {
            return response.json().then(function (response) {
                $("#cityName").html(response.name);

                var lat = response.coord.lat;
                var lng = response.coord.lon;

                weatherPull(lat, lng);
                mapp(lat, lng);
            });
        } else {
            $("#warning").text("Please enter a valid city name!");
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
        $("#windSpeed").text(jsonData.hours[12].windSpeed.noaa + " m/s")
        $("#waterTemp").text(jsonData.hours[12].waterTemperature.noaa + " ºC")
        $("#airTemp").text(jsonData.hours[12].airTemperature.noaa + " ºC")
        $("#visibility").text(jsonData.hours[12].visibility.noaa + " km")

    });
};

// pulling JSON data from Guardian
var newsPull = function(searchCityName) {
    var apiKey = "5bfa4270-0651-4c74-bf63-b6dece86fc3e";
    fetch('https://content.guardianapis.com/search?q=' + searchCityName + '&tag=environment/environment&from-date=2014-01-01&api-key=' + apiKey)
    .then((response) => response.json()).then((jsonData) => {
            createDiv(jsonData);
    });
};

var createDiv = function(jsonData) {   
    $(".dynamicEl").remove();
    for(var i=0; i<5; i++) {
        var articleTitle = document.createElement("li");
        articleTitle.id = 'headline' + i;
        articleTitle.classList.add("dynamicEl");
        articleTitle.innerText = jsonData.response.results[i].webTitle;

        var articleLink = document.createElement("a");
        articleLink.id = 'link' + i;
        articleLink.classList.add("dynamicEl");
        articleLink.href = jsonData.response.results[i].webUrl;

        articleLink.append(articleTitle);
        $("#news-list").append(articleLink);
    }
}

const mymap = L.map('issMap').setView([0, 0], 1);

var mapp = function(lat, lng) {
    // Making a map and tiles
    $(".hidden").removeClass("hidden");
    mymap.invalidateSize();
    const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const tiles = L.tileLayer(tileUrl, { attribution });
    tiles.addTo(mymap);
    const marker = L.marker([0,0]).addTo(mymap);
    let firstTime = true;
        marker.setLatLng([lat, lng]);
        if (firstTime) {
            mymap.setView([ lat, lng], 2);
            firstTime = false;
        }
        var popup = L.popup();
        function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(mymap);
        }
        mymap.on('click', onMapClick);
        document.getElementById('lat').textContent = lat;
        document.getElementById('lon').textContent = lng;
}

var formSubmitEvent = function(event) {
    event.preventDefault();

    var searchCityName = $("#searchCity").val().trim();
    cityInfoPull(searchCityName);
    newsPull(searchCityName);
    // createDiv();
};

$("#searchCityForm").on("submit", function() {
    formSubmitEvent(event);
});