var mongoose = require('mongoose');
var url = require('../api/url');
var Schema = mongoose.Schema;

var ValutaSchema = new Schema({
  url: String,
  id: Number,
  name: String,
  description: String
});

var valuta = mongoose.model('Valuta', ValutaSchema);
valuta.slug = 'valuta';
valuta.identifierField = 'id';
valuta.nameField = 'name';
valuta.resultMapper = valuta => {
  valuta.url = url.addHostToUrl(valuta.url);
  return valuta;
};

module.exports = {
  model: valuta,
  schema: ValutaSchema
};
