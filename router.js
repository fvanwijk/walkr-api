var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
  console.log('Request:', req.method, req.url, res.statusCode);
  next();
});

require('./api/api')(router);
require('./api/planets')(router);
require('./api/levels')(router);

module.exports = router;