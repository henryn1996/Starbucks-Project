var mysql = require('mysql');

var con = mysql.createConnection({
  host: "sbinstance2.csw7mgw0wa6p.ca-central-1.rds.amazonaws.com",
  user: "Nightclubs",
  password: "venti9000",
  database: "starbucks",
  port: 3306
});


con.query('CREATE TABLE users(uid INT NOT NULL AUTO_INCREMENT,username VARCHAR(30) NOT NULL,password VARCHAR(20) NOT NULL, PRIMARY KEY (uid));', function(err, rows, fields) {
 if (err) throw err

 console.log(rows);
});