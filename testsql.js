var mysql = require('mysql');

var con = mysql.createConnection({
  host: "sbinstance2.csw7mgw0wa6p.ca-central-1.rds.amazonaws.com",
  user: "Nightclubs",
  password: "venti9000",
  database: "starbucks",
  port: "1433"
});


con.query('SELECT * FROM users', function(err, rows, fields) {
 if (err) throw err

 console.log(rows[0].username);
});