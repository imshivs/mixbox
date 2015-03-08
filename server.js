var orm         = require('orm');
var app         = require('express')();
var MailChimp   = require('mailchimp').MailChimpAPI;
var bodyParser  = require('body-parser');
var multer      = require('multer'); 
var compression = require('compression');
var serveStatic = require('serve-static');


var mailchimp = MailChimp(process.env.MAILCHIMP_KEY, { version : '1.3', secure: true });

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data
app.use(compression()); //gzip where posible
// app.use(serveStatic(__dirname + '/public', { maxAge: '7d' })); //serve static content

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

app.post('/signup', function(req, res){

  //add them to the database
  req.models.person.create([{
    email: req.body.email,
    ip_address: req.connection.remoteAddress,
    user_agent: req.headers["user-agent"],
    date: new Date()
  }], function(db_err, items){

    if(db_err){
      console.log(db_err);
      res.status(400).end();
      return;
    }

    var person = items[0];

    //subscribe them to the mailchimp list
    mailchimp.listSubscribe({
      id: process.env.MAILCHIMP_LIST,
      email_address: person.email,
      merge_vars: {
        OPTIN_IP:     person.ip_address,
        OPTIN_TIME:   person.date,
      },
      double_optin: false, //using confirmed opt-in
      send_welcome: true,
      update_existing: true
    }, function(mc_err, data){
      if(mc_err){
        console.log(["Mailchimp failed:", person.id]);
        res.status(200).end(""+person.id);
        console.log(mc_err);
        // res.status(400).end();
        return;
      }
      console.log(["added:", person, data]);
      // console.log(["added:", person]);

      res.status(200).end(""+person.id);
      // res.redirect('/?quiz='+person.id);
    });
  });
});

//send static asset requests to AWS
// app.get(/^.*/, function(req, res) {
//     res.redirect(301, '//s3.amazonaws.com/bucket' + req.path);
// });

var port = process.env.PORT || 5000;
app.listen(port);
console.log("Listening on "+port);




// mailchimp.lists({
//   limit: 1
// }, function(err, data){
//   console.log(data);
//   res.status(400).end();
// });
// console.log(req.body);