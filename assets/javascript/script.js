var searchCityForm = $("#searchCityForm");
var contentEl = $("#content");

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
                mapp(lat, lng);
                
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

var newsPull = function(searchCityName) {
    console.log("newsPull working!!");
    var apiKey = "5bfa4270-0651-4c74-bf63-b6dece86fc3e";
    fetch('https://content.guardianapis.com/search?q=' + searchCityName + '&tag=environment/environment&from-date=2014-01-01&api-key=' + apiKey)
    .then((response) => response.json()).then((jsonData) => {
            console.log(jsonData);
            var results = jsonData.response.results;
            var strz = "";
            contentEl.empty();
            for (i=0; i < results.length; i++) {
                var title = $("<p>").text(results[i].webTitle);
                console.log(results[i].webTitle);
                // content.append(`${results[i].webTitle}
                
                //`);

                strz += `${results[i].webTitle} 
                `;

            }
            contentEl.append(strz);

    });
};

var formSubmitEvent = function(event) {
    event.preventDefault();
    var searchCityName = $("#searchCity").val().trim();
    cityInfoPull(searchCityName);
    newsPull(searchCityName);
};
const mymap = L.map('issMap').setView([0, 0], 1);

var mapp = function(lat, lng) {
        // Making a map and tiles
        console.log("map");
        // mymap.forEach(function(map) {
        //     map.empty();
        // })
        const attribution =
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tiles = L.tileLayer(tileUrl, { attribution });
        tiles.addTo(mymap);

        // Making a marker with a custom icon
        // const issIcon = L.icon({
        //     iconUrl: 'iss.png',
        //     iconSize: [50, 32],
        //     iconAnchor: [25, 16]
        // });
        const marker = L.marker([0,0]).addTo(mymap);

        // const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';

        let firstTime = true;

        // async function getISS() {
            // const response = await fetch(api_url);
            // const data = await response.json();
            // const { latitude, longitude } = data;

            marker.setLatLng([lat, lng]);
            if (firstTime) {
                mymap.setView([ lat, lng], 2);
                firstTime = false;
            }
            
            // var circle = L.circle([latitude, longitude], {
            //     color: 'red',
            //     fillColor: '#f03',
            //     fillOpacity: 0.5,
            //     radius: 500
            // }).addTo(mymap);

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

        // }
        // getISS();
        // setInterval(getISS, 3000);
}


$("#searchCityForm").on("submit", function() {
    formSubmitEvent(event);
});