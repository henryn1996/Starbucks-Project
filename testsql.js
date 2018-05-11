var mysql = require('mysql');
var fs = require('fs')

var credentials = ""

var Loadfile = () => {
    credentials = ReadAccfile('credentials.json')
};

var ReadAccfile = (file) => {
        return JSON.parse(fs.readFileSync(file))
};

Loadfile()
var con = mysql.createConnection({
  host: credentials.host,
  user: credentials.user,
  password: credentials.password,
  database: credentials.database,
  port: credentials.port
});


con.query('SELECT * FROM users', function(err, rows, fields) {
 if (err) throw err

 console.log(rows[0].username);

});

