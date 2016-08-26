var mongoose = require('mongoose');
var musicSchema = require('../schemas/music');
var music = mongoose.model('musics',musicSchema);

module.exports = music;