var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ShipSchema = new Schema({
  id: Number,
  url: String,
  name: String,
  variants: [
    {
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

module.exports = {
  model: ship,
  schema: ShipSchema
};
