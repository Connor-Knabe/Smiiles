// forever -e /root/SmileZone/WebApp/log.err -a -o /root/SmileZone/WebApp/log.log start /root/SmileZone/WebApp/app.js

var fs = require('fs');
var constants = require('constants');
var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var path = require('path');
var https = require('https');
var http = require('http');
var sessionSecret = require('./sessionSecret.js');
var bcryptjs = require('bcryptjs');
var mongodb = require('mongodb');
var mongoose = require('mongoose');
var passport = require('passport');

//Models
var userModel = require('./mvc/models/user.js');
var pointModel = require('./mvc/models/point.js');

<<<<<<< HEAD
var options = {
    ca: fs.readFileSync('/root/SmileZone/WebApp/config/ssl/smiiles.ca-bundle'),
    key: fs.readFileSync('/root/SmileZone/WebApp/config/ssl/server.key'),
    cert: fs.readFileSync('/root/SmileZone/WebApp/config/ssl/smiiles.crt'),
    secureProtocol: 'TLSv1_2_method',
    secureOptions: constants.SSL_OP_NO_SSLv3
};

console.log('Starting app ', new Date());
=======


console.log("Starting app ", new Date());
>>>>>>> loginfix

mongoose.connect('localhost', 'smilezone5');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
    console.log('Connected to DB');
});

// Password verification
<<<<<<< HEAD
userModel.userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
=======
userModel.userSchema.methods.comparePassword = function (candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
>>>>>>> loginfix
};
var User = mongoose.model('User', userModel.userSchema);

//Include passport
require('./mvc/controllers/passport.js')(app, passport, User);

var Points = mongoose.model('Points', pointModel.pointsSchema);

<<<<<<< HEAD
app.configure(function() {
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.cookieParser());
    app.use(express.static(__dirname + '/public'));
    app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
    app.set('views', __dirname + '/mvc/views');
    app.set('view engine', 'ejs');
    app.use(express.session({ secret: sessionSecret.secret }));
    // app.use(function(req, res, next) {
    // 	if(!req.secure) {
    // 		return res.redirect(['https://', req.get('Host'), req.url].join(''));
    //  		}
    // 	next();
    // });
    // Remember Me middleware
    app.use(function(req, res, next) {
        if (req.method == 'POST' && req.url == '/login') {
            req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
        }
        next();
    });
=======
app.configure(function () {
	// app.use(express.json());
	app.use(express.urlencoded());
	app.use(express.cookieParser());
	app.use(express.static(__dirname + '/public'));
	app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
	app.set('views', __dirname + '/mvc/views');
	app.set('view engine', 'ejs');
	app.use(express.session({ secret: sessionSecret.secret }));

	// Remember Me middleware
	app.use(function (req, res, next) {
		if (req.method == 'POST' && req.url == '/login') {
			req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
		}
		next();
	});
	app.use(passport.initialize());
	app.use(passport.session());

>>>>>>> loginfix
});

require('./mvc/controllers/routes.js')(app, passport, Points, User, db);

http.createServer(app).listen(port);
<<<<<<< HEAD
// https.createServer(options, app).listen(443);
=======
>>>>>>> loginfix
