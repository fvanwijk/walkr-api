var router = require('../router');
var valuta = require('../models/valuta').model;
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/valuta')
    .get(CommonApi.getAll(valuta))
    .post(CommonApi.postAll(valuta, 'valuta.json'))
    .put(CommonApi.putAll(valuta, 'valuta.json'))
    .delete(CommonApi.deleteAll(valuta));

  router.route('/valuta/:id')
    .get(CommonApi.get(valuta))
    .post(CommonApi.post(valuta))
    .put(CommonApi.put(valuta))
    .delete(CommonApi.delete(valuta));
};
