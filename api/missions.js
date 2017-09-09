var router = require('../router');
var Mission = require('../models/mission').model;
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/missions')
    .get(CommonApi.getAll(Mission))
    .post(CommonApi.postAll(Mission, 'missions.json'))
    .delete(CommonApi.deleteAll(Mission));

  router.route('/missions/:id')
    .get(CommonApi.get(Mission, { 'resources._id': false }))
    .post(CommonApi.post(Mission))
    .put(CommonApi.put(Mission))
    .delete(CommonApi.delete(Mission));
};
