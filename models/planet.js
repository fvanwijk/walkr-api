var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlanetSchema = new Schema({
  url: String,
  code: Number,
  name: String,
  description: String,
  type: String,
  gravity: String,
  creature: String,
  creature_description: String,
  resource: String,
  level: Number,
  discovery_date: Date,
  base_price: { name: String, quantity: Number },
  next_upgrade_price: { name: String, quantity: Number },
  requirements: { name: String, quantity: Number },
  resource_value: { name: String, quantity: Number },
  completion_time: Number // minutes
});

var planet = mongoose.model('Planet', PlanetSchema);
planet.slug = 'planets';
planet.identifierField = 'code';
planet.nameField = 'name';

module.exports = {
  model: planet,
  schema: PlanetSchema
};
