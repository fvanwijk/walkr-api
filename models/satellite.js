const Planet = require('./planet');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SatelliteSchema = new Schema({
  url: String,
  id: Number,
  name: String,
  boost: String,
  level_1: String,
  level_2: String
});

var satellite = mongoose.model('Satellite', SatelliteSchema);
satellite.slug = 'satellites';
satellite.identifierField = 'id';
satellite.nameField = 'name';

module.exports = {
  model: satellite,
  schema: SatelliteSchema
};
