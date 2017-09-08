var express = require('express');
var app = express();
var router = require('./router');
var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var url = require('./api/url');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.NODE_ENV === 'production' ? process.env.MONGOLAB_URI : 'mongodb://localhost:27017');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', router);
app.get('*', function(req, res){
  res.sendStatus(404);
});
app.listen(url.port);
console.log(`Running Walkr API on port ${url.port}`);
