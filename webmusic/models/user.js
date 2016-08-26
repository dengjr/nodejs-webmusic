var mongoose = require('mongoose');
var userSchema = require('../schemas/user');
var user = mongoose.model('users',userSchema);

module.exports = user;