var mongoose = require('mongoose');
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

module.exports = dfr;
