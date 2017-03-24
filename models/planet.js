var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlanetSchema = new Schema({
  url: String,
  code: Number,
  name: String,
  image_url: String,
  description: String,
  type: String,
  gravity: String,
  creature: String,
  creature_description: String,
  creature_image_url: String,
  resource: String,
  resource_image_url: String
});

var planet = mongoose.model('Planet', PlanetSchema);
planet.slug = 'planets';
planet.identifierField = 'code';
planet.nameField = 'name';

module.exports = {
  model: planet,
  schema: PlanetSchema
};
