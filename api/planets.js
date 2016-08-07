var router = require('../router');
var Planet = require('../models/planet');
var CommonApi = require('./common-api');

module.exports = function (router) {
  router.route('/planets')
    .get(CommonApi.getAll(Planet))
    .post(function (req, res) {
      Planet.remove({});
      var planets = require('../data/planets.json');
      planets.forEach(planet => {
        var model = new Planet(planet);
        model.save(function (err) {
          if (err) {
            res.send(err);
          }
        })
      });
      res.json({ message: 'Planets created!' });
    })
    .delete(function (req, res) {
      Planet.remove({}, function (err) {
        if (err) {
          res.send(err);
        }
        res.send(200);
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
