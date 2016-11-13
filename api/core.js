var router = require('../router');
var url = require('./url');
var Core = require('../models/core').model;

module.exports = function (router) {
  router.route('/core')
    .get((req, res) => {
      res.json(Array.from(Array(50)).map((_, i) =>
        new Core({
          level: i + 1,
          url: url.create(Core.slug, i + 1)
        })
      ));
    });

  router.route('/core/:id')
    .get((req, res) => {
      const level = +req.params.id;
      res.json(new Core({
        url: url.create(Core.slug, req.params.id),
        level: level,
        upgrade: { resource: 'coins', quantity: level > 1 ? 5400 * Math.pow(level - 3, 2) + 7350 * level - 14700 : 0 },
        dfr_limits: level + 1,
        food_storage: level * 1000,
        stars: Math.min(5, Math.floor(level / 4) + 1)
      }));
    });
};
