// This code finds Starbuckses nearby

const request = require('request');
var list_of_places=[];
var get_sturbuckses = (lat, long) => {
	return new Promise((resolve, reject) => {
		request({
			url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&radius=1000&type=coffee&keyword=starbucks&key=AIzaSyD5Z4W9aUlSBLzI4mNzhc4Rl9iqZkqSKMc`,
			json: true
		}, (error, response, body) => {
			if(error){
				reject('Can not connect to Maps');
			}
			else if(body.status=="OK"){
				
				for(place in body.results){
					list_of_places.unshift(body.results[place].vicinity);
				}
				resolve({body,list_of_places});
			}
		});
	});
};


var getAddress = (address) => {
    return new Promise((resolve,reject)=> {
    request({
        url: 'http://maps.googleapis.com/maps/api/geocode/json' +
            '?address=' + encodeURIComponent(address),
        json: true
    }, (error, response, body) => {
        if (error) {
            reject('Cannot connect to Google Maps');
            //console.log('Cannot connect to Google Maps');
        } else if (body.status === 'ZERO_RESULTS') {
            reject('Cannot find requested address');
            //console.log('Cannot find requested address');
        } else if (body.status === 'OK') {
            resolve({
                lat: body.results[0].geometry.location.lat,
                long: body.results[0].geometry.location.lng
            });
        }
    });
    })

};

module.exports ={
	get_sturbuckses,
	getAddress
};
module.exports.listofmaps = list_of_places;

// get_sturbuckses().then((response) => {
// 	console.log(response);
// }).catch((error) => {
// 	console.log("Error ",error);
// })