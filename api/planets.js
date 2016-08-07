var router = require('../router');
var Planet = require('../models/planet');
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/planets')
    .get(CommonApi.getAll(Planet))
    .post(function (req, res) {
      var planet = new Planet();
      planet.name = 'Planeet 1';
      planet.save(function (err) {
        if (err) {
          res.send(err);
        }

        res.json({ message: 'Planet created!', planet: planet });
      });
    });

  router.route('/planets/:planet_id')
    .get(function(req, res) {
      Planet.findById(req.params.planet_id, function(err, planet) {
        if (err)
          res.send(err);
        res.json(planet);
      });
    });
};
