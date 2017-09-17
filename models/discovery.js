const mongoose = require('mongoose');
const url = require('../api/url');
const Schema = mongoose.Schema;

const DiscoverySchema = new Schema({
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

const model = mongoose.model('Discovery', DiscoverySchema);

model.getBasePrice = function(index) {
  return { coins: 300 * Math.pow(index, 2) - 150 * (index - 3), cubes: undefined };
};

model.getUpgradePrice = function(basePrice, level) {
  return {
    coins: basePrice.coins * Math.pow(2, level - 1),
    cubes: undefined, // TODO: determine formula,
    energy: level * 30000, // Labs
  };
};

model.resultMapper = discovery => {
  discovery.url = url.addHostToUrl(discovery.url);
  discovery.planet.url = url.addHostToUrl(discovery.planet.url);
  discovery.wid.url = url.addHostToUrl(discovery.wid.url);

  if (discovery.planet.name !== 'Earth') {
    /* Discovery */
    discovery.discovery.time = 90 * Math.pow(discovery.index, 2) + 1710 * discovery.index;
    discovery.discovery.boost = {
      energy: discovery.discovery.time / 6 * 10,
      cubes: discovery.discovery.time / 180
    };

    /* Upgrading */
    discovery.upgrade = {
      base_price: model.getBasePrice(discovery.index),
      time: discovery.discovery.time,
      boost: {
        energy: discovery.discovery.boost.energy,
        cubes: discovery.discovery.boost.cubes
      }
    };
    discovery.upgrade.next_price = discovery.level === 7 ? null : model.getUpgradePrice(discovery.upgrade.base_price, discovery.level);

    /* Production */
    discovery.production = {
      requirements: discovery.planet.name === 'Earth' ? null : {
        name: 'food',
        quantity: 100 + 20 * discovery.index
      }
    };
    const totalResources = Math.round(discovery.production.requirements.quantity * 6 * Math.pow(1.1, discovery.level - 1));
    discovery.production.resources = {
      name: null, // To be filled below
      quantity: totalResources
    };
    discovery.production.time = 3 * totalResources;

    discovery.population = 2 + 2 * discovery.level; // TODO: add additional population for correct satellite match
  } else {
    // discovery.population = Math.min(16, Math.floor(core.friends.length / 5));
  }

  return discovery;
};

module.exports = {
  model: model,
  schema: DiscoverySchema
};
