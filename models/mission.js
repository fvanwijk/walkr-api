var mongoose = require('mongoose');
var url = require('../api/url');
var Schema = mongoose.Schema;

var MissionSchema = new Schema({
  url: String,
  id: String,
  name: String,
  resources: [{
    name: String,
    quantity: Number
  }],
  cubes: Number
});

var mission = mongoose.model('Mission', MissionSchema);
mission.slug = 'missions';
mission.identifierField = 'id';
mission.nameField = 'name';
mission.resultMapper = mission => {
  mission.url = url.addHostToUrl(mission.url);
  return mission;
};

module.exports = {
  model: mission,
  schema: MissionSchema
};
