const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const maps = require('./maps.js')

const crypto = require('crypto')

var app = express();
const port = process.env.PORT || 8080;

hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/views'));
app.use(bodyParser.urlencoded({
    extended: true
}));

var Accs = []
var place = '';
var logged_in = ""
var current_long = ''
var current_lat = ''
var last_save = ""
var user_id = '';
/**
 * Calls the function ReadAccfile and returns the list into the variable Accs
 */
var LoadAccfile = () => {
    Accs = ReadAccfile('accounts.json')
};

/**
 * Reads the file and returns the contents so its usable in node. 
 * If the file doesnt exist it will create the file with an empty list
 * @param {string} file - The file that you want to read
 */
var ReadAccfile = (file) => {
    try {
        return JSON.parse(fs.readFileSync(file))
    }
    catch (exception) {
        if (exception.code === 'ENOENT') {
            fs.writeFileSync(file, '[]');
            return JSON.parse(fs.readFileSync(file))
        }
        else {
            window.alert(exception)
        }
    }
};

/**
 * Turns the variable Accs into a string and writes it into the accounts.json file
 */

var WriteAccfile = () => {
    fs.writeFileSync('accounts.json', JSON.stringify(Accs));
};

/**
 * Reads the account file and also calls the function LoginCheck. Renders error page or index page
 * @param {string} request - Grabs the username and password values from the form lin loginbox
 * @param {string} response - Renders index2.hbs or error1.hbs
 */

var Login = (request, response) => {
    var filecontents = ReadAccfile('accounts.json')
    if (LoginCheck(request, filecontents) == 0) {
        response.render('index2.hbs');
    }
    else {
        response.render('error.hbs', {
            error: "Incorrect Username or Password"
        });
    }
};

/**
 * Verifies that the username and password exist in the accs arg.
 * @param {string} request - Grabs the username and password values from the form
 * @param {string} accs - The list object passed in from Login fucntion
 */

var LoginCheck = (request, accs) => {
    hashing_password = hash_data(request.body.password)

    for (i = 0; i < accs.length; i++) {
        if ((request.body.username == accs[i].user) && (hashing_password == accs[i].pass)) {
            console.log("User pass is ", accs[i].pass);
        	logged_in = accs[i]
            user_id = i
            return 0
        }
    };
};

/**
 * Adds a user to the file and Acc list variable if UserNameCheck and PasswordCheck returns 0.
 * @param {string} request - Grabs the username, password and confirm password values from the form createacc 
 * @param {string} response - renders origional login page 
 */

var AddUsr = (request, response) => {
    LoadAccfile()
    if (UserNameCheck(request, response) == 0 && PasswordCheck(request, response) == 0 && request.body.NewUser.length != 0 && request.body.NewPassword.length != 0) {
        hash_password = hash_data(request.body.NewPassword)    
        var acc = {
            'user': request.body.NewUser,
            'pass': hash_password,
            'saved': []
        }
        Accs.push(acc)
        WriteAccfile()
		response.render('index.hbs');
    }
};

var hash_data = (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * checks if new username is already saved
 * @param {string} request - Grabs the new username
 * @param {string} response - renders errorpage
 */

var UserNameCheck = (request, response) => {
    if (request.body.NewUser.length <= 12 && request.body.NewUser.length >= 3 ) {
        console.log(request.body.NewUser.length)
        for (i = 0; i < Accs.length; i++) {
            if (request.body.NewUser == Accs[i].user) {
                response.render('error.hbs', {
                    error: "Username Already taken"
                });
                return 1
            }
        }
        return 0
    }
    response.render('error.hbs', {
        error: "Username needs to be  3 to 12 characters long"
    });
    return 2
};


/**
 * checks if password and confirmed password is not the same
 * @param {string} request - Grabs the password and confirm password
 * @param {string} response - renders errorpage 
 */

var PasswordCheck = (request, response) => {
    if (request.body.NewPassword.length >= 5 && request.body.confirmp.length >= 5){
        if (request.body.NewPassword != request.body.confirmp) {
            response.render('error.hbs', {
                error: "Passwords do not match"
            });
            return 1
        } else {
            return 0
        }
    }
    response.render('error.hbs', {
        error: "Password needs to be at least 5 characters"
    });
    return 2
};


app.set('view engine', 'hbs');

app.get('/', (request, response) => {
    response.render('index.hbs');
});

app.post('/login', (request, response) => {
    Login(request, response);
});

app.post('/home', (request, response) => {
    AddUsr(request, response);
}); 


/**
 * gets the search and form and populates the 
 * @param {string} request - Grabs the password and confirm password
 * @param {string} response - renders errorpage 
 */


app.post('/loginsearch', (request, response) => {
    place = request.body.search
    maps.getAddress(place).then((coordinates) => {
        console.log(coordinates);
        maps.get_sturbuckses(coordinates.lat, coordinates.long).then((response1) => {
            console.log(response1.list_of_places);
            displayText = ''
            for (var i = 0; i < maps.listofmaps.length; i++) {
                displayText += `<div class='favItems'><a href="#" onclick="getMap(\'${maps.listofmaps[i]}\'); currentSB=\'${maps.listofmaps[i]}\'"> ${maps.listofmaps[i]}</a></div>`
            }
            response.render('index2.hbs', {
                testvar: displayText,
                coord: `<script>latitude = ${coordinates.lat}; longitude = ${coordinates.long};defMap()</script>`
            })
        }).catch((error) => {
            console.log("Error ", error);
        })
    })
})

app.post('/getLocation', (request, response) => {
    place = request.body.location
    maps.getAddress(place).then((coordinates) => {
        console.log(coordinates.lat, coordinates.long);
        response.send(coordinates)
    })
})

app.post('/storeuserdata', (request, response) => {
	let account = JSON.parse(fs.readFileSync('accounts.json'));
	for (var i = 0; i < account.length; i++) {
		if (logged_in.user == account[i].user) {
            console.log('push list');
			account[i].saved.push(request.body.location)
            last_save = request.body.location
		}
	}
    console.log(account);
	fs.writeFileSync('accounts.json', JSON.stringify(account));
})

app.post('/favdata', (request, response) => {
    displaySaved = ''
    LoadAccfile()
    var userdata = Accs[user_id]
    console.log(userdata.saved);

    for (var i = 0; i < userdata.saved.length; i++) {
    	console.log(userdata.saved[i]);
        displaySaved += `<div class="favItems"><a onclick="getMap(${userdata.saved[i]})"> ${userdata.saved[i]}</a></div>`
    }
	response.render('index2.hbs', {
        savedSpots: displaySaved
    })
})

app.get('/404', (request, response) => {
    response.send({
        error: 'Page not found'
    })
})

app.listen(port, () => {
    console.log('Server is up on the port 8080');
});

module.exports = {
    UserNameCheck,
    PasswordCheck,
    LoginCheck
}