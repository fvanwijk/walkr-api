var router = require('../router');
var Satellite = require('../models/satellite').model;
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/satellites')
    .get(CommonApi.getAll(Satellite))
    .post(CommonApi.postAll(Satellite, 'satellites.json'))
    .put(CommonApi.putAll(Satellite, 'satellites.json'))
    .delete(CommonApi.deleteAll(Satellite));

  router.route('/satellites/:id')
    .get(CommonApi.get(Satellite, { 'planet._id': false }))
    .post(CommonApi.post(Satellite))
    .put(CommonApi.put(Satellite))
    .delete(CommonApi.delete(Satellite));
};
