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
    var message = req.flash('loginmsg');
    if(message.length==0) message = [''];
    console.log(message);
    res.render('login.ejs', {
       message: message[0]
    });
});

// Profile Page
router.get('/profile', controllers.login.checkAuth, function(req, res) {
    res.render('profile.ejs', {
      username: req.user.username,
      access: req.user.access
    });
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
