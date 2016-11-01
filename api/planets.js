var router = require('../router');
var Planet = require('../models/planet').model;
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/planets')
    .get(CommonApi.getAll(Planet))
    .post(CommonApi.postAll(Planet, 'planets.json'))
    .delete(CommonApi.deleteAll(Planet));

  router.route('/planets/:id')
    .get(CommonApi.get(Planet))
    .post(CommonApi.post(Planet))
    .put(CommonApi.put(Planet))
    .delete(CommonApi.delete(Planet));
};
