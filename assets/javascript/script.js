var cityRender = function(searchCityName) {
    updateSearchHistory(searchCityName);
    cityInfoPull(searchCityName);
};

var cityInfoPull = function(searchCityName) {
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchCityName + '&appid=b4e179a8b169927bbbf8d46d7054d6b7')
    .then (function(response) {
        if (response.ok) {
            return response.json().then(function (response) {
                $("#cityName").html(response.name);

                var lat = response.coord.lat;
                var lng = response.coord.lon;

                newsPull(searchCityName);
                weatherPull(lat, lng);
                mapp(lat, lng);
            });
        } else {
            var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
            searchHistory = searchHistory.filter((c,i)=> i === 0)
            localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
            $("#warning").text("Please enter a valid city name!");
        }
    });
};

var weatherPull = function(lat, lng) {
    var params = "waterTemperature,windSpeed,airTemperature,visibility"
    fetch(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${params}`, {
    headers: {
    'Authorization': '7503cf1c-adec-11eb-9cd1-0242ac130002-7503cf8a-adec-11eb-9cd1-0242ac130002'
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
        articleLink.setAttribute("target", "_blank");
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
    cityRender(searchCityName);
    // createDiv();
};

$("#searchCityForm").on("submit", function() {
    formSubmitEvent(event);
});

var buildSearchHistory = function() {
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    if (searchHistory == null) {
        searchHistory = [];
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    }
    var searchHistory2 = [...new Set(searchHistory)];
    searchHistory2 = searchHistory2.filter(c => c.trim());
    if (searchHistory.length > searchHistory2.length) {
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory2));
        return;
    }
    var groupContainer = $(".cityhistory");
    groupContainer.html("");
    for (i in searchHistory) {
        var optionEl = $("<option>")
                .addClass("list-group-item list-group-item-action")
                .val(searchHistory[i])
                .text(searchHistory[i])
                groupContainer.append(optionEl);        
    }
    groupContainer.on("click", (e)=>cityInfoPull(e.target.value))
};
var updateSearchHistory = function(city) {
    // var searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    var searchHistory = JSON.parse(localStorage.getItem("searchHistory")) || []
    searchHistory.unshift(city);
    if (searchHistory > 5) {
        searchHistory.pop();
    }
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    buildSearchHistory();
}
buildSearchHistory();