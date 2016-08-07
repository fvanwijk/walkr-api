var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LevelSchema = new Schema({
  level: 'number',
  production_rate: 'number',
  description: String
});

module.exports = mongoose.model('Level', LevelSchema);
