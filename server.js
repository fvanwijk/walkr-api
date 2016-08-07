var express = require('express');
var app = express();
var router = require('./router');
var mongoose   = require('mongoose');
var port = process.env.PORT || 1337;

mongoose.connect('mongodb://localhost:27017');
app.use('/api', router);
app.listen(port);
console.log(`Running Walkr API on port ${port}`);
