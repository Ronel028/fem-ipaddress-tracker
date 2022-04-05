let inputIp = document.querySelector('input[type="text"]');
let searchButton = document.querySelector('#btn');
const API_KEY = 'at_A4DoTNpZ0XXw7gYkJ75LFRjlNi1mK';
const mapApiKey = 'pk.eyJ1IjoiY29kZXJuZW8iLCJhIjoiY2wxbXBvbzMwMG4yeTNra3FjNjU0aTM4YSJ9.1cCXca-Lt6azagafcdsrhg'
// attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
// ''https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=nLFR9OkPmSF48cIuFgId

let map = L.map('map');
L.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}`, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: mapApiKey
    
}).addTo(map);

let popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);


// function to add marker to location
function locateLatLongMarker(lt, lng){
    let marker = L.marker([lt, lng]);
    marker.bindPopup("<b>You track me!</b>");

    return marker;
} 

//function to set latitude and longitude to get location and display to map
function mapSetView(lt, lng){
    let mapSet = map.setView([lt, lng])

    return mapSet;
}


//this function get your current location and display to map
function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showposition);
    }
  }
  
function showposition(position) {
    let myLatitude = position.coords.latitude;
    let myLongitude = position.coords.longitude;


    locateLatLongMarker(myLatitude, myLongitude);
    map.setView([myLatitude, myLongitude], 10);
    
}
getLocation();


// event for search ip address
searchButton.addEventListener('click', ()=>{
    let ipAddress = new RegExp('^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$');
    if(inputIp.value === '' || !inputIp.value.match(ipAddress)){
        alert('Please enter valid ip address or domain!')
        inputIp.value = '';
        return;
    }
    else{
        fetch(`https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=${inputIp.value}`, {
        method: 'GET'
        })
        .then(response =>{
            return response.json();
        }).then(data =>{
            console.log(data);
            let ipAddress = document.querySelector('#ip-address');
            let time= document.querySelector('#time');
            let isp = document.querySelector('#isp');
            let location = document.querySelector('#loc');
            let lat = data.location.lat;
            let long = data.location.lng;

            ipAddress.textContent = data.ip;
            let locationCountry = `${data.location.country} ${data.location.city}, ${data.location.region}`;
            location.innerHTML = locationCountry;
            time.textContent = "UTC" + data.location.timezone;
            isp.textContent = data.isp

            // map location to locate ip address
            mapSetView(lat, long);
            locateLatLongMarker(lat, long).addTo(map);

            inputIp.value = '';

        }).catch(err =>{
            console.log(err)
        })
    }
    
})




