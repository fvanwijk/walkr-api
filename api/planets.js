var router = require('../router');
var Planet = require('../models/planet').model;
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/planets')
    .get(CommonApi.getAll(Planet))
    .post(CommonApi.postAll(Planet, 'planets.json'))
    .put(CommonApi.putAll(Planet, 'planets.json'))
    .delete(CommonApi.deleteAll(Planet));

  router.route('/planets/:id')
    .get(CommonApi.get(Planet, { 'satellites_l1._id': false, 'satellites_l2._id': false }))
    .post(CommonApi.post(Planet))
    .put(CommonApi.put(Planet))
    .delete(CommonApi.delete(Planet));
};
