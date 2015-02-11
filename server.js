var express = require('express');
var orm = require('orm');
var app = express();


// body parsing
var app = require('express')();
var bodyParser = require('body-parser');
var multer = require('multer'); 

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data


app.use(orm.express(process.env.DATABASE_URL || "pg://postgres@localhost/mixbox", {
    define: function (db, models, next) {

       models.person = db.define("person", {
          email: String,
          ip_address: String,
          user_agent: String,
          date: Date
        });

        db.sync(); //auto-create tables

        next();
    }
}));

//serve static content
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({ extended: true }));


app.post('/signup', function(req, res){

  req.models.person.create([ req.body ], function(err, items){
    // console.log([err, items]);

    res.status(err ? 400 : 200).end();
  });
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Listening on "+port);