var router = require('../router');
var epic = require('../models/epic').model;
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/epics')
    .get(CommonApi.getAll(epic))
    .post(CommonApi.postAll(epic, 'epics.json'))
    .delete(CommonApi.deleteAll(epic));

  router.route('/epics/:id')
    .get(CommonApi.get(epic))
    .post(CommonApi.post(epic))
    .put(CommonApi.put(epic))
    .delete(CommonApi.delete(epic));
};
