var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var config = require('./config.js');
var winston = require('winston');

var routes = require('./router.js');
var errorroutes = require('./router.js');
var __dirname = path.resolve(path.dirname());
var app = express();

require('./passport')(passport);
app.use(logger('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'PclubIITK',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);

var error404 = function(req, res) {
    res.status(404).send('Route not found.');
}

app.get('*', error404);
app.post('*', error404);

app.listen(config.web.port, config.web.host, function () {
  winston.log('info', 'TechTest service listening at http://%s:%s', config.web.host, config.web.port);
});

module.exports = app;
