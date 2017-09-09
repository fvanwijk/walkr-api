var mongoose = require('mongoose');
var url = require('../api/url');
var Schema = mongoose.Schema;

var ShipSchema = new Schema({
  id: Number,
  url: String,
  name: String,
  variants: [
    {
      id: String,
      url: String,
      paint: String,
      speed: Number,
      boost: Number,
      energy: Number,
      skill: {
        unit: String,
        quantity: Number
      },
      costs: {
        resource: String,
        quantity: Number
      },
      requirement: {
        progress: String,
        quantity: Number
      }
    }
  ],
});

var ship = mongoose.model('Ship', ShipSchema);
ship.slug = 'ships';
ship.identifierField = 'id';
ship.nameField = 'name';

const addHost = url.addHostToUrl.bind(url);

ship.resultMapper = ship => {
  ship.url = addHost(ship.url);
  ship.variants.forEach(variant => {
    variant.url = addHost(variant.url);
  });
  return ship;
};
ship.variant = {
  resultMapper: variant => {
    variant.url = addHost(variant.url);
    return variant;
  }
};

module.exports = {
  model: ship,
  schema: ShipSchema
};
