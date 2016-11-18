var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiscoverySchema = new Schema({
  url: String,
  wid: String,
  planet: String,
  level: Number,
  discovery_date: Date,
  base_price: { name: String, quantity: Number },
  next_upgrade_price: { name: String, quantity: Number },
  requirements: { name: String, quantity: Number },
  resource_value: { name: String, quantity: Number },
  completion_time: Number // minutes
});

var discovery = mongoose.model('Discovery', DiscoverySchema);

module.exports = {
  model: discovery,
  schema: DiscoverySchema
};
