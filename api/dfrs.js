var router = require('../router');
var DFR = require('../models/dfr');
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/dfrs')
    .get(CommonApi.getAll(DFR))
    .post(CommonApi.postAll(DFR, 'code', 'dfrs.json'))
    .delete(CommonApi.deleteAll(DFR));

  router.route('/dfrs/:id')
    .get(CommonApi.get(DFR, 'code'))
    .post(CommonApi.post(DFR, 'code'))
    .put(CommonApi.put(DFR, 'code'))
    .delete(CommonApi.delete(DFR, 'code'));
};
