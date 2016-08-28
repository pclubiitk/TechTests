/*eslint no-process-env: 0*/
/*eslint no-undef: 0*/
var path = require('path');

var config = {};

config.web = {};
config.db = {};

config.web.host = '0.0.0.0';
config.web.port = 8000;

config.db.url = 'mongodb://localhost/users'

module.exports = config;
