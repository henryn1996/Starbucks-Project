/*jshint esversion: 6 */

const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const maps = require('./maps.js');
const current_ip = require('./get_current_ip.js');
const credentials = JSON.parse(fs.readFileSync('./credentials.json'));
const crypto = require('crypto');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const email = require('./send_email.js');

var app = express();
const port = process.env.PORT || 8080;

hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
    extended: true
}));

var Accs = [];
var place = '';
var logged_in = "";
var current_long = '';
var current_lat = '';
var last_save = "";
var user_id = '';
var saved_loc;
/**
 * Calls the function ReadAccfile and returns the list into the variable Accs
 */

var con = mysql.createConnection({
    host: credentials.host,
    user: credentials.user,
    password: credentials.password,
    database: credentials.database,
    port: credentials.port
});
var Accs = [];

var send_mail = () => {   
    options = email.mailOptions;
    options.to = 'viktor.sheverdin@gmail.com';
    options.subject = 'Test email from Sb app';
    options.text = 'OK! It actually works!';
    console.log(options);
    email.send_email(options);

    // email.transporter.sendEmail(options, (error,info) => {
    //     if (error) {
    //         console.log(error);
    //     }
    //     else {
    //         console.log('Email sent: ', info.response);
    //     }
    // });
};

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

var LoadAccfile = () => {
    return new Promise(resolve => {
        con.query('SELECT * FROM users', function (err, res, fields) {
            resolve(Accs = JSON.parse(JSON.stringify(res)));

        });
    });
};

var loadUserdata = (user) => {
    return new Promise(resolve => {
        console.log(user);
        con.query("SELECT * from UserData WHERE username = '" + user + "'", function (err, res, fields) {
            //console.log(res)
            resolve(saved_loc = JSON.parse(JSON.stringify(res)));
        });
    });
};

var checkLocations = (user, location) => {
    return new Promise(function (resolve, reject) {
        console.log("SELECT * from UserData WHERE username ='" + user + "' AND location_id = '" + location + "'");
        con.query("SELECT * from UserData WHERE username ='" + user + "' AND location_id = '" + location + "'", function (err, res, fields) {
            var loc = JSON.stringify(res);
            console.log(loc);
            if (loc == '[]') {
                resolve();
            } else {
                reject();
            }
        });
    });
};

var addLocations = (user, location) => {
    con.query("INSERT INTO UserData (username, location_id) values ('" + user + "','" + location + "')");
};

/**
 * Reads the account file and also calls the function LoginCheck. Renders error page or index page
 * @param {string} request - Grabs the username and password values from the form lin loginbox
 * @param {string} response - Renders index2.hbs or error1.hbs
 */

var Login = (request, response) => {
    LoadAccfile().then(res => {
        LoginCheck(request, Accs).then(res => {
            loadUserdata(logged_in.username).then(res => {
                displaySaved = '';
                //console.log(saved_loc)
                for (var i = 0; i < saved_loc.length; i++) {
                    //console.log(saved_loc[i].location_id)
                    displaySaved += `<div id=s${i} class="favItems"><a onclick="getMap(${saved_loc[i].location_id})"> ${saved_loc[i].location_id}</a></div>`;
                }


                current_ip.request_coodrs().then((response1) => {
                    console.log(response1);
                    maps.get_sturbuckses(response1.lat, response1.lon).then((response2) => {
                        console.log(response2.list_of_places);
                        displayText = ' ';
                        for (var i = 0; i < response2.list_of_places.length; i++) {
                            displayText += `<div id=d${i} class='favItems'><a href="#" onclick="getMap(\'${response2.list_of_places[i]}\'); currentSB=\'${response2.list_of_places[i]}\'"> ${response2.list_of_places[i]}</a></div>`;
                        }
                        response.render('index2.hbs', {
                            savedSpots: displaySaved,
                            testvar: displayText,
                            coord: `<script>latitude = ${response1.lat}; longitude = ${response1.lon};initMultPlaceMap()</script>`
                        });
                    });
                    // response.render('index2.hbs', {
                    //     savedSpots: displaySaved,
                    //     coord: `<script>latitude = ${response.lat}; longitude = ${response.lon};defMap()</script>`
                    // })
                });
            });
        },
            rej => {
                response.render('index.hbs', {
                    username: 3
                });
            }
        );
    });
};

