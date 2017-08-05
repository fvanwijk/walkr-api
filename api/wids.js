var router = require('../router');
var WID = require('../models/wid').model;
var Planet = require('../models/planet').model;
var Discovery = require('../models/discovery').model;
var DFRDiscovery = require('../models/dfr_discovery').model;
var Mission = require('../models/mission').model;
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
        CommonApi.projectionMapper(Object.keys(DFRDiscovery.schema.tree), ['url', 'wid', 'dfr'], 'dfrs'),
        CommonApi.projectionMapper(Object.keys(Mission.schema.tree), ['name', 'url'], 'missions')
      )
    ))
    .post(CommonApi.post(WID))
    .put(CommonApi.put(WID))
    .delete(CommonApi.delete(WID));

  router.route('/wids/:id/planets/upgrades')
    .get(function (req, res) {
      WID.findOne({ [WID.identifierField]: req.params.id }).then(wid => {
        const upgrades = wid.planets
          .filter(discovery => discovery.planet.name != 'Earth')
          .map((discovery, index) => {
            const prices = [1,2,3,4,5,6,7].map(level => {
              return Object.assign({ level }, CommonApi.getUpgradePrice(CommonApi.getBasePrice(index + 1), level));
            });

            return {
              planet: discovery.planet,
              level: discovery.level,
              prices
            };
          });

        res.json(upgrades);
      });
    });

  router.route('/wids/:id/planets/:planetid')
    .get(function (req, res) {
      const discoveryUrl = url.create('wids', req.params.id, 'planets', req.params.planetid);
      WID.findOne(
        { 'planets.url': discoveryUrl },
        { 'planets._id': false, 'planets.__v': false },
        function (err, item) {
          CommonApi.catchWrapper(err, item, res, function (res, item) {

            item.planets.sort((a, b) => a.discovery.distance < b.discovery.distance ? -1 : 1);

            const discovery = item.planets.find((discovery, i) => {
              discovery.index = i;
              return discovery.url === discoveryUrl
            });

            if (discovery.planet.name !== 'Earth') {
              /* Discovery */
              discovery.discovery.time = 90 * Math.pow(discovery.index, 2) + 1710 * discovery.index;
              discovery.discovery.boost = {
                energy: discovery.discovery.time / 6 * 10,
                cubes: discovery.discovery.time / 180
              };

              /* Upgrading */
              discovery.upgrade = {
                base_price: CommonApi.getBasePrice(discovery.index),
                time: discovery.discovery.time
              };
              discovery.upgrade.next_price = discovery.level == 7 ? null : CommonApi.getUpgradePrice(discovery.upgrade.base_price, discovery.level);

              /* Production */
              discovery.production = {
                requirements: discovery.planet.name == 'Earth' ? null : {
                  name: 'food',
                  quantity: 100 + 20 * discovery.index
                }
              };
              const totalResources = Math.round(discovery.production.requirements.quantity * 6 * Math.pow(1.1, discovery.level - 1));
              discovery.production.resources = {
                name: null, // To be filled below
                quantity: totalResources
              };
              discovery.production.time = 3 * totalResources;

              discovery.population = 2 + 2 * discovery.level; // TODO: add additional population for correct satellite match
            } else {
              // discovery.population = Math.min(16, Math.floor(core.friends.length / 5));
            }

            Planet.findOne({ code: req.params.planetid }, function (err, planet) {
              discovery.production.resources.name = planet.resource;

              res.json(discovery);
            });
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
            discovery.production = {
              resources: {
                name: 'food',
                quantity: Math.round(351 * Math.pow(1.25, discovery.level - 1))
              }
            };
            discovery.production.time = discovery.production.resources.quantity * 6;
            discovery.upgrade = {
              base_price: {
                coins: 2000
              }
            };
            discovery.upgrade.next_price = CommonApi.getUpgradePrice(discovery.upgrade.base_price, discovery.level);

            res.json(discovery);
          });
        }
      );
    });
};
