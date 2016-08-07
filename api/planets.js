var router = require('../router');
var Planet = require('../models/planet');
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/planets')
    .get(CommonApi.getAll(Planet))
    .post(CommonApi.postAll(Planet, 'planets.json'))
    .delete(CommonApi.deleteAll(Planet));

  router.route('/planets/:planet_code')
    .get(CommonApi.get(Planet, 'code', 'planet_code'));
};
