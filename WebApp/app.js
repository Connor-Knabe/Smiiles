var express  = require('express');
var app      = express();
var port     = process.env.PORT || 80;
var path = require('path');
var http = require('http');
var server = http.createServer(app);
var bodyParser = require('body-parser');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var mongodb = require('mongodb')
var mongoose = require('mongoose');


mongoose.connect('localhost', 'test2');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {
	console.log('Connected to DB');
})

//User Schema

var userSchema = mongoose.Schema({
	firstName: { type: String, required: true, unique: true },
	lastName: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true }
});
// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};
var User = mongoose.model('User', userSchema);

passport.serializeUser(function(user, done) {
	done(null, user.email);
});

passport.deserializeUser(function(email, done) {
	User.findOne( { email: email } , function (err, user) {
		done(err, user);
	});
});


// Bcrypt middleware
userSchema.pre('save', function(next) {
	var user = this;
	if(!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if(err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// Password verification
userSchema.methods.comparePassword = function(candidatePassword, cb) {
	console.log("Compare pass");
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if(err) return cb(err);
		cb(null, isMatch);
	});
};


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' },
	function(email, password, done) {
	  	User.findOne({ email: email }, function(err, user) {
			console.log("Into passport");
			console.log(email);
	    	if (err) { return done(err); }
	    	if (!user) { return done(null, false); }
	    	user.comparePassword(password, function(err, isMatch) {
		  		if (err) return done(err);
		      	if(isMatch) {
		        	return done(null, user);
		      	} else {
		        	return done(null, false, { message: 'Invalid password' });
		      	}
	    	});
	  	});
}));


app.configure(function() {

    app.use(express.json());
    app.use(express.urlencoded());
 	app.use(express.cookieParser());
	app.use(express.static(__dirname + '/public'));

	app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

	app.use(express.session({ secret: 'asmilezone' })); //add this
	// Remember Me middleware
	app.use( function (req, res, next) {
		if ( req.method == 'POST' && req.url == '/login' ) {
			if ( req.body.rememberme ) {
			    req.session.cookie.maxAge = 2592000000; // 30*24*60*60*1000 Rememeber 'me' for 30 days
		    } else {
				req.session.cookie.expires = false;
			}
		}
		next();
	});
	app.use(passport.initialize());
	app.use(passport.session());

});

app.get('/', function(req, res) {
	console.log("prof"+ req.user);
	if (req.user){
		res.render('loggedin.ejs', {user:req.user});
	} else {
		res.render('index.ejs', {action:"index", user:null});
	}
});
app.get('/signup', function(req, res) {
	res.render('index.ejs', {action:"signup", error:"none"});
});
app.get('/login',ensureAuthenticated, function(req, res){
	res.render('index.ejs', { action:"loggedin"});
});

app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});



// POST /login
//   This is an alternative implementation that uses a custom callback to
//   acheive the same functionality.
app.post('/login',
	passport.authenticate('local', {
		failureRedirect: '/#login',
    }), session
);

function session (req, res) {
 	//var redirectTo = req.session.returnTo ? req.session.returnTo : '/';
 	//delete req.session.returnTo;
 	res.redirect('/');
};



app.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

app.post('/signup', function(req, res) {
	//Seed a user

	if(req.body.password1 != req.body.password2){
		res.render('index.ejs', {action:"signup", error:"password"});
	}

	console.log("Firstname:"+ req.body.firstname);
	console.log("lastname:"+ req.body.lastname);
	console.log("email:"+ req.body.email);
	console.log("password:"+ req.body.password1);
	var usr = new User({ firstName:req.body.firstname, lastName:req.body.lastname, email: req.body.email, password: req.body.password1 });

	usr.save(function(err) {
		if(err) {
			res.render('index.ejs', {action:"signup", error:"duplicate"});
			console.log(err);
		} else {
			res.render('index.ejs', {action:"loggedin", error:"none"})
			console.log('user: ' + usr.email + "saved.");
		}
	});

});



// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/')
}

//require('./config/routes.js')(app,passport,server);

server.listen(port);
