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

var planet = mongoose.model('Planet', PlanetSchema);
planet.slug = 'planets';
planet.identifierField = 'code';
planet.nameField = 'name';

module.exports = planet;
