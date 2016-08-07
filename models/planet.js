var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlanetSchema = new Schema({
  code: 'number',
  name: String,
  type: String,
  gravity: String,
  creature: String,
  resource: String
});

module.exports = mongoose.model('Planet', PlanetSchema);
