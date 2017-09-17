const mongoose = require('mongoose');
const url = require('../api/url');
const Schema = mongoose.Schema;

const DFRDiscoverySchema = new Schema({
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

const model = mongoose.model('DFRDiscovery', DFRDiscoverySchema);

model.getUpgradePrice = function(basePrice, level) {
  return {
    coins: basePrice.coins * Math.pow(2, level - 1),
    cubes: undefined, // TODO: determine formula
  };
};

model.resultMapper = dfrDiscovery => {
  dfrDiscovery.url = url.addHostToUrl(dfrDiscovery.url);
  dfrDiscovery.dfr.url = url.addHostToUrl(dfrDiscovery.dfr.url);
  dfrDiscovery.wid.url = url.addHostToUrl(dfrDiscovery.wid.url);

  dfrDiscovery.production = {
    resources: {
      name: 'food',
      quantity: Math.round(351 * Math.pow(1.25, dfrDiscovery.level - 1))
    }
  };
  dfrDiscovery.production.time = dfrDiscovery.production.resources.quantity * 6;
  dfrDiscovery.upgrade = {
    base_price: {
      coins: 2000
    }
  };
  dfrDiscovery.upgrade.next_price = model.getUpgradePrice(dfrDiscovery.upgrade.base_price, dfrDiscovery.level);
  return dfrDiscovery;
};

module.exports = {
  model: model,
  schema: DFRDiscoverySchema
};
