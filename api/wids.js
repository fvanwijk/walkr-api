var router = require('../router');
var WID = require('../models/wid').model;
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/wids')
    .get(CommonApi.getAll(WID))
    .post(CommonApi.postAll(WID, 'wids.json'))
    .delete(CommonApi.deleteAll(WID));

  router.route('/wids/:id')
    .get(CommonApi.get(WID, { 'planets._id': false }))
    .post(CommonApi.post(WID))
    .put(CommonApi.put(WID))
    .delete(CommonApi.delete(WID));
};
