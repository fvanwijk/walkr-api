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
  const addHost = url.addHostToUrl.bind(url);
  wid.url = addHost(wid.url);
  wid.missions.forEach(mission => {
    mission.url = addHost(mission.url)
  });
  wid.dfrs.forEach(dfrDiscovery => {
    dfrDiscovery.url = addHost(dfrDiscovery.url);
    dfrDiscovery.dfr.url = addHost(dfrDiscovery.dfr.url);
    dfrDiscovery.wid.url = addHost(dfrDiscovery.wid.url);
  });
  wid.planets.forEach(discovery => {
    discovery.url = addHost(discovery.url);
    discovery.planet.url = addHost(discovery.planet.url);
    discovery.wid.url = addHost(discovery.wid.url);
  });
  return wid;
};

module.exports = {
  model: wid,
  schema: WIDSchema
};
