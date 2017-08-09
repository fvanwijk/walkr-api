var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DiscoverySchema = new Schema({
  url: String,
  wid: { name: String, url: String },
  planet: { name: String, url: String },
  index: Number,
  level: Number,
  discovery: {
    distance: Number,
    date: Date,
    time: Number, // seconds
    boost: { cubes: Number, energy: Number }, // For a total completion
    price: { coins: Number }
  },
  upgrade: {
    base_price: { coins: Number },
    next_price: { coins: Number, cubes: Number, energy: Number },
    time: Number,
    boost: { cubes: Number, energy: Number } // For a total completion
  },
  production: {
    requirements: { name: String, quantity: Number }, // Food to start new harvest round
    resources: { name: String, quantity: Number }, // Total resources
    time: Number, // seconds
    boost: { cubes: Number, energy: Number } // For a total completion
  },
  population: Number
});

var discovery = mongoose.model('Discovery', DiscoverySchema);

module.exports = {
  model: discovery,
  schema: DiscoverySchema
};
