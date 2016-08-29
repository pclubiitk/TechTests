var LocalStrategy = require('passport-local').Strategy;

// The user schema
var User = require('./models/user');

// For verifying via iitk servers
var Ftp = require('ftp');

module.exports = function(passport) {

    // Serializing using username
    passport.serializeUser(function(user, done) {
        done(null, user.username);
    });

    // Deserializing using username
    passport.deserializeUser(function(id, done) {
        User.findOne({
            'username': id
        }, function(err, user) {
            done(err, user);
        });
    });

    // Defining a strategy for authentication and login
    passport.use('local-signin', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function(req, email, password, done) {
        process.nextTick(function() {
            // Verify IITK login everytime, never save the password
            if (email.match(/([A-Za-z0-9]+)@iitk\.ac\.in$/)) {
                var login = new Ftp();
                var username = email.match(/([A-Za-z0-9]+)@iitk\.ac\.in$/)[1];
                login.on('ready', function() {
                    login.logout();
                    login.destroy();
                    User.findOne({
                        'username': username
                    }, function(err, user) {
                        if (err)
                            return done(err);
                        if (user) {
                            return done(null, user);
                        } else {
                            var newUser = new User();
                            newUser.username = username;
                            newUser.save(function(err) {
                                if (err)
                                    throw err;
                                return done(null, newUser);
                            });
                        }
                    });
                });
                login.on('error', function(err) {
                    if(err.code == 530) {
                        login.destroy();
                        return done(null, false, req.flash('loginmsg', 'Wrong Username or password'));
                    } else {
                        return done(err)
                    }
                });
                var details = {
                    host: "webhome.cc.iitk.ac.in",
                    port: "21",
                    user: username,
                    password: password
                };
                login.connect(details);
            } else {
                return done(null, false, req.flash('loginmsg', 'Not a valid iitk email id'));
            }
        });
    }));
};
