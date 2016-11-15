var router = require('../router');
var Ship = require('../models/ship').model;
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/ships')
    .get(CommonApi.getAll(Ship))
    .post(CommonApi.postAll(Ship, 'ships.json'))
    .delete(CommonApi.deleteAll(Ship));

  const excludeVariantFields = Object.keys(Ship.schema.tree.variants[0]).concat('_id').reduce((acc, field) => {
    if (['id', 'paint', 'url'].indexOf(field) === -1) {
      acc['variants.' + field] = false;
    }
    return acc;
  }, {});

  router.route('/ships/:id')
    .get(CommonApi.get(Ship, excludeVariantFields))
    .post(CommonApi.post(Ship))
    .put(CommonApi.put(Ship))
    .delete(CommonApi.delete(Ship));

  router.route('/ships/:id/:variant')
    .get(function (req, res) {
      Ship.findOne(
        { id: req.params.id, 'variants.id': req.params.variant },
        { _id: false },
        function (err, item) {
          CommonApi.catchWrapper(err, item, res, function (res, item) {
            res.json(item.variants.find(variant => { return variant.id === req.params.variant }));
          });
        }
      );
    })
};