/**
 * Verifies that the username and password exist in the accs arg.
 * @param {string} request - Grabs the username and password values from the form
 * @param {string} accs - The list object passed in from Login fucntion
 */


var LoginCheck = (request, accs) => {
    return new Promise(function (resolve, reject) {
        for (i = 0; i < accs.length; i++) {
            //console.log(accs[i].username, request.body.username)
            console.log(accs[i].salt);
            if ((request.body.username == accs[i].username) && (hash_data(request.body.password + accs[i].salt) == accs[i].pass)) {
                console.log("User pass is ", accs[i].pass);
                logged_in = accs[i];
                user_id = i;
                resolve(0);
            }
        }
        reject(1);
    });

};

/**
 * Adds a user to the file and Acc list variable if UserNameCheck and PasswordCheck returns 0.
 * @param {string} request - Grabs the username, password and confirm password values from the form createacc 
 * @param {string} response - renders origional login page 
 */

var AddUsr = (request, response) => {
    LoadAccfile().then(res => {
        if (UserNameCheck(request, response, Accs) == 0 && PasswordCheck(request, response) == 0) {
            var salt = generateSalt();
            hash_password = hash_data(request.body.NewPassword + salt);
            var acc = {
                'user': request.body.NewUser,
                'pass': hash_password,
            };
            con.query("INSERT INTO users (username, pass, salt) values ('" + acc.user + "','" + acc.pass + "','" + salt + "')", function (err, res, fields) {
                console.log(err);
                console.log(salt);
            });

            response.render('index.hbs', {
                username: 0
            });
        }
    });
};

var hash_data = (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
};

