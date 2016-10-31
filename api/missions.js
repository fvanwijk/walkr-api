var router = require('../router');
var mission = require('../models/mission');
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/missions')
    .get(CommonApi.getAll(mission))
    .post(CommonApi.postAll(mission, 'missions.json'))
    .delete(CommonApi.deleteAll(mission));

  router.route('/missions/:id')
    .get(CommonApi.get(mission))
    .post(CommonApi.post(mission))
    .put(CommonApi.put(mission))
    .delete(CommonApi.delete(mission));
};
