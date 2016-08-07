var router = require('../router');
var Planet = require('../models/planet');
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/planets')
    .get(CommonApi.getAll(Planet))
    .post(CommonApi.postAll(Planet, 'code', 'planets.json'))
    .delete(CommonApi.deleteAll(Planet));

  router.route('/planets/:id')
    .get(CommonApi.get(Planet, 'code'))
    .post(CommonApi.post(Planet, 'code'))
    .put(CommonApi.put(Planet, 'code'))
    .delete(CommonApi.delete(Planet, 'code'));
};
