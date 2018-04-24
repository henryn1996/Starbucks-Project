/**
@file This file finds the longitude and latitude base on the current IP.
*/
const request = require('request');
var list_of_places=[];
/**
This function gets the current IP and return the coordinates of it.
It should be used to find current location and show Sbs near by
@returns {json} JSON dict with the coords.
*/
var request_coodrs = () => {
	return new Promise((resolve,reject) => {
		request({
			url: 'http://freegeoip.net/json'
		}, (error, response, body)=> {
			if(error){
				reject('Cannot connect')
			}
			else{
				location = JSON.parse(body)
				resolve({					
					lat: location.latitude,
					lon: location.longitude,
				});
			}
		})
	})
}

// module.exports ={
// 	request_coodrs
// }

request_coodrs().then((response) => {
	console.log(response);
})