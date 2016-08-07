var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LevelSchema = new Schema({
  url: String,
  level: Number,
  production_rate: Number,
  description: String
});

var level = mongoose.model('Level', LevelSchema);
level.slug = 'levels';
level.nameField = 'level';

module.exports = level;
