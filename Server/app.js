var bodyParser   = require('body-parser');
var config       = require('./config.js');
var cookieParser = require('cookie-parser');
var flash        = require('connect-flash');
var errorroutes  = require('./router.js');
var express      = require('express');
var logger       = require('morgan');
var mongoose     = require('mongoose');
var passport     = require('passport');
var path         = require('path');
var routes       = require('./router.js');
var session      = require('express-session');
var winston      = require('winston');
var app          = express();

// Connect to database
mongoose.connect(config.db.url);

// Serve static content
app.use('/', express.static(path.join(__dirname, '../Client/')));

// Load passport settings
require('./passport')(passport);

// Setup express app
app.use(logger('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(session({
    secret: 'PclubIITK',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/../Client/');
// Setup routes
app.use('/', routes);

// Define 404 functions
var error404 = function(req, res) {
    res.status(404).send('Route not found.');
}
app.get('*', error404);
app.post('*', error404);

app.listen(config.web.port, config.web.host, function() {
    winston.log('info', 'TechTest service listening at http://%s:%s', config.web.host, config.web.port);
});

module.exports = app;
