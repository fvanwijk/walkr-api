var router = require('../router');
var WID = require('../models/wid').model;
var Planet = require('../models/planet').model;
var Discovery = require('../models/discovery').model;
var DFRDiscovery = require('../models/dfr_discovery').model;
var Mission = require('../models/mission').model;
var CommonApi = require('./common-api');
var url = require('./url');
const rewards = require('../data/rewards.json');

function byUrl(discoveryUrl) {
  return (discovery, i) => {
    discovery.index = i;
    return discovery.url === discoveryUrl
  }
}

module.exports = function (router) {
  router.route('/wids')
    .get(CommonApi.getAll(WID))
    .post(CommonApi.postAll(WID, 'wids.json'))
    .put(CommonApi.putAll(WID, 'wids.json'))
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
    .get(function (req, res, next) {
      WID.findOne({ [WID.identifierField]: req.params.id })
        .then(wid => {
          if (wid === null) {
            next({ status: 404 })
          } else {
            const upgrades = wid.planets
              .filter(discovery => discovery.planet.name !== 'Earth')
              .map((discovery, index) => {
                const prices = [1,2,3,4,5,6,7].map(level =>
                  ({ level, ...Discovery.getUpgradePrice(Discovery.getBasePrice(index + 1), level) }));

                return {
                  planet: discovery.planet,
                  level: discovery.level,
                  prices
                };
              });

            res.json(upgrades);
          }
        })
        .catch(next)
    });

  router.route('/wids/:id/planets/:planetid')
    .get(function (req, res, next) {
      const discoveryUrl = url.create('wids', req.params.id, 'planets', req.params.planetid);
      WID.findOne(
        { 'planets.url': discoveryUrl }, // Still returns the whole WID
        { 'planets._id': false, 'planets.__v': false }
      )
        .then(wid => {
          if (wid === null) {
            next({ status: 404 });
          } else {
            let discovery = wid.planets.find((discovery, i) => {
              //discovery.index = i;
              return discovery.url === discoveryUrl
            });

            discovery = Discovery.resultMapper(discovery);

            Planet.findOne({ [Planet.identifierField]: req.params.planetid })
              .then(planet => {
                discovery.production.resources.name = planet.resource;
                res.json(discovery);
              });
          }
        })
        .catch(next);
    })
    .post((req, res) => {
      return WID.findOne(
        { [WID.identifierField]: req.params.id}, { '_id': false }
        , (err, item) => {
          return CommonApi.catchWrapper(err, item, res, function (res, wid) {
            const discoveryUrl = url.create('wids', req.params.id, 'planets', req.params.planetid);
            if (wid.planets.find(planet => planet.url === discoveryUrl)) {
              res.status(302).send('Bestaat al');
            } else {
              Planet.findOne({ [Planet.identifierField]: req.params.planetid })
                .exec((err, planet) => {
                  if (planet) {
                    const newDiscovery = new Discovery({
                      url: discoveryUrl,
                      level: 1,
                      discovery: {
                        date: req.body.discovery.date,
                        distance: req.body.discovery.distance
                      },
                      planet: { url: planet.url, name: planet.name },
                      wid: { url: wid.url, name: wid.name },
                      index: item.planets.length
                    });

                    wid.planets.push(newDiscovery);
                    wid.save().then(savedWid => {
                      res.json(savedWid.planets)
                    });
                  } else {
                    res.status(404).json(`Planet ${req.params.planetid} does not exist`);
                  }
                });
            }
          })
        });
    })
    .put((req, res) => {
      const discoveryUrl = url.create('wids', req.params.id, 'planets', req.params.planetid);
      return WID.findOne(
        { 'planets.url': discoveryUrl }, // Still returns the whole WID
        { 'planets._id': false, 'planets.__v': false }
          , (err, wid) => {
        return CommonApi.catchWrapper(err, wid, res, function (res, item) {
          const discovery = item.planets.find(byUrl(discoveryUrl));

          // For now only allow to modify some properties
          discovery.index = req.body.index;
          discovery.level = req.body.level;
          discovery.discovery.date = req.body.discovery.date;
          discovery.discovery.distance = req.body.discovery.distance;
          // TODO: planet

          wid.save((err, savedWid) => {
            const savedDiscovery = savedWid.planets.find(byUrl(discoveryUrl));

            res.json(Discovery.resultMapper(savedDiscovery));
          });
        });
      });
    });

  router.route('/wids/:id/dfrs/:dfrid')
    .get(function (req, res) {
      WID.findOne(
        { 'dfrs.id': req.params.dfrid },
        { 'dfrs._id': false, 'dfrs.__v': false },
        function (err, item) {
          CommonApi.catchWrapper(err, item, res, function (res, item) {

            let discovery = item.dfrs.find(discovery => {
              return discovery.id === +req.params.dfrid;
            });

            discovery = DFRDiscovery.resultMapper(discovery);
            res.json(discovery);
          });
        }
      );
    });

  router.route('/wids/:id/rewards')
    .get(function (req, res) {
      res.json(rewards.map(row => {
        const energy = row.energy * 41.86242;
        const coins = row.coins * 1.04566;
        const food = row.food * 20.91321;
        const resources = row.resources * 20.91321;
        const total = energy + coins + food + resources;

        return ({
          ...row,
          reward: {
            energy,
            coins,
            food,
            resources,
            total
          },
          percentage: total / 30000000 * 100
        });
      }));
    });
};
