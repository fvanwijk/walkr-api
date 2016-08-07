var express = require('express');
var router = express.Router();

router.use(function (req, res, next) {
  console.log('Receiving request');
  next();
});

router.get('/', function (req, res) {
  return res.json({ message: 'Hello world!' });
});

module.exports = router;