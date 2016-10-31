var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MissionSchema = new Schema({
  url: String,
  id: String,
  name: String,
  resources: Array
});

var mission = mongoose.model('Mission', MissionSchema);
mission.slug = 'missions';
mission.identifierField = 'id';
mission.nameField = 'name';

module.exports = mission;
