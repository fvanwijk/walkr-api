var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Discovery = require('./discovery');
const DFRDiscovery = require('./dfr_discovery');

var WIDSchema = new Schema({
  url: String,
  wid: String,
  name: String,
  title: String,
  level: Number,
  planets: [Discovery.schema],
  dfrs: [DFRDiscovery.schema]
});

var wid = mongoose.model('WID', WIDSchema);
wid.slug = 'wids';
wid.identifierField = 'wid';
wid.nameField = 'name';

module.exports = {
  model: wid,
  schema: WIDSchema
};
