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
            initMap(latitude, longitude, 19);
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
    })
}

var initMap = (latitude, longitude, z) => {
    newmap = new google.maps.Map(document.getElementById('newmap'), {
        zoom: z,
        center: { lat: latitude, lng: longitude }
    });
    place_marker();
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


//     document.getElementById("nearme").style.top = '0%';
//     document.getElementById('savedloc').style.top = '-100%';
// });


// document.getElementById("savedlocations").addEventListener("click", function() {
//     document.getElementById('nearme').style.top = '-100%';
//     document.getElementById('savedloc').style.top = '0%';
// });

defMap()
