var mongoose = require('mongoose');

// define the schema for our user model
var userSchema = mongoose.Schema({

    username : String,
    access   : { type  : String, default : 'user' }

});

module.exports = mongoose.model('user', userSchema);
