var newmap;
var latitude = 49.1783518;
var longitude = -123.2760839;
var currentSB = "";
var botMheight = 0;
var choiceheight = 90;

var getMap = (location) => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/getLocation", true);
    xmlhttp.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
            coordinates = JSON.parse(xmlhttp.responseText);
            latitude = coordinates.lat;
            longitude = coordinates.long;
            initMap(latitude, longitude, 15);
        }
    };
    xmlhttp.send(`location=${location}`);
};

var savelocation = () => {
    if (currentSB != '') {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "/storeuserdata", true);
        xmlhttp.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                console.log(xmlhttp.responseText)
            }
        };
        xmlhttp.send(`location=${currentSB}`);
        window.alert('You have saved the location');
    }   else {
        window.alert('Select a location')
    }
};

var showfavs = () => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/favdata", true);
    xmlhttp.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText)
        }
    };
    xmlhttp.send(`OK`);
};


var defMap = () => {
    newmap = new google.maps.Map(document.getElementById('newmap'), {
        zoom: 7,
        center: { lat: latitude, lng: longitude }
    });
}

var initMap = (latitude, longitude, z) => {
    newmap = new google.maps.Map(document.getElementById('newmap'), {
        zoom: z,
        center: { lat: latitude, lng: longitude }
    });
    place_marker();
}

// var initMultPlaceMap = () => {

// }

var initMultPlaceMap = () => {
    console.log('This works!');
    newmap = new google.maps.Map(document.getElementById('newmap'), {
      zoom: 10,
      center: {lat: latitude, lng : longitude}
    });
    

    // Create a <script> tag and set the USGS URL as the source.
    //var script = document.createElement('script');
    // This example uses a local copy of the GeoJSON stored at
    // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
    //script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
    //script.src = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=49.2827291,-123.1207375&radius=1000&type=coffee&keyword=starbucks&key=AIzaSyD5Z4W9aUlSBLzI4mNzhc4Rl9iqZkqSKMc';
    //document.getElementsByTagName('head')[0].appendChild(script);
    //list_of_places = map.data.loadGeoJson('places.json');
    // var file = fs.readFileSync('places.json');

    // var list_of_places = JSON.parse(file);

    // console.log('This is google_maps file',list_of_places);
    var places_funct = () =>{
      fetch('http://localhost:8080/places_funct').then((result) => {
        // json_obj = JSON.parse(result);
        var test_val = result.text();
        return test_val;
      }).then((text) => {
        json_places = JSON.parse(text);
        console.log(json_places);
        var lat = ''
        var lng = ''
        for(pl in json_places.results){
          lat = json_places.results[pl].geometry.location.lat;
          lng = json_places.results[pl].geometry.location.lng;
          var latLng = new google.maps.LatLng(lat,lng);
          newmap.center = latLng;
          newmap.zoom = 10;
          var marker = new google.maps.Marker({
            position: latLng,
            map: newmap
          });
        }
      })
    }
    places_funct()
    console.log('This happend!');
}

var place_marker = () => {
    var marker = new google.maps.Marker({
        position: { lat: latitude, lng: longitude },
        map: newmap
    });
}

document.getElementById("savedlocations").addEventListener("click", function () {
    while (choiceheight > 0) {
        choiceheight -= 1;
        document.getElementById("nearme").style.height = botMheight + '%';

    }
    setTimeout(function () {
        while (botMheight < 90) {
            botMheight += 1;
            document.getElementById("savedloc").style.height = botMheight + '%';
        }
    }, 400)
});

document.getElementById("Searchlocation").addEventListener("click", function () {
    while (botMheight > 0) {
        botMheight -= 1;
        document.getElementById("savedloc").style.height = botMheight + '%';

    }
    setTimeout(function () {
        while (choiceheight < 90) {
            choiceheight += 1;
            document.getElementById("nearme").style.height = choiceheight + '%';
        }
    }, 400)
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("POST", "/starbucksnearme", true);
            xmlhttp.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
            xmlhttp.onreadystatechange = () => {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    console.log(xmlhttp.responseText)
                }
            };
            xmlhttp.send(`longitude=${position.coords.longitude}&latitude=${position.coords.latitude}`);
            latitude = position.coords.latitude
            longitude = position.coords.longitude
        });
        

}};
//     document.getElementById("nearme").style.top = '0%';
//     document.getElementById('savedloc').style.top = '-100%';
// });


// document.getElementById("savedlocations").addEventListener("click", function() {
//     document.getElementById('nearme').style.top = '-100%';
//     document.getElementById('savedloc').style.top = '0%';
// });

defMap()

// document.getElementById('savecurrentloc').addEventListener("click", function () {
//     window.alert('You have saved the location');
// });
