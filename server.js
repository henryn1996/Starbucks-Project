const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const maps = require('./maps.js')

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


var LoadAccfile = () => {
    Accs = ReadAccfile('accounts.json')
};

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

var WriteAccfile = () => {
    fs.writeFileSync('accounts.json', JSON.stringify(Accs));
};

var Login = (request, response) => {
    var filecontents = ReadAccfile('accounts.json')
    if (LoginCheck(request, filecontents) == 0) {
        response.render('index2.hbs');
    } 
    else {
        response.render('error1.hbs');
    }
};

var LoginCheck = (request, accs) => {
    for (i = 0; i < accs.length; i++) {
        if ((request.body.username == accs[i].user) && (request.body.password == accs[i].pass)) {
        	logged_in = accs[i]
            return 0
        }
    };
};

var AddUsr = (request, response) => {
    LoadAccfile()
    if (UserNameCheck(request, response) == 0 && PasswordCheck(request, response) == 0 && request.body.NewUser.length != 0 && request.body.NewPassword.length != 0) {
        var acc = {
            'user': request.body.NewUser,
            'pass': request.body.NewPassword,
            'saved': []
        }
        Accs.push(acc)
        WriteAccfile()
		response.render('index.hbs');
    }
};

var UserNameCheck = (request, response) => {
    for (i = 0; i < Accs.length; i++) {
        if (request.body.NewUser == Accs[i].user) {
            response.render('error.hbs');
            return 1
        }
    }
    return 0
};

var PasswordCheck = (request, response) => {
    if (request.body.NewPassword != request.body.confirmp) {
        response.render('error.hbs');
        return 1
    } else {
        return 0
    }
};

// ////////////////////////////////////////////////////////////
app.set('view engine', 'hbs');

app.get('/map', (request, response) => {
    response.render('map_view.hbs', {
        title: 'map page'
    })
})

app.get('/home', (request, response) => {
    response.render('index.hbs');
});

app.post('/login', (request, response) => {
    Login(request, response);
});

app.post('/home', (request, response) => {
    AddUsr(request, response);
}); 

app.post('/loginsearch', (request, response) => {
    place = request.body.search
    maps.getAddress(place).then((coordinates) => {
        console.log(coordinates);
        maps.get_sturbuckses(coordinates.lat, coordinates.long).then((response1) => {
            console.log(response1.list_of_places);
            displayText = '<ul>'
            for (var i = 0; i < maps.listofmaps.length; i++) {
                displayText += `<li><a href="#" onclick="getMap(\'${maps.listofmaps[i]}\'); currentSB=\'${maps.listofmaps[i]}\'"> ${maps.listofmaps[i]}</a></li>`
            }
            displayText += '</ul>'
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
    displaySaved = '<ul>'
    for (var i = 0; i < logged_in.saved.length; i++) {
    	console.log(logged_in.saved[i]);
        displaySaved += `<li><a onclick="getMap(${logged_in.saved[i]})"> ${logged_in.saved[i]}</a></li>`
    }
    displaySaved += `<li><a onclick="getMap(${last_save})"> ${last_save}</a></li>`
    displaySaved += '</ul>'
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