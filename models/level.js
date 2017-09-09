var mongoose = require('mongoose');
var url = require('../api/url');
var Schema = mongoose.Schema;

var LevelSchema = new Schema({
  url: String,
  level: Number,
  production_rate: Number,
  description: String
});

var level = mongoose.model('Level', LevelSchema);
level.slug = 'levels';
level.identifierField = 'level';
level.nameField = 'level';
level.resultMapper = level => {
  level.url = url.addHostToUrl(level.url);
  return level;
};

module.exports = {
  model: level,
  schema: LevelSchema
};