var generateSalt = () => {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 16; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

/**
 * checks if new username is already saved
 * @param {string} request - Grabs the new username
 * @param {string} response - renders errorpage
 */

var UserNameCheck = (request, response, Accs) => {
    if (request.body.NewUser.match(/^[a-z0-9]+$/i)) {
        if (request.body.NewUser.length <= 12 && request.body.NewUser.length >= 3) {
            for (i = 0; i < Accs.length; i++) {
                //console.log(Accs[i].user)
                if (request.body.NewUser == Accs[i].username) {
                    response.render('index.hbs', {
                        username: 2
                    });
                    return 1;
                }
            }
            return 0;
        }
        response.render('index.hbs', {
            username: 1
        });
        return 2;
    }
    response.render('index.hbs', {
        username: 6
    });
    return 1;
};


/**
 * checks if password and confirmed password is not the same
 * @param {string} request - Grabs the password and confirm password
 * @param {string} response - renders errorpage 
 */

var PasswordCheck = (request, response) => {
    if (request.body.NewPassword.length >= 5 && request.body.confirmp.length >= 5) {
        if (request.body.NewPassword != request.body.confirmp) {
            response.render('index.hbs', {
                username: 4
            });
            return 1;
        } else {
            return 0;
        }
    }
    response.render('index.hbs', {
        username: 5
    });
    return 2;
};



app.set('view engine', 'hbs');

app.get('/', (request, response) => {
    response.render('index.hbs');
    //send_mail()
});

app.get('/map', (request, response) => {
    response.render('map_view.hbs');
});

app.post('/login', (request, response) => {
    Login(request, response);
});

app.get('/places_funct', (request, response) => {
    var places = fs.readFileSync('places.json');
    var parsed_places = JSON.parse(places);
    response.end(places);
});

app.post('/home', (request, response) => {
    AddUsr(request, response);
});

app.post('/starbucksnearme', (request, response) => {
    longitude = request.body.longitude;
    latitude = request.body.latitude;
    maps.get_sturbuckses(latitude, longitude).then((response1) => {
    });
});



/**
 * gets the starbucks locations based on the location you enter and populates the div
 * @param {string} request - Grabs the location that you enter in
 * @param {string} response - Renders the index2.hbs page with the starbucks locations
 */
app.post('/loginsearch', (request, response) => {
    place = request.body.search;
    if (place == ''){
        response.render('index2.hbs', {
            error: 2,
            coord: `<script>latitude = ${49.2827}; longitude = ${123.1207}; z = ${19};initMultPlaceMap()</script>`
        });
    }
    maps.getAddress(place).then((coordinates) => {
        displaySaved = '';
        loadUserdata(logged_in.username).then(res => {
            displaySaved = '';
            console.log(saved_loc);
            for (var i = 0; i < saved_loc.length; i++) {
                console.log(saved_loc[i].location_id);
                displaySaved += `<div id=s${i} class="favItems"><a onclick="getMap(${saved_loc[i].location_id})"> ${saved_loc[i].location_id}</a></div>`;
            }
        });
        console.log(coordinates);
        displayText = ' ';
        if (coordinates.lat && coordinates.long) {
            maps.get_sturbuckses(coordinates.lat, coordinates.long).then((response1) => {
                console.log(response1.list_of_places);
                for (var i = 0; i < response1.list_of_places.length; i++) {
                    displayText += `<div id=d${i} class='favItems'><a href="#" onclick="getMap(\'${response1.list_of_places[i]}\'); currentSB=\'${response1.list_of_places[i]}\'"> ${response1.list_of_places[i]}</a></div>`;
                }
                response.render('index2.hbs', {
                    savedSpots: displaySaved,
                    testvar: displayText,
                    coord: `<script>latitude = ${coordinates.lat}; longitude = ${coordinates.long};initMultPlaceMap()</script>`
                });
            });
        } else {
            response.render('index2.hbs', {
                error: 1
            });

        }
    });
});
/**
 * gets the longitude and latitude of the location that you enter in
 * @param {string} request - gets the value of the location that you enter in 
 * @param {string} response - sends the coordinates of the location that you entered in
 */
app.post('/getLocation', (request, response) => {
    place = request.body.location;
    maps.getAddress(place).then((coordinates) => {
        console.log(coordinates.lat, coordinates.long);
        response.send(coordinates);
    });
});

/**
 * saves the selected location into the file
 * @param {string} request - grabs the location that you have clicked on
 */
app.post('/storeuserdata', (request, response) => {
    /*let account = JSON.parse(fs.readFileSync('accounts.json'));
    for (var i = 0; i < account.length; i++) {
        if (logged_in.user == account[i].user) {
            console.log('push list');
            account[i].saved.push(request.body.location)
            last_save = request.body.location
        }
    }
    console.log(account);
    fs.writeFileSync('accounts.json', JSON.stringify(account));*/
    last_save = request.body.location
    checkLocations(logged_in.username, request.body.location).then(res => {
        addLocations(logged_in.username, request.body.location);
    }, rej => { console.log('failed');
    });
});
/**
 * populates the saved div with all the locations that you have saved to your account
 * @param {string} response - Renders the index2.hbs page with the variable displaySaved which is a list of all your saved locations and displayText that shows the SB based on IP 
 */
app.post('/favdata', (request, response) => {
    displaySaved = '';
    loadUserdata(logged_in.username).then(res => {
        displaySaved = '';
        console.log(saved_loc);
        for (var i = 0; i < saved_loc.length; i++) {
            console.log(saved_loc[i].location_id);
            displaySaved += `<div id=s${i} class="favItems"><a onclick="getMap(${saved_loc[i].location_id})"> ${saved_loc[i].location_id}</a></div>`;
        }
         displaySaved += `<div id=s${saved_loc.length} class="favItems"><a onclick="getMap(${last_save})"> ${last_save}</a></div>`


        current_ip.request_coodrs().then((response1) => {
            console.log(response1);
            maps.get_sturbuckses(response1.lat, response1.lon).then((response2) => {
                console.log(response2.list_of_places);
                displayText = ' ';
                for (var i = 0; i < response2.list_of_places.length; i++) {
                    displayText += `<div id=d${i} class='favItems'><a href="#" onclick="getMap(\'${response2.list_of_places[i]}\'); currentSB=\'${response2.list_of_places[i]}\'"> ${response2.list_of_places[i]}</a></div>`;
                }
                response.render('index2.hbs', {
                    savedSpots: displaySaved,
                    testvar: displayText,
                    coord: `<script>latitude = ${response1.lat}; longitude = ${response1.lon};initMultPlaceMap()</script>`
                });
            });
            // response.render('index2.hbs', {
            //     savedSpots: displaySaved,
            //     coord: `<script>latitude = ${response.lat}; longitude = ${response.lon};defMap()</script>`
            // })
        });
    });
});

app.get('/404', (request, response) => {
    response.send({
        error: 'Page not found'
    });
});


var server = app.listen(port, () => {
    console.log('Server is up on the port 8080');
});


module.exports = {
    UserNameCheck,
    PasswordCheck,
    LoginCheck,
    server
};
