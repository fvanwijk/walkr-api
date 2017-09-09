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
  wid.missions.forEach(url.addHostToUrl.bind(url));
  wid.dfrs.forEach(dfrDiscovery => {
    dfrDiscovery = addHost(dfrDiscovery);
    dfrDiscovery.dfr = addHost(dfrDiscovery.dfr);
    dfrDiscovery.wid = addHost(dfrDiscovery.wid);
  });
  wid.planets.forEach(discovery => {
    discovery = addHost(discovery);
    discovery.planet = addHost(discovery.planet);
    discovery.wid = addHost(discovery.wid);
  });
  return wid;
};

module.exports = {
  model: wid,
  schema: WIDSchema
};
