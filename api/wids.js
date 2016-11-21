var router = require('../router');
var WID = require('../models/wid').model;
var Discovery = require('../models/discovery').model;
var DFRDiscovery = require('../models/dfr_discovery').model;
var CommonApi = require('./common-api');
var url = require('./url');

module.exports = function (router) {
  router.route('/wids')
    .get(CommonApi.getAll(WID))
    .post(CommonApi.postAll(WID, 'wids.json'))
    .delete(CommonApi.deleteAll(WID));

  router.route('/wids/:id')
    .get(CommonApi.get(WID, Object.assign(
        CommonApi.projectionMapper(Object.keys(Discovery.schema.tree), ['url', 'wid', 'planet'], 'planets'),
        CommonApi.projectionMapper(Object.keys(DFRDiscovery.schema.tree), ['url', 'wid', 'dfr'], 'dfrs')
      )
    ))
    .post(CommonApi.post(WID))
    .put(CommonApi.put(WID))
    .delete(CommonApi.delete(WID));

  router.route('/wids/:id/planets/:planetid')
    .get(function (req, res) {
      const discoveryUrl = url.create('wids', req.params.id, 'planets', req.params.planetid);
      WID.findOne(
        { 'planets.url': discoveryUrl },
        { 'planets._id': false, 'planets.__v': false },
        function (err, item) {
          CommonApi.catchWrapper(err, item, res, function (res, item) {

            item.planets.sort((a, b) => a.distance < b.distance ? -1 : 1);

            const discovery = item.planets.find((discovery, i) => {
              discovery.index = i;
              return discovery.url === discoveryUrl
            });

            discovery.base_price = {
              name: 'coins',
              quantity: 300 * Math.pow(discovery.index, 2) - 150 * discovery.index
            };
            discovery.next_upgrade_price = CommonApi.getUpgradePrice(discovery.base_price.quantity, discovery.level);

            res.json(discovery);
          });
        }
      );
    });

  router.route('/wids/:id/dfrs/:dfrid')
    .get(function (req, res) {
      WID.findOne(
        { 'dfrs.id': req.params.dfrid },
        { 'dfrs._id': false, 'dfrs.__v': false },
        function (err, item) {
          CommonApi.catchWrapper(err, item, res, function (res, item) {
            const discovery = item.dfrs.find(discovery => { return discovery.id == req.params.dfrid });
            discovery.resource_value = {
              name: 'food',
              quantity: Math.round(351 * Math.pow(1.25, discovery.level - 1))
            };
            discovery.next_upgrade_price = CommonApi.getUpgradePrice(discovery.base_price.quantity, discovery.level);
            res.json(discovery);
          });
        }
      );
    });
};
