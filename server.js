var express = require('express');
var orm = require('orm');
var app = express();

var MailChimp = require('mailchimp').MailChimpAPI;

var mailchimp = MailChimp(process.env.MAILCHIMP_KEY, { version : '1.3', secure: false });

console.log(mailchimp);
console.log(process.env.MAILCHIMP_KEY);

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

app.post('/signup', function(req, res){

  req.models.person.create([ req.body ], function(db_err, items){

    // mailchimp.lists({
    //   limit: 1
    // }, function(err, data){
    //   console.log([err,data]);
    //   res.status(400).end();
    // });
    console.log(req.body);

    mailchimp.listSubscribe({
      // id: process.env.MAILCHIMP_LIST,
      email_address: req.body.email,
    }, function(mc_err, data){
      if(db_err||mc_err){
        console.log([db_err, mc_err]);
        res.status(400).end();
      }else{
        res.status(200).end();
      }
    });

  });
});

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Listening on "+port);