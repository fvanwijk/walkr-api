var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CoreSchema = new Schema({
  url: String,
  level: Number,
  dfr_limits: Number,
  food_storage: Number,
  stars: Number,
  upgrade: {
    resource: String,
    quantity: Number
  }
}, { _id: false });

var core = mongoose.model('Core', CoreSchema);
core.slug = 'core';
core.identifierField = 'level';
core.nameField = 'level';

module.exports = {
  model: core,
  schema: CoreSchema
};
