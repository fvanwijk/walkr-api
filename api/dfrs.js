var router = require('../router');
var DFR = require('../models/dfr');
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/dfrs')
    .get(CommonApi.getAll(DFR))
    .post(CommonApi.postAll(DFR, 'dfrs.json'))
    .delete(CommonApi.deleteAll(DFR));

  router.route('/dfrs/:id')
    .get(CommonApi.get(DFR))
    .post(CommonApi.post(DFR))
    .put(CommonApi.put(DFR))
    .delete(CommonApi.delete(DFR));
};
