var mongoose = require('mongoose');
var url = require('../api/url');
var Schema = mongoose.Schema;

var DFRSchema = new Schema({
  url: String,
  code: String,
  name: String
});

var dfr = mongoose.model('DFR', DFRSchema);
dfr.slug = 'dfrs';
dfr.identifierField = 'code';
dfr.nameField = 'name';
dfr.resultMapper = dfr => {
  dfr.url = url.addHostToUrl(dfr.url);
  return dfr;
};

module.exports = {
  model: dfr,
  schema: DFRSchema
};
