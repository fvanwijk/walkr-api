var router = require('../router');
var epic = require('../models/epic').model;
var Planet = require('../models/planet').model;
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/epics')
    .get(CommonApi.getAll(epic))
    .post(CommonApi.postAll(epic, 'epics.json'))
    .put(CommonApi.putAll(epic, 'epics.json'))
    .delete(CommonApi.deleteAll(epic));

  const projectionMap = Object.assign({
      'rounds._id': false,
      'rounds.subrounds._id': false,
      'rounds.subrounds.donation._id': false,
      'rounds.choices._id': false,
      'rounds.choices.rounds._id': false,
      'rounds.choices.rounds.subrounds._id': false,
      'rounds.choices.rounds.subrounds.donation._id': false
    },
    CommonApi.projectionMapper(Object.keys(Planet.schema.tree), ['url', 'name'], 'rewards.galaxy_map')
  );

  router.route('/epics/:id')
    .get(CommonApi.get(epic, projectionMap))
    .post(CommonApi.post(epic))
    .put(CommonApi.put(epic))
    .delete(CommonApi.delete(epic));
};
