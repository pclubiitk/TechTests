var model = {}; // Insert schema here
var localStrategy = require('passport-local').Strategy;
module.exports = function(passport) {
    passport.serializeUser(...);
    passport.serializeUser(...);
    passport.use('local-signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        process.nextTick(function() {
            // Verify IITK login everytime, never save the password
        });
    }));
};
