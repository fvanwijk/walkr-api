var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
  console.log('Request:', req.method, req.url, res.statusCode);
  next();
});

require('./api/api')(router);
require('./api/core')(router);
require('./api/planets')(router);
require('./api/levels')(router);
require('./api/dfrs')(router);
require('./api/satellites')(router);
require('./api/missions')(router);
require('./api/epics')(router);
require('./api/valuta')(router);

module.exports = router;