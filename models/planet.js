var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlanetSchema = new Schema({
  url: String,
  code: Number,
  name: String,
  type: String,
  gravity: String,
  creature: String,
  resource: String
});

module.exports = mongoose.model('Planet', PlanetSchema);
