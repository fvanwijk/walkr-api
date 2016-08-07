var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LevelSchema = new Schema({
  url: String,
  level: Number,
  production_rate: Number,
  description: String
});

module.exports = mongoose.model('Level', LevelSchema);
