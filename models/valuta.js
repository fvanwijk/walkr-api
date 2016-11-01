var mongoose = require('mongoose');
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

module.exports = {
  model: valuta,
  schema: ValutaSchema
};
