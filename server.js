require('dotenv').config();
const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const maps = require('./maps.js');
const current_ip = require('./get_current_ip.js');
const crypto = require('crypto');
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const email = require('./send_email.js');
// const EmailTemp = require('email-templates');
// const email_temp = new EmailTemp();

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
var user_email = '';
var saved_loc;
/**
 * Calls the function ReadAccfile and returns the list into the variable Accs
 */

var con = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: process.env.dbport,
    multipleStatements: true
});
con.on('error', function(err){
    console.log('mysql error', err);
})

/**
 * Takes user's favorites list and Emails it to user
 */


var send_mail = (send_to, email_text) => {   
    options = email.mailOptions;
    options.to = send_to;
    options.subject = 'Test email from Sb app';
    options.text = email_text;
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

/**
* Connects to database and runs query to get all user accounts
*/
var LoadAccfile = () => {
    return new Promise(resolve => {
        con.query('SELECT * FROM users', function(err, res, fields) {
            console.log(err);
            resolve(Accs = JSON.parse(JSON.stringify(res)));

        });
    });
};

/**
* Connects to database, loads user's favorites list and saves it as a variable
* @param {string} user - takes the logged in username to select where username is arg user to get list of favorite locations
*/
var LoadEmail = (user) => {
    return new Promise(resolve => {
        con.query("SELECT email FROM users WHERE username = '" + user + "'", function (err, res, fields) {

            resolve(user_email = JSON.parse(JSON.stringify(res)));
        })
    })
}

var loadUserdata = (user) => {
    return new Promise(resolve => {
        con.query(`SELECT * from UserData WHERE username = '${user}' ORDER BY location_num`, function(err, res, fields) {
            resolve(saved_loc = JSON.parse(JSON.stringify(res)));
        });
    });
};

/**
* Connects to database, checks if location is already saved by the user by Where query
* @param {string} user - takes the logged in username
* @param {string} location - Is the location address the user is trying to save
*/
var checkLocations = (user, location) => {
    return new Promise(function(resolve, reject) {
        con.query("SELECT * from UserData WHERE username ='" + user + "' AND location_id = '" + location + "'", function(err, res, fields) {
            var loc = JSON.stringify(res);
            if (loc == '[]') {
                resolve();
            } else {

                reject();
            }
        });

    });
};

/**
* Connects to database, adds location to userdata table using location and logged in user
* @param {string} user - is the logged in user
* @param {string} location - Is the location address the user is trying to save
*/
var addLocations = (user, location) => {
    con.query("INSERT INTO UserData (username, location_id, location_num) values ('" + user + "','" + location + "'," +saved_loc.length+")"
)};

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
                for (var i = 0; i < saved_loc.length; i++) {
                    displaySaved += `<div id=s${i} class="favItems"><a href="#" onclick="getMap(${saved_loc[i].location_id})"> ${saved_loc[i].location_id}</a><button id="del${i}" class="delButton" onclick="deleteFav(${i})">x</button></div>`;
                }

                // current_ip.request_coodrs().then((response1) => {
                //     console.log('another error', response1);
                    maps.get_sturbuckses(request.body.latitude, request.body.longitude).then((response2) => {
                        console.log('error', response2);
                        displayText = ' ';
                        for (var i = 0; i < response2.list_of_places.length; i++) {
                            displayText += `<div id=d${i} class='favItems'><a href="#" onclick="getMap(\'${response2.list_of_places[i]}\'); currentSB=\'${response2.list_of_places[i]}\'"> ${response2.list_of_places[i]}</a></div>`;
                        }
                        response.render('index2.hbs', {
                            savedSpots: displaySaved,
                            testvar: displayText,
                            coord: `<script>latitude = ${request.body.latitude}; longitude = ${request.body.longitude};initMultPlaceMap()</script>`
                        });
                        // response.render('index2.hbs', {
                        //     savedSpots: displaySaved,
                        //     coord: `<script>latitude = ${response.lat}; longitude = ${response.lon};defMap()</script>`
                        // })
                    });
                //});
            },
            rej => {
                response.render('index.hbs', {
                    username: 3
                });
            }
        );
    });
    });
};

/**
 * Verifies that the username and password exist in the accs arg.
 * @param {string} request - Grabs the username and password values from the form
 * @param {string} accs - The list object passed in from Login fucntion
 */


var LoginCheck = (request, accs) => {
    return new Promise(function(resolve, reject) {
        for (i = 0; i < accs.length; i++) {
            //console.log(accs[i].username, request.body.username)
            if ((request.body.username == accs[i].username) && (hash_data(request.body.password + accs[i].salt) == accs[i].pass)) {
                logged_in = accs[i];
                user_id = i;
                //user_email = request.body.
                resolve(0);
            }
        }
        reject(1);
    });

};

var EmailCheck = (request,response) => {
    if (request.body.UserEmail.length != 0){
        return 0;
    }
    else {
        return 1;
    }
    
};


/**
 * Adds a user to the file and Acc list variable if UserNameCheck and PasswordCheck returns 0.
 * @param {string} request - Grabs the username, password and confirm password values from the form createacc 
 * @param {string} response - renders origional login page 
 */

var AddUsr = (request, response) => {
    LoadAccfile().then(res => {
        if (UserNameCheck(request, response, Accs) == 0 && PasswordCheck(request, response) == 0 && EmailCheck(request, response) == 0) {
            var salt = generateSalt();
            hash_password = hash_data(request.body.NewPassword + salt);
            var acc = {
                'user': request.body.NewUser,
                'pass': hash_password,
                'email': request.body.UserEmail
            };
            con.query("INSERT INTO users (username, pass, salt, email) values ('" + acc.user + "','" + acc.pass + "','" + salt + "','" + acc.email + "')", function (err, res, fields) {
                console.log(request.body.UserEmail);
            });

            response.render('index.hbs', {
                username: 0
            });
            return 'success!'
        }
    });
};

