var mongoose = require('mongoose');

var url = require('../api/url');
const Planet = require('./planet');
var Schema = mongoose.Schema;

var EpicSchema = new Schema({
  url: String,
  id: Number,
  name: String,
  description: String,
  requirements: Number,
  members: { min: Number, max: Number },
  rewards: { coins: Number, galaxy_map: Planet.schema, cubes: Number },
  donations: { energy: Number, coins: Number, food: Number, resources: Number },
  rounds: [{
    name: String,
    subrounds: [{
      round_type: String, // When 'type' is used, mongoose schema is confused
      donation: [{
        name: String,
        quantity: [Number]
      }],
      choices: [String]
    }],
    choices: [{
      rounds: [{
        name: String,
        subrounds: [{
          round_type: String,
          donation: [{
            name: String,
            quantity: [Number]
          }]
        }]
      }]
    }]
  }]
});

var epic = mongoose.model('Epic', EpicSchema);
epic.slug = 'epics';
epic.identifierField = 'id';
epic.nameField = 'name';
epic.resultMapper = epic => {
  epic.url = url.addHostToUrl(epic.url);
  return epic;
};

module.exports = {
  model: epic,
  schema: EpicSchema
};
