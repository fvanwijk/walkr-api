var router = require('../router');
var url = require('./url');
var baseUrl = `${url.host}:${url.port}/api`;

module.exports = function (router) {
  router.route('/')
    .get(function (req, res) {
      res.json({
        core: `${baseUrl}/core/`,
        planets: `${baseUrl}/planets/`,
        levels: `${baseUrl}/levels/`,
        dfrs: `${baseUrl}/dfrs/`,
        satellites: `${baseUrl}/satellites/`,
        missions: `${baseUrl}/missions/`,
        epics: `${baseUrl}/epics/`,
        valuta: `${baseUrl}/valuta/`
      });
    });
};
