var router = require('../router');
var Level = require('../models/level').model;
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/levels')
    .get(CommonApi.getAll(Level))
    .post(CommonApi.postAll(Level, 'levels.json'))
    .put(CommonApi.putAll(Level, 'levels.json'))
    .delete(CommonApi.deleteAll(Level));

  router.route('/levels/:id')
    .get(CommonApi.get(Level))
    .post(CommonApi.post(Level))
    .put(CommonApi.put(Level))
    .delete(CommonApi.delete(Level));
};