/**
* uses the crypto module to hash the data (usually a password)
* @param {string} data - is the string that is going to be hashed 
*/
var hash_data = (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
};

/**
* generates a 15 length salt, for password purposes
*/
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




var delFavourites = (nums) => {
    return new Promise(function(resolve,reject){
        var sql =''
        for (var i in nums){
            sql += `DELETE FROM UserData WHERE username = '${logged_in.username}' AND location_num = ${nums[i]};\n`
            sql += `UPDATE UserData SET location_num = location_num - 1 WHERE username = '${logged_in.username}' and location_num > ${nums[i]};\n`
            
        }
        console.log(sql)
        con.query(sql, function(err, res, fields){
            resolve()
        })
    })
}

app.post('/edit', (request, response) => {
    delFavourites(request.body.forDel.split(',')).then(res => {
        displaySaved = '';
        loadUserdata(logged_in.username).then(res => {
            displaySaved = '';
            for (var i = 0; i < saved_loc.length; i++) {
                console.log(saved_loc[i].location_id);
                displaySaved += `<div id=s${i} class="favItems"><a href="#" onclick="getMap(${saved_loc[i].location_id})"> ${saved_loc[i].location_id}</a><button id="del${i}" class="delButton" onclick="deleteFav(${i})">x</button></div>`;
            }
            if(last_save != ""){
                displaySaved += `<div id=s${saved_loc.length} class="favItems"><a href="#" onclick="getMap(${last_save})"> ${last_save}</a><button id="del${i}" class="delButton" onclick="deleteFav(${i})">x</button></div>`;
            }
           
            // LoadEmail(logged_in.username).then(email_res => {
            //     console.log("Res from database",email_res[0].email);
            //    var user_email = email_res[0].email;
            //    var new_text = "This is new test of email."
            //   send_mail(user_email,new_text);
            // });
    
            current_ip.request_coodrs().then((response1) => {
                maps.get_sturbuckses(response1.lat, response1.lon).then((response2) => {
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
            });
        });
    })
})


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
    maps.get_sturbuckses(latitude, longitude).then((response1) => {});
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
            savedSpots: displaySaved,
            testvar: displayText,
            coord: `<script>latitude = ${49.2827}; longitude = ${123.1207}; z = ${19};initMultPlaceMap()</script>`
        });
    }
    maps.getAddress(place).then((coordinates) => {
        displaySaved = '';
        loadUserdata(logged_in.username).then(res => {
            displaySaved = '';
            for (var i = 0; i < saved_loc.length; i++) {
                displaySaved += `<div id=s${i} class="favItems"><a onclick="getMap(${saved_loc[i].location_id})"> ${saved_loc[i].location_id}</a><button id="del${i}" class="delButton" onclick="deleteFav(${i})">x</button></div>`;
            }
        });
        displayText = ' ';
        if (coordinates.lat && coordinates.long) {
            maps.get_sturbuckses(coordinates.lat, coordinates.long).then((response1) => {
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
                displaySaved = '';
        loadUserdata(logged_in.username).then(res => {
            for (var i = 0; i < saved_loc.length; i++) {
                displaySaved += `<div id=s${i} class="favItems"><a href="#" onclick="getMap(${saved_loc[i].location_id})"> ${saved_loc[i].location_id}</a></div>`;
            }
            response.render('index2.hbs', {
                error: 1,
                coord:`<script>latitude = ${49.2827}; longitude = ${123.1207}; z = ${19};initMultPlaceMap()</script>`,
                savedSpots: displaySaved
            });
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
        response.send(coordinates);
    });
});

/**
 * saves the selected location into the file
 * @param {string} request - grabs the location that you have clicked on
 */
app.post('/storeuserdata', (request, response) => {
    last_save = request.body.location;
    checkLocations(logged_in.username, request.body.location).then(res => {
        last_save = request.body.location;
        addLocations(logged_in.username, request.body.location);
    }, rej => { response.send("exists"); }
    );
});

/**
 * populates the saved div with all the locations that you have saved to your account
 * @param {string} response - Renders the index2.hbs page with the variable displaySaved which is a list of all your saved locations and displayText that shows the SB based on IP 
 */
app.post('/favdata', (request, response) => {
    displaySaved = '';
    loadUserdata(logged_in.username).then(res => {
        displaySaved = '';
        for (var i = 0; i < saved_loc.length; i++) {
            console.log(saved_loc[i].location_id);
            displaySaved += `<div id=s${i} class="favItems"><a href="#" onclick="getMap(${saved_loc[i].location_id})"> ${saved_loc[i].location_id}</a><button id="del${i}" class="delButton" onclick="deleteFav(${i})">x</button></div>`;
        }
        if(last_save != ""){
            displaySaved += `<div id=s${saved_loc.length} class="favItems"><a href="#" onclick="getMap(${last_save})"> ${last_save}</a><button id="del${i}" class="delButton" onclick="deleteFav(${i})">x</button></div>`;
        }
       
        // LoadEmail(logged_in.username).then(email_res => {
        //     console.log("Res from database",email_res[0].email);
        //    var user_email = email_res[0].email;
        //    var new_text = "This is new test of email."
        //   send_mail(user_email,new_text);
        // });

            current_ip.request_coodrs().then((response1) => {
                maps.get_sturbuckses(response1.lat, response1.lon).then((response2) => {
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
            });
        });
})


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
    server,
    LoadAccfile,
    loadUserdata,
    checkLocations,
    hash_data,
    generateSalt,
    AddUsr
};
