/**
@file This is the JavaScript file for the index2.hbs view. It includes the functions with the detecting current position,
drawing the map on the page and display both multiple and single places on it.
*/

var newmap;
var latitude = 49.1783518;
var longitude = -123.2760839;
var currentSB = "";
var botMheight = 0;
var choiceheight = 90;

/**
This functions runs functions "/getLocation" on the server. The server's function will get current location, based on the IP.
It will initialize the initMap function and pass the cooerdinates as parametrs.
@param {string} location
@returns {none} 
*/
var getMap = (location) => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "/getLocation", true);
    xmlhttp.setRequestHeader('Content-type', "application/x-www-form-urlencoded");
    xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log(xmlhttp.responseText);
            coordinates = JSON.parse(xmlhttp.responseText);
            console.log(coordinates);
            latitude = coordinates.lat;
            longitude = coordinates.long;
            initMap(latitude, longitude, 18);
        }
    };
    xmlhttp.send(`location=${location}`);
};

/**
This functions runs functions "/storeuserdata" on the server. The server's function will checks the logged in persone and
then add the location to the list of the saved locations. It will send empty string back to the server.
@param {none}
@returns {none} 
*/
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
        swal('You have saved the location');
    }   else {
        swal('Select a location')
    }
};

/**
This functions runs the server function "/favdata", that will add a string of the favotires places, and sends "OK" response.
@param {none}
@returns {none} 
*/
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

// /**
// This functions creates an empty map on the html page
// @param {none}
// @returns {none} 
// */
// var defMap = () => {
//     newmap = new google.maps.Map(document.getElementById('newmap'), {
//         zoom: 7,
//         center: { lat: latitude, lng: longitude }
//     });
// }

/**
This function initialize the empty map on the html page and place the marker on the current position
@param {none}
@returns {none}
*/
var initMap = (latitude, longitude, z) => {
    newmap = new google.maps.Map(document.getElementById('newmap'), {
        zoom: z,
        center: { lat: latitude, lng: longitude }
    });
    place_marker();
}

// }
/**
This function is used to initialize the map. The function populates the the map with the list of places.
List of places is created by the fuction in the map.js file and send by thr server side from the http://localhost:8080/places_funct.
@param {none}
@returns {none} 
*/
var initMultPlaceMap = () => {
    newmap = new google.maps.Map(document.getElementById('newmap'), {
      zoom: 18,
      center: {lat: latitude, lng : longitude}
    });
    var places_funct = () =>{
      fetch('http://localhost:8080/places_funct').then((result) => {
        var test_val = result.text();
        return test_val;
      }).then((text) => {
        json_places = JSON.parse(text);
        var lat = ''
        var lng = ''
        for(pl in json_places.results){
          lat = json_places.results[pl].geometry.location.lat;
          lng = json_places.results[pl].geometry.location.lng;
          var latLng = new google.maps.LatLng(lat,lng);
          newmap.center = latLng;
          newmap.zoom = 14;
          var marker = new google.maps.Marker({
            position: latLng,
            map: newmap
          });
        }
      })
    }
    places_funct()
}
/**
This function placese the marker on the map
@param {none}
*/
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

function errorMessages(number){
    if (number == 1){
        swal('Invalid Location')
    }
}
//     document.getElementById("nearme").style.top = '0%';
//     document.getElementById('savedloc').style.top = '-100%';
// });


// document.getElementById("savedlocations").addEventListener("click", function() {
//     document.getElementById('nearme').style.top = '-100%';
//     document.getElementById('savedloc').style.top = '0%';
// });

// defMap()

// document.getElementById('savecurrentloc').addEventListener("click", function () {
//     window.alert('You have saved the location');
// });
