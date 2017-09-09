const url = require('../api/url');

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
satellite.resultMapper = satellite => {
  satellite.url = url.addHostToUrl(satellite.url);
  return satellite;
};

module.exports = {
  model: satellite,
  schema: SatelliteSchema
};
