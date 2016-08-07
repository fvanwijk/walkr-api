var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlanetSchema = new Schema({
  name: String
});

module.exports = mongoose.model('Planet', PlanetSchema);
