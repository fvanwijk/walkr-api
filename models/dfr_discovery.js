var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DFRDiscoverySchema = new Schema({
  id: Number,
  url: String,
  wid: { name: String, url: String },
  dfr: { name: String, url: String },
  level: Number,
  distance: Number,
  base_price: { name: String, quantity: Number },
  next_upgrade_price: { name: String, quantity: Number },
  resource_value: { name: String, quantity: Number }, // Total food
  completion_time: Number // minutes
});

var dfrdiscovery = mongoose.model('DFRDiscovery', DFRDiscoverySchema);

module.exports = {
  model: dfrdiscovery,
  schema: DFRDiscoverySchema
};
