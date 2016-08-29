var express    = require('express');
var requireDir = require('require-dir');
var config     = require('./config.js');

var controllers = requireDir('./controllers');
var router = express.Router();

var passport = require('passport');

// Home Page
router.get('/', controllers.redirect.loginRedirect);

// Login Page
router.get('/login', function(req, res) {
    // TODO: make a frontend and display req.flash('loginmsg') alongwith login form
    res.send(req.flash('loginmsg'));
});

// Profile Page
router.get('/profile', controllers.login.checkAuth, function(req, res) {
    // TODO: Redirect to profile page with user data
    res.send( "Hello " + req.user.username );
});

// Logout
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// Login Request
router.post('/login', passport.authenticate('local-signin', {
        successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect : '/login',   // redirect back to the signup page if there is an error
        failureFlash    : true
    }));

module.exports = router;
