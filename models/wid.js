var mongoose = require('mongoose');
var url = require('../api/url');
var Schema = mongoose.Schema;
const Discovery = require('./discovery');
const DFRDiscovery = require('./dfr_discovery');
const Mission = require('./mission');

var WIDSchema = new Schema({
  url: String,
  wid: String,
  name: String,
  title: String,
  level: Number,
  planets: [Discovery.schema],
  dfrs: [DFRDiscovery.schema],
  missions: [Mission.schema]
});

var wid = mongoose.model('WID', WIDSchema);
wid.slug = 'wids';
wid.identifierField = 'wid';
wid.nameField = 'name';
wid.resultMapper = wid => {
  wid.url = url.addHostToUrl(wid.url);
  wid.missions.forEach(Mission.model.resultMapper);
  wid.dfrs.forEach(DFRDiscovery.model.resultMapper);
  wid.planets.forEach(Discovery.model.resultMapper);
  return wid;
};

module.exports = {
  model: wid,
  schema: WIDSchema
};
