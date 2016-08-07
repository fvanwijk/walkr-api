var router = require('../router');
var Level = require('../models/level');
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/levels')
    .get(CommonApi.getAll(Level, 'levels', 'level'))
    .post(CommonApi.postAll(Level, 'levels.json'))
    .delete(CommonApi.deleteAll(Level));

  router.route('/levels/:level')
    .get(CommonApi.get(Level, 'level', 'level'));
};
