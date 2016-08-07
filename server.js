var express = require('express');
var app = express();
var router = require('./router');
var mongoose   = require('mongoose');
var url = require('./api/url');

mongoose.connect('mongodb://localhost:27017');
app.use('/api', router);
app.listen(url.port);
console.log(`Running Walkr API on port ${url.port}`);
