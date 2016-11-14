var router = require('../router');
var Ship = require('../models/ship').model;
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/ships')
    .get(CommonApi.getAll(Ship))
    .post(CommonApi.postAll(Ship, 'ships.json'))
    .delete(CommonApi.deleteAll(Ship));

  router.route('/ships/:id')
    .get(CommonApi.get(Ship, { 'variants._id': false }))
    .post(CommonApi.post(Ship))
    .put(CommonApi.put(Ship))
    .delete(CommonApi.delete(Ship));
};
