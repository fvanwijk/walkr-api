var router = require('../router');
var Level = require('../models/level');
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/levels')
    .get(CommonApi.getAll(Level))
    .post(CommonApi.postAll(Level, 'level', 'levels.json'))
    .delete(CommonApi.deleteAll(Level));

  router.route('/levels/:id')
    .get(CommonApi.get(Level, 'level'))
    .post(CommonApi.post(Level, 'level'))
    .put(CommonApi.put(Level, 'level'))
    .delete(CommonApi.delete(Level, 'level'));
};
