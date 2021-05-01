
// Making a map and tiles

const mymap = L.map('issMap').setView([0, 0], 1);
const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(mymap);



// Making a marker with a custom icon
// const issIcon = L.icon({
//     iconUrl: 'heart.png',
//     iconSize: [50, 32],
//     iconAnchor: [25, 16]
// });
const marker = L.marker([0,0]).addTo(mymap);

// const api_url = 'https://api.wheretheiss.at/v1/satellites/25544';

let firstTime = true;

async function getISS(lat, lng) {
    // const response = await fetch(api_url);
    //  const data = await response.json();
    // const { latitude, longitude } = data
    // pulling lat and lng values from the script.js to draw the map
    import {lat, lng} from './script.js';
    // marker.setLatLng([lat, lng]);
    if (firstTime) {
        mymap.setView([ lat, lng], 2);
        firstTime = false;
    }
    
    var circle = L.circle([lat, lng], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 500
    }).addTo(mymap);

    var popup = L.popup();

    function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("Hello there! You clicked the map at " + e.latlng.toString())
            .openOn(mymap);
    }
        
        mymap.on('click', onMapClick);


    document.getElementById('lat').textContent = lat;
    document.getElementById('lon').textContent = lng;

}
getISS();

// setInterval(getISS, 2000);