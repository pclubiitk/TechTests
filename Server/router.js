var express    = require('express');
var requireDir = require('require-dir');
var config     = require('./config.js');

var controllers = requireDir('./controllers');
var router = express.Router();

// redirect.<function name> is retrieved from controllers/redirect.js
router.get('/', controllers.redirect.loginRedirect);
router.post('/login', controllers.login.checkAuth);

module.exports = router;
